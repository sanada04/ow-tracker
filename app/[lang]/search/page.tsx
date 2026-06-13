import Image from "next/image";
import Link from "next/link";
import { searchPlayers } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { q } = await searchParams;
  const isEn = lang === "en";
  const title = q
    ? isEn ? `Results for "${q}" — OW Tracker` : `「${q}」の検索結果 — OW Tracker`
    : "Search — OW Tracker";
  return { title, robots: { index: false } };
}

export default async function SearchResultsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { q } = await searchParams;
  const dict = getDictionary(lang);
  const t = dict.search_results;

  const raw = q?.trim() ?? "";
  const apiResults = raw.length >= 2 ? await searchPlayers(raw).catch(() => []) : [];

  const ql = raw.toLowerCase();
  const results = [...apiResults].sort((a, b) => {
    const al = a.name.toLowerCase();
    const bl = b.name.toLowerCase();
    const score = (n: string) => (n === ql ? 0 : n.startsWith(ql) ? 1 : n.includes(ql) ? 2 : 3);
    return score(al) - score(bl);
  });

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Search bar */}
        <div className="mb-10">
          <SearchBar
            defaultValue={q ?? ""}
            placeholder={dict.search.placeholder}
            buttonText={dict.search.button}
            noResultsText={dict.search.no_results}
            notPublicText={t.private}
            lang={lang}
            autoFocus={false}
          />
        </div>

        {/* Heading */}
        {raw ? (
          <div className="mb-6">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
            >
              {t.title.replace("{query}", raw)}
            </h1>
            {results.length > 0 && (
              <p className="text-sm text-zinc-500 mt-1">
                {t.count.replace("{count}", String(results.length))}
              </p>
            )}
          </div>
        ) : null}

        {/* Results */}
        {!raw ? (
          <p className="text-zinc-500 text-sm">{t.no_query}</p>
        ) : results.length === 0 ? (
          <p className="text-zinc-500 text-sm">{t.no_results.replace("{query}", raw)}</p>
        ) : (
          <ul className="space-y-2">
            {results.map((result, i) => (
              <li key={result.player_id}>
                <Link
                  href={`/${lang}/players/${encodeURIComponent(result.player_id.replace(/%7C/gi, "|"))}`}
                  className="flex items-center gap-4 px-5 py-4 bg-[#131320] border border-zinc-800/60 hover:border-[#f4a029]/40 hover:bg-[#1a1a2a] transition-colors animate-fade-up"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {result.avatar ? (
                    <Image
                      src={result.avatar}
                      alt={result.name}
                      width={44}
                      height={44}
                      className="rounded shrink-0 border border-zinc-700/40"
                      unoptimized
                    />
                  ) : (
                    <div className="w-11 h-11 rounded bg-zinc-800 shrink-0 flex items-center justify-center text-base font-bold text-zinc-400">
                      {result.name[0].toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-white font-bold text-base truncate"
                      style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.03em" }}
                    >
                      {result.name}
                    </p>
                    {result.title && (
                      <p className="text-[11px] text-[#f4a029]/70 truncate">{result.title}</p>
                    )}
                  </div>

                  {!result.is_public && (
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 shrink-0 border border-zinc-700/40 px-2 py-0.5">
                      {t.private}
                    </span>
                  )}

                  <span className="text-zinc-600 text-sm shrink-0">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
