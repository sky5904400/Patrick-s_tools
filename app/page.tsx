import Link from "next/link";

const TOOLS = [
  {
    href: "/wheel",
    name: "幸運大轉盤",
    tag: "抽獎",
    description: "輸入名單就能轉，指針停在誰，誰就是得獎者。賭場風格的金框轉盤，抽中還會放煙火。",
    features: ["自訂抽獎名單", "重複名單自動檢查", "抽中後可自動移除"],
    accent: "from-emerald-700 to-green-950",
    ring: "group-hover:ring-amber-400",
    button: "bg-amber-400 text-green-950",
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    tag: "專注",
    description: "25 分鐘專注、5 分鐘休息，用番茄工作法找回節奏。時間到會響鈴並跳出通知。",
    features: ["專注／短休息／長休息", "可自訂時間長度", "分頁標題顯示倒數"],
    accent: "from-red-500 to-rose-700",
    ring: "group-hover:ring-red-400",
    button: "bg-white text-red-600",
  },
  {
    href: "/omikuji",
    name: "神社抽籤",
    tag: "運勢",
    description: "仿日本神社的御神籤，搖一搖籤筒，抽出今日的大吉到大凶，還附上各項運勢指引。",
    features: ["六種運勢結果", "幸運色與吉方位", "凶籤可綁在樹上"],
    accent: "from-[#c8102e] to-[#7f0a1d]",
    ring: "group-hover:ring-[#c8102e]",
    button: "bg-[#fbf3e4] text-[#c8102e]",
  },
] as const;

function WheelArt() {
  return (
    <div
      className="relative h-28 w-28 rounded-full border-[6px] border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-transform duration-700 group-hover:rotate-[200deg]"
      style={{
        background:
          "conic-gradient(#b91c1c 0 60deg, #171717 60deg 120deg, #b91c1c 120deg 180deg, #171717 180deg 240deg, #b91c1c 240deg 300deg, #171717 300deg 360deg)",
      }}
    >
      <div className="absolute inset-0 m-auto h-6 w-6 rounded-full bg-amber-400" />
    </div>
  );
}

function TimerArt() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx={50} cy={50} r={44} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={8} />
        <circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke="white"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={276}
          strokeDashoffset={90}
          className="transition-[stroke-dashoffset] duration-700 group-hover:[stroke-dashoffset:20]"
        />
      </svg>
      <span className="font-mono text-xl font-bold text-white">25:00</span>
    </div>
  );
}

function OmikujiArt() {
  return (
    <div className="flex h-28 w-16 rotate-[-6deg] items-center justify-center border-x-4 border-y-2 border-[#c8102e] bg-[#fffaf0] font-serif text-3xl font-black text-[#c8102e] shadow-lg transition-transform duration-500 [writing-mode:vertical-rl] group-hover:-translate-y-2 group-hover:rotate-0">
      大吉
    </div>
  );
}

const ART = { "/wheel": WheelArt, "/pomodoro": TimerArt, "/omikuji": OmikujiArt };

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-sm text-amber-300">
              P
            </span>
            <span>Patrick的小工具</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="hidden rounded-full px-3 py-1.5 text-stone-600 transition hover:bg-stone-200/70 hover:text-stone-900 sm:block"
              >
                {tool.name}
              </Link>
            ))}
            <a
              href="#tools"
              className="rounded-full bg-stone-900 px-4 py-1.5 font-medium text-white transition hover:bg-stone-700 sm:hidden"
            >
              工具
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl" />
            <div className="absolute top-10 right-[-6rem] h-96 w-96 rounded-full bg-rose-300/40 blur-3xl" />
            <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-28 text-center sm:px-6 sm:pt-32">
            <span className="mb-6 rounded-full border border-stone-300 bg-white/70 px-4 py-1 text-sm text-stone-600 backdrop-blur">
              ✨ 三個小工具，讓生活多一點樂趣
            </span>
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
              Patrick的
              <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600 bg-clip-text text-transparent">
                小工具
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              抽獎要公平、工作要專注、運氣要看一下。
              <br className="hidden sm:block" />
              打開瀏覽器就能用，不用安裝、不用註冊。
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#tools"
                className="rounded-full bg-stone-900 px-7 py-3 font-semibold text-white shadow-lg shadow-stone-900/20 transition hover:-translate-y-0.5 hover:bg-stone-700"
              >
                開始探索 ↓
              </a>
              <Link
                href="/omikuji"
                className="rounded-full border border-stone-300 bg-white/70 px-7 py-3 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                先抽個籤 🎋
              </Link>
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold tracking-[0.3em] text-rose-500">TOOLS</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">挑一個來用用看</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TOOLS.map((tool) => {
              const Art = ART[tool.href];
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-2 ring-transparent transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${tool.ring}`}
                >
                  <div
                    className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${tool.accent}`}
                  >
                    <span className="absolute top-4 left-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {tool.tag}
                    </span>
                    <Art />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <p className="mt-2 flex-1 leading-7 text-stone-600">{tool.description}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-stone-600">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`mt-6 inline-flex w-fit items-center gap-1 rounded-full px-5 py-2 text-sm font-semibold ring-1 ring-stone-200 transition group-hover:gap-3 ${tool.button}`}
                    >
                      立即使用 <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-stone-900 px-8 py-12 text-stone-100 sm:grid-cols-3">
            {[
              ["⚡", "打開就能用", "不用下載、不用登入，點進去馬上開始。"],
              ["📱", "手機也好用", "版面自動調整，電腦、平板、手機都順手。"],
              ["🔒", "資料不外流", "所有內容只在你的瀏覽器裡，不會上傳。"],
            ].map(([icon, title, text]) => (
              <div key={title}>
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-400">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-stone-900 text-xs font-bold text-amber-300">
              P
            </span>
            <span>© 2026 Patrick的小工具</span>
          </div>
          <nav className="flex gap-5">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="transition hover:text-stone-900">
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
