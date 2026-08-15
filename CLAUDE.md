# OW Tracker コンテンツ拡張・SEO強化 実装指示書

## 0. このドキュメントの目的

OW Tracker（https://owtracker.org/）を、単なる「Overwatch 2 のプレイヤー戦績検索サイト」から、

> **Overwatch 2 をプレイする人が、毎日情報を見に来る総合データ・攻略サイト**

へ拡張する。

現在の主要機能であるプレイヤー検索、ランク確認、スタッツ、ヒーロー統計を維持しながら、以下を強化する。

- SEO流入
- 検索キーワードの網羅
- リピーター獲得
- プレイヤーの回遊
- ヒーロー・マップ・メタ情報のデータベース化
- 「検索するためだけに来るサイト」から「Overwatchについて調べるために来るサイト」への転換

---

# 1. 現状認識

現在のOW Trackerは、以下の価値を提供している。

- BattleTag / プレイヤー名検索
- コンペティブランク確認
- KDA・勝率・プレイ時間などのスタッツ
- 使用ヒーロー統計
- ヒーロー一覧
- プレイヤー比較

これは競合サイトとの差別化要素として重要だが、プレイヤー検索は「検索したい人」しか来ない。

そのため、以下のような検索意図を取り込む。

### 情報検索

- Overwatch 2 最強キャラ
- Overwatch 2 キャラランキング
- Overwatch 2 ティア表
- Overwatch 2 キャラ相性
- Overwatch 2 カウンター
- Overwatch 2 マップ一覧
- Overwatch 2 ランク一覧
- Overwatch 2 ランク分布
- Overwatch 2 シーズン
- Overwatch 2 パッチ
- Overwatch 2 アップデート

### 攻略検索

- ○○ 対策
- ○○ カウンター
- ○○ 使い方
- ○○ おすすめ
- ○○ エイム
- ○○ コンボ
- ○○ 相性
- ○○ マップ
- ○○ 初心者

### データ検索

- ○○ 勝率
- ○○ ピック率
- ○○ バン率
- ○○ ランク別勝率
- ○○ マップ別勝率
- ○○ PC 勝率
- ○○ コンソール 勝率

### プレイヤー検索

- BattleTag
- プレイヤー戦績
- Overwatch tracker
- OW2 tracker
- Overwatch stats

---

# 2. 最重要方針

コンテンツを大量に手書きするのではなく、

> **既存のデータを利用して、自動生成できるページを増やす。**

これを基本方針とする。

例えばヒーローが100体以上いる場合、

- ヒーローページ
- ヒーロー × ヒーロー比較
- ヒーロー × マップ
- ヒーロー × ランク
- ヒーロー × カウンター
- ヒーロー × ロール

などを組み合わせることで大量の検索入口を作れる。

ただし、SEO目的だけの薄いページを大量生成しない。

各ページには必ず、

- 独自のデータ
- 比較
- 統計
- 関連ページ
- 検索意図に合った説明

のいずれかを含める。

---

# 3. 新しいサイト構成

以下の情報設計を目標とする。

```text
/
├── /players/
│   └── /players/{battleTag}
│
├── /compare/
│   └── /compare/{playerA}-vs-{playerB}
│
├── /heroes/
│   ├── /heroes/
│   └── /heroes/{hero}
│
├── /heroes/{hero}/counters/
├── /heroes/{hero}/build/
├── /heroes/{hero}/stats/
│
├── /counters/
│   └── /counters/{hero}
│
├── /maps/
│   ├── /maps/
│   └── /maps/{map}
│
├── /stats/
│   ├── /stats/heroes
│   ├── /stats/maps
│   ├── /stats/ranks
│   └── /stats/regions
│
├── /tier-list/
│
├── /meta/
│
├── /guides/
│   ├── /guides/beginner/
│   ├── /guides/rank/
│   ├── /guides/hero/
│   └── /guides/gameplay/
│
├── /patch-notes/
│
├── /seasons/
│   └── /seasons/{season}
│
└── /news/
```

実装済みのURL構造がある場合は、既存URLを破壊しない。

---

# 4. 最優先で実装する機能

## Priority 1: ヒーロー詳細ページ強化

現在のヒーロー一覧を、単なる一覧ではなく「ヒーローデータベース」にする。

各ヒーローページに以下を追加する。

### 基本情報

- ヒーロー名
- ロール
- サブロール
- 難易度
- アビリティ一覧
- 公式画像

### 統計

- 勝率
- ピック率
- バン率
- 平均プレイ時間
- ランク別勝率
- マップ別勝率
- 地域別勝率
- 入力デバイス別統計

### トレンド

- 勝率推移
- ピック率推移
- パッチごとの変化
- シーズンごとの変化

### 相性

- 有利なヒーロー
- 不利なヒーロー
- 同ロールの比較
- カウンター候補

### 関連

- このヒーローのカウンター
- このヒーローが強いマップ
- このヒーローが弱いマップ
- このヒーローを使うプレイヤー
- 関連攻略記事

---

# 5. Priority 1: ヒーロー × ヒーロー比較

SEOと回遊性の両方を狙う。

例:

```text
/hereos/genji-vs-tracer
```

正しいURL設計は既存ルーティングに合わせる。

ページ内容:

```text
Genji vs Tracer

総合比較
勝率
ピック率
ランク別勝率
マップ別勝率

どちらが有利？
↓
データから判断

Genjiが有利な状況
Tracerが有利な状況

関連カウンター
関連ヒーロー
```

全組み合わせを無条件に生成するのではなく、一定のデータ量が存在する組み合わせだけ生成する。

---

# 6. Priority 1: カウンターページ

例:

```text
/counters/genji
/counters/tracer
/counters/mercy
```

ページ内容:

```text
Genji Counter

Genjiに対して勝率が高いヒーロー

1. ○○
2. ○○
3. ○○

ランク別
Bronze
Silver
Gold
Platinum
Diamond
Master
Grandmaster

マップ別

よくある対面

関連攻略記事
```

重要:

「カウンター」という断定を単純な勝率だけで決めない。

可能なら、

- 十分なサンプル数
- 勝率差
- ピック率
- ランク
- マップ
- ミラー率

を考慮する。

---

# 7. Priority 1: ティアリスト

URL:

```text
/tier-list/
```

毎シーズン・パッチ単位で生成する。

フィルター:

- 全ロール
- Tank
- Damage
- Support
- ランク
- 地域
- PC / Console
- マップ

表示:

```text
S
A
B
C
D
```

ただし、単純な主観Tierではなく、

> OW Tracker独自のデータスコア

として表示する。

例:

```text
Meta Score

Win Rate
Pick Rate
Ban Rate
Sample Size
```

スコア計算式はコード内で明示し、ユーザーに説明可能な状態にする。

---

# 8. Priority 1: メタページ

URL:

```text
/meta/
```

「今のOverwatch 2で何が強いのか」を一目で分かるページ。

表示:

- 現在のパッチ
- 現在のシーズン
- Top Heroes
- Highest Win Rate
- Highest Pick Rate
- Highest Ban Rate
- 上昇中のヒーロー
- 下降中のヒーロー
- 注目マップ
- ロール別メタ

さらに、

```text
今週最も使用率が上がったヒーロー
今週最も勝率が上がったヒーロー
```

などを自動生成する。

---

# 9. Priority 2: マップデータベース

URL:

```text
/maps/
```

各マップ:

```text
/maps/{map}
```

内容:

- マップ名
- ゲームモード
- マップ画像
- ヒーロー勝率
- ヒーローピック率
- ロール別統計
- ランク別統計
- 強いヒーロー
- 弱いヒーロー
- 人気ヒーロー
- 関連マップ

SEO上かなり重要。

「Overwatch 2 マップ一覧」だけでなく、

- ○○ マップ 攻略
- ○○ マップ 最強キャラ
- ○○ マップ キャラ相性

などの検索意図を狙える。

---

# 10. Priority 2: ランクデータ

URL:

```text
/stats/ranks/
```

内容:

- Bronze
- Silver
- Gold
- Platinum
- Diamond
- Master
- Grandmaster
- Champion

各ランクで、

- 人気ヒーロー
- 勝率
- ピック率
- カウンター
- ロール比率

などを表示。

さらに、

```text
Bronzeで強いヒーロー
Goldで強いヒーロー
Diamondで強いヒーロー
Grandmasterで強いヒーロー
```

のページを作る。

---

# 11. Priority 2: プレイヤー分析ページ強化

既存のプレイヤー検索をサイト最大の独自コンテンツとして維持する。

現在:

```text
プレイヤー → ランク・統計
```

これを、

```text
プレイヤー
↓
ランク
↓
使用ヒーロー
↓
得意ヒーロー
↓
勝率
↓
ロール
↓
比較
↓
改善ポイント
```

へ拡張。

追加候補:

### Main Hero

最も使用しているヒーロー。

### Best Hero

勝率・試合数・プレイ時間を考慮して評価。

### Hero Pool

プレイヤーの得意ヒーローを一覧化。

### Role Distribution

Tank / Damage / Support のプレイ比率。

### Player Style

データから簡易分類。

例:

```text
DPS Main
Flex Player
Support Main
Tank Main
```

断定ではなく「傾向」として表示する。

---

# 12. プレイヤー比較

URL:

```text
/compare/
```

AとBを比較。

表示:

```text
Rank
Win Rate
KDA
Play Time
Hero Pool
Role
Best Hero
```

さらに、

```text
Aが優れている項目
Bが優れている項目
```

を自動表示。

SNS共有ボタンも追加。

---

# 13. 「自分のランクはどのくらい？」コンテンツ

SEO向けの重要コンテンツ。

例:

```text
Overwatch 2 ランク分布
```

ページ:

```text
/stats/rank-distribution/
```

表示:

```text
Bronze XX%
Silver XX%
Gold XX%
...
```

可能なら時系列グラフ。

さらに、

```text
あなたは上位XX%
```

というプレイヤー検索との接続を作る。

---

# 14. パッチ・シーズンデータベース

URL:

```text
/patch-notes/
```

```text
/seasons/
```

各パッチについて:

- パッチ番号
- 日付
- 変更されたヒーロー
- バフ
- ナーフ
- リワーク
- マップ変更
- メタへの影響

特に重要なのは、

> パッチ前 → パッチ後

の統計変化。

例:

```text
Kiriko

Before
Win Rate 48.1%

After
Win Rate 51.3%

+3.2%
```

これを自動生成する。

---

# 15. 「パッチ後に強くなったキャラ」

非常に強いコンテンツになる。

パッチ更新後、

```text
Win Rate Change
Pick Rate Change
Ban Rate Change
```

から、

```text
Buff Winners
Nerf Winners
Biggest Losers
Most Popular
```

を自動生成。

記事を書かなくても毎パッチ新しいページになる。

---

# 16. 攻略コンテンツ

データだけではなく、初心者向け攻略ページを追加する。

優先順位:

### 初心者

- Overwatch 2 初心者ガイド
- ロールとは？
- タンクの役割
- DPSの役割
- サポートの役割
- ランクの仕組み
- ランクを上げる方法
- 感度の決め方
- クロスヘア設定
- PC版おすすめ設定

### ヒーロー

- ○○の使い方
- ○○の立ち回り
- ○○のカウンター
- ○○の相性
- ○○のおすすめ設定

ただし、攻略記事はデータページから内部リンクする。

---

# 17. 自動生成記事

可能な限りCMS的にデータから生成する。

例:

```text
【2026 Season X】
Overwatch 2 ○○の勝率・ピック率・カウンター
```

内容:

```text
現在の勝率
現在のピック率
現在のバン率

ランク別
マップ別
地域別

強い相手
苦手な相手

過去パッチとの比較
```

このページは手書き記事ではなくデータテンプレートで生成する。

---

# 18. SEO設計

すべての主要ページに、

- title
- description
- canonical
- OGP
- sitemap
- robots
- 構造化データ

を設定する。

---

# 19. 構造化データ

ページ内容に応じてSchema.orgを利用する。

候補:

- WebSite
- WebPage
- BreadcrumbList
- Article
- FAQPage

ただし、実際のページ内容と一致する場合のみ使用する。

存在しないFAQをSEO目的だけで大量生成しない。

---

# 20. 内部リンク

非常に重要。

例えば、

```text
Genjiページ
```

から、

```text
Genji Counter
Genji vs Tracer
Genji vs Sombra
Genji Map Stats
Genji Rank Stats
Genji Guide
```

へリンクする。

また、

```text
Tracer
```

からGenjiページへも戻れるようにする。

孤立ページを作らない。

---

# 21. トップページの再設計

トップページを単なる検索画面にしない。

推奨構成:

```text
Hero

Overwatch 2 Stats & Data

[ BattleTag検索 ]

↓

Today's Meta

現在のパッチ
Top Heroes

↓

Trending Heroes

勝率上昇
ピック率上昇

↓

Hero Tier List

↓

Popular Heroes

↓

Map Stats

↓

Latest Patch

↓

Latest Guides

↓

Player Search

↓

Footer
```

最初にプレイヤー検索を置くこと自体は維持してよい。

---

# 22. 「毎日見る理由」を作る

リピーター獲得のため、データを毎日変化させる。

例:

```text
Today's Meta
Today's Top Heroes
Today's Biggest Win Rate Change
Today's Most Picked Hero
```

日次更新データをトップに表示する。

---

# 23. 更新履歴

URL:

```text
/changelog/
```

OW Tracker自体の更新情報。

例:

```text
2026/08/15

Hero Statsを追加
Metaページを追加
```

SEOだけでなくサービスへの信頼性向上にも使う。

---

# 24. 多言語

既にJA / ENを持っているため、今後の機能追加でも必ず両言語対応する。

新規ページでは、

```text
/ja/...
/en/...
```

または既存のルーティング方式に合わせる。

片方だけ存在するページを作らない。

---

# 25. パフォーマンス

コンテンツを増やしてもサイトを重くしない。

原則:

- SSR / SSGを優先
- 不要なJSを送らない
- グラフは必要なページだけ
- 画像を最適化
- lazy loading
- CDNキャッシュ
- APIレスポンスキャッシュ
- 同じデータを何度もAPIから取得しない

特に大量のヒーロー比較ページを生成する場合は、ビルド時間とAPI負荷に注意。

---

# 26. API設計

OverFast APIなど外部データソースに依存している場合、ブラウザから直接大量アクセスしない。

推奨:

```text
External API
    ↓
Backend / Cron
    ↓
Cache / Database
    ↓
OW Tracker
```

データ更新間隔を設定する。

例:

```text
Hero stats: 1日1回
Player stats: リクエスト時取得 + 短期キャッシュ
Static data: ビルド時
```

現在のデータ取得方式を確認してから実装する。

---

# 27. SEO用URLルール

URLは英語・小文字・ハイフン区切り。

良い:

```text
/heroes/genji
/heroes/genji/counters
/maps/hanaoka
/tier-list
/rank-distribution
```

避ける:

```text
/page?id=123
/hero?id=genji
```

---

# 28. Sitemap

動的ページ追加時にsitemapへ自動追加。

最低限:

- Heroes
- Maps
- Counters
- Tier List
- Stats
- Guides
- Seasons
- Patch Notes

を含める。

ただし、検索対象として価値がないページはsitemapに入れない。

---

# 29. ページ生成時の品質ルール

以下を必須とする。

### NG

```text
Genji Counter
Genjiは○○に弱いです。
```

これだけのページ。

### OK

```text
Genji Counter

現在のデータ:
Win Rate
Pick Rate
Sample Size

Rank別

Map別

Counter候補

Counterの根拠

過去30日間の変化

関連ページ
```

---

# 30. 優先順位

Claude Codeで実装するときは以下の順番で進める。

## Phase 1

1. 現在のコードベース調査
2. 既存URL確認
3. 既存API / データ構造確認
4. ヒーロー詳細ページ強化
5. マップ詳細ページ
6. Tier List
7. Metaページ
8. sitemap

## Phase 2

9. Counterページ
10. Hero × Hero比較
11. Rank Stats
12. Rank Distribution
13. Patch Stats
14. Season Stats

## Phase 3

15. Player Analysis強化
16. Player Compare
17. Guides
18. 内部リンク自動生成
19. OGP強化
20. Structured Data

## Phase 4

21. 日次Trending
22. パッチ前後比較
23. SNS共有
24. お気に入り
25. プレイヤー追跡機能
26. 通知機能の検討

---

# 31. 実装時の重要ルール

既存機能を壊さない。

特に以下を確認する。

```text
既存のプレイヤー検索
既存のヒーローページ
既存の比較機能
JA / EN
レスポンシブ
API制限
キャッシュ
SEO
```

新機能を追加する前に、必ず既存コードを調査する。

---

# 32. Claude Codeへの実装手順

最初から全機能を実装しない。

まず以下を実行する。

```text
1. プロジェクト構成を調査
2. package.json確認
3. routing確認
4. API取得処理確認
5. データモデル確認
6. SEO処理確認
7. 多言語処理確認
8. 既存ページ一覧を作成
9. 現在の問題点を整理
```

その後、

```text
「Phase 1の実装計画」
```

を作成する。

この段階ではコードを書かず、実装計画だけ提示する。

ユーザーが承認したらPhase 1を実装する。

---

# 33. 実装前にClaude Codeが確認すべきこと

以下を推測で実装しない。

- フレームワーク
- DB
- API
- ルーティング
- データ取得方法
- デプロイ方法
- i18n方式
- キャッシュ方式

必ず既存コードを確認する。

---

# 34. 完了条件

各Phase終了時に以下を確認する。

```text
[ ] npm build 成功
[ ] lint 成功
[ ] typecheck 成功
[ ] 既存ページが表示できる
[ ] 新規ページが表示できる
[ ] モバイル表示確認
[ ] JA表示確認
[ ] EN表示確認
[ ] canonical確認
[ ] sitemap確認
[ ] robots確認
[ ] OGP確認
[ ] APIエラー時の表示確認
[ ] データ0件時の表示確認
```

---

# 35. 最終的なOW Trackerのポジション

目指すサイトは、

> 「Overwatchの戦績検索サイト」

ではなく、

> **「Overwatch 2のデータを調べるならOW Tracker」**

というポジション。

ユーザーの検索行動を、

```text
Google検索
↓
OW Tracker
↓
ヒーローを見る
↓
カウンターを見る
↓
マップを見る
↓
メタを見る
↓
自分の戦績を見る
↓
他プレイヤーと比較
```

というサイト内回遊に変える。

最重要KPIは単純なページ数ではなく、

- Organic Search Clicks
- Organic Impressions
- CTR
- Indexed Pages
- Unique Users
- Pages / Session
- Returning Users
- Player Search回数
- Hero Page閲覧数
- Compare利用数

で評価する。

---

# 36. Claude Codeへの最初の指示

このMDを読み込んだら、いきなり実装を開始しないこと。

まず現在のOW Trackerのコードベースを調査し、

1. 技術スタック
2. ディレクトリ構造
3. ルーティング
4. データ取得処理
5. API
6. DB / Cache
7. i18n
8. SEO
9. Sitemap
10. 既存ページ

を整理する。

そのうえで、

```text
「OW Tracker コンテンツ拡張 Phase 1 実装計画」
```

をMarkdownで提示する。

計画には、

- 変更ファイル
- 新規ファイル
- DB変更
- API変更
- URL
- SEO
- UI
- 実装順序
- リスク

を含める。

ユーザーの承認なしにPhase 1以降へ進まない。

---

# 37. 最重要コンセプト

**「コンテンツを増やす」のではなく、「データから検索されるページを増やす」。**

これをOW Trackerの今後のコンテンツ戦略の基本原則とする。
