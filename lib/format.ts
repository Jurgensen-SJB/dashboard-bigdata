const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const fCOP = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/** $27.330.000 */
export const cop = (n: number) => fCOP.format(n);

/** $27,3 M  ·  $850 mil */
export function copCorto(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
  if (abs >= 1_000) return `$${Math.round(n / 1_000).toLocaleString("es-CO")} mil`;
  return `$${Math.round(n)}`;
}

export const pct = (n: number, d = 1) =>
  `${n.toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d })} %`;

export const entero = (n: number) => Math.round(n).toLocaleString("es-CO");

/** '2025-03' → 'Mar 2025' */
export function mesLargo(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MESES[m - 1]} ${y}`;
}

/** '2025-03' → 'Mar' */
export function mesCorto(ym: string): string {
  const m = Number(ym.split("-")[1]);
  return MESES[m - 1];
}
