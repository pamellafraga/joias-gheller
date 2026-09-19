import type { Metadata } from "next";
import { Fraunces, Outfit, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Joias Gheller | Folheados e Prata — Porto Alegre",
  description:
    "27 anos de marca e fabricação própria. Folheados a ouro 18k, ródio e prata 925. Av. Alberto Bins, 452 — Centro Histórico.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${brand.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
