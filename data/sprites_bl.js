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
    "w": 363.0,
    "h": 227.5,
    "ax": 181.5,
    "ay": 143.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/chemPlant_r1.png",
    "w": 363.0,
    "h": 188.5,
    "ax": 181.5,
    "ay": 104.6,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/chemPlant_r2.png",
    "w": 363.0,
    "h": 229.0,
    "ax": 181.5,
    "ay": 145.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/chemPlant_r3.png",
    "w": 363.0,
    "h": 273.5,
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
    "w": 779.0,
    "h": 550.0,
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
    "w": 790.0,
    "h": 425.0,
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
    "w": 779.0,
    "h": 468.5,
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
    "w": 790.0,
    "h": 510.0,
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
    "w": 139.0,
    "h": 197.0,
    "ax": 69.5,
    "ay": 163.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r1.png",
    "w": 139.0,
    "h": 187.0,
    "ax": 69.5,
    "ay": 153.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r2.png",
    "w": 139.0,
    "h": 199.5,
    "ax": 69.5,
    "ay": 165.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/distillation_r3.png",
    "w": 139.0,
    "h": 209.5,
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
    "w": 267.0,
    "h": 157.5,
    "ax": 133.5,
    "ay": 94.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r1.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r2.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/crudeTank_r3.png",
    "w": 267.0,
    "h": 158.0,
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
    "w": 139.0,
    "h": 67.0,
    "ax": 69.5,
    "ay": 33.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r1.png",
    "w": 139.0,
    "h": 87.0,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r2.png",
    "w": 139.0,
    "h": 79.5,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_gasoline_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 139.0,
    "h": 71.0,
    "ax": 69.5,
    "ay": 37.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r1.png",
    "w": 139.0,
    "h": 87.0,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r2.png",
    "w": 139.0,
    "h": 79.5,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_diesel_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 139.0,
    "h": 67.0,
    "ax": 69.5,
    "ay": 33.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r1.png",
    "w": 139.0,
    "h": 87.0,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r2.png",
    "w": 139.0,
    "h": 79.5,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_naphtha_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 139.0,
    "h": 71.0,
    "ax": 69.5,
    "ay": 37.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r1.png",
    "w": 139.0,
    "h": 87.0,
    "ax": 69.5,
    "ay": 53.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r2.png",
    "w": 139.0,
    "h": 79.5,
    "ax": 69.5,
    "ay": 45.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/tank_heavy_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 395.0,
    "h": 279.0,
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
    "w": 395.0,
    "h": 209.0,
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
    "w": 395.0,
    "h": 218.5,
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
    "w": 395.0,
    "h": 277.5,
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
    "w": 267.0,
    "h": 344.5,
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
    "w": 267.0,
    "h": 294.0,
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
    "w": 267.0,
    "h": 243.5,
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
    "w": 267.0,
    "h": 294.0,
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
    "w": 267.0,
    "h": 216.5,
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
    "w": 267.0,
    "h": 173.5,
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
    "w": 267.0,
    "h": 170.5,
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
    "w": 267.0,
    "h": 219.5,
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
    "w": 270.0,
    "h": 155.5,
    "ax": 136.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r1.png",
    "w": 267.0,
    "h": 156.0,
    "ax": 133.5,
    "ay": 93.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r2.png",
    "w": 270.0,
    "h": 155.5,
    "ax": 133.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/sawmill_r3.png",
    "w": 267.0,
    "h": 156.0,
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
    "w": 267.0,
    "h": 223.0,
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
    "w": 267.0,
    "h": 223.0,
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
    "w": 267.0,
    "h": 183.0,
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
    "w": 267.0,
    "h": 183.0,
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
    "w": 267.0,
    "h": 147.0,
    "ax": 133.5,
    "ay": 84.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r1.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r2.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/detergentFactory_r3.png",
    "w": 267.0,
    "h": 173.0,
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
    "w": 267.0,
    "h": 189.5,
    "ax": 133.5,
    "ay": 126.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r1.png",
    "w": 267.0,
    "h": 161.0,
    "ax": 133.5,
    "ay": 98.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r2.png",
    "w": 267.0,
    "h": 141.5,
    "ax": 133.5,
    "ay": 78.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/garmentFactory_r3.png",
    "w": 267.0,
    "h": 177.0,
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
    "w": 395.0,
    "h": 231.5,
    "ax": 197.5,
    "ay": 140.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r1.png",
    "w": 395.0,
    "h": 219.0,
    "ax": 197.5,
    "ay": 127.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r2.png",
    "w": 395.0,
    "h": 226.0,
    "ax": 197.5,
    "ay": 134.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/buildmatFactory_r3.png",
    "w": 395.0,
    "h": 283.0,
    "ax": 197.5,
    "ay": 191.6,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "carFactory": {
  "fw": 9,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/carFactory_r0.png",
    "w": 459.0,
    "h": 245.0,
    "ax": 229.5,
    "ay": 139.6,
    "fw": 9,
    "fd": 5
   },
   {
    "file": "../assets/bl/carFactory_r1.png",
    "w": 459.0,
    "h": 245.0,
    "ax": 229.5,
    "ay": 139.6,
    "fw": 5,
    "fd": 9
   },
   {
    "file": "../assets/bl/carFactory_r2.png",
    "w": 459.0,
    "h": 245.0,
    "ax": 229.5,
    "ay": 139.6,
    "fw": 9,
    "fd": 5
   },
   {
    "file": "../assets/bl/carFactory_r3.png",
    "w": 459.0,
    "h": 245.0,
    "ax": 229.5,
    "ay": 139.6,
    "fw": 5,
    "fd": 9
   }
  ]
 },
 "aircraftFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/aircraftFactory_r0.png",
    "w": 363.0,
    "h": 211.5,
    "ax": 181.5,
    "ay": 127.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/aircraftFactory_r1.png",
    "w": 363.0,
    "h": 200.0,
    "ax": 181.5,
    "ay": 116.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/aircraftFactory_r2.png",
    "w": 363.0,
    "h": 200.0,
    "ax": 181.5,
    "ay": 116.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/aircraftFactory_r3.png",
    "w": 363.0,
    "h": 201.5,
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
    "w": 395.0,
    "h": 219.5,
    "ax": 197.5,
    "ay": 128.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r1.png",
    "w": 395.0,
    "h": 210.5,
    "ax": 197.5,
    "ay": 119.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r2.png",
    "w": 395.0,
    "h": 211.5,
    "ax": 197.5,
    "ay": 120.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/semiconductorFactory_r3.png",
    "w": 395.0,
    "h": 212.5,
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
    "w": 427.0,
    "h": 251.5,
    "ax": 213.5,
    "ay": 153.1,
    "fw": 5,
    "fd": 8
   },
   {
    "file": "../assets/bl/shipyard_r1.png",
    "w": 427.0,
    "h": 234.0,
    "ax": 213.5,
    "ay": 135.6,
    "fw": 8,
    "fd": 5
   },
   {
    "file": "../assets/bl/shipyard_r2.png",
    "w": 427.0,
    "h": 234.0,
    "ax": 213.5,
    "ay": 135.6,
    "fw": 5,
    "fd": 8
   },
   {
    "file": "../assets/bl/shipyard_r3.png",
    "w": 427.0,
    "h": 251.0,
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
    "w": 523.0,
    "h": 499.5,
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
    "w": 523.0,
    "h": 393.0,
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
    "w": 523.0,
    "h": 355.5,
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
    "w": 523.0,
    "h": 393.0,
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
    "w": 267.0,
    "h": 162.0,
    "ax": 133.5,
    "ay": 99.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r1.png",
    "w": 267.0,
    "h": 156.5,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r2.png",
    "w": 267.0,
    "h": 156.5,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_r3.png",
    "w": 267.0,
    "h": 156.0,
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
    "w": 267.0,
    "h": 184.0,
    "ax": 133.5,
    "ay": 121.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r1.png",
    "w": 267.0,
    "h": 156.5,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r2.png",
    "w": 267.0,
    "h": 156.5,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L2_r3.png",
    "w": 267.0,
    "h": 167.0,
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
    "w": 267.0,
    "h": 206.5,
    "ax": 133.5,
    "ay": 143.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r1.png",
    "w": 267.0,
    "h": 173.5,
    "ax": 133.5,
    "ay": 110.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r2.png",
    "w": 267.0,
    "h": 156.5,
    "ax": 133.5,
    "ay": 93.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/researchLab_L3_r3.png",
    "w": 267.0,
    "h": 189.5,
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
    "w": 267.0,
    "h": 178.0,
    "ax": 133.5,
    "ay": 115.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r1.png",
    "w": 267.0,
    "h": 155.5,
    "ax": 133.5,
    "ay": 92.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r2.png",
    "w": 267.0,
    "h": 145.5,
    "ax": 133.5,
    "ay": 82.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_bulk_r3.png",
    "w": 267.0,
    "h": 170.5,
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
    "w": 267.0,
    "h": 165.5,
    "ax": 133.5,
    "ay": 102.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r1.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r2.png",
    "w": 267.0,
    "h": 155.0,
    "ax": 133.5,
    "ay": 92.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/warehouse_goods_r3.png",
    "w": 267.0,
    "h": 156.0,
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
    "w": 203.0,
    "h": 171.0,
    "ax": 101.5,
    "ay": 122.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r1.png",
    "w": 203.0,
    "h": 154.0,
    "ax": 101.5,
    "ay": 105.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r2.png",
    "w": 203.0,
    "h": 144.5,
    "ax": 101.5,
    "ay": 96.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_chemPlant_r3.png",
    "w": 203.0,
    "h": 162.5,
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
    "w": 235.0,
    "h": 292.5,
    "ax": 117.5,
    "ay": 237.1,
    "fw": 3,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_steelMill_r1.png",
    "w": 235.0,
    "h": 269.5,
    "ax": 117.5,
    "ay": 214.1,
    "fw": 4,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_steelMill_r2.png",
    "w": 235.0,
    "h": 275.5,
    "ax": 117.5,
    "ay": 220.1,
    "fw": 3,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_steelMill_r3.png",
    "w": 235.0,
    "h": 301.0,
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
    "w": 203.0,
    "h": 169.0,
    "ax": 101.5,
    "ay": 120.6,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r1.png",
    "w": 203.0,
    "h": 154.5,
    "ax": 101.5,
    "ay": 106.1,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r2.png",
    "w": 203.0,
    "h": 175.5,
    "ax": 101.5,
    "ay": 127.1,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/module_aluminumSmelter_r3.png",
    "w": 203.0,
    "h": 189.5,
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
    "w": 171.0,
    "h": 131.5,
    "ax": 85.5,
    "ay": 90.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_kiln_r1.png",
    "w": 171.0,
    "h": 119.0,
    "ax": 85.5,
    "ay": 77.6,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_kiln_r2.png",
    "w": 171.0,
    "h": 119.0,
    "ax": 85.5,
    "ay": 77.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_kiln_r3.png",
    "w": 171.0,
    "h": 149.0,
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
    "w": 139.0,
    "h": 99.0,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r1.png",
    "w": 139.0,
    "h": 100.0,
    "ax": 69.5,
    "ay": 66.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r2.png",
    "w": 139.0,
    "h": 80.5,
    "ax": 69.5,
    "ay": 46.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_sawmill_r3.png",
    "w": 139.0,
    "h": 90.5,
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
    "w": 171.0,
    "h": 116.0,
    "ax": 85.5,
    "ay": 74.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_paperMill_r1.png",
    "w": 171.0,
    "h": 111.5,
    "ax": 85.5,
    "ay": 70.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_paperMill_r2.png",
    "w": 171.0,
    "h": 103.0,
    "ax": 85.5,
    "ay": 61.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_paperMill_r3.png",
    "w": 171.0,
    "h": 115.5,
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
    "w": 171.0,
    "h": 112.5,
    "ax": 85.5,
    "ay": 71.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_detergentFactory_r1.png",
    "w": 171.0,
    "h": 98.5,
    "ax": 85.5,
    "ay": 57.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_detergentFactory_r2.png",
    "w": 171.0,
    "h": 123.5,
    "ax": 85.5,
    "ay": 82.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_detergentFactory_r3.png",
    "w": 171.0,
    "h": 138.0,
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
    "w": 139.0,
    "h": 119.0,
    "ax": 69.5,
    "ay": 85.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r1.png",
    "w": 139.0,
    "h": 107.5,
    "ax": 69.5,
    "ay": 73.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r2.png",
    "w": 139.0,
    "h": 99.0,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_garmentFactory_r3.png",
    "w": 139.0,
    "h": 119.0,
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
    "w": 203.0,
    "h": 129.5,
    "ax": 101.5,
    "ay": 81.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r1.png",
    "w": 203.0,
    "h": 113.0,
    "ax": 101.5,
    "ay": 64.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r2.png",
    "w": 203.0,
    "h": 128.0,
    "ax": 101.5,
    "ay": 79.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_buildmatFactory_r3.png",
    "w": 203.0,
    "h": 155.0,
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
    "w": 203.0,
    "h": 129.5,
    "ax": 101.5,
    "ay": 81.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r1.png",
    "w": 203.0,
    "h": 107.0,
    "ax": 101.5,
    "ay": 58.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r2.png",
    "w": 203.0,
    "h": 127.0,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_carFactory_r3.png",
    "w": 203.0,
    "h": 126.5,
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
    "w": 203.0,
    "h": 139.0,
    "ax": 101.5,
    "ay": 90.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r1.png",
    "w": 203.0,
    "h": 127.0,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r2.png",
    "w": 203.0,
    "h": 127.0,
    "ax": 101.5,
    "ay": 78.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_aircraftFactory_r3.png",
    "w": 203.0,
    "h": 139.0,
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
    "w": 171.0,
    "h": 121.5,
    "ax": 85.5,
    "ay": 80.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r1.png",
    "w": 171.0,
    "h": 118.5,
    "ax": 85.5,
    "ay": 77.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r2.png",
    "w": 171.0,
    "h": 134.5,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_semiconductorFactory_r3.png",
    "w": 171.0,
    "h": 121.5,
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
    "w": 267.0,
    "h": 294.0,
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
    "w": 267.0,
    "h": 251.0,
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
    "w": 267.0,
    "h": 215.5,
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
    "w": 267.0,
    "h": 260.5,
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
    "w": 587.0,
    "h": 437.0,
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
    "w": 587.0,
    "h": 396.5,
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
    "w": 587.0,
    "h": 317.0,
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
    "w": 587.0,
    "h": 444.0,
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
    "w": 171.0,
    "h": 134.0,
    "ax": 85.5,
    "ay": 92.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_copperSmelter_r1.png",
    "w": 171.0,
    "h": 130.5,
    "ax": 85.5,
    "ay": 89.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_copperSmelter_r2.png",
    "w": 171.0,
    "h": 117.5,
    "ax": 85.5,
    "ay": 76.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_copperSmelter_r3.png",
    "w": 171.0,
    "h": 134.0,
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
    "w": 427.0,
    "h": 249.5,
    "ax": 213.5,
    "ay": 151.1,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/pcFactory_r1.png",
    "w": 427.0,
    "h": 227.5,
    "ax": 213.5,
    "ay": 129.1,
    "fw": 6,
    "fd": 7
   },
   {
    "file": "../assets/bl/pcFactory_r2.png",
    "w": 427.0,
    "h": 227.0,
    "ax": 213.5,
    "ay": 128.6,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/pcFactory_r3.png",
    "w": 427.0,
    "h": 249.5,
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
    "w": 171.0,
    "h": 134.5,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pcFactory_r1.png",
    "w": 171.0,
    "h": 134.5,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_pcFactory_r2.png",
    "w": 171.0,
    "h": 135.5,
    "ax": 85.5,
    "ay": 94.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pcFactory_r3.png",
    "w": 171.0,
    "h": 134.5,
    "ax": 85.5,
    "ay": 93.1,
    "fw": 2,
    "fd": 3
   }
  ]
 },
 "evFactory": {
  "fw": 9,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/evFactory_r0.png",
    "w": 555.0,
    "h": 339.0,
    "ax": 277.5,
    "ay": 212.1,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/evFactory_r1.png",
    "w": 555.0,
    "h": 286.0,
    "ax": 277.5,
    "ay": 159.1,
    "fw": 8,
    "fd": 9
   },
   {
    "file": "../assets/bl/evFactory_r2.png",
    "w": 555.0,
    "h": 286.0,
    "ax": 277.5,
    "ay": 159.1,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/evFactory_r3.png",
    "w": 555.0,
    "h": 297.5,
    "ax": 277.5,
    "ay": 170.6,
    "fw": 8,
    "fd": 9
   }
  ]
 },
 "module_evFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_evFactory_r0.png",
    "w": 203.0,
    "h": 149.0,
    "ax": 101.5,
    "ay": 100.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r1.png",
    "w": 203.0,
    "h": 133.0,
    "ax": 101.5,
    "ay": 84.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r2.png",
    "w": 203.0,
    "h": 133.0,
    "ax": 101.5,
    "ay": 84.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_evFactory_r3.png",
    "w": 203.0,
    "h": 149.0,
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
    "w": 363.0,
    "h": 227.5,
    "ax": 181.5,
    "ay": 143.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/pharmaFactory_r1.png",
    "w": 363.0,
    "h": 200.5,
    "ax": 181.5,
    "ay": 116.6,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/pharmaFactory_r2.png",
    "w": 363.0,
    "h": 200.5,
    "ax": 181.5,
    "ay": 116.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/pharmaFactory_r3.png",
    "w": 363.0,
    "h": 241.5,
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
    "w": 139.0,
    "h": 117.5,
    "ax": 69.5,
    "ay": 83.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r1.png",
    "w": 139.0,
    "h": 99.0,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r2.png",
    "w": 139.0,
    "h": 99.0,
    "ax": 69.5,
    "ay": 65.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_pharmaFactory_r3.png",
    "w": 139.0,
    "h": 120.5,
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
    "w": 395.0,
    "h": 235.5,
    "ax": 197.5,
    "ay": 144.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r1.png",
    "w": 395.0,
    "h": 215.0,
    "ax": 197.5,
    "ay": 123.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r2.png",
    "w": 395.0,
    "h": 253.0,
    "ax": 197.5,
    "ay": 161.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/rocketFactory_r3.png",
    "w": 395.0,
    "h": 299.0,
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
    "w": 171.0,
    "h": 171.0,
    "ax": 85.5,
    "ay": 129.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_rocketFactory_r1.png",
    "w": 171.0,
    "h": 154.5,
    "ax": 85.5,
    "ay": 113.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_rocketFactory_r2.png",
    "w": 171.0,
    "h": 169.0,
    "ax": 85.5,
    "ay": 127.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_rocketFactory_r3.png",
    "w": 171.0,
    "h": 180.5,
    "ax": 85.5,
    "ay": 139.1,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "munitionsFactory": {
  "fw": 9,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/munitionsFactory_r0.png",
    "w": 555.0,
    "h": 282.0,
    "ax": 277.5,
    "ay": 155.1,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/munitionsFactory_r1.png",
    "w": 555.0,
    "h": 303.0,
    "ax": 277.5,
    "ay": 176.1,
    "fw": 8,
    "fd": 9
   },
   {
    "file": "../assets/bl/munitionsFactory_r2.png",
    "w": 555.0,
    "h": 299.0,
    "ax": 277.5,
    "ay": 172.1,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/munitionsFactory_r3.png",
    "w": 555.0,
    "h": 305.0,
    "ax": 277.5,
    "ay": 178.1,
    "fw": 8,
    "fd": 9
   }
  ]
 },
 "module_munitionsFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_munitionsFactory_r0.png",
    "w": 203.0,
    "h": 118.0,
    "ax": 101.5,
    "ay": 69.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r1.png",
    "w": 203.0,
    "h": 122.5,
    "ax": 101.5,
    "ay": 74.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r2.png",
    "w": 203.0,
    "h": 122.5,
    "ax": 101.5,
    "ay": 74.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_munitionsFactory_r3.png",
    "w": 203.0,
    "h": 119.5,
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
    "w": 139.0,
    "h": 87.5,
    "ax": 69.5,
    "ay": 53.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r1.png",
    "w": 139.0,
    "h": 89.0,
    "ax": 69.5,
    "ay": 55.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r2.png",
    "w": 139.0,
    "h": 89.5,
    "ax": 69.5,
    "ay": 55.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/oilWell_r3.png",
    "w": 139.0,
    "h": 84.5,
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
    "w": 203.0,
    "h": 138.5,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r1.png",
    "w": 203.0,
    "h": 117.0,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r2.png",
    "w": 203.0,
    "h": 137.0,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_iron_r3.png",
    "w": 203.0,
    "h": 158.5,
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
    "w": 203.0,
    "h": 138.5,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r1.png",
    "w": 203.0,
    "h": 117.0,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r2.png",
    "w": 203.0,
    "h": 137.0,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_coal_r3.png",
    "w": 203.0,
    "h": 158.5,
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
    "w": 203.0,
    "h": 138.5,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r1.png",
    "w": 203.0,
    "h": 117.0,
    "ax": 101.5,
    "ay": 68.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r2.png",
    "w": 203.0,
    "h": 137.0,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_copper_r3.png",
    "w": 203.0,
    "h": 158.5,
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
    "w": 139.0,
    "h": 73.5,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r1.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r2.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_coal_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 139.0,
    "h": 73.5,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r1.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r2.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_iron_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 139.0,
    "h": 73.5,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r1.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r2.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_copper_r3.png",
    "w": 139.0,
    "h": 73.5,
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
    "w": 267.0,
    "h": 153.0,
    "ax": 133.5,
    "ay": 90.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r1.png",
    "w": 267.0,
    "h": 134.0,
    "ax": 133.5,
    "ay": 71.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r2.png",
    "w": 267.0,
    "h": 151.5,
    "ax": 133.5,
    "ay": 88.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/container_r3.png",
    "w": 267.0,
    "h": 153.0,
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
    "w": 267.0,
    "h": 159.0,
    "ax": 133.5,
    "ay": 96.1,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r1.png",
    "w": 267.0,
    "h": 174.5,
    "ax": 133.5,
    "ay": 111.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r2.png",
    "w": 267.0,
    "h": 174.5,
    "ax": 133.5,
    "ay": 111.6,
    "fw": 4,
    "fd": 4
   },
   {
    "file": "../assets/bl/portcrane_r3.png",
    "w": 267.0,
    "h": 159.0,
    "ax": 133.5,
    "ay": 96.1,
    "fw": 4,
    "fd": 4
   }
  ]
 },
 "fineChemPlant": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/fineChemPlant_r0.png",
    "w": 363.0,
    "h": 245.0,
    "ax": 181.5,
    "ay": 161.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/fineChemPlant_r1.png",
    "w": 363.0,
    "h": 220.5,
    "ax": 181.5,
    "ay": 136.6,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/fineChemPlant_r2.png",
    "w": 363.0,
    "h": 245.0,
    "ax": 181.5,
    "ay": 161.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/fineChemPlant_r3.png",
    "w": 363.0,
    "h": 296.5,
    "ax": 181.5,
    "ay": 212.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "explosivesFactory": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/explosivesFactory_r0.png",
    "w": 395.0,
    "h": 239.5,
    "ax": 197.5,
    "ay": 148.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/explosivesFactory_r1.png",
    "w": 395.0,
    "h": 194.0,
    "ax": 197.5,
    "ay": 102.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/explosivesFactory_r2.png",
    "w": 395.0,
    "h": 205.5,
    "ax": 197.5,
    "ay": 114.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/explosivesFactory_r3.png",
    "w": 395.0,
    "h": 239.5,
    "ax": 197.5,
    "ay": 148.1,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "colonyFactory": {
  "fw": 12,
  "fd": 12,
  "r": [
   {
    "file": "../assets/bl/colonyFactory_r0.png",
    "w": 779.0,
    "h": 685.5,
    "ax": 389.5,
    "ay": 508.1,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/colonyFactory_r1.png",
    "w": 779.0,
    "h": 572.5,
    "ax": 389.5,
    "ay": 395.1,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/colonyFactory_r2.png",
    "w": 779.0,
    "h": 527.0,
    "ax": 389.5,
    "ay": 349.6,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/colonyFactory_r3.png",
    "w": 779.0,
    "h": 610.0,
    "ax": 389.5,
    "ay": 432.6,
    "fw": 12,
    "fd": 12
   }
  ]
 },
 "offshoreFactory": {
  "fw": 10,
  "fd": 10,
  "r": [
   {
    "file": "../assets/bl/offshoreFactory_r0.png",
    "w": 651.0,
    "h": 378.5,
    "ax": 325.5,
    "ay": 230.1,
    "fw": 10,
    "fd": 10
   },
   {
    "file": "../assets/bl/offshoreFactory_r1.png",
    "w": 651.0,
    "h": 378.5,
    "ax": 325.5,
    "ay": 230.1,
    "fw": 10,
    "fd": 10
   },
   {
    "file": "../assets/bl/offshoreFactory_r2.png",
    "w": 651.0,
    "h": 398.5,
    "ax": 325.5,
    "ay": 250.1,
    "fw": 10,
    "fd": 10
   },
   {
    "file": "../assets/bl/offshoreFactory_r3.png",
    "w": 651.0,
    "h": 381.5,
    "ax": 325.5,
    "ay": 233.1,
    "fw": 10,
    "fd": 10
   }
  ]
 },
 "aiDefenseFactory": {
  "fw": 12,
  "fd": 12,
  "r": [
   {
    "file": "../assets/bl/aiDefenseFactory_r0.png",
    "w": 779.0,
    "h": 501.5,
    "ax": 389.5,
    "ay": 324.6,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/aiDefenseFactory_r1.png",
    "w": 779.0,
    "h": 413.5,
    "ax": 389.5,
    "ay": 236.1,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/aiDefenseFactory_r2.png",
    "w": 779.0,
    "h": 413.0,
    "ax": 389.5,
    "ay": 236.1,
    "fw": 12,
    "fd": 12
   },
   {
    "file": "../assets/bl/aiDefenseFactory_r3.png",
    "w": 779.0,
    "h": 444.5,
    "ax": 389.5,
    "ay": 267.6,
    "fw": 12,
    "fd": 12
   }
  ]
 },
 "motorFactory": {
  "fw": 7,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/motorFactory_r0.png",
    "w": 427.0,
    "h": 242.5,
    "ax": 213.5,
    "ay": 144.1,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/motorFactory_r1.png",
    "w": 427.0,
    "h": 225.5,
    "ax": 213.5,
    "ay": 127.1,
    "fw": 6,
    "fd": 7
   },
   {
    "file": "../assets/bl/motorFactory_r2.png",
    "w": 427.0,
    "h": 275.0,
    "ax": 213.5,
    "ay": 176.6,
    "fw": 7,
    "fd": 6
   },
   {
    "file": "../assets/bl/motorFactory_r3.png",
    "w": 427.0,
    "h": 262.0,
    "ax": 213.5,
    "ay": 163.6,
    "fw": 6,
    "fd": 7
   }
  ]
 },
 "powerEquipFactory": {
  "fw": 9,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/powerEquipFactory_r0.png",
    "w": 555.0,
    "h": 337.5,
    "ax": 277.5,
    "ay": 210.6,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/powerEquipFactory_r1.png",
    "w": 555.0,
    "h": 291.5,
    "ax": 277.5,
    "ay": 164.6,
    "fw": 8,
    "fd": 9
   },
   {
    "file": "../assets/bl/powerEquipFactory_r2.png",
    "w": 555.0,
    "h": 337.0,
    "ax": 277.5,
    "ay": 210.1,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/powerEquipFactory_r3.png",
    "w": 555.0,
    "h": 402.0,
    "ax": 277.5,
    "ay": 275.1,
    "fw": 8,
    "fd": 9
   }
  ]
 },
 "commGearFactory": {
  "fw": 6,
  "fd": 6,
  "r": [
   {
    "file": "../assets/bl/commGearFactory_r0.png",
    "w": 395.0,
    "h": 301.5,
    "ax": 197.5,
    "ay": 210.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/commGearFactory_r1.png",
    "w": 395.0,
    "h": 258.5,
    "ax": 197.5,
    "ay": 167.1,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/commGearFactory_r2.png",
    "w": 395.0,
    "h": 215.0,
    "ax": 197.5,
    "ay": 123.6,
    "fw": 6,
    "fd": 6
   },
   {
    "file": "../assets/bl/commGearFactory_r3.png",
    "w": 395.0,
    "h": 244.0,
    "ax": 197.5,
    "ay": 152.6,
    "fw": 6,
    "fd": 6
   }
  ]
 },
 "satelliteFactory": {
  "fw": 9,
  "fd": 8,
  "r": [
   {
    "file": "../assets/bl/satelliteFactory_r0.png",
    "w": 555.0,
    "h": 304.5,
    "ax": 277.5,
    "ay": 177.6,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/satelliteFactory_r1.png",
    "w": 555.0,
    "h": 285.5,
    "ax": 277.5,
    "ay": 158.6,
    "fw": 8,
    "fd": 9
   },
   {
    "file": "../assets/bl/satelliteFactory_r2.png",
    "w": 555.0,
    "h": 285.5,
    "ax": 277.5,
    "ay": 158.6,
    "fw": 9,
    "fd": 8
   },
   {
    "file": "../assets/bl/satelliteFactory_r3.png",
    "w": 555.0,
    "h": 296.5,
    "ax": 277.5,
    "ay": 169.6,
    "fw": 8,
    "fd": 9
   }
  ]
 },
 "cableFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/cableFactory_r0.png",
    "w": 363.0,
    "h": 200.5,
    "ax": 181.5,
    "ay": 116.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/cableFactory_r1.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/cableFactory_r2.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/cableFactory_r3.png",
    "w": 363.0,
    "h": 232.5,
    "ax": 181.5,
    "ay": 148.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "fiberFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/fiberFactory_r0.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/fiberFactory_r1.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/fiberFactory_r2.png",
    "w": 363.0,
    "h": 225.0,
    "ax": 181.5,
    "ay": 141.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/fiberFactory_r3.png",
    "w": 363.0,
    "h": 250.5,
    "ax": 181.5,
    "ay": 166.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "module_cableFactory": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_cableFactory_r0.png",
    "w": 139.0,
    "h": 95.5,
    "ax": 69.5,
    "ay": 61.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_cableFactory_r1.png",
    "w": 139.0,
    "h": 84.0,
    "ax": 69.5,
    "ay": 50.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_cableFactory_r2.png",
    "w": 139.0,
    "h": 95.0,
    "ax": 69.5,
    "ay": 61.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_cableFactory_r3.png",
    "w": 139.0,
    "h": 95.5,
    "ax": 69.5,
    "ay": 61.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "module_fiberFactory": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_fiberFactory_r0.png",
    "w": 139.0,
    "h": 118.5,
    "ax": 69.5,
    "ay": 84.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_fiberFactory_r1.png",
    "w": 139.0,
    "h": 103.0,
    "ax": 69.5,
    "ay": 69.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_fiberFactory_r2.png",
    "w": 139.0,
    "h": 123.5,
    "ax": 69.5,
    "ay": 89.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_fiberFactory_r3.png",
    "w": 139.0,
    "h": 139.0,
    "ax": 69.5,
    "ay": 105.1,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "module_motorFactory": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_motorFactory_r0.png",
    "w": 171.0,
    "h": 125.5,
    "ax": 85.5,
    "ay": 84.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_motorFactory_r1.png",
    "w": 171.0,
    "h": 95.0,
    "ax": 85.5,
    "ay": 53.6,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_motorFactory_r2.png",
    "w": 171.0,
    "h": 110.0,
    "ax": 85.5,
    "ay": 68.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_motorFactory_r3.png",
    "w": 171.0,
    "h": 125.5,
    "ax": 85.5,
    "ay": 84.1,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "module_powerEquipFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_powerEquipFactory_r0.png",
    "w": 203.0,
    "h": 179.0,
    "ax": 101.5,
    "ay": 130.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_powerEquipFactory_r1.png",
    "w": 203.0,
    "h": 162.0,
    "ax": 101.5,
    "ay": 113.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_powerEquipFactory_r2.png",
    "w": 203.0,
    "h": 146.0,
    "ax": 101.5,
    "ay": 97.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_powerEquipFactory_r3.png",
    "w": 203.0,
    "h": 163.0,
    "ax": 101.5,
    "ay": 114.6,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_commGearFactory": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/module_commGearFactory_r0.png",
    "w": 139.0,
    "h": 120.5,
    "ax": 69.5,
    "ay": 86.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_commGearFactory_r1.png",
    "w": 139.0,
    "h": 139.0,
    "ax": 69.5,
    "ay": 105.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_commGearFactory_r2.png",
    "w": 139.0,
    "h": 157.5,
    "ax": 69.5,
    "ay": 123.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_commGearFactory_r3.png",
    "w": 139.0,
    "h": 139.0,
    "ax": 69.5,
    "ay": 105.1,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "module_satelliteFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_satelliteFactory_r0.png",
    "w": 203.0,
    "h": 132.5,
    "ax": 101.5,
    "ay": 84.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_satelliteFactory_r1.png",
    "w": 203.0,
    "h": 114.0,
    "ax": 101.5,
    "ay": 65.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_satelliteFactory_r2.png",
    "w": 203.0,
    "h": 124.0,
    "ax": 101.5,
    "ay": 75.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_satelliteFactory_r3.png",
    "w": 203.0,
    "h": 146.0,
    "ax": 101.5,
    "ay": 97.6,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "tireFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/tireFactory_r0.png",
    "w": 363.0,
    "h": 211.5,
    "ax": 181.5,
    "ay": 127.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/tireFactory_r1.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/tireFactory_r2.png",
    "w": 363.0,
    "h": 197.0,
    "ax": 181.5,
    "ay": 113.1,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/tireFactory_r3.png",
    "w": 363.0,
    "h": 250.0,
    "ax": 181.5,
    "ay": 166.1,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "batteryFactory": {
  "fw": 6,
  "fd": 5,
  "r": [
   {
    "file": "../assets/bl/batteryFactory_r0.png",
    "w": 363.0,
    "h": 195.5,
    "ax": 181.5,
    "ay": 111.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/batteryFactory_r1.png",
    "w": 363.0,
    "h": 194.0,
    "ax": 181.5,
    "ay": 110.1,
    "fw": 5,
    "fd": 6
   },
   {
    "file": "../assets/bl/batteryFactory_r2.png",
    "w": 363.0,
    "h": 196.5,
    "ax": 181.5,
    "ay": 112.6,
    "fw": 6,
    "fd": 5
   },
   {
    "file": "../assets/bl/batteryFactory_r3.png",
    "w": 363.0,
    "h": 235.5,
    "ax": 181.5,
    "ay": 151.6,
    "fw": 5,
    "fd": 6
   }
  ]
 },
 "module_tireFactory": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_tireFactory_r0.png",
    "w": 203.0,
    "h": 133.5,
    "ax": 101.5,
    "ay": 85.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_tireFactory_r1.png",
    "w": 203.0,
    "h": 103.5,
    "ax": 101.5,
    "ay": 55.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_tireFactory_r2.png",
    "w": 203.0,
    "h": 124.0,
    "ax": 101.5,
    "ay": 75.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_tireFactory_r3.png",
    "w": 203.0,
    "h": 126.5,
    "ax": 101.5,
    "ay": 78.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "module_batteryFactory": {
  "fw": 2,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/module_batteryFactory_r0.png",
    "w": 171.0,
    "h": 115.5,
    "ax": 85.5,
    "ay": 74.1,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_batteryFactory_r1.png",
    "w": 171.0,
    "h": 98.5,
    "ax": 85.5,
    "ay": 57.1,
    "fw": 3,
    "fd": 2
   },
   {
    "file": "../assets/bl/module_batteryFactory_r2.png",
    "w": 171.0,
    "h": 110.0,
    "ax": 85.5,
    "ay": 68.6,
    "fw": 2,
    "fd": 3
   },
   {
    "file": "../assets/bl/module_batteryFactory_r3.png",
    "w": 171.0,
    "h": 116.0,
    "ax": 85.5,
    "ay": 74.6,
    "fw": 3,
    "fd": 2
   }
  ]
 },
 "mine_silica": {
  "fw": 3,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/mine_silica_r0.png",
    "w": 203.0,
    "h": 138.5,
    "ax": 101.5,
    "ay": 90.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_silica_r1.png",
    "w": 203.0,
    "h": 117.5,
    "ax": 101.5,
    "ay": 69.1,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_silica_r2.png",
    "w": 203.0,
    "h": 137.0,
    "ax": 101.5,
    "ay": 88.6,
    "fw": 3,
    "fd": 3
   },
   {
    "file": "../assets/bl/mine_silica_r3.png",
    "w": 203.0,
    "h": 158.5,
    "ax": 101.5,
    "ay": 110.1,
    "fw": 3,
    "fd": 3
   }
  ]
 },
 "yard_silica": {
  "fw": 2,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/yard_silica_r0.png",
    "w": 139.0,
    "h": 73.5,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_silica_r1.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_silica_r2.png",
    "w": 139.0,
    "h": 81.0,
    "ax": 69.5,
    "ay": 47.1,
    "fw": 2,
    "fd": 2
   },
   {
    "file": "../assets/bl/yard_silica_r3.png",
    "w": 139.0,
    "h": 73.5,
    "ax": 69.5,
    "ay": 39.6,
    "fw": 2,
    "fd": 2
   }
  ]
 },
 "ship_coaster": {
  "fw": 6,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/ship_coaster_r0.png",
    "w": 168.5,
    "h": 102.5,
    "ax": 91.5,
    "ay": 68.1,
    "fw": 6,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_coaster_r1.png",
    "w": 168.5,
    "h": 103.0,
    "ax": 77.0,
    "ay": 68.1,
    "fw": 3,
    "fd": 6
   },
   {
    "file": "../assets/bl/ship_coaster_r2.png",
    "w": 168.5,
    "h": 98.0,
    "ax": 77.0,
    "ay": 57.1,
    "fw": 6,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_coaster_r3.png",
    "w": 168.5,
    "h": 98.0,
    "ax": 91.5,
    "ay": 57.1,
    "fw": 3,
    "fd": 6
   }
  ]
 },
 "ship_freighter": {
  "fw": 8,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/ship_freighter_r0.png",
    "w": 240.0,
    "h": 142.5,
    "ax": 127.5,
    "ay": 92.1,
    "fw": 8,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_freighter_r1.png",
    "w": 240.0,
    "h": 142.5,
    "ax": 112.5,
    "ay": 92.1,
    "fw": 3,
    "fd": 8
   },
   {
    "file": "../assets/bl/ship_freighter_r2.png",
    "w": 240.0,
    "h": 134.5,
    "ax": 112.5,
    "ay": 77.1,
    "fw": 8,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_freighter_r3.png",
    "w": 240.0,
    "h": 134.5,
    "ax": 127.5,
    "ay": 77.1,
    "fw": 3,
    "fd": 8
   }
  ]
 },
 "ship_tanker": {
  "fw": 10,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/ship_tanker_r0.png",
    "w": 304.5,
    "h": 178.0,
    "ax": 160.0,
    "ay": 113.1,
    "fw": 10,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_tanker_r1.png",
    "w": 304.5,
    "h": 178.0,
    "ax": 144.5,
    "ay": 113.1,
    "fw": 4,
    "fd": 10
   },
   {
    "file": "../assets/bl/ship_tanker_r2.png",
    "w": 304.5,
    "h": 162.5,
    "ax": 144.5,
    "ay": 90.6,
    "fw": 10,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_tanker_r3.png",
    "w": 304.5,
    "h": 162.5,
    "ax": 160.0,
    "ay": 90.6,
    "fw": 4,
    "fd": 10
   }
  ]
 },
 "ship_container": {
  "fw": 12,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/ship_container_r0.png",
    "w": 359.0,
    "h": 193.5,
    "ax": 187.5,
    "ay": 116.6,
    "fw": 12,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_container_r1.png",
    "w": 359.0,
    "h": 189.5,
    "ax": 171.5,
    "ay": 112.6,
    "fw": 4,
    "fd": 12
   },
   {
    "file": "../assets/bl/ship_container_r2.png",
    "w": 359.0,
    "h": 194.5,
    "ax": 171.5,
    "ay": 110.6,
    "fw": 12,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_container_r3.png",
    "w": 359.0,
    "h": 194.5,
    "ax": 187.5,
    "ay": 110.6,
    "fw": 4,
    "fd": 12
   }
  ]
 },
 "ship_fishing": {
  "fw": 4,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/ship_fishing_r0.png",
    "w": 93.0,
    "h": 54.5,
    "ax": 53.5,
    "ay": 36.6,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/ship_fishing_r1.png",
    "w": 93.0,
    "h": 54.5,
    "ax": 39.5,
    "ay": 36.6,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_fishing_r2.png",
    "w": 93.0,
    "h": 57.5,
    "ax": 39.5,
    "ay": 33.6,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/ship_fishing_r3.png",
    "w": 93.0,
    "h": 57.5,
    "ax": 53.5,
    "ay": 33.6,
    "fw": 2,
    "fd": 4
   }
  ]
 },
 "ship_fishing_w": {
  "fw": 4,
  "fd": 2,
  "r": [
   {
    "file": "../assets/bl/ship_fishing_w_r0.png",
    "w": 93.0,
    "h": 57.5,
    "ax": 39.5,
    "ay": 33.6,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/ship_fishing_w_r1.png",
    "w": 93.0,
    "h": 57.5,
    "ax": 53.5,
    "ay": 33.6,
    "fw": 2,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_fishing_w_r2.png",
    "w": 93.0,
    "h": 54.5,
    "ax": 53.5,
    "ay": 36.6,
    "fw": 4,
    "fd": 2
   },
   {
    "file": "../assets/bl/ship_fishing_w_r3.png",
    "w": 93.0,
    "h": 54.5,
    "ax": 39.5,
    "ay": 36.6,
    "fw": 2,
    "fd": 4
   }
  ]
 },
 "ship_coaster_w": {
  "fw": 6,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/ship_coaster_w_r0.png",
    "w": 168.5,
    "h": 98.0,
    "ax": 77.0,
    "ay": 57.1,
    "fw": 6,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_coaster_w_r1.png",
    "w": 168.5,
    "h": 98.0,
    "ax": 91.5,
    "ay": 57.1,
    "fw": 3,
    "fd": 6
   },
   {
    "file": "../assets/bl/ship_coaster_w_r2.png",
    "w": 168.5,
    "h": 102.5,
    "ax": 91.5,
    "ay": 68.1,
    "fw": 6,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_coaster_w_r3.png",
    "w": 168.5,
    "h": 102.5,
    "ax": 77.0,
    "ay": 68.1,
    "fw": 3,
    "fd": 6
   }
  ]
 },
 "ship_freighter_w": {
  "fw": 8,
  "fd": 3,
  "r": [
   {
    "file": "../assets/bl/ship_freighter_w_r0.png",
    "w": 240.0,
    "h": 134.5,
    "ax": 112.5,
    "ay": 77.1,
    "fw": 8,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_freighter_w_r1.png",
    "w": 240.0,
    "h": 134.5,
    "ax": 127.5,
    "ay": 77.1,
    "fw": 3,
    "fd": 8
   },
   {
    "file": "../assets/bl/ship_freighter_w_r2.png",
    "w": 240.0,
    "h": 142.5,
    "ax": 127.5,
    "ay": 92.1,
    "fw": 8,
    "fd": 3
   },
   {
    "file": "../assets/bl/ship_freighter_w_r3.png",
    "w": 240.0,
    "h": 142.5,
    "ax": 112.5,
    "ay": 92.1,
    "fw": 3,
    "fd": 8
   }
  ]
 },
 "ship_tanker_w": {
  "fw": 10,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/ship_tanker_w_r0.png",
    "w": 304.5,
    "h": 162.5,
    "ax": 144.5,
    "ay": 90.6,
    "fw": 10,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_tanker_w_r1.png",
    "w": 304.5,
    "h": 162.5,
    "ax": 160.0,
    "ay": 90.6,
    "fw": 4,
    "fd": 10
   },
   {
    "file": "../assets/bl/ship_tanker_w_r2.png",
    "w": 304.5,
    "h": 178.0,
    "ax": 160.0,
    "ay": 113.1,
    "fw": 10,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_tanker_w_r3.png",
    "w": 304.5,
    "h": 178.0,
    "ax": 144.5,
    "ay": 113.1,
    "fw": 4,
    "fd": 10
   }
  ]
 },
 "ship_container_w": {
  "fw": 12,
  "fd": 4,
  "r": [
   {
    "file": "../assets/bl/ship_container_w_r0.png",
    "w": 359.0,
    "h": 198.5,
    "ax": 171.5,
    "ay": 114.6,
    "fw": 12,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_container_w_r1.png",
    "w": 359.0,
    "h": 197.5,
    "ax": 187.5,
    "ay": 113.6,
    "fw": 4,
    "fd": 12
   },
   {
    "file": "../assets/bl/ship_container_w_r2.png",
    "w": 359.0,
    "h": 191.0,
    "ax": 187.5,
    "ay": 114.1,
    "fw": 12,
    "fd": 4
   },
   {
    "file": "../assets/bl/ship_container_w_r3.png",
    "w": 359.0,
    "h": 188.5,
    "ax": 171.5,
    "ay": 111.6,
    "fw": 4,
    "fd": 12
   }
  ]
 }
};
