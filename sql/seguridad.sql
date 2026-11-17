-- =====================================================================
-- DataCommerce Analytics S.A.S. · Seguridad para el dashboard
--
-- QUÉ HACE
--   1. Crea el usuario  dashboard_ro  que SOLO puede leer las 7 tablas.
--   2. Activa RLS (Row Level Security) en las 7 tablas y le da a
--      dashboard_ro una política de lectura.
--   3. Quita los permisos de  anon  y  authenticated  (los roles de la
--      API pública de Supabase) para que nadie pueda leer ni modificar
--      los datos usando la clave pública (anon key).
--
-- CÓMO EJECUTARLO
--   Supabase → SQL Editor → pega TODO este archivo → Run.
--   Hazlo UNA sola vez, DESPUÉS de haber creado las tablas y cargado los datos
--   (script datacommerce_fase1.sql).
--
-- ANTES DE EJECUTAR
--   Cambia  CAMBIAR_ESTA_CLAVE  (línea marcada con  <<<  ) por una clave larga
--   y segura. Esa clave es la que irá dentro de DATABASE_URL.
--   Evita los caracteres  @ : / ? # %  para no tener que codificarlos en la URL.
--
-- Es seguro volver a ejecutarlo: no duplica nada.
-- =====================================================================


-- 1) Usuario de solo lectura ------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'dashboard_ro') THEN
    CREATE ROLE dashboard_ro LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

ALTER ROLE dashboard_ro WITH LOGIN PASSWORD 'CAMBIAR_ESTA_CLAVE';          -- <<< cambia la clave aquí
ALTER ROLE dashboard_ro SET default_transaction_read_only = on;            -- toda sesión es de solo lectura
ALTER ROLE dashboard_ro SET statement_timeout = '8s';                      -- ninguna consulta puede tardar más de 8 s


-- 2) Permisos mínimos ---------------------------------------------------
GRANT USAGE ON SCHEMA public TO dashboard_ro;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['ciudades', 'categorias', 'productos', 'clientes', 'vendedores', 'ventas', 'detalle_venta']
  LOOP
    -- Solo lectura para el dashboard
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM dashboard_ro', t);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO dashboard_ro', t);

    -- RLS activa + política de lectura únicamente para dashboard_ro
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS dashboard_ro_lectura ON public.%I', t);
    EXECUTE format('CREATE POLICY dashboard_ro_lectura ON public.%I FOR SELECT TO dashboard_ro USING (true)', t);

    -- La API pública de Supabase (anon / authenticated) pierde todo acceso
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', t);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM authenticated', t);
    END IF;
  END LOOP;
END $$;


-- 3) Verificación (opcional): debe mostrar rowsecurity = true en las 7 tablas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('ciudades', 'categorias', 'productos', 'clientes', 'vendedores', 'ventas', 'detalle_venta')
ORDER BY tablename;
