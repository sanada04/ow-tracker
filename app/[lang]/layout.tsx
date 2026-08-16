import { getDictionary, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import type { Metadata } from "next";

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
    alternates: {
      languages: {
        ja: "/ja",
        en: "/en",
        "x-default": "/ja",
      },
    },
    openGraph: {
      locale: lang === "en" ? "en_US" : "ja_JP",
      alternateLocale: lang === "en" ? "ja_JP" : "en_US",
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const locale = LOCALES.includes(lang as Locale) ? (lang as Locale) : "ja";

  return (
    <>
      <SiteHeader dict={dict} lang={locale} />
      <div className="pt-[60px] pb-10">{children}</div>
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/40 bg-[#0a0a18]/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="text-zinc-700 text-[11px] tracking-wider">{dict.footer.credit}</span>
          <nav className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="text-zinc-600 text-[11px] tracking-wider hover:text-zinc-400 transition-colors">
              {dict.privacy.nav}
            </Link>
            <Link href={`/${locale}/contact`} className="text-zinc-600 text-[11px] tracking-wider hover:text-zinc-400 transition-colors">
              {dict.contact.nav}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
