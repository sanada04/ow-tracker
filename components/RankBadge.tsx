import type { PlatformRanks, RoleRank } from "@/types/overwatch";
import Image from "next/image";

const DIVISION_COLORS: Record<string, { text: string; glow: string; bg: string }> = {
  bronze:      { text: "text-amber-700",   glow: "",                              bg: "bg-amber-900/20" },
  silver:      { text: "text-zinc-300",    glow: "",                              bg: "bg-zinc-600/20"  },
  gold:        { text: "text-yellow-400",  glow: "text-glow-orange",              bg: "bg-yellow-900/20" },
  platinum:    { text: "text-cyan-300",    glow: "text-glow-blue",                bg: "bg-cyan-900/20"  },
  diamond:     { text: "text-blue-400",    glow: "text-glow-blue",                bg: "bg-blue-900/20"  },
  master:      { text: "text-purple-400",  glow: "",                              bg: "bg-purple-900/20" },
  grandmaster: { text: "text-orange-400",  glow: "text-glow-orange",              bg: "bg-orange-900/20" },
  champion:    { text: "text-red-400",     glow: "text-glow-red",                 bg: "bg-red-900/20"   },
};

const DEFAULT_ROLE_LABELS: Record<string, string> = {
  tank: "タンク", damage: "ダメージ", support: "サポート", open: "オープン",
};

function RoleRankItem({ role, rank, roleLabels }: { role: string; rank: RoleRank; roleLabels: Record<string, string> }) {
  const div = rank.division.toLowerCase();
  const colors = DIVISION_COLORS[div] ?? { text: "text-white", glow: "", bg: "bg-zinc-800" };
  const label = div.charAt(0).toUpperCase() + div.slice(1);

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded ow-card-sm ${colors.bg}`}>
      {rank.rank_icon && (
        <Image src={rank.rank_icon} alt={div} width={32} height={32} unoptimized className="shrink-0" />
      )}
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {roleLabels[role] ?? role}
        </span>
        <span className={`font-bold text-sm ${colors.text} ${colors.glow}`}
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
        >
          {label} {rank.tier}
        </span>
      </div>
      {rank.role_icon && (
        <Image src={rank.role_icon} alt={role} width={16} height={16} unoptimized className="ml-auto shrink-0 opacity-60" />
      )}
    </div>
  );
}

export default function RankBadge({
  ranks,
  platform,
  roleLabels = DEFAULT_ROLE_LABELS,
}: {
  ranks: PlatformRanks;
  platform: string;
  roleLabels?: Record<string, string>;
}) {
  type RoleKey = "tank" | "damage" | "support" | "open";
  const entries = (["tank", "damage", "support", "open"] as RoleKey[])
    .map((role) => ({ role, rank: ranks[role] }))
    .filter((e): e is { role: RoleKey; rank: RoleRank } => e.rank !== null);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
        {platform} — Season {ranks.season}
      </span>
      <div className="flex flex-wrap gap-2">
        {entries.map(({ role, rank }) => (
          <RoleRankItem key={role} role={role} rank={rank} roleLabels={roleLabels} />
        ))}
      </div>
    </div>
  );
}
