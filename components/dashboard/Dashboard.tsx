"use client";

import { useEffect, useState } from "react";
import type { DatosDashboard, FiltrosDashboard } from "@/lib/tipos";
import Filtros from "./Filtros";
import Kpis from "./Kpis";
import Panel from "./Panel";
import MapaColombia from "./MapaColombia";
import TablaPremium from "./TablaPremium";
import {
  CiudadesVsPromedio,
  DonaCategorias,
  GraficoCiudades,
  GraficoMensual,
  IngresosVsMargen,
  TicketVsEquipo,
  TopProductos,
  TopVendedores,
} from "./Graficos";

const SIN_FILTROS: FiltrosDashboard = { desde: "", hasta: "", ciudad: "", categoria: "", vendedor: "" };

interface ErrorApi {
  codigo: string;
  mensaje: string;
}

export default function Dashboard() {
  const [filtros, setFiltros] = useState<FiltrosDashboard>(SIN_FILTROS);
  const [datos, setDatos] = useState<DatosDashboard | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<ErrorApi | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    setCargando(true);
    setError(null);

    const qs = new URLSearchParams();
    (Object.entries(filtros) as [string, string][]).forEach(([k, v]) => v && qs.set(k, v));

    fetch(`/api/dashboard?${qs.toString()}`, { signal: ac.signal })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw json;
        setDatos(json as DatosDashboard);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError({
          codigo: e?.error ?? "desconocido",
          mensaje: e?.mensaje ?? "No fue posible cargar los datos del dashboard.",
        });
      })
      .finally(() => {
        if (!ac.signal.aborted) setCargando(false);
      });

    return () => ac.abort();
  }, [filtros, intento]);

  // Clic en una ciudad / categoría / vendedor = activar o quitar ese filtro
  const alternar = (campo: "ciudad" | "categoria" | "vendedor") => (id: number) =>
    setFiltros((f) => ({ ...f, [campo]: f[campo] === String(id) ? "" : String(id) }));

  if (error && !datos) {
    return (
      <div className="tarjeta mx-auto mt-6 max-w-2xl border-l-4 border-red-500 p-6">
        <h2 className="text-lg font-bold text-red-700">No se pudo cargar el dashboard</h2>
        <p className="mt-2 text-sm text-gray-700">{error.mensaje}</p>
        {error.codigo === "sin_configuracion" && (
          <p className="mt-2 text-sm text-gray-600">
            Configura la variable <code className="rounded bg-gray-100 px-1">DATABASE_URL</code> (archivo{" "}
            <code className="rounded bg-gray-100 px-1">.env.local</code> o variables de entorno de Vercel). Guía: DESPLIEGUE.md.
          </p>
        )}
        {error.codigo === "no_disponible" && (
          <p className="mt-2 text-sm text-gray-600">
            Entra a tu proyecto en Supabase y, si aparece pausado, usa «Restore project». Después pulsa Reintentar.
          </p>
        )}
        <button className="boton-primario mt-4" onClick={() => setIntento((n) => n + 1)}>
          Reintentar
        </button>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="tarjeta h-32 animate-pulse bg-white" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tarjeta h-24 animate-pulse" />
          ))}
        </div>
        <div className="tarjeta h-80 animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`space-y-5 transition-opacity ${cargando ? "opacity-60" : "opacity-100"}`} aria-busy={cargando}>
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error.mensaje}{" "}
          <button className="font-semibold underline" onClick={() => setIntento((n) => n + 1)}>
            Reintentar
          </button>
        </div>
      )}

      <Filtros filtros={filtros} opciones={datos.opciones} onCambio={setFiltros} />
      <Kpis k={datos.kpis} mensual={datos.mensual} />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel titulo="Ingresos y utilidad por mes" subtitulo="Evolución mensual de 2025">
            <GraficoMensual datos={datos.mensual} />
          </Panel>
          <Panel titulo="Ventas por ciudad" subtitulo="La línea punteada es el promedio nacional por ciudad. Clic en una barra para filtrar.">
            <GraficoCiudades
              ciudades={datos.ciudades}
              promedio={datos.promedios.ingresosPorCiudad}
              seleccion={filtros.ciudad}
              onSelect={alternar("ciudad")}
            />
          </Panel>
        </div>
        <Panel titulo="Mapa de ventas" subtitulo="Ubicación de las ventas en Colombia" className="lg:self-start">
          <MapaColombia ciudades={datos.ciudades} seleccion={filtros.ciudad} onSelect={alternar("ciudad")} />
        </Panel>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Panel titulo="Participación por categoría" subtitulo="Porcentaje de los ingresos">
          <DonaCategorias categorias={datos.categorias} seleccion={filtros.categoria} onSelect={alternar("categoria")} />
        </Panel>
        <Panel titulo="Top vendedores" subtitulo="Por ingresos generados">
          <TopVendedores vendedores={datos.vendedores} seleccion={filtros.vendedor} onSelect={alternar("vendedor")} />
        </Panel>
        <Panel titulo="Productos estratégicos" subtitulo="Los 6 que más ingresos generan" className="md:col-span-2 xl:col-span-1">
          <TopProductos productos={datos.productos} />
        </Panel>
      </div>

      <section aria-label="Comparativas">
        <h2 className="titulo-seccion mb-3">Comparativas</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Panel titulo="Ciudades vs. promedio nacional" subtitulo="Diferencia porcentual frente al promedio por ciudad">
            <CiudadesVsPromedio ciudades={datos.ciudades} promedio={datos.promedios.ingresosPorCiudad} />
          </Panel>
          <Panel titulo="Ingresos vs. margen por categoría" subtitulo="Barras: ingresos · Línea: margen de utilidad">
            <IngresosVsMargen categorias={datos.categorias} />
          </Panel>
          <Panel titulo="Ticket por vendedor vs. promedio del equipo" subtitulo="Valor medio de cada venta" className="md:col-span-2 xl:col-span-1">
            <TicketVsEquipo vendedores={datos.vendedores} promedio={datos.promedios.ticketPorVendedor} />
          </Panel>
        </div>
      </section>

      <Panel titulo="Clientes potencialmente premium" subtitulo="Segmentación por valor, frecuencia y recencia">
        <TablaPremium filas={datos.premium} resumen={datos.premiumResumen} />
      </Panel>
    </div>
  );
}
