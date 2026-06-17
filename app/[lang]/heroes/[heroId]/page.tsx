import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHeroDetail } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";
import AbilityVideoPlayer from "@/components/AbilityVideoPlayer";
import type { Metadata } from "next";
import type { HeroAbility, HeroPerk, HeroStoryChapter } from "@/types/overwatch";

interface Props {
  params: Promise<{ lang: string; heroId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, heroId } = await params;
  try {
    const hero = await getHeroDetail(heroId);
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

// ── Design constants ─────────────────────────────────────────────────────
const ROLE_COLORS = {
  tank:    { text: "text-blue-400",  border: "border-blue-500/40",  bg: "bg-blue-900/20",  glow: "shadow-blue-500/20"   },
  damage:  { text: "text-red-400",   border: "border-red-500/40",   bg: "bg-red-900/20",   glow: "shadow-red-500/20"    },
  support: { text: "text-green-400", border: "border-green-500/40", bg: "bg-green-900/20", glow: "shadow-green-500/20"  },
};

// ── Sub-components ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="ow-section-title mb-5">{children}</p>
  );
}

function InfoChip({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="ow-card-sm px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <p
        className={`font-bold text-base leading-tight ${accent ? "text-[#f4a029]" : "text-white"}`}
        style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
      >
        {value}
      </p>
    </div>
  );
}

function HpBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  if (value === 0) return null;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium w-16 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full winrate-bar ${color.replace("text-", "bg-")}`}
          style={{ "--bar-target": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums w-10 text-right ${color}`}
        style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}

function AbilityCard({ ability, index }: { ability: HeroAbility; index: number }) {
  return (
    <div
      className="ow-card overflow-hidden animate-fade-up"
      style={{ animationDelay: `${120 + index * 60}ms` }}
    >
      {/* Video or thumbnail */}
      {ability.video ? (
        <AbilityVideoPlayer
          thumbnail={ability.video.thumbnail}
          mp4={ability.video.link.mp4}
          webm={ability.video.link.webm}
          name={ability.name}
        />
      ) : (
        <div className="aspect-video bg-[#0d0d1a] flex items-center justify-center">
          <Image src={ability.icon} alt={ability.name} width={64} height={64} unoptimized className="opacity-30" />
        </div>
      )}

      {/* Info */}
      <div className="p-4 flex gap-3">
        <Image
          src={ability.icon}
          alt={ability.name}
          width={40}
          height={40}
          unoptimized
          className="rounded border border-zinc-700/50 shrink-0 self-start"
        />
        <div className="min-w-0">
          <p
            className="text-white font-bold text-base mb-1 leading-tight"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.04em" }}
          >
            {ability.name}
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">{ability.description}</p>
        </div>
      </div>
    </div>
  );
}

function PerkCard({ perk, index }: { perk: HeroPerk; index: number }) {
  return (
    <div className="ow-card-sm p-4 flex gap-3 animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <Image
        src={perk.icon}
        alt={perk.name}
        width={40}
        height={40}
        unoptimized
        className="rounded border border-zinc-700/50 shrink-0 self-start"
      />
      <div className="min-w-0">
        <p
          className="text-white font-semibold text-sm mb-1"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.04em" }}
        >
          {perk.name}
        </p>
        <p className="text-zinc-400 text-xs leading-relaxed">{perk.description}</p>
      </div>
    </div>
  );
}

function StadiumPowerCard({ perk, index }: { perk: HeroPerk; index: number }) {
  return (
    <div className="ow-card-sm p-3 flex gap-3 animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
      <Image
        src={perk.icon}
        alt={perk.name}
        width={36}
        height={36}
        unoptimized
        className="rounded border border-zinc-700/50 shrink-0 self-start"
      />
      <div className="min-w-0">
        <p
          className="text-white font-semibold text-xs mb-0.5"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.04em" }}
        >
          {perk.name}
        </p>
        <p className="text-zinc-500 text-[11px] leading-relaxed">{perk.description}</p>
      </div>
    </div>
  );
}

function StoryChapter({ chapter, index }: { chapter: HeroStoryChapter; index: number }) {
  const isOdd = index % 2 === 1;
  return (
    <div
      className={`flex flex-col ${chapter.picture ? (isOdd ? "sm:flex-row-reverse" : "sm:flex-row") : ""} gap-5 animate-fade-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {chapter.picture && (
        <div className="sm:w-64 shrink-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-zinc-800/60">
            <Image src={chapter.picture} alt={chapter.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/60 to-transparent" />
          </div>
        </div>
      )}
      <div className="flex-1">
        <p
          className="text-[#f4a029] text-sm font-bold uppercase tracking-wider mb-2"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
        >
          {chapter.title}
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">{chapter.content}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function HeroDetailPage({ params }: Props) {
  const { lang, heroId } = await params;
  const dict = getDictionary(lang);
  const t = dict.hero_detail;

  let hero;
  try {
    hero = await getHeroDetail(heroId);
  } catch {
    notFound();
  }

  const bgUrl = hero.backgrounds.at(-1)?.url ?? hero.backgrounds[0]?.url ?? null;
  const roleColors = ROLE_COLORS[hero.role] ?? {
    text: "text-zinc-300", border: "border-zinc-600", bg: "bg-zinc-800/20", glow: "",
  };
  const hp = hero.hitpoints;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">

      {/* ── Full-width background banner ── */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {bgUrl ? (
          <>
            <Image
              src={bgUrl}
              alt={hero.name}
              fill
              className="object-cover object-top"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/10 via-[#0a0a12]/50 to-[#0a0a12]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a12]/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#131320] to-[#0a0a12]" />
        )}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(244,160,41,0.3) 40px, rgba(244,160,41,0.3) 41px)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-36 relative space-y-12 pb-20">

        {/* Back */}
        <Link
          href={`/${lang}/heroes`}
          className="inline-block text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f4a029] transition-colors"
        >
          {t.back}
        </Link>

        {/* ── Hero header ── */}
        <div className="flex flex-col sm:flex-row items-start gap-6 animate-fade-up">
          <div className="shrink-0 shadow-2xl">
            <Image
              src={hero.portrait}
              alt={hero.name}
              width={140}
              height={140}
              unoptimized
              priority
              className={`border-2 border-[#f4a029] shadow-lg ${roleColors.glow}`}
              style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
            />
          </div>
          <div className="flex-1 pt-2">
            <h1
              className="text-6xl sm:text-7xl font-bold text-white leading-none mb-3"
              style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.03em" }}
            >
              {hero.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-[11px] uppercase tracking-widest px-3 py-1 border font-medium ${roleColors.text} ${roleColors.border} ${roleColors.bg}`}
                style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
              >
                {hero.role}
              </span>
              {hero.subrole && (
                <span
                  className="text-[11px] uppercase tracking-widest px-3 py-1 border border-zinc-700/40 text-zinc-500"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                >
                  {hero.subrole}
                </span>
              )}
            </div>
            {hero.description && (
              <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">{hero.description}</p>
            )}
          </div>
        </div>

        {/* ── Profile info + HP ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: "60ms" }}>
          {/* Info chips */}
          <div>
            <SectionTitle>{t.hitpoints_label}</SectionTitle>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {hero.location && <InfoChip label={t.location_label} value={hero.location} />}
              {hero.age !== null && hero.age !== undefined && (
                <InfoChip label={t.age_label} value={hero.age} />
              )}
              {hero.birthday && <InfoChip label={t.birthday_label} value={hero.birthday} />}
            </div>
          </div>

          {/* HP bars */}
          {hp && (
            <div>
              <SectionTitle>{t.hitpoints_label}</SectionTitle>
              <div className="ow-card p-5 space-y-3">
                <HpBar label={t.hp_health}  value={hp.health}  total={hp.total} color="text-green-400" />
                <HpBar label={t.hp_armor}   value={hp.armor}   total={hp.total} color="text-yellow-400" />
                <HpBar label={t.hp_shields} value={hp.shields} total={hp.total} color="text-blue-400" />
                <div className="border-t border-zinc-800/60 pt-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">{t.hp_total}</span>
                  <span
                    className="text-[#f4a029] font-bold text-xl"
                    style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
                  >
                    {hp.total}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Abilities ── */}
        {hero.abilities.length > 0 && (
          <div>
            <SectionTitle>{t.abilities_label}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hero.abilities.map((ability, i) => (
                <AbilityCard key={ability.name} ability={ability} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Perks ── */}
        {hero.perks && (hero.perks.minor.length > 0 || hero.perks.major.length > 0) && (
          <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <SectionTitle>{t.perks_label}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Minor */}
              {hero.perks.minor.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">{t.perks_minor}</span>
                    <span className="text-[10px] text-zinc-700">— {t.perks_choose}</span>
                  </div>
                  <div className="space-y-2">
                    {hero.perks.minor.map((p, i) => (
                      <PerkCard key={p.name} perk={p} index={i} />
                    ))}
                  </div>
                </div>
              )}
              {/* Major */}
              {hero.perks.major.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#f4a029]/70">{t.perks_major}</span>
                    <span className="text-[10px] text-zinc-700">— {t.perks_choose}</span>
                  </div>
                  <div className="space-y-2">
                    {hero.perks.major.map((p, i) => (
                      <PerkCard key={p.name} perk={p} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Stadium Powers ── */}
        {hero.stadium_powers && hero.stadium_powers.length > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <SectionTitle>{t.stadium_label}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hero.stadium_powers.map((p, i) => (
                <StadiumPowerCard key={p.name} perk={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Story ── */}
        {hero.story && (
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <SectionTitle>{t.story_label}</SectionTitle>

            {/* Summary */}
            <div
              className="ow-card p-6 mb-8 border-l-2 border-[#f4a029]/40"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              <p className="text-zinc-300 text-sm leading-relaxed">{hero.story.summary}</p>
            </div>

            {/* Chapters */}
            {hero.story.chapters.length > 0 && (
              <div className="space-y-10">
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
