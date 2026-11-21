// 建物の絵（PNG）の登録表。tools/import_nt.py が Neo Town Builder（ユーザー作）の gen_v4 の手続き生成から作る。
// 画像はタイル幅128px（こちらのタイル幅64pxに1:1で貼るので、足あとは NT の2倍）。ax,ay は足あと中心（地面）の画像内の位置。
window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.spritesNT = {
 "refinery": {
  "file": "../assets/nt/refinery.png",
  "w": 640,
  "h": 563,
  "ax": 320,
  "ay": 403,
  "nt": "close",
  "n": 5,
  "fw": 10,
  "fd": 10,
  "close": true,
  "fx": [
   {
    "k": "smoke",
    "dx": -274,
    "dy": -397,
    "s": 1.0
   },
   {
    "k": "smoke",
    "dx": -232,
    "dy": -395,
    "s": 1.0
   },
   {
    "k": "flame",
    "dx": -117,
    "dy": -359,
    "s": 1
   }
  ]
 },
 "chemPlant": {
  "file": "../assets/nt/chemPlant.png",
  "w": 256,
  "h": 283,
  "ax": 128,
  "ay": 219,
  "nt": "refinery",
  "n": 2,
  "fw": 4,
  "fd": 4,
  "fx": [
   {
    "k": "smoke",
    "dx": -10,
    "dy": -213,
    "s": 1.0
   },
   {
    "k": "flame",
    "dx": 110,
    "dy": -157,
    "s": 1
   }
  ]
 },
 "distillation": {
  "file": "../assets/nt/distillation.png",
  "w": 128,
  "h": 75,
  "ax": 64,
  "ay": 43,
  "nt": "oildepot",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "crudeTank": {
  "file": "../assets/nt/crudeTank.png",
  "w": 256,
  "h": 149,
  "ax": 128,
  "ay": 85,
  "nt": "tankfarm",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "tank_gasoline": {
  "file": "../assets/nt/tank_gasoline.png",
  "w": 128,
  "h": 75,
  "ax": 64,
  "ay": 43,
  "nt": "oildepot",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "tank_diesel": {
  "file": "../assets/nt/tank_diesel.png",
  "w": 128,
  "h": 75,
  "ax": 64,
  "ay": 43,
  "nt": "oildepot",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "tank_naphtha": {
  "file": "../assets/nt/tank_naphtha.png",
  "w": 128,
  "h": 75,
  "ax": 64,
  "ay": 43,
  "nt": "oildepot",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "tank_heavy": {
  "file": "../assets/nt/tank_heavy.png",
  "w": 128,
  "h": 75,
  "ax": 64,
  "ay": 43,
  "nt": "oildepot",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "steelMill": {
  "file": "../assets/nt/steelMill.png",
  "w": 768,
  "h": 535,
  "ax": 384,
  "ay": 343,
  "nt": "close",
  "n": 6,
  "fw": 12,
  "fd": 12,
  "close": true,
  "fx": [
   {
    "k": "smoke",
    "dx": -286,
    "dy": -215,
    "s": 1.4
   },
   {
    "k": "smoke",
    "dx": -206,
    "dy": -291,
    "s": 1.2
   },
   {
    "k": "smoke",
    "dx": -116,
    "dy": -303,
    "s": 1.2
   }
  ]
 },
 "aluminumSmelter": {
  "file": "../assets/nt/aluminumSmelter.png",
  "w": 384,
  "h": 309,
  "ax": 192,
  "ay": 213,
  "nt": "rollmill",
  "n": 3,
  "fw": 6,
  "fd": 6,
  "fx": [
   {
    "k": "smoke",
    "dx": -12,
    "dy": -207,
    "s": 1.2
   }
  ]
 },
 "copperSmelter": {
  "file": "../assets/nt/copperSmelter.png",
  "w": 256,
  "h": 159,
  "ax": 128,
  "ay": 95,
  "nt": "eaf",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "kiln": {
  "file": "../assets/nt/kiln.png",
  "w": 256,
  "h": 302,
  "ax": 128,
  "ay": 238,
  "nt": "cement",
  "n": 2,
  "fw": 4,
  "fd": 4,
  "fx": [
   {
    "k": "smoke",
    "dx": 2,
    "dy": -232,
    "s": 1.3
   }
  ]
 },
 "sawmill": {
  "file": "../assets/nt/sawmill.png",
  "w": 256,
  "h": 131,
  "ax": 128,
  "ay": 67,
  "nt": "sawmill",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "paperMill": {
  "file": "../assets/nt/paperMill.png",
  "w": 256,
  "h": 269,
  "ax": 128,
  "ay": 205,
  "nt": "papermill",
  "n": 2,
  "fw": 4,
  "fd": 4,
  "fx": [
   {
    "k": "smoke",
    "dx": 105,
    "dy": -202,
    "s": 1.5
   }
  ]
 },
 "detergentFactory": {
  "file": "../assets/nt/detergentFactory.png",
  "w": 256,
  "h": 142,
  "ax": 128,
  "ay": 78,
  "nt": "foodplant",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "garmentFactory": {
  "file": "../assets/nt/garmentFactory.png",
  "w": 256,
  "h": 138,
  "ax": 128,
  "ay": 74,
  "nt": "textile",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "buildmatFactory": {
  "file": "../assets/nt/buildmatFactory.png",
  "w": 384,
  "h": 221,
  "ax": 192,
  "ay": 125,
  "nt": "precast",
  "n": 3,
  "fw": 6,
  "fd": 6
 },
 "carFactory": {
  "file": "../assets/nt/carFactory.png",
  "w": 384,
  "h": 290,
  "ax": 192,
  "ay": 194,
  "nt": "carplant",
  "n": 3,
  "fw": 6,
  "fd": 6
 },
 "shipyard": {
  "file": "../assets/nt/shipyard.png",
  "w": 256,
  "h": 254,
  "ax": 128,
  "ay": 190,
  "nt": "shipyard",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "aircraftFactory": {
  "file": "../assets/nt/aircraftFactory.png",
  "w": 384,
  "h": 236,
  "ax": 192,
  "ay": 140,
  "nt": "heavyworks",
  "n": 3,
  "fw": 6,
  "fd": 6
 },
 "semiconductorFactory": {
  "file": "../assets/nt/semiconductorFactory.png",
  "w": 384,
  "h": 227,
  "ax": 192,
  "ay": 131,
  "nt": "semicon",
  "n": 3,
  "fw": 6,
  "fd": 6
 },
 "pcFactory": {
  "file": "../assets/nt/pcFactory.png",
  "w": 256,
  "h": 144,
  "ax": 128,
  "ay": 80,
  "nt": "precision",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "evFactory": {
  "file": "../assets/nt/evFactory.png",
  "w": 512,
  "h": 277,
  "ax": 256,
  "ay": 149,
  "nt": "gigafactory",
  "n": 4,
  "fw": 8,
  "fd": 8
 },
 "pharmaFactory": {
  "file": "../assets/nt/pharmaFactory.png",
  "w": 256,
  "h": 142,
  "ax": 128,
  "ay": 78,
  "nt": "pharma",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "powerPlant": {
  "file": "../assets/nt/powerPlant.png",
  "w": 512,
  "h": 561,
  "ax": 256,
  "ay": 433,
  "nt": "bigpower",
  "n": 4,
  "fw": 8,
  "fd": 8,
  "fx": [
   {
    "k": "smoke",
    "dx": -13,
    "dy": -430,
    "s": 1.8
   }
  ]
 },
 "researchLab": {
  "file": "../assets/nt/researchLab.png",
  "w": 256,
  "h": 148,
  "ax": 128,
  "ay": 84,
  "nt": "datacenter",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "warehouse_bulk": {
  "file": "../assets/nt/warehouse_bulk.png",
  "w": 256,
  "h": 137,
  "ax": 128,
  "ay": 73,
  "nt": "warehouse",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "warehouse_goods": {
  "file": "../assets/nt/warehouse_goods.png",
  "w": 256,
  "h": 166,
  "ax": 128,
  "ay": 102,
  "nt": "logistics",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "module": {
  "file": "../assets/nt/module.png",
  "w": 128,
  "h": 79,
  "ax": 64,
  "ay": 47,
  "nt": "workshop",
  "n": 1,
  "fw": 2,
  "fd": 2
 },
 "portcrane": {
  "file": "../assets/nt/portcrane.png",
  "w": 256,
  "h": 285,
  "ax": 128,
  "ay": 221,
  "nt": "portcrane",
  "n": 2,
  "fw": 4,
  "fd": 4
 },
 "container": {
  "file": "../assets/nt/container.png",
  "w": 256,
  "h": 132,
  "ax": 128,
  "ay": 68,
  "nt": "container",
  "n": 2,
  "fw": 4,
  "fd": 4
 }
};
