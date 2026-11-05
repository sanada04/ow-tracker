// Downloads OverFast data once, one request at a time, before `next build`.
// Parallel build workers would otherwise exceed the API rate limit.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { dataFileName } from "../lib/build-data-path.mjs";

const BASE_URL = "https://overfast-api.tekrop.fr";
const OUT_DIR = ".build-data";
const REQUEST_GAP_MS = 250;
const MAX_ATTEMPTS = 6;
const LOCALES = ["", "?locale=ja-jp"];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function download(path) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (res.ok) {
      const body = await res.text();
      writeFileSync(join(OUT_DIR, dataFileName(path)), body);
      await wait(REQUEST_GAP_MS);
      return JSON.parse(body);
    }
    if (res.status !== 429 && res.status < 500) {
      throw new Error(`${path} failed with status ${res.status}`);
    }
    const retryAfter = Number(res.headers.get("retry-after"));
    await wait(retryAfter > 0 ? retryAfter * 1000 : 2000 * 2 ** attempt);
  }
  throw new Error(`${path} kept failing after ${MAX_ATTEMPTS} attempts`);
}

mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const locale of LOCALES) {
  const heroes = await download(`/heroes${locale}`);
  await download(`/maps${locale}`);
  count += 2;
  for (const hero of heroes) {
    await download(`/heroes/${encodeURIComponent(hero.key)}${locale}`);
    count++;
  }
}
console.log(`Downloaded ${count} responses`);
