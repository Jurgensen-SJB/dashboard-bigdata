"use client";

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DatosDashboard } from "@/lib/tipos";
import { COLORES, colorCategoria } from "@/lib/colores";
import { cop, copCorto, mesCorto, mesLargo, pct } from "@/lib/format";
import { SinDatos } from "./Panel";

const EJE = { fontSize: 11, fill: "#4B5563" };
const REJILLA = "#E5ECE7";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Click = (d: any) => void;
const idDe = (d: { id?: number; payload?: { id?: number } }) => d?.id ?? d?.payload?.id;

/* ───────────── Ingresos por mes ───────────── */
export function GraficoMensual({ datos }: { datos: DatosDashboard["mensual"] }) {
  if (!datos.some((d) => d.ingresos > 0)) return <SinDatos />;
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORES.hoja} stopOpacity={0.45} />
              <stop offset="100%" stopColor={COLORES.hoja} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={REJILLA} vertical={false} />
          <XAxis dataKey="mes" tickFormatter={mesCorto} tick={EJE} tickLine={false} axisLine={{ stroke: REJILLA }} />
          <YAxis tickFormatter={copCorto} tick={EJE} tickLine={false} axisLine={false} width={64} />
          <Tooltip
            labelFormatter={(l) => mesLargo(String(l))}
            formatter={(v, n) => [cop(Number(v)), String(n)]}
          />
          <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke={COLORES.verde} strokeWidth={2.5} fill="url(#gIngresos)" />
          <Line type="monotone" dataKey="utilidad" name="Utilidad" stroke={COLORES.cielo} strokeWidth={2.5} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Ventas por ciudad (con promedio nacional) ───────────── */
export function GraficoCiudades({
  ciudades,
  promedio,
  seleccion,
  onSelect,
}: {
  ciudades: DatosDashboard["ciudades"];
  promedio: number;
  seleccion: string;
  onSelect: (id: number) => void;
}) {
  const datos = ciudades.filter((c) => c.ingresos > 0);
  if (!datos.length) return <SinDatos />;
  return (
    <div style={{ height: Math.max(220, datos.length * 36 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 18, right: 24, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} horizontal={false} />
          <XAxis type="number" tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nombre" tick={EJE} width={92} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [cop(Number(v)), "Vendido"]} cursor={{ fill: "rgba(4,102,44,0.06)" }} />
          <ReferenceLine
            x={promedio}
            stroke={COLORES.cieloOscuro}
            strokeDasharray="5 4"
            label={{ value: `Promedio ${copCorto(promedio)}`, position: "top", fill: COLORES.cieloOscuro, fontSize: 11 }}
          />
          <Bar dataKey="ingresos" radius={[0, 5, 5, 0]} cursor="pointer" onClick={((d) => onSelect(idDe(d)!)) as Click}>
            {datos.map((c) => (
              <Cell key={c.id} fill={String(c.id) === seleccion ? COLORES.cielo : COLORES.verde} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Participación por categoría (dona) ───────────── */
export function DonaCategorias({
  categorias,
  seleccion,
  onSelect,
}: {
  categorias: DatosDashboard["categorias"];
  seleccion: string;
  onSelect: (id: number) => void;
}) {
  const datos = categorias.filter((c) => c.ingresos > 0);
  if (!datos.length) return <SinDatos />;
  return (
    <div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="ingresos"
              nameKey="nombre"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
              cursor="pointer"
              onClick={((d) => onSelect(idDe(d)!)) as Click}
            >
              {datos.map((c) => (
                <Cell
                  key={c.id}
                  fill={colorCategoria(c.id)}
                  stroke={String(c.id) === seleccion ? "#12261A" : "#fff"}
                  strokeWidth={String(c.id) === seleccion ? 3 : 1.5}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [cop(Number(v)), "Ingresos"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-1 space-y-1 text-sm">
        {datos.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2">
            <button onClick={() => onSelect(c.id)} className="flex items-center gap-2 text-left hover:underline">
              <span className="h-3 w-3 rounded-sm" style={{ background: colorCategoria(c.id) }} />
              {c.nombre}
            </button>
            <span className="font-semibold tabular-nums">{pct(c.participacionPct)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── Top vendedores ───────────── */
export function TopVendedores({
  vendedores,
  seleccion,
  onSelect,
}: {
  vendedores: DatosDashboard["vendedores"];
  seleccion: string;
  onSelect: (id: number) => void;
}) {
  const datos = vendedores.filter((v) => v.ingresos > 0).slice(0, 6);
  if (!datos.length) return <SinDatos />;
  return (
    <div style={{ height: Math.max(200, datos.length * 40 + 30) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} horizontal={false} />
          <XAxis type="number" tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nombre" tick={EJE} width={118} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [cop(Number(v)), "Ingresos"]} cursor={{ fill: "rgba(4,102,44,0.06)" }} />
          <Bar dataKey="ingresos" radius={[0, 5, 5, 0]} cursor="pointer" onClick={((d) => onSelect(idDe(d)!)) as Click}>
            {datos.map((v) => (
              <Cell key={v.id} fill={String(v.id) === seleccion ? COLORES.cielo : COLORES.esmeralda} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Top productos ───────────── */
export function TopProductos({ productos }: { productos: DatosDashboard["productos"] }) {
  const datos = productos.slice(0, 6);
  if (!datos.length) return <SinDatos />;
  return (
    <div style={{ height: Math.max(200, datos.length * 40 + 30) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} horizontal={false} />
          <XAxis type="number" tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="nombre"
            tick={EJE}
            width={150}
            axisLine={false}
            tickLine={false}
            tickFormatter={(t: string) => (t.length > 24 ? t.slice(0, 23) + "…" : t)}
          />
          <Tooltip formatter={(v) => [cop(Number(v)), "Ingresos"]} cursor={{ fill: "rgba(4,102,44,0.06)" }} />
          <Bar dataKey="ingresos" radius={[0, 5, 5, 0]}>
            {datos.map((p) => (
              <Cell key={p.id} fill={COLORES.hoja} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Comparativa 1: ciudades vs promedio nacional ───────────── */
export function CiudadesVsPromedio({ ciudades, promedio }: { ciudades: DatosDashboard["ciudades"]; promedio: number }) {
  const datos = ciudades
    .filter((c) => c.ingresos > 0)
    .map((c) => ({ nombre: c.nombre, dif: promedio > 0 ? (c.ingresos / promedio - 1) * 100 : 0 }))
    .sort((a, b) => b.dif - a.dif);
  if (!datos.length) return <SinDatos />;
  return (
    <div style={{ height: Math.max(220, datos.length * 34 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${Math.round(Number(v))}%`} tick={EJE} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nombre" tick={EJE} width={92} axisLine={false} tickLine={false} />
          <ReferenceLine x={0} stroke="#12261A" />
          <Tooltip formatter={(v) => [`${Number(v) >= 0 ? "+" : ""}${pct(Number(v), 0)} vs. promedio`, "Diferencia"]} />
          <Bar dataKey="dif" radius={3}>
            {datos.map((d) => (
              <Cell key={d.nombre} fill={d.dif >= 0 ? COLORES.esmeralda : COLORES.cielo} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Comparativa 2: ingresos vs margen por categoría ───────────── */
export function IngresosVsMargen({ categorias }: { categorias: DatosDashboard["categorias"] }) {
  const datos = categorias.filter((c) => c.ingresos > 0);
  if (!datos.length) return <SinDatos />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 10, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} vertical={false} />
          <XAxis dataKey="nombre" tick={{ ...EJE, fontSize: 10 }} interval={0} tickLine={false} axisLine={{ stroke: REJILLA }} />
          <YAxis yAxisId="izq" tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} width={60} />
          <YAxis
            yAxisId="der"
            orientation="right"
            tickFormatter={(v) => `${Math.round(Number(v))}%`}
            tick={EJE}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, "auto"]}
          />
          <Tooltip formatter={(v, n) => (n === "Margen" ? [pct(Number(v)), "Margen"] : [cop(Number(v)), String(n)])} />
          <Bar yAxisId="izq" dataKey="ingresos" name="Ingresos" radius={[5, 5, 0, 0]}>
            {datos.map((c) => (
              <Cell key={c.id} fill={colorCategoria(c.id)} />
            ))}
          </Bar>
          <Line yAxisId="der" type="monotone" dataKey="margenPct" name="Margen" stroke="#12261A" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ───────────── Comparativa 3: ticket por vendedor vs promedio del equipo ───────────── */
export function TicketVsEquipo({ vendedores, promedio }: { vendedores: DatosDashboard["vendedores"]; promedio: number }) {
  const datos = vendedores.filter((v) => v.ventas > 0).sort((a, b) => b.ticket - a.ticket);
  if (!datos.length) return <SinDatos />;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 18, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={REJILLA} vertical={false} />
          <XAxis dataKey="nombre" tick={{ ...EJE, fontSize: 10 }} tickLine={false} axisLine={{ stroke: REJILLA }} tickFormatter={(t: string) => t.split(" ")[0]} />
          <YAxis tickFormatter={copCorto} tick={EJE} axisLine={false} tickLine={false} width={60} />
          <Tooltip formatter={(v) => [cop(Number(v)), "Ticket promedio"]} labelFormatter={(l) => String(l)} />
          <ReferenceLine
            y={promedio}
            stroke={COLORES.cieloOscuro}
            strokeDasharray="5 4"
            label={{ value: `Promedio ${copCorto(promedio)}`, position: "insideTopRight", fill: COLORES.cieloOscuro, fontSize: 11 }}
          />
          <Bar dataKey="ticket" radius={[5, 5, 0, 0]}>
            {datos.map((v) => (
              <Cell key={v.id} fill={v.ticket >= promedio ? COLORES.esmeralda : COLORES.cielo} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
