export type Clave = "PK" | "FK" | "UQ";
export type Grupo = "catalogo" | "actor" | "transaccion";

export interface Columna {
  nombre: string;
  tipo: string;
  claves: Clave[];
  nota: string;
}

export interface TablaEsquema {
  nombre: string;
  grupo: Grupo;
  descripcion: string;
  columnas: Columna[];
}

export const GRUPOS: Record<Grupo, string> = {
  catalogo: "Catálogos",
  actor: "Actores",
  transaccion: "Transacciones",
};

export const TABLAS: TablaEsquema[] = [
  {
    nombre: "ciudades",
    grupo: "catalogo",
    descripcion: "Ciudades donde opera la empresa, con coordenadas para el mapa.",
    columnas: [
      { nombre: "id_ciudad", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "nombre", tipo: "VARCHAR(60)", claves: ["UQ"], nota: "Nombre de la ciudad" },
      { nombre: "departamento", tipo: "VARCHAR(60)", claves: [], nota: "Departamento" },
      { nombre: "latitud", tipo: "NUMERIC(9,6)", claves: [], nota: "Coordenada" },
      { nombre: "longitud", tipo: "NUMERIC(9,6)", claves: [], nota: "Coordenada" },
    ],
  },
  {
    nombre: "categorias",
    grupo: "catalogo",
    descripcion: "Grupos en los que se clasifican los productos.",
    columnas: [
      { nombre: "id_categoria", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "nombre", tipo: "VARCHAR(60)", claves: ["UQ"], nota: "Nombre de la categoría" },
      { nombre: "descripcion", tipo: "VARCHAR(150)", claves: [], nota: "Opcional" },
    ],
  },
  {
    nombre: "productos",
    grupo: "catalogo",
    descripcion: "Catálogo de productos con precio de venta, costo y categoría.",
    columnas: [
      { nombre: "id_producto", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "nombre", tipo: "VARCHAR(100)", claves: ["UQ"], nota: "Nombre del producto" },
      { nombre: "id_categoria", tipo: "INT", claves: ["FK"], nota: "→ categorias" },
      { nombre: "precio_venta", tipo: "NUMERIC(12,2)", claves: [], nota: "CHECK > 0" },
      { nombre: "costo", tipo: "NUMERIC(12,2)", claves: [], nota: "CHECK > 0" },
    ],
  },
  {
    nombre: "clientes",
    grupo: "actor",
    descripcion: "Personas que compran y la ciudad donde residen.",
    columnas: [
      { nombre: "id_cliente", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "documento", tipo: "VARCHAR(15)", claves: ["UQ"], nota: "Documento de identidad" },
      { nombre: "nombre", tipo: "VARCHAR(100)", claves: [], nota: "Nombre completo" },
      { nombre: "email", tipo: "VARCHAR(120)", claves: ["UQ"], nota: "Correo electrónico" },
      { nombre: "id_ciudad", tipo: "INT", claves: ["FK"], nota: "→ ciudades (residencia)" },
      { nombre: "fecha_registro", tipo: "DATE", claves: [], nota: "Fecha de registro" },
    ],
  },
  {
    nombre: "vendedores",
    grupo: "actor",
    descripcion: "Fuerza de ventas y su ciudad sede.",
    columnas: [
      { nombre: "id_vendedor", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "documento", tipo: "VARCHAR(15)", claves: ["UQ"], nota: "Documento de identidad" },
      { nombre: "nombre", tipo: "VARCHAR(100)", claves: [], nota: "Nombre completo" },
      { nombre: "email", tipo: "VARCHAR(120)", claves: ["UQ"], nota: "Correo corporativo" },
      { nombre: "id_ciudad", tipo: "INT", claves: ["FK"], nota: "→ ciudades (sede)" },
      { nombre: "fecha_ingreso", tipo: "DATE", claves: [], nota: "Fecha de ingreso" },
    ],
  },
  {
    nombre: "ventas",
    grupo: "transaccion",
    descripcion: "Cabecera de cada venta: cliente, vendedor, ciudad y fecha.",
    columnas: [
      { nombre: "id_venta", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "id_cliente", tipo: "INT", claves: ["FK"], nota: "→ clientes" },
      { nombre: "id_vendedor", tipo: "INT", claves: ["FK"], nota: "→ vendedores" },
      { nombre: "id_ciudad", tipo: "INT", claves: ["FK"], nota: "→ ciudades (donde se vendió)" },
      { nombre: "fecha_venta", tipo: "DATE", claves: [], nota: "Fecha de la venta" },
    ],
  },
  {
    nombre: "detalle_venta",
    grupo: "transaccion",
    descripcion: "Líneas de cada venta: producto, cantidad y precio. Resuelve la relación N:M entre ventas y productos.",
    columnas: [
      { nombre: "id_detalle", tipo: "INT", claves: ["PK"], nota: "Identificador (IDENTITY)" },
      { nombre: "id_venta", tipo: "INT", claves: ["FK"], nota: "→ ventas" },
      { nombre: "id_producto", tipo: "INT", claves: ["FK"], nota: "→ productos" },
      { nombre: "cantidad", tipo: "INT", claves: [], nota: "CHECK > 0" },
      { nombre: "precio_unitario", tipo: "NUMERIC(12,2)", claves: [], nota: "CHECK > 0" },
    ],
  },
];

export const RELACIONES: { fk: string; referencia: string; lectura: string }[] = [
  { fk: "clientes.id_ciudad", referencia: "ciudades", lectura: "Una ciudad tiene muchos clientes." },
  { fk: "vendedores.id_ciudad", referencia: "ciudades", lectura: "Una ciudad es sede de varios vendedores." },
  { fk: "productos.id_categoria", referencia: "categorias", lectura: "Una categoría agrupa muchos productos." },
  { fk: "ventas.id_cliente", referencia: "clientes", lectura: "Un cliente puede hacer muchas compras." },
  { fk: "ventas.id_vendedor", referencia: "vendedores", lectura: "Un vendedor realiza muchas ventas." },
  { fk: "ventas.id_ciudad", referencia: "ciudades", lectura: "En una ciudad se realizan muchas ventas." },
  { fk: "detalle_venta.id_venta", referencia: "ventas", lectura: "Una venta tiene una o varias líneas." },
  { fk: "detalle_venta.id_producto", referencia: "productos", lectura: "Un producto aparece en muchas líneas." },
];
