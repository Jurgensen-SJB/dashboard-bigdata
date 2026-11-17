"use client";

import { useState } from "react";
import Link from "next/link";

type SeccionActiva = "todos" | "dofa" | "objetivos" | "acciones" | "cronograma" | "indicadores" | "riesgos";

export default function PlanMejoramiento() {
  const [seccion, setSeccion] = useState<SeccionActiva>("todos");
  const [filtroObjetivo, setFiltroObjetivo] = useState<"todos" | "OE1" | "OE2" | "OE3">("todos");

  return (
    <div className="space-y-8 pb-12">
      {/* ── Banner de bienvenida y descarga ── */}
      <section className="tarjeta overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-white via-white to-usb-fondo border-l-4 border-usb-verde">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-usb-verde/10 px-3 py-0.5 text-xs font-semibold text-usb-verde">
                Secciones 9 y 10 del documento
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-semibold text-sky-800">
                Horizonte a 12 meses (T1–T4)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-usb-verde tracking-tight">
              Plan Estratégico y de Mejoramiento Comercial
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Estrategias fundamentadas en datos reales de 2025 para maximizar los ingresos, elevar la rentabilidad por
              categoría, fidelizar clientes de alto valor y equilibrar el rendimiento territorial de DataCommerce
              Analytics S.A.S.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/documentacion_bigdata.pdf"
              download="documentacion_bigdata.pdf"
              className="boton-primario text-sm py-2.5 px-5 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Descargar informe completo (PDF)
            </a>
            <div className="flex items-center gap-2">
              <Link href="/" className="boton-secundario text-xs flex-1 justify-center py-2">
                Ir al Dashboard
              </Link>
              <Link href="/consultas" className="boton-secundario text-xs flex-1 justify-center py-2">
                Ver consultas SQL
              </Link>
            </div>
          </div>
        </div>

        {/* ── Metas globales de impacto ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Meta de Ingresos</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-usb-verde">$32,8 M</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+20 %</span>
            </div>
            <p className="mt-1 text-xs text-gray-600">Línea base 2025: $27,33 millones</p>
          </div>

          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Margen de Utilidad</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-usb-verde">28,0 %</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+1,4 pp</span>
            </div>
            <p className="mt-1 text-xs text-gray-600">Línea base 2025: 26,6 %</p>
          </div>

          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Utilidad Neta Proyectada</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-usb-verde">~$9,2 M</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+26 %</span>
            </div>
            <p className="mt-1 text-xs text-gray-600">Crecimiento estimado de ~$1,92M</p>
          </div>

          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Tasa de Recompra</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-usb-verde">≥ 90 %</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">6 Premium</span>
            </div>
            <p className="mt-1 text-xs text-gray-600">Línea base: 83,3 % (4 Premium)</p>
          </div>
        </div>
      </section>

      {/* ── Filtro rápido de vista ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">Ver:</span>
        {[
          { id: "todos", label: "Vista general completa" },
          { id: "dofa", label: "1. Matriz DOFA" },
          { id: "objetivos", label: "2. Objetivos estratégicos" },
          { id: "acciones", label: "3. Plan de acción" },
          { id: "cronograma", label: "4. Cronograma (T1–T4)" },
          { id: "indicadores", label: "5. Cuadro de mando" },
          { id: "riesgos", label: "6. Riesgos y seguimiento" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id as SeccionActiva)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              seccion === item.id
                ? "bg-usb-verde text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-black/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ── 1. MATRIZ DOFA ── */}
      {(seccion === "todos" || seccion === "dofa") && (
        <section className="tarjeta p-6 sm:p-7 space-y-5" id="dofa">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <p className="titulo-seccion">10.1 Diagnóstico de partida</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Matriz DOFA Comercial</h3>
            </div>
            <p className="text-xs text-gray-500 italic">
              Construida a partir de las 10 consultas SQL del análisis analítico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fortalezas */}
            <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50/40 p-5 ring-1 ring-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
                  F
                </span>
                Fortalezas
              </div>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Alta fidelidad inicial:</strong> El 83,3 % de los clientes (10 de 12) ha comprado más de una
                    vez en el año.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Segmento Premium valioso:</strong> Los 4 clientes Premium aportan el 62 % de los ingresos
                    ($16,95 millones).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Vendedor líder eficiente:</strong> Camila Rojas logra un ticket promedio de $1,56 millones por
                    venta en Bogotá.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Categorías de alto margen:</strong> Moda (43,3 %) y Hogar (35,6 %) tienen márgenes muy
                    superiores al promedio.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Infraestructura sólida:</strong> Cobertura en 8 ciudades con 6 vendedores y base de datos
                    normalizada (3FN) con dashboard en vivo.
                  </span>
                </li>
              </ul>
            </div>

            {/* Debilidades */}
            <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 p-5 ring-1 ring-amber-500/20">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white text-xs">
                  D
                </span>
                Debilidades
              </div>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Dependencia de Tecnología:</strong> Pesa el 58,9 % de las ventas pero deja el menor margen
                    comercial (21,7 %).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Concentración de producto:</strong> Un solo artículo (Portátil 15&quot;) concentra el 40,2 % de
                    todo lo vendido.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Riesgo en un solo cliente:</strong> Valentina Torres aporta ella sola el 28 % de todos los
                    ingresos de la empresa.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Dispersión de vendedores:</strong> Cuatro de los seis vendedores están por debajo del ticket
                    promedio del equipo ($1,05M).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Territorios desatendidos:</strong> Cartagena y Pereira carecen de vendedor propio y solo suman
                    el 4,4 % de las ventas.
                  </span>
                </li>
              </ul>
            </div>

            {/* Oportunidades */}
            <div className="rounded-xl border-l-4 border-sky-500 bg-sky-50/40 p-5 ring-1 ring-sky-500/20">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white text-xs">
                  O
                </span>
                Oportunidades
              </div>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Impulso a categorías rentables:</strong> Llevar Moda y Hogar del 12,9 % al 20 % de
                    participación multiplicaría el beneficio neto.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Potencial en Medellín:</strong> Ticket promedio de $1,23M con apenas 2 clientes registrados.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Expansión Costa Caribe:</strong> Barranquilla vende $3,73M con 1 cliente; Cartagena genera
                    $810.000 sin sede comercial fija.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Reactivación clave:</strong> Felipe Restrepo gastó $2,44M y no compra desde mayo (reactivable con
                    oferta directa).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Aplanamiento de estacionalidad:</strong> Campañas específicas para reactivar los meses valle de
                    junio ($600K) y octubre ($690K).
                  </span>
                </li>
              </ul>
            </div>

            {/* Amenazas */}
            <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/40 p-5 ring-1 ring-rose-500/20">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white text-xs">
                  A
                </span>
                Amenazas
              </div>
              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Volatilidad en picos:</strong> El 74,8 % del récord de noviembre ($5,88M) provino de una sola
                    compra de dos portátiles.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Sensibilidad ante fuga:</strong> La pérdida de un solo cliente Premium impactaría de inmediato
                    entre el 9 % y el 28 % de los ingresos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Poco margen de maniobra en tecnología:</strong> Con un 21,7 % de margen, no hay margen para
                    hacer guerras de precios o descuentos agresivos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Concentración territorial:</strong> Bogotá y una sola asesora representan el 39,9 % de toda la
                    facturación.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>
                    <strong>Escala muestral:</strong> Al basarse en 12 clientes y 26 compras, las variaciones individuales
                    impactan fuertemente los promedios.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. OBJETIVOS ESTRATÉGICOS ── */}
      {(seccion === "todos" || seccion === "objetivos") && (
        <section className="tarjeta p-6 sm:p-7 space-y-6" id="objetivos">
          <div className="border-b border-gray-100 pb-4">
            <p className="titulo-seccion">10.2 Alineación Estratégica</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              Objetivo General y Objetivos Específicos (OE)
            </h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-usb-verde">
              <strong>Objetivo General:</strong> Aumentar los ingresos de DataCommerce Analytics S.A.S. en un{" "}
              <strong>20 %</strong> (de <strong>$27,33M</strong> a cerca de <strong>$32,8 millones</strong>) y elevar el
              margen de utilidad global del <strong>26,6 % al 28,0 %</strong> en 12 meses, fidelizando a los clientes de
              mayor valor, optimizando la mezcla de ventas hacia categorías más rentables y fortaleciendo el territorio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-usb-verde transition">
              <span className="inline-block rounded-md bg-usb-verde text-white text-xs font-bold px-2.5 py-1">
                OE1
              </span>
              <h4 className="mt-3 font-bold text-gray-900 text-sm">
                Fidelizar a clientes premium y reactivar inactivos
              </h4>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Derivado de la Estrategia 1. Proteger el 62 % de los ingresos que generan los clientes VIP y recuperar a
                compradores como Felipe Restrepo e Isabela Marín.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                <span className="font-semibold text-usb-verde">Meta 12 meses:</span>
                <p className="text-gray-700 mt-0.5">Tasa de recompra ≥ 90 % y clientes Premium de 4 a 6.</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-usb-verde transition">
              <span className="inline-block rounded-md bg-usb-hoja text-white text-xs font-bold px-2.5 py-1">
                OE2
              </span>
              <h4 className="mt-3 font-bold text-gray-900 text-sm">
                Mover la mezcla hacia categorías de mayor margen
              </h4>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Derivado de la Estrategia 2. Venta cruzada y paquetes tecnológicos combinados con Moda (43,3 % margen) y
                Hogar (35,6 % margen), aprovechando el hábito multitab de los clientes.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                <span className="font-semibold text-usb-verde">Meta 12 meses:</span>
                <p className="text-gray-700 mt-0.5">Moda + Hogar del 12,9 % al 20 %; margen global al 28 %.</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-usb-verde transition">
              <span className="inline-block rounded-md bg-usb-cielo text-white text-xs font-bold px-2.5 py-1">
                OE3
              </span>
              <h4 className="mt-3 font-bold text-gray-900 text-sm">
                Reforzar el territorio y cerrar la brecha de ticket
              </h4>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                Derivado de la Estrategia 3. Impulso a Medellín y Costa Caribe, cobertura planificada en Cartagena y
                Pereira, y transferencia de mejores prácticas de venta de Camila y Andrés.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                <span className="font-semibold text-usb-verde">Meta 12 meses:</span>
                <p className="text-gray-700 mt-0.5">Ticket promedio a $1,20M y ventas Cartagena/Pereira al 8 %.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. PLAN DE ACCIÓN DETALLADO ── */}
      {(seccion === "todos" || seccion === "acciones") && (
        <section className="tarjeta p-6 sm:p-7 space-y-6" id="acciones">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <p className="titulo-seccion">10.3 Ejecución Operativa</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Plan de Acción Detallado</h3>
            </div>
            <div className="flex items-center gap-1 self-start sm:self-auto">
              {(["todos", "OE1", "OE2", "OE3"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroObjetivo(f)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    filtroObjetivo === f
                      ? "bg-usb-verde text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "todos" ? "Todos los OE" : f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-usb-verde text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-tl-lg">Objetivo</th>
                  <th className="p-3">Acción Concreta</th>
                  <th className="p-3">Responsable</th>
                  <th className="p-3">Plazo</th>
                  <th className="p-3 rounded-tr-lg">Indicador de Seguimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* OE1 */}
                {(filtroObjetivo === "todos" || filtroObjetivo === "OE1") && (
                  <>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-verde whitespace-nowrap">
                        <span className="rounded bg-usb-verde/10 px-2 py-0.5 text-xs text-usb-verde font-semibold">
                          OE1
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Programa VIP Premium:</strong> Crear el programa de
                        beneficios para clientes Premium (atención prioritaria, canal directo y descuentos por
                        recompra sin tocar margen de tecnología).
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Gerencia comercial</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                          T1
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">Clientes Premium inscritos: 4 de 4.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-verde whitespace-nowrap">
                        <span className="rounded bg-usb-verde/10 px-2 py-0.5 text-xs text-usb-verde font-semibold">
                          OE1
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Campaña de Reactivación:</strong> Contacto personalizado y
                        oferta a la medida para Felipe Restrepo e Isabela Marín, los dos clientes con una sola compra.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">
                        Jefe de ventas, Andrés Pardo y Laura Mejía
                      </td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                          T1–T2
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">Clientes reactivados: 2 de 2.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-verde whitespace-nowrap">
                        <span className="rounded bg-usb-verde/10 px-2 py-0.5 text-xs text-usb-verde font-semibold">
                          OE1
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Ascenso a Premium:</strong> Plan de acompañamiento para los 5
                        clientes calificados como &quot;Potencial premium&quot; para estimular su tercera compra.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Equipo de vendedores</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                          T2–T4
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">Clientes que ascienden a Premium: 2 o más.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-verde whitespace-nowrap">
                        <span className="rounded bg-usb-verde/10 px-2 py-0.5 text-xs text-usb-verde font-semibold">
                          OE1
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Mitigación de concentración:</strong> Reducir la dependencia
                        de un solo cliente ampliando la base de compradores corporativos de alto volumen.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Gerencia comercial</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                          T2–T4
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">Peso del mayor cliente: del 28 % al 20 % o menos.</td>
                    </tr>
                  </>
                )}

                {/* OE2 */}
                {(filtroObjetivo === "todos" || filtroObjetivo === "OE2") && (
                  <>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-hoja whitespace-nowrap">
                        <span className="rounded bg-usb-hoja/10 px-2 py-0.5 text-xs text-usb-hoja font-semibold">
                          OE2
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Paquetes cruzados (Bundles):</strong> Diseñar combos que
                        integren Tecnología con Moda u Hogar (ej. Portátil + Mochila/Chaqueta impermeable + Audífonos).
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">
                        Marketing y Gerencia comercial
                      </td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-teal-100 text-teal-800 font-bold px-2 py-0.5 text-xs">
                          T1–T2
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Participación de Moda + Hogar: del 12,9 % al 20 %.
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-hoja whitespace-nowrap">
                        <span className="rounded bg-usb-hoja/10 px-2 py-0.5 text-xs text-usb-hoja font-semibold">
                          OE2
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Comisión diferencial de incentivo:</strong> Aumentar el
                        porcentaje de comisión al vendedor por líneas facturadas en Moda y Hogar.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Gerencia comercial</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-teal-100 text-teal-800 font-bold px-2 py-0.5 text-xs">
                          T2
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">Margen global: de 26,6 % a 28 %.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-hoja whitespace-nowrap">
                        <span className="rounded bg-usb-hoja/10 px-2 py-0.5 text-xs text-usb-hoja font-semibold">
                          OE2
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Capacitación comercial:</strong> Entrenar al equipo en venta
                        cruzada tomando como caso de éxito las compras mixtas de Mariana, Carlos y Esteban.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Jefe de ventas</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-teal-100 text-teal-800 font-bold px-2 py-0.5 text-xs">
                          T2–T3
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Participación de Tecnología: normalizada de 58,9 % a ~52 %.
                      </td>
                    </tr>
                  </>
                )}

                {/* OE3 */}
                {(filtroObjetivo === "todos" || filtroObjetivo === "OE3") && (
                  <>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-cielo whitespace-nowrap">
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800 font-semibold">
                          OE3
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Captación en Medellín y Costa:</strong> Prospección activa de
                        clientes institucionales y comerciales en Antioquia, Barranquilla y Cartagena.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">
                        Jefe de ventas, Andrés Pardo y Daniela Ortega
                      </td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-sky-100 text-sky-800 font-bold px-2 py-0.5 text-xs">
                          T1–T4
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Clientes activos: al menos 3 en cada ciudad priorizada.
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-cielo whitespace-nowrap">
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800 font-semibold">
                          OE3
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Rutas comerciales en Cartagena y Pereira:</strong> Asignar
                        visitas presenciales periódicas desde Barranquilla (Daniela) y Cali (Laura).
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Gerencia comercial</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-sky-100 text-sky-800 font-bold px-2 py-0.5 text-xs">
                          T2–T4
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Aporte de Cartagena + Pereira: pasar de 4,4 % a 8 %.
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-cielo whitespace-nowrap">
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800 font-semibold">
                          OE3
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Clínica de ventas y nivelación:</strong> Transferir la
                        metodología de argumentación y cierre de Camila ($1,56M) y Andrés ($1,23M) a todo el equipo.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Jefe de ventas</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-sky-100 text-sky-800 font-bold px-2 py-0.5 text-xs">
                          T2–T3
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Ticket promedio general: de $1,05M a $1,20 millones.
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80">
                      <td className="p-3 align-top font-bold text-usb-cielo whitespace-nowrap">
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs text-sky-800 font-semibold">
                          OE3
                        </span>
                      </td>
                      <td className="p-3 align-top">
                        <strong className="text-gray-900">Activaciones en meses valle:</strong> Promociones temáticas
                        y campañas específicas para junio y octubre para evitar caídas pronunciadas.
                      </td>
                      <td className="p-3 align-top text-gray-700 whitespace-nowrap font-medium">Marketing</td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="rounded bg-sky-100 text-sky-800 font-bold px-2 py-0.5 text-xs">
                          T2 y T4
                        </span>
                      </td>
                      <td className="p-3 align-top text-gray-600">
                        Ventas en junio y octubre: $1,2 millones o más en cada mes.
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 4. CRONOGRAMA ANUAL ── */}
      {(seccion === "todos" || seccion === "cronograma") && (
        <section className="tarjeta p-6 sm:p-7 space-y-5" id="cronograma">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <p className="titulo-seccion">10.4 Plan de Implementación</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Cronograma Anual por Trimestres</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="flex h-3 w-3 rounded-full bg-usb-verde" />
              <span>Actividad programada</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-lg">Iniciativa Estratégica</th>
                  <th className="p-3 text-center w-24">T1 (Ene–Mar)</th>
                  <th className="p-3 text-center w-24">T2 (Abr–Jun)</th>
                  <th className="p-3 text-center w-24">T3 (Jul–Sep)</th>
                  <th className="p-3 text-center w-24 rounded-r-lg">T4 (Oct–Dic)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { nom: "Programa de beneficios para clientes Premium", t: [true, true, true, true] },
                  { nom: "Reactivación de clientes de una sola compra", t: [true, true, false, false] },
                  { nom: "Paquetes combinados Tecnología + Moda/Hogar", t: [true, true, false, false] },
                  { nom: "Comisión diferencial y capacitación en venta cruzada", t: [false, true, true, false] },
                  { nom: "Captación activa en Medellín y Costa Caribe", t: [true, true, true, true] },
                  { nom: "Apoyo comercial e itinerante a Cartagena y Pereira", t: [false, true, true, true] },
                  { nom: "Transferencia de prácticas de venta del equipo líder", t: [false, true, true, false] },
                  { nom: "Campañas de temporada para meses valle (junio y octubre)", t: [false, true, false, true] },
                  { nom: "Seguimiento mensual continuo con el dashboard", t: [true, true, true, true] },
                  { nom: "Evaluación final de resultados y ajuste del plan", t: [false, false, false, true] },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{row.nom}</td>
                    {row.t.map((activo, tidx) => (
                      <td key={tidx} className="p-3 text-center">
                        {activo ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-usb-verde text-white font-bold text-xs shadow-sm">
                            ●
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 5. CUADRO DE MANDO (KPIs Y METAS) ── */}
      {(seccion === "todos" || seccion === "indicadores") && (
        <section className="tarjeta p-6 sm:p-7 space-y-5" id="indicadores">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <p className="titulo-seccion">10.5 Cuadro de Mando Integral</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Indicadores Clave y Metas Propuestas</h3>
            </div>
            <p className="text-xs text-gray-500">
              Monitoreables directamente en el Dashboard y las consultas SQL
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-usb-verde text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-tl-lg">Indicador</th>
                  <th className="p-3">Línea Base 2025</th>
                  <th className="p-3">Meta Propuesta (12 meses)</th>
                  <th className="p-3 rounded-tr-lg">Fuente de Medición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    ind: "Ingresos totales",
                    act: "$27,33 millones",
                    meta: "$32,8 millones (+20 %)",
                    donde: "Dashboard principal y Consulta 6.1",
                    destacado: true,
                  },
                  {
                    ind: "Margen global de utilidad",
                    act: "26,6 %",
                    meta: "28,0 % (+1,4 pp)",
                    donde: "Dashboard (KPI Utilidad / Ingresos)",
                    destacado: true,
                  },
                  {
                    ind: "Participación de Moda + Hogar",
                    act: "12,9 %",
                    meta: "20,0 %",
                    donde: "Consulta 6.9 y Gráficos por categoría",
                  },
                  {
                    ind: "Participación de Tecnología",
                    act: "58,9 %",
                    meta: "Cerca de 52 %",
                    donde: "Consulta 6.9",
                  },
                  {
                    ind: "Tasa de recompra de clientes",
                    act: "83,3 %",
                    meta: "90 % o más",
                    donde: "Consulta 6.7 (Clientes recurrentes)",
                  },
                  {
                    ind: "Clientes clasificados como Premium",
                    act: "4 clientes",
                    meta: "6 clientes",
                    donde: "Consulta 7 (Modelo RFM)",
                  },
                  {
                    ind: "Peso del mayor cliente en los ingresos",
                    act: "28,0 % (Valentina)",
                    meta: "20 % o menos",
                    donde: "Consulta 7",
                  },
                  {
                    ind: "Ticket promedio del equipo de ventas",
                    act: "$1,05 millones",
                    meta: "$1,20 millones",
                    donde: "Consulta 6.4 y Dashboard",
                  },
                  {
                    ind: "Ventas de Cartagena + Pereira",
                    act: "4,4 % ($1,2M)",
                    meta: "8,0 %",
                    donde: "Consulta 6.1 y Mapa interactivo",
                  },
                  {
                    ind: "Ventas en meses valle (junio y octubre)",
                    act: "$0,60M y $0,69M",
                    meta: "$1,2 millones o más c/u",
                    donde: "Consulta 6.8 (Serie mensual)",
                  },
                  {
                    ind: "Clientes activos por ciudad priorizada",
                    act: "1 a 2 clientes",
                    meta: "3 o más clientes",
                    donde: "Dashboard (Mapa y filtros de ciudad)",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className={row.destacado ? "bg-usb-verde/5 font-semibold" : "hover:bg-gray-50"}>
                    <td className="p-3 text-gray-900">{row.ind}</td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">{row.act}</td>
                    <td className="p-3 font-bold text-usb-verde whitespace-nowrap">{row.meta}</td>
                    <td className="p-3 text-gray-600">{row.donde}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 6. MATRIZ DE RIESGOS Y EVALUACIÓN ── */}
      {(seccion === "todos" || seccion === "riesgos") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="riesgos">
          {/* Riesgos y mitigación */}
          <section className="tarjeta p-6 lg:col-span-2 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="titulo-seccion">10.6 Gestión de Riesgos</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Matriz de Riesgos y Mitigaciones</h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  riesgo: "Metas sobre muestra pequeña (12 clientes, 26 ventas)",
                  mitigacion: "Validar metas con la gerencia y recalibrarlas trimestralmente conforme ingresen nuevos datos.",
                  alerta: "Desviación superior al 30 % entre lo proyectado y lo real en T1.",
                },
                {
                  riesgo: "Resistencia del equipo comercial a la comisión diferencial",
                  mitigacion: "Demostrar con el dashboard la rentabilidad neta y acompañar con clínicas de ventas.",
                  alerta: "Las ventas de Moda y Hogar no muestran variación al cierre de T2.",
                },
                {
                  riesgo: "Descuentos de fidelización erosionan el margen neto",
                  mitigacion: "Limitar descuentos monetarios y privilegiar beneficios no arancelarios (atención prioritaria, asesoría).",
                  alerta: "Margen global cae por debajo de la línea base del 26,6 %.",
                },
                {
                  riesgo: "Persistencia de la alta concentración en pocos clientes",
                  mitigacion: "Campañas específicas de captación institucional en Medellín y Barranquilla.",
                  alerta: "El cliente principal sigue aportando más del 25 % de las ventas totales.",
                },
                {
                  riesgo: "Obsolescencia o retraso en la carga de datos del dashboard",
                  mitigacion: "Institucionalizar la actualización mensual designando un líder formal de BI.",
                  alerta: "Meses completos sin nuevas transacciones registradas en Supabase.",
                },
              ].map((r, i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3.5 ring-1 ring-black/5 text-xs sm:text-sm">
                  <p className="font-bold text-rose-800 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-600" />
                    {r.riesgo}
                  </p>
                  <p className="mt-1 text-gray-700">
                    <strong>Mitigación:</strong> {r.mitigacion}
                  </p>
                  <p className="mt-1 text-amber-800 text-xs">
                    <strong>⚠️ Señal de alerta:</strong> {r.alerta}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Seguimiento y Semáforo */}
          <section className="tarjeta p-6 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="titulo-seccion">10.7 Gobernanza y Control</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Seguimiento y Semáforo</h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="rounded-lg border-l-4 border-usb-verde bg-white p-3 shadow-sm ring-1 ring-black/5">
                <p className="font-bold text-usb-verde">📅 Rituales de Control</p>
                <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
                  <li>
                    <strong>Mensual:</strong> Actualización de base de datos y revisión de filtros por BI.
                  </li>
                  <li>
                    <strong>Trimestral:</strong> Reunión de balance con gerencia para calibrar OE1, OE2 y OE3.
                  </li>
                  <li>
                    <strong>Anual (T4):</strong> Evaluación de cumplimiento y lecciones aprendidas.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-2">Semáforo de Cumplimiento:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="h-4 w-4 rounded-full bg-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-900 text-xs">Verde: En Meta</p>
                      <p className="text-[11px] text-emerald-700">≥ 100 % de la meta del periodo.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="h-4 w-4 rounded-full bg-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-900 text-xs">Amarillo: Precaución</p>
                      <p className="text-[11px] text-amber-700">Entre el 80 % y el 99 % de avance.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-rose-50 border border-rose-200">
                    <span className="h-4 w-4 rounded-full bg-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold text-rose-900 text-xs">Rojo: Alerta Crítica</p>
                      <p className="text-[11px] text-rose-700">&lt; 80 % de cumplimiento.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
