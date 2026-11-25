// 拠点マップ（町と工業地帯）。2Dアイソメの格子。
// 地形は式で決める（海岸線 coast、道路は block ごと、港の予約地）。埋め立ては s.map.reclaim（海岸線を何行広げたか）。
// footprint：建物の足あと [x方向の幅, y方向の奥行] のタイル数。油井は鉱区にあり、町の地図には出さない。
// 建物の絵は assets/nt/*.png（tools/import_nt.py が Neo Town Builder の生成器で作る。タイル幅128pxの絵を64pxに1:1で貼るので、足あとは NT の2倍）。
// layoutVer：足あとやマップの大きさを変えたら上げる。古いセーブは町を開いたときに置き直される（手で置いた位置は失われる）。
window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.map = {
  layoutVer: 10,
  w: 192, h: 192,                  // 旧 72×72 → 128×128（mapVer 2）→ 160×160（mapVer 3）→ 192×192（mapVer 4：北側＝住宅地の用地に32タイル広げた。面積は128の約1.6倍）。広げるたびに、旧セーブの位置を mapShifts ぶんずらす（ensureMap）
  mapVer: 4, mapShifts: { 2: 32, 3: 16, 4: 32 },   // mapShifts[v]＝その版で、既存のマップの左上（0,0）が（x・y とも）何タイルずれたか。ブロック（16）の倍数にして、道路の線をそろえる
  origin: { x: 80, y: 80 },        // 合計のずれ＝旧72×72のマップの左上（0,0）が、いまのマップのどこか（mapShifts の合計）
  block: 16,                       // x%block または y%block が block-1 の格子線が道路
  coast: { base: 130, a1: 3, a2: 2, ox: 80 },   // 海岸線 y = base + a1·sin(0.35(x-ox)) + a2·sin(0.13(x-ox)+1)（旧マップと同じ形のまま、80ずらした）
  anchor: { x: 114, y: 110 },        // 自動配置は、ここに近い空きから詰める
  port: { x0: 82, x1: 98, depth: 6 },
  // 区画（北から順に）：y < residentialEnd＝住宅街（ゲームの建物は置けない。見た目の街だけ）／residentialEnd ≤ y < forestEnd＝森林地帯（半区画＝8タイルの幅のうち道路の行を除く。建物は置けない）／それより南＝工業地帯。
  // 注意：将来 mapShifts でマップを広げるときは、これらの y もずらすこと（海岸線・港・anchor と同じ）。既存の建物は工業地帯の北端（y≥54）より南にあるので、forestEnd は 47 以下にする
  zones: { residentialEnd: 40, forestEnd: 47 },
  // 住宅街の見た目の街（飾り＝セーブに持たない）と、将来の街の育ちの上限。工業地帯より目立たない・住宅街を埋め尽くさないための決まり（docs/拠点マップ.md「住宅街」）
  town: {
    decorCoverage: 0.16,          // いまの飾りの街：2×2の区画のうち建物を置く割合
    maxCoverage: 0.5,             // 将来の街の育ち：住宅街の面積のうち建物で埋めてよい上限（構想建築で密集しても半分は空ける）
    towerShareMax: 0.04,          // 超高層（city_sky）の棟数の上限＝建物全体の4%まで
    heightCapRatio: 0.8,          // 街のどの建物も、工場でいちばん高いものの80%以下（工業地帯より目立たせない）
    nearForestMaxFloors: 8,       // 森林地帯から16タイル以内は8階まで（視点を回すと住宅街が工場の手前に来るので、工場を隠さない）
    nearForestDist: 16
  },   // 港の予約地（x0..x1、海岸線から depth タイル手前まで）
  // 海に隣接してしか建てられない設備（造船所）。足あとの +y 側（海側）の端が「ドックの開口部」。奥の部分は陸、海側の mouth 行は陸でも海でもよく（ドックの先端が海に張り出す）、
  // 海側の端の中央 open マスは海であること。埋め立てても、置いた設備の開口部の前（足あとの幅 × 海側の mouth 行より先）は海のまま（港と同じ扱い）
  seaFront: { shipyard: { mouth: 3, open: 3 } },
  // 敷地に重ねて建てる設備（研究棟）：2棟目・3棟目は新しい足あとを取らず、1棟目の敷地に重ねる。増設のたびに建屋が1段階高層になる（level＝完成した棟数）
  stackable: { researchLab: 3 },
  reclaimCostPerTile: 4000,   // 埋め立て：海の上に設備を置くとき、海のマスごとにかかる費用（物価指数で増える）。置いた足あとが陸地になる（s.map.fill）。海岸線から reclaimMax 行まで、港の前と造船所の開口部の前は海のまま
  reclaimCostPerRow: 240000, reclaimMax: 12,   // 旧方式（海岸線を全幅で1行広げる）。古いセーブと自動配置の用地の確保でだけ使う   // 埋め立て：海岸線を1行（全幅）広げる費用（物価指数で増える）と上限行数。港の前は海のまま
  // 増設モジュール：加工設備1基につき最大 max 個。1個で基準の日量が gain 倍ぶん増える。建設費・工期・維持費は元の設備の costMul・monthsMul・fixedMul 倍（新設より少しだけ得にして、土地を食わない・設備数の上限を超えられる分の利点とつり合わせる）
  modules: { exclude: { shipyard: 1, colonyFactory: 1, aiDefenseFactory: 1, offshoreFactory: 1 }, max: 3, maxBy: { chemPlant: 4, buildmatFactory: 4, aircraftFactory: 4, fineChemPlant: 4, tireFactory: 4, explosivesFactory: 4, copperSmelter: 4, kiln: 4, sawmill: 4, paperMill: 4, garmentFactory: 4, steelMill: 4, detergentFactory: 4, semiconductorFactory: 4, rocketFactory: 4 }, gain: 1.0, costMul: 0.9, monthsMul: 0.7, fixedMul: 0.9 },
  // 増設モジュールの足あとは、設置相手の設備ごとに違う（親の増築として絵を作ってある）。ここに無い親は footprint.module。造船所は増設なし
  moduleFootprint: {
    chemPlant: [3, 3], steelMill: [3, 4], aluminumSmelter: [2, 4], kiln: [2, 3], sawmill: [2, 2], paperMill: [2, 3],
    detergentFactory: [3, 2], garmentFactory: [2, 2], buildmatFactory: [3, 3], carFactory: [3, 3], aircraftFactory: [3, 3], semiconductorFactory: [2, 3], copperSmelter: [2, 3], pcFactory: [3, 2], evFactory: [3, 3], pharmaFactory: [2, 2], rocketFactory: [2, 3], munitionsFactory: [3, 3], fineChemPlant: [3, 3], explosivesFactory: [3, 3],
    tireFactory: [3, 3], batteryFactory: [2, 3], cableFactory: [2, 2], fiberFactory: [2, 2], motorFactory: [2, 3], powerEquipFactory: [3, 3], commGearFactory: [2, 2], satelliteFactory: [3, 3]
  },
  // 向きを選べない種類（絵が4方向そろっていないもの。そろったら外す）。造船所（海側が決まっている）と研究棟（敷地に重ねる）は engine.canRotate が別に判定する
  noRotate: {},
  footprint: {
    town_house_1: [2, 2], town_house_2: [2, 2], town_house_3: [2, 2], town_house_4: [2, 2], town_apt_1: [2, 2], town_apt_2: [2, 2], town_apt_3: [2, 2], town_conv_1: [1, 1], town_conv_2: [1, 1], town_conv_3: [1, 1],   // 住宅街の飾り（絵だけ。建てられない）
    default: [4, 4], module: [2, 2], oilWell: [2, 2], container: [4, 4], portcrane: [4, 4], yard_coal: [2, 2], yard_iron: [2, 2], yard_copper: [2, 2], yard_silica: [2, 2], mine_coal: [3, 3], mine_iron: [3, 3], mine_copper: [3, 3], mine_silica: [3, 3],   // oilWell は町の地図には出さない（採掘地ページの絵の大きさ）
      // module は親が決まっていないとき（上の moduleFootprint が優先）
    refinery: [4, 4], refineryLarge: [8, 10], chemPlant: [6, 5], distillation: [2, 2],
    crudeTank: [4, 4], tank_gasoline: [2, 2], tank_diesel: [2, 2], tank_naphtha: [2, 2], tank_heavy: [2, 2],
    steelMill: [12, 12], aluminumSmelter: [6, 6], copperSmelter: [4, 4], kiln: [4, 4], sawmill: [4, 4], paperMill: [4, 4],
    detergentFactory: [4, 4], garmentFactory: [4, 4], buildmatFactory: [6, 6],
    carFactory: [9, 5], shipyard: [5, 8], aircraftFactory: [6, 5], semiconductorFactory: [6, 6], pcFactory: [7, 6], evFactory: [9, 8], pharmaFactory: [6, 5],
    rocketFactory: [6, 6], munitionsFactory: [9, 8], fineChemPlant: [6, 5], tireFactory: [6, 5], batteryFactory: [6, 5], explosivesFactory: [6, 6], colonyFactory: [12, 12], offshoreFactory: [10, 10], cableFactory: [6, 5], fiberFactory: [6, 5], motorFactory: [7, 6], powerEquipFactory: [9, 8], commGearFactory: [6, 6], satelliteFactory: [9, 8], aiDefenseFactory: [12, 12],   // NT に無い型（手続き描画 js/sprites2.js）は小さめ
    powerPlant: [8, 8], researchLab: [4, 4], headquarters: [4, 4], warehouse_bulk: [4, 4], warehouse_goods: [4, 4],
    // 船の絵（港の船・海を行き来する船。町の建物ではない。末尾 _w は船首が -gx 側）
    ship_fishing: [4, 2], ship_fishing_w: [4, 2], ship_coaster: [6, 3], ship_coaster_w: [6, 3], ship_freighter: [8, 3], ship_freighter_w: [8, 3], ship_tanker: [10, 4], ship_tanker_w: [10, 4], ship_container: [12, 4], ship_container_w: [12, 4], port_gantry: [3, 7], port_yard: [4, 4], port_jetty: [3, 9], port_fish: [5, 4]
  }
};
