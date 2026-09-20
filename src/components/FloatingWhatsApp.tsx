import { SITE } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function FloatingWhatsApp() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp da Joias Gheller"
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition hover:-translate-y-0.5 md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      <WhatsAppIcon />
    </a>
  );
}
