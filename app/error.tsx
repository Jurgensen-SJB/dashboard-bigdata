"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error.message?.includes("Loading chunk") ||
      error.message?.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError"
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="tarjeta mx-auto my-12 max-w-lg p-6 text-center space-y-4">
      <h2 className="text-xl font-bold text-red-600">Ha ocurrido un problema al cargar</h2>
      <p className="text-sm text-gray-600">
        {error.message || "Se produjo una desincronización de recursos en el navegador."}
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => window.location.reload()}
          className="boton-primario"
        >
          Recargar página
        </button>
        <button
          onClick={() => reset()}
          className="boton-secundario"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
