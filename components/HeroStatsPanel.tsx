import Link from "next/link";
import { HeroCell, SectionHeading, TierBadge, type HeroRef } from "@/components/ui/Hero";
import type { ScoredHero } from "@/lib/meta-score";
import type { DivisionStat, HeroMapStat } from "@/lib/stats";
import type { Dictionary } from "@/lib/i18n";

const MAP_LIST_SIZE = 5;
const SAME_ROLE_SIZE = 6;

function MapList({
  title,
  rows,
  mapNames,
  lang,
  winLabel,
}: {
  title: string;
  rows: HeroMapStat[];
  mapNames: Record<string, string>;
  lang: string;
  winLabel: string;
}) {
  return (
    <div className="ow-card p-4 overflow-x-auto">
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <table className="ow-table">
        <thead>
          <tr>
            <th scope="col">{mapNames.__label}</th>
            <th scope="col">{winLabel}</th>
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
              <td>{row.winrate.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HeroStatsPanel({
  heroKey,
  heroName,
  scored,
  divisions,
  mapStats,
  mapNames,
  refs,
  lang,
  scope,
  labels,
}: {
  heroKey: string;
  heroName: string;
  scored: ScoredHero[];
  divisions: DivisionStat[];
  mapStats: HeroMapStat[];
  mapNames: Record<string, string>;
  refs: Record<string, HeroRef>;
  lang: string;
  scope: string;
  labels: Dictionary["data"];
}) {
  const self = scored.find((hero) => hero.hero === heroKey);
  if (!self) return null;

  const sameRole = scored
    .filter((hero) => hero.role === self.role && hero.hero !== heroKey)
    .slice(0, SAME_ROLE_SIZE);
  const summary = [
    { label: labels.col_win, value: `${self.winrate.toFixed(1)}%` },
    { label: labels.col_pick, value: `${self.pickrate.toFixed(1)}%` },
    { label: labels.col_ban, value: `${self.banrate.toFixed(1)}%` },
    { label: labels.col_score, value: String(self.score) },
  ];
  const namesWithLabel = { ...mapNames, __label: labels.col_map };
  const showMaps = mapStats.length >= MAP_LIST_SIZE * 2;

  return (
    <section className="space-y-6">
      <SectionHeading aside={scope}>{labels.hero_stats_h2.replace("{hero}", heroName)}</SectionHeading>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="ow-card p-3">
          <p className="text-sm text-[var(--ow-text-3)] mb-1">{labels.stat_tier}</p>
          <TierBadge tier={self.tier} />
        </div>
        {summary.map(({ label, value }) => (
          <div key={label} className="ow-card p-3">
            <p className="text-sm text-[var(--ow-text-3)] mb-1">{label}</p>
            <p className="ow-stat-value">{value}</p>
          </div>
        ))}
      </div>
      {self.lowData && <p className="text-sm text-[var(--ow-text-3)]">{labels.how_limits}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="ow-card p-4 overflow-x-auto">
          <h3 className="text-base font-bold mb-1">{labels.by_rank}</h3>
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col">{labels.col_rank}</th>
                <th scope="col">{labels.col_win}</th>
                <th scope="col">{labels.col_pick}</th>
                <th scope="col">{labels.col_ban}</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map(({ division, stat }) => (
                <tr key={division}>
                  <td>{labels.ranks[division]}</td>
                  <td>{stat ? `${stat.winrate.toFixed(1)}%` : "-"}</td>
                  <td>{stat ? `${stat.pickrate.toFixed(1)}%` : "-"}</td>
                  <td>{stat ? `${stat.banrate.toFixed(1)}%` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ow-card p-4 overflow-x-auto">
          <h3 className="text-base font-bold mb-1">{labels.same_role}</h3>
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col">{labels.col_hero}</th>
                <th scope="col">{labels.col_win}</th>
                <th scope="col">{labels.col_pick}</th>
                <th scope="col"><span className="sr-only">{labels.compare_link}</span></th>
              </tr>
            </thead>
            <tbody>
              {sameRole.map((hero) => (
                <tr key={hero.hero}>
                  <td><HeroCell heroKey={hero.hero} hero={refs[hero.hero]} lang={lang} /></td>
                  <td>{hero.winrate.toFixed(1)}%</td>
                  <td>{hero.pickrate.toFixed(1)}%</td>
                  <td>
                    <Link href={`/${lang}/heroes/${heroKey}/vs/${hero.hero}`} className="text-[var(--ow-accent)]">
                      {labels.compare_link}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMaps && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MapList title={labels.best_maps} rows={mapStats.slice(0, MAP_LIST_SIZE)} mapNames={namesWithLabel} lang={lang} winLabel={labels.col_win} />
          <MapList title={labels.worst_maps} rows={mapStats.slice(-MAP_LIST_SIZE).reverse()} mapNames={namesWithLabel} lang={lang} winLabel={labels.col_win} />
        </div>
      )}

      <p>
        <Link href={`/${lang}/counters/${heroKey}`} className="text-[var(--ow-accent)]">
          {labels.counters_link.replace("{hero}", heroName)}
        </Link>
      </p>
    </section>
  );
}
