// 拠点マップの建物の絵（Canvas 2D の手続き描画）。後から画像に差し替えられるよう、種類ごとの登録表にしてある。
// Sprites.draw(g, e, o)：g＝描画の道具（Iso が渡す。prism/cyl/decal/smoke…）、e＝建物（mapEntities の要素）、o＝{ era(1..6), running, t(秒) }
// 高さの単位は zoom=1 のときのピクセル。タイル座標は (x, y)、足あとは e.fw × e.fd。
(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function hex(c) { c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
  function rgb(a) { return '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
  const mix = (a, b, t) => { const x = hex(a), y = hex(b); return rgb(x.map((v, i) => v * (1 - t) + y[i] * t)); };
  const shade = (c, f) => rgb(hex(c).map(v => v * f));

  // 時代の壁の色（1950年代は煉瓦・木造、高度成長期はコンクリート、現代は明るい外装）
  const ERA = { 1: '#8a5540', 2: '#8a5540', 3: '#807b73', 4: '#75777a', 5: '#8d999f', 6: '#9fabb2' };
  const eraWall = (era, base, k) => shade(mix(base, ERA[clamp(era, 1, 6)] || ERA[3], k === undefined ? 0.5 : k), 0.78);   // 重い色味：全体を一段暗く

  // 加工設備ごとの外観：color 壁の色、h 建屋の高さ、saw ノコギリ屋根、stacks 煙突の数、tanks 反応槽の数、tower 塔の高さ、glass ガラス張り、glow 炉の赤熱
  const SPEC = {
    chemPlant:        { color: '#b9c4bd', h: 14, tanks: 3, stacks: 1, pipes: true },
    steelMill:        { color: '#a89a90', h: 24, saw: false, stacks: 2, glow: true, furnace: true },
    aluminumSmelter:  { color: '#b7bec4', h: 18, saw: true, stacks: 1 },
    copperSmelter:    { color: '#b79b86', h: 18, saw: true, stacks: 2 },
    kiln:             { color: '#c1a07e', h: 12, stacks: 2, kiln: true },
    sawmill:          { color: '#b8a07a', h: 12, saw: true, logs: true },
    paperMill:        { color: '#c8c5b8', h: 22, stacks: 1, bigstack: true },
    detergentFactory: { color: '#c6b9d0', h: 16, saw: true, stacks: 1 },
    garmentFactory:   { color: '#c9b79e', h: 12, saw: true },
    buildmatFactory:  { color: '#b4ada3', h: 16, saw: true, stacks: 1 },
    carFactory:       { color: '#a9b7c4', h: 20, saw: true, stacks: 1, big: true },
    shipyard:         { color: '#9fb0bd', h: 20, crane: true, hull: true },
    aircraftFactory:  { color: '#b9c6d2', h: 22, hangar: true },
    semiconductorFactory: { color: '#c7d3dd', h: 14, glass: true, clean: true },
    pcFactory:        { color: '#bcc9d6', h: 14, glass: true },
    evFactory:        { color: '#bfd1c4', h: 16, glass: true, green: true },
    pharmaFactory:    { color: '#e6dfe4', h: 14, glass: true, clean: true, tanks: 1 },
    rocketFactory:    { color: '#cfd5da', h: 18, rocket: true },
    munitionsFactory: { color: '#8e9a7a', h: 10, bunker: true, stacks: 1 },
    fineChemPlant:    { color: '#e2e6e6', h: 14, glass: true, clean: true, tanks: 2 },
    explosivesFactory: { color: '#b8a98a', h: 8, bunker: true, stacks: 1 },
    colonyFactory:    { color: '#dfe4e8', h: 40, glass: true, clean: true },
    offshoreFactory:  { color: '#9fb4c4', h: 22, glass: true },
    supersonicFactory: { color: '#d6dde4', h: 18, glass: true, clean: true },
    aiDefenseFactory: { color: '#7d8a9a', h: 16, bunker: true, glass: true }
  };
  const TANKCOL = { crudeTank: '#7a5a3a', tank_gasoline: '#e0b84a', tank_diesel: '#4f86b8', tank_naphtha: '#9a6fb8', tank_heavy: '#4a4540' };

  // ---- 部品 ----
  function windows(g, x, y, w, d, z0, z1, rows, wall) {
    // 左面（y=y+d の面）と右面（x=x+w の面）に窓の帯
    const n = Math.max(2, Math.round(w * 2));
    for (let r = 0; r < rows; r++) {
      const za = z0 + (z1 - z0) * (0.35 + r * 0.3), zb = za + (z1 - z0) * 0.14;
      for (let i = 0; i < n; i++) { const u0 = (i + 0.25) / n, u1 = (i + 0.75) / n; g.decalL(x, y, w, d, u0, u1, za, zb, '#3d5468'); }
      const m = Math.max(2, Math.round(d * 2));
      for (let i = 0; i < m; i++) { const u0 = (i + 0.25) / m, u1 = (i + 0.75) / m; g.decalR(x, y, w, d, u0, u1, za, zb, shade('#3d5468', 0.8)); }
    }
  }
  function stack(g, x, y, h, big, running, o) {
    const r = big ? 0.28 : 0.2;
    g.cyl(x, y, r, 0, h, '#a8644a', { rim: '#5a3a2e' });
    g.cyl(x, y, r, h - 3, h, '#4a3a34', {});
    if (running) g.smoke(x, y, h, big ? 1.6 : 1);
  }
  function tank(g, cx, cy, r, h, col, o, roof) {
    g.cyl(cx, cy, r, 0, h, col, { rim: shade(col, 1.15) });
    g.cyl(cx, cy, r * 0.85, h, h + 1.5, shade(col, 1.2), {});
    g.decalCyl && g.decalCyl(cx, cy, r, h * 0.3, h * 0.38, shade(col, 0.7));
  }
  function slab(g, e, col) { g.prism(e.x - 0.14, e.y - 0.14, e.fw + 0.28, e.fd + 0.28, 0, 1.4, col || '#7d7a72'); }   // 基礎の土間（暗く厚く）

  function sawtooth(g, x, y, w, d, z, n, col) {
    for (let i = 0; i < n; i++) {
      const xx = x + (i + 0.05) * w / n, ww = w / n * 0.9;
      g.prism(xx, y + 0.05, ww * 0.45, d - 0.1, z, z + 5, shade(col, 0.95));          // 屋根の起立部
      g.decalR(xx, y + 0.05, ww * 0.45, d - 0.1, 0.1, 0.9, z + 1.5, z + 4, '#9bb8c9');   // 北向きのガラス窓
    }
  }

  // ---- 種類ごとの描画 ----
  const Sprites = {
    SPEC,
    // 当たり判定用の高さ（zoom=1 のpx）
    height(type) {
      if (Sprites.H[type]) return Sprites.H[type];
      if (TANKCOL[type]) return 22;
      if (type === 'refinery') return 70;
      if (type === 'distillation') return 52;
      if (type === 'powerPlant') return 60;
      if (type === 'researchLab') return 36;
      if (type === 'warehouse_bulk' || type === 'warehouse_goods') return 20;
      const sp = SPEC[type]; return sp ? Math.max(sp.h + 22, sp.rocket ? 70 : 0, sp.crane ? 50 : 0) : 36;
    },
    draw(g, e, o) {
      const t = e.type, era = o.era;
      if (e.building) return Sprites.scaffold(g, e, o);
      const fn = Sprites.types[t] || Sprites.factory;
      fn(g, e, o);
    },
    scaffold(g, e, o) {
      slab(g, e, '#a39e92');
      const H = Math.max(6, Sprites.height(e.type) * 0.55) * Math.max(0.15, e.progress);
      const x = e.x, y = e.y, w = e.fw, d = e.fd;
      g.prism(x + 0.1, y + 0.1, w - 0.2, d - 0.2, 1.2, 1.2 + H * 0.6, mix('#8d8478', '#c9bba0', 0.4));
      for (const [px, py] of [[x, y], [x + w - 0.1, y], [x, y + d - 0.1], [x + w - 0.1, y + d - 0.1]]) g.prism(px, py, 0.1, 0.1, 1.2, 1.2 + H + 8, '#d9a441');
      g.line([[x, y, H + 9], [x + w, y, H + 9], [x + w, y + d, H + 9], [x, y + d, H + 9], [x, y, H + 9]], '#d9a441', 1.2);
      g.crane(x + w * 0.5, y + d * 0.5, 14 + H);
    },
    types: {}
  };

  // タンク
  for (const t of Object.keys(TANKCOL)) Sprites.types[t] = function (g, e, o) {
    slab(g, e, '#b4b0a5'); const c = TANKCOL[t], r = e.type === 'crudeTank' ? 0.85 : 0.8;
    tank(g, e.x + e.fw / 2, e.y + e.fd / 2, r, t === 'crudeTank' ? 20 : 15, mix(c, ERA[clamp(o.era, 1, 6)], 0.12), o);
    g.prism(e.x + 0.05, e.y + 0.05, 0.12, 0.12, 1.2, 14, '#5d5a54');
  };
  // 蒸留塔（製油所の増設）
  Sprites.types.distillation = function (g, e, o) {
    slab(g, e, '#b4b0a5'); const cx = e.x + e.fw / 2, cy = e.y + e.fd / 2;
    g.cyl(cx, cy, 0.42, 0, 50, '#c8ccd0', { rim: '#eef1f3' }); g.cyl(cx, cy, 0.5, 20, 22, '#7d8388', {}); g.cyl(cx, cy, 0.5, 34, 36, '#7d8388', {});
    g.prism(e.x + 0.1, e.y + e.fd - 0.35, 0.3, 0.3, 1.2, 6, '#8a6f5a');
  };
  // 製油所
  Sprites.types.refinery = function (g, e, o) {
    slab(g, e, '#aaa699'); const x = e.x, y = e.y;
    g.prism(x + 0.3, y + 2.4, 1.6, 1.2, 1.2, 9, '#8f8a80');                                     // 加熱炉
    g.prism(x + 2.4, y + 2.6, 1.3, 1.0, 1.2, 7, '#8a8a8a');
    const cols = [[x + 1.0, y + 1.0, 0.5, 58], [x + 2.0, y + 1.0, 0.42, 46], [x + 3.0, y + 1.1, 0.34, 36], [x + 3.0, y + 2.1, 0.3, 28]];
    for (const [cx, cy, r, h] of cols) { g.cyl(cx, cy, r, 1.2, h, '#c4c9cd', { rim: '#f0f3f5' }); for (let z = 14; z < h; z += 14) g.cyl(cx, cy, r + 0.07, z, z + 2, '#6f757a', {}); }
    g.prism(x + 0.2, y + 0.4, 3.6, 0.2, 5, 6.5, '#8e5a3c');                                    // 配管ラック
    g.prism(x + 0.2, y + 0.4, 0.2, 2.8, 5, 6.5, '#8e5a3c');
    const fx = x + 3.7, fy = y + 0.3;                                                           // フレア
    g.prism(fx, fy, 0.1, 0.1, 1.2, 70, '#5d5a54');
    if (o.running) { g.flame(fx + 0.05, fy + 0.05, 74, o.t); g.smoke(fx + 0.05, fy + 0.05, 78, 1.3); }
    g.cyl(x + 3.1, y + 3.2, 0.32, 1.2, 12, '#b8b0a0', {});
  };
  // 倉庫
  const wh = function (g, e, o) {
    slab(g, e, '#b9b5aa'); const goods = e.type === 'warehouse_goods', col = eraWall(o.era, goods ? '#c7b79a' : '#a9b3ad', 0.35);
    g.prism(e.x + 0.1, e.y + 0.1, e.fw - 0.2, e.fd - 0.2, 1.2, 15, col);
    g.prism(e.x + 0.1, e.y + 0.1, e.fw - 0.2, e.fd - 0.2, 15, 17.5, shade(col, 0.82));          // 屋根の縁
    g.prism(e.x + 0.4, e.y + 0.3, e.fw - 0.8, e.fd - 0.6, 17.5, 19.5, shade(col, 0.9));         // 棟
    for (let i = 0; i < e.fw; i++) g.decalL(e.x + 0.1, e.y + 0.1, e.fw - 0.2, e.fd - 0.2, (i + 0.2) / e.fw, (i + 0.8) / e.fw, 1.2, 9, goods ? '#4a6a8a' : '#6a6f6a');   // シャッター
  };
  Sprites.types.warehouse_bulk = wh; Sprites.types.warehouse_goods = wh;
  // 自家発電所
  Sprites.types.powerPlant = function (g, e, o) {
    slab(g, e); const x = e.x, y = e.y, col = eraWall(o.era, '#aeb2b4', 0.3);
    g.prism(x + 0.2, y + 1.1, 2.0, 1.7, 1.2, 22, col); g.prism(x + 0.2, y + 1.1, 2.0, 1.7, 22, 24, shade(col, 0.8));
    windows(g, x + 0.2, y + 1.1, 2.0, 1.7, 1.2, 22, 2);
    stack(g, x + 2.5, y + 0.6, 56, true, o.running, o); stack(g, x + 2.0, y + 0.45, 48, false, o.running, o);
    g.cyl(x + 0.7, y + 0.6, 0.55, 1.2, 30, '#cfd1cd', { rim: '#f0f0ee' }); g.cyl(x + 0.7, y + 0.6, 0.38, 28, 30, '#8f918d', {});   // 冷却塔
    if (o.running) g.smoke(x + 0.7, y + 0.6, 30, 1.2);
    g.prism(x + 2.4, y + 2.1, 0.5, 0.7, 1.2, 8, '#9a8f6a');                                    // 変電設備
  };
  // 研究棟
  Sprites.types.researchLab = function (g, e, o) {
    slab(g, e); const x = e.x, y = e.y;
    g.prism(x + 0.3, y + 0.3, 2.4, 2.4, 1.2, 26, '#9fc2d4');
    g.prism(x + 0.3, y + 0.3, 2.4, 2.4, 26, 28, '#6f8da0');
    for (let r = 0; r < 4; r++) { g.decalL(x + 0.3, y + 0.3, 2.4, 2.4, 0.05, 0.95, 4 + r * 5.5, 7 + r * 5.5, '#d9eef7'); g.decalR(x + 0.3, y + 0.3, 2.4, 2.4, 0.05, 0.95, 4 + r * 5.5, 7 + r * 5.5, '#bcd9e6'); }
    g.cyl(x + 1.5, y + 1.5, 0.55, 28, 31, '#e8f1f5', { rim: '#ffffff' });                      // 屋上のドーム
    g.prism(x + 1.45, y + 1.45, 0.1, 0.1, 31, 40, '#6a6f74');
  };
  // 加工設備（汎用）
  Sprites.factory = function (g, e, o) {
    const sp = SPEC[e.type] || { color: '#b0b0b0', h: 14 }, x = e.x, y = e.y, w = e.fw, d = e.fd;
    const col = eraWall(o.era, sp.color, sp.clean || sp.glass ? 0.2 : 0.4), H = sp.h + 1.2;
    slab(g, e);
    if (sp.hangar) {   // 格納庫：低い両翼＋高い中央
      g.prism(x + 0.2, y + 0.2, w - 0.4, d - 0.4, 1.2, H - 6, col); g.prism(x + 0.8, y + 0.2, w - 1.6, d - 0.4, 1.2, H + 3, shade(col, 1.05));
      g.decalL(x + 0.8, y + 0.2, w - 1.6, d - 0.4, 0.1, 0.9, 1.2, H - 4, '#55697a');
    } else if (sp.bunker) {   // 軍需：低い掩体
      for (let i = 0; i < 3; i++) { g.prism(x + 0.2 + i * (w / 3), y + 0.3 + (i % 2) * 0.6, w / 3 - 0.3, d - 1.2, 1.2, H, shade(col, 0.9 + i * 0.05)); g.decalL(x + 0.2 + i * (w / 3), y + 0.3 + (i % 2) * 0.6, w / 3 - 0.3, d - 1.2, 0.2, 0.8, 1.2, 6, '#3f4638'); }
    } else {
      g.prism(x + 0.2, y + 0.3, w - 0.4, d - 0.6, 1.2, H, col);
      g.prism(x + 0.15, y + 0.25, w - 0.3, d - 0.5, H, H + 1.6, shade(col, 0.8));
      if (sp.glass) {
        for (let r = 0; r < 3; r++) { g.decalL(x + 0.2, y + 0.3, w - 0.4, d - 0.6, 0.04, 0.96, 3 + r * 4.4, 6.2 + r * 4.4, sp.green ? '#9fd0b0' : '#8fb7cf'); g.decalR(x + 0.2, y + 0.3, w - 0.4, d - 0.6, 0.04, 0.96, 3 + r * 4.4, 6.2 + r * 4.4, sp.green ? '#78b08c' : '#6f9bb5'); }
      } else windows(g, x + 0.2, y + 0.3, w - 0.4, d - 0.6, 1.2, H, 1);
      if (sp.saw) sawtooth(g, x + 0.2, y + 0.3, w - 0.4, d - 0.6, H + 1.6, Math.round(w * 1.3), col);
      if (sp.kiln) { g.prism(x + 0.3, y + d - 0.9, w - 0.6, 0.6, H + 1.6, H + 5, '#9c6a4a'); }
    }
    if (sp.tanks) { const n = sp.tanks; for (let i = 0; i < n; i++) g.cyl(x + 0.55 + i * 0.75, y + d - 0.45, 0.32, 1.2, 14 + (i % 2) * 5, '#d0d4d6', { rim: '#f3f5f6' }); }
    if (sp.pipes) { g.prism(x + 0.25, y + d - 0.15, w - 0.5, 0.1, 9, 10.5, '#8e5a3c'); }
    if (sp.logs) { for (let i = 0; i < 4; i++) g.cyl(x + 0.5 + i * 0.35, y + d - 0.4, 0.17, 1.2, 4, '#8a6a46', {}); }
    if (sp.furnace) { g.cyl(x + w - 0.8, y + 0.9, 0.55, H, H + 14, '#7e7468', { rim: '#a09484' }); if (o.running) g.glow(x + w - 0.8, y + 0.9, H + 14, 1); }
    if (sp.crane) { g.crane(x + w * 0.5, y + d * 0.5, 46, 1.2); g.prism(x + w - 1.2, y + d - 0.3, 1.1, 0.3, 1.2, 4, '#3c4a58'); }   // 造船台のクレーンと船体
    if (sp.hull) { g.prism(x + 0.3, y + d - 0.1, w - 0.6, 0.9, 1.2, 6, '#41505e'); g.prism(x + 0.5, y + d + 0.05, w - 1.0, 0.6, 6, 8, '#a14a3c'); }
    if (sp.rocket) { const rx = x + w - 0.8, ry = y + 0.8; g.prism(rx - 0.55, ry - 0.55, 0.15, 0.15, 1.2, 66, '#a79d86'); g.prism(rx + 0.4, ry - 0.55, 0.15, 0.15, 1.2, 66, '#a79d86'); g.cyl(rx, ry, 0.22, 1.2, 60, '#f3f3f1', { rim: '#ffffff' }); g.cyl(rx, ry, 0.22, 46, 60, '#d9d9d6', {}); g.cyl(rx, ry, 0.09, 60, 68, '#c24a3a', {}); }
    const sx = sp.stacks || 0;
    for (let i = 0; i < sx; i++) stack(g, x + w - 0.45 - i * 0.65, y + 0.5, (sp.bigstack ? 54 : 38) + i * 6, !!sp.bigstack, o.running, o);
  };

  // 増設モジュール：本体と同じ外観の小さな棟（本体の種類 e.parentType の仕様で描く）
  // 増設モジュールの絵は sprites2.js（読み込まれなければ汎用の絵）
  Sprites.types.module = function (g, e, o) { Sprites.factory(g, Object.assign({}, e, { type: e.parentType || 'chemPlant' }), o); };

  Sprites.util = { mix, shade, eraWall, slab, sawtooth, windows, stack, tank };
  Sprites.H = {};   // 種類ごとの当たり判定の高さ（sprites2.js が設定）
  window.Sprites = Sprites;
})();
