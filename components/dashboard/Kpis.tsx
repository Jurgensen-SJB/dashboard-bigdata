import type { DatosDashboard } from "@/lib/tipos";
import { cop, copCorto, entero, mesLargo, pct } from "@/lib/format";

function Kpi({ titulo, valor, detalle, acento }: { titulo: string; valor: string; detalle?: string; acento: string }) {
  return (
    <div className="tarjeta relative overflow-hidden p-4">
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: acento }} />
      <p className="pl-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{titulo}</p>
      <p className="mt-1 pl-2 text-2xl font-bold text-usb-tinta">{valor}</p>
      {detalle && <p className="pl-2 text-xs text-gray-500">{detalle}</p>}
    </div>
  );
}

export default function Kpis({ k, mensual }: { k: DatosDashboard["kpis"]; mensual: DatosDashboard["mensual"] }) {
  const mejor = mensual.reduce((a, b) => (b.ingresos > a.ingresos ? b : a), mensual[0] ?? { mes: "", ingresos: 0, utilidad: 0 });
  return (
    <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <Kpi titulo="Ingresos" valor={copCorto(k.ingresos)} detalle={cop(k.ingresos)} acento="#04662C" />
      <Kpi titulo="Utilidad" valor={copCorto(k.utilidad)} detalle={`Margen ${pct(k.margenPct)}`} acento="#0A7E38" />
      <Kpi titulo="Ventas" valor={entero(k.ventas)} detalle={`${entero(k.unidades)} unidades`} acento="#048E61" />
      <Kpi titulo="Ticket promedio" valor={copCorto(k.ticket)} detalle="Valor medio por venta" acento="#10A9E6" />
      <Kpi titulo="Clientes activos" valor={entero(k.clientes)} detalle="Con compras en el filtro" acento="#0B6E9E" />
      <Kpi titulo="Mejor mes" valor={mejor.ingresos > 0 ? mesLargo(mejor.mes) : "—"} detalle={mejor.ingresos > 0 ? copCorto(mejor.ingresos) : "Sin ventas"} acento="#8FD3B0" />
    </section>
  );
}
