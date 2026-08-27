/**
 * Original editorial strategy guide content for Overwatch 2 map game modes.
 * Authored independently for OW Tracker — not sourced from any external API.
 */

interface MapModeGuide {
  overview: string;
  attacker_tips: string[];
  defender_tips: string[];
  general_tips: string[];
  key_positions: string;
}

const GUIDES_JA: Record<string, MapModeGuide> = {
  control: {
    overview:
      "コントロールは中央の拠点を保持し、先に100%に到達したチームが各ラウンドを制するモードです。全3ラウンド制で、先に2ラウンド取得したチームが勝利します。拠点は試合開始後に出現し、どちらのチームも同じ位置から攻め込む対称型マップが多いです。押し引きの判断と、チームワークが勝負の鍵を握ります。",
    attacker_tips: [
      "拠点に最初に到達し、有利なポジションを先取する",
      "敵より多い人数で拠点に入ることで取得スピードを上げる",
      "拠点外から敵を排除してから踏み込む選択肢も有効",
    ],
    defender_tips: [
      "相手が拠点を踏み始める前にチョークポイントで止める",
      "高台からの圧力で拠点への侵入を阻む",
      "敵の到達前に強ポジションを取ることを意識する",
    ],
    general_tips: [
      "拠点を取得中は全員で守ることより、敵を排除することを優先する",
      "アルティメットのタイミングを拠点取得の瞬間に合わせると効果的",
      "チームがほぼ壊滅したらリスポーンを待ち、全員で再挑戦する",
      "ヘルスパックの位置を把握し、延命を図ること",
    ],
    key_positions: "拠点周辺の高台と、拠点に向かうメインルートのチョークポイントが最重要ポジションです。これらを制した側が試合を主導します。",
  },
  escort: {
    overview:
      "エスコートは攻撃チームがペイロード（荷物）をゴールまで護送し、防衛チームがそれを阻止するモードです。攻撃チームはペイロードの近くにいることで前進速度が上がります。時間切れになると敗北ですが、チェックポイントに到達するごとに制限時間がリセットされます。ペイロードを護衛しながら戦うことが攻撃側の最大の課題です。",
    attacker_tips: [
      "ペイロードは護送者数が多いほど速く進む — 戦いながら乗り続ける",
      "チェックポイントに到達するまでは過剰なリスクを避ける",
      "ペイロードが最終エリアに近いほど敵の防衛が固まるため早めの突破を目指す",
    ],
    defender_tips: [
      "ペイロードのルート上のコーナーや高台で待ち構える",
      "チェックポイント手前で足止めすることが最も重要",
      "タンクを倒してから残りを一掃するよりも、サポートを先に排除する戦略が効果的",
    ],
    general_tips: [
      "ペイロード周辺のヘルスパックを把握し、回復ルートとして活用する",
      "ペイロードの射線は独自の遮蔽物になることを忘れずに",
      "アルティメットは次のチェックポイント突破のタイミングに備えてためておく",
      "最終区間は防衛が最も固くなる — 一斉突撃よりも組織的な崩しを意識する",
    ],
    key_positions: "ペイロードの曲がり角（コーナー）と、チェックポイント直前の防衛ポジションが最も重要です。コーナーを先回りして制圧することで攻守ともに優位に立てます。",
  },
  hybrid: {
    overview:
      "ハイブリッドは「拠点の確保」と「ペイロードの護送」の2フェーズで構成されます。攻撃チームはまず特定の拠点を制圧し、その後ペイロードをゴールまで運ぶ必要があります。防衛チームは最初の拠点を死守するか、ペイロードの進行を食い止めることに集中します。2フェーズで求められる立ち回りが大きく変わるため、柔軟な対応が重要です。",
    attacker_tips: [
      "第1フェーズ（拠点確保）は全員で集中して速攻で取りに行く",
      "拠点取得後はすぐにペイロード護衛に意識を切り替える",
      "第2フェーズは制限時間が最初からあることを常に意識する",
    ],
    defender_tips: [
      "第1拠点での防衛が最も重要 — ここを落とすと一気に不利になる",
      "拠点を落とされた場合はペイロードルート沿いの強ポジに素早く移行する",
      "第2フェーズの防衛ライン（特に最終区間前）を事前に把握しておく",
    ],
    general_tips: [
      "第1フェーズと第2フェーズで求められるヒーロー構成が変わる場合がある",
      "フェーズが切り替わるタイミングは両チームともにリスポーンを整える好機",
      "拠点周辺のヘルスパックは第1フェーズ中に全員で把握しておく",
      "最終区間の防衛は横幅が広がる場合が多く、フランカーへの注意が必要",
    ],
    key_positions: "第1拠点のメインエントランスと、フェーズ切り替わり後のペイロード初動ポジションが鍵を握ります。この2点を制した側が試合全体をコントロールします。",
  },
  push: {
    overview:
      "プッシュは両チームが1台のロボット（BPT）を取り合い、より深く相手陣地へ押し込んだチームが勝利するモードです。ロボットの近くにいるチームの方向へロボットが進みます。どちらのチームも奪い返すことができるため、攻守が目まぐるしく入れ替わります。ロボットを渡さずに押し続けることが最大の目標です。",
    attacker_tips: [
      "ロボットの前方の敵を排除してからロボットと共に前進する",
      "ロボットを取り返された場合は即座に全員で奪還に動く",
      "ロボットが最終区間に近いほどジャンプポイントなどの抜け道を活用する",
    ],
    defender_tips: [
      "ロボットを奪った直後は全速力で押し込み、相手に立て直す時間を与えない",
      "ロボットの先の敵陣ポジションを先取りして移動速度の優位を活かす",
      "相手がリスポーンから戻る前にできる限り前進させる",
    ],
    general_tips: [
      "ロボットの現在位置を常に把握し、チームとして同じ方向を向いて動く",
      "両陣営のスポーン位置が試合中に変動するため、ルートを随時確認する",
      "アルティメットはロボット奪還のタイミングで使うと最大効果を発揮する",
      "延長戦は先にロボットを押し込んでいた側が有利 — 前半のリードが重要",
    ],
    key_positions: "マップ中央のロボット初期位置周辺の高台と、ロボットが進む通路の曲がり角が最重要地点です。高台から圧力をかけながらロボットを護衛するのが基本戦術です。",
  },
  flashpoint: {
    overview:
      "フラッシュポイントはマップ上に順番に出現する5か所の拠点を取り合い、先に5拠点を確保したチームが勝利するモードです。拠点はマップの各エリアに散らばっており、チームが分散して動く必要があります。1つの拠点を取り合っている間に、次の拠点の位置を把握しておくことが重要です。",
    attacker_tips: [
      "次に出現する拠点を予測し、先に移動して有利なポジションを取る",
      "広いマップを活用してフランクから拠点へ侵入する",
      "1拠点を失ってもすぐに次の拠点に全力で向かう",
    ],
    defender_tips: [
      "拠点に近い強ポジから敵の侵入を防ぐ",
      "1拠点目を落とした直後に次の拠点へ素早く移動して先手を取る",
      "チームの移動速度と機動力を重視したヒーロー構成が有利",
    ],
    general_tips: [
      "マップ全体の地理を早めに把握し、各拠点へのルートを覚える",
      "機動力の高いヒーロー（移動アビリティ持ち）が特に活躍しやすい",
      "チームが分散しすぎると各個撃破されるため、連携を意識する",
      "拠点取得中は素早く敵を掃討し、次の拠点へ即座に移動する準備をする",
    ],
    key_positions: "各拠点のメインアクセスポイントと、拠点を見下ろせる高台が優先ポジションです。マップの中央部を押さえることで複数の拠点への移動時間を短縮できます。",
  },
  clash: {
    overview:
      "クラッシュは5か所の拠点が一列に並んだマップで、攻守を繰り返しながら相手陣地の拠点まで制圧したチームが勝利するモードです。中央の1拠点から始まり、制圧するごとに次の拠点が解放されます。攻撃と防衛の役割が流動的に変わり、常に次のフェーズを見越した動きが求められます。",
    attacker_tips: [
      "現在の拠点を確保したら即座に次の拠点へ向けて前進する",
      "攻撃の勢いが乗っているときは敵に立て直す時間を与えない",
      "拠点ラインを超えたらフランクルートも活用して挟撃する",
    ],
    defender_tips: [
      "拠点ラインをできるだけ自陣側に留め、押し込まれないようにする",
      "拠点前の有利ポジション（高台・コーナー）を死守する",
      "アルティメットを次の防衛拠点のために温存するか即使用するかを判断する",
    ],
    general_tips: [
      "現在の拠点がどちらのチームに有利な地形かを把握する",
      "拠点の解放タイミングで両チームがリセットするため、構成変更のチャンスになる",
      "5拠点すべての位置とルートを事前に把握しておく",
      "防衛から攻撃に切り替わる瞬間の連携が勝負の分かれ目になりやすい",
    ],
    key_positions: "中央拠点（第3拠点）の制圧が試合全体の流れを決める最重要ポイントです。中央を早期に確保したチームがその後の試合展開を主導する傾向があります。",
  },
  stadium: {
    overview:
      "スタジアムはOverwatch 2の新しいゲームモードで、ラウンド制の戦闘形式をとります。各ラウンドの間にヒーローを強化するアビリティやパワーを購入・選択し、ラウンドが進むにつれて強化されたヒーローで戦います。先に一定ラウンドを取得したチームが勝利します。",
    attacker_tips: [
      "ラウンド間の強化選択が戦略の核心 — チーム全体のシナジーを意識して選択する",
      "序盤ラウンドで状況を把握し、後半に向けて構成を調整する",
      "強化ポイントをどのアビリティに割り振るかがチームの強みを決める",
    ],
    defender_tips: [
      "敵チームの強化方針を把握し、対抗できる選択をする",
      "チームとして一貫した強化方針を持つと相乗効果が生まれやすい",
      "終盤ラウンドに向けて強化の方向性を統一しておく",
    ],
    general_tips: [
      "スタジアムパワーのシナジーはキャラクターページで確認できる",
      "ラウンドをリードしても油断せず、強化選択に集中する",
      "ヒーローの立ち回り自体はスタジアムでも変わらない — 基本を大切に",
      "強化で変わる数値（ダメージ量・クールダウン短縮など）を意識した戦い方を心がける",
    ],
    key_positions: "スタジアムマップは試合ごとに変わるため、各ラウンドの地形を素早く把握し、強化内容に合ったポジショニングを取ることが重要です。",
  },
};

const GUIDES_EN: Record<string, MapModeGuide> = {
  control: {
    overview:
      "Control maps task both teams with capturing and holding a central objective until reaching 100%. Matches are played as a best-of-three series, with each round resetting to a neutral state. Because both teams approach from symmetric spawn points, the opening fight for the objective — and the positioning around it — determines momentum for the entire round.",
    attacker_tips: [
      "Arrive at the objective before the enemy to stake out strong off-angles",
      "More players standing on point accelerates the capture rate — fight on it, not around it",
      "Clear the immediate high ground before committing your full team onto the objective",
    ],
    defender_tips: [
      "Contest the objective or the choke leading to it before the enemy team arrives",
      "High ground around the point denies enemy sight lines and slows their push",
      "Rotate from cover to cover rather than fighting in the open approaches to point",
    ],
    general_tips: [
      "Prioritize eliminations over standing on point when the enemy is contesting — a dead enemy is worth more than a faster tick",
      "Time your ultimates to burst the enemy off the objective at a critical percentage",
      "When your team is wiped, wait for a full reset rather than trickling in one at a time",
      "Memorize health pack locations around the objective — they extend fights significantly",
    ],
    key_positions: "The elevated positions flanking the objective and the main choke point feeding into it are the two most contested areas on every Control map. Controlling the high ground above point essentially controls the fight.",
  },
  escort: {
    overview:
      "Escort maps require the attacking team to push a payload vehicle to the final checkpoint before time runs out. Attackers move the payload faster with more players standing on it. Each checkpoint reached resets the timer, giving the attackers renewed time to push to the next section. Defenders win by holding out until the clock expires.",
    attacker_tips: [
      "Stay on the payload while fighting — movement speed is a weapon on this mode",
      "Conserve risky ultimates until the checkpoint sprint, where you need sustained pressure",
      "The final section before the goal is always the hardest — use your best ultimates there",
    ],
    defender_tips: [
      "Hold corners and high ground along the payload route rather than fighting in the open",
      "Stopping the payload before a checkpoint is far more impactful than holding after it",
      "Focus enemy supports first — without healing, the attacker frontline collapses quickly",
    ],
    general_tips: [
      "The payload's physical body blocks line of sight — use it as cover when fighting near it",
      "Track health packs along the route; they're your lifeline on both sides",
      "Save at least one fight-winning ultimate for the final checkpoint approach",
      "The last section has the tightest geometry for defenders — expect coordinated flanks from attackers",
    ],
    key_positions: "Payload corners (where the route bends) and the elevated positions just before each checkpoint are the most critical areas. Teams that control these junctions control the pacing of the entire match.",
  },
  hybrid: {
    overview:
      "Hybrid maps combine a point-capture phase with a payload-escort phase. Attackers must first capture the objective, which then spawns the payload they need to escort to the goal. Defenders aim to hold the initial point as long as possible — losing it quickly compresses their time to defend the payload. The mid-match transition between phases often creates a window for aggressive attackers to press their advantage before defenders can reposition.",
    attacker_tips: [
      "Commit everything to the first point — a fast capture gives maximum time for the payload phase",
      "Transition to payload escort immediately after capping; don't over-rotate chasing kills",
      "Treat the payload escort with the same urgency as an escort-only map from the start",
    ],
    defender_tips: [
      "The first point is your most important defensive line — falling it early is extremely costly",
      "Have a retreat path planned before the point falls so you can anchor the payload route quickly",
      "Know the second-phase defense positions before you need them; improvising costs time",
    ],
    general_tips: [
      "Hero compositions may need to shift between Phase 1 and Phase 2 — plan ahead",
      "The phase transition gives both teams a brief reset window; use it to swap heroes if needed",
      "Health packs near the first objective are relevant in both phases — learn them early",
      "The final payload section typically opens into a wider arena, making flank routes more effective",
    ],
    key_positions: "The main entrance to the first objective and the payload's initial movement corridor after Phase 2 begins are the two most decisive areas. Teams that dominate these two positions dictate the tempo of the entire match.",
  },
  push: {
    overview:
      "Push maps feature a single robot (BPT) that travels toward whichever team currently controls it. Both teams start equidistant from the robot, and the team that pushes it furthest into the enemy side by the end of regulation wins. Crucially, control of the robot can flip instantly — a won team fight means the robot immediately reverses direction. This creates a back-and-forth dynamic unlike any other mode in Overwatch 2.",
    attacker_tips: [
      "Clear the enemy ahead of the robot before advancing — leading with the robot into a fight is dangerous",
      "After winning a fight, push the robot as far as possible before the enemy can respawn",
      "Use the robot's path knowledge to pre-position in forward areas the enemy must pass through",
    ],
    defender_tips: [
      "The moment you retake the robot, sprint it forward — time is everything",
      "Winning fights close to the enemy spawn wastes your push time; disengage and push farther",
      "Flank routes that circle ahead of the robot set up devastating crossfires",
    ],
    general_tips: [
      "Both teams' spawn points shift during the match — track where the enemy will respawn from",
      "Ultimates timed for robot retake fights are the highest-value use of resources in this mode",
      "Overtime follows whichever team was leading — even a small early lead is meaningful",
      "Mobile heroes (those with movement abilities) are especially strong in Push for rapid repositioning",
    ],
    key_positions: "The high-ground positions overlooking the robot's starting zone and the bends in the robot's travel path are the most contested areas. Holding the elevated angles above the robot while it moves is the foundation of effective Push play.",
  },
  flashpoint: {
    overview:
      "Flashpoint maps scatter five objectives across a large area. Both teams race to capture each new point as it spawns, and the first team to capture five total wins. Because objectives appear in different map zones, team mobility and map awareness are essential. The wide-open geography of Flashpoint maps rewards teams that can rapidly rotate between areas and arrive at new objectives before the enemy.",
    attacker_tips: [
      "Predict where the next objective will spawn and begin rotating while the current fight is resolving",
      "Flanking paths to objectives are wide on Flashpoint maps — use them to arrive from unexpected angles",
      "Losing one point is not fatal; immediately commit to the next one at full force",
    ],
    defender_tips: [
      "Strong high ground near each objective is the most important thing to contest",
      "After losing an objective, prioritize speed over caution getting to the next one",
      "Mobile hero compositions are critical — sluggish teams get outpaced on rotation",
    ],
    general_tips: [
      "Flashpoint maps are among the largest in the game — learn the full layout in your first few plays",
      "Heroes with strong movement abilities (mobility skills, speed boosts) have outsized value here",
      "Splitting the team to contest multiple zones is occasionally correct but risks being eliminated piecemeal",
      "After capturing a point, secure health packs in the area before the next objective spawns",
    ],
    key_positions: "Each objective's main approach ramp and the high ground directly above it are the primary contested positions. Teams that control the center of the map benefit from shorter rotation paths to any of the five objective locations.",
  },
  clash: {
    overview:
      "Clash maps feature five objectives arranged in a line from one team's base to the other. The match starts at the central (third) objective, and capturing it unlocks the next point deeper in the enemy territory. First team to capture all five wins. The dynamic shifts fluidly between offense and defense within a single match, requiring teams to adapt quickly when control of a point flips.",
    attacker_tips: [
      "After capturing a point, accelerate immediately toward the next objective before defenders reset",
      "Pressing the advantage during an enemy wipe is critical — don't let them regroup on the next point",
      "Flanking paths open up as you push deeper — use them to approach later objectives from multiple angles",
    ],
    defender_tips: [
      "Hold favorable terrain in front of each objective rather than retreating onto the point itself",
      "The further back you defend, the worse your position becomes — hold the forward line as long as possible",
      "Decide quickly whether to spend an ultimate now or save it for the next point's defense",
    ],
    general_tips: [
      "The center (third) objective is the most important single point — winning it gives strong map control",
      "Point control flips create natural moments to swap heroes; take advantage of the transition",
      "Learn all five objective positions and their approach paths before your first competitive match on the map",
      "The defense-to-attack transition moment (when your team captures) is often the most chaotic — stay together",
    ],
    key_positions: "The third (central) objective is the most strategically significant point on any Clash map. It serves as the fulcrum of the match — the team that captures and holds it first gains positioning advantage on the subsequent points in both directions.",
  },
  stadium: {
    overview:
      "Stadium is Overwatch 2's third-person round-based mode where both teams earn currency between rounds to upgrade their heroes with powerful Stadium Powers. Matches consist of multiple rounds, and the team that wins the required number of rounds first wins the match. Choosing the right upgrades and building synergistic power combinations is as important as individual combat skill.",
    attacker_tips: [
      "Coordinate your power purchases with teammates — combined upgrades create stronger synergy than solo builds",
      "Identify the enemy team's power direction early and adapt your choices to counter their strategy",
      "Spend currency efficiently in early rounds; falling behind on upgrades is difficult to recover from",
    ],
    defender_tips: [
      "If you hold early rounds, invest your advantage into upgrades that will compound your lead",
      "Team-wide upgrade consistency (everyone following a similar build path) outperforms individualism",
      "Understand which Stadium Powers counter the enemy's chosen upgrades",
    ],
    general_tips: [
      "Core hero mechanics remain unchanged — Stadium Powers enhance existing abilities rather than replacing them",
      "Hero stats pages on OW Tracker list each hero's available Stadium Powers and descriptions",
      "The third-person camera changes how fights feel; adjust your spatial awareness for sightlines",
      "Winning rounds while behind on upgrades is possible — prioritize efficient fights over extended skirmishes",
    ],
    key_positions: "Stadium map geometry varies per match rotation. The fundamental positioning principles (high ground control, choke point awareness, escape route maintenance) apply equally in Stadium regardless of the specific map being played.",
  },
};

export function getMapModeGuide(gamemode: string, lang: string): MapModeGuide | null {
  const guides = lang === "en" ? GUIDES_EN : GUIDES_JA;
  return guides[gamemode] ?? null;
}
