import type { Metadata } from "next";
import BackHomeLink from "../back-home-link";
import LuckyWheel from "./lucky-wheel";

export const metadata: Metadata = {
  title: "轉盤抽獎",
  description: "輸入名單，轉動轉盤抽出得獎者",
};

export default function WheelPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[radial-gradient(ellipse_at_center,#15803d_0%,#14532d_45%,#052e16_100%)] px-4 py-10 text-amber-50">
      <BackHomeLink className="border border-amber-400/70 bg-black/40 text-amber-200 hover:bg-black/60" />
      <h1 className="mb-2 bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-700 bg-clip-text font-serif text-5xl font-black tracking-widest text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
        幸運大轉盤
      </h1>
      <p className="mb-8 font-serif text-sm tracking-[0.4em] text-amber-300/80">
        ♠ ♥ LUCKY WHEEL ♦ ♣
      </p>
      <LuckyWheel />
    </main>
  );
}
