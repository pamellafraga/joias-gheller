export const SITE = {
  name: "gheller",
  fullName: "Joias Gheller",
  tagline: "Folheados, prata e personalidade.",
  line: "27 anos de marca e fabricação própria — peças que vestem o brilho de quem as usa.",
  phoneDisplay: "(51) 3557-9332",
  phoneTel: "+555135579332",
  email: "contato@gheller.com.br",
  whatsapp:
    "https://wa.me/555135579332?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20Joias%20Gheller%20e%20queria%20conhecer%20as%20pe%C3%A7as.",
  whatsappBase: "https://wa.me/555135579332?text=",
  instagram: "https://www.instagram.com/joiasghellerpoa/",
  instagramHandle: "@joiasghellerpoa",
  maps: "https://www.google.com/maps/search/?api=1&query=Av.+Alberto+Bins+452+Centro+Hist%C3%B3rico+Porto+Alegre",
  mapsEmbed:
    "https://maps.google.com/maps?q=Av.%20Alberto%20Bins%2C%20452%2C%20Centro%20Hist%C3%B3rico%2C%20Porto%20Alegre&t=&z=16&ie=UTF8&iwloc=&output=embed",
  address: {
    street: "Av. Alberto Bins, 452",
    neighborhood: "Centro Histórico",
    city: "Porto Alegre",
    state: "RS",
    cep: "90030-140",
    full: "Av. Alberto Bins, 452 — Centro Histórico, Porto Alegre/RS · CEP 90030-140",
  },
  pillars: [
    { title: "Acabamento", note: "Do design ao último retoque — cada peça com mão de fábrica." },
    { title: "Matéria-prima", note: "Ouro 18k folheado, ródio e prata 925 escolhidos no polo nacional." },
    { title: "Essência", note: "Joia que transparece o brilho de quem usa — não só o metal." },
  ],
} as const;

export function whatsappProduct(title: string, price: string) {
  const msg = `Olá! Vim pelo site da Joias Gheller e tenho interesse em: ${title} (${price}).`;
  return `${SITE.whatsappBase}${encodeURIComponent(msg)}`;
}

export const NAV = [
  { href: "#colecoes", label: "Coleções" },
  { href: "#destaques", label: "Destaques" },
  { href: "#marca", label: "A marca" },
  { href: "#onde", label: "Loja" },
] as const;

export type NavHref = (typeof NAV)[number]["href"];

export const TICKER = [
  "Folheados 18k",
  "Prata 925",
  "Ródio",
  "Coleção Aurum",
  "Revenda",
  "Centro Histórico",
  "27 anos",
] as const;

export const COLLECTIONS = [
  {
    src: "/fotos/corrente.jpg",
    title: "Correntes & gargantilhas",
    note: "Camadas, chokers e pedras naturais para o dia a dia.",
    href: "#destaques",
    radius: "2.4rem 0.8rem 2.8rem 0.8rem",
  },
  {
    src: "/fotos/brincos.jpg",
    title: "Brincos & argolas",
    note: "Cravejados, lisos, pérola e piercing fake.",
    href: "#destaques",
    radius: "0.8rem 2.6rem 0.8rem 2.6rem",
  },
  {
    src: "/fotos/anel.jpg",
    title: "Anéis",
    note: "Pérola, infantil, pedras naturais e cravejados.",
    href: "#destaques",
    radius: "2.8rem 2.8rem 0.7rem 0.7rem",
  },
  {
    src: "/fotos/pulseira.jpg",
    title: "Pulseiras",
    note: "Braceletes, pingentes e linhas infantis.",
    href: "#destaques",
    radius: "1rem 1rem 3rem 3rem",
  },
] as const;
