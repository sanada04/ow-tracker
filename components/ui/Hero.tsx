import Image from "next/image";
import Link from "next/link";

export interface HeroRef {
  name: string;
  portrait: string;
}

export function HeroCell({
  heroKey,
  hero,
  lang,
  note,
}: {
  heroKey: string;
  hero: HeroRef | undefined;
  lang: string;
  note?: string;
}) {
  return (
    <Link href={`/${lang}/heroes/${heroKey}`} className="flex items-center gap-2.5 min-w-0 hover:text-[var(--ow-accent)]">
      {hero?.portrait && (
        <Image src={hero.portrait} alt="" width={32} height={32} className="rounded-sm shrink-0" />
      )}
      <span className="truncate">{hero?.name ?? heroKey}</span>
      {note && <span className="text-xs text-[var(--ow-text-3)] shrink-0">{note}</span>}
    </Link>
  );
}

export const TIER_COLORS: Record<string, string> = {
  S: "#f4a029",
  A: "#9bc53d",
  B: "#6ea8e0",
  C: "#a0a3ab",
  D: "#ec7b7b",
};

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-sm font-bold text-[#101113]"
      style={{ background: TIER_COLORS[tier], fontFamily: "var(--font-heading)" }}
    >
      {tier}
    </span>
  );
}

export function SectionHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-3">
      <h2 className="text-xl font-bold">{children}</h2>
      {aside && <div className="text-sm text-[var(--ow-text-3)] shrink-0">{aside}</div>}
    </div>
  );
}

export function MapLeaderGrid({
  leaders,
  heroes,
  lang,
  bestLabel,
}: {
  leaders: { key: string; name: string; screenshot: string; hero: string; winrate: number }[];
  heroes: Record<string, HeroRef>;
  lang: string;
  bestLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {leaders.map((map) => (
        <Link key={map.key} href={`/${lang}/maps/${map.key}`} className="ow-card flex items-center gap-3 p-2">
          <Image src={map.screenshot} alt="" width={96} height={54} className="rounded-sm object-cover shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold truncate">{map.name}</p>
            <p className="text-sm text-[var(--ow-text-2)] truncate tabular">
              {bestLabel.replace("{hero}", heroes[map.hero]?.name ?? map.hero)} {map.winrate.toFixed(1)}%
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function RankedList({
  title,
  rows,
  heroes,
  lang,
}: {
  title: string;
  rows: { hero: string; value: string }[];
  heroes: Record<string, HeroRef>;
  lang: string;
}) {
  return (
    <section className="ow-card p-4">
      <h3 className="text-base font-bold mb-2">{title}</h3>
      <ol>
        {rows.map((row) => (
          <li key={row.hero} className="flex items-center justify-between gap-3 py-1.5 border-b border-[var(--ow-line)] last:border-0">
            <HeroCell heroKey={row.hero} hero={heroes[row.hero]} lang={lang} />
            <span className="tabular shrink-0">{row.value}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
