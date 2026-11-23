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
//   x・color：技術ツリーの図での横の位置（図の幅 約2200 の中の中心）と、このノードから出る線の色
// }
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.tree = {
  config: {
    // 解放権：会社全体の直近12か月の利益（名目）が、この額を超えるたびに1枚。一度もらった枚数は減らない
    ticketSteps: [150000, 190000, 230000, 290000, 370000, 460000, 570000, 720000, 890000, 1120000, 1400000, 1750000, 2180000, 2730000, 3410000, 4260000, 5330000, 6660000, 8330000, 10410000, 13010000, 16260000, 18700000, 21500000, 24730000, 28440000, 32700000, 37610000, 43250000, 49740000, 57200000, 65780000, 75650000, 87000000, 95700000, 105270000, 115800000, 127380000],   // 150k から 1.25倍ずつ22段（約1626万ドル）、そのあと1.15倍ずつ12段（約8700万ドル）、さらに1.1倍ずつ4段（約1億2738万ドル）、計38段。インフレ（年1.5%）で名目の利益が増える前提。コロニー経路は約22枚、AI防衛システム経路は約23枚、ゴールの条件の両方を開くと約36枚。値は仮：バランスのボットで調整（インフレなしだと後半の段は届かない：進捗メモのチェックポイント58）
    // 輸入の罰：加工設備が原料を市場から買った（自動購入）とき、その製品のノードの Tier が3以上なら、買った原料の価値の割合ぶんだけ手数料を引く。
    //   手数料＝(1−比)×その工場の粗利（原料を自社の在庫で賄ったときの、売上−原料−操業費）×生産量×買った割合。全部を輸入すると、利益が自前のときの「比」になる。Tier 1〜2 は罰なし
    importRatio: { 3: 0.5, 4: 0.5, 5: 0.5, 6: 0.8 },
    supplyMonths: 3,          // 選択権：直近3か月の実績の平均で、輸入なしで回る余剰を測る
    supplyModules: 0,         // 必要な量：その設備に、増設モジュールを何個付けて全開で回す量か（0＝増設なしの1基。上限は map.js の modules.max）
    supplyFactor: 1.0,        // 必要な量にかける係数（バランス調整用）
    finalProducts: ['colony', 'offshore', 'aiDefense'],   // 最終プロジェクトの品目（材料に船・航空機を使わない等のデータ検査の対象）。ゴールの条件に要るのは goal.projects（コロニーとAI防衛システムを1基ずつ）
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
    fine:      { x: 850, color: '#8a6d3b', name: '精密化学',     icon: '🧪', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['fineChemPlant'], recipes: ['pharmaMat'], resources: ['pharmaMat'], supply: { building: 'fineChemPlant', recipe: 'pharmaMat' } },
    explo:     { x: 1850, color: '#b5334a', name: '火薬',         icon: '💥', tier: 3, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['chem'],
                 buildings: ['explosivesFactory'], recipes: ['explosive'], resources: ['explosive', 'naturalGas'], supply: { building: 'explosivesFactory', recipe: 'explosive' } },
    detergent: { x: 1350, color: '#6bb3d9', name: '洗剤・化粧品', icon: '🧴', tier: 3, legacyTier: 3, tickets: 1, needs: ['chem'],
                 buildings: ['detergentFactory'], recipes: ['detergent'], resources: ['detergent'] },
    clothing:  { x: 1600, color: '#d98ba0', name: '衣料',         icon: '👕', tier: 3, legacyTier: 4, tickets: 1, needs: ['chem'],
                 buildings: ['garmentFactory'], recipes: ['clothing'], resources: ['clothing'] },
    buildmat:  { x: 1100, color: '#4d6fa3', name: '建材',         icon: '🏗️', tier: 3, legacyTier: 4, tickets: 1, needs: ['sawmill', 'kiln', 'steel'],
                 buildings: ['buildmatFactory'], recipes: ['buildmat'], resources: ['buildmat'] },
    car:       { x: 1225, color: '#7a4f9a', name: '自動車',       icon: '🚗', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'kiln', 'copper'],
                 buildings: ['carFactory'], recipes: ['car'], resources: ['car'] },
    ship:      { x: 1725, color: '#444444', name: '造船',         icon: '🚢', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'copper'],
                 buildings: ['shipyard'], recipes: ['ship'], resources: ['ship'] },
    pharma:    { x: 975, color: '#2e4057', name: '製薬',         icon: '💊', tier: 4, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['fine', 'kiln'],
                 buildings: ['pharmaFactory'], recipes: ['pharma'], resources: ['pharma'] },
    semi:      { x: 1475, color: '#1d1d1d', name: '半導体',       icon: '💾', tier: 4, legacyTier: 6, tickets: 2, needs: ['kiln', 'copper'],
                 buildings: ['semiconductorFactory'], recipes: ['semiconductor'], resources: ['semiconductor'] },
    pc:        { x: 975, color: '#66a182', name: 'PC',           icon: '💻', tier: 5, legacyTier: 6, tickets: 2, needs: ['semi', 'chem', 'kiln', 'aluminum'],
                 buildings: ['pcFactory'], recipes: ['pc'], resources: ['pc'] },
    ev:        { x: 1725, color: '#00798c', name: 'EV・電池',     icon: '🔋', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'copper', 'semi'],
                 buildings: ['evFactory'], recipes: ['ev'], resources: ['ev'] },
    aircraft:  { x: 1975, color: '#edae49', name: '航空機',       icon: '✈️', tier: 5, legacyTier: 6, tickets: 2, needs: ['aluminum', 'steel', 'semi', 'chem', 'copper'],
                 buildings: ['aircraftFactory'], recipes: ['aircraft'], resources: ['aircraft'] },
    weapon:    { x: 1475, color: '#8d6a9f', name: '兵器',         icon: '🎖️', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo'],
                 buildings: ['munitionsFactory'], recipes: ['weapon'], resources: ['weapon'] },
    // 最後の工場：船・航空機・半導体以外のすべての最終製品と合金が材料（半導体は数えない。ただし PC・EV・兵器・ロケットの前提なので、結局開く）
    colony:    { x: 1225, color: '#c28a1e', name: '宇宙コロニー', icon: '🛰️', tier: 6, tickets: 3, needs: ['steel', 'pharma', 'pc', 'ev', 'weapon', 'rocket', 'car', 'buildmat', 'detergent', 'clothing', 'paper'],
                 buildings: ['colonyFactory'], recipes: ['colony'], resources: ['colony'] },
    // 最終プロジェクト（コロニーの仲間）：船・航空機・半導体を、1つずつ主役にする。前提がそろえば現れる（選べるのは、素材の余りがそろったとき）
    // 電機ライン（銅）：Tier 3 電線・ケーブル（電線工場）→ Tier 4 モーター・変圧器 → Tier 5 発電・送電設備
    wire:      { x: 600, color: '#b5651d', name: '電線・ケーブル', icon: '🔗', tier: 3, tickets: 1, needs: ['copper'],
                 buildings: ['cableFactory'], recipes: ['cable'], resources: ['cable'] },
    motor:     { x: 725, color: '#c77b30', name: 'モーター・変圧器', icon: '🔌', tier: 4, tickets: 2, needs: ['wire', 'steel'],
                 buildings: ['motorFactory'], recipes: ['motor'], resources: ['motor'] },
    power:     { x: 725, color: '#2f9e44', name: '発電・送電設備', icon: '🌬️', tier: 5, tickets: 2, needs: ['motor', 'kiln'],
                 buildings: ['powerEquipFactory'], recipes: ['powerEquip'], resources: ['powerEquip'] },
    // 光・通信ライン（ガラス）：Tier 3 光ファイバー（光ファイバー工場）→ Tier 4 通信機器 → Tier 5 通信衛星・通信網
    optic:     { x: 350, color: '#5aa9c9', name: '光ファイバー', icon: '💡', tier: 3, tickets: 1, needs: ['kiln'],
                 buildings: ['fiberFactory'], recipes: ['opticFiber'], resources: ['opticFiber'] },
    comm:      { x: 475, color: '#3a8fb7', name: '通信機器', icon: '📡', tier: 4, tickets: 2, needs: ['optic', 'copper', 'semi'],
                 buildings: ['commGearFactory'], recipes: ['commGear'], resources: ['commGear'] },
    sat:       { x: 475, color: '#7b61c4', name: '通信衛星・通信網', icon: '🛰️', tier: 5, tickets: 2, needs: ['comm', 'semi'],
                 buildings: ['satelliteFactory'], recipes: ['comsat'], resources: ['comsat'] },
    offshore:  { x: 225, color: '#4a7f9a', name: '洋上プラットフォーム', icon: '🛢️', tier: 5, tickets: 2, needs: ['steel', 'kiln', 'pc'],
                 buildings: ['offshoreFactory'], recipes: ['offshore'], resources: ['offshore'] },
    aiDefense: { x: 975, color: '#5a6a8a', name: 'AI防衛システム', icon: '🛡️', tier: 6, tickets: 4, needs: ['semi', 'weapon', 'rocket', 'pc', 'power', 'sat'],
                 buildings: ['aiDefenseFactory'], recipes: ['aiDefense'], resources: ['aiDefense'] },
    rocket:    { x: 1225, color: '#d1495b', name: 'ロケット',     icon: '🚀', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo', 'aluminum'],
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
  projects: ['colony', 'aiDefense'],   // ゴールの金額の基準にする最終プロジェクト
  target: 300000000,       // ゴールの金額（年末の純利益・税引き後。名目のドル。物価指数は掛けない絶対値）。target が無ければ、下の profitMultiplier（×物価指数）で決める
  profitMultiplier: 2.85,  // （target が無いときの）ゴールの金額＝（projects の各1基を材料まで全部自前で作って売ったときの年間利益の和）×この倍率（Engine.chainProfit1950）。いまは target が優先
  speedBest: 100, speedWorst: 160, speedOffset: { rich: 0, tight: 5, indebted: 10 },
  weights: { speed: 0.5, equity: 0.25, margin: 0.25 }, marginFull: 0.30,
  restructurePenalty: 10, overdraftPenaltyPerMonth: 2, overdraftPenaltyMax: 15,
  ranks: [{ min: 85, rank: 'S', title: '宇宙企業' }, { min: 70, rank: 'A', title: '世界企業' }, { min: 55, rank: 'B', title: '国内大手' }, { min: 40, rank: 'C', title: '地方の雄' }, { min: 0, rank: 'D', title: '町工場' }]
};

// 法人税：12月の決算で、その年の税引き前の利益（−その年の設備投資−繰り越した赤字）が exempt（1950年のドル。物価指数で増える）を超えた分に、rate をかける。
// 設備投資は、利益を0になるまで差し引ける（capexDeduct 1＝全額）。赤字の年は、翌年以降に繰り越す。ゴール・解放権の「利益」は税引き後。値は仮：遊んで調整する。
GAME_DATA.tax = { rate: 0.30, exempt: 20000000, capexDeduct: 1 };
