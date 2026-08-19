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
