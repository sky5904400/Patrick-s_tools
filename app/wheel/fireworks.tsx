"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#ffffff"];
const DURATION_MS = 3500;
const BURST_COUNT = 7;
const PARTICLES_PER_BURST = 70;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
};

// Plays a full-screen fireworks animation each time `trigger` changes (ignores 0).
export default function Fireworks({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const timers: number[] = [];

    function burst() {
      const x = width * (0.15 + Math.random() * 0.7);
      const y = height * (0.15 + Math.random() * 0.4);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLES_PER_BURST + Math.random() * 0.2;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          color: Math.random() < 0.2 ? "#ffffff" : color,
          size: 2 + Math.random() * 2,
        });
      }
    }

    for (let i = 0; i < BURST_COUNT; i++) {
      timers.push(window.setTimeout(burst, i * 350));
    }

    const start = performance.now();
    let frame = 0;

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.98;
        p.vy = p.vy * 0.98 + 0.06;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.globalAlpha = p.life;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      if (now - start < DURATION_MS || particles.length > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx!.clearRect(0, 0, width, height);
      }
    }
    frame = requestAnimationFrame(draw);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(frame);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-screen w-screen"
    />
  );
}
