"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderNav from "./HeaderNav";
import Footer from "./Footer";
import AmbientBackground from "./AmbientBackground";
import HeroChrome from "./HeroChrome";
import PageTransitionOverlay from "./PageTransitionOverlay";
import { getMarqueeWord } from "@/lib/marquee-word";
import { MotionPrefsContext } from "./motion-prefs";

gsap.registerPlugin(ScrollTrigger);

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    const contentEl = contentRef.current;
    if (!wrapperEl || !contentEl) return;

    const lenisInstance = new Lenis({
      wrapper: wrapperEl,
      content: contentEl,
      lerp: 0.09,
    });
    setLenis(lenisInstance);

    let rafId = 0;
    const raf = (time: number) => {
      lenisInstance.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    const handleResize = () => {
      lenisInstance.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    const onLenisScroll = () => ScrollTrigger.update();
    lenisInstance.on("scroll", onLenisScroll);

    ScrollTrigger.scrollerProxy(wrapperEl, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenisInstance.scrollTo(value, { immediate: true });
        }
        return lenisInstance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: wrapperEl.clientWidth,
          height: wrapperEl.clientHeight,
        };
      },
      pinType: wrapperEl.style.transform ? "transform" : "fixed",
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(rafId);
      lenisInstance.off("scroll", onLenisScroll);
      lenisInstance.destroy();
      setLenis(null);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ScrollTrigger.refresh();
    };
  }, []);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;
    const elements = gsap.utils.toArray<HTMLElement>(
      wrapperEl.querySelectorAll("[data-reveal]")
    );
    if (elements.length === 0) return;

    if (reducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(elements, { opacity: 0, y: 28 });

    const triggers: ScrollTrigger[] = [];
    elements.forEach((el) => {
      const st = ScrollTrigger.create({
        scroller: wrapperEl,
        trigger: el,
        start: "top 92%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
          });
        },
        once: true,
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [pathname, reducedMotion]);

  const marqueeWord = getMarqueeWord(pathname ?? null);

  return (
    <MotionPrefsContext.Provider value={{ reducedMotion }}>
      <div className="relative box-border h-dvh min-h-0 w-full p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] pl-[max(0.375rem,env(safe-area-inset-left))] pr-[max(0.375rem,env(safe-area-inset-right))] pt-[max(0.375rem,env(safe-area-inset-top))] sm:p-3 md:p-5 lg:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-55">
          <div className="absolute left-1/2 top-0 h-[280px] w-[720px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl md:h-[320px] md:w-[800px]" />
        </div>

        <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[min(560px,calc(100vw-12px))] flex-col sm:max-w-[min(560px,calc(100vw-24px))] md:max-w-[580px] lg:max-w-[600px]">
          <div className="frame-primary frame-site relative min-h-0">
            <AmbientBackground
              word={marqueeWord}
              reducedMotion={reducedMotion}
              lenis={lenis}
            />
            <PageTransitionOverlay />

            <div className="relative z-[10] grid h-full min-h-0 grid-rows-[auto_1fr] md:grid-cols-[4rem_1fr] md:grid-rows-1">
              <HeaderNav />

              <div
                ref={wrapperRef}
                className="scrollbar-custom relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-y-contain focus:outline-none md:min-h-0"
                tabIndex={0}
              >
                <div ref={contentRef} className="relative min-h-full">
                  <HeroChrome />
                  <div className="relative z-[3] px-4 pt-8 sm:px-5 sm:pt-9 md:px-8 md:pt-11">
                    {children}
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionPrefsContext.Provider>
  );
}
