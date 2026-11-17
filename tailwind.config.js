/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta tomada de la franja institucional de la Universidad Simón Bolívar
        usb: {
          verde: "#04662C",
          hoja: "#0A7E38",
          esmeralda: "#048E61",
          cielo: "#10A9E6",
          fondo: "#F3F7F4",
          tinta: "#12261A",
        },
      },
      boxShadow: {
        tarjeta: "0 1px 2px rgba(4,102,44,0.08), 0 4px 14px rgba(4,102,44,0.06)",
      },
    },
  },
  plugins: [],
};
