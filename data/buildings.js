// 設備の定義（1950年価格。建設費は物価指数で毎年上がる）
// 油井：1950年代前半の米国の陸上油井は平均深度約4,300〜5,400ft、1本あたり数万〜9万ドル前後 → $60,000
//       1950年代の米国の油井1本あたり平均産出は日量9〜12bbl（ストリッパー井込み）。新しい井戸は多めに出て年々減衰する
// 操業費（リフティングコスト）：$0.6/bbl 程度
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.buildings = {
  oilWell: {
    name: '油井', icon: '🛢️', category: 'field',
    cost: 60000, months: 2,
    needsLeaseSlot: true,
    initialRate: 30,      // 掘りたての日量（bbl/日）×鉱区の豊かさ
    declinePerYear: 0.04, // 年4%ずつ減衰（旧8%。終盤に全部輸入になりにくいよう緩和）
    floorRate: 12,        // ここより下には減らない（ストリッパー井。旧6）
    opexPerBbl: 0.6,
    fixedPerMonth: 120,
    desc: '日量30bbl前後から年4%ずつ減衰（下限12bbl）。鉱区の空き枠が必要'
  },
  // 鉱山：鉱区（GAME_DATA.mineSites）ごとに掘れる鉱石が決まる。掘った鉱石は貯鉱場（鉱石ごとの専用の置き場）に入り、工場がまず使う（売れない）。
  // rate＝掘りたての日量（t/日）×鉱区の豊かさ。年 declinePerYear ずつ減り、rate×floorFrac が下限。costMul＝建設費の倍率
  mine: {
    name: '鉱山', icon: '⛏️', category: 'field', tier: 4,
    cost: 80000, months: 3, needsSite: true,
    declinePerYear: 0.06, floorFrac: 0.4, fixedPerMonth: 150,
    // 貯鉱場：鉱石ごとの専用の置き場（採掘地ページで建てる。町の地図には出さない）。掘った鉱石は貯鉱場の空きにだけ入る（無ければ掘れた分は捨てる）。
    // 買った鉱石も貯鉱場に先に入り、あふれた分だけ素材倉庫を使う。cap＝1棟あたりの容量（t）
    yard: { cost: 15000, months: 2, fixedPerMonth: 30, max: 6, cap: { coal: 2000, ironore: 2000, copperore: 400, limestone: 4000 } },
    ores: {
      coal:      { rate: 10, opexPerUnit: 1.6, costMul: 1 },
      ironore:   { rate: 10, opexPerUnit: 1.8, costMul: 1 },
      copperore: { rate: 4,  opexPerUnit: 52,  costMul: 5 },
      limestone: { rate: 35, opexPerUnit: 0.7, costMul: 1 }
    },
    desc: '鉱区に建てる。掘った鉱石は貯鉱場に入り、工場がまず使う（売れない）。年6%ずつ減る'
  },
  crudeTank: {
    name: '原油タンク', icon: '⚫', category: 'field',
    cost: 60000, months: 2,
    capacity: { crude: 40000 },
    fixedPerMonth: 40,
    desc: '原油を40,000bbl貯蔵（旧10,000）。満杯になると油井が止まる'
  },
  refinery: {
    name: '小規模製油所', icon: '🏭', category: 'refinery',
    cost: 600000, months: 24, unique: true,
    throughput: 1000,     // 蒸留塔1基込み
    capacity: { gasoline: 5000, diesel: 5000, naphtha: 5000, heavy: 5000 }, // 製品タンク各1基込み
    opexPerBbl: 0.18,
    fixedPerMonth: 2700,
    desc: '用地・ユーティリティ＋常圧蒸留塔1基（日量1,000bbl）＋製品タンク各5,000bbl。建設に2年'
  },
  // 大規模製油所：化学期（小規模製油所が建てられるティアの次）から。小規模とは別の建物（両方建てると処理能力は足し算。運転の設定は共通）。
  // 小規模より、面積あたりの処理（日量/タイル）が高く（6,400÷80タイル＝80 対 1,000÷16タイル＝62.5）、日量あたりの建設費・固定費・処理コストが割安。
  // 製品タンクは各30,000bblを内蔵。日量6,400bblを出荷するには港の改修（商業港以上）が要る（港の出荷枠が精製量の上限になる）
  refineryLarge: {
    name: '大規模製油所', icon: '🏭', category: 'refinery', tier: 3,
    cost: 3400000, months: 36, unique: true,
    throughput: 6400,
    capacity: { gasoline: 30000, diesel: 30000, naphtha: 30000, heavy: 30000 },
    opexPerBbl: 0.14,
    fixedPerMonth: 10000,
    desc: '広い用地に蒸留・分解・ユーティリティ一式（日量6,400bbl）＋製品タンク各30,000bbl。小規模より日量あたりが割安で用地も効率的。建設に3年。運転設定は小規模と共通'
  },
  distillation: {
    name: '常圧蒸留塔（増設）', icon: '🗼', category: 'refinery',
    cost: 350000, months: 12,
    requiresBuilding: 'refinery',
    throughput: 1000,
    capacity: { gasoline: 10000, diesel: 10000, naphtha: 10000, heavy: 10000 },   // 増設した塔ごとに製品タンクを内蔵（タンクを別に並べなくても溢れにくい）
    opexPerBbl: 0.18,
    fixedPerMonth: 1200,
    desc: '原油処理を日量1,000bbl増やす（製品タンク各10,000bbl込み）。製油所の完成後に稼働'
  },
  tank_gasoline: { name: 'ガソリンタンク', icon: '🟡', category: 'refinery', cost: 36000, months: 2, capacity: { gasoline: 20000 }, fixedPerMonth: 30, desc: '20,000bbl（旧5,000）' },
  tank_diesel:   { name: '軽油タンク',     icon: '🔵', category: 'refinery', cost: 36000, months: 2, capacity: { diesel: 20000 },   fixedPerMonth: 30, desc: '20,000bbl（旧5,000）' },
  tank_naphtha:  { name: 'ナフサタンク',   icon: '🟣', category: 'refinery', cost: 36000, months: 2, capacity: { naphtha: 20000 },  fixedPerMonth: 30, desc: '20,000bbl（旧5,000）' },
  tank_heavy:    { name: '重油タンク',     icon: '⬛', category: 'refinery', cost: 36000, months: 2, capacity: { heavy: 20000 },    fixedPerMonth: 30, desc: '20,000bbl（旧5,000）' },

  // ---- 段階2a：倉庫（保管クラスの共用プール。capacity は保管枠） ----
  warehouse_bulk:  { name: '素材倉庫', icon: '📦', category: 'storage', tier: 3, cost: 30000, months: 3, capacity: { bulk: 5000 },  fixedPerMonth: 60,  desc: '原料・素材を5,000枠（1t＝1枠）。同じ種類の品目で共用' },
  warehouse_goods: { name: '製品倉庫', icon: '🏬', category: 'storage', tier: 3, cost: 50000, months: 3, capacity: { goods: 2000 }, fixedPerMonth: 100, desc: '製品を2,000枠。自動車は1台3枠、衣料は千着で0.3枠' },

  // ---- 段階2a：加工設備（動作は data/recipes.js の plants）。建設費は tools/calibrate_recipes.py の PLANTS と一致させる。固定費は建設費の0.4%/月 ----
  // 汎用プロセス設備（1基ごとにレシピを選ぶ）
  chemPlant:       { name: '化学プラント', icon: '⚗️', category: 'factory', tier: 3, cost: 800000,  months: 18, fixedPerMonth: 3200, desc: 'ナフサからプラスチック・合成ゴム・界面活性剤・合成繊維（1基1レシピ）' },
  steelMill:       { name: '製鋼所',       icon: '🏭', category: 'factory', tier: 4, cost: 1200000, months: 18, fixedPerMonth: 4800, desc: '鉄鉱石と石炭から鋼材' },
  aluminumSmelter: { name: 'アルミ製錬所', icon: '🔩', category: 'factory', tier: 4, cost: 1000000, months: 18, fixedPerMonth: 4000, desc: 'ボーキサイトからアルミ（電力を多く使う。電力代は操業費に含む）' },
  copperSmelter:   { name: '非鉄製錬所',   icon: '🟠', category: 'factory', tier: 4, cost: 700000,  months: 12, fixedPerMonth: 2800, desc: '銅精鉱から銅' },
  kiln:            { name: '窯業工場',     icon: '🧱', category: 'factory', tier: 4, cost: 500000,  months: 12, fixedPerMonth: 2000, desc: 'ケイ砂・石灰石からガラス、石灰石からセメント（1基1レシピ）' },
  sawmill:         { name: '製材所',       icon: '🪵', category: 'factory', tier: 4, cost: 300000,  months: 8,  fixedPerMonth: 1200, desc: '原木から木材' },
  paperMill:       { name: '製紙工場',     icon: '📄', category: 'factory', tier: 4, cost: 600000,  months: 12, fixedPerMonth: 2400, desc: '木材から紙（コロニーの材料）' },
  // 最終製品の専用工場（レシピ固定。他の製品は作れない）
  detergentFactory: { name: '洗剤・化粧品工場', icon: '🧴', category: 'factory', tier: 3, cost: 1500000, months: 18, fixedPerMonth: 6000,  desc: '界面活性剤とプラスチック（容器）から洗剤・化粧品' },
  garmentFactory:   { name: '縫製工場',         icon: '🧵', category: 'factory', tier: 4, cost: 1200000, months: 18, fixedPerMonth: 4800,  desc: '合成繊維から衣料' },
  batteryFactory:   { name: '電池工場',         icon: '🔋', category: 'factory', tier: 6, cost: 3000000, months: 24, fixedPerMonth: 12000, desc: 'リチウム・アルミ・銅から電池（EV・PCの材料）' },
  tireFactory:      { name: 'タイヤ工場',       icon: '🛞', category: 'factory', tier: 5, cost: 1000000, months: 18, fixedPerMonth: 4000,  desc: '合成ゴムからタイヤ（自動車・EVの材料）' },
  buildmatFactory:  { name: '建材工場',         icon: '🏗️', category: 'factory', tier: 4, cost: 700000,  months: 12, fixedPerMonth: 2800,  desc: '木材・セメント・鋼材から建材' },
  carFactory:       { name: '自動車工場',       icon: '🚗', category: 'factory', tier: 5, cost: 3000000, months: 30, fixedPerMonth: 12000, desc: '鋼材・アルミ・タイヤ・ガラス・プラスチック・銅から自動車' },

  // ---- 段階2b：重工業・先端の専用工場 ----
  shipyard:          { name: '造船所',           icon: '🚢', category: 'factory', tier: 5, cost: 4000000, months: 30, fixedPerMonth: 16000, desc: '鋼材・合金・重油・銅から船舶（年に1隻ほど。完成までまとめて貯まる）' },
  aircraftFactory:   { name: '航空機工場',       icon: '✈️', category: 'factory', tier: 6, cost: 5000000, months: 36, fixedPerMonth: 20000, desc: 'アルミ・合金・半導体・プラスチック・銅から航空機' },
  semiconductorFactory: { name: '半導体工場',    icon: '💾', category: 'factory', tier: 6, cost: 2500000, months: 36, fixedPerMonth: 10000, desc: 'シリコンと銅から半導体（売ることも、PC・航空機・EVの材料にもなる）' },
  pcFactory:         { name: 'PC工場',           icon: '💻', category: 'factory', tier: 6, cost: 2000000, months: 24, fixedPerMonth: 8000,  desc: '半導体・プラスチック・ガラス・アルミからPC' },
  // ---- 段階3b：自家発電所（本部に属さない全社の設備。電力は加工設備のレシピの energyShare から出る需要で、発電した分の送電料金を払い戻す。GAME_DATA.power 参照） ----
  powerPlant:        { name: '自家発電所',       icon: '⚡', category: 'power', tier: 3, maxCount: 6, cost: 1500000, months: 18, fixedPerMonth: 6000, desc: '燃料（重油・石炭・天然ガス）を燃やして、日量100MWhまで発電する。加工設備が買う電力の代わりになる（送電料金の払い戻し）' },
  // ---- 研究棟：研究を始めるのに1棟以上が必要。増やすと研究の基礎の進み（+30%/棟）と加速の上限（1+棟数、最大×4）が上がる。同時に進められる研究は1件のまま ----
  researchLab:       { name: '研究棟',           icon: '🔬', category: 'lab', tier: 5, retired: true, maxCount: 3, cost: 1500000, months: 18, fixedPerMonth: 6000, desc: '【廃止】研究は技術ツリーに置き換わった。建てた研究棟は撤去すると全額が戻る' },
  // ---- 段階2c：研究（buildings.research）が済むと建てられる専用工場 ----
  pharmaFactory:     { name: '製薬工場',         icon: '💊', category: 'factory', tier: 6, cost: 2000000, months: 24, fixedPerMonth: 8000,  desc: '医薬原料とガラスから医薬品' },
  rocketFactory:     { name: 'ロケット工場',     icon: '🚀', category: 'factory', tier: 6, cost: 4000000, months: 36, fixedPerMonth: 16000, desc: '合金・半導体・火薬・アルミからロケット（まとめて高く売れるが、年に数基）' },
  munitionsFactory:  { name: '軍需工場',         icon: '🎖️', category: 'factory', tier: 6, cost: 3000000, months: 30, fixedPerMonth: 12000, desc: '鋼材・合金・半導体・火薬から兵器（国家契約は段階3）' },
  // ---- 技術ツリーで開く新設の工場（data/tree.js のノードが解放する。tier は付けない）----
  fineChemPlant:     { name: '精密化学工場',     icon: '🧪', category: 'factory', tier: 6, cost: 1000000, months: 24, fixedPerMonth: 4000, desc: 'ナフサから医薬原料（製薬の入口）。ステンレスの反応釜と精留塔' },
  explosivesFactory: { name: '火薬工場',         icon: '💥', category: 'factory', tier: 6, cost: 900000, months: 18, fixedPerMonth: 3600, desc: '硝石から火薬（兵器・ロケットの入口）。盛り土で囲んだ貯蔵庫と柵' },
  colonyFactory:     { name: '宇宙コロニー工場', icon: '🛰️', category: 'factory', tier: 6, cost: 10000000, months: 48, fixedPerMonth: 40000, desc: '船と航空機以外のすべての最終製品と合金から、葉巻型の宇宙コロニーを組み立てる（増設モジュールなし。まとめて高く売れるが、年に1基ほど。相場は特に荒い）' },
  offshoreFactory:   { name: '洋上プラットフォーム工場', icon: '🛢️', category: 'factory', tier: 6, cost: 5000000, months: 36, fixedPerMonth: 20000, desc: 'セメント・ガラス・PC・鋼材・合金から、洋上の資源基地・発電所を組み立てる（増設モジュールなし。まとめて高く売れるが、年に2基ほど。安定した相場）' },
  aiDefenseFactory:  { name: 'AI防衛システム工場', icon: '🛡️', category: 'factory', tier: 6, cost: 9000000, months: 48, fixedPerMonth: 36000, desc: '半導体・兵器・ロケット・火薬・PC・合金から、AI防衛システムを組み立てる（増設モジュールなし。まとめて高く売れるが、年に1式ほど。戦争のイベントで相場が荒れる）' },
  cableFactory:      { name: '電線工場', icon: '🔗', category: 'factory', tier: 6, cost: 900000, months: 18, fixedPerMonth: 3600, desc: '銅とアルミを引いて被覆し、電線・ケーブルにする（電機ラインのTier 3）' },
  fiberFactory:      { name: '光ファイバー工場', icon: '💡', category: 'factory', tier: 6, cost: 1200000, months: 18, fixedPerMonth: 4800, desc: 'ガラスと珪砂から母材を作り、塔で細く引いて光ファイバーにする（光・通信ラインのTier 3）' },
  motorFactory:      { name: 'モーター・変圧器工場', icon: '🔌', category: 'factory', tier: 6, cost: 2000000, months: 24, fixedPerMonth: 8000, desc: '電線・鋼材・銅から、モーターと変圧器を作る（電機ラインのTier 4）' },
  powerEquipFactory: { name: '発電・送電設備工場', icon: '🌬️', category: 'factory', tier: 6, cost: 3500000, months: 30, fixedPerMonth: 14000, desc: 'モーター・電線・鋼材・合金・ガラス・シリコンから、風力・太陽光・送電網の設備を作る（電機ラインのTier 5。AI防衛システムの材料）' },
  commGearFactory:   { name: '通信機器工場', icon: '📡', category: 'factory', tier: 6, cost: 2500000, months: 24, fixedPerMonth: 10000, desc: '光ファイバー・銅・プラスチック・半導体から、ルーターや送受信機などの通信機器を組み立てる（光・通信ラインのTier 4）' },
  satelliteFactory:  { name: '通信衛星工場', icon: '🛰️', category: 'factory', tier: 6, cost: 4000000, months: 36, fixedPerMonth: 16000, desc: '通信機器・半導体・合金から、通信衛星と通信網を組み立てる（光・通信ラインのTier 5。AI防衛システムの材料）' },
  evFactory:         { name: '電池・EV工場',     icon: '🔋', category: 'factory', tier: 6, cost: 3500000, months: 30, fixedPerMonth: 14000, desc: '鋼材・アルミ・タイヤ・電池・モーター・半導体から電池・EV' }
};


// 電力（段階3b）。電力は加工設備の操業費（opexPerUnit）に含まれていて、レシピの energyShare（0〜1）がその電力分の割合。
//   電力需要（MWh）＝ 生産量 × opexPerUnit × energyShare ÷ gridPrice。自家発電所は需要の範囲で発電し、発電量 × gridPrice × 物価指数を払い戻す。
//   燃料は在庫から燃やす（出荷から確保する）。自動購入ONなら足りない分を市場で買う。燃料の perMWh は1MWhあたりの燃料量
GAME_DATA.power = {
  gridPrice: 15,          // 送電単価（1950年ドル/MWh）。電力分を含む操業費の逆算に使った単価と同じ
  plantMWh: 100,          // 自家発電所1棟の日量（MWh/日）
  fuels: {
    heavy:      { perMWh: 1.7 },    // 重油（bbl）
    coal:       { perMWh: 0.45 },   // 石炭（t）
    naturalGas: { perMWh: 0.25 }    // 天然ガス（t）
  }
};

// 蒸留の運転モード（産出割合。残りはロス）
// 1950年代初頭の単純な常圧蒸留（分解装置なし）の得率をざっくり想定
GAME_DATA.distillModes = {
  standard: { name: '標準',         yields: { gasoline: 0.25, naphtha: 0.13, diesel: 0.27, heavy: 0.33 } },
  gasoline: { name: 'ガソリン重視', yields: { gasoline: 0.31, naphtha: 0.09, diesel: 0.23, heavy: 0.35 } },
  diesel:   { name: '軽油重視',     yields: { gasoline: 0.20, naphtha: 0.12, diesel: 0.34, heavy: 0.32 } }
};

// 建築期間の倍率（設備・増設モジュール・鉱山・貯鉱場・港の改修）。months は元の値のまま、日数だけこの倍率で縮める。研究は対象外
GAME_DATA.buildTimeMul = 1 / 3;

// 加工設備に付属する製品置き場（日数分）。設備を建てただけで、その設備の製品を plantStoreDays 日分は置ける（倉庫が無くても最低限稼働できる）。港の出荷間隔（最長30日）に合わせる
GAME_DATA.plantStoreDays = 30;

// 移設・撤去：fee＝移設の費用（建設費×この率。増設モジュールもそれぞれ）、refund＝撤去で戻る率、daysMul＝移設の工期（建設の日数×この率。設備は移設中は止まる）
GAME_DATA.relocate = { fee: 0.2, refund: 0.5, daysMul: 0.3 };
