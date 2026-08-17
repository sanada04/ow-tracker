import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isJa = lang === "ja";
  return {
    title: isJa ? "OW Trackerについて" : "About OW Tracker",
    description: isJa
      ? "OW Trackerは、Overwatch 2 プレイヤーのための無料の戦績・データ確認サービスです。BattleTagで検索するだけで、ランク・勝率・ヒーロー統計を確認できます。"
      : "OW Tracker is a free Overwatch 2 stats and data service. Search by BattleTag to view competitive ranks, win rates, and hero statistics.",
    alternates: {
      canonical: `https://owtracker.org/${lang}/about`,
      languages: { ja: "/ja/about", en: "/en/about" },
    },
    robots: { index: true, follow: true },
  };
}

function JaContent({ lang }: { lang: string }) {
  return (
    <article>
      <h1
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
      >
        OW Trackerについて
      </h1>
      <p className="text-[#9090b0] text-sm mb-10">
        Overwatch 2 プレイヤーのための無料データサービス
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          OW Trackerとは
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed mb-3">
          OW Trackerは、Overwatch 2 のプレイヤーが自分や他のプレイヤーの戦績・ランク・ヒーロー統計を手軽に確認できる、無料のデータトラッキングサービスです。
          BattleTagを入力するだけで、コンペティティブランク・勝率・KDA・ヒーロー別スタッツを一覧で確認できます。
        </p>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          また、ヒーローのカウンター情報・コミュニティTierList・ランク分布など、Overwatch 2 をより深く楽しむためのデータを提供しています。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          提供機能
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "プレイヤー戦績検索",
              desc: "BattleTagを入力するだけで、コンペティティブランク（タンク・ダメージ・サポート別）・総合勝率・KDA・プレイ時間・ヒーロー別スタッツを確認できます。クイックプレイとコンペティティブの両方に対応しています。",
            },
            {
              title: "ヒーロー詳細データベース",
              desc: "Overwatch 2 の全ヒーローについて、アビリティ詳細・パーク（強化オプション）・HP・ロール・ストーリーなどを確認できます。公式APIから最新データを取得しています。",
            },
            {
              title: "コミュニティTierList",
              desc: "ユーザー投票によって決まるヒーターランキングです。S・A・B・C・D の5段階で各ヒーローを評価し、コミュニティ全体の意見を確認できます。",
            },
            {
              title: "カウンター情報",
              desc: "各ヒーローに対して有利なヒーロー（カウンター）を確認できます。データはコミュニティ投票によるものです。",
            },
            {
              title: "ランク分布",
              desc: "Overwatch 2 の各ランク（ブロンズ〜チャンピオン）の分布データを確認できます。自分のランクが全体のどの位置にあるかを把握するのに役立ちます。",
            },
            {
              title: "マップ情報",
              desc: "Overwatch 2 の全マップについて、ゲームモード・特徴などの基本情報を確認できます。",
            },
          ].map((item) => (
            <div key={item.title} className="ow-card p-4">
              <h3 className="text-white font-semibold text-sm mb-1.5" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-[#9090b0] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          データソース
        </h2>
        <div className="ow-card p-5 space-y-3">
          <div>
            <p className="text-white text-sm font-medium mb-1">プレイヤー戦績・ヒーロー情報</p>
            <p className="text-[#9090b0] text-sm leading-relaxed">
              OverFast API（tekrop.fr が提供する非公式 Blizzard API ラッパー）から取得しています。
              プレイヤーデータはリクエスト時にリアルタイム取得し、短時間キャッシュしています。
              ヒーロー基本データは定期的に更新されます。
            </p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-1">コミュニティデータ（TierList・カウンター）</p>
            <p className="text-[#9090b0] text-sm leading-relaxed">
              ユーザーによる投票データを Upstash Redis で管理しています。
              投票は匿名で、1ユーザーがカウンターページで最大5票まで投票できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          プライバシーと広告
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed mb-3">
          OW Trackerは Google AdSense を利用した広告を表示することがあります。
          広告の表示にあたり、Google が Cookie を使用することがあります。
          詳細は{" "}
          <Link href={`/ja/privacy`} className="text-[#00ccff] hover:underline">
            プライバシーポリシー
          </Link>
          をご確認ください。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          免責事項
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          OW Trackerは独立したファンサイトであり、Blizzard Entertainment とは一切関係ありません。
          Overwatch、Overwatch 2 は Blizzard Entertainment, Inc. の商標です。
          当サービスで提供するデータの正確性を保証するものではありません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          お問い合わせ
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          ご意見・ご要望・不具合報告は{" "}
          <Link href={`/ja/contact`} className="text-[#00ccff] hover:underline">
            お問い合わせページ
          </Link>
          からお送りください。
        </p>
      </section>
    </article>
  );
}

function EnContent({ lang }: { lang: string }) {
  return (
    <article>
      <h1
        className="text-3xl font-bold text-white mb-2"
        style={{ fontFamily: '"Rajdhani", system-ui, sans-serif', letterSpacing: "0.05em" }}
      >
        About OW Tracker
      </h1>
      <p className="text-[#9090b0] text-sm mb-10">
        Free stats and data service for Overwatch 2 players
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          What is OW Tracker?
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed mb-3">
          OW Tracker is a free Overwatch 2 stats tracking service. Search any player by BattleTag to instantly view
          their competitive rank across all roles, win rate, KDA, playtime, and hero-by-hero statistics — all in one place.
        </p>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          Beyond player stats, OW Tracker provides hero counter data, community tier lists, rank distribution insights,
          and detailed hero databases to help you understand the game more deeply.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          Features
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "Player Stats Search",
              desc: "Enter any BattleTag to view competitive ranks (Tank, Damage, Support), overall win rate, KDA, playtime, and top hero stats. Supports both Quick Play and Competitive mode.",
            },
            {
              title: "Hero Database",
              desc: "Detailed information on every Overwatch 2 hero: abilities with full descriptions, perks, HP breakdown (health, armor, shields), role, subrole, and lore. Data sourced from the official OverFast API.",
            },
            {
              title: "Community Tier List",
              desc: "A community-voted hero ranking. Rate each hero S through D and see how the community rates every hero in the current meta. Updated in real time as votes are cast.",
            },
            {
              title: "Counter Picks",
              desc: "For each hero, see which heroes the community considers strong counters. Browse by role and vote for the picks you believe in.",
            },
            {
              title: "Rank Distribution",
              desc: "See how the Overwatch 2 player base is distributed across ranks from Bronze to Champion. Understand where your rank sits relative to the overall playerbase.",
            },
            {
              title: "Map Database",
              desc: "Browse all Overwatch 2 maps with game mode, location, and key information.",
            },
          ].map((item) => (
            <div key={item.title} className="ow-card p-4">
              <h3 className="text-white font-semibold text-sm mb-1.5" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
                {item.title}
              </h3>
              <p className="text-[#9090b0] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          Data Sources
        </h2>
        <div className="ow-card p-5 space-y-3">
          <div>
            <p className="text-white text-sm font-medium mb-1">Player stats &amp; hero data</p>
            <p className="text-[#9090b0] text-sm leading-relaxed">
              Fetched from OverFast API (tekrop.fr), an unofficial Blizzard API wrapper.
              Player data is retrieved in real time on request and cached briefly. Hero data is refreshed periodically.
            </p>
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-1">Community data (Tier List &amp; Counters)</p>
            <p className="text-[#9090b0] text-sm leading-relaxed">
              User votes are stored in Upstash Redis. Voting is anonymous;
              each user may cast up to 5 counter votes per hero page.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          Privacy &amp; Advertising
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          OW Tracker may display ads served by Google AdSense. Google may use cookies for ad personalization.
          See our{" "}
          <Link href={`/en/privacy`} className="text-[#00ccff] hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          Disclaimer
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          OW Tracker is an independent fan site and is not affiliated with Blizzard Entertainment.
          Overwatch and Overwatch 2 are trademarks of Blizzard Entertainment, Inc.
          Data accuracy is not guaranteed.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}>
          Contact
        </h2>
        <p className="text-[#9090b0] text-sm leading-relaxed">
          Feedback, bug reports, or feature requests —{" "}
          <Link href={`/en/contact`} className="text-[#00ccff] hover:underline">
            contact us here
          </Link>
          .
        </p>
      </section>
    </article>
  );
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {lang === "ja" ? <JaContent lang={lang} /> : <EnContent lang={lang} />}
      </main>
    </div>
  );
}
