import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Joias Gheller",
    short_name: "Gheller",
    description:
      "27 anos de marca e fabricação própria. Folheados a ouro 18k, ródio e prata 925. Av. Alberto Bins, 452 — Centro Histórico, Porto Alegre.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f0ea",
    theme_color: "#1c1512",
    lang: "pt-BR",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Coleções", short_name: "Coleções", url: "/#colecoes" },
      { name: "Catálogo", short_name: "Catálogo", url: "/#destaques" },
      { name: "Loja", short_name: "Loja", url: "/#onde" },
    ],
  };
}
