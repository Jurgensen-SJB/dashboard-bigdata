import type { DatosDashboard } from "@/lib/tipos";
import { cop, copCorto, pct } from "@/lib/format";

const ESTILO: Record<string, string> = {
  Premium: "bg-usb-verde text-white",
  "Potencial premium": "bg-usb-cielo/15 text-[#0B6E9E] ring-1 ring-usb-cielo/40",
  Estándar: "bg-gray-100 text-gray-600",
};

export default function TablaPremium({ filas, resumen }: { filas: DatosDashboard["premium"]; resumen: DatosDashboard["premiumResumen"] }) {
  return (
    <div>
      <p className="text-sm text-gray-700">
        <strong className="text-usb-verde">{resumen.clientes} clientes Premium</strong> generan{" "}
        <strong>{pct(resumen.participacionPct, 0)}</strong> de los ingresos ({copCorto(resumen.ingresos)}). Criterios (1 punto
        c/u): gasto sobre el promedio por cliente ({cop(resumen.gastoPromedio)}), 2 o más compras y compra en los 90 días previos
        a la última venta registrada ({resumen.fechaCorte}). Se calcula sobre todo el periodo y no cambia con los filtros.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-3 font-semibold">Cliente</th>
              <th className="py-2 pr-3 font-semibold">Ciudad</th>
              <th className="py-2 pr-3 text-right font-semibold">Compras</th>
              <th className="py-2 pr-3 text-right font-semibold">Gasto total</th>
              <th className="py-2 pr-3 font-semibold">Última compra</th>
              <th className="py-2 pr-3 text-center font-semibold">Puntaje</th>
              <th className="py-2 font-semibold">Segmento</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.cliente} className="border-b border-gray-100 last:border-0">
                <td className="py-2 pr-3 font-medium">{f.cliente}</td>
                <td className="py-2 pr-3">{f.ciudad}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{f.compras}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{cop(f.gasto)}</td>
                <td className="py-2 pr-3 tabular-nums">{f.ultima}</td>
                <td className="py-2 pr-3 text-center" aria-label={`${f.puntaje} de 3`}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={i < f.puntaje ? "text-usb-hoja" : "text-gray-300"}>
                      ●
                    </span>
                  ))}
                </td>
                <td className="py-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTILO[f.segmento]}`}>{f.segmento}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
