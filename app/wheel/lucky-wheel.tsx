"use client";

import { useState } from "react";
import Fireworks from "./fireworks";

// Roulette-style slices: alternate red and black, with green to break a tie
// between the last and first slice when the count is odd.
const RED = "#b91c1c";
const BLACK = "#171717";
const GREEN = "#15803d";

const DEFAULT_NAMES = ["小明", "小華", "小美", "阿強", "小芳", "大雄"];

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 2;
const SPIN_MS = 5000;

const RIM_SIZE = 460;
const RIM_CENTER = RIM_SIZE / 2;
const BULB_COUNT = 24;

// Angle is measured in degrees, clockwise from 12 o'clock (where the pointer is).
function pointAt(angle: number, r: number, center = CENTER) {
  const rad = (angle * Math.PI) / 180;
  return [center + r * Math.sin(rad), center - r * Math.cos(rad)];
}

function slicePath(start: number, end: number) {
  const [x1, y1] = pointAt(start, RADIUS);
  const [x2, y2] = pointAt(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function sliceColor(index: number, count: number) {
  if (count % 2 === 1 && index === count - 1) return GREEN;
  return index % 2 === 0 ? RED : BLACK;
}

function truncate(name: string, max: number) {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

export default function LuckyWheel() {
  const [input, setInput] = useState(DEFAULT_NAMES.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pendingWinner, setPendingWinner] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [fireworksKey, setFireworksKey] = useState(0);

  const names = input
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);
  const count = names.length;
  const segment = count > 0 ? 360 / count : 360;
  const duplicates = [
    ...new Set(names.filter((name, i) => names.indexOf(name) !== i)),
  ];
  const hasDuplicates = duplicates.length > 0;

  function spin() {
    if (spinning || count === 0 || hasDuplicates) return;

    const index = Math.floor(Math.random() * count);
    // Land somewhere inside the slice, not exactly on its edges.
    const offset = segment * (0.15 + Math.random() * 0.7);
    const targetAngle = index * segment + offset;

    // The wheel rotates clockwise; a point at wheel angle `a` ends up at
    // screen angle `a + rotation`, so the pointer (0°) needs rotation ≡ -a.
    const current = ((rotation % 360) + 360) % 360;
    const desired = (360 - targetAngle) % 360;
    const delta = (desired - current + 360) % 360;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));

    setWinner(null);
    setPendingWinner(names[index]);
    setSpinning(true);
    setRotation(rotation + extraSpins + delta);
  }

  function handleSpinEnd() {
    if (!spinning || pendingWinner === null) return;
    setSpinning(false);
    setWinner(pendingWinner);
    setHistory((prev) => [pendingWinner, ...prev]);
    setFireworksKey((k) => k + 1);

    if (removeWinner) {
      const lines = input.split("\n");
      const removeAt = lines.findIndex((line) => line.trim() === pendingWinner);
      if (removeAt !== -1) {
        lines.splice(removeAt, 1);
        setInput(lines.join("\n"));
      }
    }
    setPendingWinner(null);
  }

  const fontSize = count > 24 ? 10 : count > 12 ? 13 : 16;
  const maxChars = count > 24 ? 6 : count > 12 ? 8 : 10;

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
      <Fireworks trigger={fireworksKey} />
      <div className="flex flex-col items-center gap-6">
        <div className="relative aspect-square w-[min(460px,90vw)]">
          {/* Gold rim with marquee bulbs (static, does not spin) */}
          <svg
            viewBox={`0 0 ${RIM_SIZE} ${RIM_SIZE}`}
            className="absolute inset-0 h-full w-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
          >
            <defs>
              <linearGradient id="rim-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#d97706" />
                <stop offset="60%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <radialGradient id="bulb-glow">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={RIM_CENTER} cy={RIM_CENTER} r={RIM_CENTER - 2} fill="url(#rim-gold)" />
            <circle cx={RIM_CENTER} cy={RIM_CENTER} r={RIM_CENTER - 14} fill="#3f1d0b" />
            {Array.from({ length: BULB_COUNT }, (_, i) => {
              const [x, y] = pointAt((360 / BULB_COUNT) * i, RIM_CENTER - 8, RIM_CENTER);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={6}
                  fill="url(#bulb-glow)"
                  className="animate-bulb"
                  style={{ animationDelay: i % 2 === 0 ? "0s" : "0.4s" }}
                />
              );
            })}
          </svg>

          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 drop-shadow-[0_3px_4px_rgba(0,0,0,0.7)]">
            <svg width="40" height="52" viewBox="0 0 40 52">
              <defs>
                <linearGradient id="pointer-gold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="50%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <path d="M2 4 Q20 -4 38 4 L20 50 Z" fill="url(#pointer-gold)" stroke="#78350f" strokeWidth={2} />
              <circle cx={20} cy={12} r={5} fill="#b91c1c" stroke="#78350f" strokeWidth={1.5} />
            </svg>
          </div>

          <div className="absolute inset-[6.5%]">
            <div
              className="h-full w-full rounded-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                  : "none",
              }}
              onTransitionEnd={handleSpinEnd}
            >
              <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
                <defs>
                  <radialGradient id="hub-gold" cx="35%" cy="35%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>
                  <radialGradient id="wheel-shade">
                    <stop offset="60%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
                  </radialGradient>
                </defs>
                {count === 0 && (
                  <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#262626" />
                )}
                {count === 1 && (
                  <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={RED} />
                )}
                {count > 1 &&
                  names.map((name, i) => (
                    <path
                      key={`slice-${i}`}
                      d={slicePath(i * segment, (i + 1) * segment)}
                      fill={sliceColor(i, count)}
                      stroke="#d4a017"
                      strokeWidth={2.5}
                    />
                  ))}
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#wheel-shade)" />
                {names.map((name, i) => {
                  const mid = i * segment + segment / 2;
                  return (
                    <g key={`label-${i}`} transform={`rotate(${mid} ${CENTER} ${CENTER})`}>
                      <text
                        x={CENTER}
                        y={CENTER - RADIUS * 0.6}
                        fill="#fef3c7"
                        fontSize={fontSize}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ paintOrder: "stroke" }}
                        stroke="#000"
                        strokeWidth={2}
                        transform={`rotate(-90 ${CENTER} ${CENTER - RADIUS * 0.6})`}
                      >
                        {truncate(name, maxChars)}
                      </text>
                    </g>
                  );
                })}
                <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.3} fill="none" stroke="#d4a017" strokeWidth={3} />
                <circle cx={CENTER} cy={CENTER} r={30} fill="url(#hub-gold)" stroke="#78350f" strokeWidth={2} />
                <text
                  x={CENTER}
                  y={CENTER}
                  fill="#78350f"
                  fontSize={26}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  ★
                </text>
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || count === 0 || hasDuplicates}
          className="rounded-full border-2 border-amber-200 bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 px-12 py-3 font-serif text-xl font-black tracking-widest text-red-950 shadow-[0_0_20px_rgba(251,191,36,0.6),inset_0_2px_0_rgba(255,255,255,0.5)] transition hover:brightness-110 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {spinning ? "轉動中…" : "SPIN 開始抽獎"}
        </button>

        <div className="h-16 text-center" aria-live="polite">
          {winner && (
            <p className="font-serif text-3xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              🎉 得獎者：
              <span className="bg-gradient-to-b from-yellow-100 to-amber-400 bg-clip-text text-transparent">
                {winner}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border-2 border-amber-500/60 bg-black/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <label htmlFor="names" className="font-serif font-bold text-amber-300">
            抽獎名單（每行一個，共 {count} 項）
          </label>
          <textarea
            id="names"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setWinner(null);
            }}
            disabled={spinning}
            rows={10}
            aria-invalid={hasDuplicates}
            aria-describedby={hasDuplicates ? "names-error" : undefined}
            className={`w-full rounded-lg border bg-black/50 p-3 font-mono text-sm text-amber-50 outline-none disabled:opacity-60 ${
              hasDuplicates
                ? "border-red-500 focus:border-red-400"
                : "border-amber-700/60 focus:border-amber-400"
            }`}
          />
          {hasDuplicates && (
            <div
              id="names-error"
              role="alert"
              className="rounded-lg border border-red-500 bg-red-950/80 px-3 py-2 text-sm text-red-200"
            >
              ⚠️ 名單不能重複，請修改以下項目後再抽獎：
              <span className="font-semibold">{duplicates.join("、")}</span>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-amber-100">
            <input
              type="checkbox"
              checked={removeWinner}
              onChange={(e) => setRemoveWinner(e.target.checked)}
              disabled={spinning}
              className="accent-amber-500"
            />
            抽中後從名單移除
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t border-amber-500/30 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-amber-300">抽獎紀錄</h2>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-sm text-amber-200/70 hover:underline"
              >
                清除
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-amber-100/50">尚無紀錄</p>
          ) : (
            <ol className="flex flex-col gap-1 text-sm">
              {history.map((name, i) => (
                <li key={`${history.length - i}-${name}`}>
                  <span className="text-amber-400">♦</span> 第 {history.length - i} 次：{name}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
