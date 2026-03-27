import { siteContent } from "@/lib/site-content";
import SocialLinks from "@/components/SocialLinks";
import Hobbies from "@/components/Hobbies";
import Link from "next/link";
import Image from "next/image";
import { HeroTitleWords } from "@/components/HeroTitle";

export default function AboutPage() {
  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col items-center text-center">
        <div data-reveal className="pill">
          about
        </div>
        <HeroTitleWords
          text="Let’s get to know each other"
          className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:mt-6 md:text-[2.35rem] md:leading-[1.12] lg:text-4xl"
        />
        <p
          data-reveal
          className="mt-4 max-w-[40ch] text-sm leading-relaxed text-neutral/85"
        >
          {siteContent.about.aboutMe.paragraphs[0]}
        </p>
      </section>

      <section className="mt-14" aria-label="about-me">
        <div className="flex flex-col gap-4">
          <div data-reveal className="pill w-fit">
            {siteContent.about.aboutMe.title}
          </div>
          {siteContent.about.aboutMe.paragraphs.slice(1).map((p) => (
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
          portrait
        </div>
        <div className="mt-4" data-reveal>
          <div className="glossy-25 overflow-hidden rounded border border-base-300">
            <Image
              src={siteContent.about.portrait.src}
              alt={siteContent.about.portrait.alt}
              width={1200}
              height={800}
              className="h-60 w-full object-cover md:h-72"
              priority
            />
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

