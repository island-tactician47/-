// 市況イベント。発生すると自動で一時停止し、通知する。
// segment＝そのイベントが属する本部（data/segments.js の本部ID：oil / metal / ceramics / forestry / consumer / transport / advanced）。null＝景気全般（どの会社にも起こる）。
//   その本部の事業（設備・鉱山）をしていないときは、その本部のイベントは起こさない。抽選は「起こせる本部（と景気全般）を均等に選ぶ → その中で重みで選ぶ」ので、イベントの数が多い本部に偏らない。
// effects: 品目ごとの価格倍率。months: 効果の続く月数（徐々に元に戻る）
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.events = {
  monthlyChance: 0.03,
  list: [
    // ---- 景気全般
    { id: 'recession', segment: null, weight: 2, title: '景気後退', text: '工場の操業が落ち、素材・製品全般の需要が鈍っている。', effects: { crude: 0.9, gasoline: 0.92, diesel: 0.9, naphtha: 0.9, heavy: 0.9, steel: 0.9, cement: 0.92, lumber: 0.92, plastic: 0.92, car: 0.93 }, months: 10 },
    { id: 'boom', segment: null, weight: 2, title: '好景気', text: '設備投資が盛んで、素材と製品の需要が広がっている。', effects: { steel: 1.12, cement: 1.12, plastic: 1.1, lumber: 1.1, car: 1.08, gasoline: 1.08 }, months: 10 },
    // ---- 石油本部
    { id: 'mideast', segment: 'oil', weight: 3, title: '中東で政情不安', text: '産油国で政変。原油の供給不安から相場が急騰している。', effects: { crude: 1.35, gasoline: 1.15, diesel: 1.15, heavy: 1.2 }, months: 8 },
    { id: 'glut', segment: 'oil', weight: 3, title: '新油田の発見で供給過剰', text: '海外で巨大油田が見つかり、原油がだぶついている。', effects: { crude: 0.75, heavy: 0.85 }, months: 10 },
    { id: 'coldwave', segment: 'oil', weight: 2, title: '記録的な寒波', text: '暖房用の重油・灯油の需要が急増。', effects: { heavy: 1.4, diesel: 1.2 }, months: 4 },
    { id: 'cars', segment: 'oil', weight: 2, title: '自家用車ブーム', text: '国産乗用車が売れ始め、ガソリン需要が伸びている。', effects: { gasoline: 1.25 }, months: 12 },
    { id: 'trucks', segment: 'oil', weight: 2, title: '道路整備でトラック輸送が拡大', text: '軽油の需要が増えている。', effects: { diesel: 1.25 }, months: 12 },
    { id: 'chem', segment: 'oil', weight: 1, title: '化学メーカーがナフサを買い集め', text: '石油化学の試験プラントが相次ぎ、ナフサが品薄に。', effects: { naphtha: 1.45 }, months: 6 },
    // ---- 金属本部（鉄鋼・アルミ・銅）
    { id: 'steelboom', segment: 'metal', weight: 3, title: '鉄鋼需要が拡大', text: '造船・建設・機械向けの注文が増え、鋼材が足りない。', effects: { steel: 1.25, alloy: 1.1 }, months: 10 },
    { id: 'orescare', segment: 'metal', weight: 2, title: '鉄鉱石の供給不安', text: '主要な産出国の輸出が滞り、鉄鉱石と石炭が値上がりしている。', effects: { ironore: 1.35, coal: 1.2 }, months: 8 },
    { id: 'copperrush', segment: 'metal', weight: 2, title: '銅の国際価格が急騰', text: '電線・電機向けの需要で、銅が高騰している。', effects: { copperore: 1.4, copper: 1.3 }, months: 9 },
    { id: 'alunew', segment: 'metal', weight: 2, title: 'アルミの新工法で供給増', text: '電力を節約する新工法で、アルミ地金がだぶついている。', effects: { aluminum: 0.8, bauxite: 0.9 }, months: 10 },
    { id: 'coalstrike', segment: 'metal', weight: 1, title: '炭鉱でストライキ', text: '石炭の供給が止まり、製鉄の原料が逼迫している。', effects: { coal: 1.5 }, months: 4 },
    // ---- 窯業本部（セメント・ガラス・シリコン）
    { id: 'buildrush', segment: 'ceramics', weight: 3, title: '建設ラッシュ', text: '道路・ビル・ダムの工事が相次ぎ、セメントの需要が急増している。', effects: { cement: 1.3, limestone: 1.15, glass: 1.1 }, months: 10 },
    { id: 'glassdemand', segment: 'ceramics', weight: 2, title: '板ガラスの需要が拡大', text: 'ビルの窓や自動車向けに、ガラスの注文が増えている。', effects: { glass: 1.25 }, months: 9 },
    { id: 'siliconboom', segment: 'ceramics', weight: 2, title: '高純度シリコンの引き合い', text: '電子産業向けに、ケイ砂とシリコンの買いが強い。', effects: { silicon: 1.3, silica: 1.15 }, months: 8 },
    { id: 'quarryglut', segment: 'ceramics', weight: 1, title: '石灰石の増産', text: '新しい採石場が稼働し、石灰石がだぶついている。', effects: { limestone: 0.8, cement: 0.92 }, months: 8 },
    // ---- 林業本部（原木・製材・紙）
    { id: 'timberboom', segment: 'forestry', weight: 3, title: '住宅ブームで木材が高騰', text: '住宅の着工が増え、製材と原木が足りない。', effects: { lumber: 1.3, logs: 1.2 }, months: 10 },
    { id: 'paperdemand', segment: 'forestry', weight: 2, title: '紙の需要が増加', text: '出版・包装向けで、紙の注文が増えている。', effects: { paper: 1.25 }, months: 9 },
    { id: 'forestfire', segment: 'forestry', weight: 1, title: '山火事で原木が不足', text: '大規模な山火事で伐採が止まり、原木が値上がりしている。', effects: { logs: 1.5, lumber: 1.15 }, months: 5 },
    { id: 'importwood', segment: 'forestry', weight: 2, title: '輸入材が増える', text: '安い輸入材が入り、国産の製材が値下がりしている。', effects: { lumber: 0.85, logs: 0.85 }, months: 10 },
    // ---- 生活・消費財本部
    { id: 'consumerboom', segment: 'consumer', weight: 3, title: '消費ブーム', text: '暮らしが豊かになり、洗剤・衣料・日用品がよく売れる。', effects: { detergent: 1.2, clothing: 1.2, pharma: 1.1 }, months: 12 },
    { id: 'fashion', segment: 'consumer', weight: 2, title: '流行で衣料の需要が増える', text: '新しい流行で、衣料の注文が急に増えた。', effects: { clothing: 1.3 }, months: 6 },
    { id: 'housing', segment: 'consumer', weight: 2, title: '住宅の着工が増える', text: '建材の需要が高まっている。', effects: { buildmat: 1.25 }, months: 10 },
    { id: 'hygiene', segment: 'consumer', weight: 1, title: '衛生意識の高まり', text: '洗剤と医薬品の需要が伸びている。', effects: { detergent: 1.25, pharma: 1.15 }, months: 8 },
    // ---- 輸送機本部（自動車・造船・航空・EV）
    { id: 'carboom', segment: 'transport', weight: 3, title: '自動車の購買ブーム', text: '所得の増加で、乗用車がよく売れている。', effects: { car: 1.25, ev: 1.1 }, months: 12 },
    { id: 'shipping', segment: 'transport', weight: 2, title: '海運が好況', text: '貿易の拡大で、船舶の発注が相次いでいる。', effects: { ship: 1.25 }, months: 12 },
    { id: 'evsubsidy', segment: 'transport', weight: 2, title: 'EVの補助金が決まる', text: '電池・EVの需要が急に伸びている。', effects: { ev: 1.3 }, months: 8 },
    { id: 'airtravel', segment: 'transport', weight: 2, title: '航空需要の拡大', text: '空の旅が広がり、航空機の引き合いが強い。', effects: { aircraft: 1.2 }, months: 12 },
    { id: 'carslump', segment: 'transport', weight: 1, title: '自動車の販売不振', text: '買い控えで、乗用車の売れ行きが落ちている。', effects: { car: 0.85 }, months: 8 },
    // ---- 先端本部（半導体・PC・ロケット・兵器）
    { id: 'chipboom', segment: 'advanced', weight: 3, title: '半導体ブーム', text: '電子機器の需要で、半導体とPCが足りない。', effects: { semiconductor: 1.4, pc: 1.2 }, months: 10 },
    { id: 'chipglut', segment: 'advanced', weight: 2, title: '半導体の在庫調整', text: '作りすぎで、半導体の価格が下がっている。', effects: { semiconductor: 0.75 }, months: 8 },
    { id: 'spacerace', segment: 'advanced', weight: 2, title: '宇宙開発ブーム', text: '国家プロジェクトで、ロケットの発注が増えている。', effects: { rocket: 1.3 }, months: 12 },
    { id: 'colonyboom', segment: 'space', weight: 2, title: '宇宙移住ブーム', text: '各国が宇宙居住に乗り出し、コロニーの引き合いが強い。', effects: { colony: 1.4 }, months: 18 },
    { id: 'colonyslump', segment: 'space', weight: 2, title: '宇宙計画の見直し', text: '大型の宇宙計画が見直され、コロニーの発注が冷え込んでいる。', effects: { colony: 0.7 }, months: 18 },
    { id: 'defense', segment: 'advanced', weight: 2, title: '防衛予算の増額', text: '兵器の発注が増えている。', effects: { weapon: 1.25 }, months: 10 },
    { id: 'pcwave', segment: 'advanced', weight: 1, title: 'パソコンの普及', text: '家庭にもPCが入り、需要が伸びている。', effects: { pc: 1.3 }, months: 10 }
  ]
};
