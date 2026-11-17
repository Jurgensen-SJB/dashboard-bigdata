import type { Metadata } from "next";
import Explorador from "@/components/consultas/Explorador";

export const metadata: Metadata = { title: "Consultas · DataCommerce Analytics" };

export default function PaginaConsultas() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-usb-verde">Consultas de análisis</h2>
        <p className="text-sm text-gray-600">
          Elige una pregunta de negocio: la consulta SQL se ejecuta sobre la base de datos y se muestra su resultado con el
          análisis. Las consultas son fijas y no se pueden editar.
        </p>
      </div>
      <Explorador />
    </div>
  );
}
