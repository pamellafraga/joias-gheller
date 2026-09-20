"use client";

import { useMemo, useState } from "react";
import catalog from "@/data/catalog.json";
import { whatsappProduct } from "@/data/site";
import { Photo } from "@/components/Photo";

type CatalogItem = {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  tag: string;
  src: string;
};

const PAGE_SIZE = 16;
const LOAD_MORE = 8;
const ALL = catalog as CatalogItem[];

function formatBRL(value: number) {
  const [reais, cents] = value.toFixed(2).split(".");
  const grouped = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${grouped},${cents}`;
}

function formatCount(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parcelLabel(priceLabel: string) {
  const n = Number(priceLabel.replace(/[^\d,]/g, "").replace(",", "."));
  if (!Number.isFinite(n)) return "À vista";
  const parcels = Math.min(6, Math.floor(n / 40));
  if (parcels < 2) return "À vista no Pix ou cartão";
  return `ou ${parcels}x de ${formatBRL(n / parcels)} sem juros`;
}

export function Destaques() {
  const filters = useMemo(() => {
    const tags = Array.from(new Set(ALL.map((p) => p.tag))).sort((a, b) => a.localeCompare(b, "pt-BR"));
    return ["Todos", ...tags];
  }, []);

  const [filter, setFilter] = useState("Todos");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((p) => {
      if (filter !== "Todos" && p.tag !== filter) return false;
      if (!q) return true;
      return p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
    });
  }, [filter, query]);

  const items = filtered.slice(0, visible);

  return (
    <section id="destaques" className="border-y border-[#1c1512]/06 bg-white py-16 md:py-24">
      <div className="page-pad min-w-0">
        <div>
          <p className="mb-3 text-[0.68rem] tracking-[0.28em] text-[#8a7468] uppercase">Catálogo</p>
          <h2 className="font-display text-[clamp(1.85rem,8vw,3.6rem)] leading-[1.05] text-[#1c1512] md:leading-[0.95]">
            Todos os produtos
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#8a7468]">
            {formatCount(ALL.length)} peças Gheller — consulte disponibilidade e peça pelo WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setFilter(item);
                    setVisible(PAGE_SIZE);
                  }}
                  className={`shrink-0 border px-4 py-2 text-[0.65rem] tracking-[0.14em] uppercase transition ${
                    active
                      ? "border-[#1c1512] bg-[#1c1512] text-white"
                      : "border-[#1c1512]/12 text-[#1c1512]/70 hover:border-[#1c1512]/35"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Buscar produtos</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Buscar no catálogo…"
              className="w-full border border-[#1c1512]/12 bg-[#f7f5f2] px-4 py-2.5 text-sm outline-none transition focus:border-[#c9a090]"
            />
          </label>
        </div>

        <p className="mt-5 text-[0.72rem] tracking-[0.08em] text-[#8a7468]">
          Exibindo {items.length} de {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
        </p>

        <div className="mt-8 grid min-w-0 grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {items.map((product) => (
            <a
              key={product.id}
              href={whatsappProduct(product.title, product.price)}
              target="_blank"
              rel="noreferrer"
              className="product-card group flex h-full flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f7f5f2]">
                <span className="absolute top-2 left-2 z-10 max-w-[75%] truncate bg-white/90 px-2 py-1 text-[0.52rem] tracking-[0.12em] text-[#1c1512] uppercase backdrop-blur-sm md:top-3 md:left-3 md:px-2.5 md:text-[0.58rem] md:tracking-[0.14em]">
                  {product.tag}
                </span>
                <Photo
                  src={product.src}
                  alt={product.title}
                  className="photo object-contain p-3 transition duration-700 ease-out group-hover:scale-[1.04] md:p-8"
                  sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 48vw"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-[#1c1512] py-3 text-center text-[0.62rem] tracking-[0.2em] text-white uppercase transition duration-500 group-hover:translate-y-0 md:block">
                  Pedir no WhatsApp
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col pt-3 md:pt-4">
                <h3 className="text-[0.78rem] leading-snug font-medium tracking-[0.02em] break-words text-[#1c1512] md:text-[0.88rem]">
                  {product.title}
                </h3>
                <p className="mt-3 text-[0.95rem] font-semibold tracking-tight text-[#1c1512] md:text-[1.02rem]">
                  {product.price}
                </p>
                <p className="mt-1 text-[0.68rem] text-[#8a7468]">{parcelLabel(product.price)}</p>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-[#8a7468]">Nenhum produto encontrado para esta busca.</p>
        )}

        {visible < filtered.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + LOAD_MORE)}
              className="w-full border border-[#1c1512] px-6 py-3.5 text-center text-[0.68rem] tracking-[0.14em] text-[#1c1512] uppercase transition hover:bg-[#1c1512] hover:text-white sm:w-auto sm:px-8 sm:tracking-[0.18em]"
            >
              Carregar mais ({filtered.length - visible} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
