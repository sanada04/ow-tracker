/**
 * Original editorial strategy guide content for OW Tracker.
 * This content is authored independently and not sourced from any external API.
 */

interface RoleGuide {
  overview: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

type RoleKey = "tank" | "damage" | "support";

const GUIDES_JA: Record<RoleKey, RoleGuide> = {
  tank: {
    overview:
      "タンクはチームの盾であり、前線を維持することが最大の役割です。敵の攻撃を引きつけながら空間を作り出し、ダメージディーラーとサポートが安全に動ける環境を整えます。ヘルスが高く生存能力に優れていますが、単独行動は禁物です。チームと連携しながら押し引きのタイミングを判断することが、勝利への鍵となります。",
    positioning:
      "タンクは常にチームの前方に位置し、ダメージを受けながら前進します。仲間が視界内にいることを確認し、一人だけ突出して孤立しないようにしましょう。カバー（障害物）を活用して、不要なダメージを避けることも重要です。",
    strengths: [
      "高いヘルスで前線を維持できる",
      "味方のためのスペースを作り出す",
      "アルティメットで試合の流れを変えられる",
      "敵の攻撃を引きつけてチームを守れる",
    ],
    weaknesses: [
      "回復がなければ長期戦では消耗しやすい",
      "単独行動では狙われやすい",
      "アビリティのクールダウン中は隙が生まれる",
      "高火力・高機動のダメージヒーローに弱い場合がある",
    ],
    tips: [
      "サポートヒーローと常に連携し、回復を受けながら前進しよう。",
      "敵のアルティメットゲージを把握し、引くタイミングを計ること。",
      "チームが追いついていない状態での単独突撃は避ける。",
      "エネミーのヒーラーを常に意識し、チームとともに優先ターゲットにしよう。",
      "カバーをうまく使いながら立ち回ることで、ヘルスを温存できる。",
    ],
  },
  damage: {
    overview:
      "ダメージヒーローはチームの攻撃力を担う存在です。高い火力で敵を素早く排除し、チームに有利な状況を作り出します。キャラクターによってプレイスタイルは大きく異なり、遠距離から正確なエイムで戦うヒーローもいれば、接近戦を得意とするフランカーもいます。状況を読み、適切なタイミングで仕掛けることが重要です。",
    positioning:
      "ダメージヒーローの立ち位置はキャラクターによって大きく異なります。スナイパー系は高台からの視界確保が重要で、フランカー系は側面や背後からの奇襲が得意です。どちらにせよ、単独で深く入り込みすぎると孤立して倒されてしまうため、常に逃げルートを確保しておきましょう。",
    strengths: [
      "高い火力で敵を素早く排除できる",
      "キル後の状況展開で優位に立てる",
      "フランク・奇襲で敵のフォーメーションを崩せる",
      "ゲームの流れを一発で変えるポテンシャルを持つ",
    ],
    weaknesses: [
      "サポートなしでは長時間の交戦が難しい",
      "タンクに比べてヘルスが低い",
      "集中砲火されると生存が困難",
      "過剰に前に出ると孤立してピックされやすい",
    ],
    tips: [
      "敵チームの優先ターゲット（ヒーラー、スナイパー）を狙い続けよう。",
      "チームが動き出すタイミングに合わせて交戦を開始すること。",
      "無謀な突撃より、確実なトレードを意識して動こう。",
      "アルティメットを単独で使うより、チームのコンボに合わせると威力が上がる。",
      "敵のタンクが倒れた瞬間は追い込む絶好のタイミングだ。",
    ],
  },
  support: {
    overview:
      "サポートヒーローはチームの生命線です。味方を回復・強化し、戦線を維持することが主な役割ですが、それだけに留まりません。多くのサポートヒーローは高い移動能力や補助的な攻撃力も持ち、戦況に応じて積極的に状況を変えることができます。優れたサポートプレイヤーは「誰を、いつ、どれだけ回復するか」を常に判断し続けます。",
    positioning:
      "サポートヒーローは前線と後衛の中間に位置するのが基本です。前すぎると狙われやすく、後ろすぎると回復が届きません。常に視界を確保しながら、フランカーへの警戒も怠らないようにしましょう。壁やカバーを使って安全な位置から回復することが生存の鍵です。",
    strengths: [
      "チームの生存能力を大幅に向上させる",
      "アルティメットで試合の均衡を崩せる",
      "強化スキルでチームの攻撃力を引き上げられる",
      "生存能力を持つサポートは独自に生き延びられる",
    ],
    weaknesses: [
      "フランカーに狙われやすい",
      "回復対象が多いと優先順位の判断が難しくなる",
      "前線から距離を置きすぎると回復が届かない",
      "攻撃力はタンク・ダメージに劣る場合が多い",
    ],
    tips: [
      "タンクを最優先で回復しつつ、ダメージを受けているDPSにも気を配ろう。",
      "敵のフランカーを常に意識し、安全なポジションを保つこと。",
      "回復しながら余裕があれば、敵ヒーラーへの圧力もかけよう。",
      "アルティメットのタイミングはチームの状況に合わせて判断すること。",
      "チームが壊滅しそうなときは、まず自分の生存を優先して立て直せ。",
    ],
  },
};

const GUIDES_EN: Record<RoleKey, RoleGuide> = {
  tank: {
    overview:
      "Tanks are the backbone of any team, responsible for creating space and absorbing damage so their teammates can operate safely. With the highest health pools in the game, tanks lead the frontline push and draw enemy fire. However, a tank who overextends alone becomes an easy target. Success as a tank requires constant communication with your support to know when to push and when to pull back.",
    positioning:
      "Always position yourself between the enemy team and your allies. Use cover to avoid chip damage, and make sure your support can see and heal you at all times. Avoid pushing so far ahead that you lose your healer's line of sight — a tank without healing is a dead tank.",
    strengths: [
      "Highest health pool in the game, capable of sustaining extended fights",
      "Creates space and draws focus fire away from squishier teammates",
      "Ultimate abilities can decisively swing team fights",
      "Natural peel capability to protect backline allies",
    ],
    weaknesses: [
      "Heavily reliant on support healing to sustain through fights",
      "Overextending solo leads to quick elimination",
      "Vulnerable during cooldown windows when defensive abilities are down",
      "High-mobility damage heroes can outmaneuver slow tanks",
    ],
    tips: [
      "Coordinate your push timing with your support — never dive in when your healer is on cooldown.",
      "Track enemy ultimates and back off before a fight-winning ult hits you.",
      "Don't rush objectives alone; let your team engage together.",
      "Focus the enemy support alongside your DPS — removing healing collapses enemy sustain.",
      "Use map geometry and cover to block damage while creating offensive pressure.",
    ],
  },
  damage: {
    overview:
      "Damage heroes are the primary source of eliminations and pick potential on any team. Whether they operate from long range or dive into close quarters, their goal is to remove high-value targets and create openings for their team. Damage heroes vary enormously in playstyle — some demand precise aim, others reward aggressive positioning. Understanding your hero's range and engagement windows is the foundation of effective damage play.",
    positioning:
      "Positioning varies dramatically by hero archetype. Hitscan and sniper heroes seek high ground and open sightlines. Flankers need cover-dense paths to approach from unexpected angles. Regardless of style, always know your escape route before you commit to an engagement — getting caught in a bad position as a damage hero means a fast death.",
    strengths: [
      "Highest single-target damage output to secure quick eliminations",
      "Pick potential that creates numerical advantages for your team",
      "Flanking options to disrupt enemy backline and supports",
      "Ultimate abilities with fight-ending potential",
    ],
    weaknesses: [
      "Lower health than tanks makes positioning mistakes costly",
      "Reliant on team resources (heals, peel) when focused",
      "Overextension leads to isolation and being picked off easily",
      "Effectiveness heavily depends on target selection and aim",
    ],
    tips: [
      "Prioritize enemy supports — removing healing is often more impactful than killing tanks.",
      "Sync your engage timing with your tank's push rather than initiating alone.",
      "Prefer guaranteed trades over high-risk plays that may leave you dead.",
      "Combo your ultimate with your team's abilities for maximum fight impact.",
      "Identify when the enemy tank has fallen and press the advantage immediately.",
    ],
  },
  support: {
    overview:
      "Support heroes are the lifeline of any team composition. While healing is their primary function, modern Overwatch 2 supports are far more than passive healers — many have significant damage potential, strong movement abilities, and fight-altering ultimates. The skill of a great support player lies in constantly prioritizing: who needs healing most right now, when to apply offensive pressure, and when to reposition for survival.",
    positioning:
      "Supports thrive in the midrange between the frontline and the team's backline. Too far forward and flankers will pick you; too far back and your healing won't reach your tank. Always maintain line of sight to your highest-priority heal target, use cover to block flanking routes, and position near an escape path when aggressive enemies are nearby.",
    strengths: [
      "Dramatically increases team survivability through sustained healing",
      "Fight-turning ultimate abilities that can negate enemy ults or revive the team",
      "Boost abilities that amplify allies' damage or speed at critical moments",
      "Many modern supports can self-sustain and survive aggressive dives",
    ],
    weaknesses: [
      "Primary flanker target — enemy DPS will try to isolate you",
      "Healing multiple targets simultaneously creates difficult priority decisions",
      "Positioning too far from the frontline means your healing doesn't land",
      "Lower damage output compared to tanks and damage heroes in most cases",
    ],
    tips: [
      "Prioritize your tank's healing first — a dead tank means a lost fight.",
      "Stay aware of flanking paths; position near a cover escape route at all times.",
      "Chip damage on enemy supports when you have healing downtime — mirror fights win on efficiency.",
      "Hold your ultimate until your team is committed to a fight; don't burn it preemptively.",
      "If your entire team is down, survive and reset — a living support is never wasted.",
    ],
  },
};

export function getHeroGuide(role: string, lang: string): RoleGuide | null {
  const key = role as RoleKey;
  const guides = lang === "en" ? GUIDES_EN : GUIDES_JA;
  return guides[key] ?? null;
}
