// 市況イベント（重み付き抽選）。発生すると自動で一時停止し、通知する。
// effects: 品目ごとの価格倍率。months: 効果の続く月数（徐々に元に戻る）
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.events = {
  monthlyChance: 0.025,
  list: [
    { id: 'mideast',  weight: 3, title: '中東で政情不安', text: '産油国で政変。原油の供給不安から相場が急騰している。', effects: { crude: 1.35, gasoline: 1.15, diesel: 1.15, heavy: 1.2 }, months: 8 },
    { id: 'glut',     weight: 3, title: '新油田の発見で供給過剰', text: '海外で巨大油田が見つかり、原油がだぶついている。', effects: { crude: 0.75, heavy: 0.85 }, months: 10 },
    { id: 'coldwave', weight: 2, title: '記録的な寒波', text: '暖房用の重油・灯油の需要が急増。', effects: { heavy: 1.4, diesel: 1.2 }, months: 4 },
    { id: 'cars',     weight: 2, title: '自家用車ブーム', text: '国産乗用車が売れ始め、ガソリン需要が伸びている。', effects: { gasoline: 1.25 }, months: 12 },
    { id: 'trucks',   weight: 2, title: '道路整備でトラック輸送が拡大', text: '軽油の需要が増えている。', effects: { diesel: 1.25 }, months: 12 },
    { id: 'recession',weight: 2, title: '景気後退', text: '工場の操業が落ち、石油製品全般の需要が鈍っている。', effects: { crude: 0.88, gasoline: 0.9, diesel: 0.85, naphtha: 0.85, heavy: 0.85 }, months: 9 },
    { id: 'chem',     weight: 1, title: '化学メーカーがナフサを買い集め', text: '石油化学の試験プラントが相次ぎ、ナフサが品薄に。', effects: { naphtha: 1.45 }, months: 6 }
  ]
};
