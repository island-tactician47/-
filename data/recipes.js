// レシピと加工設備の定義（段階2a・2b・2c）。file:// で開いても動くよう、JSONではなくJSファイルで定義している
// ※ opexPerUnit・speed・throughput は tools/calibrate_recipes.py が目標の回収年数から逆算した初期値（仮）。調整はそちらの表を直して再生成するか、ここを直接編集する
//
// GAME_DATA.recipes[id] = {
//   name:    表示名
//   inputs:  { 品目キー: 主産物1単位あたりの必要量 }
//   outputs: { 品目キー: 主産物1単位あたりの産出量 }（最初のキーが主産物で、量は1）
//   opexPerUnit: 主産物1単位あたりの換算費用（労務・エネルギー・間接費。1950年ドル。物価指数を掛ける）
//   energyShare: opexPerUnit のうち電力の割合（0〜1。GAME_DATA.power）。電力需要＝生産量×opexPerUnit×energyShare÷gridPrice
//   speed:   日量の倍率（既定1）。設備の throughput × speed がそのレシピの実際の日量。単価が桁違いのレシピ（ガラスとセメントなど）を同じ設備で扱うため
//   research: 研究開発（data/research.js）のid。完了するまでこのレシピは選べない（設備の先頭のレシピには付けない）
//   tier:    レシピ単位の解放ティア（既定は設備と同じ）。設備より後に解放する追加レシピ（製鋼所の合金、窯業工場のシリコン、非鉄製錬所のリチウム）用。設備の先頭のレシピは設備と同じ tier にする
// }
// GAME_DATA.plants[type] = {
//   recipes:    [選べるレシピのid]（1件なら専用工場で固定、複数なら1基ごとに選ぶ）
//   throughput: 基準の日量（主産物の単位/日）
// }
// 扱わないもの（2cで追加）：セメントの燃料（石炭）、ガラスのソーダ灰は省略。紙は2aでは売る以外の使い道がない
window.GAME_DATA = window.GAME_DATA || {};
// 新しく建てた加工設備の、原料の自動購入（市場から輸入）の既定。true＝最初からオン（false にすると従来のオフ）。建てたあとは、工場画面で切り替えられる
GAME_DATA.plantAutoBuyDefault = true;
GAME_DATA.recipes = {
  plastic: { name: 'プラスチック', inputs: { naphtha: 12 }, outputs: { plastic: 1 }, opexPerUnit: 435.5, energyShare: 0.18, speed: 0.33 },
  rubber: { name: '合成ゴム', inputs: { naphtha: 9 }, outputs: { rubber: 1 }, opexPerUnit: 241.0, energyShare: 0.15, speed: 0.5 },
  surfactant: { name: '界面活性剤', inputs: { naphtha: 4 }, outputs: { surfactant: 1 }, opexPerUnit: 297.9, energyShare: 0.12, speed: 0.5 },
  fiber: { name: '合成繊維', inputs: { naphtha: 11 }, outputs: { fiber: 1 }, opexPerUnit: 616.0, energyShare: 0.18, speed: 0.2 },
  steel: { name: '鋼材', inputs: { ironore: 1.6, coal: 0.8 }, outputs: { steel: 1 }, opexPerUnit: 68.9, energyShare: 0.22 },
  aluminum: { name: 'アルミ', inputs: { bauxite: 4.4 }, outputs: { aluminum: 1 }, opexPerUnit: 230.3, energyShare: 0.45 },
  copper: { name: '銅', inputs: { copperore: 3.5 }, outputs: { copper: 1 }, opexPerUnit: 27.4, energyShare: 0.3 },
  glass: { name: 'ガラス', inputs: { silica: 0.65, limestone: 0.25 }, outputs: { glass: 1 }, opexPerUnit: 190.1, energyShare: 0.3 },
  cement: { name: 'セメント', inputs: { limestone: 1.4 }, outputs: { cement: 1 }, opexPerUnit: 6.2, energyShare: 0.3, speed: 14 },
  lumber: { name: '木材', inputs: { logs: 1.7 }, outputs: { lumber: 1 }, opexPerUnit: 18.8, energyShare: 0.1 },
  paper: { name: '紙', inputs: { logs: 2.2 }, outputs: { paper: 1 }, opexPerUnit: 25.4, energyShare: 0.25 },
  detergent: { name: '洗剤・化粧品', inputs: { surfactant: 0.5, plastic: 0.1 }, outputs: { detergent: 1 }, opexPerUnit: 875.4, energyShare: 0.06 },
  clothing: { name: '衣料', inputs: { fiber: 0.2 }, outputs: { clothing: 1 }, opexPerUnit: 1745.0, energyShare: 0.06 },
  buildmat: { name: '建材', inputs: { lumber: 0.5, cement: 0.3, steel: 0.2 }, outputs: { buildmat: 1 }, opexPerUnit: 15.1, energyShare: 0.08 },
  car: { name: '自動車', inputs: { steel: 1.0, aluminum: 0.05, rubber: 0.1, glass: 0.05, plastic: 0.02, copper: 0.03 }, outputs: { car: 1 }, opexPerUnit: 721.3, energyShare: 0.07 },
  alloy: { name: '合金', inputs: { steel: 0.85, rareMetal: 0.15 }, outputs: { alloy: 1 }, opexPerUnit: 366.4, energyShare: 0.2, speed: 0.125, tier: 5 },
  silicon: { name: 'シリコン', inputs: { silica: 2.2 }, outputs: { silicon: 1 }, opexPerUnit: 1514.1, energyShare: 0.4, speed: 0.12, tier: 6 },
  lithium: { name: 'リチウム', inputs: { lithiumOre: 6 }, outputs: { lithium: 1 }, opexPerUnit: 2555.7, energyShare: 0.2, speed: 0.105, tier: 6 },
  ship: { name: '船舶', inputs: { steel: 3000, alloy: 400, heavy: 2000, copper: 60 }, outputs: { ship: 1 }, opexPerUnit: 609455.0, energyShare: 0.05 },
  aircraft: { name: '航空機', inputs: { aluminum: 40, alloy: 40, semiconductor: 2, plastic: 5, copper: 3 }, outputs: { aircraft: 1 }, opexPerUnit: 875493.8, energyShare: 0.05 },
  semiconductor: { name: '半導体', inputs: { silicon: 0.85, copper: 0.002 }, outputs: { semiconductor: 1 }, opexPerUnit: 184.0, energyShare: 0.3 },
  pc: { name: 'PC', inputs: { semiconductor: 0.05, plastic: 0.01, glass: 0.005, aluminum: 0.01 }, outputs: { pc: 1 }, opexPerUnit: 12.2, energyShare: 0.08 },
  ev: { name: '電池・EV', inputs: { steel: 0.8, aluminum: 0.3, rubber: 0.08, lithium: 0.2, semiconductor: 0.05, copper: 0.1 }, outputs: { ev: 1 }, opexPerUnit: 28.2, energyShare: 0.08 },
  pharmaMat: { name: '医薬原料', inputs: { naphtha: 15 }, outputs: { pharmaMat: 1 }, opexPerUnit: 1632.1, energyShare: 0.1, speed: 0.07 },
  explosive: { name: '火薬', inputs: { naturalGas: 2 }, outputs: { explosive: 1 }, opexPerUnit: 614.9, energyShare: 0.1, speed: 0.15 },
  pharma: { name: '医薬品', inputs: { pharmaMat: 1.2, glass: 0.4 }, outputs: { pharma: 1 }, opexPerUnit: 238.0, energyShare: 0.1 },
  rocket: { name: 'ロケット', inputs: { alloy: 400, semiconductor: 60, explosive: 300, aluminum: 100 }, outputs: { rocket: 1 }, opexPerUnit: 69841.7, energyShare: 0.05 },
  weapon: { name: '兵器', inputs: { steel: 1.0, alloy: 0.5, semiconductor: 0.05, explosive: 0.4 }, outputs: { weapon: 1 }, opexPerUnit: 77.9, energyShare: 0.07 },
  colony: { name: '宇宙コロニー', inputs: { paper: 1500, buildmat: 4000, car: 300, detergent: 250, clothing: 1500, pharma: 150, pc: 1000, ev: 200, weapon: 50, rocket: 2, alloy: 1000 }, outputs: { colony: 1 }, opexPerUnit: 3982310.3, energyShare: 0.05 }
};
GAME_DATA.plants = {
  chemPlant: { recipes: ['plastic', 'rubber', 'surfactant', 'fiber'], legacyRecipes: ['pharmaMat', 'explosive'], throughput: 10 },
  steelMill: { recipes: ['steel', 'alloy'], throughput: 25 },
  aluminumSmelter: { recipes: ['aluminum'], throughput: 7 },
  copperSmelter: { recipes: ['copper', 'lithium'], throughput: 3.6 },
  kiln: { recipes: ['glass', 'cement', 'silicon'], throughput: 5 },
  sawmill: { recipes: ['lumber'], throughput: 10 },
  paperMill: { recipes: ['paper'], throughput: 13 },
  detergentFactory: { recipes: ['detergent'], throughput: 2.5 },
  garmentFactory: { recipes: ['clothing'], throughput: 1.0 },
  buildmatFactory: { recipes: ['buildmat'], throughput: 14.5 },
  carFactory: { recipes: ['car'], throughput: 5.5 },
  shipyard: { recipes: ['ship'], throughput: 0.0033 },
  aircraftFactory: { recipes: ['aircraft'], throughput: 0.0075 },
  semiconductorFactory: { recipes: ['semiconductor'], throughput: 1.6 },
  pcFactory: { recipes: ['pc'], throughput: 12 },
  evFactory: { recipes: ['ev'], throughput: 3.2 },
  pharmaFactory: { recipes: ['pharma'], throughput: 1.0 },
  rocketFactory: { recipes: ['rocket'], throughput: 0.0045 },
  munitionsFactory: { recipes: ['weapon'], throughput: 3.0 },
  fineChemPlant: { recipes: ['pharmaMat'], throughput: 10 },
  explosivesFactory: { recipes: ['explosive'], throughput: 10 },
  colonyFactory: { recipes: ['colony'], throughput: 0.0028 }
};
