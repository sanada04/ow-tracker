import Link from "next/link";

interface Labels { all: string; quickplay: string; competitive: string }

export default function GamemodeTabs({
  playerId,
  lang = "ja",
  current,
  labels = { all: "すべて", quickplay: "クイックプレイ", competitive: "コンペティティブ" },
}: {
  playerId: string;
  lang?: string;
  current: string | undefined;
  labels?: Labels;
}) {
  const TABS = [
    { label: labels.all, value: "" },
    { label: labels.quickplay, value: "quickplay" },
    { label: labels.competitive, value: "competitive" },
  ];

  const base = `/${lang}/players/${encodeURIComponent(playerId)}`;

  return (
    <div className="flex gap-2 flex-wrap">
      {TABS.map(({ label, value }) => {
        const isActive = (current ?? "") === value;
        const href = value ? `${base}?gamemode=${value}` : base;
        return (
          <Link
            key={value}
            href={href}
            prefetch
            className={`px-5 py-2 text-sm font-bold uppercase tracking-widest transition-colors shrink-0 ${
              isActive
                ? "bg-[#f4a029] text-black"
                : "border border-zinc-700/60 text-zinc-400 hover:text-white hover:border-[#f4a029]/50"
            }`}
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)",
              fontFamily: '"Rajdhani", system-ui, sans-serif',
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
