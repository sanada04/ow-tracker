/** Shared by scripts/fetch-data.mjs and lib/api.ts so both agree on file names. */
export function dataFileName(path) {
  return `${encodeURIComponent(path)}.json`;
}
