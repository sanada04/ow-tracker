"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const other: Locale = lang === "ja" ? "en" : "ja";
  const otherPath = pathname.replace(new RegExp(`^/${lang}`), `/${other}`);

  return (
    <Link
      href={otherPath}
      className="shrink-0 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 border border-zinc-700/60 text-zinc-400 hover:border-[#f4a029]/50 hover:text-[#f4a029] transition-colors"
      style={{
        clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)",
        fontFamily: '"Rajdhani", system-ui, sans-serif',
      }}
    >
      {other.toUpperCase()}
    </Link>
  );
}
