import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroDetail } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import AbilityShowcase from "@/components/AbilityShowcase";
import HeroHpDisplay from "@/components/HeroHpDisplay";
import type { Metadata } from "next";
import type { HeroPerk, HeroStoryChapter } from "@/types/overwatch";

interface Props {
  params: Promise<{ lang: string; heroId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, heroId } = await params;
  try {
    const hero = await getHeroDetail(heroId, lang);
    const isEn = lang === "en";
    return {
      title: `${hero.name} — OW Tracker`,
      description:
        hero.story?.summary ??
        hero.description ??
        (isEn
          ? `${hero.name} abilities, perks, and story in Overwatch 2.`
          : `${hero.name} のアビリティ・パーク・ストーリー詳細 — Overwatch 2`),
      openGraph: {
        title: `${hero.name} | OW Tracker`,
        images: hero.portrait ? [{ url: hero.portrait }] : [],
      },
    };
  } catch {
    return { title: "Hero — OW Tracker" };
  }
}

const ROLE_COLORS = {
  tank:    { text: "text-blue-400",  border: "border-blue-500/50",  bg: "bg-blue-950/40",  accent: "#60a5fa" },
  damage:  { text: "text-red-400",   border: "border-red-500/50",   bg: "bg-red-950/40",   accent: "#f87171" },
  support: { text: "text-green-400", border: "border-green-500/50", bg: "bg-green-950/40", accent: "#4ade80" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-[1px] w-6 bg-[#f4a029]/60" />
      <span
        className="text-[11px] uppercase tracking-[0.25em] text-[#f4a029]/80 font-medium"
      >
        {children}
      </span>
      <div className="h-[1px] flex-1 bg-zinc-800/60" />
    </div>
  );
}

function PerkCard({ perk, highlight = false }: { perk: HeroPerk; highlight?: boolean }) {
  return (
    <div className={`flex gap-4 p-4 border transition-colors ${
      highlight
        ? "border-[#f4a029]/30 bg-[#f4a029]/5"
        : "border-zinc-800/60 bg-[#0d0d1a]"
    }`}
      style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
    >
      <div className={`shrink-0 w-10 h-10 rounded-sm border overflow-hidden ${
        highlight ? "border-[#f4a029]/40" : "border-zinc-700/40"
      }`}>
        <Image src={perk.icon} alt={perk.name} width={40} height={40} unoptimized />
      </div>
      <div className="min-w-0">
        <p
          className={`font-bold text-sm mb-1 leading-tight ${highlight ? "text-[#f4a029]" : "text-white"}`}
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
        >
          {perk.name}
        </p>
        <p className="text-zinc-500 text-xs leading-relaxed">{perk.description}</p>
      </div>
    </div>
  );
}

function StoryChapter({ chapter, index }: { chapter: HeroStoryChapter; index: number }) {
  const isOdd = index % 2 === 1;
  return (
    <div className={`flex flex-col ${chapter.picture ? (isOdd ? "sm:flex-row-reverse" : "sm:flex-row") : ""} gap-6`}>
      {chapter.picture && (
        <div className="sm:w-72 shrink-0">
          <div className="relative aspect-[16/10] overflow-hidden border border-zinc-800/60"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}>
            <Image src={chapter.picture} alt={chapter.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/70 to-transparent" />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        <p
          className="text-[11px] uppercase tracking-[0.2em] text-[#f4a029]/70 mb-2 font-medium"
        >
          {chapter.title}
        </p>
        <p className="text-zinc-400 text-sm leading-[1.8]">{chapter.content}</p>
      </div>
    </div>
  );
}

export default async function HeroDetailPage({ params }: Props) {
  const { lang, heroId } = await params;
  const dict = getDictionary(lang);
  const t = dict.hero_detail;

  let hero;
  try {
    hero = await getHeroDetail(heroId, lang);
  } catch {
    notFound();
  }

  const bgUrl = hero.backgrounds.find(b => b.sizes.includes("lg"))?.url
    ?? hero.backgrounds.at(-1)?.url
    ?? null;
  const roleColors = ROLE_COLORS[hero.role] ?? {
    text: "text-zinc-300", border: "border-zinc-600", bg: "bg-zinc-800/20", accent: "#a1a1aa",
  };
  const hp = hero.hitpoints;
  const roleLabel = dict.player.roles[hero.role as keyof typeof dict.player.roles] ?? hero.role;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">

      {/* ── Cinematic banner ── */}
      <div className="relative h-[55vh] min-h-72 overflow-hidden">
        {bgUrl ? (
          <>
            <Image src={bgUrl} alt={hero.name} fill className="object-cover object-center" unoptimized priority />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to bottom, rgba(10,10,18,0.1) 0%, rgba(10,10,18,0.5) 60%, rgba(10,10,18,1) 100%)"
            }} />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to right, rgba(10,10,18,0.8) 0%, transparent 50%)"
            }} />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#131320] to-[#0a0a12]" />
        )}

        {/* Hero name overlaid on banner */}
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-8">
          <Link
            href={`/${lang}/heroes`}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f4a029] transition-colors mb-6"
          >
            <span className="text-xs">←</span> {t.back}
          </Link>

          <div className="flex items-end gap-5">
            <Image
              src={hero.portrait}
              alt={hero.name}
              width={96}
              height={96}
              unoptimized
              priority
              className="border border-zinc-700/60 shrink-0"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border font-medium ${roleColors.text} ${roleColors.border} ${roleColors.bg}`}
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}>
                  {roleLabel}
                </span>
                {hero.subrole && (
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border border-zinc-700/40 text-zinc-500"
                    style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}>
                    {hero.subrole}
                  </span>
                )}
              </div>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none text-white"
                style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.02em" }}
              >
                {hero.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-16">

        {/* ── Bio strip ── */}
        {(hero.description || hero.location || hero.age != null || hero.birthday) && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-start">
            {hero.description && (
              <p className="text-zinc-300 text-sm leading-[1.9] max-w-2xl">{hero.description}</p>
            )}
            {(hero.location || hero.age != null || hero.birthday) && (
              <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 text-right shrink-0">
                {hero.location && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">{t.location_label}</p>
                    <p className="text-white text-sm font-medium">{hero.location}</p>
                  </div>
                )}
                {hero.age != null && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">{t.age_label}</p>
                    <p className="text-white text-sm font-medium">{hero.age}</p>
                  </div>
                )}
                {hero.birthday && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">{t.birthday_label}</p>
                    <p className="text-white text-sm font-medium">{hero.birthday}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── HP ── */}
        {hp && (
          <div>
            <SectionLabel>{t.hitpoints_label}</SectionLabel>
            <HeroHpDisplay
              health={hp.health}
              armor={hp.armor}
              shields={hp.shields}
              total={hp.total}
              labels={{ health: t.hp_health, armor: t.hp_armor, shields: t.hp_shields, total: t.hp_total }}
            />
          </div>
        )}

        {/* ── Abilities ── */}
        {hero.abilities.length > 0 && (
          <div>
            <SectionLabel>{t.abilities_label}</SectionLabel>
            <AbilityShowcase abilities={hero.abilities} />
          </div>
        )}

        {/* ── Perks ── */}
        {hero.perks && (hero.perks.minor.length > 0 || hero.perks.major.length > 0) && (
          <div>
            <SectionLabel>{t.perks_label}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hero.perks.minor.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
                    {t.perks_minor} <span className="text-zinc-700 ml-1">— {t.perks_choose}</span>
                  </p>
                  <div className="space-y-2">
                    {hero.perks.minor.map(p => <PerkCard key={p.name} perk={p} />)}
                  </div>
                </div>
              )}
              {hero.perks.major.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#f4a029]/60 mb-3">
                    {t.perks_major} <span className="text-zinc-700 ml-1">— {t.perks_choose}</span>
                  </p>
                  <div className="space-y-2">
                    {hero.perks.major.map(p => <PerkCard key={p.name} perk={p} highlight />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Stadium Powers ── */}
        {hero.stadium_powers && hero.stadium_powers.length > 0 && (
          <div>
            <SectionLabel>{t.stadium_label}</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {hero.stadium_powers.map(p => (
                <div key={p.name} className="flex gap-3 p-3 border border-zinc-800/40 bg-[#0d0d1a]"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}>
                  <div className="w-8 h-8 shrink-0 rounded-sm border border-zinc-700/40 overflow-hidden">
                    <Image src={p.icon} alt={p.name} width={32} height={32} unoptimized />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold leading-tight mb-0.5"
                      style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>{p.name}</p>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Story ── */}
        {hero.story && (
          <div>
            <SectionLabel>{t.story_label}</SectionLabel>

            {hero.story.summary && (
              <div className="relative mb-12 pl-5 border-l border-[#f4a029]/30">
                <p className="text-zinc-300 text-sm leading-[1.9]">{hero.story.summary}</p>
              </div>
            )}

            {hero.story.chapters.length > 0 && (
              <div className="space-y-12">
                {hero.story.chapters.map((chapter, i) => (
                  <StoryChapter key={chapter.title} chapter={chapter} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
