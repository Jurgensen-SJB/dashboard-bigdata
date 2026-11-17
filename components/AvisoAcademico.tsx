export default function AvisoAcademico({ variante = "banner" }: { variante?: "banner" | "franja" }) {
  if (variante === "franja") {
    return (
      <p className="text-xs leading-relaxed text-gray-600">
        <strong className="text-usb-verde">Aviso académico:</strong> este sitio y su base de datos son un ejercicio de
        estudio y análisis para la tarea «DataCommerce Analytics S.A.S.» (Big Data). Todos los datos son ficticios. No se
        recomienda ni se autoriza su uso con fines profesionales, comerciales o de producción.
      </p>
    );
  }

  return (
    <div role="note" className="rounded-xl border-l-4 border-usb-cielo bg-white p-5 shadow-tarjeta ring-1 ring-black/5">
      <p className="text-sm font-bold uppercase tracking-wide text-usb-verde">Aviso importante</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        Este sitio y su base de datos son un <strong>ejercicio académico</strong>, desarrollado con fines exclusivos de
        estudio y análisis para la tarea <strong>«DataCommerce Analytics S.A.S.»</strong> de la asignatura Big Data
        (Universidad Simón Bolívar). Todos los datos son ficticios. <strong>No se recomienda ni se autoriza</strong> el uso
        de esta base de datos, de su modelo ni de su contenido con fines profesionales, comerciales o de producción.
      </p>
    </div>
  );
}
