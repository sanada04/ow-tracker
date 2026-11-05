"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Reads a URL path segment on the client. Player and matchup pages are served
 * from one prebuilt page, so the real id exists only in the browser URL.
 * Returns "" during prerendering.
 */
export function usePathSegment(index: number): string {
  return useSyncExternalStore(
    subscribe,
    () => decodeURIComponent(window.location.pathname.split("/").filter(Boolean)[index] ?? ""),
    () => ""
  );
}
