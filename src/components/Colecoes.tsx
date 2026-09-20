import { COLLECTIONS } from "@/data/site";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export function Colecoes() {
  return (
    <section id="colecoes" className="py-16 md:py-24">
      <div className="page-pad">
        <Reveal>
          <p className="mb-3 text-[0.7rem] tracking-[0.32em] text-[#c9a090] uppercase">Coleções</p>
          <h2 className="font-display max-w-xl text-[clamp(2rem,8vw,4.4rem)] leading-[1.05] md:leading-[0.92]">
            Linha completa para vestir o dia.
          </h2>
        </Reveal>
      </div>

      <div className="mt-10 md:mt-14">
        <div className="rail mx-auto flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 md:grid md:max-w-[1180px] md:grid-cols-4 md:gap-5 md:overflow-visible md:px-5 min-[1240px]:px-0">
        {COLLECTIONS.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 80}
            className={`piece w-[min(78vw,19rem)] shrink-0 snap-center sm:w-[min(48vw,22rem)] md:w-auto ${index % 2 === 1 ? "md:mt-10" : ""}`}
          >
            <a href={item.href} className="block">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: item.radius }}>
                <Photo src={item.src} alt={item.title} className="photo object-cover" sizes="(min-width:768px) 22vw, 80vw" />
              </div>
              <h3 className="font-display mt-4 text-[1.35rem] leading-tight md:text-[1.7rem]">{item.title}</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[#8a7468]">{item.note}</p>
            </a>
          </Reveal>
        ))}
        </div>
      </div>

      <div className="page-pad mt-10">
        <a
          href="#destaques"
          className="btn-shine inline-flex rounded-full bg-[#1c1512] px-6 py-3.5 text-[0.72rem] tracking-[0.14em] text-[#f6f0ea] uppercase"
        >
          Ver catálogo
        </a>
      </div>
    </section>
  );
}
