import Dashboard from "@/components/dashboard/Dashboard";

export default function PaginaDashboard() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-usb-verde">Dashboard ejecutivo</h2>
        <p className="text-sm text-gray-600">
          Indicadores calculados en vivo desde la base de datos PostgreSQL (Supabase). Usa los filtros para explorar.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
