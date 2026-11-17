"use client";

import type { FiltrosDashboard, DatosDashboard } from "@/lib/tipos";
import { mesLargo } from "@/lib/format";

interface Props {
  filtros: FiltrosDashboard;
  opciones: DatosDashboard["opciones"];
  onCambio: (f: FiltrosDashboard) => void;
}

function Selector({
  etiqueta,
  valor,
  onChange,
  children,
}: {
  etiqueta: string;
  valor: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-semibold text-gray-600">{etiqueta}</span>
      <select className="campo" value={valor} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

export default function Filtros({ filtros, opciones, onCambio }: Props) {
  const hay = Object.values(filtros).some(Boolean);
  const set = (parcial: Partial<FiltrosDashboard>) => onCambio({ ...filtros, ...parcial });

  return (
    <section aria-label="Filtros" className="tarjeta p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="titulo-seccion">Filtros</h2>
        <button className="boton-secundario !px-3 !py-1.5 text-xs" onClick={() => onCambio({ desde: "", hasta: "", ciudad: "", categoria: "", vendedor: "" })} disabled={!hay}>
          Limpiar filtros
        </button>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Selector
          etiqueta="Desde (mes)"
          valor={filtros.desde}
          onChange={(v) => set({ desde: v, hasta: v && filtros.hasta && v > filtros.hasta ? v : filtros.hasta })}
        >
          <option value="">Todo el año</option>
          {opciones.meses.map((m) => (
            <option key={m} value={m}>
              {mesLargo(m)}
            </option>
          ))}
        </Selector>
        <Selector
          etiqueta="Hasta (mes)"
          valor={filtros.hasta}
          onChange={(v) => set({ hasta: v, desde: v && filtros.desde && v < filtros.desde ? v : filtros.desde })}
        >
          <option value="">Todo el año</option>
          {opciones.meses.map((m) => (
            <option key={m} value={m}>
              {mesLargo(m)}
            </option>
          ))}
        </Selector>
        <Selector etiqueta="Ciudad de la venta" valor={filtros.ciudad} onChange={(v) => set({ ciudad: v })}>
          <option value="">Todas las ciudades</option>
          {opciones.ciudades.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Selector>
        <Selector etiqueta="Categoría" valor={filtros.categoria} onChange={(v) => set({ categoria: v })}>
          <option value="">Todas las categorías</option>
          {opciones.categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Selector>
        <Selector etiqueta="Vendedor" valor={filtros.vendedor} onChange={(v) => set({ vendedor: v })}>
          <option value="">Todos los vendedores</option>
          {opciones.vendedores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Selector>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Tip: también puedes hacer clic en una ciudad del mapa, una barra o una categoría para filtrar.
      </p>
    </section>
  );
}
