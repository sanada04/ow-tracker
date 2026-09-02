import { getDictionary, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Rajdhani } from "next/font/google";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const rajdhani = Rajdhani({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
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
    <html lang={locale} className={`${geist.variable} ${rajdhani.variable}`} suppressHydrationWarning>
      <body className="bg-[#0c0c10] text-[#f0f0ff] antialiased" suppressHydrationWarning>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9780704405934373"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-5DMLXX97W1" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5DMLXX97W1');
        `}</Script>
        <SiteHeader dict={dict} lang={locale} />
        <div className="pt-[50px] pb-10">{children}</div>
        <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/40 bg-[#10101a]/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <span className="text-zinc-700 text-[11px] tracking-wider">{dict.footer.credit}</span>
            <nav className="flex items-center gap-4">
              <Link href={`/${locale}/about`} className="text-zinc-600 text-[11px] tracking-wider hover:text-zinc-400 transition-colors">
                {locale === "ja" ? "このサイトについて" : "About"}
              </Link>
              <Link href={`/${locale}/privacy`} className="text-zinc-600 text-[11px] tracking-wider hover:text-zinc-400 transition-colors">
                {dict.privacy.nav}
              </Link>
              <Link href={`/${locale}/contact`} className="text-zinc-600 text-[11px] tracking-wider hover:text-zinc-400 transition-colors">
                {dict.contact.nav}
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
