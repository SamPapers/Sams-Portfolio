import type { HobbyItem } from "@/lib/site-content";

const emojiMap: Record<string, string> = {
  golf: "⛳",
  cycling: "🚴",
  photography: "📷",
  writing: "✍️",
};

export default function Hobbies({ items }: { items: HobbyItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((h) => (
        <div
          key={`${h.icon}-${h.label}`}
          data-reveal
          className="glossy-25 rounded border border-base-300 bg-white/5 px-4 py-3 text-center"
        >
          <div className="text-2xl">{emojiMap[h.icon] ?? "✨"}</div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral/80">
            {h.label}
          </div>
        </div>
      ))}
    </div>
  );
}

