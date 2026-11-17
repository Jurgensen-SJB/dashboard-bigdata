import Link from "next/link";

export default function NotFound() {
  return (
    <div className="tarjeta mx-auto max-w-lg p-8 text-center space-y-4 my-12">
      <h2 className="text-3xl font-extrabold text-usb-verde">404</h2>
      <h3 className="text-lg font-bold text-gray-800">Página no encontrada</h3>
      <p className="text-sm text-gray-600">
        La ruta que intentas consultar no existe o fue movida.
      </p>
      <div className="pt-2">
        <Link href="/" className="boton-primario">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
