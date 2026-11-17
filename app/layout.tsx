import type { Metadata, Viewport } from "next";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import TarjetaAutor from "@/components/TarjetaAutor";
import AvisoAcademico from "@/components/AvisoAcademico";

export const metadata: Metadata = {
  title: "DataCommerce Analytics · Dashboard ejecutivo",
  description:
    "Ejercicio académico de Big Data: modelo relacional, consultas SQL y dashboard ejecutivo de DataCommerce Analytics S.A.S.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#04662C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <Encabezado />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6">{children}</main>
        <footer className="border-t border-usb-verde/15 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <AvisoAcademico variante="franja" />
          </div>
          <div className="franja-usb" />
        </footer>
        <TarjetaAutor />
      </body>
    </html>
  );
}
