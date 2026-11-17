/** Paleta institucional (franja de la Universidad Simón Bolívar) y derivados */
export const COLORES = {
  verde: "#04662C",
  hoja: "#0A7E38",
  esmeralda: "#048E61",
  cielo: "#10A9E6",
  cieloOscuro: "#0B6E9E",
  menta: "#8FD3B0",
  gris: "#9CA3AF",
};

const CATEGORIAS = [COLORES.verde, COLORES.cielo, COLORES.esmeralda, COLORES.menta, COLORES.cieloOscuro];

/** Cada categoría conserva siempre el mismo color, sin importar el filtro activo */
export const colorCategoria = (id: number) => CATEGORIAS[(id - 1) % CATEGORIAS.length];
