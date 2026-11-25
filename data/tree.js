// 技術ツリー（ノード）。設計は docs/技術ツリーとゴールの設計.md。file:// で開けるよう代入形式。
// Tier 1：精製所と素材（製鋼・アルミ・窯業・非鉄・製材）。素材は、同じ条件（旧ティア3：製油所の稼働＋精製品の累計売上）でいっしょに開く（自動）。
// Tier 2：化学（自動）と、火薬・精密化学・製紙（製材から）・光ファイバー・電線・建材（解放権で開く）。Tier 3：洗剤・衣料・タイヤ・モーター。Tier 4：電池・発電設備ほか。輸入の罰は Tier 2 以上（Tier 1 だけなし）。
// 時代（ティア）をノードに置き換える：ノードの tier は 1〜6（数字が大きいほど先端）。
// GAME_DATA.tree.nodes[id] = {
//   name, icon, tier,
//   needs:     前提の（素材）ノードのid。すべて開いていて、かつ輸入なしで回る余剰があると「選べる」（選択権）。Tier 3+ の判定に使う
//   buildings / recipes / resources：このノードが開くと使える設備・レシピ・品目（ここに無いものは最初から使える）
//   legacyTier：旧ティア（era）の番号。移行期の互換（unlockTier(s,t)＝legacyTier ≤ t のノードをすべて開く）と、旧セーブの解放済みの判定に使う
//   tickets：解放権の枚数（解放権で開くノード。Tier 2 の化学以外と Tier 3+）。auto：自動で開く（Tier 1 の素材と Tier 2 の化学。製紙は解放権。旧ティアの条件で開く）
//   supply：{ building, recipe }（選択権の量の基準：その設備を、増設モジュールをすべて付けて全開で回す量の入力）。省略時は buildings[0] とそのレシピ
//   legacyResearch：旧セーブでは研究が済んでいたときだけ開いた（旧ティアの到達では開かない）。移行の判定に使う
//   colony・aiDefense：最後のノード（Tier 5 のうち4つが開くまで画面に描かない。config.finalReveal）
//   x・color：技術ツリーの図での横の位置（図の幅 約2200 の中の中心）と、このノードから出る線の色
// }
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.tree = {
  config: {
    // 解放権：会社全体の直近12か月の利益（名目）が、この額を超えるたびに1枚。一度もらった枚数は減らない
    ticketSteps: [150000, 176000, 206000, 241000, 282000, 330000, 387000, 453000, 531000, 622000, 728000, 853000, 998000, 1170000, 1370000, 1600000, 1880000, 2200000, 2580000, 3020000, 3540000, 4140000, 4850000, 5680000, 6650000, 7790000, 9130000, 10700000, 12500000, 14500000, 16000000, 17700000, 19500000, 21500000, 23700000, 26200000, 28900000, 31900000, 35200000, 38800000, 42800000, 47200000, 52100000, 57500000, 63400000, 69930000],   // 150k から約6993万ドルまでを46段（以前の40段と同じ曲線・同じ上限を、6段ぶん細かく刻んだ。2026-11-25）。ゴールの条件（コロニー＋AI防衛システムの両方）に要る解放権は40枚、全26ノードを開くと46枚なので、46段＝全部開ける（船・航空機・洋上のぶんの6枚の余裕）。以前（38段・1.25倍→1.15倍→1.1倍で約1.27億ドルまで）より基準を下げて、取りやすくした（2026-11-23）。ノードの枚数の合計が変わったら、段の数も合わせる。値は仮：バランスのボットで調整
    // 輸入の罰：加工設備が原料を市場から買った（自動購入）とき、その製品のノードの Tier が2以上なら、買った原料の価値の割合ぶんだけ手数料を引く。
    //   手数料＝(1−比)×その工場の粗利（原料を自社の在庫で賄ったときの、売上−原料−操業費）×生産量×買った割合。全部を輸入すると、利益が自前のときの「比」になる。Tier 1 は罰なし。火薬（入力が輸入しか手段の無い硝石だけ）は、Tier 2 でも罰なし
    importRatio: { 2: 0.5, 3: 0.5, 4: 0.5, 5: 0.5, 6: 0.8 },
    supplyMonths: 3,          // 選択権：直近3か月の実績の平均で、輸入なしで回る余剰を測る
    supplyModules: 0,         // 必要な量：その設備に、増設モジュールを何個付けて全開で回す量か（0＝増設なしの1基。上限は map.js の modules.max）
    supplyFactor: 1.0,        // 必要な量にかける係数（バランス調整用）
    finalProducts: ['colony', 'offshore', 'aiDefense'],   // 最終プロジェクトの品目（材料に船・航空機を使わない等のデータ検査の対象）。ゴールの条件に要るのは goal.projects（コロニーとAI防衛システムを1基ずつ）
    finalReveal: { nodes: ['colony', 'aiDefense'], tier: 5, count: 4 }   // 例外：コロニーとAI防衛システムは Tier 5 のうち4つが開いたら描く（前提がまだでも）
  },
  nodes: {
    refinery:  { x: 1046, color: '#6b7b8c', name: '精製所',       icon: '🏭', tier: 1, legacyTier: 2, auto: true, needs: [] },
    chem:      { x: 748, color: '#6a4c93', name: '化学',         icon: '⚗️', tier: 2, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['chemPlant', 'warehouse_bulk', 'warehouse_goods', 'powerPlant'], recipes: ['plastic', 'rubber', 'surfactant', 'fiber'], resources: ['plastic', 'rubber', 'surfactant', 'fiber', 'naturalGas'] },
    steel:     { x: 674, color: '#3d5a80', name: '製鋼',         icon: '🔩', tier: 1, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['steelMill'], recipes: ['steel', 'alloy'], resources: ['steel', 'ironore', 'coal', 'alloy', 'rareMetal'] },
    aluminum:  { x: 860, color: '#2a9d8f', name: 'アルミ',       icon: '🥫', tier: 1, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['aluminumSmelter'], recipes: ['aluminum'], resources: ['aluminum', 'bauxite'] },
    kiln:      { x: 1418, color: '#c08a2e', name: '窯業',         icon: '🧱', tier: 1, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['kiln'], recipes: ['glass', 'cement', 'silicon'], resources: ['glass', 'cement', 'limestone', 'silica', 'silicon'] },
    copper:    { x: 1232, color: '#c1553b', name: '非鉄',         icon: '🔶', tier: 1, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['copperSmelter'], recipes: ['copper', 'lithium'], resources: ['copper', 'copperore', 'lithium', 'lithiumOre'] },
    sawmill:   { x: 243, color: '#8b6b3a', name: '製材',         icon: '🪵', tier: 1, legacyTier: 3, auto: true, needs: ['refinery'],
                 buildings: ['sawmill'], recipes: ['lumber'], resources: ['lumber', 'logs'] },
    paper:     { x: 150, color: '#9a8f6a', name: '製紙',         icon: '📄', tier: 2, legacyTier: 3, tickets: 1, needs: ['sawmill'],
                 buildings: ['paperMill'], recipes: ['paper'], resources: ['paper'] },
    fine:      { x: 1012, color: '#8a6d3b', name: '精密化学',     icon: '🧪', tier: 2, legacyTier: 6, tickets: 1, legacyResearch: true, needs: ['refinery'],
                 buildings: ['fineChemPlant'], recipes: ['pharmaMat'], resources: ['pharmaMat'], supply: { building: 'fineChemPlant', recipe: 'pharmaMat' } },
    explo:     { x: 1497, color: '#b5334a', name: '火薬',         icon: '💥', tier: 2, legacyTier: 6, tickets: 1, legacyResearch: true, needs: [],
                 buildings: ['explosivesFactory'], recipes: ['explosive'], resources: ['explosive', 'niter'], supply: { building: 'explosivesFactory', recipe: 'explosive' } },
    detergent: { x: 486, color: '#6bb3d9', name: '洗剤・化粧品', icon: '🧴', tier: 3, legacyTier: 3, tickets: 1, needs: ['chem'],
                 buildings: ['detergentFactory'], recipes: ['detergent'], resources: ['detergent'] },
    clothing:  { x: 300, color: '#d98ba0', name: '衣料',         icon: '👕', tier: 3, legacyTier: 4, tickets: 1, needs: ['chem'],
                 buildings: ['garmentFactory'], recipes: ['clothing'], resources: ['clothing'] },
    tire:      { x: 672, color: '#3b3b44', name: 'タイヤ',       icon: '🛞', tier: 3, legacyTier: 4, tickets: 1, needs: ['chem'],
                 buildings: ['tireFactory'], recipes: ['tire'], resources: ['tire'] },
    buildmat:  { x: 336, color: '#4d6fa3', name: '建材',         icon: '🏗️', tier: 2, legacyTier: 4, tickets: 1, needs: ['sawmill', 'kiln', 'steel'],
                 buildings: ['buildmatFactory'], recipes: ['buildmat'], resources: ['buildmat'] },
    car:       { x: 674, color: '#7a4f9a', name: '自動車',       icon: '🚗', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'kiln', 'copper', 'tire'],
                 buildings: ['carFactory'], recipes: ['car'], resources: ['car'] },
    ship:      { x: 860, color: '#444444', name: '造船',         icon: '🚢', tier: 4, legacyTier: 5, tickets: 2, needs: ['steel', 'copper'],
                 buildings: ['shipyard'], recipes: ['ship'], resources: ['ship'] },
    pharma:    { x: 1236, color: '#2e4057', name: '製薬',         icon: '💊', tier: 4, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['fine', 'kiln'],
                 buildings: ['pharmaFactory'], recipes: ['pharma'], resources: ['pharma'] },
    semi:      { x: 1348, color: '#1d1d1d', name: '半導体',       icon: '💾', tier: 3, legacyTier: 6, tickets: 2, needs: ['kiln', 'copper'],
                 buildings: ['semiconductorFactory'], recipes: ['semiconductor'], resources: ['semiconductor'] },
    pc:        { x: 900, color: '#66a182', name: 'PC',           icon: '💻', tier: 5, legacyTier: 6, tickets: 2, needs: ['semi', 'chem', 'kiln', 'aluminum', 'battery'],
                 buildings: ['pcFactory'], recipes: ['pc'], resources: ['pc'] },
    ev:        { x: 714, color: '#00798c', name: 'EV',          icon: '🔋', tier: 5, legacyTier: 6, tickets: 2, needs: ['steel', 'aluminum', 'chem', 'copper', 'semi', 'tire', 'motor', 'battery'],
                 buildings: ['evFactory'], recipes: ['ev'], resources: ['ev'] },
    aircraft:  { x: 1086, color: '#edae49', name: '航空機',       icon: '✈️', tier: 5, legacyTier: 6, tickets: 2, needs: ['aluminum', 'steel', 'semi', 'chem', 'copper'],
                 buildings: ['aircraftFactory'], recipes: ['aircraft'], resources: ['aircraft'] },
    weapon:    { x: 1422, color: '#8d6a9f', name: '兵器',         icon: '🎖️', tier: 4, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo'],
                 buildings: ['munitionsFactory'], recipes: ['weapon'], resources: ['weapon'] },
    // 最後の工場：船・航空機・半導体以外のすべての最終製品と合金が材料（半導体は数えない。ただし PC・EV・兵器・ロケットの前提なので、結局開く）
    colony:    { x: 338, color: '#c28a1e', name: '宇宙コロニー', icon: '🛰️', tier: 6, tickets: 3, needs: ['steel', 'pharma', 'pc', 'ev', 'weapon', 'rocket', 'car', 'buildmat', 'detergent', 'clothing', 'paper'],
                 buildings: ['colonyFactory'], recipes: ['colony'], resources: ['colony'] },
    // 最終プロジェクト（コロニーの仲間）：船・航空機・半導体を、1つずつ主役にする。前提がそろえば現れる（選べるのは、素材の余りがそろったとき）
    // 電機ライン（銅）：Tier 3 電線・ケーブル（電線工場）→ Tier 4 モーター・変圧器 → Tier 5 発電・送電設備
    wire:      { x: 1198, color: '#b5651d', name: '電線・ケーブル', icon: '🔗', tier: 2, tickets: 1, needs: ['copper'],
                 buildings: ['cableFactory'], recipes: ['cable'], resources: ['cable'] },
    motor:     { x: 1010, color: '#c77b30', name: 'モーター・変圧器', icon: '🔌', tier: 3, tickets: 2, needs: ['wire', 'steel'],
                 buildings: ['motorFactory'], recipes: ['motor'], resources: ['motor'] },
    power:     { x: 1646, color: '#2f9e44', name: '発電・送電設備', icon: '🌬️', tier: 4, tickets: 2, needs: ['motor', 'wire', 'kiln'],
                 buildings: ['powerEquipFactory'], recipes: ['powerEquip'], resources: ['powerEquip'] },
    // 光・通信ライン（ガラス）：Tier 3 光ファイバー（光ファイバー工場）→ Tier 4 通信機器 → Tier 5 通信衛星・通信網
    optic:     { x: 1832, color: '#5aa9c9', name: '光ファイバー', icon: '💡', tier: 2, tickets: 1, needs: ['kiln'],
                 buildings: ['fiberFactory'], recipes: ['opticFiber'], resources: ['opticFiber'] },
    battery:   { x: 488, color: '#e0b43c', name: '電池', icon: '🔋', tier: 4, tickets: 2, needs: ['copper', 'aluminum'],
                 buildings: ['batteryFactory'], recipes: ['battery'], resources: ['battery'] },
    comm:      { x: 1832, color: '#3a8fb7', name: '通信機器', icon: '📡', tier: 4, tickets: 2, needs: ['optic', 'copper', 'semi'],
                 buildings: ['commGearFactory'], recipes: ['commGear'], resources: ['commGear'] },
    sat:       { x: 1832, color: '#7b61c4', name: '通信衛星・通信網', icon: '🛰️', tier: 5, tickets: 2, needs: ['comm', 'semi'],
                 buildings: ['satelliteFactory'], recipes: ['comsat'], resources: ['comsat'] },
    offshore:  { x: 1646, color: '#4a7f9a', name: '洋上プラットフォーム', icon: '🛢️', tier: 5, tickets: 2, needs: ['steel', 'kiln', 'comm', 'power'],
                 buildings: ['offshoreFactory'], recipes: ['offshore'], resources: ['offshore'] },
    aiDefense: { x: 1422, color: '#5a6a8a', name: 'AI防衛システム', icon: '🛡️', tier: 6, tickets: 4, needs: ['semi', 'weapon', 'rocket', 'pc', 'power', 'sat'],
                 buildings: ['aiDefenseFactory'], recipes: ['aiDefense'], resources: ['aiDefense'] },
    rocket:    { x: 1310, color: '#d1495b', name: 'ロケット',     icon: '🚀', tier: 5, legacyTier: 6, tickets: 2, legacyResearch: true, needs: ['steel', 'semi', 'explo', 'aluminum', 'comm'],
                 buildings: ['rocketFactory'], recipes: ['rocket'], resources: ['rocket'] },
  }
};
GAME_DATA.tree.lanes = {   // 図の幹のレーン：{ 親id: { 段: x } }（tools/layout_tree_dot.py が書く。親の幹が、途中の段で通る横位置）
  steel: { 2: 665, 3: 587, 4: 587 },
  aluminum: { 2: 860, 3: 860, 4: 776 },
  copper: { 2: 1283, 3: 1265 },
  kiln: { 2: 1412, 3: 1433 },
  paper: { 3: 150, 4: 150, 5: 150 },
  buildmat: { 3: 384, 4: 384, 5: 384 },
  chem: { 3: 757, 4: 757 },
  fine: { 3: 1093 },
  explo: { 3: 1497, 4: 1506 },
  optic: { 3: 1832 },
  clothing: { 4: 300, 5: 300 },
  detergent: { 4: 405, 5: 405 },
  tire: { 4: 573 },
  motor: { 4: 1010 },
  semi: { 4: 1339 },
  car: { 5: 629 },
  pharma: { 5: 1227 },
  weapon: { 5: 1422 },
  power: { 5: 1562 }
};
// ゴール：年末（12月の決算）に、その年の純利益が「コロニー1基（年1基）を全部自前で作って売ったときの年間利益」の profitMultiplier 倍以上で、コロニーを1基完成させていれば達成（期限なし。続けて遊べる）。達成時にスコアとランクを出す。
// スコア（0〜100）＝ 早さ×weights.speed ＋ 自己資本比率×weights.equity ＋ 営業利益率×weights.margin − 減点。
//   早さ：創業からの年数（難易度の speedOffset 年ぶん甘くして）が speedBest 年なら100、speedWorst 年以上なら0（その間は直線）
//   自己資本比率：資本÷資産（0〜100%）／営業利益率：直近12か月の営業利益÷売上（marginFull で100点）
//   減点：債務の再編を使った（restructurePenalty）、当座貸越の借り増しをした月（月ごとに overdraftPenaltyPerMonth、最大 overdraftPenaltyMax）
// コロニーは、1基の材料を、そのまま市場で売ったときの利益のおよそ2倍の利益になるように、価格・費用を決めた（tools/calibrate_recipes.py）。
GAME_DATA.goal = {
  projects: ['colony', 'aiDefense'],   // ゴールの金額の基準にする最終プロジェクト
  target: 1000000000,       // ゴールの金額（年末の純利益・税引き後。名目のドル。物価指数は掛けない絶対値）。target が無ければ、下の profitMultiplier（×物価指数）で決める
  profitMultiplier: 2.85,  // （target が無いときの）ゴールの金額＝（projects の各1基を材料まで全部自前で作って売ったときの年間利益の和）×この倍率（Engine.chainProfit1950）。いまは target が優先
  speedBest: 100, speedWorst: 160, speedOffset: { rich: 0, tight: 5, indebted: 10 },
  weights: { speed: 0.5, equity: 0.25, margin: 0.25 }, marginFull: 0.30,
  restructurePenalty: 10, overdraftPenaltyPerMonth: 2, overdraftPenaltyMax: 15,
  ranks: [{ min: 85, rank: 'S', title: '宇宙企業' }, { min: 70, rank: 'A', title: '世界企業' }, { min: 55, rank: 'B', title: '国内大手' }, { min: 40, rank: 'C', title: '地方の雄' }, { min: 0, rank: 'D', title: '町工場' }]
};

// 法人税：12月の決算で、その年の税引き前の利益（−その年の設備投資−繰り越した赤字）が exempt（1950年のドル。物価指数で増える）を超えた分に、rate をかける。
// 設備投資は、利益を0になるまで差し引ける（capexDeduct 1＝全額）。赤字の年は、翌年以降に繰り越す。ゴール・解放権の「利益」は税引き後。値は仮：遊んで調整する。
GAME_DATA.tax = { rate: 0.30, exempt: 20000000, capexDeduct: 1 };
