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
  const navItems = [
    { href: `/${lang}/heroes`,                label: dict?.header.nav_heroes },
    { href: `/${lang}/tier-list`,             label: dict?.tier_list.nav },
    { href: `/${lang}/meta`,                  label: dict?.meta_page.nav },
    { href: `/${lang}/maps`,                  label: dict?.maps_page.nav },
    { href: `/${lang}/counters`,              label: dict?.counters_page.nav },
    { href: `/${lang}/stats/rank-distribution`, label: dict?.rank_page.nav },
    { href: `/${lang}/compare`,               label: dict?.header.nav_compare },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30"
      style={{
        background: "rgba(8, 8, 16, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(244, 160, 41, 0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center gap-2">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="shrink-0 mr-2 hover:opacity-90 transition-opacity"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.15em" }}
        >
          <span className="text-white font-black text-lg">OW</span>
          <span className="text-[#f4a029] font-black text-lg"> TRACKER</span>
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} className="ow-nav-link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search + lang */}
        <HeaderSearch dict={dict} lang={lang} />
        <LanguageSwitcher lang={lang} />
      </div>
    </header>
  );
}
