import { Pool, types } from "pg";

// Tipos numéricos de PostgreSQL → números de JavaScript
types.setTypeParser(1700, (v) => parseFloat(v)); // NUMERIC
types.setTypeParser(20, (v) => parseInt(v, 10)); // BIGINT (COUNT)
types.setTypeParser(1082, (v) => v); // DATE se entrega como texto 'YYYY-MM-DD'

declare global {
  // eslint-disable-next-line no-var
  var __dcPool: Pool | undefined;
}

export class ErrorConexion extends Error {
  constructor(
    public codigo: "sin_configuracion" | "no_disponible" | "autenticacion" | "consulta",
    mensaje: string,
  ) {
    super(mensaje);
  }
}

function crearPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new ErrorConexion(
      "sin_configuracion",
      "Falta la variable de entorno DATABASE_URL. Revisa el archivo DESPLIEGUE.md.",
    );
  }

  const esLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);
  // 'sslmode' dentro de la URL pisa la opción ssl de 'pg', por eso se elimina y se maneja aquí.
  const urlLimpia = url.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, "");

  return new Pool({
    connectionString: urlLimpia,
    ssl: esLocal ? false : { rejectUnauthorized: false },
    max: 4,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  });
}

export function getPool(): Pool {
  if (!globalThis.__dcPool) globalThis.__dcPool = crearPool();
  return globalThis.__dcPool;
}

export async function consultar<T = Record<string, unknown>>(texto: string, params: unknown[] = []): Promise<T[]> {
  try {
    const r = await getPool().query(texto, params);
    return r.rows as T[];
  } catch (err) {
    throw traducirError(err);
  }
}

export function traducirError(err: unknown): ErrorConexion {
  if (err instanceof ErrorConexion) return err;
  const e = err as { code?: string; message?: string };
  console.error("[db]", e.code, e.message);
  if (e.code === "28P01" || e.code === "28000") {
    return new ErrorConexion("autenticacion", "La base de datos rechazó el usuario o la clave configurados.");
  }
  if (e.code === "ECONNREFUSED" || e.code === "ENOTFOUND" || e.code === "ETIMEDOUT" || /timeout|terminated/i.test(e.message ?? "")) {
    return new ErrorConexion(
      "no_disponible",
      "No fue posible conectar con la base de datos. Si usas el plan gratuito de Supabase, es posible que el proyecto esté pausado.",
    );
  }
  return new ErrorConexion("consulta", "Ocurrió un error al ejecutar la consulta.");
}

export function respuestaError(err: unknown) {
  const e = traducirError(err);
  const estado = e.codigo === "consulta" ? 500 : 503;
  return Response.json({ error: e.codigo, mensaje: e.message }, { status: estado });
}
