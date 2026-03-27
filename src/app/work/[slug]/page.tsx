import { notFound } from "next/navigation";
import Link from "next/link";
import { siteContent } from "@/lib/site-content";
import { HeroTitleWords } from "@/components/HeroTitle";

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = siteContent.projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const index = siteContent.projects.findIndex((p) => p.slug === project.slug);
  const nextProject = siteContent.projects[index + 1] ?? siteContent.projects[0];
  const pdf =
    "pdf" in project && typeof project.pdf === "string" ? project.pdf : null;

  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col gap-4">
        <div data-reveal className="pill w-fit">
          {project.year}
        </div>
        <HeroTitleWords
          text={project.title}
          className="text-3xl font-semibold leading-tight tracking-tight md:text-[2.35rem] md:leading-[1.12] lg:text-4xl"
        />
        <div className="flex flex-wrap gap-2" data-reveal>
          {project.techs.map((t) => (
            <span
              key={t}
              className="rounded-full border border-base-200 bg-white/5 px-3 py-1 text-[11px] font-medium text-neutral/90"
            >
              {t}
            </span>
          ))}
        </div>
        <p
          data-reveal
          className="text-sm leading-relaxed text-neutral/85"
        >
          {project.summary}
        </p>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          Client
        </div>
        <div className="mt-2 text-sm text-neutral/90" data-reveal>
          {project.client}
        </div>
        {project.partners?.length ? (
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
              Partners
            </div>
            <div className="mt-2 flex flex-col gap-2 text-sm text-neutral/85" data-reveal>
              {project.partners.map((p) => (
                <div key={p} className="rounded border border-base-200 bg-white/3 px-3 py-2">
                  {p}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          Engagement
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral/85" data-reveal>
          {project.engagement}
        </p>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          Services
        </div>
        <div className="mt-4 flex flex-wrap gap-2" data-reveal>
          {project.services.map((s) => (
            <span
              key={s}
              className="rounded-full border border-base-200 bg-white/3 px-3 py-1 text-[11px] font-medium text-neutral/90"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
          Links
        </div>
        <div className="mt-4 flex flex-wrap gap-3" data-reveal>
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="btn-main"
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>

      {pdf ? (
        <section className="mt-10" aria-label="Work sample PDF">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
            work sample
          </div>
          <p className="mt-2 text-sm text-neutral/80" data-reveal>
            Embedded PDF below. Prefer a new tab? Use “Open deck (PDF)” above.
          </p>
          <div
            className="mt-4 overflow-hidden rounded border border-base-300 bg-black/40"
            data-reveal
          >
            <iframe
              title={`${project.title} — PDF`}
              src={pdf}
              className="h-[min(78vh,900px)] w-full"
            />
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <div className="rounded border border-base-300 bg-white/3 p-6" data-reveal>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral/70">
            Up Next
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            {nextProject.title}
          </div>
          <div className="mt-4">
            <Link href={`/work/${nextProject.slug}/`} className="btn-main">
              View project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

