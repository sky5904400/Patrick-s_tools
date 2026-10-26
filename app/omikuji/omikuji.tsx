"use client";

import { useState } from "react";

type Level = "大吉" | "吉" | "小吉" | "小凶" | "凶" | "大凶";

type Fortune = {
  summary: string;
  color: string;
  details: [string, string][];
};

const FORTUNES: Record<Level, Fortune> = {
  大吉: {
    summary: "萬事如意，福星高照。今日所願皆有回應，把握機會大膽前進。",
    color: "text-red-700",
    details: [
      ["願望", "必定實現，心想事成"],
      ["工作", "表現亮眼，貴人相助"],
      ["戀愛", "良緣到來，真心相待"],
      ["金運", "財源廣進，意外之財"],
      ["健康", "精神飽滿，活力充沛"],
      ["失物", "很快就會找到"],
    ],
  },
  吉: {
    summary: "運勢順遂，穩步向上。保持誠心與努力，好事自然到來。",
    color: "text-red-600",
    details: [
      ["願望", "稍待時日，終將實現"],
      ["工作", "順利推進，小有成果"],
      ["戀愛", "感情和睦，互相扶持"],
      ["金運", "收支平穩，宜適度儲蓄"],
      ["健康", "身體安康，注意作息"],
      ["失物", "在意想不到的地方出現"],
    ],
  },
  小吉: {
    summary: "小小幸運伴隨左右。不求一步登天，踏實累積便有收穫。",
    color: "text-orange-600",
    details: [
      ["願望", "小願可成，大願需耐心"],
      ["工作", "按部就班，勿急於求成"],
      ["戀愛", "多些主動，會有好消息"],
      ["金運", "小有進帳，切忌揮霍"],
      ["健康", "大致良好，多喝水"],
      ["失物", "仔細找找身邊"],
    ],
  },
  小凶: {
    summary: "略有波折，謹慎為上。凡事多想一步，便能化險為夷。",
    color: "text-slate-600",
    details: [
      ["願望", "時機未到，暫且等待"],
      ["工作", "易有小失誤，再三確認"],
      ["戀愛", "言語需溫和，避免誤會"],
      ["金運", "不宜衝動購物"],
      ["健康", "小心著涼，早點休息"],
      ["失物", "不容易找到，先別急"],
    ],
  },
  凶: {
    summary: "運勢低迷，宜靜不宜動。沉澱自我，等待雲開見日。",
    color: "text-slate-700",
    details: [
      ["願望", "難以如願，換個方向試試"],
      ["工作", "阻礙較多，尋求協助"],
      ["戀愛", "保持距離，冷靜相處"],
      ["金運", "守財為要，勿借貸"],
      ["健康", "注意身體警訊"],
      ["失物", "恐難尋回"],
    ],
  },
  大凶: {
    summary: "物極必反，否極泰來。今日低谷正是轉運的開始，切莫灰心。",
    color: "text-neutral-900",
    details: [
      ["願望", "今日不宜，改日再求"],
      ["工作", "諸事不順，按兵不動"],
      ["戀愛", "易起爭執，退一步海闊天空"],
      ["金運", "謹防破財，看緊荷包"],
      ["健康", "多加休息，不可逞強"],
      ["失物", "隨緣，或許另有收穫"],
    ],
  },
};

const LEVELS = Object.keys(FORTUNES) as Level[];
const LUCKY_COLORS = ["朱紅", "金黃", "翠綠", "天藍", "櫻粉", "純白", "紫藤", "墨黑"];
const LUCKY_DIRECTIONS = ["東", "南", "西", "北", "東南", "西南", "東北", "西北"];
const DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const SHAKE_MS = 1500;
const STICK_MS = 900;

function toKanjiNumber(n: number) {
  if (n === 100) return "百";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const tensPart = tens === 0 ? "" : tens === 1 ? "十" : `${DIGITS[tens]}十`;
  return tensPart + (ones === 0 ? "" : DIGITS[ones]);
}

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

type Draw = {
  level: Level;
  number: number;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
};

type Stage = "idle" | "shaking" | "stick" | "result";

export default function Omikuji() {
  const [stage, setStage] = useState<Stage>("idle");
  const [draw, setDraw] = useState<Draw | null>(null);
  const [tied, setTied] = useState(false);

  function drawFortune() {
    if (stage === "shaking" || stage === "stick") return;
    setTied(false);
    setDraw({
      level: pick(LEVELS),
      number: 1 + Math.floor(Math.random() * 100),
      luckyColor: pick(LUCKY_COLORS),
      luckyNumber: 1 + Math.floor(Math.random() * 9),
      luckyDirection: pick(LUCKY_DIRECTIONS),
    });
    setStage("shaking");
    window.setTimeout(() => setStage("stick"), SHAKE_MS);
    window.setTimeout(() => setStage("result"), SHAKE_MS + STICK_MS);
  }

  const fortune = draw ? FORTUNES[draw.level] : null;
  const isBad = draw ? draw.level.includes("凶") : false;
  const busy = stage === "shaking" || stage === "stick";

  return (
    <main className="relative flex flex-1 flex-col items-center overflow-hidden bg-[#fbf3e4] px-4 pb-16 text-stone-800">
      {/* Torii gate */}
      <div className="pointer-events-none mt-6 w-[min(520px,92vw)]" aria-hidden="true">
        <div className="h-4 rounded-t-[50%] bg-stone-900" />
        <div className="mx-[-4%] h-5 rounded-sm bg-[#c8102e] shadow" />
        <div className="relative mx-[8%] mt-5 h-3 bg-[#c8102e]">
          <div className="absolute -top-5 left-1/2 flex h-12 w-14 -translate-x-1/2 items-center justify-center border-2 border-stone-900 bg-stone-900 font-serif text-lg font-bold text-amber-300 [writing-mode:vertical-rl]">
            御籤
          </div>
        </div>
        <div className="mx-[12%] flex justify-between">
          <div className="h-24 w-5 bg-[#c8102e]" />
          <div className="h-24 w-5 bg-[#c8102e]" />
        </div>
      </div>

      <h1 className="-mt-16 mb-1 font-serif text-4xl font-black tracking-[0.3em] text-[#c8102e]">
        御神籤
      </h1>
      <p className="mb-8 font-serif text-sm tracking-[0.3em] text-stone-500">誠心祈願，抽出今日運勢</p>

      {stage !== "result" && (
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex h-64 items-end justify-center">
            {stage === "stick" && draw && (
              <div className="absolute bottom-40 z-0 flex h-36 w-5 animate-stick-rise items-start justify-center rounded-t-sm bg-[#e8c88f] pt-2 font-serif text-xs font-bold text-stone-800 shadow [writing-mode:vertical-rl]">
                第{toKanjiNumber(draw.number)}番
              </div>
            )}
            {/* Hexagonal omikuji box */}
            <div
              className={`relative z-10 flex h-48 w-28 origin-bottom flex-col items-center justify-center rounded-md border-4 border-stone-900 bg-gradient-to-r from-[#8b5a2b] via-[#b07a43] to-[#8b5a2b] shadow-xl ${
                stage === "shaking" ? "animate-shake" : ""
              }`}
            >
              <div className="absolute -top-3 h-4 w-8 rounded-full border-2 border-stone-900 bg-stone-800" />
              <div className="flex h-32 w-14 items-center justify-center border-2 border-stone-900 bg-[#fbf3e4] font-serif text-2xl font-black text-[#c8102e] [writing-mode:vertical-rl]">
                御神籤
              </div>
            </div>
          </div>

          <button
            onClick={drawFortune}
            disabled={busy}
            className="rounded-sm border-2 border-stone-900 bg-[#c8102e] px-10 py-3 font-serif text-xl font-bold tracking-[0.3em] text-white shadow-[4px_4px_0_#1c1917] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#1c1917] disabled:cursor-wait disabled:opacity-60"
          >
            {stage === "shaking" ? "搖籤中…" : stage === "stick" ? "出籤了…" : "抽籤"}
          </button>
        </div>
      )}

      {stage === "result" && draw && fortune && (
        <div className="flex flex-col items-center gap-6">
          <article
            className={`relative w-[min(420px,92vw)] origin-top animate-unroll border-x-[10px] border-y-[3px] border-[#c8102e] bg-[#fffaf0] p-6 font-serif shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 ${
              tied ? "scale-y-[0.15] opacity-60" : ""
            }`}
            aria-live="polite"
          >
            <header className="flex items-start justify-between border-b-2 border-dashed border-[#c8102e]/50 pb-4">
              <div className="text-sm leading-relaxed text-stone-500 [writing-mode:vertical-rl]">
                第{toKanjiNumber(draw.number)}番
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm tracking-[0.5em] text-stone-500">今日運勢</span>
                <span className={`text-7xl font-black tracking-widest ${fortune.color}`}>
                  {draw.level}
                </span>
              </div>
              <div className="text-sm leading-relaxed text-stone-500 [writing-mode:vertical-rl]">
                神明指引
              </div>
            </header>

            <p className="my-4 text-center leading-relaxed">{fortune.summary}</p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t-2 border-dashed border-[#c8102e]/50 pt-4 text-sm">
              {fortune.details.map(([label, text]) => (
                <div key={label} className="flex gap-2">
                  <dt className="shrink-0 font-bold text-[#c8102e]">【{label}】</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex justify-around rounded-sm bg-[#c8102e]/10 py-2 text-sm">
              <span>幸運色：{draw.luckyColor}</span>
              <span>幸運數字：{draw.luckyNumber}</span>
              <span>吉方位：{draw.luckyDirection}</span>
            </div>

            <div className="absolute -right-3 -bottom-3 flex h-14 w-14 rotate-12 items-center justify-center rounded-md border-2 border-[#c8102e] bg-[#fffaf0] text-xs font-bold leading-tight text-[#c8102e]">
              <span className="text-center">神社<br />之印</span>
            </div>
          </article>

          {tied ? (
            <p className="max-w-sm text-center font-serif text-stone-600">
              🎋 已將籤綁在神社的樹枝上，壞運勢就留在這裡，願明日好運到來。
            </p>
          ) : isBad ? (
            <p className="max-w-sm text-center font-serif text-sm text-stone-500">
              傳說抽到凶籤時，把籤綁在神社的樹上，就能把壞運留下。
            </p>
          ) : (
            <p className="max-w-sm text-center font-serif text-sm text-stone-500">
              好籤請帶在身上，讓好運一路相隨。
            </p>
          )}

          <div className="flex gap-3">
            {isBad && !tied && (
              <button
                onClick={() => setTied(true)}
                className="rounded-sm border-2 border-stone-900 bg-white px-5 py-2 font-serif font-bold shadow-[3px_3px_0_#1c1917] hover:-translate-y-0.5"
              >
                🎋 綁在樹上
              </button>
            )}
            <button
              onClick={drawFortune}
              className="rounded-sm border-2 border-stone-900 bg-[#c8102e] px-5 py-2 font-serif font-bold text-white shadow-[3px_3px_0_#1c1917] hover:-translate-y-0.5"
            >
              再抽一次
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
