import Link from "next/link";
import { HeroTitleWords } from "@/components/HeroTitle";

export default function ExperimentsPage() {
  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col items-center text-center">
        <div data-reveal className="pill">
          experiments
        </div>
        <HeroTitleWords
          text="Experiments & prototypes"
          className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:mt-6 md:text-[2.35rem] md:leading-[1.12] lg:text-4xl"
        />
        <p
          data-reveal
          className="mt-4 max-w-[46ch] text-sm leading-relaxed text-neutral/85"
        >
          This is a placeholder page for personal experiments. Replace it with your
          interactive prototypes, case-study drafts, and experiments.
        </p>
        <div className="mt-6">
          <Link href="/work/" className="btn-main">
            Browse projects
          </Link>
        </div>
      </section>
    </main>
  );
}

