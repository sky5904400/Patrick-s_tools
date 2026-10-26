"use client";

import { useEffect, useEffectEvent, useState } from "react";

type Mode = "work" | "short" | "long";

type Settings = {
  work: number;
  short: number;
  long: number;
  longEvery: number;
};

const MODES: Record<Mode, { label: string; message: string; bg: string; accent: string }> = {
  work: {
    label: "專注",
    message: "專心工作中，加油！",
    bg: "from-red-500 to-rose-700",
    accent: "text-red-600",
  },
  short: {
    label: "短休息",
    message: "起來動一動、喝口水吧",
    bg: "from-teal-500 to-emerald-700",
    accent: "text-teal-600",
  },
  long: {
    label: "長休息",
    message: "辛苦了，好好休息一下",
    bg: "from-sky-500 to-indigo-700",
    accent: "text-sky-600",
  },
};

const DEFAULT_SETTINGS: Settings = { work: 25, short: 5, long: 15, longEvery: 4 };

const RING_RADIUS = 120;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [880, 1100, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.25;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.65);
    });
    window.setTimeout(() => ctx.close(), 1500);
  } catch {
    // Audio is a nice-to-have; ignore browsers that block it.
  }
}

function notify(title: string, body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

export default function PomodoroTimer() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>("work");
  const [running, setRunning] = useState(false);
  // While running, time left is derived from `endAt`; while paused it lives in `remaining`.
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [remaining, setRemaining] = useState(DEFAULT_SETTINGS.work * 60);
  const [completed, setCompleted] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [task, setTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const total = settings[mode] * 60;
  const secondsLeft =
    running && endAt !== null ? Math.max(0, Math.ceil((endAt - now) / 1000)) : remaining;
  const progress = total > 0 ? 1 - secondsLeft / total : 0;
  const theme = MODES[mode];

  function switchMode(next: Mode, startNow = false) {
    const seconds = settings[next] * 60;
    setMode(next);
    setRemaining(seconds);
    if (startNow) {
      const t = Date.now();
      setNow(t);
      setEndAt(t + seconds * 1000);
      setRunning(true);
    } else {
      setEndAt(null);
      setRunning(false);
    }
  }

  function start() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const t = Date.now();
    setNow(t);
    setEndAt(t + remaining * 1000);
    setRunning(true);
  }

  function pause() {
    setRemaining(secondsLeft);
    setEndAt(null);
    setRunning(false);
  }

  function reset() {
    switchMode(mode);
  }

  function finish(skipped = false) {
    if (!skipped) {
      playChime();
      notify(
        mode === "work" ? "🍅 一個番茄完成！" : "⏰ 休息結束",
        mode === "work" ? "該休息一下了" : "準備開始下一個番茄",
      );
    }

    if (mode === "work") {
      const done = skipped ? completed : completed + 1;
      if (!skipped) setCompleted(done);
      const next = done > 0 && done % settings.longEvery === 0 ? "long" : "short";
      switchMode(next, autoStart);
    } else {
      switchMode("work", autoStart);
    }
  }

  const onTick = useEffectEvent(() => {
    const t = Date.now();
    setNow(t);
    if (endAt !== null && t >= endAt) finish();
  });

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(onTick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const original = document.title;
    return () => {
      document.title = original;
    };
  }, []);

  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} · ${theme.label} | 番茄鐘`;
  }, [secondsLeft, theme.label]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.code !== "Space" || ["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
    e.preventDefault();
    if (running) pause();
    else start();
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function updateSetting(key: keyof Settings, value: number) {
    const max = key === "longEvery" ? 10 : 120;
    const clamped = Math.min(max, Math.max(1, Math.round(value) || 1));
    setSettings((prev) => ({ ...prev, [key]: clamped }));
    // Apply right away to the current phase if it hasn't started yet.
    if (key === mode && !running && remaining === settings[mode] * 60) {
      setRemaining(clamped * 60);
    }
  }

  const cycleProgress = completed % settings.longEvery;

  return (
    <main
      className={`flex flex-1 flex-col items-center bg-gradient-to-br ${theme.bg} px-4 py-10 text-white transition-colors duration-700`}
    >
      <h1 className="mb-8 text-3xl font-bold tracking-wide">🍅 番茄鐘</h1>

      <div className="w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex justify-center gap-2" role="tablist">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                mode === m ? "bg-white text-neutral-900" : "bg-white/15 hover:bg-white/25"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto aspect-square w-[min(280px,75vw)]">
          <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90">
            <circle cx={140} cy={140} r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={14} />
            <circle
              cx={140}
              cy={140}
              r={RING_RADIUS}
              fill="none"
              stroke="white"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-6xl font-bold tabular-nums" aria-live="off">
              {formatTime(secondsLeft)}
            </span>
            <span className="mt-2 text-sm text-white/80">{theme.message}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
          >
            重設
          </button>
          <button
            onClick={running ? pause : start}
            className={`w-36 rounded-full bg-white py-3 text-lg font-bold shadow-lg transition hover:scale-105 active:scale-95 ${theme.accent}`}
          >
            {running ? "暫停" : "開始"}
          </button>
          <button
            onClick={() => finish(true)}
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
          >
            跳過
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-white/60">按空白鍵可開始／暫停</p>

        <div className="mt-6">
          <label htmlFor="task" className="mb-1 block text-sm text-white/80">
            現在專注在：
          </label>
          <input
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：寫週報"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white placeholder:text-white/40 outline-none focus:border-white"
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-sm">
          <div>
            今天完成 <span className="text-lg font-bold">{completed}</span> 個番茄
            <div className="mt-1 flex gap-1" aria-label={`距離長休息還有 ${settings.longEvery - cycleProgress} 個`}>
              {Array.from({ length: settings.longEvery }, (_, i) => (
                <span key={i} className={i < cycleProgress ? "" : "opacity-30 grayscale"}>
                  🍅
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25"
            aria-expanded={showSettings}
          >
            ⚙️ 設定
          </button>
        </div>

        {showSettings && (
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-black/15 p-4 text-sm">
            {(
              [
                ["work", "專注（分鐘）"],
                ["short", "短休息（分鐘）"],
                ["long", "長休息（分鐘）"],
                ["longEvery", "幾個番茄後長休息"],
              ] as [keyof Settings, string][]
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-white/80">{label}</span>
                <input
                  type="number"
                  min={1}
                  max={key === "longEvery" ? 10 : 120}
                  value={settings[key]}
                  onChange={(e) => updateSetting(key, Number(e.target.value))}
                  className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-white outline-none focus:border-white"
                />
              </label>
            ))}
            <label className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
              />
              時間到自動開始下一階段
            </label>
          </div>
        )}
      </div>
    </main>
  );
}
