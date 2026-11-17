"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PESTANAS = [
  { href: "/", etiqueta: "Dashboard" },
  { href: "/base-de-datos", etiqueta: "Base de datos" },
  { href: "/consultas", etiqueta: "Consultas" },
];

export default function Encabezado() {
  const ruta = usePathname();

  return (
    <header className="bg-usb-verde text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Universidad Simón Bolívar · Ingeniería de Sistemas · Big Data
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">DataCommerce Analytics S.A.S.</h1>
            <p className="text-sm text-white/80">Sistema inteligente de análisis comercial · Ejercicio académico</p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
            Datos ficticios · 2025
          </span>
        </div>

        <nav aria-label="Secciones" className="-mb-px flex gap-1 overflow-x-auto">
          {PESTANAS.map((p) => {
            const activa = p.href === "/" ? ruta === "/" : ruta.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={activa ? "page" : undefined}
                className={
                  "whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-semibold transition " +
                  (activa ? "bg-usb-fondo text-usb-verde" : "text-white/85 hover:bg-white/10 hover:text-white")
                }
              >
                {p.etiqueta}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="franja-usb" />
    </header>
  );
}
