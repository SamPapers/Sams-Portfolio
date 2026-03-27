"use client";

import type Lenis from "lenis";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  word: string;
  reducedMotion: boolean;
  lenis: Lenis | null;
};

export default function AmbientBackground({
  word,
  reducedMotion,
  lenis,
}: Props) {
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const topBlobRef = useRef<HTMLDivElement | null>(null);
  const bottomBlobRef = useRef<HTMLDivElement | null>(null);
  const innerTopRef = useRef<HTMLDivElement | null>(null);
  const innerBotRef = useRef<HTMLDivElement | null>(null);

  // Scroll-velocity–linked marquee (base speed + Lenis velocity boost).
  useEffect(() => {
    if (reducedMotion) return;
    const el = marqueeRef.current;
    if (!el) return;

    let x = 0;
    let half = 0;
    const measure = () => {
      half = el.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const tick = () => {
      const v = lenis ? Math.abs(lenis.velocity) : 0;
      const speed = 0.4 + Math.min(v * 0.075, 8);
      x -= speed;
      if (half > 0 && x <= -half) x = 0;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      gsap.set(el, { clearProps: "x" });
    };
  }, [lenis, reducedMotion, word]);

  // Reset horizontal offset when route word changes.
  useEffect(() => {
    const el = marqueeRef.current;
    if (el) gsap.set(el, { x: 0 });
  }, [word]);

  // Ambient blob drift.
  useEffect(() => {
    if (reducedMotion) return;

    const topInner = innerTopRef.current;
    const botInner = innerBotRef.current;
    const topBox = topBlobRef.current;
    const botBox = bottomBlobRef.current;

    if (topInner) {
      gsap.to(topInner, {
        scale: 1.18,
        xPercent: 8,
        yPercent: 6,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (botInner) {
      gsap.to(botInner, {
        scale: 1.12,
        xPercent: -10,
        yPercent: -8,
        duration: 7.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6,
      });
    }
    if (topBox) {
      gsap.to(topBox, {
        opacity: 0.65,
        x: 18,
        y: -12,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
    if (botBox) {
      gsap.to(botBox, {
        opacity: 0.45,
        x: -22,
        y: 16,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });
    }

    return () => {
      gsap.killTweensOf([topInner, botInner, topBox, botBox]);
    };
  }, [reducedMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      <div
        ref={topBlobRef}
        className="absolute right-1/2 top-[8%] aspect-square w-[min(120%,520px)] max-w-none translate-x-1 opacity-50 sm:w-3/4 md:w-[68%]"
      >
        <div
          ref={innerTopRef}
          className="size-full rounded-full bg-primary opacity-50 blur-[100px] md:blur-[130px]"
        />
      </div>
      <div
        ref={bottomBlobRef}
        className="absolute bottom-[12%] left-1/2 aspect-square w-[min(100%,420px)] max-w-none -translate-x-1/2 opacity-30 sm:w-2/3 md:w-[55%]"
      >
        <div
          ref={innerBotRef}
          className="size-full rounded-full bg-primary opacity-45 blur-[90px] md:blur-[120px]"
        />
      </div>

      {!reducedMotion ? (
        <div className="absolute left-0 right-0 top-[2.75rem] h-[min(34vh,300px)] overflow-hidden opacity-[0.11] md:top-0 md:h-[min(38vh,340px)]">
          <div ref={marqueeRef} className="flex w-max will-change-transform">
            <span className="whitespace-nowrap px-6 text-[clamp(2.75rem,16vw,7.5rem)] font-extrabold lowercase leading-none text-black md:px-10">
              {word}&nbsp;
            </span>
            <span className="whitespace-nowrap px-6 text-[clamp(2.75rem,16vw,7.5rem)] font-extrabold lowercase leading-none text-black md:px-10">
              {word}&nbsp;
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
