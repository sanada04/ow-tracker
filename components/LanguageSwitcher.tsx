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
            className="text-[11px] font-bold uppercase tracking-widest px-2 py-1 border border-zinc-700/60 text-zinc-400 hover:border-[#f4a029]/50 hover:text-[#f4a029] transition-colors rounded"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
