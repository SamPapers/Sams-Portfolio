"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import type { Project } from "@/lib/site-content";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function ProjectCard({ project }: { project: Project }) {
  const articleRef = useRef<HTMLElement | null>(null);
  const hasPdf = typeof project.pdf === "string" && project.pdf.length > 0;
  const showImage =
    typeof project.image === "string" && project.image.length > 0;

  useLayoutEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.02,
        y: -6,
        duration: 0.45,
        ease: "power2.out",
      });
      const shine = el.querySelector(".project-card-shine");
      if (shine) {
        gsap.to(shine, { opacity: 0.22, duration: 0.35, ease: "power2.out" });
      }
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
      const shine = el.querySelector(".project-card-shine");
      if (shine) {
        gsap.to(shine, { opacity: 0, duration: 0.45, ease: "power2.out" });
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link
      href={`/work/${project.slug}/`}
      className="group block"
      aria-label={`Open project: ${project.title}`}
    >
      <article
        ref={articleRef}
        className="project-card-animate glossy-25 relative overflow-hidden rounded border border-base-300 will-change-transform"
      >
        <div
          className="project-card-shine pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent opacity-0"
          aria-hidden
        />

        {showImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-base-300">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, 600px"
            />
          </div>
        ) : hasPdf ? (
          <div className="relative flex h-24 items-center justify-center gap-2 overflow-hidden border-b border-base-300 bg-primary/10 transition-colors duration-300 group-hover:bg-primary/18">
            <FileText className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-50/90">
              Case study (PDF)
            </span>
          </div>
        ) : null}

        <div className="relative px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="pill mb-2 inline-flex">{project.year}</div>
              <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral/85">
                {project.summary}
              </p>
            </div>
            <div className="mt-1 hidden size-10 shrink-0 rounded-full border border-base-300 bg-white/5 transition-colors duration-300 group-hover:border-primary/50 md:flex" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.techs.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-base-200 bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral/90 transition-colors duration-300 group-hover:border-primary/25"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
