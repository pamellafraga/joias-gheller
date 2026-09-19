import { SITE } from "@/data/site";
import { Reveal } from "@/components/Reveal";

export function FinalCta() {
  return (
    <section className="px-4 pb-14 md:px-8">
      <Reveal>
        <div
          className="relative mx-auto max-w-[1180px] overflow-hidden bg-[#1c1512] px-8 py-16 text-center text-[#f6f0ea] md:px-20 md:py-24"
          style={{ borderRadius: "2rem 3.8rem 1.4rem 3.2rem" }}
        >
          <p className="mb-4 text-[0.7rem] tracking-[0.32em] text-[#c9a090] uppercase">Atendimento</p>
          <h2 className="font-display mx-auto max-w-3xl text-[clamp(2.3rem,5.5vw,4.6rem)] leading-[0.92]">
            Peça no WhatsApp ou visite a loja.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/65">
            Pagamento em até 6x sem juros no cartão · boleto com 10% · garantia nas peças.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex rounded-full bg-[#c9a090] px-8 py-3.5 text-[0.72rem] font-semibold tracking-[0.14em] text-[#1c1512] uppercase"
            >
              Falar com a Gheller
            </a>
            <a
              href="#destaques"
              className="inline-flex rounded-full border border-white/25 px-8 py-3.5 text-[0.72rem] tracking-[0.14em] uppercase transition hover:bg-white/10"
            >
              Ver catálogo
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
