import { SITE } from "@/data/site";
import { Reveal } from "@/components/Reveal";

export function Local() {
  return (
    <section id="onde" className="py-16 md:py-24">
      <div className="page-pad grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="mb-4 text-[0.7rem] tracking-[0.32em] text-[#c9a090] uppercase">Loja</p>
          <h2 className="font-display text-[clamp(2.3rem,5vw,4.4rem)] leading-[0.9]">Alberto Bins, 452.</h2>
          <p className="mt-5 text-[#1c1512]/72">{SITE.address.full}</p>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-[#c9a090] uppercase">Telefone / WhatsApp</dt>
              <dd className="mt-1 text-lg">{SITE.phoneDisplay}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-[#c9a090] uppercase">E-mail</dt>
              <dd className="mt-1">{SITE.email}</dd>
            </div>
            <div>
              <dt className="text-[0.65rem] tracking-[0.2em] text-[#c9a090] uppercase">Revenda</dt>
              <dd className="mt-1">Consulte descontos para compras acima de 30 peças.</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SITE.maps}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#1c1512]/15 px-5 py-3 text-[0.68rem] tracking-[0.16em] uppercase transition hover:bg-[#1c1512] hover:text-white"
            >
              Como chegar
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#1c1512]/15 px-5 py-3 text-[0.68rem] tracking-[0.16em] uppercase transition hover:bg-[#1c1512] hover:text-white"
            >
              {SITE.instagramHandle}
            </a>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#1c1512]/15 px-5 py-3 text-[0.68rem] tracking-[0.16em] uppercase transition hover:bg-[#1c1512] hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="min-h-[340px] overflow-hidden md:min-h-[460px]" style={{ borderRadius: "2.4rem 1rem 3rem 1.2rem" }}>
            <iframe
              title="Mapa da Joias Gheller na Av. Alberto Bins"
              src={SITE.mapsEmbed}
              className="h-full min-h-[340px] w-full border-0 md:min-h-[460px]"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
