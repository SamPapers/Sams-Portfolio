"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionPrefs } from "./motion-prefs";

/** Fixed layout so SSR/CSR match (no Math.random during render). */
const FLOAT_SPECS = [
  { key: 0, ch: "S", left: 6, top: 10, size: 1.05, delay: 0 },
  { key: 1, ch: "A", left: 78, top: 8, size: 0.9, delay: 0.3 },
  { key: 2, ch: "M", left: 22, top: 28, size: 1.2, delay: 0.6 },
  { key: 3, ch: "C", left: 88, top: 32, size: 0.75, delay: 0.2 },
  { key: 4, ch: "R", left: 14, top: 48, size: 1.0, delay: 0.9 },
  { key: 5, ch: "E", left: 52, top: 6, size: 0.85, delay: 0.15 },
  { key: 6, ch: "A", left: 68, top: 52, size: 1.15, delay: 0.5 },
  { key: 7, ch: "T", left: 38, top: 18, size: 0.95, delay: 0.8 },
  { key: 8, ch: "I", left: 92, top: 18, size: 0.7, delay: 0.4 },
  { key: 9, ch: "V", left: 8, top: 62, size: 1.1, delay: 1.1 },
  { key: 10, ch: "E", left: 48, top: 58, size: 0.88, delay: 0.25 },
  { key: 11, ch: "D", left: 82, top: 42, size: 1.0, delay: 0.7 },
  { key: 12, ch: "I", left: 30, top: 42, size: 0.72, delay: 1.0 },
  { key: 13, ch: "R", left: 58, top: 22, size: 1.05, delay: 0.55 },
  { key: 14, ch: "S", left: 72, top: 68, size: 0.92, delay: 0.35 },
  { key: 15, ch: "A", left: 18, top: 72, size: 0.8, delay: 0.65 },
  { key: 16, ch: "M", left: 42, top: 12, size: 1.18, delay: 0.45 },
  { key: 17, ch: "T", left: 62, top: 38, size: 0.78, delay: 0.85 },
  { key: 18, ch: "R", left: 2, top: 36, size: 0.95, delay: 0.12 },
  { key: 19, ch: "O", left: 94, top: 58, size: 0.82, delay: 0.95 },
] as const;

export default function HeroChrome() {
  const { reducedMotion } = useMotionPrefs();
  const streakRef = useRef<HTMLDivElement | null>(null);
  const lettersWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const streak = streakRef.current;
    if (!streak || reducedMotion) return;
    const tl = gsap.timeline();
    tl.fromTo(
      streak,
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 0.85,
        duration: 1.05,
        ease: "power3.out",
        transformOrigin: "50% 0%",
      }
    ).to(
      streak,
      {
        opacity: 0.45,
        yoyo: true,
        repeat: -1,
        duration: 2.2,
        ease: "sine.inOut",
      },
      "-=0.2"
    );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const wrap = lettersWrapRef.current;
    if (!wrap || reducedMotion) return;
    const letters = wrap.querySelectorAll<HTMLElement>(".hero-float-letter");
    const tweens: gsap.core.Tween[] = [];
    letters.forEach((letter, i) => {
      const offset = (i % 5) * 3;
      tweens.push(
        gsap.to(letter, {
          y: 12 + offset,
          x: (i % 3) * 4 - 4,
          opacity: 0.045 + (i % 4) * 0.015,
          duration: 3.5 + (i % 6) * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Number(letter.dataset.delay ?? 0),
        })
      );
      tweens.push(
        gsap.to(letter, {
          rotate: (i % 2 === 0 ? 1 : -1) * (8 + (i % 3)),
          duration: 5.5 + (i % 4) * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    });
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[min(52vh,440px)]"
        aria-hidden
      >
        <div className="absolute bottom-6 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/45 to-transparent opacity-50" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[min(52vh,440px)] overflow-hidden"
      aria-hidden
    >
      <div
        ref={lettersWrapRef}
        className="absolute inset-0 opacity-[0.09] mix-blend-overlay"
      >
        {FLOAT_SPECS.map(({ key, ch, left, top, size, delay }) => (
          <span
            key={key}
            data-delay={delay}
            className="hero-float-letter absolute select-none font-extrabold uppercase leading-none text-white"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: `${Math.min(3.1, Math.max(1.05, size * 1.85))}rem`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div
        ref={streakRef}
        className="absolute bottom-6 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/55 to-transparent"
      />
    </div>
  );
}
