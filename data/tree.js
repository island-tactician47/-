// 技術ツリー（ノード）。設計は docs/技術ツリーとゴールの設計.md。file:// で開けるよう代入形式。
// Tier 2 の素材（化学・製鋼・アルミ・窯業・非鉄・製材・製紙）は、同じ条件（旧ティア3：製油所の稼働＋精製品の累計売上）でいっしょに開く。
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
//   x・color：技術ツリーの図での横の位置（図の幅 1700 の中の中心）と、このノードから出る線の色
// }
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.tree = {
  config: {
    // 解放権：会社全体の直近12か月の利益（名目）が、この額を超えるたびに1枚。一度もらった枚数は減らない
    ticketSteps: [150000, 190000, 230000, 290000, 370000, 460000, 570000, 720000, 890000, 1120000, 1400000, 1750000, 2180000, 2730000, 3410000, 4260000, 5330000, 6660000, 8330000, 10410000, 13010000, 16260000],   // 150k から 1.25倍ずつ22段（全部のノードを開くのに要る枚数はおよそ22枚：Tier 3 が5・Tier 4 が6・Tier 5 が8・コロニー3）。値は仮：バランスのボットで調整
    // 輸入の罰：加工設備が原料を市場から買った（自動購入）とき、その製品のノードの Tier が3以上なら、買った原料の価値の割合ぶんだけ手数料を引く。
    //   手数料＝(1−比)×その工場の粗利（原料を自社の在庫で賄ったときの、売上−原料−操業費）×生産量×買った割合。全部を輸入すると、利益が自前のときの「比」になる。Tier 1〜2 は罰なし
    importRatio: { 3: 0.5, 4: 0.3, 5: 0.3, 6: 0.8 },
    supplyMonths: 3,          // 選択権：直近3か月の実績の平均で、輸入なしで回る余剰を測る
    supplyModules: 0,         // 必要な量：その設備に、増設モジュールを何個付けて全開で回す量か（0＝増設なしの1基。上限は map.js の modules.max）
    supplyFactor: 1.0,        // 必要な量にかける係数（バランス調整用）
    colonyReveal: { node: 'colony', tier: 5, count: 4 }   // 例外：コロニーは Tier 5 のうち4つが開いたら描く
  },
  nodes: {
    refinery:  { x: 1300, color: '#6b7b8c', name: '精製所',       icon: '🏭', tier: 1, legacyTier: 2, auto: true, needs: [] },
    chem:      { x: 1300, color: '#6a4c93', name: '化学',         icon: '⚗️', tier: 2, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['chemPlant', 'warehouse_bulk', 'warehouse_goods', 'powerPlant'], recipes: ['plastic', 'rubber', 'surfactant', 'fiber'], resources: ['plastic', 'rubber', 'surfactant', 'fiber'] },
    steel:     { x: 610, color: '#3d5a80', name: '製鋼',         icon: '🔩', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['steelMill'], recipes: ['steel', 'alloy'], resources: ['steel', 'ironore', 'coal', 'alloy', 'rareMetal'] },
    aluminum:  { x: 840, color: '#2a9d8f', name: 'アルミ',       icon: '🥫', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['aluminumSmelter'], recipes: ['aluminum'], resources: ['aluminum', 'bauxite'] },
    kiln:      { x: 380, color: '#c08a2e', name: '窯業',         icon: '🧱', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['kiln'], recipes: ['glass', 'cement', 'silicon'], resources: ['glass', 'cement', 'limestone', 'silica', 'silicon'] },
    copper:    { x: 1070, color: '#c1553b', name: '非鉄',         icon: '🔶', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['copperSmelter'], recipes: ['copper', 'lithium'], resources: ['copper', 'copperore', 'lithium', 'lithiumOre'] },
    sawmill:   { x: 150, color: '#8b6b3a', name: '製材',         icon: '🪵', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['sawmill'], recipes: ['lumber'], resources: ['lumber', 'logs'] },
    paper:     { x: 1520, color: '#9a8f6a', name: '製紙',         icon: '📄', tier: 2, legacyTier: 3, auto: true, needs: ['chem'],
                 buildings: ['paperMill'], recipes: ['paper'], resources: ['paper'] },
    fine:      { x: 1000, color: '#8a6d3b', name: '精密化学',     icon: '🧪', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['fineChemPlant'], recipes: ['pharmaMat'], resources: ['pharmaMat'], supply: { building: 'fineChemPlant', recipe: 'pharmaMat' } },
    explo:     { x: 1190, color: '#b5334a', name: '火薬',         icon: '💥', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['explosivesFactory'], recipes: ['explosive'], resources: ['explosive', 'naturalGas'], supply: { building: 'explosivesFactory', recipe: 'explosive' } },
    detergent: { x: 1380, color: '#6bb3d9', name: '洗剤・化粧品', icon: '🧴', tier: 3, legacyTier: 3, tickets: 1, needs: ['chem'],
                 buildings: ['detergentFactory'], recipes: ['detergent'], resources: ['detergent'] },
    clothing:  { x: 1560, color: '#d98ba0', name: '衣料',         icon: '👕', tier: 3, legacyTier: 4, tickets: 1, needs: ['chem'],
                 buildings: ['garmentFactory'], recipes: ['clothing'], resources: ['clothing'] },
    buildmat:  { x: 250, color: '#4d6fa3', name: '建材',         icon: '🏗️', tier: 3, legacyTier: 4, tickets: 1, needs: ['sawmill', 'kiln', 'steel'],
                 buildings: ['buildmatFactory'], recipes: ['buildmat'], resources: ['buildmat'] },
    car:       { x: 480, color: '#7a4f9a', name: '自動車',       icon: '🚗', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'kiln', 'copper'],
                 buildings: ['carFactory'], recipes: ['car'], resources: ['car'] },
    ship:      { x: 720, color: '#444444', name: '造船',         icon: '🚢', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'copper'],
                 buildings: ['shipyard'], recipes: ['ship'], resources: ['ship'] },
    pharma:    { x: 1000, color: '#2e4057', name: '製薬',         icon: '💊', tier: 4, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['fine', 'kiln'],
                 buildings: ['pharmaFactory'], recipes: ['pharma'], resources: ['pharma'] },
    semi:      { x: 1250, color: '#1d1d1d', name: '半導体',       icon: '💾', tier: 4, legacyTier: 6, tickets: 2, needs: ['kiln', 'copper'],
                 buildings: ['semiconductorFactory'], recipes: ['semiconductor'], resources: ['semiconductor'] },
    pc:        { x: 250, color: '#66a182', name: 'PC',           icon: '💻', tier: 5, legacyTier: 6, tickets: 2, needs: ['semi', 'chem', 'kiln', 'aluminum'],
                 buildings: ['pcFactory'], recipes: ['pc'], resources: ['pc'] },
    ev:        { x: 520, color: '#00798c', name: 'EV・電池',     icon: '🔋', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'copper', 'semi'],
                 buildings: ['evFactory'], recipes: ['ev'], resources: ['ev'] },
    aircraft:  { x: 790, color: '#edae49', name: '航空機',       icon: '✈️', tier: 5, legacyTier: 6, tickets: 2, needs: ['aluminum', 'steel', 'semi', 'chem', 'copper'],
                 buildings: ['aircraftFactory'], recipes: ['aircraft'], resources: ['aircraft'] },
    weapon:    { x: 1060, color: '#8d6a9f', name: '兵器',         icon: '🎖️', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo'],
                 buildings: ['munitionsFactory'], recipes: ['weapon'], resources: ['weapon'] },
    // 最後の工場：船・航空機・半導体以外のすべての最終製品と合金が材料（半導体は数えない。ただし PC・EV・兵器・ロケットの前提なので、結局開く）
    colony:    { x: 790, color: '#c28a1e', name: '宇宙コロニー', icon: '🛰️', tier: 6, tickets: 3, needs: ['steel', 'pharma', 'pc', 'ev', 'weapon', 'rocket', 'car', 'buildmat', 'detergent', 'clothing', 'paper'],
                 buildings: ['colonyFactory'], recipes: ['colony'], resources: ['colony'] },
    rocket:    { x: 1330, color: '#d1495b', name: 'ロケット',     icon: '🚀', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo', 'aluminum'],
                 buildings: ['rocketFactory'], recipes: ['rocket'], resources: ['rocket'] },
  }
};
// ゴール：年末（12月の決算）に、その年の純利益が「コロニー1基（年1基）を全部自前で作って売ったときの年間利益」の profitMultiplier 倍以上で、コロニーを1基完成させていれば達成（期限なし。続けて遊べる）。達成時にスコアとランクを出す。
// スコア（0〜100）＝ 早さ×weights.speed ＋ 自己資本比率×weights.equity ＋ 営業利益率×weights.margin − 減点。
//   早さ：創業からの年数（難易度の speedOffset 年ぶん甘くして）が speedBest 年なら100、speedWorst 年以上なら0（その間は直線）
//   自己資本比率：資本÷資産（0〜100%）／営業利益率：直近12か月の営業利益÷売上（marginFull で100点）
//   減点：債務の再編を使った（restructurePenalty）、当座貸越の借り増しをした月（月ごとに overdraftPenaltyPerMonth、最大 overdraftPenaltyMax）
// コロニーは、1基の材料を、そのまま市場で売ったときの利益のおよそ2倍の利益になるように、価格・費用を決めた（tools/calibrate_recipes.py）。
GAME_DATA.goal = {
  profitMultiplier: 1.5,   // ゴールの金額＝コロニー1基（年1基）を材料まで全部自前で作って売ったときの年間利益×この倍率（Engine.colonyChainProfit1950）
  speedBest: 25, speedWorst: 70, speedOffset: { rich: 0, tight: 5, indebted: 10 },
  weights: { speed: 0.5, equity: 0.25, margin: 0.25 }, marginFull: 0.30,
  restructurePenalty: 10, overdraftPenaltyPerMonth: 2, overdraftPenaltyMax: 15,
  ranks: [{ min: 85, rank: 'S', title: '宇宙企業' }, { min: 70, rank: 'A', title: '世界企業' }, { min: 55, rank: 'B', title: '国内大手' }, { min: 40, rank: 'C', title: '地方の雄' }, { min: 0, rank: 'D', title: '町工場' }]
};
