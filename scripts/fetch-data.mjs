// Downloads OverFast data once, one request at a time, before `next build`.
// Parallel build workers would otherwise exceed the API rate limit.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dataFileName } from "../lib/build-data-path.mjs";

const BASE_URL = "https://overfast-api.tekrop.fr";
const OUT_DIR = ".build-data";
const STATS_DIR = join("public", "data", "stats");
const REQUEST_GAP_MS = 250;
const MAX_ATTEMPTS = 6;
const LOCALES = ["", "?locale=ja-jp", "?locale=ko-kr"];
const PLATFORMS = ["pc", "console"];
const REGIONS = ["asia", "americas", "europe"];
const DIVISIONS = ["all", "bronze", "silver", "gold", "platinum", "emerald", "diamond", "master", "grandmaster"];
const MAP_REGIONS = ["asia", "americas"];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Returns the response body, or null for a 4xx the caller chose to allow. */
async function get(path, { allowClientError = false } = {}) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (res.ok) {
      const body = await res.text();
      await wait(REQUEST_GAP_MS);
      return body;
    }
    if (res.status !== 429 && res.status < 500) {
      if (allowClientError) return null;
      throw new Error(`${path} failed with status ${res.status}`);
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    await wait(retryAfter > 0 ? retryAfter * 1000 : 2000 * 2 ** attempt);
  }
  throw new Error(`${path} kept failing after ${MAX_ATTEMPTS} attempts`);
}

async function download(path) {
  const body = await get(path);
  writeFileSync(join(OUT_DIR, dataFileName(path)), body);
  return JSON.parse(body);
}

function statsPath(platform, region, extra = {}) {
  const query = new URLSearchParams({ platform, gamemode: "competitive", region, ...extra });
  return `/heroes/stats?${query}`;
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(STATS_DIR, { recursive: true });

let count = 0;
let maps = [];
for (const locale of LOCALES) {
  const heroes = await download(`/heroes${locale}`);
  maps = await download(`/maps${locale}`);
  count += 2;
  for (const hero of heroes) {
    await download(`/heroes/${encodeURIComponent(hero.key)}${locale}`);
    count++;
  }
}

for (const platform of PLATFORMS) {
  for (const region of REGIONS) {
    for (const division of DIVISIONS) {
      const extra = division === "all" ? {} : { competitive_division: division };
      const body = await get(statsPath(platform, region, extra));
      if (JSON.parse(body).length === 0) {
        throw new Error(`No stats for ${platform}/${region}/${division}`);
      }
      writeFileSync(join(STATS_DIR, `${platform}-${region}-${division}.json`), body);
      count++;
    }
  }
}

const standardMaps = maps.filter((map) => map.uses?.includes("standard"));
for (const region of MAP_REGIONS) {
  for (const map of standardMaps) {
    const body = await get(statsPath("pc", region, { map: map.key }), { allowClientError: true });
    if (body !== null && JSON.parse(body).length > 0) {
      writeFileSync(join(OUT_DIR, `map-${region}-${map.key}.json`), body);
      count++;
    }
  }
}

writeFileSync(join("public", "data", "updated.json"), JSON.stringify({ updatedAt: new Date().toISOString() }));
console.log(`Downloaded ${count} responses`);
