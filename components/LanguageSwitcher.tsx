"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const LOCALES: Locale[] = ["ja", "en", "ko"];

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 shrink-0">
      {LOCALES.filter((l) => l !== lang).map((l) => {
        const otherPath = pathname.replace(new RegExp(`^/${lang}`), `/${l}`);
        return (
          <Link
            key={l}
            href={otherPath}
            className="text-xs font-bold tracking-normal px-2 py-1 border border-zinc-700/60 text-zinc-400 hover:border-[var(--ow-accent)]/50 hover:text-[var(--ow-accent)] transition-colors rounded"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
