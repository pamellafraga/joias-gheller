import { SITE } from "@/data/site";
import { Photo } from "@/components/Photo";

export function Hero() {
  return (
    <section id="inicio" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <Photo src="/fotos/hero-v3.jpg" alt="" priority className="object-cover object-[68%_28%]" />
        <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(28,21,18,0.86)_0%,rgba(28,21,18,0.42)_38%,rgba(28,21,18,0.08)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1c1512]/35 to-transparent" />
      </div>

      <div className="hero-copy relative z-10 flex min-h-[100svh] w-full max-w-[40rem] flex-col justify-end px-5 pb-[max(4rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-[calc(7rem+env(safe-area-inset-top))] text-white sm:px-10 lg:px-16 lg:pb-20">
        <p className="mb-4 text-[0.65rem] tracking-[0.28em] text-[#e8cfc4] uppercase sm:text-[0.7rem] sm:tracking-[0.34em]">
          {SITE.address.neighborhood} · Porto Alegre
        </p>
        <h1 className="font-brand text-[clamp(3.1rem,18vw,8.8rem)] leading-[0.9]">gheller</h1>
        <p className="font-display mt-5 text-[1.35rem] leading-snug italic text-white/92 sm:mt-7 sm:text-2xl md:mt-8 md:text-3xl">
          {SITE.tagline}
        </p>
        <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-white/72 sm:text-[0.95rem]">{SITE.line}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="btn-shine rounded-full bg-[#c9a090] px-6 py-3.5 text-center text-[0.72rem] font-semibold tracking-[0.14em] text-[#1c1512] uppercase"
          >
            Falar no WhatsApp
          </a>
          <a
            href="#colecoes"
            className="rounded-full border border-white/30 px-6 py-3.5 text-center text-[0.72rem] tracking-[0.14em] uppercase transition hover:border-white hover:bg-white/10"
          >
            Ver coleções
          </a>
        </div>
      </div>
    </section>
  );
}
