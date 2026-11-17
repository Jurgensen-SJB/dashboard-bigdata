"use client";

import { useEffect, useState } from "react";

export default function TarjetaAutor() {
  const [abierta, setAbierta] = useState(true);

  // En pantallas pequeñas arranca minimizada para no tapar el contenido
  useEffect(() => {
    if (window.innerWidth < 768) setAbierta(false);
  }, []);

  if (!abierta) {
    return (
      <button
        onClick={() => setAbierta(true)}
        aria-label="Mostrar autor del proyecto"
        className="fixed bottom-4 right-4 z-50 rounded-full bg-usb-verde px-4 py-2 text-xs font-semibold text-white shadow-lg ring-2 ring-white transition hover:bg-usb-hoja"
      >
        Elaborado por
      </button>
    );
  }

  return (
    <aside
      aria-label="Autor del proyecto"
      className="fixed bottom-4 right-4 z-50 w-[19rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-white text-sm shadow-xl ring-1 ring-black/10"
    >
      <div className="franja-usb" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-usb-esmeralda">Elaborado por</p>
          <button
            onClick={() => setAbierta(false)}
            aria-label="Minimizar"
            className="-mr-1 -mt-1 rounded px-2 text-lg leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            –
          </button>
        </div>
        <p className="mt-1 font-bold text-usb-tinta">Sneider Gabriel Jurgensen Barinaga</p>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          Tarea: <strong>DataCommerce Analytics S.A.S.</strong>
          <br />
          Asignatura: Big Data · Ingeniería de Sistemas
          <br />
          Docente: Leydi Yaritza Martinez Pardo
          <br />
          Universidad Simón Bolívar
        </p>
      </div>
    </aside>
  );
}
