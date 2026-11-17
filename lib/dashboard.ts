import { consultar } from "./db";
import type { DatosDashboard, Opcion } from "./tipos";

export interface ParamsDashboard {
  desde: string | null; // 'YYYY-MM-01'
  hasta: string | null; // 'YYYY-MM-01' (se incluye todo ese mes)
  ciudad: number | null;
  categoria: number | null;
  vendedor: number | null;
}

/**
 * Base común de todos los indicadores: una fila por línea de venta con su ingreso y utilidad.
 * Todos los filtros llegan como parámetros ($1..$5): nunca se concatena texto del usuario en el SQL.
 */
const LINEAS = `
WITH lineas AS (
  SELECT v.id_venta, v.fecha_venta, v.id_ciudad, v.id_cliente, v.id_vendedor,
         p.id_producto, p.nombre AS producto,
         ca.id_categoria, ca.nombre AS categoria,
         d.cantidad,
         d.cantidad * d.precio_unitario                AS ingreso,
         d.cantidad * (d.precio_unitario - p.costo)    AS utilidad
  FROM ventas v
  JOIN detalle_venta d ON d.id_venta     = v.id_venta
  JOIN productos p     ON p.id_producto  = d.id_producto
  JOIN categorias ca   ON ca.id_categoria = p.id_categoria
  WHERE ($1::date IS NULL OR v.fecha_venta >= $1::date)
    AND ($2::date IS NULL OR v.fecha_venta <  ($2::date + interval '1 month'))
    AND ($3::int  IS NULL OR v.id_ciudad     = $3::int)
    AND ($4::int  IS NULL OR ca.id_categoria = $4::int)
    AND ($5::int  IS NULL OR v.id_vendedor   = $5::int)
)`;

const SQL = {
  kpis: `${LINEAS}
    SELECT COALESCE(SUM(ingreso), 0)  AS ingresos,
           COALESCE(SUM(utilidad), 0) AS utilidad,
           COUNT(DISTINCT id_venta)   AS ventas,
           COUNT(DISTINCT id_cliente) AS clientes,
           COALESCE(SUM(cantidad), 0) AS unidades
    FROM lineas`,

  mensual: `${LINEAS}
    SELECT TO_CHAR(m.mes, 'YYYY-MM')       AS mes,
           COALESCE(SUM(l.ingreso), 0)     AS ingresos,
           COALESCE(SUM(l.utilidad), 0)    AS utilidad
    FROM (
      SELECT generate_series(date_trunc('month', MIN(fecha_venta)),
                             date_trunc('month', MAX(fecha_venta)),
                             interval '1 month') AS mes
      FROM ventas
    ) m
    LEFT JOIN lineas l ON date_trunc('month', l.fecha_venta) = m.mes
    GROUP BY m.mes
    ORDER BY m.mes`,

  ciudades: `${LINEAS}
    SELECT c.id_ciudad AS id, c.nombre,
           c.latitud::float8 AS lat, c.longitud::float8 AS lon,
           COALESCE(SUM(l.ingreso), 0)   AS ingresos,
           COUNT(DISTINCT l.id_venta)    AS ventas,
           COALESCE(SUM(l.utilidad), 0)  AS utilidad
    FROM ciudades c
    LEFT JOIN lineas l ON l.id_ciudad = c.id_ciudad
    GROUP BY c.id_ciudad, c.nombre, c.latitud, c.longitud
    ORDER BY ingresos DESC, c.nombre`,

  categorias: `${LINEAS}
    SELECT ca.id_categoria AS id, ca.nombre,
           COALESCE(SUM(l.ingreso), 0)  AS ingresos,
           COALESCE(SUM(l.utilidad), 0) AS utilidad
    FROM categorias ca
    LEFT JOIN lineas l ON l.id_categoria = ca.id_categoria
    GROUP BY ca.id_categoria, ca.nombre
    ORDER BY ingresos DESC, ca.nombre`,

  vendedores: `${LINEAS}
    SELECT ve.id_vendedor AS id, ve.nombre,
           COALESCE(SUM(l.ingreso), 0) AS ingresos,
           COUNT(DISTINCT l.id_venta)  AS ventas
    FROM vendedores ve
    LEFT JOIN lineas l ON l.id_vendedor = ve.id_vendedor
    GROUP BY ve.id_vendedor, ve.nombre
    ORDER BY ingresos DESC, ve.nombre`,

  productos: `${LINEAS}
    SELECT id_producto AS id, producto AS nombre, categoria,
           SUM(ingreso) AS ingresos, SUM(cantidad) AS unidades
    FROM lineas
    GROUP BY id_producto, producto, categoria
    ORDER BY ingresos DESC
    LIMIT 8`,
};

/** Segmentación de clientes (misma lógica de la consulta 7 del documento). No depende de los filtros. */
const SQL_PREMIUM = `
WITH cliente AS (
    SELECT cl.id_cliente, cl.nombre, ci.nombre AS ciudad,
           COUNT(DISTINCT v.id_venta) AS num_compras,
           SUM(d.cantidad * d.precio_unitario) AS gasto_total,
           MAX(v.fecha_venta) AS ultima_compra
    FROM clientes cl
    JOIN ciudades ci     ON ci.id_ciudad = cl.id_ciudad
    JOIN ventas v        ON v.id_cliente = cl.id_cliente
    JOIN detalle_venta d ON d.id_venta   = v.id_venta
    GROUP BY cl.id_cliente, cl.nombre, ci.nombre
),
referencia AS (
    SELECT AVG(gasto_total) AS gasto_promedio,
           (SELECT MAX(fecha_venta) FROM ventas) AS fecha_corte
    FROM cliente
),
puntos AS (
    SELECT c.*, r.gasto_promedio, r.fecha_corte,
           (c.gasto_total > r.gasto_promedio)::int
         + (c.num_compras >= 2)::int
         + (c.ultima_compra >= r.fecha_corte - 90)::int AS puntaje
    FROM cliente c CROSS JOIN referencia r
)
SELECT nombre AS cliente, ciudad, num_compras AS compras, gasto_total AS gasto,
       ultima_compra AS ultima, puntaje,
       CASE puntaje WHEN 3 THEN 'Premium' WHEN 2 THEN 'Potencial premium' ELSE 'Estándar' END AS segmento,
       gasto_promedio, fecha_corte
FROM puntos
ORDER BY puntaje DESC, gasto_total DESC`;

const SQL_OPCIONES = {
  ciudades: `SELECT id_ciudad AS id, nombre FROM ciudades ORDER BY nombre`,
  categorias: `SELECT id_categoria AS id, nombre FROM categorias ORDER BY nombre`,
  vendedores: `SELECT id_vendedor AS id, nombre FROM vendedores ORDER BY nombre`,
  meses: `SELECT DISTINCT TO_CHAR(date_trunc('month', fecha_venta), 'YYYY-MM') AS mes FROM ventas ORDER BY 1`,
};

type Fila = Record<string, number | string>;

export async function obtenerDashboard(f: ParamsDashboard): Promise<DatosDashboard> {
  const p = [f.desde, f.hasta, f.ciudad, f.categoria, f.vendedor];

  const [kpis, mensual, ciudades, categorias, vendedores, productos, premium, oCiudades, oCategorias, oVendedores, oMeses] =
    await Promise.all([
      consultar<Fila>(SQL.kpis, p),
      consultar<Fila>(SQL.mensual, p),
      consultar<Fila>(SQL.ciudades, p),
      consultar<Fila>(SQL.categorias, p),
      consultar<Fila>(SQL.vendedores, p),
      consultar<Fila>(SQL.productos, p),
      consultar<Fila>(SQL_PREMIUM),
      consultar<Opcion>(SQL_OPCIONES.ciudades),
      consultar<Opcion>(SQL_OPCIONES.categorias),
      consultar<Opcion>(SQL_OPCIONES.vendedores),
      consultar<{ mes: string }>(SQL_OPCIONES.meses),
    ]);

  const k = kpis[0];
  const ingresos = Number(k.ingresos);
  const utilidad = Number(k.utilidad);
  const ventas = Number(k.ventas);

  const ciudadesNum = ciudades.map((c) => ({
    id: Number(c.id),
    nombre: String(c.nombre),
    lat: Number(c.lat),
    lon: Number(c.lon),
    ingresos: Number(c.ingresos),
    ventas: Number(c.ventas),
    utilidad: Number(c.utilidad),
  }));

  const vendedoresNum = vendedores.map((v) => ({
    id: Number(v.id),
    nombre: String(v.nombre),
    ingresos: Number(v.ingresos),
    ventas: Number(v.ventas),
    ticket: Number(v.ventas) > 0 ? Number(v.ingresos) / Number(v.ventas) : 0,
  }));

  const ciudadesConVentas = ciudadesNum.filter((c) => c.ingresos > 0);
  const vendedoresConVentas = vendedoresNum.filter((v) => v.ventas > 0);

  const premiumFilas = premium.map((r) => ({
    cliente: String(r.cliente),
    ciudad: String(r.ciudad),
    compras: Number(r.compras),
    gasto: Number(r.gasto),
    ultima: String(r.ultima),
    puntaje: Number(r.puntaje),
    segmento: String(r.segmento) as DatosDashboard["premium"][number]["segmento"],
  }));
  const totalGlobal = premiumFilas.reduce((s, c) => s + c.gasto, 0);
  const soloPremium = premiumFilas.filter((c) => c.segmento === "Premium");
  const ingresosPremium = soloPremium.reduce((s, c) => s + c.gasto, 0);

  return {
    kpis: {
      ingresos,
      utilidad,
      margenPct: ingresos > 0 ? (utilidad / ingresos) * 100 : 0,
      ventas,
      ticket: ventas > 0 ? ingresos / ventas : 0,
      clientes: Number(k.clientes),
      unidades: Number(k.unidades),
    },
    mensual: mensual.map((m) => ({ mes: String(m.mes), ingresos: Number(m.ingresos), utilidad: Number(m.utilidad) })),
    ciudades: ciudadesNum,
    categorias: categorias.map((c) => {
      const ing = Number(c.ingresos);
      const uti = Number(c.utilidad);
      return {
        id: Number(c.id),
        nombre: String(c.nombre),
        ingresos: ing,
        utilidad: uti,
        margenPct: ing > 0 ? (uti / ing) * 100 : 0,
        participacionPct: ingresos > 0 ? (ing / ingresos) * 100 : 0,
      };
    }),
    vendedores: vendedoresNum,
    productos: productos.map((r) => ({
      id: Number(r.id),
      nombre: String(r.nombre),
      categoria: String(r.categoria),
      ingresos: Number(r.ingresos),
      unidades: Number(r.unidades),
    })),
    promedios: {
      ingresosPorCiudad: ciudadesConVentas.length ? ciudadesConVentas.reduce((s, c) => s + c.ingresos, 0) / ciudadesConVentas.length : 0,
      ticketPorVendedor: vendedoresConVentas.length ? ingresos / ventas : 0,
    },
    premium: premiumFilas,
    premiumResumen: {
      clientes: soloPremium.length,
      ingresos: ingresosPremium,
      participacionPct: totalGlobal > 0 ? (ingresosPremium / totalGlobal) * 100 : 0,
      gastoPromedio: Number(premium[0]?.gasto_promedio ?? 0),
      fechaCorte: String(premium[0]?.fecha_corte ?? ""),
    },
    opciones: {
      ciudades: oCiudades,
      categorias: oCategorias,
      vendedores: oVendedores,
      meses: oMeses.map((m) => m.mes),
    },
  };
}
