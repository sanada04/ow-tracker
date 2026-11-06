import { getDictionary, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";

const plex = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
});
const barlow = Barlow_Condensed({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    description: getDictionary(lang).data.hero_sub,
    // NOTE: no `alternates` here. This layout applies to every route under
    // /[lang]/**, and a static languages map would incorrectly tell search
    // engines that e.g. /en/heroes/genji's ja translation is just /ja (the
    // homepage) instead of /ja/heroes/genji. Each page sets its own
    // `alternates.canonical` / `alternates.languages` pointing at its real
    // per-locale equivalent; pages that don't are intentionally left with no
    // hreflang rather than a wrong one.
    openGraph: {
      locale: lang === "en" ? "en_US" : lang === "ko" ? "ko_KR" : "ja_JP",
      alternateLocale: lang === "en" ? ["ja_JP", "ko_KR"] : lang === "ko" ? ["ja_JP", "en_US"] : ["en_US", "ko_KR"],
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const locale = LOCALES.includes(lang as Locale) ? (lang as Locale) : "ja";

  return (
    <html lang={locale} className={`${plex.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5DMLXX97W1" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5DMLXX97W1');
        `}</Script>
        {/* Loads after the page so its automatic ad placement cannot disturb hydration. */}
        <Script
          src="https://adm.shinobi.jp/st/auto.js"
          data-admax-id="b34e91829e3c54611ca6df157f609a56"
          strategy="lazyOnload"
        />
        <SiteHeader dict={dict} lang={locale} />
        <div className="pt-[50px]">{children}</div>
        <footer className="border-t border-[var(--ow-line)] mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-[var(--ow-text-3)]">
            <span>{dict.footer.credit}</span>
            <nav className="flex items-center gap-4">
              <Link href={`/${locale}/about`} className="hover:text-[var(--ow-text)]">{dict.data.about}</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-[var(--ow-text)]">{dict.privacy.nav}</Link>
              <Link href={`/${locale}/contact`} className="hover:text-[var(--ow-text)]">{dict.contact.nav}</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
