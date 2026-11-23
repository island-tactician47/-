// 鉱区（採掘地）。richness は実際の豊かさで、買う前は調査の推定幅しか見えない。
// 最初の油井が完成すると実際の値が判明する。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.leases = {
  kitahama:   { name: '北浜鉱区',   slots: 6,  richness: 1.0, estimate: [0.9, 1.1], cost: 0,      wellCostMul: 1.0, owned: true, desc: '祖父の代からの鉱区。港に近い' },
  kurosawa:   { name: '黒沢鉱区',   slots: 12, richness: 0.8, estimate: [0.6, 1.2], cost: 25000,  wellCostMul: 1.0, desc: '広いが油層は薄いとの噂' },
  nishiyama:  { name: '西山鉱区',   slots: 10, richness: 1.25, estimate: [0.9, 1.5], cost: 60000, wellCostMul: 1.1, desc: '山あいで掘削がやや割高' },
  higashino:  { name: '東野鉱区',   slots: 15, richness: 1.05, estimate: [0.8, 1.3], cost: 70000, wellCostMul: 1.0, desc: '平野部の大きな鉱区' },
  okinoshima: { name: '沖ノ島鉱区', slots: 20, richness: 1.6, estimate: [1.1, 2.0], cost: 180000, wellCostMul: 1.6, desc: '浅海の島。掘削費は高いが有望' },
  tairikudana:{ name: '大陸棚鉱区', slots: 25, richness: 3.0, estimate: [2.0, 4.0], cost: 1500000, wellCostMul: 4.0, cluster: 'offshore', desc: '沖合の大油田。海底掘削で費用は桁違いだが、国内の原油を支える本命' }
};

// 鉱山の鉱区（原料ごと）。s.mineSites は初めて買うまで作らない。richness＝日量の倍率、estimate＝判明前に見える推定
GAME_DATA.mineSites = {
  coal_a: { res: 'coal',      name: '北部炭田',     slots: 3, richness: 1.0, estimate: [0.8, 1.3], cost: 40000,  desc: '浅い炭層の小さな炭田' },
  coal_b: { res: 'coal',      name: '西の厚炭層',   slots: 4, richness: 1.3, estimate: [1.0, 1.6], cost: 90000,  desc: '厚い炭層。掘る価値は大きい' },
  iron_a: { res: 'ironore',   name: '赤土の鉱床',   slots: 3, richness: 1.0, estimate: [0.7, 1.3], cost: 40000,  desc: '地表に近い鉄の鉱床' },
  iron_b: { res: 'ironore',   name: '大鉱脈',       slots: 4, richness: 1.4, estimate: [1.0, 1.8], cost: 100000, desc: '広い鉱脈。品位が高いらしい' },
  cu_a:   { res: 'copperore', name: '山あいの銅脈', slots: 2, richness: 1.0, estimate: [0.7, 1.4], cost: 120000, desc: '細い銅の鉱脈' },
  cu_b:   { res: 'copperore', name: '斑岩銅鉱床',   slots: 3, richness: 1.4, estimate: [1.0, 1.9], cost: 300000, desc: '大規模だが開発費は重い' },
  si_a:   { res: 'silica',    name: '白砂の海岸',   slots: 4, richness: 1.0, estimate: [0.8, 1.2], cost: 20000,  desc: '町の近くの白い砂浜' },
  si_b:   { res: 'silica',    name: '珪砂の丘',     slots: 6, richness: 1.3, estimate: [1.0, 1.6], cost: 50000,  desc: '丘ごと純度の高いケイ砂' },
  // 無尽蔵の鉱床（終盤）：枠は無制限・日量は減らない。Tier 6 のノードを1つ開くと買える（Engine.endlessOpen）。endless：true
  inf_coal: { res: 'coal',      name: '無尽蔵の炭田',     slots: Infinity, richness: 1.0, estimate: [1.0, 1.0], cost: 6000000, endless: true, desc: '掘っても枯れない巨大な炭層。いくつでも鉱山を建てられる' },
  inf_iron: { res: 'ironore',   name: '無尽蔵の鉄鉱床',   slots: Infinity, richness: 1.0, estimate: [1.0, 1.0], cost: 6000000, endless: true, desc: '掘っても枯れない巨大な鉱脈。いくつでも鉱山を建てられる' },
  inf_cu:   { res: 'copperore', name: '無尽蔵の銅鉱床',   slots: Infinity, richness: 1.0, estimate: [1.0, 1.0], cost: 8000000, endless: true, desc: '掘っても枯れない巨大な銅鉱床。いくつでも鉱山を建てられる' },
  inf_si:   { res: 'silica',    name: '無尽蔵のケイ砂層', slots: Infinity, richness: 1.0, estimate: [1.0, 1.0], cost: 5000000, endless: true, desc: '掘っても尽きない広大な砂層。いくつでも鉱山を建てられる' }
};

// 無尽蔵の油田（終盤。GAME_DATA.leases に足すと newGame が回って元の世界のハッシュが動くので別のキー）。枠は無制限・日量は減らない。Tier 6 のノードを1つ開くと買える
GAME_DATA.endlessLeases = {
  endless: { name: '無尽蔵の油田', slots: Infinity, richness: 1.0, estimate: [1.0, 1.0], cost: 6000000, wellCostMul: 1.5, endless: true, desc: '枯れない巨大な油田。いくつでも油井を掘れる（掘削費 ×1.5）' }
};

