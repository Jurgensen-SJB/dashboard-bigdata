"use client";

import { useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import geo from "@/lib/colombia-geo.json";
import type { DatosDashboard } from "@/lib/tipos";
import { COLORES } from "@/lib/colores";
import { copCorto, entero } from "@/lib/format";

const W = 520;
const H = 640;

const { colombia, vecinos } = geo as unknown as { colombia: Feature<Geometry>; vecinos: Feature<Geometry>[] };

// Lado de la etiqueta para evitar que se solapen las ciudades cercanas
const ETIQUETA_IZQUIERDA = new Set(["Cartagena", "Bucaramanga", "Medellín", "Cali", "Pereira"]);

export default function MapaColombia({
  ciudades,
  seleccion,
  onSelect,
}: {
  ciudades: DatosDashboard["ciudades"];
  seleccion: string;
  onSelect: (id: number) => void;
}) {
  const [hover, setHover] = useState<DatosDashboard["ciudades"][number] | null>(null);

  const { proyeccion, rutas } = useMemo(() => {
    // Se ajusta al territorio continental (sin las islas) para que el mapa quede grande
    const proy = geoMercator().fitExtent(
      [
        [14, 14],
        [W - 14, H - 14],
      ],
      { type: "MultiPoint", coordinates: [[-79.4, -4.5], [-66.6, 12.9]] },
    );
    const path = geoPath(proy);
    return {
      proyeccion: proy,
      rutas: {
        colombia: path(colombia) ?? "",
        vecinos: vecinos.map((v) => path(v) ?? ""),
      },
    };
  }, []);

  const max = Math.max(1, ...ciudades.map((c) => c.ingresos));
  const radio = (v: number) => (v > 0 ? 7 + 28 * Math.sqrt(v / max) : 5);
  const ordenadas = [...ciudades].sort((a, b) => b.ingresos - a.ingresos); // las grandes al fondo

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-lg bg-[#EAF4FA]" role="img" aria-label="Mapa de Colombia con las ventas por ciudad">
        {rutas.vecinos.map((d, i) => (
          <path key={i} d={d} fill="#E3EAE5" stroke="#C5D2C9" strokeWidth={0.8} />
        ))}
        <path d={rutas.colombia} fill="#D3EBDC" stroke="#7DB596" strokeWidth={1.2} />

        {ordenadas.map((c) => {
          const p = proyeccion([c.lon, c.lat]);
          if (!p) return null;
          const r = radio(c.ingresos);
          const activa = String(c.id) === seleccion;
          const izq = ETIQUETA_IZQUIERDA.has(c.nombre);
          return (
            <g
              key={c.id}
              className="cursor-pointer"
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => setHover(c)}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                cx={p[0]}
                cy={p[1]}
                r={r}
                fill={c.ingresos > 0 ? COLORES.verde : "#fff"}
                fillOpacity={c.ingresos > 0 ? 0.72 : 1}
                stroke={activa ? COLORES.cielo : c.ingresos > 0 ? "#fff" : COLORES.gris}
                strokeWidth={activa ? 4 : 2}
              />
              <text
                x={p[0] + (izq ? -(r + 5) : r + 5)}
                y={p[1] + 4}
                textAnchor={izq ? "end" : "start"}
                fontSize={13}
                fontWeight={600}
                fill="#12261A"
                stroke="#fff"
                strokeWidth={3.5}
                paintOrder="stroke"
              >
                {c.nombre}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 min-w-[9rem] rounded-lg bg-white/95 px-3 py-2 text-xs shadow ring-1 ring-black/5">
        {hover ? (
          <>
            <p className="font-bold text-usb-verde">{hover.nombre}</p>
            <p>{copCorto(hover.ingresos)} vendidos</p>
            <p className="text-gray-500">{entero(hover.ventas)} ventas</p>
          </>
        ) : (
          <p className="text-gray-500">Pasa el cursor sobre una ciudad. Haz clic para filtrar.</p>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">El tamaño de cada círculo es proporcional a lo vendido en la ciudad.</p>
    </div>
  );
}
