"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionPrefs } from "./motion-prefs";

export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement | null>(null);
  const ready = useRef(false);
  const prevPath = useRef<string | null>(null);
  const { reducedMotion } = useMotionPrefs();

  useLayoutEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const next = pathname ?? "";

    if (!ready.current) {
      ready.current = true;
      prevPath.current = next;
      gsap.set(el, { yPercent: 100 });
      return;
    }

    const prev = prevPath.current;
    if (prev === next) {
      gsap.set(el, { yPercent: 100 });
      return;
    }

    prevPath.current = next;

    if (reducedMotion) {
      gsap.set(el, { yPercent: 100 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
    tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.38 }, 0).to(
      el,
      { yPercent: -100, duration: 0.42 },
      0.34
    );

    return () => {
      tl.kill();
    };
  }, [pathname, reducedMotion]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-[48]"
      aria-hidden
    >
      <div className="h-full w-full border-y border-primary/30 bg-gradient-to-b from-[#050403] via-[#0a0908] to-[#050403] shadow-[inset_0_1px_0_rgba(255,204,0,0.12)]" />
    </div>
  );
}
