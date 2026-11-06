import { getHeroes } from "@/lib/api";
import { HERO_PORTRAITS } from "@/lib/heroes";
import type { HeroRef } from "@/components/ui/Hero";

export async function getHeroRefs(lang: string): Promise<Record<string, HeroRef>> {
  const heroes = await getHeroes(lang);
  return Object.fromEntries(
    heroes.map((hero) => [
      hero.key,
      { name: hero.name, portrait: HERO_PORTRAITS[hero.key] ?? hero.portrait },
    ])
  );
}

export function formatDate(iso: string, lang: string): string {
  const locale = lang === "en" ? "en-US" : lang === "ko" ? "ko-KR" : "ja-JP";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date(iso));
}
