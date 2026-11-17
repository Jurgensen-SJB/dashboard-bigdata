export interface Opcion {
  id: number;
  nombre: string;
}

export interface DatosDashboard {
  kpis: {
    ingresos: number;
    utilidad: number;
    margenPct: number;
    ventas: number;
    ticket: number;
    clientes: number;
    unidades: number;
  };
  mensual: { mes: string; ingresos: number; utilidad: number }[];
  ciudades: { id: number; nombre: string; lat: number; lon: number; ingresos: number; ventas: number; utilidad: number }[];
  categorias: { id: number; nombre: string; ingresos: number; utilidad: number; margenPct: number; participacionPct: number }[];
  vendedores: { id: number; nombre: string; ingresos: number; ventas: number; ticket: number }[];
  productos: { id: number; nombre: string; categoria: string; ingresos: number; unidades: number }[];
  promedios: { ingresosPorCiudad: number; ticketPorVendedor: number };
  premium: {
    cliente: string;
    ciudad: string;
    compras: number;
    gasto: number;
    ultima: string;
    puntaje: number;
    segmento: "Premium" | "Potencial premium" | "Estándar";
  }[];
  premiumResumen: { clientes: number; ingresos: number; participacionPct: number; gastoPromedio: number; fechaCorte: string };
  opciones: {
    ciudades: Opcion[];
    categorias: Opcion[];
    vendedores: Opcion[];
    meses: string[];
  };
}

export interface FiltrosDashboard {
  desde: string; // 'YYYY-MM' o ''
  hasta: string;
  ciudad: string; // id o ''
  categoria: string;
  vendedor: string;
}
