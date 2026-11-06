// Blocks deployment when a build produced broken pages. OverFast outages can
// otherwise publish pages that return 200 but contain no data.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const LANGS = ["ja", "en", "ko"];
const MIN_PAGES = { heroes: 40, maps: 40, counters: 40 };
const INDEX_PAGES = ["heroes", "maps", "counters", "compare", "tier-list", "meta", "about", "privacy", "contact"];
const KANA = /[\u3040-\u30ff]/;

const problems = [];

function pageHeading(html) {
  return html.match(/<h1[^>]*>/) !== null;
}

function pageTitle(html) {
  return html.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
}

for (const lang of LANGS) {
  for (const [dir, minimum] of Object.entries(MIN_PAGES)) {
    const path = join(OUT, lang, dir);
    const pages = existsSync(path)
      ? readdirSync(path).filter((name) => name.endsWith(".html") && name !== "_.html")
      : [];

    if (pages.length < minimum) {
      problems.push(`${lang}/${dir}: only ${pages.length} pages`);
    }
    for (const page of pages) {
      const html = readFileSync(join(path, page), "utf8");
      const title = pageTitle(html);
      if (/404|could not be found/i.test(title) || title.startsWith("OW Tracker — ") || !pageHeading(html)) {
        problems.push(`${lang}/${dir}/${page}: missing content (title: "${title}")`);
      }
    }
  }

  const indexes = { heroes: "/heroes/", maps: "/maps/", counters: "/counters/" };
  for (const [page, link] of Object.entries(indexes)) {
    const html = readFileSync(join(OUT, lang, `${page}.html`), "utf8");
    const links = html.split(`/${lang}${link}`).length - 1;
    if (links < MIN_PAGES[page]) {
      problems.push(`${lang}/${page}: only ${links} links`);
    }
  }
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

for (const lang of LANGS) {
  for (const page of INDEX_PAGES) {
    const html = readFileSync(join(OUT, lang, `${page}.html`), "utf8");
    if (!pageHeading(html)) problems.push(`${lang}/${page}: no h1`);
    if (!html.includes('rel="canonical"')) problems.push(`${lang}/${page}: no canonical`);
  }
  for (const path of htmlFiles(join(OUT, lang))) {
    const html = readFileSync(path, "utf8");
    const title = pageTitle(html);
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    if (title.split("OW Tracker").length > 2) problems.push(`${path}: repeated site name in "${title}"`);
    if (lang === "ko" && KANA.test(title + description)) problems.push(`${path}: Japanese metadata in "${title}"`);
  }
}

if (problems.length > 0) {
  console.error(`Build verification failed (${problems.length} problems):`);
  console.error(problems.slice(0, 20).join("\n"));
  process.exit(1);
}
console.log("Build verification passed");
