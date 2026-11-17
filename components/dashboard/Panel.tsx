export default function Panel({
  titulo,
  subtitulo,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`tarjeta p-4 sm:p-5 ${className}`}>
      <h3 className="titulo-seccion">{titulo}</h3>
      {subtitulo && <p className="mt-0.5 text-xs text-gray-500">{subtitulo}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function SinDatos() {
  return <p className="py-10 text-center text-sm text-gray-500">No hay ventas con los filtros seleccionados.</p>;
}
