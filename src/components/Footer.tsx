import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="pb-5">
      <div className="page-pad flex flex-col gap-3 border-t border-[#1c1512]/10 pt-5 text-xs text-[#8a7468] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <strong className="font-brand text-2xl text-[#1c1512]">gheller</strong>
          <p className="max-w-full">
            {SITE.fullName} · {SITE.address.neighborhood} · desenvolvido por{" "}
            <a
              href="https://www.xpresssolutions.com.br/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1c1512]/75 underline-offset-2 transition hover:text-[#c9a090] hover:underline"
            >
              Xpress Solutions
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-[#1c1512]">
            Instagram
          </a>
          <a href={`tel:${SITE.phoneTel}`} className="hover:text-[#1c1512]">
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </footer>
  );
}
