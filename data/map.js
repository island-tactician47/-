// 拠点マップ（町と工業地帯）。2Dアイソメの格子。
// 地形は式で決める（海岸線 coast、道路は block ごと、港の予約地）。埋め立ては s.map.reclaim（海岸線を何行広げたか）。
// footprint：建物の足あと [x方向の幅, y方向の奥行] のタイル数。油井は鉱区にあり、町の地図には出さない。
// 建物の絵は assets/nt/*.png（tools/import_nt.py が Neo Town Builder の生成器で作る。タイル幅128pxの絵を64pxに1:1で貼るので、足あとは NT の2倍）。
// layoutVer：足あとやマップの大きさを変えたら上げる。古いセーブは町を開いたときに置き直される（手で置いた位置は失われる）。
window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.map = {
  layoutVer: 9,
  w: 72, h: 72,
  block: 16,                       // x%block または y%block が block-1 の格子線が道路
  coast: { base: 50, a1: 3, a2: 2 },   // 海岸線 y = base + a1·sin(0.35x) + a2·sin(0.13x+1)
  anchor: { x: 34, y: 30 },        // 自動配置は、ここに近い空きから詰める
  port: { x0: 2, x1: 18, depth: 6 },   // 港の予約地（x0..x1、海岸線から depth タイル手前まで）
  // 海に隣接してしか建てられない設備（造船所）。足あとの +y 側（海側）の端が「ドックの開口部」。奥の部分は陸、海側の mouth 行は陸でも海でもよく（ドックの先端が海に張り出す）、
  // 海側の端の中央 open マスは海であること。埋め立てても、置いた設備の開口部の前（足あとの幅 × 海側の mouth 行より先）は海のまま（港と同じ扱い）
  seaFront: { shipyard: { mouth: 3, open: 3 } },
  // 敷地に重ねて建てる設備（研究棟）：2棟目・3棟目は新しい足あとを取らず、1棟目の敷地に重ねる。増設のたびに建屋が1段階高層になる（level＝完成した棟数）
  stackable: { researchLab: 3 },
  reclaimCostPerRow: 240000, reclaimMax: 12,   // 埋め立て：海岸線を1行（全幅）広げる費用（物価指数で増える）と上限行数。港の前は海のまま
  // 増設モジュール：加工設備1基につき最大 max 個。1個で基準の日量が gain 倍ぶん増える。建設費・工期・維持費は元の設備の costMul・monthsMul・fixedMul 倍（新設より少しだけ得にして、土地を食わない・設備数の上限を超えられる分の利点とつり合わせる）
  modules: { exclude: { shipyard: 1 }, max: 3, gain: 1.0, costMul: 0.9, monthsMul: 0.7, fixedMul: 0.9 },
  // 増設モジュールの足あとは、設置相手の設備ごとに違う（親の増築として絵を作ってある）。ここに無い親は footprint.module。造船所は増設なし
  moduleFootprint: {
    chemPlant: [3, 3], steelMill: [3, 4], aluminumSmelter: [2, 4], kiln: [2, 3], sawmill: [2, 2], paperMill: [2, 3],
    detergentFactory: [3, 2], garmentFactory: [2, 2], buildmatFactory: [3, 3], carFactory: [3, 3], aircraftFactory: [3, 3], semiconductorFactory: [2, 3], copperSmelter: [2, 3], pcFactory: [3, 2], evFactory: [3, 3], pharmaFactory: [2, 2], rocketFactory: [2, 3], munitionsFactory: [3, 3]
  },
  // 向きを選べない種類（絵が4方向そろっていないもの。そろったら外す）。造船所（海側が決まっている）と研究棟（敷地に重ねる）は engine.canRotate が別に判定する
  noRotate: {},
  footprint: {
    default: [4, 4], module: [2, 2], oilWell: [2, 2], container: [4, 4], portcrane: [4, 4], yard_coal: [2, 2], yard_iron: [2, 2], yard_copper: [2, 2], yard_limestone: [2, 2], mine_coal: [3, 3], mine_iron: [3, 3], mine_copper: [3, 3], mine_limestone: [3, 3],   // oilWell は町の地図には出さない（採掘地ページの絵の大きさ）
      // module は親が決まっていないとき（上の moduleFootprint が優先）
    refinery: [4, 4], refineryLarge: [8, 10], chemPlant: [6, 5], distillation: [2, 2],
    crudeTank: [4, 4], tank_gasoline: [2, 2], tank_diesel: [2, 2], tank_naphtha: [2, 2], tank_heavy: [2, 2],
    steelMill: [12, 12], aluminumSmelter: [6, 6], copperSmelter: [4, 4], kiln: [4, 4], sawmill: [4, 4], paperMill: [4, 4],
    detergentFactory: [4, 4], garmentFactory: [4, 4], buildmatFactory: [6, 6],
    carFactory: [7, 5], shipyard: [5, 8], aircraftFactory: [6, 5], semiconductorFactory: [6, 6], pcFactory: [7, 6], evFactory: [8, 8], pharmaFactory: [6, 5],
    rocketFactory: [6, 6], munitionsFactory: [7, 8],   // NT に無い型（手続き描画 js/sprites2.js）は小さめ
    powerPlant: [8, 8], researchLab: [4, 4], warehouse_bulk: [4, 4], warehouse_goods: [4, 4]
  }
};
