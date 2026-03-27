"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionPrefs } from "./motion-prefs";

export default function ProjectGrid({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useMotionPrefs();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".project-card-animate");
    if (!cards.length) return;

    if (reducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, rotateX: 0 });
      return;
    }

    gsap.set(cards, {
      opacity: 0,
      y: 52,
      rotateX: 10,
      transformPerspective: 900,
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.88,
            stagger: 0.12,
            ease: "power3.out",
          });
          io.disconnect();
          break;
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(container);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="grid gap-4 [transform-style:preserve-3d]"
      style={{ perspective: reducedMotion ? undefined : "1200px" }}
    >
      {children}
    </div>
  );
}
