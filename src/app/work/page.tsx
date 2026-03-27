import { siteContent } from "@/lib/site-content";
import ProjectCard from "@/components/ProjectCard";
import ProjectGrid from "@/components/ProjectGrid";
import Link from "next/link";
import { HeroTitleWords } from "@/components/HeroTitle";

export default function WorkPage() {
  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col items-center text-center">
        <div data-reveal className="pill">
          Work
        </div>
        <HeroTitleWords
          text="A collection of my best projects"
          className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:mt-6 md:text-[2.35rem] md:leading-[1.12] lg:text-4xl"
        />
        <p
          data-reveal
          className="mt-4 max-w-[46ch] text-sm leading-relaxed text-neutral/85"
        >
          With years of experience across marketing, branding, and digital production,
          I build work that feels intentional, fast, and expressive.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
            portfolio
          </div>
        </div>

        <ProjectGrid>
          {siteContent.projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </ProjectGrid>
      </section>

      <section className="mt-14">
        <div
          className="rounded border border-base-300 bg-white/3 p-6"
          data-reveal
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
            collaboration
          </div>
          <h2 className="mt-3 text-lg font-semibold text-white">
            {siteContent.about.collaboration.title}
          </h2>
          <div className="mt-4">
            <Link href="/contact/" className="btn-main">
              {siteContent.about.collaboration.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

