# DataCommerce Analytics · Dashboard web

> **Aviso importante.** Este proyecto es un **ejercicio académico**, desarrollado con fines exclusivos de estudio y
> análisis para la tarea **«DataCommerce Analytics S.A.S.»** de la asignatura **Big Data** (Universidad Simón Bolívar,
> Ingeniería de Sistemas). Todos los datos son ficticios. **No se recomienda ni se autoriza** el uso de esta base de datos,
> de su modelo ni de su contenido con fines profesionales, comerciales o de producción.

**Elaborado por:** Sneider Gabriel Jurgensen Barinaga · **Docente:** Leydi Yaritza Martinez Pardo

---

## 1. ¿Qué es este proyecto?

Es la última parte de la tarea: un sitio web que se conecta **en vivo** a la base de datos PostgreSQL alojada en Supabase
(la misma que se diseñó en el script `datacommerce_fase1.sql`) y muestra la información de negocio en cuatro pestañas:

| Pestaña | Ruta | Qué muestra |
|---|---|---|
| **Dashboard** | `/` | Indicadores (KPIs), filtros, gráficos, mapa de Colombia, comparativas y clientes premium. |
| **Base de datos** | `/base-de-datos` | Aviso académico, diagrama entidad-relación, detalle de las 7 tablas, relaciones y descarga del `.sql`. |
| **Consultas** | `/consultas` | Las 10 consultas del análisis: se elige una, se ejecuta y se muestra el resultado con su análisis. |
| **Plan de mejoramiento** | `/plan-mejoramiento` | Estrategias comerciales, matriz DOFA, plan de acción T1–T4, cronograma, cuadro de mando de metas y gestión de riesgos. |

Además, en la esquina inferior derecha hay una tarjeta fija «Elaborado por» (se puede minimizar) y en el pie de todas las
páginas aparece el aviso académico.

Los colores salen de la franja institucional de la universidad: `#04662C`, `#0A7E38`, `#048E61` y `#10A9E6`.

## 2. Tecnologías

| Pieza | Tecnología | Para qué |
|---|---|---|
| Aplicación | **Next.js 15** (React 19 + TypeScript) | Páginas y API en un solo proyecto; se despliega directo en Vercel. |
| Estilos | **Tailwind CSS 3** | Diseño responsive (celular y computador). |
| Gráficos | **Recharts 3** | Líneas, barras, dona y combinados. |
| Mapa | **d3-geo** + SVG | Mapa de Colombia con burbujas por ciudad (sin servicios externos de mapas). |
| Base de datos | **PostgreSQL en Supabase** + librería `pg` | Lectura de datos desde el servidor. |
| Hosting | **Vercel** | Publicación. |

## 3. Cómo funciona (arquitectura)

```
Navegador  ──►  API de Next.js en Vercel (/api/dashboard, /api/consultas)  ──►  Supabase (usuario de solo lectura)
```

1. El navegador **nunca** habla con la base de datos. Pide los datos a la API del propio proyecto.
2. La API se conecta a Supabase usando la variable de entorno `DATABASE_URL` (que solo existe en el servidor).
3. `/api/dashboard` recibe los filtros (mes desde/hasta, ciudad, categoría, vendedor), los valida y los envía como
   **parámetros** a las consultas SQL. Nunca se concatena texto del usuario dentro del SQL.
4. `/api/consultas` recibe únicamente el **identificador** de una consulta (`c1`…`c10`). El SQL vive en el servidor
   (`lib/consultas.ts`), por eso nadie puede editarlo ni ejecutar SQL propio.

## 4. Seguridad

| Medida | Dónde |
|---|---|
| Usuario `dashboard_ro` con permiso únicamente de `SELECT` y sesiones de solo lectura | `sql/seguridad.sql` |
| RLS (Row Level Security) activa en las 7 tablas | `sql/seguridad.sql` |
| La clave pública de Supabase (`anon`) pierde acceso a las tablas | `sql/seguridad.sql` |
| Límite de 8 segundos por consulta | `sql/seguridad.sql` |
| La cadena de conexión no se sube al repositorio | `.gitignore` + variables de entorno de Vercel |
| Filtros validados y parametrizados | `app/api/dashboard/route.ts`, `lib/dashboard.ts` |
| Consultas fijas, identificadas por código | `app/api/consultas/route.ts`, `lib/consultas.ts` |
| El sitio pide a los buscadores no indexarlo | `app/layout.tsx` |

### ¿`.env` y `seguridad.sql` son lo mismo?

**No. Son dos cosas distintas y se necesitan las dos:**

| | `.env.local` / variables de entorno | `sql/seguridad.sql` |
|---|---|---|
| **Qué es** | El lugar donde se guarda la **cadena de conexión** (`DATABASE_URL`). | Un script SQL que prepara la **base de datos**. |
| **Dónde se usa** | En tu computador (`.env.local`) y en Vercel (Environment Variables). | Se ejecuta **una vez** en el SQL Editor de Supabase. |
| **Qué logra** | Le dice al sitio **a qué base** y **con qué usuario** conectarse. | Crea ese usuario (`dashboard_ro`) con permisos de solo lectura y protege las tablas. |

Primero se ejecuta `seguridad.sql` (crea el usuario y su clave) y luego esa clave se pone dentro de `DATABASE_URL`.

## 5. Estructura del proyecto

```
datacommerce-dashboard/
├─ app/
│  ├─ layout.tsx                  Encabezado con pestañas, pie con aviso y tarjeta del autor
│  ├─ page.tsx                    Pestaña 1: Dashboard
│  ├─ globals.css                 Estilos y paleta institucional
│  ├─ base-de-datos/page.tsx      Pestaña 2
│  ├─ consultas/page.tsx          Pestaña 3
│  └─ api/
│     ├─ dashboard/route.ts       Datos del dashboard (con filtros)
│     └─ consultas/route.ts       Ejecuta una consulta del catálogo por su código
├─ components/
│  ├─ Encabezado.tsx · TarjetaAutor.tsx · AvisoAcademico.tsx
│  ├─ dashboard/                  Filtros, KPIs, gráficos, mapa, tabla premium
│  └─ consultas/Explorador.tsx    Lista de consultas + resultado + análisis
├─ lib/
│  ├─ db.ts                       Conexión a PostgreSQL (pool) y manejo de errores
│  ├─ dashboard.ts                SQL del dashboard (filtros parametrizados)
│  ├─ consultas.ts                Catálogo de las 10 consultas + texto de análisis
│  ├─ sql-consultas.json          SQL de las consultas (mismo de datacommerce_consultas.sql)
│  ├─ esquema.ts                  Descripción de las tablas para la pestaña 2
│  ├─ colombia-geo.json           Geometría del mapa
│  └─ format.ts · colores.ts · tipos.ts
├─ public/
│  ├─ datacommerce_fase1.sql      Script de la base de datos (descargable)
│  ├─ datacommerce_consultas.sql  Consultas de análisis (descargable)
│  └─ modelo-er.png               Diagrama entidad-relación
├─ sql/seguridad.sql              Usuario de solo lectura + RLS (se ejecuta en Supabase)
├─ scripts/generar-mapa.mjs       (Opcional) regenera lib/colombia-geo.json
├─ .env.example                   Plantilla de variables de entorno
├─ DESPLIEGUE.md                  Guía paso a paso para publicar en Vercel
└─ README.md                      Este archivo
```

## 6. Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Cadena de conexión de Supabase (Transaction pooler, puerto 6543) con el usuario `dashboard_ro.<PROJECT_REF>`. |

Se copia `.env.example` como `.env.local` y se completa. En Vercel se crea la misma variable en
*Settings → Environment Variables*. Detalle en [`DESPLIEGUE.md`](./DESPLIEGUE.md).

## 7. Ejecutar en tu computador

Requisitos: Node.js 20.9 o superior y haber ejecutado antes los scripts SQL en Supabase.

```bash
npm install
cp .env.example .env.local     # en Windows: copy .env.example .env.local   → luego edita DATABASE_URL
npm run dev                    # http://localhost:3000
```

Para probar la versión de producción: `npm run build` y luego `npm start`.

## 8. Cómo modificarlo

- **Datos del autor:** `components/TarjetaAutor.tsx` y `components/Encabezado.tsx`.
- **Textos del aviso académico:** `components/AvisoAcademico.tsx`.
- **Agregar o cambiar una consulta:** `lib/consultas.ts` (el SQL, el texto de análisis y el gráfico se definen allí).
- **Colores:** `tailwind.config.js` y `lib/colores.ts`.
- **Nota:** los párrafos de análisis son texto fijo escrito para los datos del ejercicio. Si cambias los datos de la
  base, hay que actualizar esos textos.

## 9. Cómo se verificó

El proyecto se compiló sin errores y se probó contra una copia exacta de la base de datos con el usuario de solo
lectura. Las cifras coinciden con las ejecutadas en Supabase: total vendido $27.330.000, utilidad $7.275.000
(margen 26,6 %), 26 ventas, promedio nacional por ciudad $3.416.250 y 4 clientes premium (62 % de los ingresos).
