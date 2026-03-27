"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Home, Laptop, Zap, Mail, UserRound } from "lucide-react";
import { useMotionPrefs } from "./motion-prefs";

const navItems = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/about/", label: "About", Icon: UserRound },
  { href: "/work/", label: "Work", Icon: Laptop },
  { href: "/experiments/", label: "Experiments", Icon: Zap },
  { href: "/contact/", label: "Contact", Icon: Mail },
] as const;

const TOOLTIP_SHOW_DELAY_MS = 400;

function useDesktopRail() {
  const getInitial = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px)").matches;
  const [isDesktopRail, setIsDesktopRail] = useState(getInitial);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktopRail(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktopRail;
}

function focusFirstInMain() {
  const main = document.querySelector("main");
  if (!main) return;
  const focusable = main.querySelector<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) {
    focusable.focus();
    return;
  }
  if (main instanceof HTMLElement) {
    main.setAttribute("tabindex", "-1");
    main.focus();
  }
}

export default function HeaderNav() {
  const pathname = usePathname();
  const { reducedMotion } = useMotionPrefs();
  const isDesktopRail = useDesktopRail();
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const tipTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [openTipKey, setOpenTipKey] = useState<string | null>(null);

  const showTooltips = !reducedMotion;

  const clearTipTimer = useCallback((key: string) => {
    const t = tipTimers.current[key];
    if (t !== undefined) {
      clearTimeout(t);
      delete tipTimers.current[key];
    }
  }, []);

  const scheduleTipShow = useCallback(
    (key: string) => {
      if (!showTooltips) return;
      clearTipTimer(key);
      tipTimers.current[key] = setTimeout(() => {
        delete tipTimers.current[key];
        setOpenTipKey(key);
      }, TOOLTIP_SHOW_DELAY_MS);
    },
    [clearTipTimer, showTooltips]
  );

  const hideTip = useCallback(
    (key: string) => {
      clearTipTimer(key);
      setOpenTipKey((k) => (k === key ? null : k));
    },
    [clearTipTimer]
  );

  useEffect(() => {
    return () => {
      const pending = tipTimers.current;
      tipTimers.current = {};
      Object.values(pending).forEach((t) => clearTimeout(t));
    };
  }, []);

  const railFocusables = useCallback((): HTMLElement[] => {
    const out: HTMLElement[] = [];
    if (logoRef.current) out.push(logoRef.current);
    navItems.forEach((_, i) => {
      const el = navLinkRefs.current[i];
      if (el) out.push(el);
    });
    return out;
  }, []);

  const onHeaderKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!isDesktopRail) return;

    const els = railFocusables();
    if (!els.length) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = active ? els.indexOf(active) : -1;
    if (idx === -1) return;

    if (e.key === "Escape") {
      e.preventDefault();
      focusFirstInMain();
      return;
    }

    if (e.key !== "Tab" || e.altKey) return;

    if (e.shiftKey) {
      if (idx === 0) {
        e.preventDefault();
        els[els.length - 1]?.focus();
      }
      return;
    }

    if (idx === els.length - 1) {
      e.preventDefault();
      els[0]?.focus();
    }
  };

  return (
    <header
      className="glossy-25 relative z-30 flex flex-row items-center justify-between gap-1 border-b border-base-300 px-1 py-1.5 sm:px-2 sm:py-2 md:h-full md:w-16 md:max-w-[4rem] md:flex-col md:justify-between md:overflow-visible md:border-b-0 md:border-r md:px-0 md:py-5"
    >
      <div
        className="flex shrink-0 items-center md:w-full md:justify-center"
        onKeyDown={onHeaderKeyDown}
      >
        <Link
          ref={logoRef}
          href="/"
          aria-label="Sam Trotman, creative director"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors hover:bg-white/5 md:min-h-0 md:min-w-0 md:flex-col md:gap-0 md:hover:bg-transparent"
        >
          <div className="glossy-25 flex size-10 items-center justify-center rounded border border-base-300 transition-colors duration-300 hover:border-primary/60 sm:size-9 md:size-9">
            <span className="text-base font-bold tracking-tight text-primary md:text-sm">
              S
            </span>
          </div>
          <span className="hidden text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral-50/80 md:mt-2 md:block md:max-w-[3.25rem] md:text-center md:normal-case">
            Sam
          </span>
        </Link>
      </div>

      <nav
        className="flex min-h-11 min-w-0 flex-1 items-center justify-center md:min-h-0 md:flex-none md:flex-1 md:justify-center"
        aria-label="Main menu"
      >
        <ul
          className="nav-scroll-fade flex max-w-full flex-row gap-0 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:max-w-none md:flex-col md:gap-1 md:overflow-visible md:pb-0 md:[-webkit-mask-image:none] md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map(({ href, label, Icon }, i) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname?.startsWith(href);

            const tipVisible = showTooltips && openTipKey === href;

            return (
              <li
                key={href}
                className="flex shrink-0 md:w-full md:justify-center"
              >
                <Link
                  ref={(el) => {
                    navLinkRefs.current[i] = el;
                  }}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={label}
                  className={[
                    "group relative flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg px-2 py-2 transition-all duration-300 md:min-h-0 md:min-w-0 md:w-full md:rounded-none md:px-0 md:py-2.5",
                    isActive
                      ? "text-primary md:shadow-[inset_3px_0_0_0_#ffcc00]"
                      : "text-neutral-50/60 hover:text-primary active:scale-95 md:hover:scale-110",
                  ].join(" ")}
                  onPointerEnter={() => scheduleTipShow(href)}
                  onPointerLeave={() => hideTip(href)}
                  onFocus={() => {
                    if (!showTooltips) return;
                    Object.keys(tipTimers.current).forEach((k) =>
                      clearTipTimer(k)
                    );
                    setOpenTipKey(href);
                  }}
                  onBlur={() => hideTip(href)}
                >
                  <Icon className="size-[22px] sm:size-5" aria-hidden="true" />
                  {showTooltips ? (
                    <span
                      className={[
                        "pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-base-300 bg-[#0c0a08]/95 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-50/95 shadow-lg backdrop-blur-md md:block",
                        "transition-opacity duration-150",
                        tipVisible ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                      aria-hidden
                    >
                      {label}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className="hidden w-4 shrink-0 md:block"
        aria-hidden="true"
      />
    </header>
  );
}
