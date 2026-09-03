import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";

export type { Dictionary } from "./en";
export type Locale = "ja" | "en" | "ko";

export const LOCALES: Locale[] = ["ja", "en", "ko"];
export const DEFAULT_LOCALE: Locale = "ja";

export function getDictionary(locale: string) {
  if (locale === "en") return en;
  if (locale === "ko") return ko;
  return ja;
}

/**
 * Parses an Accept-Language header (e.g. "en-US,en;q=0.9,ja;q=0.8") into
 * the best-matching supported locale, ordered by the browser's stated
 * preference. Falls back to DEFAULT_LOCALE when nothing matches.
 */
export function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { primary: tag.trim().toLowerCase().split("-")[0], q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { primary } of preferences) {
    if ((LOCALES as string[]).includes(primary)) return primary as Locale;
  }
  return DEFAULT_LOCALE;
}
