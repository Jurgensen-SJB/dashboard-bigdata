/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 'pg' usa módulos nativos de Node: se deja fuera del empaquetado del servidor
  serverExternalPackages: ["pg"],
  poweredByHeader: false,
};

export default nextConfig;
