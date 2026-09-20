import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const brand = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Joias Gheller",
  title: "Joias Gheller | Folheados e Prata — Porto Alegre",
  description:
    "27 anos de marca e fabricação própria. Folheados a ouro 18k, ródio e prata 925. Av. Alberto Bins, 452 — Centro Histórico.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gheller",
  },
  formatDetection: {
    telephone: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1c1512",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body className="antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
