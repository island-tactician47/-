// 難易度は初期資金（と最初から抱えている融資）で調整する。ゲームのルールは共通。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.difficulties = {
  rich:     { name: '潤沢',             cash: 900000, loans: {}, desc: '借金なし・資金たっぷり。製油所まで自己資金で届く' },
  tight:    { name: '自己資金のみ',     cash: 250000, loans: {}, desc: '借金なし。ただし融資を使わないと拡大が遅い' },
  indebted: { name: 'もともと借りている', cash: 280000, loans: { chigin: 200000 }, desc: '地方銀行から$200kを借りた状態で創業。返済に追われる' }
};
GAME_DATA.inflationPerYear = 0.015; // 物価上昇（価格・建設費・融資枠）
GAME_DATA.startYear = 1950;
