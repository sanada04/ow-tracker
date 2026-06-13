import { en } from "./en";
import { ja } from "./ja";

export type { Dictionary } from "./en";
export type Locale = "ja" | "en";

export const LOCALES: Locale[] = ["ja", "en"];
export const DEFAULT_LOCALE: Locale = "ja";

export function getDictionary(locale: string) {
  return locale === "en" ? en : ja;
}
