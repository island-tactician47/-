// 原料・素材・製品の定義と基準価格（1950年、ドル建て）
// ・原油 $2.51/bbl：1950年の米国原油平均価格
// ・ガソリン：オクラホマ製油所渡しのレギュラーが1947年に約8.4セント/ガロン、1950年は10〜11セント前後 → 約$4.5/bbl（42ガロン/bbl）
// ・軽油（灯油・ディーゼル）：ガソリンより1〜2セント/ガロン安い水準 → 約$3.9/bbl
// ・ナフサ：ガソリン基材より安い → 約$3.4/bbl
// ・重油（バンカーC）：原油より安い副産物 → 約$1.8/bbl
// 段階2aで追加した品目の価格（1950年前後の米国。単位はt、自動車は台、衣料は千着）：
// ・裏取り済み（USGS Minerals Yearbook・EIA等の概算）：鉄鉱石 約$5/t、瀝青炭 約$4.9/t、セメント 約$12.5/t（1バレル$2.35）、銅 21.5¢/lb≒$430/t、アルミ 17.7¢/lb≒$354/t、乗用車 約$1,500
// ・段階2bの品目はすべて概算（レアメタルはニッケル$1,060/t前後を代表値に。PC・EVは1950年ドルに直した値で、実際の発売時期の名目価格より低い）
// ・概算（裏取りできていない）：ボーキサイト、銅精鉱、石灰石、ケイ砂、原木、鋼材、ガラス、木材、紙、プラスチック、合成ゴム、界面活性剤、合成繊維、洗剤・化粧品、建材、衣料
// file:// で開いても動くよう、JSONではなくJSファイルで定義している
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.resources = {
  // ---- 石油（ステップ1以前から。定義は変えない） ----
  crude:    { name: '原油',     unit: 'bbl', kind: 'raw',      tier: 1, canBuy: true, canSell: true, shipVol: 1, basePrice: 2.51, volatility: 0.035, marketDepth: 480000, color: '#6b5b4b' },
  gasoline: { name: 'ガソリン', unit: 'bbl', kind: 'material', tier: 2, canBuy: true, canSell: true, shipVol: 1, basePrice: 5.04, volatility: 0.03,  marketDepth: 160000, color: '#e0a030' },
  diesel:   { name: '軽油',     unit: 'bbl', kind: 'material', tier: 2, canBuy: true, canSell: true, shipVol: 1, basePrice: 4.37, volatility: 0.03,  marketDepth: 160000, color: '#4a90c0' },
  naphtha:  { name: 'ナフサ',   unit: 'bbl', kind: 'material', tier: 2, canBuy: true, canSell: true, shipVol: 1, basePrice: 3.80, volatility: 0.04,  marketDepth: 80000,  color: '#9a6ac0' },
  heavy:    { name: '重油',     unit: 'bbl', kind: 'material', tier: 2, canBuy: true, canSell: true, shipVol: 1, basePrice: 2.02, volatility: 0.04,  marketDepth: 160000, color: '#444444' },

  // ---- 原料（市場で買うだけ。売れない）。lot＝市場画面の「買う」ボタン1回の量 ----
  coal:      { name: '石炭',       unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 4.9,  volatility: 0.03, marketDepth: 1000000, lot: 500, color: '#3a3a3a' },
  ironore:   { name: '鉄鉱石',     unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 5.0,  volatility: 0.03, marketDepth: 1000000, lot: 500, color: '#8a4b38' },
  bauxite:   { name: 'ボーキサイト', unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 9.0,  volatility: 0.03, marketDepth: 1000000, lot: 200, color: '#b5693f' },
  copperore: { name: '銅精鉱',     unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 80,   volatility: 0.04, marketDepth: 1000000, lot: 100, color: '#7a8f6a' },
  limestone: { name: '石灰石',     unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 1.6,  volatility: 0.02, marketDepth: 1000000, lot: 500, color: '#c9c3b0' },
  silica:    { name: 'ケイ砂',     unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 2.5,  volatility: 0.02, marketDepth: 1000000, lot: 300, color: '#d9c88a' },
  logs:      { name: '原木',       unit: 't', kind: 'raw', tier: 4, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 22,   volatility: 0.03, marketDepth: 1000000, lot: 300, color: '#6b8e4e' },

  // ---- 素材（買うことも売ることもできる）。化学素材は tier3、金属・無機・林業は tier4 ----
  plastic:    { name: 'プラスチック', unit: 't', kind: 'material', tier: 3, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 650, volatility: 0.03, marketDepth: 1000, color: '#e86a9a' },
  rubber:     { name: '合成ゴム',     unit: 't', kind: 'material', tier: 3, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 370, volatility: 0.04, marketDepth: 1800, color: '#4a4a52' },
  surfactant: { name: '界面活性剤',   unit: 't', kind: 'material', tier: 3, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 420, volatility: 0.03, marketDepth: 1500, color: '#5cc2d8' },
  fiber:      { name: '合成繊維',     unit: 't', kind: 'material', tier: 3, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 900, volatility: 0.03, marketDepth: 600,  color: '#b58be0' },
  steel:      { name: '鋼材',         unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 110, volatility: 0.03, marketDepth: 8000, color: '#7c8a99' },
  aluminum:   { name: 'アルミ',       unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 354, volatility: 0.03, marketDepth: 2400, color: '#a9b8c4' },
  copper:     { name: '銅',           unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 500, volatility: 0.045, marketDepth: 1500, color: '#c8743a' },
  glass:      { name: 'ガラス',       unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 250, volatility: 0.02, marketDepth: 1800, color: '#8fd3e0' },
  cement:     { name: 'セメント',     unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 12.5, volatility: 0.02, marketDepth: 25000, color: '#a8a39a' },
  lumber:     { name: '木材',         unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 75,  volatility: 0.035, marketDepth: 3600, color: '#c49a5a' },
  paper:      { name: '紙',           unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 100, volatility: 0.03, marketDepth: 4500, color: '#e8e2cf' },

  // ---- 製品（作って売る。買えない）。storeVol＝保管枠、shipVol＝出荷枠を食う量（大きいものほど大きい） ----
  detergent: { name: '洗剤・化粧品', unit: 't',   kind: 'product', tier: 3, canBuy: false, canSell: true, shipVol: 1,   storage: 'goods', storeVol: 1,   basePrice: 1800, volatility: 0.02, marketDepth: 800,  color: '#4fb0c6' },
  buildmat:  { name: '建材',         unit: 't',   kind: 'product', tier: 4, canBuy: false, canSell: true, shipVol: 1,   storage: 'goods', storeVol: 1,   basePrice: 135,  volatility: 0.025, marketDepth: 5600, color: '#b0824a' },
  clothing:  { name: '衣料',         unit: '千着', kind: 'product', tier: 4, canBuy: false, canSell: true, shipVol: 0.3, storage: 'goods', storeVol: 0.3, basePrice: 3000, volatility: 0.025, marketDepth: 320,   color: '#d46aa0' },
  car:       { name: '自動車',       unit: '台',   kind: 'product', tier: 5, canBuy: false, canSell: true, shipVol: 3,   storage: 'goods', storeVol: 3,   basePrice: 1500, volatility: 0.02, marketDepth: 1680,  color: '#c0392b' },

  // ---- 段階2b：原料（市場で買うだけ）。レアメタルはニッケル・クロム・モリブデンなど合金元素の代表品目 ----
  rareMetal:  { name: 'レアメタル',   unit: 't', kind: 'raw', tier: 5, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 1200, volatility: 0.045, marketDepth: 1000000, lot: 20,  color: '#7a6fb0' },
  lithiumOre: { name: 'リチウム鉱石', unit: 't', kind: 'raw', tier: 6, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 60,   volatility: 0.04,  marketDepth: 1000000, lot: 100, color: '#9fc1b0' },

  // ---- 段階2b：素材（買うことも売ることもできる）。合金は tier5、シリコン・リチウムは tier6 ----
  alloy:      { name: '合金',         unit: 't', kind: 'material', tier: 5, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 900,  volatility: 0.035, marketDepth: 800, color: '#6e7f9e' },
  silicon:    { name: 'シリコン',     unit: 't', kind: 'material', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 2000,  volatility: 0.03,  marketDepth: 200, color: '#4b5d73' },
  lithium:    { name: 'リチウム',     unit: 't', kind: 'material', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 4000, volatility: 0.05,  marketDepth: 100,  color: '#5fb59a' },

  // ---- 段階2b：製品。船・航空機は自走で出荷するので shipVol は小さい（港の出荷枠をほとんど使わない）。半導体は製品として売れ、PC・航空機・EVの材料にもなる（canBuy:true）。
  //      船・航空機は1単位が大きく、1隻ずつまとめて売れる（shipment は1単位未満を売らない）ので、marketDepth は1回の売却で値崩れしすぎないよう数単位にしている ----
  ship:          { name: '船舶',         unit: '隻',   kind: 'product', tier: 5, canBuy: false, canSell: true, shipVol: 0.1,  storage: 'goods', storeVol: 300, basePrice: 2500000, volatility: 0.1, marketDepth: 1,    color: '#2f6f8f' },
  aircraft:      { name: '航空機',       unit: '機',   kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.1,  storage: 'goods', storeVol: 100, basePrice: 1500000, volatility: 0.08, marketDepth: 2,    color: '#8aa9c8' },
  semiconductor: { name: '半導体',       unit: '千個', kind: 'product', tier: 6, canBuy: true,  canSell: true, shipVol: 0.01, storage: 'goods', storeVol: 0.01, basePrice: 3600,   volatility: 0.12, marketDepth: 520,  color: '#d6a43a' },
  pc:            { name: 'PC',           unit: '台',   kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.3,  storage: 'goods', storeVol: 0.3, basePrice: 400,     volatility: 0.09, marketDepth: 4000, color: '#6a8caf' },
  // ---- 段階2c（概算。ロケットは船・航空機と同じく1単位が大きく、1基ずつまとめて売れる）----
  naturalGas:    { name: '天然ガス',     unit: 't', kind: 'raw', tier: 6, canBuy: true, canSell: false, shipVol: 1, storage: 'bulk', basePrice: 25, volatility: 0.04, marketDepth: 1000000, lot: 200, color: '#8fb8c9' },
  pharmaMat:     { name: '医薬原料',     unit: 't', kind: 'material', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 2500, volatility: 0.03, marketDepth: 200, color: '#c98fd0' },
  explosive:     { name: '火薬',         unit: 't', kind: 'material', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 1000, volatility: 0.035, marketDepth: 400, color: '#c9663a' },
  pharma:        { name: '医薬品',       unit: 't', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 1, storage: 'goods', storeVol: 1, basePrice: 6000, volatility: 0.09, marketDepth: 280, color: '#d46a8f' },
  colony:        { name: '宇宙コロニー', unit: '基', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.1, storage: 'goods', storeVol: 600, basePrice: 25000000, volatility: 0.25, marketDepth: 20, color: '#d8b04a' },
  offshore:      { name: '洋上プラットフォーム', unit: '基', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.1, storage: 'goods', storeVol: 500, basePrice: 6000000, volatility: 0.12, marketDepth: 20, color: '#4a7f9a' },
  aiDefense:     { name: 'AI防衛システム', unit: '式', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.1, storage: 'goods', storeVol: 200, basePrice: 30000000, volatility: 0.35, marketDepth: 20, color: '#5a6a8a' },
  // ---- 電機ライン（銅）と光・通信ライン（ガラス）：Tier 3→4→5 の独立した2本。Tier 5 の発電・送電設備と通信衛星・通信網は、AI防衛システムの材料になる
  cable:         { name: '電線・ケーブル', unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 1100, volatility: 0.04, marketDepth: 3000, color: '#b5651d' },
  opticFiber:    { name: '光ファイバー', unit: 't', kind: 'material', tier: 4, canBuy: true, canSell: true, shipVol: 1, storage: 'bulk', basePrice: 520, volatility: 0.05, marketDepth: 2500, color: '#7fc4de' },
  motor:         { name: 'モーター・変圧器', unit: 't', kind: 'product', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'goods', storeVol: 1, basePrice: 3500, volatility: 0.07, marketDepth: 1200, color: '#c77b30' },
  commGear:      { name: '通信機器', unit: 't', kind: 'product', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'goods', storeVol: 1, basePrice: 4000, volatility: 0.08, marketDepth: 900, color: '#3a8fb7' },
  powerEquip:    { name: '発電・送電設備', unit: '式', kind: 'product', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'goods', storeVol: 5, basePrice: 14000, volatility: 0.12, marketDepth: 150, color: '#2f9e44' },
  comsat:        { name: '通信衛星・通信網', unit: '式', kind: 'product', tier: 6, canBuy: true, canSell: true, shipVol: 1, storage: 'goods', storeVol: 20, basePrice: 450000, volatility: 0.15, marketDepth: 25, color: '#7b61c4' },
  rocket:        { name: 'ロケット',     unit: '基', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 0.1, storage: 'goods', storeVol: 100, basePrice: 2000000, volatility: 0.1, marketDepth: 1, color: '#9a8fd0' },
  weapon:        { name: '兵器',         unit: 't', kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 1, storage: 'goods', storeVol: 1, basePrice: 2400, volatility: 0.08, marketDepth: 900, color: '#6a7a5a' },
  ev:            { name: '電池・EV',     unit: '台',   kind: 'product', tier: 6, canBuy: false, canSell: true, shipVol: 3,    storage: 'goods', storeVol: 3,   basePrice: 2500,    volatility: 0.1, marketDepth: 1040, color: '#3aa17e' },
};
// 保管クラスの定義（品目の storage と、倉庫の capacity[クラス] で使う。単位は保管枠）
GAME_DATA.storageClasses = {
  bulk:  { name: '素材倉庫' },
  goods: { name: '製品倉庫' }
};
// フィールドの意味：
//   kind：raw（原料）/ material（素材）/ product（製品）
//   tier：解放される技術ティア（data/eras.js）。未解放ティアの品目は市場に出ない
//   canBuy / canSell：市場で買える / 売れる（原料は売れない、製品は原則買えない。半導体は下流の材料にもなるので買える）
//   shipVol：1単位が港の出荷枠を食う量（既定1）。出荷枠は「原油1bbl≒固体1t」を1枠とする取り扱い単位（体積や重さの厳密な換算はしない）。自動車は大きいので3、衣料は軽いので0.3
//   storage：保管クラス。持つ品目は専用タンクを持たず、倉庫の capacity[クラス]（保管枠）を同じクラスの全品目で共用する。storeVol＝1単位が使う保管枠（既定1）。持たない品目は品目専用タンク
//   unit：表示用の単位（bbl / t / 台 / 千着）
//   lot：原料の市場画面の「買う」ボタン1回の量（無ければ marketDepth÷24）
//   marketDepth：1か月にこの量を売ると相場が約2割下がる目安（需要の飽和）。素材は設備1基の月産の約8〜10倍、専用工場の製品は2〜3倍（飽和を早める）
// 注意：productOrder に無い品目は価格が動かず出荷もされない（validateData が全品目を検査する）
GAME_DATA.productOrder = ['crude', 'gasoline', 'diesel', 'naphtha', 'heavy',
  'coal', 'ironore', 'bauxite', 'copperore', 'limestone', 'silica', 'logs',
  'plastic', 'rubber', 'surfactant', 'fiber', 'steel', 'aluminum', 'copper', 'glass', 'cement', 'lumber', 'paper',
  'detergent', 'buildmat', 'clothing', 'car',
  'rareMetal', 'lithiumOre', 'alloy', 'silicon', 'lithium', 'ship', 'aircraft', 'semiconductor', 'pc', 'ev',
  'naturalGas', 'pharmaMat', 'explosive', 'pharma', 'rocket', 'weapon', 'colony', 'offshore', 'aiDefense', 'cable', 'opticFiber', 'motor', 'commGear', 'powerEquip', 'comsat'];

// 取引先（契約）：最終製品（買えず、どのレシピの入力にもならない品目）だけ。契約すると毎月ノルマの数量を、市場より高い固定プレミアムで自動納品する
// （市場の飽和を進めず、売却手数料もかからない）。足りない月は 不足分×単価×penaltyRate の違約金。契約は翌月から、毎月ノルマは自社設備の日量×30×share に更新
// period：ノルマの期間（月。既定1。船・航空機・ロケットは月産が1に満たないので12か月）。ノルマと違約金の精算は期間の末
// research：国家調達（研究が済むと契約できる）。integer：整数のノルマ（船・ロケットなど1基ずつ）
window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.contracts = {
  items: {
    pharma:   { premium: 0.08, penaltyRate: 0.5, share: 0.4 },
    ship:     { premium: 0.08, penaltyRate: 0.5, share: 0.5, integer: true, period: 12 },
    aircraft: { premium: 0.10, penaltyRate: 0.5, share: 0.5, integer: true, period: 12 },
    weapon:   { premium: 0.15, penaltyRate: 0.5, share: 0.4 },
    rocket:   { premium: 0.15, penaltyRate: 0.5, share: 0.5, integer: true, period: 12 }
  }
};

// 輸入（市場で買う）の上乗せ：自社で作れる品目（加工設備・油井・鉱山・精製が産出する品目）は、買値に extra を上乗せして割高にする（自社で作るほうが得）。
// 自社で作る手段が無い品目（ボーキサイト・珪砂・原木・レアメタル・リチウム鉱石など）と exempt の品目（天然ガス＝輸入しか手段が無い）は据え置き（Market の BUY_PREMIUM のまま）。
// 製油所の製品（ガソリン・軽油・ナフサ・重油）の売値は、元より約12%高くしてある（原油の買値の上乗せぶん、製油所の利益を大きくする。自社の原油を回すと大きくもうかる）。
GAME_DATA.importPremium = { extra: 0.25, exempt: ['naturalGas'] };
