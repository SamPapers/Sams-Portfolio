import Link from "next/link";

const footerLinks = [
  { href: "/about/", label: "About" },
  { href: "/work/", label: "Work" },
  { href: "/experiments/", label: "Experiments" },
  { href: "/contact/", label: "Contact" },
] as const;

export default function Footer() {
  return (
    <footer className="glossy-25 border-t border-base-300 py-10 font-medium sm:py-14 lg:py-20">
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-10 px-4 text-center sm:gap-12 sm:px-5 md:px-8 lg:w-full">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Footer menu"
        >
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="py-2 text-sm lowercase tracking-wide text-neutral-50/90 transition-colors duration-300 hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="flex flex-nowrap items-center gap-2 transition-opacity hover:opacity-90"
          aria-label="Sam Trotman home"
        >
          <div className="glossy-25 flex size-10 items-center justify-center rounded border border-base-300">
            <span className="text-lg font-bold text-primary">S</span>
          </div>
          <span className="text-sm font-semibold text-neutral-50">
            Sam Trotman
          </span>
        </Link>

        <div className="flex w-full max-w-md flex-col items-center gap-4 text-sm sm:flex-row sm:justify-between">
          <div className="text-neutral-50/85">
            © {new Date().getFullYear()} Sam Trotman
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://www.iubenda.com/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className="lowercase text-neutral-50/85 transition-colors hover:text-white"
            >
              Privacy Policy
            </a>
            <span className="cursor-default lowercase text-neutral-50/55">
              Cookie-free Website
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
