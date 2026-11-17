import type { Metadata } from "next";
import AvisoAcademico from "@/components/AvisoAcademico";
import { GRUPOS, RELACIONES, TABLAS, type Clave, type Grupo } from "@/lib/esquema";

export const metadata: Metadata = { title: "Base de datos · DataCommerce Analytics" };

const COLOR_GRUPO: Record<Grupo, string> = {
  catalogo: "bg-usb-verde",
  actor: "bg-[#0B6E9E]",
  transaccion: "bg-usb-esmeralda",
};

const COLOR_CLAVE: Record<Clave, string> = {
  PK: "bg-amber-100 text-amber-800",
  FK: "bg-sky-100 text-sky-800",
  UQ: "bg-purple-100 text-purple-800",
};

export default function PaginaBaseDeDatos() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-usb-verde">Base de datos</h2>
        <p className="text-sm text-gray-600">
          Modelo relacional de 7 tablas en PostgreSQL (Supabase), normalizado hasta la tercera forma normal (3FN).
        </p>
      </div>

      <AvisoAcademico />

      <section className="tarjeta p-5" aria-label="Descargas">
        <h3 className="titulo-seccion">Descargas</h3>
        <p className="mt-1 text-sm text-gray-600">
          Script para crear las tablas, sus restricciones y cargar los datos ficticios (listo para el SQL Editor de Supabase).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="boton-primario" href="/datacommerce_fase1.sql" download>
            ⬇ Descargar script de la base de datos (.sql)
          </a>
          <a className="boton-secundario" href="/datacommerce_consultas.sql" download>
            ⬇ Descargar consultas de análisis (.sql)
          </a>
        </div>
      </section>

      <section className="tarjeta p-5" aria-label="Diagrama entidad-relación">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="titulo-seccion">Diagrama entidad-relación</h3>
          <a className="boton-secundario !py-1.5 text-xs" href="/modelo-er.png" target="_blank" rel="noreferrer">
            Abrir en tamaño completo
          </a>
        </div>
        <div className="mt-3 overflow-x-auto rounded-lg ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/modelo-er.png"
            alt="Diagrama entidad-relación con las 7 tablas: ciudades, categorias, productos, clientes, vendedores, ventas y detalle_venta"
            className="min-w-[760px] bg-white"
          />
        </div>
      </section>

      <section aria-label="Tablas">
        <h3 className="titulo-seccion mb-3">Tablas y campos</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TABLAS.map((t) => (
            <article key={t.nombre} className="tarjeta overflow-hidden">
              <header className={`${COLOR_GRUPO[t.grupo]} px-4 py-3 text-white`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-mono text-base font-bold">{t.nombre}</h4>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">{GRUPOS[t.grupo]}</span>
                </div>
                <p className="mt-1 text-xs text-white/85">{t.descripcion}</p>
              </header>
              <ul className="divide-y divide-gray-100 text-sm">
                {t.columnas.map((c) => (
                  <li key={c.nombre} className="px-4 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        {c.claves.map((k) => (
                          <span key={k} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${COLOR_CLAVE[k]}`}>
                            {k}
                          </span>
                        ))}
                        <span className={`font-mono ${c.claves.includes("PK") ? "font-bold" : ""}`}>{c.nombre}</span>
                      </span>
                      <span className="font-mono text-xs text-gray-500">{c.tipo}</span>
                    </div>
                    <p className="text-xs text-gray-500">{c.nota}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="tarjeta p-5" aria-label="Relaciones">
        <h3 className="titulo-seccion">Relaciones (todas 1 a N)</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-3 font-semibold">Clave foránea</th>
                <th className="py-2 pr-3 font-semibold">Referencia a</th>
                <th className="py-2 font-semibold">Lectura</th>
              </tr>
            </thead>
            <tbody>
              {RELACIONES.map((r) => (
                <tr key={r.fk} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs">{r.fk}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{r.referencia}</td>
                  <td className="py-2">{r.lectura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 rounded-lg bg-usb-fondo p-3 text-sm text-gray-700">
          <strong>Relación N:M resuelta:</strong> entre <code>ventas</code> y <code>productos</code> la relación real es de muchos
          a muchos (una venta lleva varios productos y un producto está en muchas ventas). Se resuelve con la tabla intermedia{" "}
          <code>detalle_venta</code>, que la convierte en dos relaciones 1 a N.
        </p>
      </section>
    </div>
  );
}
