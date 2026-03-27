"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionPrefs } from "./motion-prefs";

export default function HeroTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const { reducedMotion } = useMotionPrefs();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const words = root.querySelectorAll<HTMLElement>(".hero-word-inner");
    if (!words.length) return;

    if (reducedMotion) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(words, { yPercent: 108, opacity: 0.75 });
    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.92,
      stagger: 0.058,
      ease: "power3.out",
      delay: 0.08,
    });
  }, [children, reducedMotion]);

  return (
    <h1 ref={rootRef} className={className}>
      {children}
    </h1>
  );
}

export function HeroWord({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="inline-block overflow-hidden align-baseline">
      <span
        className={`hero-word-inner inline-block ${className}`.trim()}
      >
        {children}
      </span>
    </span>
  );
}

export function HeroTitleWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.trim().split(/\s+/);
  return (
    <HeroTitle className={className}>
      {words.map((w, i) => (
        <span key={`${i}-${w}`}>
          {i > 0 ? "\u00A0" : null}
          <HeroWord>{w}</HeroWord>
        </span>
      ))}
    </HeroTitle>
  );
}
