import Image from "next/image";
import Link from "next/link";
import { SectionHeading, TierBadge, type HeroRef } from "@/components/ui/Hero";
import type { Dictionary } from "@/lib/i18n";
import type { ScoredHero } from "@/lib/meta-score";
import type { DivisionStat, HeroMapStat } from "@/lib/stats";
import { matchupPath } from "@/lib/stats-config";

const MAP_LIST_SIZE = 5;

export interface MatchupSide {
  key: string;
  ref: HeroRef;
  stat: ScoredHero;
  hitpoints: number | null;
  divisions: DivisionStat[];
  maps: HeroMapStat[];
}

interface MapGap {
  mapKey: string;
  winA: number;
  winB: number;
}

function mapGaps(a: MatchupSide, b: MatchupSide): MapGap[] {
  const winsB = new Map(b.maps.map((map) => [map.mapKey, map.winrate]));
  return a.maps
    .flatMap((map) => {
      const winB = winsB.get(map.mapKey);
      return winB === undefined ? [] : [{ mapKey: map.mapKey, winA: map.winrate, winB }];
    })
    .sort((x, y) => y.winA - y.winB - (x.winA - x.winB));
}

/** Highlights the higher of two values in a comparison row. */
function Value({ value, other, text }: { value: number | null; other: number | null; text: string }) {
  const higher = value !== null && other !== null && value > other;
  return <td className={higher ? "text-[var(--ow-accent)] font-semibold" : undefined}>{text}</td>;
}

function percent(value: number | undefined): string {
  return value === undefined ? "-" : `${value.toFixed(1)}%`;
}

function MapGapList({
  title,
  rows,
  nameA,
  nameB,
  mapNames,
  mapLabel,
  lang,
}: {
  title: string;
  rows: MapGap[];
  nameA: string;
  nameB: string;
  mapNames: Record<string, string>;
  mapLabel: string;
  lang: string;
}) {
  return (
    <div className="ow-card p-4 overflow-x-auto">
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <table className="ow-table">
        <thead>
          <tr>
            <th scope="col">{mapLabel}</th>
            <th scope="col">{nameA}</th>
            <th scope="col">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.mapKey}>
              <td>
                <Link href={`/${lang}/maps/${row.mapKey}`} className="hover:text-[var(--ow-accent)]">
                  {mapNames[row.mapKey] ?? row.mapKey}
                </Link>
              </td>
              <Value value={row.winA} other={row.winB} text={percent(row.winA)} />
              <Value value={row.winB} other={row.winA} text={percent(row.winB)} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function verdict(a: MatchupSide, b: MatchupSide, t: Dictionary["data"]): string {
  if (a.stat.score === b.stat.score) {
    return t.vs_verdict_tie.replace("{a}", a.ref.name).replace("{b}", b.ref.name).replace("{score}", String(a.stat.score));
  }
  const [high, low] = a.stat.score > b.stat.score ? [a, b] : [b, a];
  return t.vs_verdict
    .replace("{winner}", high.ref.name)
    .replace("{high}", String(high.stat.score))
    .replace("{loser}", low.ref.name)
    .replace("{low}", String(low.stat.score));
}

export default function HeroMatchup({
  a,
  b,
  related,
  refs,
  mapNames,
  lang,
  scope,
  hpLabel,
  labels: t,
}: {
  a: MatchupSide;
  b: MatchupSide;
  related: [string, string][];
  refs: Record<string, HeroRef>;
  mapNames: Record<string, string>;
  lang: string;
  scope: string;
  hpLabel: string;
  labels: Dictionary["data"];
}) {
  const nameA = a.ref.name;
  const nameB = b.ref.name;
  const gaps = mapGaps(a, b);
  const aAhead = gaps.filter((gap) => gap.winA > gap.winB).slice(0, MAP_LIST_SIZE);
  const bAhead = gaps.filter((gap) => gap.winB > gap.winA).reverse().slice(0, MAP_LIST_SIZE);
  const divisionsB = new Map(b.divisions.map((row) => [row.division, row.stat]));

  const overview: { label: string; numA: number | null; numB: number | null; textA: string; textB: string }[] = [
    { label: t.col_score, numA: a.stat.score, numB: b.stat.score, textA: String(a.stat.score), textB: String(b.stat.score) },
    { label: t.col_win, numA: a.stat.winrate, numB: b.stat.winrate, textA: percent(a.stat.winrate), textB: percent(b.stat.winrate) },
    { label: t.col_pick, numA: a.stat.pickrate, numB: b.stat.pickrate, textA: percent(a.stat.pickrate), textB: percent(b.stat.pickrate) },
    { label: t.col_ban, numA: a.stat.banrate, numB: b.stat.banrate, textA: percent(a.stat.banrate), textB: percent(b.stat.banrate) },
    { label: hpLabel, numA: a.hitpoints, numB: b.hitpoints, textA: String(a.hitpoints ?? "-"), textB: String(b.hitpoints ?? "-") },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <header>
        <div className="flex items-center gap-3 mb-3">
          <Image src={a.ref.portrait} alt="" width={56} height={56} className="rounded-sm" />
          <Image src={b.ref.portrait} alt="" width={56} height={56} className="rounded-sm" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t.vs_h1.replace("{a}", nameA).replace("{b}", nameB)}</h1>
        <p className="text-[var(--ow-text-2)]">{verdict(a, b, t)}</p>
        <p className="text-sm text-[var(--ow-text-3)] mt-2">{t.vs_note}</p>
      </header>

      <section>
        <SectionHeading aside={scope}>{t.vs_overview}</SectionHeading>
        <div className="ow-card p-4 overflow-x-auto">
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">{t.col_hero}</span></th>
                <th scope="col"><Link href={`/${lang}/heroes/${a.key}`} className="hover:text-[var(--ow-accent)]">{nameA}</Link></th>
                <th scope="col"><Link href={`/${lang}/heroes/${b.key}`} className="hover:text-[var(--ow-accent)]">{nameB}</Link></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t.stat_tier}</td>
                <td><TierBadge tier={a.stat.tier} /></td>
                <td><TierBadge tier={b.stat.tier} /></td>
              </tr>
              {overview.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <Value value={row.numA} other={row.numB} text={row.textA} />
                  <Value value={row.numB} other={row.numA} text={row.textB} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeading aside={scope}>{t.by_rank}</SectionHeading>
        <div className="ow-card p-4 overflow-x-auto">
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col">{t.col_rank}</th>
                <th scope="col">{nameA}</th>
                <th scope="col">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              {a.divisions.map(({ division, stat }) => {
                const other = divisionsB.get(division);
                return (
                  <tr key={division}>
                    <td>
                      <Link href={`/${lang}/stats/ranks/${division}`} className="hover:text-[var(--ow-accent)]">
                        {t.ranks[division]}
                      </Link>
                    </td>
                    <Value value={stat?.winrate ?? null} other={other?.winrate ?? null} text={percent(stat?.winrate)} />
                    <Value value={other?.winrate ?? null} other={stat?.winrate ?? null} text={percent(other?.winrate)} />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {(aAhead.length > 0 || bAhead.length > 0) && (
        <section>
          <SectionHeading aside={scope}>{t.vs_maps_h2}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aAhead.length > 0 && (
              <MapGapList title={t.vs_map_ahead.replace("{hero}", nameA)} rows={aAhead} nameA={nameA} nameB={nameB} mapNames={mapNames} mapLabel={t.col_map} lang={lang} />
            )}
            {bAhead.length > 0 && (
              <MapGapList title={t.vs_map_ahead.replace("{hero}", nameB)} rows={bAhead} nameA={nameA} nameB={nameB} mapNames={mapNames} mapLabel={t.col_map} lang={lang} />
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">{t.vs_related}</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {[a, b].map((side) => (
            <li key={side.key}>
              <Link href={`/${lang}/counters/${side.key}`} className="text-[var(--ow-accent)]">
                {t.counters_link.replace("{hero}", side.ref.name)}
              </Link>
            </li>
          ))}
          {related.map(([first, second]) => (
            <li key={`${first}-${second}`}>
              <Link href={matchupPath(lang, first, second)} className="text-[var(--ow-accent)]">
                {t.vs_h1.replace("{a}", refs[first]?.name ?? first).replace("{b}", refs[second]?.name ?? second)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
