"use client";

import { useMemo, useState, useRef, useLayoutEffect, type FormEvent } from "react";
import { Mail, Minus, Square, X } from "lucide-react";
import gsap from "gsap";
import { useMotionPrefs } from "./motion-prefs";

type FormState = {
  name: string;
  company: string;
  website: string;
  email: string;
  message: string;
  acceptance: boolean;
  honeypot: string;
};

export default function ContactForm() {
  const { reducedMotion } = useMotionPrefs();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const chromeRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const btnLabelRef = useRef<HTMLSpanElement | null>(null);
  const btnIconRef = useRef<HTMLSpanElement | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    website: "",
    email: "",
    message: "",
    acceptance: false,
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const canSubmit = useMemo(() => {
    if (status === "sending") return false;
    if (!form.name.trim()) return false;
    if (!form.email.trim()) return false;
    if (!form.message.trim()) return false;
    if (!form.acceptance) return false;
    if (form.honeypot.trim()) return false;
    return true;
  }, [form, status]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const chrome = chromeRef.current;
    if (!shell) return;

    if (reducedMotion) {
      gsap.set(shell, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      shell,
      { opacity: 0, y: 48, rotateX: 6 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.05,
        ease: "power3.out",
        transformPerspective: 1100,
      }
    );

    if (chrome) {
      const dots = chrome.querySelectorAll(".chrome-dot");
      gsap.fromTo(
        dots,
        { scale: 0.4, opacity: 0.3 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(2)",
          delay: 0.35,
        }
      );
    }
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const btn = btnRef.current;
    const label = btnLabelRef.current;
    const icon = btnIconRef.current;
    if (!btn || !label || !icon) return;

    const enter = () => {
      if (!canSubmit && status !== "sending") return;
      gsap.to(label, { y: -3, duration: 0.35, ease: "power2.out" });
      gsap.to(icon, { x: 6, scale: 1.08, duration: 0.35, ease: "power2.out" });
      gsap.to(btn, {
        boxShadow: "0 0 0 1px rgba(255,204,0,0.45), 0 12px 40px rgba(0,0,0,0.35)",
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const leave = () => {
      gsap.to(label, { y: 0, duration: 0.4, ease: "power3.out" });
      gsap.to(icon, { x: 0, scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(btn, {
        boxShadow: "0 0 0 0 rgba(255,204,0,0)",
        duration: 0.45,
        ease: "power2.out",
      });
    };

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    btn.addEventListener("focus", enter);
    btn.addEventListener("blur", leave);
    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
      btn.removeEventListener("focus", enter);
      btn.removeEventListener("blur", leave);
    };
  }, [canSubmit, reducedMotion, status]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    if (!canSubmit) {
      setStatus("error");
      setErrorMessage("Please fill all required fields correctly.");
      return;
    }

    setStatus("sending");
    if (!reducedMotion && btnRef.current) {
      gsap.to(btnRef.current, { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1 });
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          website: form.website,
          email: form.email,
          message: form.message,
          acceptance: form.acceptance,
          "more-details": form.honeypot,
          formName: "contact-form",
          subject: `New contact from ${form.name}`,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to send message.");
      }

      setStatus("sent");
      setForm({
        name: "",
        company: "",
        website: "",
        email: "",
        message: "",
        acceptance: false,
        honeypot: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <div ref={shellRef} className="w-full md:max-w-lg lg:max-w-2xl">
      <div className="glossy-25 flex flex-col overflow-hidden rounded border border-base-300">
        <div
          ref={chromeRef}
          className="glossy-25 flex h-10 min-h-10 items-center gap-4 border-b border-base-300 px-4"
        >
          <h2 className="cursor-default font-body text-sm font-medium lowercase tracking-normal text-neutral-50">
            write-me
          </h2>
          <div className="ml-auto flex items-center gap-2 text-base-300">
            <Minus
              className="chrome-dot size-4 opacity-80"
              aria-hidden
              strokeWidth={1.75}
            />
            <Square
              className="chrome-dot size-3 opacity-80"
              aria-hidden
              strokeWidth={1.75}
            />
            <X
              className="chrome-dot size-4 opacity-80"
              aria-hidden
              strokeWidth={1.75}
            />
          </div>
        </div>

        <div className="glossy-25 p-6 sm:p-8">
          <form
            className="contact-form flex flex-col gap-8 md:gap-8"
            method="post"
            onSubmit={onSubmit}
          >
            <input type="hidden" name="form-name" value="contact-form" />
            <input type="hidden" name="subject" value="New contact" />

            <input
              type="text"
              name="more-details"
              value={form.honeypot}
              onChange={(e) =>
                setForm((f) => ({ ...f, honeypot: e.target.value }))
              }
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="relative text-sm font-medium">
              <div className="absolute left-0 top-0">01</div>
              <div className="form-control">
                <label className="label p-0 pb-1" htmlFor="name">
                  <span className="label-text lowercase text-neutral-50">
                    full-name <span className="text-neutral-50/70">*</span>
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="input-primary rounded border border-base-300 font-headings text-base text-neutral-50 sm:h-16 sm:px-6 sm:text-xl"
                  aria-required="true"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="relative text-sm font-medium">
              <div className="absolute left-0 top-0">02</div>
              <div className="form-control">
                <label className="label p-0 pb-1" htmlFor="company">
                  <span className="label-text lowercase text-neutral-50">
                    company
                  </span>
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Company"
                  className="input-primary rounded border border-base-300 font-headings text-base text-neutral-50 sm:h-16 sm:px-6 sm:text-xl"
                  aria-required="false"
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="relative text-sm font-medium">
              <div className="absolute left-0 top-0">03</div>
              <div className="form-control">
                <label className="label p-0 pb-1" htmlFor="website">
                  <span className="label-text lowercase text-neutral-50">
                    website
                  </span>
                </label>
                <input
                  id="website"
                  type="url"
                  placeholder="https://"
                  className="input-primary rounded border border-base-300 font-headings text-base text-neutral-50 sm:h-16 sm:px-6 sm:text-xl"
                  aria-required="false"
                  value={form.website}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, website: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="relative text-sm font-medium">
              <div className="absolute left-0 top-0">04</div>
              <div className="form-control">
                <label className="label p-0 pb-1" htmlFor="email">
                  <span className="label-text lowercase text-neutral-50">
                    email <span className="text-neutral-50/70">*</span>
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@brand.com"
                  className="input-primary rounded border border-base-300 font-headings text-base text-neutral-50 sm:h-16 sm:px-6 sm:text-xl"
                  aria-required="true"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="relative text-sm font-medium">
              <div className="absolute left-0 top-0">05</div>
              <div className="form-control">
                <label className="label p-0 pb-1" htmlFor="message">
                  <span className="label-text lowercase text-neutral-50">
                    your-message <span className="text-neutral-50/70">*</span>
                  </span>
                </label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={6}
                  className="textarea-primary w-full rounded border border-base-300 py-3 font-headings text-base font-normal leading-relaxed text-neutral-50 sm:p-6 sm:text-xl"
                  aria-required="true"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
              </div>
            </div>

            <label className="flex items-start gap-3 py-0 text-sm">
              <input
                type="checkbox"
                name="acceptance"
                className="mt-1 rounded border-base-300 accent-primary"
                checked={form.acceptance}
                onChange={(e) =>
                  setForm((f) => ({ ...f, acceptance: e.target.checked }))
                }
                aria-required="true"
              />
              <span className="text-neutral-50">
                I agree with the terms of the Privacy Policy
              </span>
            </label>

            {status === "error" && (
              <div
                role="alert"
                className="rounded border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {errorMessage}
              </div>
            )}
            {status === "sent" && (
              <div className="rounded border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                Message sent. I’ll get back to you soon.
              </div>
            )}

            <div className="flex justify-start">
              <button
                ref={btnRef}
                type="submit"
                className="btn-main btn relative inline-flex h-auto items-center px-6 py-4 disabled:opacity-50"
                disabled={!canSubmit}
              >
                <span ref={btnLabelRef} className="inline-block overflow-hidden">
                  {status === "sending" ? "Sending..." : "send-it-over!"}
                </span>
                <span
                  ref={btnIconRef}
                  className="ml-2 inline-flex items-center overflow-hidden"
                >
                  <Mail
                    className="size-5"
                    aria-hidden="true"
                    style={{ fontSize: "1.125em" }}
                  />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
