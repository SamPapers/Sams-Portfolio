import type { SocialItem } from "@/lib/site-content";
import {
  Code,
  Camera,
  BriefcaseBusiness,
  X,
  Globe,
} from "lucide-react";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  linkedin: BriefcaseBusiness,
  instagram: Camera,
  twitter: X,
  bluesky: Globe,
  github: Code,
};

export default function SocialLinks({ items }: { items: SocialItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.icon] || Globe;
        return (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            data-reveal
            className="rounded border border-base-300 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-50 transition hover:border-primary/60 hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}

