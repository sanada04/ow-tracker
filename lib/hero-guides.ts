/**
 * Original editorial strategy guide content for OW Tracker.
 * This content is authored independently and not sourced from any external API.
 */

// ── Hero-specific tips (unique per hero) ─────────────────────────────────────

export interface HeroTip {
  ja: string[];
  en: string[];
}

export const HERO_TIPS: Record<string, HeroTip> = {
  ana: {
    ja: [
      "スリープダートは複数の敵が近くにいる状況で最も効果的。ターゲットをスリープさせた後、他の敵を片付けてから仕留めよう。",
      "ナノブーストはアルティメット使用直前の味方に合わせると複合効果が生まれる。Genjiblade や ReinCharge と組み合わせると特に強力。",
      "グレネードは味方への回復と敵への治癒妨害を同時に行える。タンクが大ダメージを受けた瞬間に投げると逆転できる。",
      "高台から援護するだけでなく、チームが前進する際は視線が届くポジションへ素早く移動すること。",
    ],
    en: [
      "Sleep Dart is most punishing when your team can immediately follow up — communicate before throwing so allies are ready to capitalize.",
      "Nano Boost pairs best with ultimates that benefit from extra damage and speed: Genji Blade, Soldier Helix, or Reaper Death Blossom.",
      "Biotic Grenade's anti-heal zone is as valuable as the burst heal — throw it under enemies who are being healed to cut off their sustain.",
      "Ana's long range means you can heal from safety, but always reposition to maintain line of sight as the fight moves forward.",
    ],
  },
  anran: {
    ja: [
      "中〜遠距離での牽制が得意なヒーロー。前線から離れた場所でも圧力をかけ続けることが役割の核心。",
      "アビリティのクールダウンを把握し、最も効果的な瞬間に使用するタイミングを逃さないこと。",
      "味方がエンゲージするタイミングに合わせて射撃を集中させると、敵の注意が分散して前線が崩れやすくなる。",
      "孤立した状況での生存は困難。必ずチームの視界内に留まりながら立ち回ること。",
    ],
    en: [
      "Anran excels at sustained ranged pressure — focus on supporting the team's push from a safe angle rather than diving in.",
      "Coordinate ability usage with your tank's engage timing to maximize burst damage windows.",
      "Track your cooldowns carefully; abilities used reactively rather than proactively tend to be wasted.",
      "Avoid isolated skirmishes — Anran's strength comes from contributing to team fights, not solo picks.",
    ],
  },
  ashe: {
    ja: [
      "スコープをうまく使い分けること。近距離では腰だめ射撃、中〜遠距離ではADS（スコープ）でダメージを最大化する。",
      "BOB（アルティメット）は狭い室内や通路に投げ込むと逃げ場がなくなり最大効果を発揮する。広い場所では迂回されやすい。",
      "ダイナマイトを爆発させるタイミングを掴むことが大事。燃焼継続ダメージも含めると、直撃よりも総ダメージが高い。",
      "コーチガンの反動を使って素早く高台へ移動できる。戦闘中に高さを確保するための移動技術として習得しよう。",
    ],
    en: [
      "Mix hipfire and ADS based on distance — scoped shots deal significantly more damage at range, but hipfire reacts faster up close.",
      "B.O.B. thrives in corridors, doorways, and corners where enemies can't easily disengage from his auto-aim.",
      "Dynamite's burn damage continues after the explosion — even a miss that catches fire can deal substantial total damage.",
      "Coach Gun's knockback launches Ashe upward when aimed at the ground — use it to instantly claim high ground during a fight.",
    ],
  },
  baptiste: {
    ja: [
      "イモータリティフィールドはチームを壊滅から救う最強の防御アビリティ。チームが集団で倒れそうな瞬間を予測して投げること。",
      "アンプリフィケーションマトリックス内を通る味方の弾は強化される。アナのナノブーストと組み合わせると圧倒的な火力になる。",
      "エクソブーツのジャンプは高台への移動に使い、ポジションを素早く変えながら回復を続けられる点が強み。",
      "右クリック（3点バースト）は中距離でのヒールショット精度が高い。敵への反撃にも使いやすい。",
    ],
    en: [
      "Immortality Field saves fights when your team is caught in a coordinated burst — time it for when the enemy commits their big ultimate.",
      "Amplification Matrix doubles the damage and healing of all projectiles passing through it — coordinate with Ana or Zenyatta for maximum fight impact.",
      "Exo Boots' charged jump gives Baptiste access to high ground that most supports can't reach, making him excellent at contesting elevated positions.",
      "Baptiste's burst fire is genuinely threatening — use it to punish enemies who ignore you and to help secure kills when allies are low.",
    ],
  },
  bastion: {
    ja: [
      "センチネル（タレット）モードは射線が通る場所でのみ真価を発揮する。高台や角の裏など、敵が接近しにくいポジションを選ぼう。",
      "アサルト（移動）モードは敵との距離を調整するための移動手段として活用し、戦闘は基本的にタレットモードで行うこと。",
      "アルティメット（砲撃）は敵が密集している場所やチョークポイントを狙うと最大効果を発揮する。",
      "フランカーへの対処が弱いため、タンクや近くの味方にカバーしてもらいながら陣地を保持することが重要。",
    ],
    en: [
      "Sentry form melts enemies with sustained fire, but you're stationary — always set up behind cover with your back protected from flankers.",
      "Self-Repair is a powerful sustain tool; use it proactively between engagements rather than waiting until you're critical.",
      "Artillery ultimate is most impactful on choke points, payload areas, and objectives where enemies must cluster — call out coordinates to your team.",
      "Bastion struggles against mobile flankers; position near your tank so they can peel for you when Genji or Sombra dives in.",
    ],
  },
  brigitte: {
    ja: [
      "シールドバッシュはスタンからの追撃コンボが強力。バッシュ直後にウィップショットでダメージを入れる流れを習得しよう。",
      "インスピレーション（チームヒール）は自分が敵にダメージを与えるたびに発動する。積極的に前線で叩くことが回復の源泉。",
      "リペアパックはアーマーを付与する効果もある。タンクに先打ちしておくことで大ダメージ到来前に備えられる。",
      "Rally（アルティメット）は全員にアーマーを付与する。チームが前進する直前に使うと戦線維持力が大幅に向上する。",
    ],
    en: [
      "Shield Bash into Whip Shot is Brigitte's core combo — bash to stun, immediately Whip Shot for bonus damage before the enemy recovers.",
      "Inspire healing triggers on damage dealt — fight actively in every teamfight to keep the passive aura ticking for your team.",
      "Repair Pack grants armor on top of full health — apply it proactively to your tank before a fight, not after they've taken damage.",
      "Rally's armor persists through damage absorption; use it just before a push to give your team maximum effective HP for the engagement.",
    ],
  },
  cassidy: {
    ja: [
      "ファニングアクション（右クリック）はコンボ先頭に使うことで爆発的な近〜中距離ダメージを出せる。外れると大きなスキになるため距離感を把握しよう。",
      "マグネティックグレネードは壁越しに誘導できる。コーナーに隠れている敵や、シールドを張っているタンクの背後に回して当てると有効。",
      "アルティメット（デッドアイ）はスキャン中に敵が視界から消えると効果が薄れる。周囲を遮蔽物の少ない場所で使い、複数人を同時に捉えよう。",
      "ファストドロー（左クリック）は高精度の単発ショット。ヘッドショットを狙えるなら、中距離の差し合いで優位に立てる。",
    ],
    en: [
      "Fan the Hammer deals massive burst damage at close-mid range — use it as a follow-up after a Magnetic Grenade stick for a reliable kill combo.",
      "Magnetic Grenade tracks and sticks to enemies, but the key skill is throwing it around corners and walls to hit targets that think they're safe.",
      "Deadeye charges damage over time; the longer you stay locked on, the higher the damage. Clear sightlines with multiple enemies maximize its value.",
      "Cassidy's base revolver is accurate and powerful — at mid-range, careful single-shot aim outperforms rushed Fan the Hammer.",
    ],
  },
  "dmon": {
    ja: [
      "機動力を活かして戦場を縦横無尽に動き回ること。一か所に留まらず、常に敵の予測外の角度から圧力をかけよう。",
      "タンクとしての役割を忘れず、チームが動きやすいスペースを作ることを意識する。単独突撃は避ける。",
      "ダイブ系のタンクとして、後衛の敵ヒーラーや孤立したダメージヒーローを狙う動きが効果的。",
      "チームと連携して的確なタイミングでエンゲージすることが、最大限のパフォーマンスを引き出す鍵。",
    ],
    en: [
      "D.Mon's mobility is her primary strength — use it to constantly change angles and keep enemies guessing about your approach.",
      "As a dive tank, coordinate your dives with damage heroes who can capitalize on the distraction you create behind enemy lines.",
      "Target enemy supports and isolated backliners rather than fighting in the open where the enemy team can focus you down.",
      "Time your engagement to coincide with your team's push — diving alone gives the enemy team time to focus and eliminate you.",
    ],
  },
  domina: {
    ja: [
      "前線をしっかり維持することがこのタンクの最大の強み。チームの盾として機能しながら空間を作り出そう。",
      "アビリティのタイミングを計り、チームのエンゲージに合わせて最大効果を引き出すこと。",
      "敵のアルティメット発動タイミングを把握し、防衛アビリティで対応する判断力が必要。",
      "サポートヒーローと視線を常に保ち、回復を受けながら前線を押し上げることを意識しよう。",
    ],
    en: [
      "Domina's strength lies in holding the frontline — focus on creating space for your team rather than chasing eliminations.",
      "Coordinate your abilities with your team's push timing to amplify the combined pressure on the enemy.",
      "Track enemy ultimates and position your defensive cooldowns to counter fight-winning abilities.",
      "Maintain line of sight with your support at all times — a tank without healing is a tank on borrowed time.",
    ],
  },
  doomfist: {
    ja: [
      "ライジングアッパーカットからシーズミックスラム、パンチのコンボを習得すること。空中コンボが決まると瞬時に大ダメージを出せる。",
      "メテオストライク（アルティメット）は敵のアルティメット（特にサウンドバリア）に対抗して使うことで、敵の試みを無効化できる。",
      "アビリティでのダメージがシールドを回復する仕組みを活かし、攻撃的に動くことで自己サステインを確保する。",
      "ダイブタンクとして、まず敵の後衛を崩してから戻るか、チームが追いついてくる連携を事前に決めておくこと。",
    ],
    en: [
      "Doomfist's combo flow (Uppercut → Seismic Slam → Rocket Punch) knocks enemies into walls for bonus damage — practice chaining them in training.",
      "Meteor Strike is excellent as a counter-ultimate: landing it on grouped enemies interrupts their setup and can delete a Sound Barrier before it lands.",
      "Each ability that damages enemies generates temporary shields — play aggressively and use this sustain to extend fights rather than retreat.",
      "As a dive tank, always have an exit plan; communicate with your team so they're ready to follow your engagement and prevent you from being isolated.",
    ],
  },
  dva: {
    ja: [
      "デストラクトは直撃よりも敵をポジションから追い出すための使い方が重要。ゾーン制圧として使うと試合の流れを変えられる。",
      "マトリックス（シールド）は高いDM値を持つ。アナのグレネード、ファラのロケット、ジャンクラットの爆弾を全て吸収できるため、チームを救える。",
      "ブースターダイブで敵の後衛に突入し、ヒーラーを孤立させる戦術が強力。ただし一人で突っ込みすぎないこと。",
      "メックを失ったベビーDVa状態でも機動力がある。ゴジラショットでファームし、隠れながらメックを早めに呼び戻すことを優先する。",
    ],
    en: [
      "Self-Destruct is most valuable as a zone-denial tool — force enemies off the objective rather than trying for kills, which often fail as they scatter.",
      "Defense Matrix eats almost all projectile ultimates: Graviton Surge ammo, Junkrat's RIP-Tire, Pharah's rockets — position it to protect teammates from these.",
      "Boosters let D.Va dive into the backline and disrupt supports; coordinate with your damage heroes to capitalize on the chaos you create.",
      "Baby D.Va's Micro Missiles deal more damage than most players expect — farm damage from cover and re-call your mech as quickly as possible.",
    ],
  },
  echo: {
    ja: [
      "デュプリケート（アルティメット）は相手のアルティメルゲージが高いヒーローをコピーすると即座にアルティメットを使えることが多い。",
      "飛行能力を使って高台や予測外のアングルを確保し、グルーブリングやトリニティボムを当てやすい位置を取ること。",
      "スティッキーボムはスタックさせるほどダメージが増える。タンクや動きの遅い敵に重点的に当て続けよう。",
      "ビームは距離が近いほどダメージが上昇する。高い機動性を活かして接近しながら削る戦法が基本。",
    ],
    en: [
      "Duplicate an enemy who has a high ultimate charge — you'll often get their ultimate within seconds of copying, enabling a near-instant double ultimate.",
      "Echo's flight lets her contest any high ground on the map; use elevated angles to fire Tri-Shot and Sticky Bombs downward with better sightlines.",
      "Sticky Bombs deal enormous damage when all six stick to a single target — aim for large, slow enemies like tanks who can't easily dodge.",
      "Focusing Beam deals bonus damage to low-health targets; chase down wounded enemies with a beam finish to secure kills your team started.",
    ],
  },
  emre: {
    ja: [
      "射程と立ち位置を意識して戦うヒーロー。チームの前線が崩れた状況での射線管理が生存の鍵になる。",
      "アビリティのリソース管理を徹底し、ここぞという場面で温存したアビリティを使うことで局面を打開できる。",
      "敵の動線を読んで先回りすることで、反応よりも予測で戦う立ち回りが求められる。",
      "チームのエンゲージに合わせてダメージを集中させることで、敵の回復量を上回るアウトプットを出そう。",
    ],
    en: [
      "Positioning and sightline control are the foundation of Emre's effectiveness — always know your escape route before committing to a fight.",
      "Ability resource management is critical; save your key cooldowns for turning-point moments rather than wasting them on low-value targets.",
      "Read enemy movement patterns and preposition rather than reactively repositioning — anticipation over reaction wins fights.",
      "Sync your damage burst with your tank's engage to overwhelm the enemy's healing capacity at the decisive moment.",
    ],
  },
  freja: {
    ja: [
      "遠距離からの精密射撃が強み。ポジションを素早く変えながら敵に射線を読まれないことが重要。",
      "移動アビリティを戦闘離脱のリソースとして温存しておくこと。突撃に使って逃げられなくなるミスは避けよう。",
      "敵の優先ターゲット（ヒーラー、遠距離アタッカー）から狙うことでチームの火力支援を最大化する。",
      "アルティメットは複数の敵が固まったタイミングか、最もダメージを出せる敵に合わせて使う判断を磨こう。",
    ],
    en: [
      "Freja rewards patience and positioning — take advantageous angles before opening fire rather than rushing into engagements.",
      "Conserve movement abilities for escape; spending them offensively and then having no way out is the most common Freja mistake.",
      "Prioritize enemy supports and isolated high-value targets to maximize your impact on the team fight's outcome.",
      "Track your ultimate charge and look for groupings or high-priority moments — a well-timed ultimate changes fights, a wasted one loses them.",
    ],
  },
  genji: {
    ja: [
      "ドラゴンブレードは単独で使わず、アナのナノブーストや他のアルティメットと組み合わせることで確実なキルを量産できる。",
      "リフレクトは敵のプロジェクタイルを無効化するだけでなく、アナのグレネードを跳ね返して敵への治癒妨害も可能。",
      "ダッシュは敵を倒すたびにリセットされる。集団戦で連続キルを取り続けることで止まらない機動力を維持できる。",
      "高い機動力を活かしてヒーラーを直接狙う戦術が強力。ただし孤立すると脆いため、引くタイミングを常に意識すること。",
    ],
    en: [
      "Dragon Blade alone rarely works at high ranks — pair it with Nano Boost or another setup ultimate so enemies can't simply disengage from you.",
      "Deflect can bounce Projectiles back at their source, including Ana's Biotic Grenade — turning anti-heal against the enemy is high-impact when it lands.",
      "Swift Strike resets on kill; in chaotic team fights, chain kills to maintain unstoppable mobility and delete multiple targets before they respond.",
      "Target the enemy support first — Genji's dive threat is most dangerous to unprotected healers who have no mobility to escape.",
    ],
  },
  hanzo: {
    ja: [
      "嵐の矢はチャージがいらない高速射撃モード。至近距離の緊急対処や連続ダメージが必要な局面で使い分けよう。",
      "竜撃波（アルティメット）は壁を貫通する。敵がバリアや建物の裏に隠れている場合に直撃させられる。",
      "ソニックアロー（索敵）を要所で使い、敵の位置をチームと共有することで奇襲を防ぐ情報支援が強力。",
      "壁登りを使って予想外のアングルから射撃することで敵の照準を外し、有利な交戦を積み重ねよう。",
    ],
    en: [
      "Storm Arrows give instant burst without charging — use them at close range when a charged shot would be too slow to land.",
      "Dragonstrike travels through walls and structures; fire it through terrain at clustered enemies who think they're safe behind cover.",
      "Sonic Arrow's wallhack reveals enemy positions for your whole team — use it on key choke points before your team pushes to prevent ambushes.",
      "Wall Climb lets Hanzo access flanks and angles that other hitscan heroes can't reach — use verticality to confuse enemy aim and find safer sightlines.",
    ],
  },
  hazard: {
    ja: [
      "エリア制圧能力を最大限に活用し、敵が近づきたくない空間を作り出すことが役割の核心。",
      "タンクとして前線を維持しながら、自分のアビリティがチームの動きを補助できるタイミングを常に探る。",
      "生存優先で無謀な突撃を避け、チームが追いついてくる状況を作ってからエンゲージすること。",
      "敵のカウンターピックに応じて立ち回りを調整する柔軟性がこのヒーローには特に求められる。",
    ],
    en: [
      "Hazard's area denial is the team's most valuable asset — create space the enemy doesn't want to enter rather than simply trading damage.",
      "As a frontline tank, your abilities should serve the team's movement; look for moments where your kit enables teammates to follow up effectively.",
      "Avoid overextending; set up fights in locations where your team can immediately support you rather than diving alone.",
      "Adapt your positioning based on enemy composition — different threats demand different defensive responses from a tank like Hazard.",
    ],
  },
  illari: {
    ja: [
      "ソーラーリフトのパイロンは自動回復を行うため、戦闘エリアの中心付近に置くと最大効率で機能する。遠すぎると届かないことに注意。",
      "キャプティベイター（アルティメット）は視野が広く見通しの良い場所から使うと多くの敵に当てられる。チョークポイントでの使用が特に強力。",
      "ソーラーライフルは攻撃射撃としても十分な威力を持つ。敵への反撃と味方への回復を交互に行いながら戦局を安定させよう。",
      "パイロンは破壊されやすいため、敵が気づかない場所や届きにくい高台に設置することで生存率を上げられる。",
    ],
    en: [
      "Place the Healing Pylon in the center of combat rather than at the backline — it heals allies who are fighting, not retreating, so proximity matters.",
      "Captive Sun is devastatingly effective on choke points and objective areas where enemies must cluster; high-angle launches hit more targets.",
      "Illari's Solar Rifle deals competitive damage — actively shoot at enemies between healing volleys to maintain dual-threat pressure.",
      "Pylon placement on hard-to-reach ledges and around corners makes it much harder for the enemy to destroy it before it has healed the full team.",
    ],
  },
  "jetpack-cat": {
    ja: [
      "高い機動力を活かして戦場の上下を自在に移動し、最も回復が必要な味方へ素早く届けることを最優先にしよう。",
      "空中からの回復は敵に狙われにくいが、着地タイミングを読まれると一気に狙われる。着地場所を分散させよう。",
      "アビリティの発動タイミングを試合の流れに合わせ、チームが最大ピンチの瞬間に最大効果を発揮できるよう温存する。",
      "チームの視界を広げる役割として立ち回り、敵のフランカーや奇襲に対する早期警戒の役も担おう。",
    ],
    en: [
      "Jetpack Cat's mobility is the defining trait — prioritize using it to reach the most endangered ally quickly rather than repositioning for personal safety.",
      "Aerial positioning makes you harder to hit, but predictable landing zones become targets; vary where you land to keep enemies guessing.",
      "Save your most impactful abilities for decisive fight moments — early-turn cooldown dumps often waste the potential that a timed use would have.",
      "Use your high vantage point to spot flankers early and call them out for your team before they reach the backline.",
    ],
  },
  "junker-queen": {
    ja: [
      "スカーレット・ウーンドは傷を付けた敵からヒールを奪う仕組み。攻撃的に戦うことがジャンカークイーンの自己回復の源泉。",
      "カーニバルアックスは投げた後にラマージで手元に戻せる。この動作に合わせてアックスを当て続けることで出血ダメージを維持しよう。",
      "Commanding Shout（アルティメットに近いアビリティ）でチームの移動速度と追加HPを付与し、前線を一気に押し上げるタイミングを作れる。",
      "体力回復が攻撃に依存しているため、引き下がりながら戦う戦法は苦手。前線で正面からプレッシャーをかけ続けることが強み。",
    ],
    en: [
      "Junker Queen heals by wounding enemies — play aggressively and maintain the frontline pressure that generates Wounded stacks for healing.",
      "Throw Jagged Blade and recall it with Rampage to keep Wound stacks refreshing on nearby enemies for sustained bleed damage over the fight.",
      "Commanding Shout's speed and health boost enables rapid pushes; time it when your team is already committing so the bonus HP and speed multiplies their effectiveness.",
      "Retreating reduces your healing since it comes from dealing damage — Junker Queen is strongest when she holds her ground and brawls rather than cycling in and out.",
    ],
  },
  junkrat: {
    ja: [
      "グレネードランチャーは壁やフロアへの跳弾を使いこなすことで視線が通らない敵へもダメージを届けられる。",
      "スティールトラップは敵が通ることが多い場所（コーナー手前、ペイロード脇）に設置することで大きな行動妨害になる。",
      "コンカッションマイン2発を連続で使い、一気に遠距離へ飛ぶ「マイン飛び」でポジションを素早く変えられる。",
      "リップタイヤ（アルティメット）はプレイヤーが操作できるため、建物の隙間や坂道を使って敵の後ろに回り込むルートを覚えよう。",
    ],
    en: [
      "Grenade Launcher grenades bounce off walls and floors — learn to arc shots around corners and lob them into rooms where enemies are hiding.",
      "Steel Trap placed at choke point entries (doorways, corridor corners, payload flanks) creates high-value immobilize setups for your team to capitalize on.",
      "Concussion Mine double-jump is a core mobility tool: two mines in quick succession launch Junkrat incredible distances to reposition instantly.",
      "RIP-Tire can be steered around obstacles — drive it up ramps, through buildings, and around corners to approach from directions enemies aren't watching.",
    ],
  },
  juno: {
    ja: [
      "ハイパーリング（移動速度バフ）はチームが目標に向かって移動する直前に展開すると最大効率で機能する。",
      "軌道光線（アルティメット）は長時間の広範囲回復。チームが拠点を維持している間に使うと立て直し能力が大幅に向上する。",
      "高い機動性を持つため、フランカーへの対処や素早いポジション変換が他のサポートより得意。",
      "パルスファイアは支援しながら敵にダメージも与えられる。味方と敵を両方に照準して状況に応じて使い分けよう。",
    ],
    en: [
      "Hyper Ring's speed boost is most effective placed along your team's push path — drop it just before your tank commits so everyone arrives together.",
      "Orbital Ray's prolonged area healing is best used while your team holds a captured objective or contests the payload, sustaining through sustained pressure.",
      "Juno's mobility lets her escape flankers more easily than most supports — use flight to create vertical distance when a Genji or Tracer dives on you.",
      "Mediblaster simultaneously heals allies and damages enemies; in close-range scrambles, it gives Juno a dual-threat presence other supports lack.",
    ],
  },
  kiriko: {
    ja: [
      "スズの浄化タイミングが最重要。アナのグレネードやキャシディのフラッシュなどの状態異常を即座に消せる瞬間を見逃さないこと。",
      "護身（壁透過テレポート）は味方の中で最も危険な状況の仲間にワープすることで即座に回復・救助ができる。",
      "狐の霊（アルティメット）は攻撃速度・移動速度を全員に付与する。チームが攻め込む直前に合わせると無敵に近い前進が可能。",
      "クナイは頭に当てるとクリティカルダメージ。中距離での精度を高めてヒーラーを削る役割も担える。",
    ],
    en: [
      "Suzu's cleanse timing is Kiriko's highest-skill ceiling moment — identify Ana Grenades, Cassidy Flashbang, and anti-heal abilities before they land to get maximum value.",
      "Swift Step teleports through walls to any visible ally — use it to instantly reach an endangered support or tank who's about to die rather than the closest teammate.",
      "Kitsune Rush during your team's push gives everyone the attack speed and movement speed to overwhelm a stationary defense before they can recover.",
      "Kunai headshots deal critical damage; practice landing consistent headshots at mid-range to add genuine kill threat pressure alongside your healing.",
    ],
  },
  lifeweaver: {
    ja: [
      "ライフグリップは味方を引き寄せる強力な救助アビリティだが、悪いタイミングで使うと味方の行動を妨害する。使用前に状況を必ず確認すること。",
      "ペタルプラットフォームは一時的な高台を作り出せる。自分や味方が有利なアングルを得るために即興で使えると強い。",
      "セレニティ（アルティメット）は最大ヘルスを増加させる強力なゾーン。チームが集まっている場所（拠点・ペイロード周辺）で展開しよう。",
      "ライフグリップをダイブしてきたフランカーから逃げるための自己保護として使うことも覚えておくと生存率が上がる。",
    ],
    en: [
      "Life Grip is a powerful rescue tool but pulling an ally mid-combat can disrupt their positioning and ability timing — always confirm the pull is welcome before using it.",
      "Petal Platform creates instant high ground anywhere on the map — use it to give yourself or a sniper ally an angle that didn't exist before the fight.",
      "Tree of Life's large health zone is most effective placed inside the objective or on the payload where your team is already fighting, not in the backline where nobody stands.",
      "Life Grip can be used on yourself if a flanker is forcing you into a dangerous corner — pulling toward a safe teammate repositions you out of the 1v1.",
    ],
  },
  lucio: {
    ja: [
      "サウンドバリア（アルティメット）は敵のアルティメット発動と同時かその直前に使うことで被害を最小化できる。特にグラビトン・スーパーチャージャー対策に有効。",
      "スピードオーラとヒールオーラの切り替えを状況に応じて行うのが中〜上級の立ち回り。移動フェーズでは速度、戦闘フェーズでは回復にする。",
      "ウォールライドを使って壁を縦横に移動することで射線を切り、フランカーや狙撃を無効化することが得意。",
      "ブーピング（跳ね飛ばし攻撃）は崖や穴の近くで使うと敵を即死させられる。マップの地形を常に意識しよう。",
    ],
    en: [
      "Sound Barrier blocks incoming burst damage — time it right as enemy ultimates detonate, not before they commit, to shield the maximum effective HP.",
      "Switching between Speed and Healing auras mid-fight is Lúcio's core skill: speed during rotations and pushes, healing when your team is taking sustained damage.",
      "Wall Riding gives Lúcio unparalleled survivability against flankers — use vertical movement to make yourself an almost impossible target while staying near teammates.",
      "Boop near ledges and environmental drops eliminates enemies instantly; learn map geometry to punish enemies who fight near hazards.",
    ],
  },
  mauga: {
    ja: [
      "心臓病（アルティメット）は高火力で構えたままのアルティメット。周囲を巻き込むため、敵が密集している場所に突入してから使う。",
      "クリティカルショットがヒールを発動する仕組みを活かし、攻撃的に撃ち続けることで自己回復をキープする。",
      "カーニバルガンとチェーンガンの使い分けが重要。状況に応じてアーマー割りと単純ダメージを出力し分けよう。",
      "正面からの打ち合いに強いため、チョークポイントを制圧しながら真正面から押し込む戦術が最も機能する。",
    ],
    en: [
      "Cardiac Overdrive launches Mauga into a healing feedback loop — activate it when you're already dealing consistent damage to enemies to sustain through their response.",
      "Mauga heals from crits; maintaining accurate fire is the key to sustaining through fights — sloppy shooting leaves him without his passive recovery.",
      "Overrun charges into targets for displacement and knockback; use it to separate enemy supports from their tank or to close gaps on fleeing targets.",
      "Mauga brawls best in corridors and tight spaces where enemies can't disengage from his sustained fire — avoid open ground where mobile enemies can circle you.",
    ],
  },
  mei: {
    ja: [
      "クライオニック（自己凍結）は単なる防御アビリティではなく、ヘルスパックのない場所での自己回復手段としても使える。",
      "アイスウォールの使い方が勝敗を分ける。敵チームを分断してから各個撃破する戦術と、チームメイトの退路を守るための使い方の両方を習得しよう。",
      "ブリザード（アルティメット）はザリアのグラビトンサージとの連携が強力。敵が固まった直後に発動すると全体凍結が決まりやすい。",
      "エンドサーマルブラスター（長距離アイスビーム）は射程が長く精度が高いため、フリーズ状態の敵に確実にクリティカルを当てるために使おう。",
    ],
    en: [
      "Cryo-Freeze is not just a defensive tool — use it to heal in place when you're below half health and there are no health packs nearby.",
      "Ice Wall's most impactful use is splitting the enemy team: trap their tank while your team cleans up the vulnerable backline, or block a retreat to secure kills.",
      "Blizzard + Graviton Surge (Zarya ultimate) is one of the game's most reliable combo ultimates — communicate with your Zarya to time the setup correctly.",
      "Alt-fire's long-range icicle projectile is accurate enough to land consistent crit shots on frozen enemies — switch to it after a successful Freeze for maximum kill efficiency.",
    ],
  },
  mercy: {
    ja: [
      "リザレクト（復活）は最も価値のある味方が倒れた瞬間に使う。DPSのアルティメットを持つヒーローや、重要なキャストを失った瞬間が最もタイムリー。",
      "ガーディアンエンジェルで常に複数の味方をビーコンとして意識し、状況に応じてすぐ飛び移れるようにしておくこと。",
      "バレキリー（アルティメット）中の継続強化ビームは通常より長いため、複数の味方を同時にヒールまたはダメージブーストできる。",
      "ダメージブーストは高火力の単発系（ハンゾー、キャシディ）に当てるほど恩恵が大きい。回復とブーストの優先度を常に判断する。",
    ],
    en: [
      "Resurrect the highest-value dead teammate — the DPS with an ultimate ready, or the tank who just died at the worst moment; not whoever died first.",
      "Always have two or more Guardian Angel beacons active; this gives you multiple escape and repositioning options when a flanker targets you.",
      "Valkyrie's extended beam range lets you chain heal or boost across an entire team fight — prioritize damage boost on teammates who are winning a fight, not those retreating.",
      "Damage Boost is most efficient on high-damage-per-bullet heroes (Hanzo, Cassidy, Widowmaker) where each boosted shot has a larger absolute value.",
    ],
  },
  mizuki: {
    ja: [
      "水属性の特性を持つサポートとして、広範囲または持続型の回復を得意としている可能性が高い。チームの陣形維持を意識しよう。",
      "自己防衛手段があるヒーローの場合、ダイブしてきた敵に対してそのアビリティを温存しておくことが生存につながる。",
      "ポジションを柔軟に変えながら最も回復が必要な仲間の視線内に入り続けることが優先事項。",
      "アルティメットは試合のターニングポイント（拠点占領・ペイロード最終区間）で使うと最大効果を発揮しやすい。",
    ],
    en: [
      "Mizuki's kit favors maintaining the team's cohesion — prioritize healing the teammates most likely to be in danger from the next engagement.",
      "If Mizuki has a self-defense ability, save it specifically for flanker encounters rather than using it proactively.",
      "Stay mobile and reposition with your team's push — a support behind the team provides half the value of one who moves with them.",
      "Ultimate timing is everything for support heroes; hold it for objective fights and payload final sections where both teams commit everything.",
    ],
  },
  moira: {
    ja: [
      "リソース（オーブの回復量）管理がモイラの最重要スキル。攻撃ビームを使うとリソースが回復するため、戦闘に積極的に参加しながら回復量を維持しよう。",
      "コアレスセンス（アルティメット）は壁貫通の長距離ビームで、ヒールと同時にダメージも与える。敵が密集した場所を貫くラインを意識して使おう。",
      "フェードは移動・離脱・位置変換に使える万能アビリティ。フランカーが近づいてきた際の最初の逃げ手段として温存しておくこと。",
      "回復オーブはバウンドしながら最も近い傷ついた味方を追尾する。チームが密集しているときに投げると連鎖回復が発生する。",
    ],
    en: [
      "Resource management is Moira's core skill — her Biotic Orb healing regenerates through damage dealt; actively fight to stay topped up on healing fuel.",
      "Coalescence travels through barriers and pierces all enemies in a line — aim through choke points and cluster spots to hit multiple targets simultaneously.",
      "Fade is Moira's lifeline: save it specifically for flanker encounters or incoming ultimates rather than spending it for minor repositioning.",
      "Healing Orb bounces toward nearby injured allies automatically — throw it into the middle of a clustered team fight for efficient, hands-free chain healing.",
    ],
  },
  orisa: {
    ja: [
      "テラサージ（アルティメット）は敵を引き寄せながら大ダメージを与える。狭い場所や壁際で使うと逃げ場がなくなり特に効果的。",
      "フォーティファイはCC（行動妨害）を完全に無効化しながら前進できる。敵のシグマやジャンクラットの爆発が多い場面で積極的に使う。",
      "ジャベリンスピンはプロジェクタイルを弾きながらダメージを与える。ジャンクラットやファラとのマッチアップで特に活躍する。",
      "スタビリティーの高いオリーサは安定した前線を維持しやすい。チョークポイントで敵を足止めしながらチームの火力を引き出す戦い方が基本。",
    ],
    en: [
      "Terra Surge pulls enemies inward for massive damage — use it in corridors and near walls where targets can't easily escape the gravitational pull.",
      "Fortify makes Orisa immune to crowd control while channeling — activate it proactively when dashing into Sigma pulls or Junkrat trap zones.",
      "Javelin Spin destroys projectiles and deals melee damage; spin into Junkrat grenade arcs and Pharah rockets to both block them and punish the attackers.",
      "Orisa's stability makes her a natural anchor tank for choke point fights — hold the line, let the enemy push into your team's fire, and punish overextensions.",
    ],
  },
  pharah: {
    ja: [
      "高度を保つことが最大の生命線。ヒットスキャン系のヒーロー（ソルジャー76、キャシディ、アッシュ）がいる場合は積極的に低空飛行を避けること。",
      "コンカッション（ノックバック）は崖際で使うと敵を落下させてキルを奪える。地形を常に意識した立ち回りが有効。",
      "ロケット弾は直撃よりもスプラッシュで当てる方がダメージが安定する。密集した敵の足元を狙うことで複数人に同時ダメージを与えられる。",
      "マーシーのダメージブーストと組み合わせることでワンショットキルが狙いやすくなる、いわゆる「ファラマーシー」は依然として強力な戦術。",
    ],
    en: [
      "Altitude is survival — the moment you descend to ground level, hitscan heroes like Soldier: 76 and Cassidy will shred you before you can escape.",
      "Concussive Blast near ledges and map hazards can knock enemies to their deaths — always know where environmental kills are possible on each map.",
      "Aim for splash damage on groups of enemies rather than direct hits on a single target; Pharah's rockets deal impressive AoE that rewards area targeting.",
      "Mercy damage boost + Pharah rockets is a perennially strong pairing — coordinate with your Mercy to stay in boost range while she maintains beam contact from a safe angle.",
    ],
  },
  ramattra: {
    ja: [
      "ラマートラは「ネメシスフォーム」と「オムニックフォーム」の切り替えが最重要。遠距離ではボイドアクセラレーター（通常形態）、近距離ではパンチコンボ（ネメシス）を使い分ける。",
      "アニヒレーション（アルティメット）は持続型の範囲ダメージ。自分が敵の近くに居続けるほどアルティメット時間が延長される仕様を活かし、前線に居座ろう。",
      "ボイドバリアは射線上に展開することで遮蔽物として使えるほか、重要な局面で味方全員の前進を支援できる。",
      "ネメシスフォームのパンチはバリアも破壊できる。バリアタンクが多い相手に対して有利なタンク選択肢となる。",
    ],
    en: [
      "Ramattra's kit has two distinct phases: Omnic Form for ranged void projectile pressure, and Nemesis Form for armored close-range brawling — switch based on the fight's distance.",
      "Annihilation's duration extends as long as enemies remain in your vortex range — actively pursue enemies during the ultimate rather than standing still to maximize uptime.",
      "Void Barrier provides positional flexibility as a deployable cover piece; use it to block enemy sightlines during pushes or protect allies crossing open ground.",
      "Nemesis Form punches bypass barriers, making Ramattra a strong counter to Reinhardt and Sigma in close-quarters fights where shields would otherwise stall the match.",
    ],
  },
  reaper: {
    ja: [
      "シャドウステップで敵の背後の高台に移動し、デスブロッサムをゼロ距離で当てる戦術が最大効果。チームへの宣言も忘れずに。",
      "ライフスティールがあるため、近距離で撃ち続けることで自然に体力が回復する。前線での延命が他のDPSより優れている。",
      "シャドウステップは足音がするため、敵に位置を知らせてしまう。使うタイミングと場所を工夫して奇襲性を保つ。",
      "ウレイスフォーム（無敵移動）はCCを完全に無効化する。ジャンクラットのトラップやアナのスリープを受けた直後にキャンセルできる。",
    ],
    en: [
      "Shadow Step behind enemy lines, then immediately Blossom — the surprise positioning at point-blank range makes Death Blossom nearly impossible to escape.",
      "Lifesteal from shotgun pellets is substantial at close range; sustain through skirmishes by staying on top of enemies rather than backing off to heal.",
      "Shadow Step has audible sound cues that enemies can hear — use environmental noise (ultimate chaos, ability clashes) to mask the teleport sound when possible.",
      "Wraith Form cancels most debuffs including Sleep Dart and Steel Trap; use it reactively the moment a crowd control lands to immediately escape the chain.",
    ],
  },
  reinhardt: {
    ja: [
      "バリアを過信しない。バリアが溶け始めたら一度引いて盾を回復させる判断が重要。溶かされた後に引くのでは遅い。",
      "ファイヤーストライク（射撃アビリティ）はバリアを展開しながらでも使える。こまめに使って前線を削ることを意識しよう。",
      "アースシャターの衝撃波は地面に沿って扇状に広がるが、壁の裏まで回り込むわけではない。低い遮蔽物の陰にいる敵は巻き込めても、完全に視線が通らない敵には過度な期待をしないこと。",
      "チャージは壁際で当てると大ダメージ＋確定行動不能で仕留めやすいが、何もない場所で当てても相手をひるませるだけで終わることが多い。壁を背にした敵を狙って使おう。",
    ],
    en: [
      "Don't let Barrier shield reach zero before retreating — once it shatters there's a cooldown window where you're completely vulnerable; pull back earlier.",
      "Firestrike passes through the barrier and hits enemies behind it; use it constantly during standoffs to chip enemies down while the shield holds.",
      "Earthshatter's shockwave spreads along the ground in a wide arc in front of you — it can catch enemies near low cover, but it won't reliably wrap around corners or walls, so line up a clear ground path to your targets.",
      "Charge deals far more damage — and reliably secures the kill — when it pins a target against a wall; in open space it only staggers them, so look for a backstop before committing to a Charge.",
    ],
  },
  roadhog: {
    ja: [
      "フック→近距離ショットガン→右クリックのコンボが基本連携。フック後の距離感を一定に保つ練習が最優先。",
      "自己回復（テイクアブリーズ）は体力が50〜60%台になったら即座に使う習慣をつけること。ギリギリまで温存すると倒される前に回復が間に合わない。",
      "ホールホッグ（アルティメット）は狭い通路で真価を発揮する。逃げ場のない場所に敵を追い込んでから発動しよう。",
      "フックの射程と照準を熟知し、壁の裏から引きずり出すために角の少し外側を狙うテクニックを習得しよう。",
    ],
    en: [
      "The Hook → close-range Scrap Gun → alt-fire combo is Roadhog's bread and butter — practice landing all three hits in sequence at point-blank range.",
      "Use Take a Breather at 50-60% health, not at near-death; waiting too long means you'll die before the heal fully restores you.",
      "Whole Hog shines in corridors and small rooms where enemies have no escape — chase them into a tight space before activating rather than using it in the open.",
      "Hook has a wider hitbox than it appears; aim slightly around corners to pull enemies sheltering just outside of direct line-of-sight.",
    ],
  },
  shion: {
    ja: [
      "独自のスタイルで戦場を制御するダメージヒーロー。自分のレンジと得意な戦闘距離を把握し、最適な交戦距離を常に維持しよう。",
      "アビリティの優先度を状況に応じて変え、最も効果が高い瞬間に使うことが上達の鍵。",
      "孤立した敵や後衛のサポートを狙う動きは、どのダメージヒーローにおいても試合を動かす重要な判断。",
      "チームの前線が崩れた状況では無理をせず、リスポーン後の再集合を優先する判断力も重要。",
    ],
    en: [
      "Master your optimal engagement range — Shion's kit has a preferred distance, and fighting outside of it significantly reduces your effectiveness.",
      "Ability sequencing is the skill ceiling for damage heroes; practice the order and timing that creates the most reliable burst or sustained damage.",
      "Flanking enemy supports is a universal high-value play; if Shion has mobility, use it to pressure the backline when the frontline is occupied.",
      "When a fight is lost, disengage rather than feeding — regroup with your team and reset for a coordinated second attempt.",
    ],
  },
  sierra: {
    ja: [
      "長距離または中距離での精度を活かして立ち回るヒーロー。敵の移動ルートを予測した先撃ちが精度を上げるコツ。",
      "移動アビリティの有無にかかわらず、射線を切るための動きを常に意識してヘッドショットに晒される時間を最小化しよう。",
      "敵のヒーラーへの圧力をかけ続けることが、チームのピックにつながる最重要の判断。",
      "アルティメットの発動タイミングを逃さないために、ゲージを常に確認し試合の流れと合わせて使う習慣をつけよう。",
    ],
    en: [
      "Sierra rewards consistent aim and positioning over flashy plays — find stable angles and apply sustained pressure rather than taking high-risk engagements.",
      "Minimize head exposure time by strafing between shots; even partially hiding behind cover between attacks reduces incoming damage significantly.",
      "Targeting enemy supports consistently puts pressure on their team's sustain, enabling your tank and fellow damage dealers to win extended fights.",
      "Track your ultimate charge actively — using it two seconds earlier than 'feeling ready' often results in higher fight impact than holding it for the perfect moment.",
    ],
  },
  sigma: {
    ja: [
      "キネティックグラスプはプロジェクタイルを吸収して盾ゲージに変換する。ジャンクラット・ファラ・エコーなどの高頻度プロジェクタイルに対して積極的に使おう。",
      "フラックスの引力（アルティメット）はメイのブリザードやザリアのグラビトンと組み合わせると全体スタンコンボになる。事前に連携を取ること。",
      "実験的バリアは上下に動かせる。高台上の敵を覆うように上に移動させたり、低地の通路をブロックするために下に下げたりと柔軟に使おう。",
      "ハイパースフィア（通常攻撃）は壁で2回跳ねる。角の裏に隠れた敵に間接的に当てるテクニックが習得できると非常に強力。",
    ],
    en: [
      "Kinetic Grasp absorbs projectiles and converts them to shields — use it aggressively against Junkrat, Pharah, and Echo whose kits are nearly all projectile-based.",
      "Gravitic Flux (ultimate) suspends enemies mid-air — combo it with Mei Blizzard or Zarya Graviton Surge by pre-coordinating who initiates and who follows up.",
      "Experimental Barrier can be raised or lowered freely; elevate it to block high-ground angles or lower it to deny corridor crossings at ground level.",
      "Hyperspheres bounce twice off surfaces — learn to angle them around corners to hit enemies who think they're safely sheltering out of direct line of sight.",
    ],
  },
  sojourn: {
    ja: [
      "レールガンはチャージが100%になったときに打つのが基本。チャージを溜めるために左クリック（エネルギー弾）を連続で当て続けることが前提。",
      "パワースライドは単なる移動だけでなく、スライド中にジャンプすることで通常では届かない高さへ移動できる。",
      "オーバークロック（アルティメット）中はチャージなしで連続レールガンが撃てる。このウィンドウを最大限に活かしてキルを量産する。",
      "ディスラプターショット（範囲スロー）は敵が密集した場所に投げ込んでからレールガンで仕留めるコンボが非常に強力。",
    ],
    en: [
      "Railgun power shots require full charge — keep your left-click chain hitting targets to continuously build charge and fire charged shots as quickly as possible.",
      "Power Slide into Jump sends Sojourn higher than a normal jump; use this technique to reach elevated platforms and catch enemies off-guard from above.",
      "Overclock fires unlimited charged shots during its window — line up multiple enemies in a corridor or cluster and delete them before the ultimate expires.",
      "Disruptor Shot's slow zone is a setup tool, not just a damage dealer; throw it at the enemy cluster and immediately follow with a fully charged Railgun shot for near-guaranteed kills.",
    ],
  },
  "soldier-76": {
    ja: [
      "バイオティックフィールド（自己回復フィールド）は自分だけでなく味方も回復する。戦闘中に敵が密集していない安全なルートを確保して展開しよう。",
      "スプリントは射撃とアビリティの使用で止まる。移動と戦闘のテンポを意識して使い、意図しない時に止まらないよう注意。",
      "タクティカルバイザー（アルティメット）は自動照準になるが、動いている敵にも当たる。最も危険な敵を起点に当てていき、一人ずつ確実に倒す。",
      "ヘリックスロケットは直接当てるよりも足元に当てるとスプラッシュが確実に入る。タンクの足元への連発が安定したダメージを生む。",
    ],
    en: [
      "Biotic Field heals nearby allies too — deploy it in a position your team can stand in during the fight, not somewhere they have to retreat to access healing.",
      "Sprint cancels when you shoot or use abilities; integrate it into your movement cadence between shots rather than treating it as a separate mode.",
      "Tactical Visor auto-aims but still requires you to point at enemies — prioritize the most dangerous target first and track through them sequentially for maximum value.",
      "Helix Rockets deal splash damage; hitting the ground at an enemy's feet is more reliable than aiming center-mass, especially against tanks with larger hitboxes.",
    ],
  },
  sombra: {
    ja: [
      "ハック後の無敵タイムを使ってすぐに攻撃を入れること。ハックは短時間のCCのため、即座に追撃しないと逃げられる。",
      "トランスロケーター（テレポート先）は常に安全な退路として設置しておく。死角か高台に置くのが基本。",
      "EMP（アルティメット）はバリアもハックも解除し、シールド・バリアを全て消去できる。ザリアのバブルやシグマのバリアに合わせると試合が変わる。",
      "ステルス中は足音と行動のキャンセル音に注意。完全に沈黙しているわけではないため、敵の裏を取る際の最終アプローチは慎重に。",
    ],
    en: [
      "Follow up a Hack immediately — the ability disables window is short and enemies will use movement abilities the moment they can; press the advantage instantly.",
      "Place Translocator in a safe spot (behind cover, on a ledge) at the start of every engagement so you always have an escape option if the fight goes wrong.",
      "EMP destroys all shields (Zarya bubbles, Sigma barriers, Ramattra Void Barrier) and debuffs the entire team — use it to break high-value shield setups before your team engages.",
      "Stealth has sound cues when activated and deactivated near enemies; time your decloaks to coincide with loud environmental noise to avoid giving away your position.",
    ],
  },
  symmetra: {
    ja: [
      "テレポーター（アルティメット）の設置位置がゲームを決める。チームのスポーン地点から近くかつ敵の視線が届かない場所に設置し、素早いリグループを実現しよう。",
      "フォトンバリア（第2アルティメット）は敵の視線を完全に遮断する。ポジション変換のカバーや敵のスナイパー対策として使おう。",
      "シンメトラのビームは接続が続くほどダメージが増加する。タンクに接続し続けることで最終段階のダメージを出し、タンクキルを狙える。",
      "センチネルタレットは角の裏や通路に仕掛けることで情報収集と同時に削りダメージを出せる。序盤に全タレットを設置し直す習慣をつけよう。",
    ],
    en: [
      "Teleporter placement wins matches — set it behind cover near your spawn so the team can instantly teleport to the frontline after being wiped rather than walking back.",
      "Photon Barrier blocks all projectiles and vision across its length; use it to deny sniper sightlines or cover a team rotation across open ground.",
      "Symmetra's beam damage scales up the longer it stays connected — deliberately target tanks and high-health targets to reach maximum damage before switching to weaker enemies.",
      "Sentry Turrets provide persistent chip damage and vision in corridors; place all three together near entrances for maximum slow and damage stacking on any entering enemy.",
    ],
  },
  torbjorn: {
    ja: [
      "タレットのレベルアップ（ハンマー修理）を積極的に行うこと。レベル2タレットと放置タレットでは火力が大きく異なる。",
      "オーバーロード（アルティメット）は自分の攻撃力・移動速度・ハンマーダメージを上昇させる。タレットが壊された直後に使うと自分が前線戦力として活躍できる。",
      "タレットは敵が直接狙えない角度（角の死角）に設置すると破壊されにくく、長時間ダメージを出し続けられる。",
      "モルテンコア（溶岩弾）は近〜中距離で大ダメージを与えられる。接近戦での咄嗟の反撃手段として重要。",
    ],
    en: [
      "Actively hammer your turret to upgrade it to level 2 — the damage difference between a maintained level 2 and a neglected level 1 turret is substantial.",
      "Overload is Torbjörn's damage multiplier — after the turret dies, activate it immediately and fight aggressively rather than retreating to rebuild.",
      "Turret placement in dead-angle positions (behind corners, on perches enemies must actively look for) means it survives longer and deals far more total damage.",
      "Molten Core is a powerful melee-range threat; keep it in reserve for flankers who dive past your turret, not just for area denial on the objective.",
    ],
  },
  tracer: {
    ja: [
      "ブリンクのチャージ管理が最重要スキル。3チャージを一度に使い切らず、常に1〜2チャージを緊急離脱用に温存する習慣をつけよう。",
      "リコール（時間巻き戻し）はHPだけでなく弾薬も回復する。空撃ちしてからリコールすることでアモをリセットする使い方も有効。",
      "パルスボム（アルティメット）は直接当てた場合のダメージが爆発ダメージより大きい。タンクや動きの遅い大型ヒーローに貼り付けよう。",
      "一点を攻め続けると予測されやすい。攻撃ルートを毎回変えて、敵の照準を常にずらしてから次のダッシュに移行する。",
    ],
    en: [
      "Blink management is Tracer's hardest fundamental — never use all three charges at once; always hold 1-2 charges for emergency escape when a fight turns against you.",
      "Recall restores ammo as well as HP — deliberately empty your clip before recalling to gain a free reload on top of the health restoration.",
      "Pulse Bomb deals more damage as a direct stick than from the explosion alone; target large or slow-moving enemies (tanks, Bastion) for the most reliable sticks.",
      "Vary your attack angle every skirmish — approaching from the same direction repeatedly makes you predictable and allows enemies to pre-aim your next dive.",
    ],
  },
  vendetta: {
    ja: [
      "暗殺系のスタイルを持つダメージヒーローとして、孤立した高価値ターゲット（ヒーラー、スナイパー）を最優先に狙うことが役割の核心。",
      "移動アビリティと攻撃を組み合わせたコンボが安定したキルを生む。コンボの始動から完結までのフローを繰り返し練習しよう。",
      "退路を確保してからエンゲージすること。トランスロケーターや移動スキルがあるなら必ず使えるタイミングまで温存する。",
      "同じルートを繰り返すと読まれやすい。毎アプローチでルートを変えて、敵が照準を先読みできない状況を作り続けよう。",
    ],
    en: [
      "As an assassin-archetype damage hero, Vendetta's highest value comes from eliminating isolated high-priority targets — supports and lone backliners are the primary focus.",
      "Ability-chain combos are the core skill: practice the sequence from initiation to kill so it becomes consistent enough to execute under pressure.",
      "Always have an escape route planned before committing to an engagement — if the target's team is nearby, the dive becomes a feed unless you can immediately disengage.",
      "Vary your approach route each engagement; repeating the same flank path telegraphs your location and allows enemies to pre-position against you.",
    ],
  },
  venture: {
    ja: [
      "ドリルダッシュで地中に潜ることで敵の射線を完全に切れる。ピンチの時の緊急離脱や、奇襲のアプローチに活用しよう。",
      "コアサージ（アルティメット）は敵の密集を散らす強制デバフ効果がある。拠点制圧中の敵に当てると有効なゾーン崩しになる。",
      "地中からの浮上位置を変えることで敵に位置を読まれにくくなる。同じ場所から繰り返し出ると狙われやすい。",
      "近距離での爆発スプラッシュを重視して立ち回ること。距離が近いほど単発の全弾が当たりやすくなりダメージ効率が向上する。",
    ],
    en: [
      "Burrow removes you from the field entirely, blocking all incoming damage — use it to dodge ultimates and lethal burst combos, not just to reposition offensively.",
      "Clobber's knockup creates a brief airborne window where enemies can't escape; follow it immediately with a Drill Dash or full shotgun unload to convert the stun into a kill.",
      "Vary your Burrow entry and exit positions; emerging from the same spot repeatedly makes your resurfacing angle predictable and easy to pre-aim.",
      "Venture excels in mid-range brawling where all pellets from the Ranger connect — move into the optimal distance bracket before opening fire for maximum consistency.",
    ],
  },
  widowmaker: {
    ja: [
      "グラップリングフック後の着地ポジションを事前に把握してから使うこと。使用後は長いクールダウンがあるため慎重に使う。",
      "ヴェノムマインは情報収集ツールとして非常に有効。フランクルートの入り口に設置し、敵の迂回ルートを常時監視しよう。",
      "フルチャージ（右クリック）は頭に当てると一撃必殺になる場合が多い。チャージ時間を意識してスコープを外さないトレーニングを積もう。",
      "射線を取り続けると位置が特定されて潰しに来られる。一発当てたら素早くポジションを変えて次の射線を取ることが重要。",
    ],
    en: [
      "Plan your Grappling Hook destination before firing it — the long cooldown after use means landing in a bad spot leaves you stranded with no escape.",
      "Venom Mine is a vision tool as much as a damage tool; place it on flanking routes to gain wallhack detection on enemies approaching your position from unexpected angles.",
      "Fully charged headshots are Widowmaker's core output — practice holding scope through uncertainty rather than rushing shots; a missed full-charge is worse than a half-charge hit.",
      "Don't stay in one spot after shooting — reposition immediately after each kill or near-miss to prevent enemies from triangulating your location and diving or rushing your sniper nest.",
    ],
  },
  winston: {
    ja: [
      "ジャンプパックはダイブ開始の合図としてチームへ宣言することが重要。単独ダイブは返り討ちになりやすい。",
      "バリアプロジェクター（バブル）は自分とターゲットを囲む形で使い、サポートから切り離した状態で対面を作ることが基本。",
      "プライマルレイジ（アルティメット）はタンクやDPSには効きにくい。壁際や崖に敵を追い込んで落とすか、弱体化したヒーラーを仕留める用途に使おう。",
      "テスラキャノンは遮蔽物を使っている敵にも一定ダメージを当てられる。バリアの裏にいる敵を削る手段として積極的に使おう。",
    ],
    en: [
      "Always call out your Jump Pack target before diving — a coordinated dive with your damage heroes is devastating; a solo dive into a full team is a feeding opportunity for the enemy.",
      "Barrier Projector traps both Winston and his target inside; use it specifically to cut supports off from their peel opportunity and force a 1v1 against an isolated enemy.",
      "Primal Rage is best used for environmental kills and securing wounded targets — don't expect to full-combo-kill healthy tanks or high-HP heroes with it.",
      "Tesla Cannon arcs through barriers and hits multiple targets simultaneously; use it to chip enemies hiding behind Reinhardt shields rather than attacking from the front.",
    ],
  },
  "wrecking-ball": {
    ja: [
      "グラップリングクロー（ボール形態の振り回し）でのモーメンタムが最大の武器。速度が乗った状態でのノックバックはほぼ回避不能。",
      "アダプティブシールドはノックバックで敵を多く巻き込むほど多くのシールドを獲得する。密集した集団に突入してから発動するのが最適。",
      "デストラクションマトリックス（アルティメット）は地雷を多数展開する。客観付近や拠点上に設置して敵のポジションを制限しよう。",
      "ピロングラブルクロー（パイルドライバー）は高所から落下して使うとスタン範囲と効果時間が増加する。ボール形態で高所を経由してから発動しよう。",
    ],
    en: [
      "Ball form momentum is Wrecking Ball's primary weapon — build maximum speed with the grapple before impacting enemies; a slow-moving ball deals minimal knockback.",
      "Adaptive Shield generates more shields per enemy hit — dive into the densest cluster of enemies before activating to maximize the shield generation and survive longer.",
      "Minefield ultimate denies large areas when spread across objectives and corridors — placement around the objective forces enemies to choose between taking damage or abandoning their position.",
      "Pile Driver's stun duration and range increase when dropping from height — grapple to elevation, then drop directly down onto grouped enemies for the maximum area impact.",
    ],
  },
  wuyang: {
    ja: [
      "中国の伝統をモチーフとした固有のアビリティを活かし、チームのスペース確保と維持を意識した立ち回りを取ろう。",
      "回復のリソースを効率的に使い、最も危険な状況の仲間を優先的に回復することで試合の維持力を最大化する。",
      "敵のフランカーに対する防衛アビリティがある場合はそれを温存し、孤立して狙われた瞬間に使えるように心がけよう。",
      "アルティメットは試合の折り返しポイント（拠点取得・ペイロード最終区間）で使うと最大の貢献が生まれる。",
    ],
    en: [
      "Wuyang's thematic kit likely rewards rhythmic, deliberate healing patterns — learn the cooldown cadence and heal continuously rather than reacting to emergencies.",
      "Prioritize healing the teammates most likely to die in the next five seconds over topping off already-healthy allies.",
      "If Wuyang has a defensive self-ability, save it for flanker encounters specifically rather than spending it on repositioning.",
      "Ultimate timing on objective fights and final payload pushes is where a support's impact is highest — hold it for those decisive moments.",
    ],
  },
  zarya: {
    ja: [
      "バブルのタイミングが最重要スキル。「今から大ダメージを受ける」瞬間に合わせて使うことでエネルギーを最大効率で溜められる。",
      "グラビトンサージ（アルティメット）は単独で使わない。メイのブリザードやシグマのフラックス、ジャンクラットのRIPタイヤと連携することで試合を決める。",
      "エネルギーが60%を超えると火力が大幅に増加する。序盤からバブルを積極的に使い、高エネルギーを維持することを優先しよう。",
      "自分のバブルより味方へのプロジェクトバブルの使い方の方が難しい。狙われている味方を見つけたら先回りしてすぐに使えるよう準備しておく。",
    ],
    en: [
      "Bubble timing against incoming burst is the entire skillset — anticipate damage (not react to it) so the Particle Barrier absorbs the maximum possible energy per charge.",
      "Graviton Surge should never be used alone; pre-communicate with Mei, Sigma, or Junkrat so follow-up ultimate fires within 0.5 seconds of the grav to prevent escape.",
      "At high energy levels (60%+), Zarya's particle cannon becomes one of the highest sustained DPS outputs in the game — invest early bubbles to reach that threshold quickly.",
      "Projected Barrier on allies is harder to time than self-Barrier; watch teammates' health bars and incoming enemy ults to identify the split-second before damage lands.",
    ],
  },
  zenyatta: {
    ja: [
      "ディスコードオーブは最重要アビリティ。チームが集中砲火できるターゲットに常に貼り続けることで、チームの総ダメージ量を数十パーセント引き上げられる。",
      "トランセンデンス（アルティメット）の判断力が勝敗を分ける。大アルティメット（グラビトン・デスブロッサム等）が来る瞬間を見極めて合わせるのが最重要。",
      "ゼニャッタ自身の移動アビリティはない。フランカーへの対処は味方への誘導か、近くにいる間に足で距離を取るしかない。ポジション選択が生存の全て。",
      "ハーモニーオーブ（回復）は最も体力の低い味方に自動で付与してから次のターゲットへ移す。常にオーブが誰かに付いている状態を維持すること。",
    ],
    en: [
      "Discord Orb is Zenyatta's most impactful tool — always keep it on the highest-priority kill target to amplify your entire team's damage output by 25% on that target.",
      "Transcendence counter-ultimate timing is the highest-skill decision Zenyatta makes; identify the enemy ultimate before it lands and activate just as the burst begins.",
      "Zenyatta has no mobility ability — positioning is everything for survival. Stay near cover and teammates, and preemptively identify flanking routes before fights start.",
      "Keep Harmony Orb bouncing between the most injured teammates rather than leaving it on one person indefinitely; constant orb rotation maximizes effective healing per second.",
    ],
  },
};

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
      "タンクの本質は「ダメージを受け止める壁」になることではなく、他のロールでは踏み込めない危険な空間を確保・制圧することです。危険な角度に圧をかけ続けることで敵にその脅威を意識させ、結果としてダメージやサポートが安全に動ける状況を作り出します。タンクは総じて高いHPと強力な防御アビリティを持ちますが、それは「盾になって耐える」ためではなく、空間を取るための道具です。ボイスチャットでの密な連携よりも、どの角度なら安全に踏み込めるか、いつ引くべきかを自分で判断する力の方が重要です。多くのサポートは戦闘中は敵への応急処置（トリアージ）に手一杯で、常にタンクを回復し続けられるわけではありません。",
    positioning:
      "立ち位置はヒーローやマッチアップによって大きく変わり、「常に敵と味方の間に一直線で立つ」という単純な話ではありません。Reinhardtのようなブロウル系タンクは特定の角度を確保して圧をかけるのが役割であり、単に敵と味方の間に突っ立つことではありません。OrisaやRamattraのようなポーク・遠距離型のタンクが相手だと、正面から一直線に組み合う戦い方は不利になりやすく、スパムダメージや機動力の高いヒーローが多いマップでも通用しにくくなります。味方の位置を把握し、孤立する前に引く判断は大切ですが、戦闘中にサポートから常に回復してもらえることは期待しないこと。今のヒール量では、タンクはHPやクールダウンを一度の価値ある交戦に使い切り、次の戦闘までの間に回復する立ち回りが基本です。",
    strengths: [
      "高いHPと防御アビリティで、他のロールでは生き残れない危険な空間を確保できる",
      "味方のためのスペースを作り出す",
      "アルティメットで試合の流れを変えられる",
      "存在そのものが敵に対応を強制し、チームに時間と空間の余裕を生む",
    ],
    weaknesses: [
      "回復は基本的に戦闘の合間のためのもの。戦闘中に頼ろうとすると味方のリソースを無駄にする",
      "単独行動では狙われやすい",
      "間違った角度に踏み込むと、HPとクールダウンだけでなく試合の流れごと相手に渡してしまう",
      "高火力・高機動のダメージヒーローに弱い場合がある",
    ],
    tips: [
      "回復してもらえることを前提にせず、自分の判断だけで勝てる交戦かどうかを見極めてから踏み込もう。",
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
      "Tanks lead by contesting space the rest of the team can't take alone — not by standing still and soaking damage as a wall for allies to hide behind. Pressuring a dangerous angle forces the enemy to respect the threat you represent, which is what actually lets your damage and support operate safely. Tanks generally have large health pools and strong defensive tools, but those exist to let you take space, not to make you a stationary shield. Reading which angle you can hold — and when to pull out — matters far more than constant voice comms with your supports, most of whom are busy triaging the fight rather than actively topping you up.",
    positioning:
      "Where you position depends heavily on the tank and the matchup, not a fixed front-to-back rule. Brawl tanks like Reinhardt want to hold a specific angle and pressure it — not simply stand between the enemy and your team. Against dive- or poke-heavy compositions (Orisa, Ramattra, mobile flankers), playing straight front-to-back plays into their strengths and loses on most maps. Track your team's position and disengage before you're isolated, but don't expect your supports to keep you topped up mid-fight — with healing output reduced across the board, most tanks are meant to spend their HP and cooldowns on a trade and recover between fights, not during them.",
    strengths: [
      "Large health pools and defensive cooldowns that let you contest space other roles can't survive in",
      "Creates space and draws focus fire away from squishier teammates",
      "Ultimate abilities can decisively swing team fights",
      "Presence alone forces the enemy team to play around you, buying space and time for your team",
    ],
    weaknesses: [
      "Healing is mostly meant to top you up between fights, not during them — expecting emergency heals mid-fight wastes your supports' resources",
      "Overextending solo leads to quick elimination",
      "Committing to the wrong angle can cost your HP and cooldowns and swing the fight against your team",
      "High-mobility damage heroes can outmaneuver slow tanks",
    ],
    tips: [
      "Commit to space when you can win the trade on your own terms — not because you're hoping for a heal to bail you out.",
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
