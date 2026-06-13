import type { Dictionary } from "./en";

export const ja: Dictionary = {
  header: { title: "OW TRACKER" },
  footer: { credit: "データ提供: OverFast API — Blizzard Entertainment の非公式 API" },
  home: {
    subtitle: "Overwatch 2 戦績トラッカー",
    tagline: "プレイヤーのランク・スタッツ・ヒーロー統計を確認",
    notice: {
      pre: "ゲーム内設定でキャリアプロフィールを",
      highlight: "非公開",
      post: "にしているプレイヤーは検索結果に表示されず、戦績も確認できません。確認するには相手に変更してもらう必要があります: ",
      path: "オプション → ソーシャル → キャリアプロフィール → 公開",
    },
    features: [
      { icon: "◎", label: "ランク確認", desc: "コンペティティブランクを全ロール表示" },
      { icon: "◈", label: "スタッツ分析", desc: "KDA・勝率・プレイ時間など" },
      { icon: "◆", label: "ヒーロー統計", desc: "使用ヒーロー TOP 10 を一覧表示" },
    ],
  },
  search: {
    placeholder: "名前 または BattleTag (例: Name / Name#12345)",
    button: "検索",
    no_results: "プレイヤーが見つかりません。BattleTag（例: Name#12345）で試してください。",
    not_public: "非公開",
  },
  player: {
    not_found: "プレイヤーが見つかりませんでした",
    causes_title: "考えられる原因",
    causes: [
      { head: "キャリアプロフィールが非公開", body: "オプション → ソーシャル → キャリアプロフィールを「公開」に変更してもらう必要があります。" },
      { head: "BattleTag が違う", body: "正確な BattleTag (例: Name#12345) を入力してください。" },
      { head: "初回アクセスのタイムアウト", body: "数分後に再度お試しください。" },
    ],
    private_label: "非公開プロフィール",
    stats_failed: "戦績データを取得できませんでした。",
    stats_failed_sub: "プロフィールが非公開の可能性があります。",
    overall_stats: "総合スタッツ",
    role_stats: "ロール別スタッツ",
    hero_stats: "ヒーロー別スタッツ",
    hero_stats_sub: "プレイ時間順 TOP 10",
    no_data: {
      competitive: "コンペティティブのデータがありません。",
      quickplay: "クイックプレイのデータがありません。",
      general: "データがありません。",
    },
    roles: { tank: "タンク", damage: "ダメージ", support: "サポート" },
  },
  gamemode: { all: "すべて", quickplay: "クイックプレイ", competitive: "コンペティティブ" },
  stats: {
    games_played: "ゲーム数",
    winrate: "勝率",
    time_played: "プレイ時間",
    kda: "KDA",
    elim_per_10: "エリミ / 10分",
    deaths_per_10: "デス / 10分",
    won_suffix: "勝",
    lost_suffix: "敗",
  },
  hero_table: {
    headers: ["ヒーロー", "プレイ時間", "ゲーム", "勝率", "KDA", "エリミ/10m", "デス/10m"],
  },
};
