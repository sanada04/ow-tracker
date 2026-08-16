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
    { href: `/${lang}/heroes`,                  label: dict?.header.nav_heroes },
    { href: `/${lang}/tier-list`,               label: dict?.tier_list.nav },
    { href: `/${lang}/meta`,                    label: dict?.meta_page.nav },
    { href: `/${lang}/maps`,                    label: dict?.maps_page.nav },
    { href: `/${lang}/counters`,                label: dict?.counters_page.nav },
    { href: `/${lang}/stats/rank-distribution`, label: dict?.rank_page.nav },
    { href: `/${lang}/compare`,                 label: dict?.header.nav_compare },
  ];

  return (
    <header className="ow-header">
      <div className="ow-header-inner">
        {/* Logo */}
        <Link href={`/${lang}`} className="ow-logo">
          <div className="ow-logo-mark">OW</div>
          <div className="ow-logo-words">
            <span className="ow-logo-name">TRACKER</span>
            <span className="ow-logo-tag">OVERWATCH 2 DATA</span>
          </div>
        </Link>

        <div className="ow-header-rule" />

        {/* Nav */}
        <nav className="ow-header-nav">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} className="ow-hdr-link">
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <HeaderSearch dict={dict} lang={lang} />
        <LanguageSwitcher lang={lang} />
      </div>
    </header>
  );
}
