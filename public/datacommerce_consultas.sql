-- =====================================================
-- DataCommerce Analytics S.A.S. - Consultas de análisis
-- Motor: PostgreSQL (Supabase)
-- Ejecutar DESPUÉS del script de creación e inserción de datos
-- Valor de una línea de venta = cantidad * precio_unitario
-- =====================================================


-- -----------------------------------------------------
-- C1. Total vendido por ciudad
-- (ciudad donde se realizó la venta: ventas.id_ciudad)
-- -----------------------------------------------------
SELECT c.nombre AS ciudad,
       SUM(d.cantidad * d.precio_unitario) AS total_vendido
FROM ventas v
JOIN ciudades c       ON c.id_ciudad = v.id_ciudad
JOIN detalle_venta d  ON d.id_venta  = v.id_venta
GROUP BY c.nombre
ORDER BY total_vendido DESC;


-- -----------------------------------------------------
-- C2. Top 3 vendedores con mayores ingresos
-- -----------------------------------------------------
SELECT ve.nombre AS vendedor,
       COUNT(DISTINCT v.id_venta) AS num_ventas,
       SUM(d.cantidad * d.precio_unitario) AS ingresos
FROM vendedores ve
JOIN ventas v        ON v.id_vendedor = ve.id_vendedor
JOIN detalle_venta d ON d.id_venta    = v.id_venta
GROUP BY ve.id_vendedor, ve.nombre
ORDER BY ingresos DESC
LIMIT 3;


-- -----------------------------------------------------
-- C3. Categoría más rentable
-- Rentabilidad = utilidad = cantidad * (precio_unitario - costo)
-- -----------------------------------------------------
SELECT ca.nombre AS categoria,
       SUM(d.cantidad * d.precio_unitario) AS ingresos,
       SUM(d.cantidad * (d.precio_unitario - p.costo)) AS utilidad,
       ROUND(100.0 * SUM(d.cantidad * (d.precio_unitario - p.costo))
                   / SUM(d.cantidad * d.precio_unitario), 1) AS margen_pct
FROM detalle_venta d
JOIN productos p   ON p.id_producto  = d.id_producto
JOIN categorias ca ON ca.id_categoria = p.id_categoria
GROUP BY ca.nombre
ORDER BY utilidad DESC;


-- -----------------------------------------------------
-- C4. Promedio de ventas por vendedor
-- (valor promedio de cada venta que realiza el vendedor)
-- -----------------------------------------------------
SELECT ve.nombre AS vendedor,
       COUNT(*) AS num_ventas,
       ROUND(AVG(t.total_venta), 0) AS promedio_por_venta
FROM (
    SELECT v.id_venta, v.id_vendedor,
           SUM(d.cantidad * d.precio_unitario) AS total_venta
    FROM ventas v
    JOIN detalle_venta d ON d.id_venta = v.id_venta
    GROUP BY v.id_venta, v.id_vendedor
) t
JOIN vendedores ve ON ve.id_vendedor = t.id_vendedor
GROUP BY ve.id_vendedor, ve.nombre
ORDER BY promedio_por_venta DESC;


-- -----------------------------------------------------
-- C5. Productos cuyo valor total vendido supera el promedio general
-- (subconsulta: promedio del valor vendido por producto)
-- -----------------------------------------------------
SELECT p.nombre AS producto,
       SUM(d.cantidad * d.precio_unitario) AS valor_vendido
FROM detalle_venta d
JOIN productos p ON p.id_producto = d.id_producto
GROUP BY p.id_producto, p.nombre
HAVING SUM(d.cantidad * d.precio_unitario) > (
    SELECT AVG(tp.total)
    FROM (
        SELECT SUM(cantidad * precio_unitario) AS total
        FROM detalle_venta
        GROUP BY id_producto
    ) tp
)
ORDER BY valor_vendido DESC;


-- -----------------------------------------------------
-- C6. Ciudades con ventas superiores al promedio nacional
-- (subconsulta: promedio de ventas por ciudad)
-- -----------------------------------------------------
SELECT c.nombre AS ciudad,
       SUM(d.cantidad * d.precio_unitario) AS total_vendido
FROM ventas v
JOIN ciudades c      ON c.id_ciudad = v.id_ciudad
JOIN detalle_venta d ON d.id_venta  = v.id_venta
GROUP BY c.id_ciudad, c.nombre
HAVING SUM(d.cantidad * d.precio_unitario) > (
    SELECT AVG(tc.total)
    FROM (
        SELECT SUM(d2.cantidad * d2.precio_unitario) AS total
        FROM ventas v2
        JOIN detalle_venta d2 ON d2.id_venta = v2.id_venta
        GROUP BY v2.id_ciudad
    ) tc
)
ORDER BY total_vendido DESC;


-- -----------------------------------------------------
-- C7. Clientes que han comprado más de una vez
-- -----------------------------------------------------
SELECT cl.nombre AS cliente,
       ci.nombre AS ciudad,
       COUNT(*)  AS num_compras
FROM clientes cl
JOIN ciudades ci ON ci.id_ciudad = cl.id_ciudad
JOIN ventas v    ON v.id_cliente = cl.id_cliente
GROUP BY cl.id_cliente, cl.nombre, ci.nombre
HAVING COUNT(*) > 1
ORDER BY num_compras DESC, cliente;


-- -----------------------------------------------------
-- C8. Mes con mayores ingresos (funciones de fecha)
-- -----------------------------------------------------
SELECT TO_CHAR(v.fecha_venta, 'YYYY-MM') AS mes,
       SUM(d.cantidad * d.precio_unitario) AS ingresos
FROM ventas v
JOIN detalle_venta d ON d.id_venta = v.id_venta
GROUP BY TO_CHAR(v.fecha_venta, 'YYYY-MM')
ORDER BY ingresos DESC
LIMIT 1;

-- C8 (complemento). Ingresos de los 12 meses, útil para ver la estacionalidad
SELECT EXTRACT(MONTH FROM v.fecha_venta)::int AS mes,
       SUM(d.cantidad * d.precio_unitario) AS ingresos
FROM ventas v
JOIN detalle_venta d ON d.id_venta = v.id_venta
GROUP BY EXTRACT(MONTH FROM v.fecha_venta)
ORDER BY mes;


-- -----------------------------------------------------
-- C9. Porcentaje de participación de cada categoría en las ventas totales
-- -----------------------------------------------------
SELECT ca.nombre AS categoria,
       SUM(d.cantidad * d.precio_unitario) AS ingresos,
       ROUND(100.0 * SUM(d.cantidad * d.precio_unitario)
                   / SUM(SUM(d.cantidad * d.precio_unitario)) OVER (), 2) AS participacion_pct
FROM detalle_venta d
JOIN productos p   ON p.id_producto   = d.id_producto
JOIN categorias ca ON ca.id_categoria = p.id_categoria
GROUP BY ca.nombre
ORDER BY ingresos DESC;


-- -----------------------------------------------------
-- C10. Clientes potencialmente premium
-- Tres criterios, 1 punto cada uno:
--   VALOR:      gasto total superior al gasto promedio por cliente
--   FRECUENCIA: 2 o más compras
--   RECENCIA:   última compra dentro de los 90 días previos a la última
--               venta registrada en la base (fecha de corte)
-- Segmento: 3 puntos = Premium | 2 puntos = Potencial premium | menos = Estándar
-- -----------------------------------------------------
WITH cliente AS (
    SELECT cl.id_cliente,
           cl.nombre,
           ci.nombre AS ciudad,
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
)
SELECT c.nombre AS cliente,
       c.ciudad,
       c.num_compras,
       c.gasto_total,
       c.ultima_compra,
       (c.gasto_total > r.gasto_promedio)::int
         + (c.num_compras >= 2)::int
         + (c.ultima_compra >= r.fecha_corte - 90)::int AS puntaje,
       CASE
         WHEN (c.gasto_total > r.gasto_promedio)::int
              + (c.num_compras >= 2)::int
              + (c.ultima_compra >= r.fecha_corte - 90)::int = 3 THEN 'Premium'
         WHEN (c.gasto_total > r.gasto_promedio)::int
              + (c.num_compras >= 2)::int
              + (c.ultima_compra >= r.fecha_corte - 90)::int = 2 THEN 'Potencial premium'
         ELSE 'Estándar'
       END AS segmento
FROM cliente c
CROSS JOIN referencia r
ORDER BY puntaje DESC, c.gasto_total DESC;
