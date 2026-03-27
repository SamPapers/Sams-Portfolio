import Link from "next/link";
import { siteContent } from "@/lib/site-content";
import ProjectCard from "@/components/ProjectCard";
import ProjectGrid from "@/components/ProjectGrid";
import Hobbies from "@/components/Hobbies";
import SocialLinks from "@/components/SocialLinks";
import HeroTitle, { HeroWord } from "@/components/HeroTitle";

export default function Home() {
  const featuredProjects = siteContent.projects
    .filter((p) => p.featured)
    .slice(0, 3);

  const titlePrefixWords = siteContent.about.hero.titlePrefix
    .trim()
    .split(/\s+/);
  const titleSuffixWords = siteContent.about.hero.titleSuffix
    .trim()
    .split(/\s+/);

  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col items-center justify-center text-center">
        <div data-reveal className="pill">
          {siteContent.about.hero.superTitle}
        </div>
        <HeroTitle className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:mt-6 md:text-[2.35rem] md:leading-[1.12] lg:text-4xl">
          {titlePrefixWords.map((w, i) => (
            <span key={`tp-${i}`}>
              {i > 0 ? "\u00A0" : null}
              <HeroWord>{w}</HeroWord>
            </span>
          ))}
          <span>
            {"\u00A0"}
            <HeroWord className="text-primary">
              {siteContent.about.hero.titleEmphasis}
            </HeroWord>
          </span>
          {titleSuffixWords.map((w, i) => (
            <span key={`ts-${i}`}>
              {"\u00A0"}
              <HeroWord>{w}</HeroWord>
            </span>
          ))}
        </HeroTitle>
        <p
          data-reveal
          className="mt-4 max-w-[36ch] text-sm leading-relaxed text-neutral/85"
        >
          {siteContent.about.hero.description}
        </p>
      </section>

      <section className="mt-14" aria-label="about-me">
        <div className="flex flex-col gap-4">
          <div data-reveal className="pill w-fit">
            {siteContent.about.aboutMe.title}
          </div>
          {siteContent.about.aboutMe.paragraphs.map((p) => (
            <p
              key={p}
              data-reveal
              className="text-sm leading-relaxed text-neutral/85"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div
          className="rounded border border-base-300 bg-white/3 p-5"
          data-reveal
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
            where-i-work
          </div>
          <div className="mt-3 text-sm font-semibold text-neutral">
            {siteContent.about.whereIWork.locationLine}
          </div>
          <div className="mt-2 text-sm text-neutral/85">
            {siteContent.about.whereIWork.availabilityLine}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          hobbies
        </div>
        <div className="mt-4">
          <Hobbies items={siteContent.hobbies.items} />
        </div>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          me-online
        </div>
        <div className="mt-4">
          <SocialLinks items={siteContent.social.items} />
        </div>
      </section>

      <section className="mt-14" aria-label="Projects highlight">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
              Projects highlight
            </div>
            <h2 className="mt-2 text-base font-semibold text-white">
              Selected work
            </h2>
          </div>
          <Link
            href="/work/"
            className="text-sm font-semibold text-neutral/90 transition hover:text-primary"
            data-reveal
          >
            all-projects
          </Link>
        </div>

        <ProjectGrid>
          {featuredProjects.map((p) => (
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
