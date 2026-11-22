// 技術ツリー（ノード）。設計は docs/技術ツリーとゴールの設計.md。file:// で開けるよう代入形式。
// 時代（ティア）をノードに置き換える：ノードの tier は 1〜6（数字が大きいほど先端）。
// GAME_DATA.tree.nodes[id] = {
//   name, icon, tier,
//   needs:     前提の（素材）ノードのid。すべて開いていて、かつ輸入なしで回る余剰があると「選べる」（選択権）。Tier 3+ の判定に使う
//   buildings / recipes / resources：このノードが開くと使える設備・レシピ・品目（ここに無いものは最初から使える）
//   legacyTier：旧ティア（era）の番号。移行期の互換（unlockTier(s,t)＝legacyTier ≤ t のノードをすべて開く）と、旧セーブの解放済みの判定に使う
//   tickets：解放権の枚数（Tier 3+）。auto：自動で開く（Tier 1〜2。旧ティアの条件で開く）
//   supply：{ building, recipe }（選択権の量の基準：その設備を、増設モジュールをすべて付けて全開で回す量の入力）。省略時は buildings[0] とそのレシピ
//   legacyResearch：旧セーブでは研究が済んでいたときだけ開いた（旧ティアの到達では開かない）。移行の判定に使う
//   colony：最後のノード（Tier 5 のうち4つが開くまで画面に描かない。config.colonyReveal）
// }
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.tree = {
  config: {
    // 解放権：会社全体の直近12か月の利益（名目）が、この額を超えるたびに1枚。一度もらった枚数は減らない
    ticketSteps: [150000, 200000, 260000, 340000, 440000, 570000, 740000, 960000, 1250000, 1600000, 2100000, 2700000, 3500000, 4600000, 6000000, 7800000, 10000000, 13000000, 17000000, 22000000, 29000000, 37000000],   // 全部のノードを開くのに要る枚数はおよそ22枚（Tier 3 が5・Tier 4 が6・Tier 5 が8・コロニー3）。値は仮：バランスのボットで調整
    supplyMonths: 3,          // 選択権：直近3か月の実績の平均で、輸入なしで回る余剰を測る
    supplyModules: 0,         // 必要な量：その設備に、増設モジュールを何個付けて全開で回す量か（0＝増設なしの1基。上限は map.js の modules.max）
    supplyFactor: 1.0,        // 必要な量にかける係数（バランス調整用）
    revealDepth: 1,           // ノード画面：選べるノードの「一個次」まで描く（前提がすべて開いているノードまで）
    colonyReveal: { node: 'colony', tier: 5, count: 4 }   // 例外：コロニーは Tier 5 のうち4つが開いたら描く
  },
  nodes: {
    refinery:  { name: '精製所',       icon: '🏭', tier: 1, legacyTier: 2, auto: true, needs: [] },
    chem:      { name: '化学',         icon: '⚗️', tier: 2, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['chemPlant', 'warehouse_bulk', 'warehouse_goods', 'powerPlant'], recipes: ['plastic', 'rubber', 'surfactant', 'fiber'], resources: ['plastic', 'rubber', 'surfactant', 'fiber'] },
    steel:     { name: '製鋼',         icon: '🔩', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['steelMill'], recipes: ['steel', 'alloy'], resources: ['steel', 'ironore', 'coal', 'alloy', 'rareMetal'] },
    aluminum:  { name: 'アルミ',       icon: '🥫', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['aluminumSmelter'], recipes: ['aluminum'], resources: ['aluminum', 'bauxite'] },
    kiln:      { name: '窯業',         icon: '🧱', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['kiln'], recipes: ['glass', 'cement', 'silicon'], resources: ['glass', 'cement', 'limestone', 'silica', 'silicon'] },
    copper:    { name: '非鉄',         icon: '🔶', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['copperSmelter'], recipes: ['copper', 'lithium'], resources: ['copper', 'copperore', 'lithium', 'lithiumOre'] },
    sawmill:   { name: '製材',         icon: '🪵', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['sawmill'], recipes: ['lumber'], resources: ['lumber', 'logs'] },
    paper:     { name: '製紙',         icon: '📄', tier: 2, legacyTier: 4, auto: true, needs: ['chem'],
                 buildings: ['paperMill'], recipes: ['paper'], resources: ['paper'] },
    fine:      { name: '精密化学',     icon: '🧪', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['fineChemPlant'], recipes: ['pharmaMat'], resources: ['pharmaMat'], supply: { building: 'fineChemPlant', recipe: 'pharmaMat' } },
    explo:     { name: '火薬',         icon: '💥', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['explosivesFactory'], recipes: ['explosive'], resources: ['explosive', 'naturalGas'], supply: { building: 'explosivesFactory', recipe: 'explosive' } },
    detergent: { name: '洗剤・化粧品', icon: '🧴', tier: 3, legacyTier: 3, tickets: 1, needs: ['chem'],
                 buildings: ['detergentFactory'], recipes: ['detergent'], resources: ['detergent'] },
    clothing:  { name: '衣料',         icon: '👕', tier: 3, legacyTier: 4, tickets: 1, needs: ['chem'],
                 buildings: ['garmentFactory'], recipes: ['clothing'], resources: ['clothing'] },
    buildmat:  { name: '建材',         icon: '🏗️', tier: 3, legacyTier: 4, tickets: 1, needs: ['sawmill', 'kiln', 'steel'],
                 buildings: ['buildmatFactory'], recipes: ['buildmat'], resources: ['buildmat'] },
    car:       { name: '自動車',       icon: '🚗', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'kiln', 'copper'],
                 buildings: ['carFactory'], recipes: ['car'], resources: ['car'] },
    ship:      { name: '造船',         icon: '🚢', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'copper'],
                 buildings: ['shipyard'], recipes: ['ship'], resources: ['ship'] },
    pharma:    { name: '製薬',         icon: '💊', tier: 4, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['fine', 'kiln'],
                 buildings: ['pharmaFactory'], recipes: ['pharma'], resources: ['pharma'] },
    semi:      { name: '半導体',       icon: '💾', tier: 4, legacyTier: 6, tickets: 2, needs: ['kiln', 'copper'],
                 buildings: ['semiconductorFactory'], recipes: ['semiconductor'], resources: ['semiconductor'] },
    pc:        { name: 'PC',           icon: '💻', tier: 5, legacyTier: 6, tickets: 2, needs: ['semi', 'chem', 'kiln', 'aluminum'],
                 buildings: ['pcFactory'], recipes: ['pc'], resources: ['pc'] },
    ev:        { name: 'EV・電池',     icon: '🔋', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'copper', 'semi'],
                 buildings: ['evFactory'], recipes: ['ev'], resources: ['ev'] },
    aircraft:  { name: '航空機',       icon: '✈️', tier: 5, legacyTier: 6, tickets: 2, needs: ['aluminum', 'steel', 'semi', 'chem', 'copper'],
                 buildings: ['aircraftFactory'], recipes: ['aircraft'], resources: ['aircraft'] },
    weapon:    { name: '兵器',         icon: '🎖️', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo'],
                 buildings: ['munitionsFactory'], recipes: ['weapon'], resources: ['weapon'] },
    // 最後の工場：船と航空機以外のすべての最終製品と合金が材料（半導体を最終製品に数えるかは要確認）
    colony:    { name: '宇宙コロニー', icon: '🛰️', tier: 6, tickets: 3, needs: ['steel', 'semi', 'pharma', 'pc', 'ev', 'weapon', 'rocket', 'car', 'buildmat', 'detergent', 'clothing', 'paper'],
                 buildings: ['colonyFactory'], recipes: ['colony'], resources: ['colony'] },
    rocket:    { name: 'ロケット',     icon: '🚀', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo', 'aluminum'],
                 buildings: ['rocketFactory'], recipes: ['rocket'], resources: ['rocket'] },
  }
};
// ゴール：純資産（貸借対照表の資本＝現金＋在庫＋設備の評価額−借入）が target に届いたらクリア（期限なし。続けて遊べる）。達成時にスコアとランクを出す。
// スコア（0〜100）＝ 早さ×weights.speed ＋ 自己資本比率×weights.equity ＋ 営業利益率×weights.margin − 減点。
//   早さ：創業からの年数（難易度の speedOffset 年ぶん甘くして）が speedBest 年なら100、speedWorst 年以上なら0（その間は直線）
//   自己資本比率：資本÷資産（0〜100%）／営業利益率：直近12か月の営業利益÷売上（marginFull で100点）
//   減点：債務の再編を使った（restructurePenalty）、当座貸越の借り増しをした月（月ごとに overdraftPenaltyPerMonth、最大 overdraftPenaltyMax）
// 値は仮：バランスのボット（tools/selftest_balance.html）と、コロニーの稼ぎを見て調整する。
GAME_DATA.goal = {
  target: 1000000000,
  speedBest: 25, speedWorst: 70, speedOffset: { rich: 0, tight: 5, indebted: 10 },
  weights: { speed: 0.5, equity: 0.25, margin: 0.25 }, marginFull: 0.30,
  restructurePenalty: 10, overdraftPenaltyPerMonth: 2, overdraftPenaltyMax: 15,
  ranks: [{ min: 85, rank: 'S', title: '宇宙企業' }, { min: 70, rank: 'A', title: '世界企業' }, { min: 55, rank: 'B', title: '国内大手' }, { min: 40, rank: 'C', title: '地方の雄' }, { min: 0, rank: 'D', title: '町工場' }]
};
