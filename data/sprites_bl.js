// Blender で作った建物の絵（4方向）の登録表。tools/blender/render_rot.py が作る（手で書き換えない）。
// 絵はタイル幅64px（足あとのタイル1辺＝32px右・16px下）。r[k]＝カメラを +90°×k 回した絵（建物を −90°×k 回して見た向き）。
// ax,ay＝足あと中心（地面）の画像内px。fw,fd＝その向きの足あと（奇数回転は入れ替わる）。fx＝煙・炎の足あと中心からのpx。
window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.spritesBL = {
 "chemPlant": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/chemPlant_r0.png",
    "w": 363,
    "h": 227,
    "ax": 181.5,
    "ay": 143.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/chemPlant_r1.png",
    "w": 363,
    "h": 188,
    "ax": 181.5,
    "ay": 104.6,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/chemPlant_r2.png",
    "w": 363,
    "h": 229,
    "ax": 181.5,
    "ay": 145.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/chemPlant_r3.png",
    "w": 363,
    "h": 273,
    "ax": 181.5,
    "ay": 189.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "steelMill": {
  "fw": 12,
  "fd": 12,
  "r": [
   {
    "file": "../assets/bl/steelMill_r0.png",
    "w": 779,
    "h": 550,
    "ax": 389.5,
    "ay": 372.6,
    "fw": 12,
    "fd": 12,
    "fx": [
     {
      "k": "smoke",
      "dx": 83.2,
      "dy": -269.7,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/steelMill_r1.png",
    "w": 790,
    "h": 425,
    "ax": 389.5,
    "ay": 247.6,
    "fw": 12,
    "fd": 12,
    "fx": [
     {
      "k": "smoke",
      "dx": 19.2,
      "dy": -320.9,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/steelMill_r2.png",
    "w": 779,
    "h": 468,
    "ax": 389.5,
    "ay": 289.1,
    "fw": 12,
    "fd": 12,
    "fx": [
     {
      "k": "smoke",
      "dx": -83.2,
      "dy": -288.9,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/steelMill_r3.png",
    "w": 790,
    "h": 510,
    "ax": 400.5,
    "ay": 332.6,
    "fw": 12,
    "fd": 12,
    "fx": [
     {
      "k": "smoke",
      "dx": -19.2,
      "dy": -237.7,
      "s": 1.4
     }
    ]
   }
  ]
 },
 "distillation": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/distillation_r0.png",
    "w": 139,
    "h": 197,
    "ax": 69.5,
    "ay": 163.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r1.png",
    "w": 139,
    "h": 187,
    "ax": 69.5,
    "ay": 153.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r2.png",
    "w": 139,
    "h": 199,
    "ax": 69.5,
    "ay": 165.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r3.png",
    "w": 139,
    "h": 209,
    "ax": 69.5,
    "ay": 175.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "crudeTank": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/crudeTank_r0.png",
    "w": 267,
    "h": 157,
    "ax": 133.5,
    "ay": 94.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r1.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r2.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r3.png",
    "w": 267,
    "h": 158,
    "ax": 133.5,
    "ay": 95.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "tank_gasoline": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/tank_gasoline_r0.png",
    "w": 139,
    "h": 67,
    "ax": 69.5,
    "ay": 33.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r1.png",
    "w": 139,
    "h": 87,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r2.png",
    "w": 139,
    "h": 79,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "tank_diesel": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/tank_diesel_r0.png",
    "w": 139,
    "h": 71,
    "ax": 69.5,
    "ay": 37.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r1.png",
    "w": 139,
    "h": 87,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r2.png",
    "w": 139,
    "h": 79,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "tank_naphtha": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/tank_naphtha_r0.png",
    "w": 139,
    "h": 67,
    "ax": 69.5,
    "ay": 33.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r1.png",
    "w": 139,
    "h": 87,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r2.png",
    "w": 139,
    "h": 79,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "tank_heavy": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/tank_heavy_r0.png",
    "w": 139,
    "h": 71,
    "ax": 69.5,
    "ay": 37.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r1.png",
    "w": 139,
    "h": 87,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r2.png",
    "w": 139,
    "h": 79,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "aluminumSmelter": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/aluminumSmelter_r0.png",
    "w": 395,
    "h": 279,
    "ax": 197.5,
    "ay": 187.6,
    "fw": 6,
    "fd": 6,
    "fx": [
     {
      "k": "smoke",
      "dx": 86.4,
      "dy": -192.5,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/aluminumSmelter_r1.png",
    "w": 395,
    "h": 209,
    "ax": 197.5,
    "ay": 117.6,
    "fw": 6,
    "fd": 6,
    "fx": [
     {
      "k": "smoke",
      "dx": -89.6,
      "dy": -190.9,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/aluminumSmelter_r2.png",
    "w": 395,
    "h": 218,
    "ax": 197.5,
    "ay": 127.1,
    "fw": 6,
    "fd": 6,
    "fx": [
     {
      "k": "smoke",
      "dx": -86.4,
      "dy": -102.9,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/aluminumSmelter_r3.png",
    "w": 395,
    "h": 277,
    "ax": 197.5,
    "ay": 186.1,
    "fw": 6,
    "fd": 6,
    "fx": [
     {
      "k": "smoke",
      "dx": 89.6,
      "dy": -104.5,
      "s": 1.2
     }
    ]
   }
  ]
 },
 "copperSmelter": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/copperSmelter_r0.png",
    "w": 267,
    "h": 344,
    "ax": 133.5,
    "ay": 281.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 0.0,
      "dy": -287.0,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/copperSmelter_r1.png",
    "w": 267,
    "h": 294,
    "ax": 133.5,
    "ay": 231.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -112.6,
      "dy": -230.7,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/copperSmelter_r2.png",
    "w": 267,
    "h": 243,
    "ax": 133.5,
    "ay": 180.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -0.0,
      "dy": -174.4,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/copperSmelter_r3.png",
    "w": 267,
    "h": 294,
    "ax": 133.5,
    "ay": 231.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 112.6,
      "dy": -230.7,
      "s": 1.5
     }
    ]
   }
  ]
 },
 "kiln": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/kiln_r0.png",
    "w": 267,
    "h": 216,
    "ax": 133.5,
    "ay": 153.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 110.1,
      "dy": -107.3,
      "s": 1.2
     },
     {
      "k": "smoke",
      "dx": -16.0,
      "dy": -84.7,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/kiln_r1.png",
    "w": 267,
    "h": 173,
    "ax": 133.5,
    "ay": 110.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 0.0,
      "dy": -162.3,
      "s": 1.2
     },
     {
      "k": "smoke",
      "dx": 12.8,
      "dy": -83.1,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/kiln_r2.png",
    "w": 267,
    "h": 170,
    "ax": 133.5,
    "ay": 107.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -110.1,
      "dy": -107.3,
      "s": 1.2
     },
     {
      "k": "smoke",
      "dx": 16.0,
      "dy": -97.5,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/kiln_r3.png",
    "w": 267,
    "h": 219,
    "ax": 133.5,
    "ay": 156.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -0.0,
      "dy": -52.2,
      "s": 1.2
     },
     {
      "k": "smoke",
      "dx": -12.8,
      "dy": -99.1,
      "s": 0.8
     }
    ]
   }
  ]
 },
 "sawmill": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/sawmill_r0.png",
    "w": 270,
    "h": 155,
    "ax": 136.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r1.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r2.png",
    "w": 270,
    "h": 155,
    "ax": 133.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r3.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "paperMill": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/paperMill_r0.png",
    "w": 267,
    "h": 223,
    "ax": 133.5,
    "ay": 160.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -44.8,
      "dy": -162.0,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/paperMill_r1.png",
    "w": 267,
    "h": 223,
    "ax": 133.5,
    "ay": 160.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": -44.8,
      "dy": -117.2,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/paperMill_r2.png",
    "w": 267,
    "h": 183,
    "ax": 133.5,
    "ay": 120.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 44.8,
      "dy": -117.2,
      "s": 1.4
     }
    ]
   },
   {
    "file": "../assets/bl/paperMill_r3.png",
    "w": 267,
    "h": 183,
    "ax": 133.5,
    "ay": 120.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "smoke",
      "dx": 44.8,
      "dy": -162.0,
      "s": 1.4
     }
    ]
   }
  ]
 },
 "detergentFactory": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/detergentFactory_r0.png",
    "w": 267,
    "h": 147,
    "ax": 133.5,
    "ay": 84.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r1.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r2.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r3.png",
    "w": 267,
    "h": 173,
    "ax": 133.5,
    "ay": 110.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "garmentFactory": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/garmentFactory_r0.png",
    "w": 267,
    "h": 189,
    "ax": 133.5,
    "ay": 126.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r1.png",
    "w": 267,
    "h": 161,
    "ax": 133.5,
    "ay": 98.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r2.png",
    "w": 267,
    "h": 141,
    "ax": 133.5,
    "ay": 78.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r3.png",
    "w": 267,
    "h": 177,
    "ax": 133.5,
    "ay": 114.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "buildmatFactory": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/buildmatFactory_r0.png",
    "w": 395,
    "h": 231,
    "ax": 197.5,
    "ay": 140.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r1.png",
    "w": 395,
    "h": 219,
    "ax": 197.5,
    "ay": 127.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r2.png",
    "w": 395,
    "h": 226,
    "ax": 197.5,
    "ay": 134.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r3.png",
    "w": 395,
    "h": 283,
    "ax": 197.5,
    "ay": 191.6,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "carFactory": {
  "fw": 7,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/carFactory_r0.png",
    "w": 396,
    "h": 225,
    "ax": 197.5,
    "ay": 134.1,
    "fw": 7,
    "fd": 5
   },
   {
    "file": "../assets/bl/carFactory_r1.png",
    "w": 395,
    "h": 217,
    "ax": 197.5,
    "ay": 125.6,
    "fw": 5,
    "fd": 7
   },
   {
    "file": "../assets/bl/carFactory_r2.png",
    "w": 396,
    "h": 215,
    "ax": 199.0,
    "ay": 124.1,
    "fw": 7,
    "fd": 5
   },
   {
    "file": "../assets/bl/carFactory_r3.png",
    "w": 395,
    "h": 218,
    "ax": 197.5,
    "ay": 127.1,
    "fw": 5,
    "fd": 7
   }
  ]
 },
 "aircraftFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/aircraftFactory_r0.png",
    "w": 363,
    "h": 211,
    "ax": 181.5,
    "ay": 127.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/aircraftFactory_r1.png",
    "w": 363,
    "h": 200,
    "ax": 181.5,
    "ay": 116.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/aircraftFactory_r2.png",
    "w": 363,
    "h": 200,
    "ax": 181.5,
    "ay": 116.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/aircraftFactory_r3.png",
    "w": 363,
    "h": 201,
    "ax": 181.5,
    "ay": 117.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "semiconductorFactory": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/semiconductorFactory_r0.png",
    "w": 395,
    "h": 219,
    "ax": 197.5,
    "ay": 128.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r1.png",
    "w": 395,
    "h": 210,
    "ax": 197.5,
    "ay": 119.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r2.png",
    "w": 395,
    "h": 211,
    "ax": 197.5,
    "ay": 120.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r3.png",
    "w": 395,
    "h": 212,
    "ax": 197.5,
    "ay": 121.1,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "shipyard": {
  "fw": 5,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/shipyard_r0.png",
    "w": 427,
    "h": 251,
    "ax": 213.5,
    "ay": 153.1,
    "fw": 5,
    "fd": 8
   },
   {
    "file": "../assets/bl/shipyard_r1.png",
    "w": 427,
    "h": 234,
    "ax": 213.5,
    "ay": 135.6,
    "fw": 8,
    "fd": 5
   },
   {
    "file": "../assets/bl/shipyard_r2.png",
    "w": 427,
    "h": 234,
    "ax": 213.5,
    "ay": 135.6,
    "fw": 5,
    "fd": 8
   },
   {
    "file": "../assets/bl/shipyard_r3.png",
    "w": 427,
    "h": 251,
    "ax": 213.5,
    "ay": 152.6,
    "fw": 8,
    "fd": 5
   }
  ]
 },
 "powerPlant": {
  "fw": 8,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/powerPlant_r0.png",
    "w": 523,
    "h": 499,
    "ax": 261.5,
    "ay": 379.6,
    "fw": 8,
    "fd": 8,
    "fx": [
     {
      "k": "smoke",
      "dx": 0.0,
      "dy": -390.2,
      "s": 1.8
     },
     {
      "k": "smoke",
      "dx": -19.8,
      "dy": -356.0,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/powerPlant_r1.png",
    "w": 523,
    "h": 393,
    "ax": 261.5,
    "ay": 273.1,
    "fw": 8,
    "fd": 8,
    "fx": [
     {
      "k": "smoke",
      "dx": -238.1,
      "dy": -271.2,
      "s": 1.8
     },
     {
      "k": "smoke",
      "dx": -218.2,
      "dy": -237.0,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/powerPlant_r2.png",
    "w": 523,
    "h": 355,
    "ax": 261.5,
    "ay": 235.6,
    "fw": 8,
    "fd": 8,
    "fx": [
     {
      "k": "smoke",
      "dx": -0.0,
      "dy": -152.2,
      "s": 1.8
     },
     {
      "k": "smoke",
      "dx": 19.8,
      "dy": -137.8,
      "s": 1.5
     }
    ]
   },
   {
    "file": "../assets/bl/powerPlant_r3.png",
    "w": 523,
    "h": 393,
    "ax": 261.5,
    "ay": 273.1,
    "fw": 8,
    "fd": 8,
    "fx": [
     {
      "k": "smoke",
      "dx": 238.1,
      "dy": -271.2,
      "s": 1.8
     },
     {
      "k": "smoke",
      "dx": 218.2,
      "dy": -256.8,
      "s": 1.5
     }
    ]
   }
  ]
 },
 "researchLab": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/researchLab_r0.png",
    "w": 267,
    "h": 162,
    "ax": 133.5,
    "ay": 99.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r1.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r2.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r3.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "researchLab_L2": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/researchLab_L2_r0.png",
    "w": 267,
    "h": 184,
    "ax": 133.5,
    "ay": 121.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r1.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r2.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r3.png",
    "w": 267,
    "h": 167,
    "ax": 133.5,
    "ay": 104.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "researchLab_L3": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/researchLab_L3_r0.png",
    "w": 267,
    "h": 206,
    "ax": 133.5,
    "ay": 143.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r1.png",
    "w": 267,
    "h": 173,
    "ax": 133.5,
    "ay": 110.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r2.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r3.png",
    "w": 267,
    "h": 189,
    "ax": 133.5,
    "ay": 126.6,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "warehouse_bulk": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/warehouse_bulk_r0.png",
    "w": 267,
    "h": 178,
    "ax": 133.5,
    "ay": 115.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r1.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r2.png",
    "w": 267,
    "h": 145,
    "ax": 133.5,
    "ay": 82.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r3.png",
    "w": 267,
    "h": 170,
    "ax": 133.5,
    "ay": 107.6,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "warehouse_goods": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/warehouse_goods_r0.png",
    "w": 267,
    "h": 165,
    "ax": 133.5,
    "ay": 102.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r1.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r2.png",
    "w": 267,
    "h": 155,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r3.png",
    "w": 267,
    "h": 156,
    "ax": 133.5,
    "ay": 93.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "module_chemPlant": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_chemPlant_r0.png",
    "w": 203,
    "h": 171,
    "ax": 101.5,
    "ay": 122.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r1.png",
    "w": 203,
    "h": 154,
    "ax": 101.5,
    "ay": 105.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r2.png",
    "w": 203,
    "h": 144,
    "ax": 101.5,
    "ay": 96.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r3.png",
    "w": 203,
    "h": 162,
    "ax": 101.5,
    "ay": 114.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_steelMill": {
  "fw": 3,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/module_steelMill_r0.png",
    "w": 235,
    "h": 292,
    "ax": 117.5,
    "ay": 237.1,
    "fw": 3,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_steelMill_r1.png",
    "w": 235,
    "h": 269,
    "ax": 117.5,
    "ay": 214.1,
    "fw": 4,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_steelMill_r2.png",
    "w": 235,
    "h": 275,
    "ax": 117.5,
    "ay": 220.1,
    "fw": 3,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_steelMill_r3.png",
    "w": 235,
    "h": 301,
    "ax": 117.5,
    "ay": 245.6,
    "fw": 4,
    "fd": 3
   }
  ]
 },
 "module_aluminumSmelter": {
  "fw": 2,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/module_aluminumSmelter_r0.png",
    "w": 203,
    "h": 169,
    "ax": 101.5,
    "ay": 120.6,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r1.png",
    "w": 203,
    "h": 154,
    "ax": 101.5,
    "ay": 106.1,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r2.png",
    "w": 203,
    "h": 175,
    "ax": 101.5,
    "ay": 127.1,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r3.png",
    "w": 203,
    "h": 189,
    "ax": 101.5,
    "ay": 141.1,
    "fw": 4,
    "fd": 2
   }
  ]
 },
 "module_kiln": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_kiln_r0.png",
    "w": 171,
    "h": 131,
    "ax": 85.5,
    "ay": 90.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_kiln_r1.png",
    "w": 171,
    "h": 119,
    "ax": 85.5,
    "ay": 77.6,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_kiln_r2.png",
    "w": 171,
    "h": 119,
    "ax": 85.5,
    "ay": 77.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_kiln_r3.png",
    "w": 171,
    "h": 149,
    "ax": 85.5,
    "ay": 107.6,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "module_sawmill": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_sawmill_r0.png",
    "w": 139,
    "h": 99,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r1.png",
    "w": 139,
    "h": 100,
    "ax": 69.5,
    "ay": 66.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r2.png",
    "w": 139,
    "h": 80,
    "ax": 69.5,
    "ay": 46.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r3.png",
    "w": 139,
    "h": 90,
    "ax": 69.5,
    "ay": 56.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "module_paperMill": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_paperMill_r0.png",
    "w": 171,
    "h": 116,
    "ax": 85.5,
    "ay": 74.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_paperMill_r1.png",
    "w": 171,
    "h": 111,
    "ax": 85.5,
    "ay": 70.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_paperMill_r2.png",
    "w": 171,
    "h": 103,
    "ax": 85.5,
    "ay": 61.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_paperMill_r3.png",
    "w": 171,
    "h": 115,
    "ax": 85.5,
    "ay": 74.1,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "module_detergentFactory": {
  "fw": 3,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_detergentFactory_r0.png",
    "w": 171,
    "h": 112,
    "ax": 85.5,
    "ay": 71.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_detergentFactory_r1.png",
    "w": 171,
    "h": 98,
    "ax": 85.5,
    "ay": 57.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_detergentFactory_r2.png",
    "w": 171,
    "h": 123,
    "ax": 85.5,
    "ay": 82.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_detergentFactory_r3.png",
    "w": 171,
    "h": 138,
    "ax": 85.5,
    "ay": 96.6,
    "fw": 2,
    "fd": 3
   }
  ]
 },
 "module_garmentFactory": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_garmentFactory_r0.png",
    "w": 139,
    "h": 119,
    "ax": 69.5,
    "ay": 85.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r1.png",
    "w": 139,
    "h": 107,
    "ax": 69.5,
    "ay": 73.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r2.png",
    "w": 139,
    "h": 99,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r3.png",
    "w": 139,
    "h": 119,
    "ax": 69.5,
    "ay": 85.1,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "module_buildmatFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_buildmatFactory_r0.png",
    "w": 203,
    "h": 129,
    "ax": 101.5,
    "ay": 81.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r1.png",
    "w": 203,
    "h": 113,
    "ax": 101.5,
    "ay": 64.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r2.png",
    "w": 203,
    "h": 128,
    "ax": 101.5,
    "ay": 79.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r3.png",
    "w": 203,
    "h": 155,
    "ax": 101.5,
    "ay": 106.6,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_carFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_carFactory_r0.png",
    "w": 203,
    "h": 129,
    "ax": 101.5,
    "ay": 81.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r1.png",
    "w": 203,
    "h": 107,
    "ax": 101.5,
    "ay": 58.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r2.png",
    "w": 203,
    "h": 127,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r3.png",
    "w": 203,
    "h": 126,
    "ax": 101.5,
    "ay": 78.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_aircraftFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_aircraftFactory_r0.png",
    "w": 203,
    "h": 139,
    "ax": 101.5,
    "ay": 90.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r1.png",
    "w": 203,
    "h": 127,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r2.png",
    "w": 203,
    "h": 127,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r3.png",
    "w": 203,
    "h": 139,
    "ax": 101.5,
    "ay": 90.6,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_semiconductorFactory": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_semiconductorFactory_r0.png",
    "w": 171,
    "h": 121,
    "ax": 85.5,
    "ay": 80.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r1.png",
    "w": 171,
    "h": 118,
    "ax": 85.5,
    "ay": 77.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r2.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r3.png",
    "w": 171,
    "h": 121,
    "ax": 85.5,
    "ay": 80.1,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "refinery": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/refinery_r0.png",
    "w": 267,
    "h": 294,
    "ax": 133.5,
    "ay": 231.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "flame",
      "dx": -89.6,
      "dy": -142.3,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": 46.4,
      "dy": -108.5,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": 68.8,
      "dy": -97.3,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": 92.8,
      "dy": -85.3,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/refinery_r1.png",
    "w": 267,
    "h": 251,
    "ax": 133.5,
    "ay": 188.1,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "flame",
      "dx": -32.0,
      "dy": -81.5,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": -59.2,
      "dy": -102.1,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": -36.8,
      "dy": -113.3,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": -12.8,
      "dy": -125.3,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/refinery_r2.png",
    "w": 267,
    "h": 215,
    "ax": 133.5,
    "ay": 152.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "flame",
      "dx": 89.6,
      "dy": -110.3,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": -46.4,
      "dy": -49.3,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": -68.8,
      "dy": -60.5,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": -92.8,
      "dy": -72.5,
      "s": 0.8
     }
    ]
   },
   {
    "file": "../assets/bl/refinery_r3.png",
    "w": 267,
    "h": 260,
    "ax": 133.5,
    "ay": 197.6,
    "fw": 4,
    "fd": 4,
    "fx": [
     {
      "k": "flame",
      "dx": 32.0,
      "dy": -171.1,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": 59.2,
      "dy": -55.7,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": 36.8,
      "dy": -44.5,
      "s": 0.8
     },
     {
      "k": "smoke",
      "dx": 12.8,
      "dy": -32.5,
      "s": 0.8
     }
    ]
   }
  ]
 },
 "refineryLarge": {
  "fw": 8,
  "fd": 10,
  "r": [
   {
    "file": "../assets/bl/refineryLarge_r0.png",
    "w": 587,
    "h": 437,
    "ax": 293.5,
    "ay": 302.6,
    "fw": 8,
    "fd": 10,
    "fx": [
     {
      "k": "flame",
      "dx": 262.4,
      "dy": -207.1,
      "s": 1
     },
     {
      "k": "flame",
      "dx": -264.0,
      "dy": -132.1,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": 0.0,
      "dy": -119.2,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/refineryLarge_r1.png",
    "w": 587,
    "h": 396,
    "ax": 293.5,
    "ay": 262.1,
    "fw": 10,
    "fd": 8,
    "fx": [
     {
      "k": "flame",
      "dx": -32.0,
      "dy": -322.3,
      "s": 1
     },
     {
      "k": "flame",
      "dx": 20.8,
      "dy": -10.5,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": 28.8,
      "dy": -133.6,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/refineryLarge_r2.png",
    "w": 587,
    "h": 317,
    "ax": 293.5,
    "ay": 182.6,
    "fw": 8,
    "fd": 10,
    "fx": [
     {
      "k": "flame",
      "dx": -262.4,
      "dy": -175.1,
      "s": 1
     },
     {
      "k": "flame",
      "dx": 264.0,
      "dy": -152.9,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": 0.0,
      "dy": -148.0,
      "s": 1.2
     }
    ]
   },
   {
    "file": "../assets/bl/refineryLarge_r3.png",
    "w": 587,
    "h": 444,
    "ax": 293.5,
    "ay": 309.6,
    "fw": 10,
    "fd": 8,
    "fx": [
     {
      "k": "flame",
      "dx": 32.0,
      "dy": -59.9,
      "s": 1
     },
     {
      "k": "flame",
      "dx": -20.8,
      "dy": -274.5,
      "s": 1
     },
     {
      "k": "smoke",
      "dx": -28.8,
      "dy": -133.6,
      "s": 1.2
     }
    ]
   }
  ]
 },
 "module_copperSmelter": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_copperSmelter_r0.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 92.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_copperSmelter_r1.png",
    "w": 171,
    "h": 130,
    "ax": 85.5,
    "ay": 89.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_copperSmelter_r2.png",
    "w": 171,
    "h": 117,
    "ax": 85.5,
    "ay": 76.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_copperSmelter_r3.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 92.6,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "pcFactory": {
  "fw": 7,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/pcFactory_r0.png",
    "w": 427,
    "h": 249,
    "ax": 213.5,
    "ay": 151.1,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/pcFactory_r1.png",
    "w": 427,
    "h": 227,
    "ax": 213.5,
    "ay": 129.1,
    "fw": 6,
    "fd": 7
   },
   {
    "file": "../assets/bl/pcFactory_r2.png",
    "w": 427,
    "h": 227,
    "ax": 213.5,
    "ay": 128.6,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/pcFactory_r3.png",
    "w": 427,
    "h": 249,
    "ax": 213.5,
    "ay": 151.1,
    "fw": 6,
    "fd": 7
   }
  ]
 },
 "module_pcFactory": {
  "fw": 3,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_pcFactory_r0.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pcFactory_r1.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_pcFactory_r2.png",
    "w": 171,
    "h": 135,
    "ax": 85.5,
    "ay": 94.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pcFactory_r3.png",
    "w": 171,
    "h": 134,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   }
  ]
 },
 "evFactory": {
  "fw": 8,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/evFactory_r0.png",
    "w": 523,
    "h": 332,
    "ax": 261.5,
    "ay": 212.1,
    "fw": 8,
    "fd": 8
   },
   {
    "file": "../assets/bl/evFactory_r1.png",
    "w": 523,
    "h": 272,
    "ax": 261.5,
    "ay": 152.1,
    "fw": 8,
    "fd": 8
   },
   {
    "file": "../assets/bl/evFactory_r2.png",
    "w": 523,
    "h": 272,
    "ax": 261.5,
    "ay": 152.1,
    "fw": 8,
    "fd": 8
   },
   {
    "file": "../assets/bl/evFactory_r3.png",
    "w": 523,
    "h": 290,
    "ax": 261.5,
    "ay": 170.6,
    "fw": 8,
    "fd": 8
   }
  ]
 },
 "module_evFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_evFactory_r0.png",
    "w": 203,
    "h": 149,
    "ax": 101.5,
    "ay": 100.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r1.png",
    "w": 203,
    "h": 133,
    "ax": 101.5,
    "ay": 84.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r2.png",
    "w": 203,
    "h": 133,
    "ax": 101.5,
    "ay": 84.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r3.png",
    "w": 203,
    "h": 149,
    "ax": 101.5,
    "ay": 100.6,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "pharmaFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/pharmaFactory_r0.png",
    "w": 363,
    "h": 227,
    "ax": 181.5,
    "ay": 143.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/pharmaFactory_r1.png",
    "w": 363,
    "h": 200,
    "ax": 181.5,
    "ay": 116.6,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/pharmaFactory_r2.png",
    "w": 363,
    "h": 200,
    "ax": 181.5,
    "ay": 116.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/pharmaFactory_r3.png",
    "w": 363,
    "h": 241,
    "ax": 181.5,
    "ay": 157.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "module_pharmaFactory": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_pharmaFactory_r0.png",
    "w": 139,
    "h": 117,
    "ax": 69.5,
    "ay": 83.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r1.png",
    "w": 139,
    "h": 99,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r2.png",
    "w": 139,
    "h": 99,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r3.png",
    "w": 139,
    "h": 120,
    "ax": 69.5,
    "ay": 86.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "rocketFactory": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/rocketFactory_r0.png",
    "w": 395,
    "h": 235,
    "ax": 197.5,
    "ay": 144.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r1.png",
    "w": 395,
    "h": 215,
    "ax": 197.5,
    "ay": 123.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r2.png",
    "w": 395,
    "h": 253,
    "ax": 197.5,
    "ay": 161.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r3.png",
    "w": 395,
    "h": 299,
    "ax": 197.5,
    "ay": 207.6,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "module_rocketFactory": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_rocketFactory_r0.png",
    "w": 171,
    "h": 171,
    "ax": 85.5,
    "ay": 129.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_rocketFactory_r1.png",
    "w": 171,
    "h": 154,
    "ax": 85.5,
    "ay": 113.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_rocketFactory_r2.png",
    "w": 171,
    "h": 169,
    "ax": 85.5,
    "ay": 127.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_rocketFactory_r3.png",
    "w": 171,
    "h": 180,
    "ax": 85.5,
    "ay": 139.1,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "munitionsFactory": {
  "fw": 7,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/munitionsFactory_r0.png",
    "w": 491,
    "h": 253,
    "ax": 245.5,
    "ay": 140.6,
    "fw": 7,
    "fd": 8
   },
   {
    "file": "../assets/bl/munitionsFactory_r1.png",
    "w": 491,
    "h": 274,
    "ax": 245.5,
    "ay": 161.6,
    "fw": 8,
    "fd": 7
   },
   {
    "file": "../assets/bl/munitionsFactory_r2.png",
    "w": 491,
    "h": 281,
    "ax": 245.5,
    "ay": 168.6,
    "fw": 7,
    "fd": 8
   },
   {
    "file": "../assets/bl/munitionsFactory_r3.png",
    "w": 491,
    "h": 287,
    "ax": 245.5,
    "ay": 174.6,
    "fw": 8,
    "fd": 7
   }
  ]
 },
 "module_munitionsFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_munitionsFactory_r0.png",
    "w": 203,
    "h": 118,
    "ax": 101.5,
    "ay": 69.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r1.png",
    "w": 203,
    "h": 122,
    "ax": 101.5,
    "ay": 74.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r2.png",
    "w": 203,
    "h": 122,
    "ax": 101.5,
    "ay": 74.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r3.png",
    "w": 203,
    "h": 119,
    "ax": 101.5,
    "ay": 71.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "oilWell": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/oilWell_r0.png",
    "w": 139,
    "h": 87,
    "ax": 69.5,
    "ay": 53.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r1.png",
    "w": 139,
    "h": 89,
    "ax": 69.5,
    "ay": 55.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r2.png",
    "w": 139,
    "h": 89,
    "ax": 69.5,
    "ay": 55.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r3.png",
    "w": 139,
    "h": 84,
    "ax": 69.5,
    "ay": 50.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "mine_iron": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/mine_iron_r0.png",
    "w": 203,
    "h": 138,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r1.png",
    "w": 203,
    "h": 117,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r2.png",
    "w": 203,
    "h": 137,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r3.png",
    "w": 203,
    "h": 158,
    "ax": 101.5,
    "ay": 110.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "mine_coal": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/mine_coal_r0.png",
    "w": 203,
    "h": 138,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r1.png",
    "w": 203,
    "h": 117,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r2.png",
    "w": 203,
    "h": 137,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r3.png",
    "w": 203,
    "h": 158,
    "ax": 101.5,
    "ay": 110.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "mine_copper": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/mine_copper_r0.png",
    "w": 203,
    "h": 138,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r1.png",
    "w": 203,
    "h": 117,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r2.png",
    "w": 203,
    "h": 137,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r3.png",
    "w": 203,
    "h": 158,
    "ax": 101.5,
    "ay": 110.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "mine_limestone": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/mine_limestone_r0.png",
    "w": 203,
    "h": 138,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_limestone_r1.png",
    "w": 203,
    "h": 117,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_limestone_r2.png",
    "w": 203,
    "h": 137,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_limestone_r3.png",
    "w": 203,
    "h": 158,
    "ax": 101.5,
    "ay": 110.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "yard_coal": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/yard_coal_r0.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r1.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r2.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "yard_iron": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/yard_iron_r0.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r1.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r2.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "yard_copper": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/yard_copper_r0.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r1.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r2.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "yard_limestone": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/yard_limestone_r0.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_limestone_r1.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_limestone_r2.png",
    "w": 139,
    "h": 81,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_limestone_r3.png",
    "w": 139,
    "h": 73,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "container": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/container_r0.png",
    "w": 267,
    "h": 153,
    "ax": 133.5,
    "ay": 90.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r1.png",
    "w": 267,
    "h": 134,
    "ax": 133.5,
    "ay": 71.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r2.png",
    "w": 267,
    "h": 151,
    "ax": 133.5,
    "ay": 88.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r3.png",
    "w": 267,
    "h": 153,
    "ax": 133.5,
    "ay": 90.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "portcrane": {
  "fw": 4,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/portcrane_r0.png",
    "w": 267,
    "h": 159,
    "ax": 133.5,
    "ay": 96.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r1.png",
    "w": 267,
    "h": 174,
    "ax": 133.5,
    "ay": 111.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r2.png",
    "w": 267,
    "h": 174,
    "ax": 133.5,
    "ay": 111.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r3.png",
    "w": 267,
    "h": 159,
    "ax": 133.5,
    "ay": 96.1,
    "fw": 4,
    "fd": 4
   }
  ]
 }
};
