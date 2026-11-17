import { consultar } from "./db";
import SQL from "./sql-consultas.json";

export type FormatoColumna = "moneda" | "entero" | "porcentaje" | "texto";

export interface DefinicionConsulta {
  id: string;
  numero: string;
  titulo: string;
  /** Pregunta de negocio que responde */
  pregunta: string;
  /** SQL fijo: vive solo en el servidor y no se puede modificar desde el navegador */
  sql: string;
  /** SQL complementario opcional (por ejemplo, la serie de 12 meses) */
  sqlExtra?: string;
  /** Párrafo de análisis (el mismo del documento) */
  respuesta: string;
  /** Formato de cada columna del resultado */
  formatos: Record<string, FormatoColumna>;
  /** Gráfico opcional del resultado principal */
  grafico?: { x: string; y: string; tipo: "barras" | "barras-h" };
  /** Gráfico opcional del resultado complementario */
  graficoExtra?: { x: string; y: string; tipo: "linea" };
}

const limpio = (s: string) => s.trim().replace(/;\s*$/, "");
const Q = SQL as Record<string, string[]>;
const sql = (k: string) => limpio(Q[k].join("\n"));

export const CATALOGO: DefinicionConsulta[] = [
  {
    id: "c1",
    numero: "6.1",
    titulo: "Total vendido por ciudad",
    pregunta: "¿Cuánto se vendió en cada ciudad?",
    sql: sql("C1"),
    respuesta:
      "Bogotá lidera con el 39,9 % de las ventas. Cartagena y Pereira juntas suman apenas el 4,4 %.",
    formatos: { ciudad: "texto", total_vendido: "moneda" },
    grafico: { x: "ciudad", y: "total_vendido", tipo: "barras-h" },
  },
  {
    id: "c2",
    numero: "6.2",
    titulo: "Top 3 vendedores con mayores ingresos",
    pregunta: "¿Quiénes son los tres vendedores que más ingresos generan?",
    sql: sql("C2"),
    respuesta: "El podio es Camila Rojas, Andrés Pardo y Daniela Ortega.",
    formatos: { vendedor: "texto", num_ventas: "entero", ingresos: "moneda" },
    grafico: { x: "vendedor", y: "ingresos", tipo: "barras" },
  },
  {
    id: "c3",
    numero: "6.3",
    titulo: "Categoría más rentable",
    pregunta: "¿Qué categoría deja más utilidad y con qué margen?",
    sql: sql("C3"),
    respuesta:
      "En pesos, Tecnología es la más rentable, con $3,5 millones de utilidad. Pero es la de menor margen (21,7 %). Por cada peso vendido, la más rentable es Moda (43,3 %).",
    formatos: { categoria: "texto", ingresos: "moneda", utilidad: "moneda", margen_pct: "porcentaje" },
    grafico: { x: "categoria", y: "utilidad", tipo: "barras" },
  },
  {
    id: "c4",
    numero: "6.4",
    titulo: "Promedio de ventas por vendedor",
    pregunta: "¿Cuál es el valor promedio de cada venta de cada vendedor?",
    sql: sql("C4"),
    respuesta:
      "Camila vende en promedio $1,56 millones por venta, más del doble que Laura Mejía ($600.000).",
    formatos: { vendedor: "texto", num_ventas: "entero", promedio_por_venta: "moneda" },
    grafico: { x: "vendedor", y: "promedio_por_venta", tipo: "barras" },
  },
  {
    id: "c5",
    numero: "6.5",
    titulo: "Productos que superan el promedio general",
    pregunta: "¿Qué productos venden más que el promedio de todos los productos? (subconsultas)",
    sql: sql("C5"),
    respuesta:
      "El promedio por producto es $1.822.000. Solo 3 de los 15 productos lo superan, y juntos concentran el 66 % de las ventas.",
    formatos: { producto: "texto", valor_vendido: "moneda" },
    grafico: { x: "producto", y: "valor_vendido", tipo: "barras" },
  },
  {
    id: "c6",
    numero: "6.6",
    titulo: "Ciudades sobre el promedio nacional",
    pregunta: "¿Qué ciudades venden más que el promedio nacional? (subconsultas)",
    sql: sql("C6"),
    respuesta:
      "El promedio nacional por ciudad es $3.416.250. Lo superan Bogotá, Medellín, Cúcuta y Barranquilla.",
    formatos: { ciudad: "texto", total_vendido: "moneda" },
    grafico: { x: "ciudad", y: "total_vendido", tipo: "barras" },
  },
  {
    id: "c7",
    numero: "6.7",
    titulo: "Clientes que han comprado más de una vez",
    pregunta: "¿Qué clientes son recurrentes?",
    sql: sql("C7"),
    respuesta:
      "10 de los 12 clientes (83,3 %) han comprado más de una vez. Solo Felipe Restrepo e Isabela Marín compraron una sola vez.",
    formatos: { cliente: "texto", ciudad: "texto", num_compras: "entero" },
  },
  {
    id: "c8",
    numero: "6.8",
    titulo: "Mes con mayores ingresos",
    pregunta: "¿Cuál fue el mejor mes del año? (funciones de fecha)",
    sql: sql("C8"),
    sqlExtra: sql("C8b"),
    respuesta:
      "Noviembre de 2025, con $5.880.000 (21,5 % del año). La serie de 12 meses muestra la estacionalidad: junio ($600.000) y octubre ($690.000) son los meses más bajos.",
    formatos: { mes: "texto", ingresos: "moneda" },
    graficoExtra: { x: "mes", y: "ingresos", tipo: "linea" },
  },
  {
    id: "c9",
    numero: "6.9",
    titulo: "Participación de cada categoría",
    pregunta: "¿Qué porcentaje de las ventas aporta cada categoría?",
    sql: sql("C9"),
    respuesta: "Tecnología pesa casi el 59 %. Hogar y Moda juntas apenas el 12,9 %.",
    formatos: { categoria: "texto", ingresos: "moneda", participacion_pct: "porcentaje" },
    grafico: { x: "categoria", y: "participacion_pct", tipo: "barras" },
  },
  {
    id: "c10",
    numero: "7",
    titulo: "Clientes potencialmente premium",
    pregunta: "¿Qué clientes valen más para la empresa? (valor + frecuencia + recencia)",
    sql: sql("C10"),
    respuesta:
      "Los 4 clientes premium concentran el 62 % de los ingresos ($16,95 millones). Felipe Restrepo gastó $2,44 millones, pero con una sola compra en mayo: queda en Estándar, aunque es un caso claro para reactivar.",
    formatos: {
      cliente: "texto",
      ciudad: "texto",
      num_compras: "entero",
      gasto_total: "moneda",
      ultima_compra: "texto",
      puntaje: "entero",
      segmento: "texto",
    },
  },
];

export interface ResultadoConsulta {
  id: string;
  numero: string;
  titulo: string;
  pregunta: string;
  respuesta: string;
  sql: string;
  columnas: string[];
  filas: Record<string, string | number | null>[];
  formatos: DefinicionConsulta["formatos"];
  grafico?: DefinicionConsulta["grafico"];
  extra?: {
    columnas: string[];
    filas: Record<string, string | number | null>[];
    grafico?: DefinicionConsulta["graficoExtra"];
  };
}

export async function ejecutarConsulta(c: DefinicionConsulta): Promise<ResultadoConsulta> {
  const filas = await consultar<Record<string, string | number | null>>(c.sql);
  const extraFilas = c.sqlExtra ? await consultar<Record<string, string | number | null>>(c.sqlExtra) : null;

  return {
    id: c.id,
    numero: c.numero,
    titulo: c.titulo,
    pregunta: c.pregunta,
    respuesta: c.respuesta,
    sql: c.sql,
    columnas: filas.length ? Object.keys(filas[0]) : Object.keys(c.formatos),
    filas,
    formatos: c.formatos,
    grafico: c.grafico,
    extra: extraFilas
      ? { columnas: extraFilas.length ? Object.keys(extraFilas[0]) : [], filas: extraFilas, grafico: c.graficoExtra }
      : undefined,
  };
}
