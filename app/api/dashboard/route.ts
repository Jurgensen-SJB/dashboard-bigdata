import type { NextRequest } from "next/server";
import { obtenerDashboard } from "@/lib/dashboard";
import { respuestaError } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** 'YYYY-MM' → 'YYYY-MM-01' (o null si no es válido) */
function mes(valor: string | null): string | null {
  return valor && /^\d{4}-(0[1-9]|1[0-2])$/.test(valor) ? `${valor}-01` : null;
}

/** Entero positivo o null */
function id(valor: string | null): number | null {
  return valor && /^\d{1,9}$/.test(valor) ? Number(valor) : null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    const datos = await obtenerDashboard({
      desde: mes(sp.get("desde")),
      hasta: mes(sp.get("hasta")),
      ciudad: id(sp.get("ciudad")),
      categoria: id(sp.get("categoria")),
      vendedor: id(sp.get("vendedor")),
    });
    return Response.json(datos, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return respuestaError(err);
  }
}
