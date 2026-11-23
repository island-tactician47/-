// 本部（セグメント）。画面で品目と設備を整理するための分類で、ゲームの計算には使わない（現金や意思決定は全社で1つ）。
// 素材までは出発原料の系統で1つの本部に収まる。最終製品だけが複数の本部の素材を使うので、製品系の本部は別に立てる。
// GAME_DATA.segments[id] = { name, icon, group: 'material'（素材系）| 'product'（製品系）, fullName/fullWhen?: 名前が変わる条件 }
//   石油本部は、化学プラントを1基でも建てたら「石化本部」の名前になる（化学部門が本格的になるまでは石油本部）
// GAME_DATA.segmentOf.resources / .buildings：品目・設備 → 本部のid。設備は加工設備なら出力の品目と同じ本部（selftest_real が検査）
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.segments = {
  oil:       { name: '石油本部', icon: '🛢️', group: 'material', fullName: '石化本部', fullWhen: { building: 'chemPlant' } },
  metal:     { name: '金属本部', icon: '⛓️', group: 'material' },
  ceramics:  { name: '窯業本部', icon: '🧱', group: 'material' },
  forestry:  { name: '林業本部', icon: '🌲', group: 'material' },
  consumer:  { name: '生活・消費財本部', icon: '🧴', group: 'product' },
  transport: { name: '輸送機本部', icon: '🚗', group: 'product' },
  advanced:  { name: '先端・防衛本部', icon: '💾', group: 'product' },
  space:     { name: '宇宙事業', icon: '🛰️', group: 'product' },
  mega:      { name: '大型プロジェクト', icon: '🏗️', group: 'product' },
  electric:  { name: '電機・通信本部', icon: '🔌', group: 'product' }   // 洋上プラットフォーム・超音速旅客機・AI防衛システムの工場（コロニーの仲間）   // コロニー工場だけ。損益を分けて数える
};
GAME_DATA.segmentOrder = ['oil', 'metal', 'ceramics', 'forestry', 'consumer', 'transport', 'advanced', 'space', 'mega', 'electric'];
(function () {
  const R = {}, B = {};
  const set = (map, seg, keys) => keys.split(/\s+/).forEach(k => { map[k] = seg; });
  set(R, 'oil', 'crude gasoline diesel naphtha heavy naturalGas plastic rubber surfactant fiber pharmaMat explosive');
  set(R, 'metal', 'coal ironore bauxite copperore rareMetal lithiumOre steel aluminum copper alloy lithium cable');
  set(R, 'ceramics', 'limestone silica glass cement silicon opticFiber');
  set(R, 'forestry', 'logs lumber paper');
  set(R, 'consumer', 'detergent clothing pharma buildmat');
  set(R, 'transport', 'car ship aircraft ev');
  set(R, 'advanced', 'semiconductor pc rocket weapon');
  set(R, 'space', 'colony');
  set(R, 'mega', 'offshore aiDefense');
  set(R, 'electric', 'motor commGear powerEquip comsat');
  set(B, 'oil', 'oilWell crudeTank refinery refineryLarge distillation tank_gasoline tank_diesel tank_naphtha tank_heavy chemPlant fineChemPlant explosivesFactory');
  set(B, 'metal', 'steelMill aluminumSmelter copperSmelter');
  set(B, 'ceramics', 'kiln');
  set(B, 'forestry', 'sawmill paperMill');
  set(B, 'consumer', 'detergentFactory garmentFactory pharmaFactory buildmatFactory');
  set(B, 'transport', 'carFactory shipyard aircraftFactory evFactory');
  set(B, 'advanced', 'semiconductorFactory pcFactory rocketFactory munitionsFactory');
  set(B, 'space', 'colonyFactory');
  set(B, 'mega', 'offshoreFactory aiDefenseFactory');
  set(B, 'electric', 'motorFactory powerEquipFactory commGearFactory satelliteFactory');
  GAME_DATA.segmentOf = { resources: R, buildings: B };   // 倉庫・研究棟は本部に属さない（全社）
})();
