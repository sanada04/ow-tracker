import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isJa = lang === "ja";
  return {
    title: isJa ? "プライバシーポリシー" : "Privacy Policy",
    description: isJa
      ? "OW Tracker のプライバシーポリシー。Cookie・広告・データ収集に関する方針を説明します。"
      : "OW Tracker privacy policy covering cookies, advertising, and data collection practices.",
    robots: { index: true, follow: true },
  };
}

const LAST_UPDATED_JA = "2025年7月";
const LAST_UPDATED_EN = "July 2025";

function JaContent() {
  return (
    <article className="prose-content">
      <p className="text-zinc-500 text-sm mb-8">最終更新: {LAST_UPDATED_JA}</p>

      <section>
        <h2>1. はじめに</h2>
        <p>
          OW Tracker（以下「本サイト」）は、Overwatch 2 のプレイヤー戦績・ヒーロー情報を提供する個人運営のファンサイトです。
          本サイトは Blizzard Entertainment, Inc. および関連会社とは一切関係ありません。
          本プライバシーポリシーは、本サイトの利用時に収集・利用される情報について説明します。
        </p>
      </section>

      <section>
        <h2>2. 収集する情報</h2>
        <p>本サイトでは以下の情報を収集または処理する場合があります。</p>
        <ul>
          <li>
            <strong>検索クエリ（BattleTag）：</strong>
            入力された BattleTag はサードパーティの公開 API（OverFast API）へのリクエストに使用されます。
            本サイトのサーバーには保存されません。検索履歴はお使いのブラウザのローカルストレージにのみ保存され、いつでも削除できます。
          </li>
          <li>
            <strong>アクセスログ：</strong>
            標準的なウェブサーバーのアクセスログ（IPアドレス、ブラウザ情報、参照元URLなど）がホスティングプロバイダーにより収集される場合があります。
          </li>
          <li>
            <strong>Cookie：</strong>
            本サイトおよびサードパーティサービス（下記参照）が Cookie を使用する場合があります。
          </li>
        </ul>
      </section>

      <section>
        <h2>3. サードパーティサービス</h2>

        <h3>Google AdSense</h3>
        <p>
          本サイトでは、Google LLC が提供する広告配信サービス「Google AdSense」を使用しています。
          Google AdSense は、ユーザーの興味・関心に基づいた広告（インタレストベース広告）を表示するために Cookie を使用します。
          Google の Cookie ポリシーおよびプライバシーポリシーについては{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google プライバシーポリシー
          </a>
          {" "}をご確認ください。
          広告のパーソナライズは{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google 広告設定
          </a>
          {" "}からオプトアウトできます。
        </p>

        <h3>Google Analytics</h3>
        <p>
          本サイトでは、Google LLC が提供するアクセス解析ツール「Google Analytics」を使用しています。
          Google Analytics は Cookie を通じてサイトの利用状況（ページビュー数・滞在時間・使用デバイスなど）を収集します。
          収集されたデータは匿名化されており、個人を特定するものではありません。
          詳細は{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google プライバシーポリシー
          </a>
          {" "}をご覧ください。
        </p>

        <h3>OverFast API</h3>
        <p>
          プレイヤー戦績・ヒーローデータの取得には、非公式サードパーティ API「OverFast API」を使用しています。
          BattleTag で検索を行った場合、その情報は OverFast API のサーバーに送信されます。
          OverFast API のプライバシーポリシーについては同サービスの規約をご確認ください。
        </p>
      </section>

      <section>
        <h2>4. Cookie の管理</h2>
        <p>
          ほとんどのブラウザでは、Cookie の受け入れを拒否したり、既存の Cookie を削除したりする設定が可能です。
          ただし、Cookie を無効にした場合、本サイトの一部機能（検索履歴・お気に入りなど）が正常に動作しない場合があります。
        </p>
      </section>

      <section>
        <h2>5. 外部リンク</h2>
        <p>
          本サイトは外部ウェブサイトへのリンクを含む場合があります。
          リンク先サイトのプライバシー慣行については、本サイトは一切の責任を負いません。
        </p>
      </section>

      <section>
        <h2>6. 未成年者のプライバシー</h2>
        <p>
          本サイトは 13 歳未満の児童から意図的に個人情報を収集しません。
          13 歳未満の方は保護者の同意のもとでご利用ください。
        </p>
      </section>

      <section>
        <h2>7. ポリシーの変更</h2>
        <p>
          本プライバシーポリシーは予告なく変更される場合があります。
          重要な変更がある場合は本ページの「最終更新日」を更新します。
          定期的にご確認ください。
        </p>
      </section>

      <section>
        <h2>8. お問い合わせ</h2>
        <p>
          本プライバシーポリシーに関するご質問は、
          <Link href="/ja/contact">お問い合わせページ</Link>
          よりご連絡ください。
        </p>
      </section>
    </article>
  );
}

function EnContent() {
  return (
    <article className="prose-content">
      <p className="text-zinc-500 text-sm mb-8">Last updated: {LAST_UPDATED_EN}</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          OW Tracker (the &quot;Site&quot;) is an independently operated fan site providing Overwatch 2 player statistics
          and hero information. This Site is not affiliated with, endorsed by, or connected to Blizzard Entertainment,
          Inc. or its affiliates. This Privacy Policy explains how information is collected and used when you visit the Site.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>The Site may collect or process the following information:</p>
        <ul>
          <li>
            <strong>Search queries (BattleTag):</strong> BattleTag inputs are forwarded to a third-party public API
            (OverFast API) to retrieve player data. They are not stored on our servers. Search history is stored only
            in your browser&apos;s local storage and can be cleared at any time.
          </li>
          <li>
            <strong>Server access logs:</strong> Standard web server logs (IP address, browser information, referring
            URL, etc.) may be collected by our hosting provider.
          </li>
          <li>
            <strong>Cookies:</strong> The Site and third-party services (see below) may use cookies.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Third-Party Services</h2>

        <h3>Google AdSense</h3>
        <p>
          This Site uses Google AdSense, an advertising service provided by Google LLC. Google AdSense uses cookies to
          serve interest-based advertisements. For more information on Google&apos;s data practices, please review the{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
          . You may opt out of personalized advertising via{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google Ad Settings
          </a>
          .
        </p>

        <h3>Google Analytics</h3>
        <p>
          This Site uses Google Analytics, an analytics service provided by Google LLC. Google Analytics uses cookies to
          collect anonymized usage data (page views, session duration, device type, etc.). No personally identifiable
          information is collected. See the{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>
          {" "}for details.
        </p>

        <h3>OverFast API</h3>
        <p>
          Player and hero data is retrieved via OverFast API, an unofficial third-party service. When you search for a
          player, the BattleTag is transmitted to OverFast API servers. Please refer to their terms for their data
          handling practices.
        </p>
      </section>

      <section>
        <h2>4. Cookie Management</h2>
        <p>
          Most browsers allow you to refuse cookies or delete existing ones. Please note that disabling cookies may
          affect certain Site features such as search history and favorites.
        </p>
      </section>

      <section>
        <h2>5. External Links</h2>
        <p>
          The Site may contain links to external websites. We are not responsible for the privacy practices of those sites.
        </p>
      </section>

      <section>
        <h2>6. Children&apos;s Privacy</h2>
        <p>
          We do not knowingly collect personal information from children under 13. If you are under 13, please use the
          Site only with parental consent.
        </p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>
          This Privacy Policy may be updated without prior notice. The &quot;Last updated&quot; date at the top of this
          page will reflect any changes. Please review this page periodically.
        </p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>
          For questions about this Privacy Policy, please use our{" "}
          <Link href="/en/contact">Contact page</Link>.
        </p>
      </section>
    </article>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const isJa = lang === "ja";

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link
          href={`/${lang}`}
          className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-[#00c4ef] transition-colors"
        >
          ← {isJa ? "ホームへ戻る" : "Back to Home"}
        </Link>
        <h1
          className="mt-4 text-3xl font-bold text-white"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
        >
          {dict.privacy.nav}
        </h1>
      </div>

      {isJa ? <JaContent /> : <EnContent />}

      <style>{`
        .prose-content section { margin-bottom: 2.5rem; }
        .prose-content h2 {
          font-family: "Rajdhani", system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f4a029;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(244,160,41,0.2);
        }
        .prose-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #e8e8f0;
          margin: 1.25rem 0 0.5rem;
        }
        .prose-content p {
          color: #a1a1aa;
          line-height: 1.8;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        .prose-content ul {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .prose-content li {
          color: #a1a1aa;
          font-size: 0.9rem;
          line-height: 1.7;
          padding-left: 1.25rem;
          position: relative;
        }
        .prose-content li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #f4a029;
          font-size: 0.75rem;
          top: 0.15em;
        }
        .prose-content strong { color: #e8e8f0; font-weight: 600; }
        .prose-content a { color: #f4a029; text-decoration: underline; text-underline-offset: 3px; }
        .prose-content a:hover { color: #ffbe55; }
      `}</style>
    </main>
  );
}
