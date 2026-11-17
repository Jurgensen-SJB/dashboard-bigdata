"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ResultadoConsulta } from "@/lib/consultas";
import { COLORES } from "@/lib/colores";
import { cop, copCorto, entero, mesCorto, pct } from "@/lib/format";

interface Item {
  id: string;
  numero: string;
  titulo: string;
  pregunta: string;
}

type Valor = string | number | null;

const ETIQUETAS: Record<string, string> = {
  ciudad: "Ciudad",
  total_vendido: "Total vendido",
  vendedor: "Vendedor",
  num_ventas: "N.º de ventas",
  ingresos: "Ingresos",
  categoria: "Categoría",
  utilidad: "Utilidad",
  margen_pct: "Margen",
  promedio_por_venta: "Promedio por venta",
  producto: "Producto",
  valor_vendido: "Valor vendido",
  cliente: "Cliente",
  num_compras: "N.º de compras",
  mes: "Mes",
  participacion_pct: "Participación",
  gasto_total: "Gasto total",
  ultima_compra: "Última compra",
  puntaje: "Puntaje",
  segmento: "Segmento",
};

const ESTILO_SEGMENTO: Record<string, string> = {
  Premium: "bg-usb-verde text-white",
  "Potencial premium": "bg-usb-cielo/15 text-[#0B6E9E] ring-1 ring-usb-cielo/40",
  Estándar: "bg-gray-100 text-gray-600",
};

function formatear(valor: Valor, formato: string | undefined, columna: string): React.ReactNode {
  if (valor === null || valor === undefined) return "—";
  if (columna === "segmento") {
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTILO_SEGMENTO[String(valor)] ?? ""}`}>{String(valor)}</span>;
  }
  if (columna === "mes" && typeof valor === "number") return mesCorto(`2025-${String(valor).padStart(2, "0")}`);
  switch (formato) {
    case "moneda":
      return cop(Number(valor));
    case "entero":
      return entero(Number(valor));
    case "porcentaje":
      return pct(Number(valor));
    default:
      return String(valor);
  }
}

const EJE = { fontSize: 11, fill: "#4B5563" };

function GraficoResultado({ r }: { r: ResultadoConsulta }) {
  if (!r.grafico) return null;
  const { x, y, tipo } = r.grafico;
  const esMoneda = r.formatos[y] === "moneda";
  const fmtEje = (v: number) => (esMoneda ? copCorto(v) : r.formatos[y] === "porcentaje" ? `${Math.round(v)}%` : String(v));
  const fmtTip = (v: number) => (esMoneda ? cop(v) : r.formatos[y] === "porcentaje" ? pct(v) : entero(v));
  const horizontal = tipo === "barras-h";

  return (
    <div style={{ height: horizontal ? Math.max(220, r.filas.length * 34 + 30) : 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={r.filas} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="#E5ECE7" vertical={horizontal} horizontal={!horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tickFormatter={fmtEje} tick={EJE} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey={x} tick={EJE} width={96} axisLine={false} tickLine={false} />
            </>
          ) : (
            <>
              <XAxis
                dataKey={x}
                tick={{ ...EJE, fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#E5ECE7" }}
                tickFormatter={(t: string) => (String(t).length > 14 ? String(t).slice(0, 13) + "…" : String(t))}
              />
              <YAxis tickFormatter={fmtEje} tick={EJE} axisLine={false} tickLine={false} width={64} />
            </>
          )}
          <Tooltip formatter={(v) => [fmtTip(Number(v)), ETIQUETAS[y] ?? y]} cursor={{ fill: "rgba(4,102,44,0.06)" }} />
          <Bar dataKey={y} fill={COLORES.hoja} radius={horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function GraficoExtra({ r }: { r: ResultadoConsulta }) {
  if (!r.extra?.grafico) return null;
  const { x, y } = r.extra.grafico;
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-semibold text-gray-700">Ingresos de los 12 meses (consulta complementaria con EXTRACT)</p>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={r.extra.filas} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="#E5ECE7" vertical={false} />
            <XAxis dataKey={x} tick={EJE} tickLine={false} tickFormatter={(m: number) => mesCorto(`2025-${String(m).padStart(2, "0")}`)} />
            <YAxis tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} width={64} />
            <Tooltip
              formatter={(v) => [cop(Number(v)), "Ingresos"]}
              labelFormatter={(m) => mesCorto(`2025-${String(m).padStart(2, "0")}`)}
            />
            <Line type="monotone" dataKey={y} stroke={COLORES.verde} strokeWidth={2.5} dot={{ r: 3.5, fill: COLORES.cielo, stroke: COLORES.verde }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TablaResultado({ columnas, filas, formatos }: { columnas: string[]; filas: Record<string, Valor>[]; formatos: ResultadoConsulta["formatos"] }) {
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-gray-200">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead className="bg-usb-verde text-xs uppercase tracking-wide text-white">
          <tr>
            {columnas.map((c) => (
              <th key={c} className={`px-3 py-2 font-semibold ${["moneda", "entero", "porcentaje"].includes(formatos[c]) ? "text-right" : ""}`}>
                {ETIQUETAS[c] ?? c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className={i % 2 ? "bg-usb-fondo" : "bg-white"}>
              {columnas.map((c) => (
                <td key={c} className={`px-3 py-2 tabular-nums ${["moneda", "entero", "porcentaje"].includes(formatos[c]) ? "text-right" : ""}`}>
                  {formatear(f[c], formatos[c], c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Explorador() {
  const [lista, setLista] = useState<Item[] | null>(null);
  const [activa, setActiva] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verSql, setVerSql] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/consultas")
      .then((r) => r.json())
      .then(setLista)
      .catch(() => setError("No fue posible cargar la lista de consultas."));
  }, []);

  async function ejecutar(id: string) {
    setActiva(id);
    setCargando(true);
    setError(null);
    setVerSql(false);
    try {
      const r = await fetch(`/api/consultas?id=${encodeURIComponent(id)}`);
      const json = await r.json();
      if (!r.ok) throw new Error(json?.mensaje ?? "Error al ejecutar la consulta.");
      setResultado(json as ResultadoConsulta);
      if (window.innerWidth < 1024) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setResultado(null);
      setError(e instanceof Error ? e.message : "Error al ejecutar la consulta.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
      <nav aria-label="Lista de consultas" className="space-y-2 lg:sticky lg:top-4 lg:self-start">
        {!lista && !error && <div className="tarjeta h-40 animate-pulse" />}
        {lista?.map((c) => (
          <button
            key={c.id}
            onClick={() => ejecutar(c.id)}
            aria-pressed={activa === c.id}
            className={
              "tarjeta block w-full p-3 text-left transition hover:ring-2 hover:ring-usb-cielo/60 " +
              (activa === c.id ? "ring-2 !ring-usb-verde" : "")
            }
          >
            <span className="flex items-baseline gap-2">
              <span className="rounded bg-usb-verde px-1.5 py-0.5 text-[11px] font-bold text-white">{c.numero}</span>
              <span className="font-semibold text-usb-tinta">{c.titulo}</span>
            </span>
            <span className="mt-1 block text-xs text-gray-500">{c.pregunta}</span>
          </button>
        ))}
      </nav>

      <div ref={panel} className="min-w-0 scroll-mt-4">
        {!activa && !error && (
          <div className="tarjeta flex h-64 items-center justify-center p-6 text-center text-sm text-gray-500">
            Selecciona una consulta de la lista para ver su resultado y su análisis.
          </div>
        )}

        {error && (
          <div role="alert" className="tarjeta border-l-4 border-red-500 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && <div className="tarjeta h-64 animate-pulse" aria-busy="true" />}

        {resultado && !cargando && (
          <article className="tarjeta p-5">
            <header>
              <p className="text-xs font-bold uppercase tracking-wide text-usb-esmeralda">Consulta {resultado.numero}</p>
              <h3 className="text-xl font-bold text-usb-tinta">{resultado.titulo}</h3>
              <p className="text-sm text-gray-600">{resultado.pregunta}</p>
            </header>

            <div className="mt-4 rounded-lg border-l-4 border-usb-cielo bg-usb-cielo/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#0B6E9E]">Respuesta</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-800">{resultado.respuesta}</p>
            </div>

            <h4 className="mb-2 mt-5 text-sm font-semibold text-gray-700">Resultado ({resultado.filas.length === 1 ? "1 fila" : `${resultado.filas.length} filas`})</h4>
            <TablaResultado columnas={resultado.columnas} filas={resultado.filas} formatos={resultado.formatos} />

            {resultado.grafico && (
              <div className="mt-6">
                <GraficoResultado r={resultado} />
              </div>
            )}
            <GraficoExtra r={resultado} />

            <div className="mt-6 border-t border-gray-100 pt-4">
              <button className="boton-secundario !py-1.5 text-xs" onClick={() => setVerSql((v) => !v)} aria-expanded={verSql}>
                {verSql ? "Ocultar SQL" : "Ver SQL (solo lectura)"}
              </button>
              {verSql && (
                <pre
                  tabIndex={0}
                  className="mt-3 max-h-96 select-text overflow-auto rounded-lg bg-[#0F1F16] p-4 text-xs leading-relaxed text-emerald-100"
                  aria-label="Código SQL de la consulta, solo lectura"
                >
                  {resultado.sql}
                </pre>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
