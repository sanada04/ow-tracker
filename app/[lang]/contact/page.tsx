import { getDictionary } from "@/lib/i18n";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  return {
    title: isEn ? "Contact — OW Tracker" : "お問い合わせ — OW Tracker",
    description: isEn
      ? "Contact OW Tracker for bug reports, feature requests, or general inquiries."
      : "OW Trackerへのお問い合わせ。不具合報告・機能リクエスト・ご質問など。",
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { ja: "/ja/contact", en: "/en/contact", "x-default": "/ja/contact" },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const t = dict.contact;

  return (
    <div className="bg-[#0a0a12] text-white min-h-screen overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #f4a029 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#f4a029]/60" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#f4a029]/70 font-medium">
              {t.subtitle}
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
          >
            {t.title}
          </h1>
        </div>

        <ContactForm t={t} />
      </main>
    </div>
  );
}
