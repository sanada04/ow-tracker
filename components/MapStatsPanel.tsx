import { RankedList, SectionHeading, type HeroRef } from "@/components/ui/Hero";
import { LOW_PICK_RATE, type HeroStat } from "@/lib/meta-score";
import type { Dictionary } from "@/lib/i18n";

const LIST_SIZE = 5;

export default function MapStatsPanel({
  mapName,
  rows,
  roles,
  refs,
  lang,
  scope,
  labels,
  roleLabels,
}: {
  mapName: string;
  rows: HeroStat[];
  roles: Record<string, string>;
  refs: Record<string, HeroRef>;
  lang: string;
  scope: string;
  labels: Dictionary["data"];
  roleLabels: Dictionary["player"]["roles"];
}) {
  const reliable = rows.filter((row) => row.pickrate >= LOW_PICK_RATE);
  const topWin = [...reliable].sort((a, b) => b.winrate - a.winrate).slice(0, LIST_SIZE);
  const topPick = [...rows].sort((a, b) => b.pickrate - a.pickrate).slice(0, LIST_SIZE);

  const roleSummary = (["tank", "damage", "support"] as const).map((role) => {
    const roleRows = rows.filter((row) => roles[row.hero] === role);
    const totalPick = roleRows.reduce((sum, row) => sum + row.pickrate, 0);
    const weightedWin = roleRows.reduce((sum, row) => sum + row.winrate * row.pickrate, 0);
    return { role, totalPick, averageWin: totalPick > 0 ? weightedWin / totalPick : 0 };
  });

  return (
    <section>
      <SectionHeading aside={scope}>{labels.map_stats_h2.replace("{map}", mapName)}</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RankedList
          title={labels.map_top_win}
          rows={topWin.map((row) => ({ hero: row.hero, value: `${row.winrate.toFixed(1)}%` }))}
          heroes={refs}
          lang={lang}
        />
        <RankedList
          title={labels.map_top_pick}
          rows={topPick.map((row) => ({ hero: row.hero, value: `${row.pickrate.toFixed(1)}%` }))}
          heroes={refs}
          lang={lang}
        />
        <div className="ow-card p-4 overflow-x-auto">
          <h3 className="text-base font-bold mb-1">{labels.map_roles}</h3>
          <table className="ow-table">
            <thead>
              <tr>
                <th scope="col">{labels.filter_role}</th>
                <th scope="col">{labels.role_win}</th>
                <th scope="col">{labels.role_pick}</th>
              </tr>
            </thead>
            <tbody>
              {roleSummary.map(({ role, totalPick, averageWin }) => (
                <tr key={role}>
                  <td style={{ color: `var(--ow-${role})` }}>{roleLabels[role]}</td>
                  <td>{averageWin.toFixed(1)}%</td>
                  <td>{totalPick.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
