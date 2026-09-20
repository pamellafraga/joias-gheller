"use client";

import { useEffect, useState } from "react";
import { NAV, SITE, type NavHref } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NavHref | "#inicio">("#inicio");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > last && y > 120 && !open);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const ids = ["inicio", "colecoes", "destaques", "marca", "onde"];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        setActive(`#${visible.target.id}` as NavHref | "#inicio");
      },
      { threshold: [0.2, 0.4], rootMargin: "-16% 0px -48% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] pt-[env(safe-area-inset-top)] transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled || open
            ? "bg-[#1c1512]/90 text-[#f6f0ea] shadow-[0_16px_40px_rgba(28,21,18,0.22)] backdrop-blur-xl"
            : "bg-transparent text-white"
        }`}
      >
        <div className="page-pad flex h-[4.25rem] items-center justify-between md:h-[5rem]">
          <a href="#inicio" className="font-brand text-[1.65rem] md:text-[2.1rem]" onClick={() => setOpen(false)}>
            gheller
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-[0.68rem] tracking-[0.18em] uppercase ${
                  active === item.href ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-[#c9a090] transition-transform duration-500 ${
                    active === item.href ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            ))}
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn-shine rounded-full bg-[#c9a090] px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.12em] text-[#1c1512] uppercase"
            >
              WhatsApp
            </a>
          </nav>
          <button
            className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-5 bg-current transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-px w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute h-px w-5 bg-current transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[#1c1512] px-6 pt-[calc(6.5rem+env(safe-area-inset-top))] pb-[calc(2rem+env(safe-area-inset-bottom))] text-[#f6f0ea] transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex min-w-0 flex-col gap-5">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-[clamp(2rem,10vw,3rem)] leading-tight italic"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="mt-4 text-sm tracking-[0.16em] text-[#c9a090] uppercase">
            {SITE.instagramHandle}
          </a>
        </div>
      </div>
    </>
  );
}
