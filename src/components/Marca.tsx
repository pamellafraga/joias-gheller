import { SITE } from "@/data/site";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function Marca() {
  return (
    <section id="marca" className="overflow-hidden py-16 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="relative min-h-[360px]">
          <div className="relative h-[70vw] min-h-[260px] max-h-[580px] w-full overflow-hidden md:h-[66vh] md:rounded-r-[4rem]">
            <Photo src="/fotos/loja.jpg" alt="Ambiente da Joias Gheller" className="object-cover" sizes="(min-width:1024px) 55vw, 100vw" />
          </div>
          <div
            className="absolute right-[8%] -bottom-5 h-36 w-28 overflow-hidden border-[5px] border-[#f6f0ea] md:h-44 md:w-36"
            style={{ borderRadius: "42% 58% 48% 52%" }}
          >
            <Photo src="/fotos/revenda.jpg" alt="Campanha Gheller" className="object-cover object-center" sizes="160px" />
          </div>
        </Reveal>

        <Reveal delay={120} className="page-pad pb-8 lg:pl-2">
          <p className="mb-4 text-[0.7rem] tracking-[0.32em] text-[#c9a090] uppercase">A marca</p>
          <h2 className="font-display text-[clamp(2rem,8vw,4.2rem)] leading-[1.05] md:leading-[0.92]">
            27 anos de fábrica e olhar de mulher.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-[#1c1512]/72">
            A Joias Gheller valoriza acabamento, matéria-prima e a essência de quem usa. Folheados a ouro 18k, ródio e
            prata 925 — do polo nacional de folheados para a Av. Alberto Bins.
          </p>
          <ul className="mt-10 space-y-6">
            {SITE.pillars.map((pillar) => (
              <li key={pillar.title} className="border-l-2 border-[#c9a090]/50 pl-4">
                <h3 className="font-display text-2xl">{pillar.title}</h3>
                <p className="mt-1 text-sm text-[#8a7468]">{pillar.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
