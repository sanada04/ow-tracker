import { getDictionary, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
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
      <footer className="fixed bottom-0 left-0 right-0 z-30 py-2.5 text-center text-zinc-700 text-[11px] tracking-wider border-t border-zinc-800/40 bg-[#0d0d1a]/90 backdrop-blur-sm">
        {dict.footer.credit}
      </footer>
    </>
  );
}
