"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function HeaderSearch({
  dict,
  lang,
}: {
  dict?: Dictionary;
  lang: Locale;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (open && e.key === "Escape") {
        setOpen(false);
      } else if (!open && e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-10 px-3 border border-zinc-700/60 bg-[#131320] hover:border-[#f4a029]/60 transition-colors text-zinc-400 hover:text-[#f4a029] shrink-0"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
        aria-label="Search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span
          className="text-xs uppercase tracking-widest hidden sm:inline"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
        >
          {dict?.search.button ?? "検索"}
        </span>
        <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] border border-zinc-700 text-zinc-600 bg-zinc-900 leading-none" style={{ clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)" }}>
          /
        </kbd>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 animate-fade-in" style={{ animationDuration: "120ms" }}>
      <div className="flex-1">
        <SearchBar
          placeholder={dict?.search.placeholder}
          buttonText={dict?.search.button}
          noResultsText={dict?.search.no_results}
          notPublicText={dict?.search.not_public}
          lang={lang}
          autoFocus
          compact
        />
      </div>
      <button
        onClick={() => setOpen(false)}
        className="shrink-0 h-10 w-10 flex items-center justify-center border border-zinc-700/60 bg-[#131320] text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
        aria-label="Close search"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
