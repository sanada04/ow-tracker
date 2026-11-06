const SITE_URL = "https://owtracker.org";

/** Canonical and hreflang links for a page that exists in every language. */
export function localeAlternates(lang: string, path: string) {
  const url = (locale: string) => `${SITE_URL}/${locale}${path}`;
  return {
    canonical: url(lang),
    languages: { ja: url("ja"), en: url("en"), ko: url("ko"), "x-default": url("ja") },
  };
}
