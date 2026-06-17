import Link from "next/link";
import HeaderSearch from "@/components/HeaderSearch";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function SiteHeader({
  dict,
  lang = "ja",
}: {
  dict?: Dictionary;
  lang?: Locale;
}) {
  return (
    <header className="border-b border-zinc-800/60 bg-[#0d0d1a]/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-30">
      <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center gap-4">
        <Link
          href={`/${lang}`}
          className="text-[#f4a029] font-bold text-base tracking-widest shrink-0 hover:text-[#ffbe55] transition-colors"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.15em" }}
        >
          <span className="text-[#fff]">OW</span> TRACKER
        </Link>
        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href={`/${lang}/heroes`}
            className="px-3 py-1.5 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f4a029] transition-colors"
          >
            {dict?.header.nav_heroes}
          </Link>
          <Link
            href={`/${lang}/compare`}
            className="px-3 py-1.5 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f4a029] transition-colors"
          >
            {dict?.header.nav_compare}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="px-3 py-1.5 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#f4a029] transition-colors"
          >
            {dict?.contact.nav}
          </Link>
        </nav>
        <div className="flex-1 flex justify-end">
          <HeaderSearch dict={dict} lang={lang} />
        </div>
        <LanguageSwitcher lang={lang} />
      </div>
    </header>
  );
}
