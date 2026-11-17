import type { NextRequest } from "next/server";
import { CATALOGO, ejecutarConsulta } from "@/lib/consultas";
import { respuestaError } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * GET /api/consultas            → lista del catálogo (sin SQL)
 * GET /api/consultas?id=c3      → ejecuta SOLO una consulta del catálogo
 *
 * El navegador nunca envía SQL: solo el identificador. Así las consultas no se pueden editar.
 */
export async function GET(req: NextRequest) {
  const idConsulta = req.nextUrl.searchParams.get("id");

  if (!idConsulta) {
    return Response.json(
      CATALOGO.map(({ id, numero, titulo, pregunta }) => ({ id, numero, titulo, pregunta })),
    );
  }

  const consulta = CATALOGO.find((c) => c.id === idConsulta);
  if (!consulta) {
    return Response.json({ error: "no_encontrada", mensaje: "La consulta solicitada no existe." }, { status: 404 });
  }

  try {
    const resultado = await ejecutarConsulta(consulta);
    return Response.json(resultado, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return respuestaError(err);
  }
}
