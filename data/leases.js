// 鉱区（採掘地）。richness は実際の豊かさで、買う前は調査の推定幅しか見えない。
// 最初の油井が完成すると実際の値が判明する。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.leases = {
  kitahama:   { name: '北浜鉱区',   slots: 6,  richness: 1.0, estimate: [0.9, 1.1], cost: 0,      wellCostMul: 1.0, owned: true, desc: '祖父の代からの鉱区。港に近い' },
  kurosawa:   { name: '黒沢鉱区',   slots: 12, richness: 0.8, estimate: [0.6, 1.2], cost: 25000,  wellCostMul: 1.0, desc: '広いが油層は薄いとの噂' },
  nishiyama:  { name: '西山鉱区',   slots: 10, richness: 1.25, estimate: [0.9, 1.5], cost: 60000, wellCostMul: 1.1, desc: '山あいで掘削がやや割高' },
  higashino:  { name: '東野鉱区',   slots: 15, richness: 1.05, estimate: [0.8, 1.3], cost: 70000, wellCostMul: 1.0, desc: '平野部の大きな鉱区' },
  okinoshima: { name: '沖ノ島鉱区', slots: 20, richness: 1.6, estimate: [1.1, 2.0], cost: 180000, wellCostMul: 1.6, desc: '浅海の島。掘削費は高いが有望' }
};

// 鉱山の鉱区（原料ごと）。s.mineSites は初めて買うまで作らない。richness＝日量の倍率、estimate＝判明前に見える推定
GAME_DATA.mineSites = {
  coal_a: { res: 'coal',      name: '北部炭田',     slots: 3, richness: 1.0, estimate: [0.8, 1.3], cost: 40000,  desc: '浅い炭層の小さな炭田' },
  coal_b: { res: 'coal',      name: '西の厚炭層',   slots: 4, richness: 1.3, estimate: [1.0, 1.6], cost: 90000,  desc: '厚い炭層。掘る価値は大きい' },
  iron_a: { res: 'ironore',   name: '赤土の鉱床',   slots: 3, richness: 1.0, estimate: [0.7, 1.3], cost: 40000,  desc: '地表に近い鉄の鉱床' },
  iron_b: { res: 'ironore',   name: '大鉱脈',       slots: 4, richness: 1.4, estimate: [1.0, 1.8], cost: 100000, desc: '広い鉱脈。品位が高いらしい' },
  cu_a:   { res: 'copperore', name: '山あいの銅脈', slots: 2, richness: 1.0, estimate: [0.7, 1.4], cost: 120000, desc: '細い銅の鉱脈' },
  cu_b:   { res: 'copperore', name: '斑岩銅鉱床',   slots: 3, richness: 1.4, estimate: [1.0, 1.9], cost: 300000, desc: '大規模だが開発費は重い' },
  ls_a:   { res: 'limestone', name: '石灰岩の丘',   slots: 4, richness: 1.0, estimate: [0.8, 1.2], cost: 20000,  desc: '町の近くの石灰岩の丘' },
  ls_b:   { res: 'limestone', name: '白い山',       slots: 6, richness: 1.3, estimate: [1.0, 1.6], cost: 50000,  desc: '山ごとほぼ石灰岩' }
};
