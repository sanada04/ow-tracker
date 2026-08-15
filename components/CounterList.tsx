"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { castCounterVoteAction, removeCounterVoteAction } from "@/app/actions/counter-vote";
import { getHeroDisplayName, HERO_PORTRAITS } from "@/lib/heroes";
import type { HeroListItem } from "@/types/overwatch";
import type { CounterVotes } from "@/lib/upstash";

const MAX_VOTES = 5;
const STORAGE_KEY = "ow_counter_votes";

function loadUserVotes(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveUserVote(heroKey: string, counterKey: string, add: boolean) {
  const current = loadUserVotes();
  const existing = current[heroKey] ?? [];
  if (add) {
    if (!existing.includes(counterKey)) current[heroKey] = [...existing, counterKey];
  } else {
    current[heroKey] = existing.filter((k) => k !== counterKey);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

interface Props {
  heroKey: string;
  heroes: HeroListItem[];
  initialVotes: CounterVotes;
  t: {
    vote_for: string;
    your_votes: string;
    top_counters: string;
    no_votes: string;
    vote_btn: string;
    voted_btn: string;
    remove_btn: string;
    votes_label: string;
  };
  lang: string;
}

export default function CounterList({ heroKey, heroes, initialVotes, t, lang }: Props) {
  const [votes, setVotes] = useState<CounterVotes>(initialVotes);
  const [myVotes, setMyVotes] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const stored = loadUserVotes();
    setMyVotes(stored[heroKey] ?? []);
  }, [heroKey]);

  const toggle = useCallback(
    (counterKey: string) => {
      const alreadyVoted = myVotes.includes(counterKey);
      if (!alreadyVoted && myVotes.length >= MAX_VOTES) return;

      const newMyVotes = alreadyVoted
        ? myVotes.filter((k) => k !== counterKey)
        : [...myVotes, counterKey];

      setMyVotes(newMyVotes);
      saveUserVote(heroKey, counterKey, !alreadyVoted);

      setVotes((prev) => ({
        ...prev,
        [counterKey]: Math.max(0, (prev[counterKey] ?? 0) + (alreadyVoted ? -1 : 1)),
      }));

      startTransition(async () => {
        if (alreadyVoted) {
          await removeCounterVoteAction(heroKey, counterKey);
        } else {
          await castCounterVoteAction(heroKey, counterKey);
        }
      });
    },
    [heroKey, myVotes]
  );

  const heroesExcludingSelf = heroes.filter((h) => h.key !== heroKey);

  const sorted = [...heroesExcludingSelf].sort((a, b) => {
    const va = votes[a.key] ?? 0;
    const vb = votes[b.key] ?? 0;
    return vb - va;
  });

  const topCounters = sorted.filter((h) => (votes[h.key] ?? 0) > 0);
  const unvoted = sorted.filter((h) => (votes[h.key] ?? 0) === 0);
  const totalVotes = Object.values(votes).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-8">
      {/* Top Counters */}
      <section>
        <div className="mb-4 pb-2 border-b border-zinc-800">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            {t.top_counters}
          </span>
        </div>
        {topCounters.length === 0 ? (
          <p className="text-zinc-500 text-sm">{t.no_votes}</p>
        ) : (
          <div className="space-y-2">
            {topCounters.map((hero, i) => {
              const voteCount = votes[hero.key] ?? 0;
              const voted = myVotes.includes(hero.key);
              const pct = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

              return (
                <div
                  key={hero.key}
                  className="ow-card px-4 py-3 flex items-center gap-4 animate-fade-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="text-zinc-600 text-sm tabular-nums w-6 shrink-0">{i + 1}</span>
                  <Image
                    src={HERO_PORTRAITS[hero.key] ?? hero.portrait}
                    alt={hero.name}
                    width={40}
                    height={40}
                    className="rounded shrink-0"
                    unoptimized
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${lang}/heroes/${hero.key}`}
                      className="text-white font-semibold hover:text-[#f4a029] transition-colors"
                      style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                    >
                      {getHeroDisplayName(hero.key)}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f4a029]/60 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-zinc-500 tabular-nums shrink-0">
                        {t.votes_label.replace("{n}", String(voteCount))}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/${lang}/counters/${hero.key}`}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 border border-zinc-700/50 px-2 py-1 rounded transition-colors"
                    >
                      Counters
                    </Link>
                    <button
                      onClick={() => toggle(hero.key)}
                      disabled={isPending}
                      className={`text-[11px] px-3 py-1 rounded border transition-colors ${
                        voted
                          ? "border-[#f4a029]/60 text-[#f4a029] bg-[#f4a029]/10"
                          : "border-zinc-700/50 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {voted ? t.voted_btn : t.vote_btn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Vote for a counter */}
      <section>
        <div className="mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            {t.vote_for}
          </span>
          <span className="text-xs text-zinc-600">
            {t.your_votes.replace("{n}", String(myVotes.length))}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {heroesExcludingSelf.map((hero) => {
            const voted = myVotes.includes(hero.key);
            const canVote = voted || myVotes.length < MAX_VOTES;

            return (
              <button
                key={hero.key}
                onClick={() => toggle(hero.key)}
                disabled={!canVote || isPending}
                className={`flex items-center gap-2 p-2.5 rounded border text-left transition-colors ${
                  voted
                    ? "border-[#f4a029]/50 bg-[#f4a029]/5 text-white"
                    : canVote
                    ? "border-zinc-800 bg-[#111119] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                    : "border-zinc-800/30 bg-[#0d0d15] text-zinc-600 opacity-50 cursor-not-allowed"
                }`}
              >
                <Image
                  src={HERO_PORTRAITS[hero.key] ?? hero.portrait}
                  alt={hero.name}
                  width={28}
                  height={28}
                  className="rounded shrink-0"
                  unoptimized
                />
                <span
                  className="text-xs font-medium truncate"
                  style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                >
                  {getHeroDisplayName(hero.key)}
                </span>
                {voted && (
                  <span className="ml-auto text-[#f4a029] shrink-0 text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
