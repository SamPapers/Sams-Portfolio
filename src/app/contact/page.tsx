import ContactForm from "@/components/ContactForm";
import HeroTitle, { HeroWord } from "@/components/HeroTitle";

const CONTACT_HEAD_WORDS = [
  "Do",
  "you",
  "want",
  "to",
  "talk",
  "about",
  "a",
] as const;

export default function ContactPage() {
  return (
    <main className="relative pb-16 md:pb-32">
      <section className="flex flex-col items-center justify-center text-center">
        <div data-reveal className="pill">
          Contact
        </div>
        <HeroTitle className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:mt-6 md:text-[2.35rem] md:leading-[1.12] lg:text-4xl">
          {CONTACT_HEAD_WORDS.map((w, i) => (
            <span key={w}>
              {i > 0 ? "\u00A0" : null}
              <HeroWord>{w}</HeroWord>
            </span>
          ))}
          <span>
            {"\u00A0"}
            <HeroWord className="text-primary">project</HeroWord>
            <HeroWord>?</HeroWord>
          </span>
        </HeroTitle>
        <p
          data-reveal
          className="mt-4 max-w-[46ch] text-sm leading-relaxed text-neutral/85"
        >
          Whether you have a project you want to work on together or just want us
          to meet and have a chat, you are in the right place: let’s get in touch.
        </p>
      </section>

      <section className="mt-10 flex justify-center">
        <ContactForm />
      </section>

      <section className="mt-12">
        <div
          className="rounded border border-base-300 bg-white/3 p-6 text-sm text-neutral/85"
          data-reveal
        >
          Prefer email?{" "}
          <a
            className="text-primary font-semibold hover:text-primary/80 transition"
            href="mailto:samueltrotmanjr@gmail.com"
          >
            samueltrotmanjr@gmail.com
          </a>
          .
        </div>
      </section>
    </main>
  );
}

