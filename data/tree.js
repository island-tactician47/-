// 技術ツリー（ノード）。設計は docs/技術ツリーとゴールの設計.md。file:// で開けるよう代入形式。
// 時代（ティア）をノードに置き換える：ノードの tier は 1〜6（数字が大きいほど先端）。
// GAME_DATA.tree.nodes[id] = {
//   name, icon, tier,
//   needs:     前提の（素材）ノードのid。すべて開いていて、かつ輸入なしで回る余剰があると「選べる」（選択権）。Tier 3+ の判定に使う
//   buildings / recipes / resources：このノードが開くと使える設備・レシピ・品目（ここに無いものは最初から使える）
//   legacyTier：旧ティア（era）の番号。移行期の互換（unlockTier(s,t)＝legacyTier ≤ t のノードをすべて開く）と、旧セーブの解放済みの判定に使う
//   tickets：解放権の枚数（Tier 3+）。auto：自動で開く（Tier 1〜2。旧ティアの条件で開く）
//   supply：{ building, recipe }（選択権の量の基準：その設備を、増設モジュールをすべて付けて全開で回す量の入力）。省略時は buildings[0] とそのレシピ
//   hidden：画面に出さないノード（旧ティアの互換のための設備置き場）
// }
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.tree = {
  config: {
    // 解放権：会社全体の直近12か月の利益（名目）が、この額を超えるたびに1枚。一度もらった枚数は減らない
    ticketSteps: [1000000, 3000000, 6000000, 10000000, 15000000, 22000000, 30000000, 40000000, 55000000, 75000000, 100000000, 140000000, 200000000],
    supplyMonths: 3,          // 選択権：直近3か月の実績の平均で、輸入なしで回る余剰を測る
    supplyFactor: 1.0,        // 必要な量にかける係数（バランス調整用。1＝増設モジュールを全部付けて全開）
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
    fine:      { name: '精密化学',     icon: '🧪', tier: 3, legacyTier: 6, tickets: 1, needs: ['chem'],
                 buildings: ['fineChemPlant'], recipes: ['pharmaMat'], resources: ['pharmaMat'], supply: { building: 'fineChemPlant', recipe: 'pharmaMat' } },
    explo:     { name: '火薬',         icon: '💥', tier: 3, legacyTier: 6, tickets: 1, needs: ['chem'],
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
    pharma:    { name: '製薬',         icon: '💊', tier: 4, legacyTier: 6, tickets: 2, needs: ['fine', 'kiln'],
                 buildings: ['pharmaFactory'], recipes: ['pharma'], resources: ['pharma'] },
    semi:      { name: '半導体',       icon: '💾', tier: 4, legacyTier: 6, tickets: 2, needs: ['kiln', 'copper'],
                 buildings: ['semiconductorFactory'], recipes: ['semiconductor'], resources: ['semiconductor'] },
    pc:        { name: 'PC',           icon: '💻', tier: 5, legacyTier: 6, tickets: 2, needs: ['semi', 'chem', 'kiln', 'aluminum'],
                 buildings: ['pcFactory'], recipes: ['pc'], resources: ['pc'] },
    ev:        { name: 'EV・電池',     icon: '🔋', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'copper', 'semi'],
                 buildings: ['evFactory'], recipes: ['ev'], resources: ['ev'] },
    aircraft:  { name: '航空機',       icon: '✈️', tier: 5, legacyTier: 6, tickets: 2, needs: ['aluminum', 'steel', 'semi', 'chem', 'copper'],
                 buildings: ['aircraftFactory'], recipes: ['aircraft'], resources: ['aircraft'] },
    weapon:    { name: '兵器',         icon: '🎖️', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'semi', 'explo'],
                 buildings: ['munitionsFactory'], recipes: ['weapon'], resources: ['weapon'] },
    rocket:    { name: 'ロケット',     icon: '🚀', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'semi', 'explo', 'aluminum'],
                 buildings: ['rocketFactory'], recipes: ['rocket'], resources: ['rocket'] },
    // 旧ティアの互換：研究棟（廃止予定。設備だけ旧ティア5で開く。画面には出さない）
    research:  { name: '研究棟', icon: '🔬', tier: 4, legacyTier: 5, hidden: true, needs: [], buildings: ['researchLab'] }
  }
};
