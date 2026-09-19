import { TICKER } from "@/data/site";

export function Ticker() {
  const loop = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-y border-[#1c1512]/8 bg-[#fbf7f2]/80 py-3.5 backdrop-blur-sm">
      <div className="ticker-track gap-10 pr-10 text-[0.7rem] tracking-[0.28em] text-[#1c1512]/55 uppercase">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            {item}
            <i className="font-display text-lg not-italic text-[#c9a090]">◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}
