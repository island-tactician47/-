// 加工設備ごとの専用の絵（js/sprites.js の汎用の絵を種類ごとに置き換える）。時代で屋根・外装・装飾が変わる。
// 足あと（e.fw × e.fd）の外に描かない。1棟あたりの描画は約100パス・円柱6本以内を目安にする（絵はキャッシュされるので毎フレームではないが、拡大の段階ごとに1回描く）。
(function () {
  const S = window.Sprites, U = S.util, T = S.types;
  const { mix, shade, eraWall, slab, sawtooth, windows, stack } = U;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // 時代ごとの屋根：1-2 ノコギリ屋根、3-4 換気塔、5 金属の波板、6 ソーラーパネル
  function roof(g, x, y, w, d, z, o, col) {
    if (o.era <= 2) return sawtooth(g, x, y, w, d, z, Math.max(2, Math.round(w * 1.3)), col);
    if (o.era <= 4) { const n = Math.max(2, Math.round(w)); for (let i = 0; i < n; i++) g.prism(x + (i + 0.3) * w / n, y + d * 0.35, 0.3, d * 0.3, z, z + 2.2, shade(col, 0.9)); return; }
    const n = Math.max(3, Math.round(d * 2.2));
    for (let i = 0; i < n; i++) g.prism(x + 0.15, y + 0.12 + i * (d - 0.3) / n, w - 0.3, (d - 0.3) / n * 0.7, z, z + 0.8, o.era >= 6 ? '#2c4668' : '#8a949c');
  }
  function fence(g, e, o) { if (o.era >= 3) g.line([[e.x, e.y, 3], [e.x + e.fw, e.y, 3], [e.x + e.fw, e.y + e.fd, 3], [e.x, e.y + e.fd, 3], [e.x, e.y, 3]], '#6f706a', 1); }
  function hall(g, x, y, w, d, h, col, o, rf) {
    g.prism(x, y, w, d, 1.2, 1.2 + h, col); g.prism(x - 0.05, y - 0.05, w + 0.1, d + 0.1, 1.2 + h, 2.6 + h, shade(col, 0.8));
    if (rf !== false) roof(g, x, y, w, d, 2.6 + h, o, col);
  }
  const car = (g, x, y, col) => { g.prism(x, y, 0.42, 0.2, 1.2, 2.6, col); g.prism(x + 0.1, y + 0.03, 0.2, 0.14, 2.6, 3.6, '#2f3a44'); };
  const grid = (g, x, y, nx, ny, step, fn) => { for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) fn(x + i * step, y + j * step, i, j); };
  const rust = o => o.era <= 2 ? '#a0705a' : '#b9bfc3';   // 塔・配管の色（古いほど錆びた煉瓦色、新しいほど銀色）

  // ---- 化学プラント ----
  T.chemPlant = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b9c4bd', 0.3);
    hall(g, x + 0.2, y + 2.0, 1.2, 0.8, 7, col, o, false);                                              // 制御棟
    g.prism(x + 0.25, y + 0.35, 2.5, 0.12, 6, 7.4, '#8e5a3c'); g.prism(x + 0.25, y + 0.35, 0.12, 1.6, 6, 7.4, '#8e5a3c');   // 配管ラック
    for (const [cx, cy, r, h] of [[x + 0.7, y + 0.8, 0.28, 32], [x + 1.4, y + 0.8, 0.22, 24], [x + 2.2, y + 0.9, 0.3, 36]]) { g.cyl(cx, cy, r, 1.2, h, rust(o), { rim: '#e6eaec' }); for (let z = 10; z < h; z += 11) g.cyl(cx, cy, r + 0.05, z, z + 1.6, '#5f666b', {}); }
    g.cyl(x + 2.2, y + 2.0, 0.45, 1.2, 12, '#e8ebec', { rim: '#ffffff' }); g.cyl(x + 1.5, y + 2.15, 0.3, 1.2, 9, '#d4d8da', {});   // 球形タンク・貯槽
    if (o.era >= 3) { g.prism(x + 2.7, y + 2.6, 0.1, 0.1, 1.2, 30, '#5d5a54'); if (o.running) { g.flame(x + 2.75, y + 2.65, 33, o.t); g.smoke(x + 2.75, y + 2.65, 36, 1); } }
    if (o.era <= 4) stack(g, x + 1.1, y + 0.45, 40, false, o.running, o);
  };
  // ---- 製鋼所（4×3） ----
  T.steelMill = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#a89a90', 0.35);
    hall(g, x + 0.2, y + 1.9, 3.6, 0.9, 10, col, o);                                                   // 圧延の長屋
    g.cyl(x + 1.0, y + 0.9, 0.55, 1.2, 46, '#85786d', { rim: '#a89c90' });                             // 高炉
    for (let i = 0; i < 6; i++) g.prism(x + 1.5 + i * 0.1, y + 0.8 + i * 0.0 - 0.0, 0.1, 0.1, 6 + i * 7, 8 + i * 7, '#6a6a68');   // 斜路（スキップ）の段
    g.prism(x + 1.55, y + 0.7, 0.8, 0.12, 6, 7.4, '#6a6a68');
    for (const sy of [0.5, 1.4]) g.cyl(x + 2.2, y + sy, 0.3, 1.2, 30, '#9a8e82', { rim: '#b8ada0' });     // 熱風炉
    g.prism(x + 3.0, y + 0.3, 0.8, 1.2, 1.2, 5, '#4a4540'); g.prism(x + 3.1, y + 0.4, 0.5, 0.7, 5, 6.4, '#6a625a');   // スラグ山
    if (o.running) { g.glow(x + 1.0, y + 0.9, 46, 1); g.smoke(x + 1.0, y + 0.9, 48, 1.5); }
    stack(g, x + 3.5, y + 1.6, 40, true, o.running, o);
  };
  // ---- アルミ製錬所 ----
  T.aluminumSmelter = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b7bec4', 0.3);
    hall(g, x + 0.2, y + 0.2, 2.6, 0.85, 11, col, o); hall(g, x + 0.2, y + 1.25, 2.6, 0.85, 11, col, o);   // 並行する電解槽の長屋
    for (let i = 0; i < 4; i++) { g.prism(x + 0.3 + i * 0.45, y + 2.35, 0.32, 0.4, 1.2, 5, '#7e8c80'); g.cyl(x + 0.46 + i * 0.45, y + 2.55, 0.1, 5, 6.4, '#3d6a4a', {}); }   // 整流器の庭
    stack(g, x + 2.7, y + 2.6, 36, false, o.running, o);
  };
  // ---- 非鉄製錬所 ----
  T.copperSmelter = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b79b86', 0.35);
    hall(g, x + 0.9, y + 0.3, 1.9, 1.3, 14, col, o);
    g.cyl(x + 0.45, y + 2.1, 0.45, 1.2, 7, '#7d5a3e', { rim: '#8d6a4a' });                             // 鉱石の山
    for (let i = 0; i < 5; i++) g.prism(x + 0.15 + i * 0.12, y + 1.6 - i * 0.12, 0.12, 0.12, 2 + i * 1.6, 3.4 + i * 1.6, '#5d5a54');   // コンベヤー
    g.cyl(x + 1.5, y + 2.2, 0.28, 1.2, 8, '#a8644a', {}); g.cyl(x + 2.2, y + 2.2, 0.28, 1.2, 8, '#a8644a', {});   // 転炉
    stack(g, x + 2.6, y + 0.5, 52, true, o.running, o);
  };
  // ---- 窯業工場 ----
  T.kiln = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#c1a07e', 0.25);
    g.prism(x + 0.2, y + 0.4, 2.6, 0.7, 1.2, 9, col); g.prism(x + 0.15, y + 0.35, 2.7, 0.8, 9, 10.4, shade(col, 0.8));   // トンネル窯
    for (let i = 0; i < 5; i++) g.decalL(x + 0.2, y + 0.4, 2.6, 0.7, (i + 0.2) / 5, (i + 0.7) / 5, 1.2, 6, '#3a2a22');   // 窯口のアーチ
    grid(g, x + 0.3, y + 1.6, 4, 2, 0.5, (px, py, i, j) => g.prism(px, py, 0.42, 0.34, 1.2, 4 + ((i + j) % 2), (i + j) % 2 ? '#c8693f' : '#b85a36'));   // 煉瓦の山
    stack(g, x + 0.5, y + 0.45, 44, false, o.running, o); stack(g, x + 2.4, y + 0.45, 40, false, o.running, o);
  };
  // ---- 製材所 ----
  T.sawmill = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b8a07a', 0.3);
    hall(g, x + 1.4, y + 0.3, 1.4, 1.2, 9, col, o);
    grid(g, x + 0.3, y + 1.7, 5, 2, 0.5, (px, py, i, j) => g.cyl(px + 0.2, py + 0.2, 0.2, 1.2, 4 + j * 3.2, '#8a6a46', { rim: '#c9a572' }));   // 原木ヤード
    g.cyl(x + 0.5, y + 0.6, 0.32, 1.2, 14, '#b8a890', { rim: '#d8c8b0' }); g.cyl(x + 0.5, y + 0.6, 0.12, 14, 20, '#9a8a72', {});   // おがくずサイロ
    grid(g, x + 1.6, y + 1.7, 3, 1, 0.45, (px, py) => g.prism(px, py, 0.4, 0.36, 1.2, 5, '#d4b887'));   // 製品の木材
    if (o.running) g.smoke(x + 0.5, y + 0.6, 21, 0.7);
  };
  // ---- 製紙工場 ----
  T.paperMill = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#c8c5b8', 0.3);
    hall(g, x + 0.2, y + 0.3, 2.6, 1.5, 15, col, o);
    g.cyl(x + 0.6, y + 2.3, 0.38, 1.2, 18, '#bfc4c2', { rim: '#e0e4e2' }); g.cyl(x + 1.4, y + 2.3, 0.38, 1.2, 18, '#bfc4c2', { rim: '#e0e4e2' });   // チップ・パルプ槽
    grid(g, x + 2.0, y + 2.1, 3, 2, 0.32, (px, py) => g.cyl(px + 0.15, py + 0.15, 0.14, 1.2, 4, '#efece4', { rim: '#ffffff' }));   // 巻取り紙
    stack(g, x + 2.6, y + 0.5, 54, true, o.running, o);
  };
  // ---- 洗剤・化粧品工場 ----
  T.detergentFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#c6b9d0', 0.2);
    hall(g, x + 0.2, y + 0.3, 2.0, 1.7, 12, col, o);
    for (const [i, c] of [['#cfe3f2'], ['#f2d0e0'], ['#d6efd6']].entries()) g.cyl(x + 0.5 + i * 0.65, y + 2.45, 0.26, 1.2, 14, c[0], { rim: '#ffffff' });
    g.prism(x + 2.35, y + 0.5, 0.55, 1.2, 1.2, 6, '#8a8f93'); g.decalL(x + 2.35, y + 0.5, 0.55, 1.2, 0.1, 0.9, 1.2, 4, '#5d6a74');   // 荷さばき場
    stack(g, x + 1.8, y + 0.5, 34, false, o.running, o);
  };
  // ---- 縫製工場 ----
  T.garmentFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#c9b79e', 0.25);
    hall(g, x + 0.2, y + 0.3, 2.6, 1.5, 8, col, o);
    grid(g, x + 0.3, y + 2.1, 4, 1, 0.5, (px, py, i) => g.prism(px, py, 0.4, 0.4, 1.2, 4, ['#c0504d', '#4f81bd', '#9bbb59', '#f2c34c'][i % 4]));   // 布のロール
    g.prism(x + 2.3, y + 2.1, 0.55, 0.7, 1.2, 5, '#e8e6df'); g.prism(x + 2.3, y + 2.1, 0.55, 0.1, 5, 7, '#6a7a8a');   // トラック
  };
  // ---- 建材工場 ----
  T.buildmatFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b4ada3', 0.3);
    hall(g, x + 0.2, y + 0.3, 1.8, 1.4, 12, col, o);
    g.cyl(x + 2.45, y + 0.7, 0.32, 1.2, 22, '#c6c6c2', { rim: '#e4e4e0' });                           // セメントサイロ
    grid(g, x + 0.3, y + 2.0, 3, 1, 0.55, (px, py, i) => g.cyl(px + 0.25, py + 0.3, 0.22, 1.2, 3.4, '#9a9a96', { rim: '#bdbdb8' }));   // コンクリート管
    grid(g, x + 2.0, y + 1.7, 2, 2, 0.42, (px, py) => g.prism(px, py, 0.36, 0.36, 1.2, 4.4, '#a9a69f'));   // ブロックの山
    if (o.running) g.smoke(x + 2.45, y + 0.7, 23, 0.6);
  };
  // ---- 自動車工場（4×3） ----
  T.carFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#a9b7c4', 0.3);
    hall(g, x + 0.2, y + 0.2, 3.6, 1.6, 13, col, o);
    g.prism(x + 0.2, y + 2.0, 1.2, 0.85, 1.2, 14, o.era >= 5 ? '#8fb7cf' : col); if (o.era >= 5) g.decalL(x + 0.2, y + 2.0, 1.2, 0.85, 0.05, 0.95, 3, 12, '#bcdcec');   // 事務棟
    const cols = ['#c0504d', '#4f81bd', '#e8e6df', '#3b3b3b', '#f2c34c', '#7fb05f'];
    grid(g, x + 1.7, y + 2.1, 5, 2, 0.46, (px, py, i, j) => car(g, px, py, cols[(i * 2 + j) % cols.length]));   // 出荷待ちの車
    stack(g, x + 3.6, y + 0.4, 32, false, o.running, o);
  };
  // ---- 造船所（4×3） ----
  T.shipyard = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y;
    g.prism(x + 0.3, y + 0.3, 3.4, 1.3, 1.2, 2, '#5b7283');                                            // ドック
    g.prism(x + 0.5, y + 0.45, 3.0, 1.0, 2, 8, '#3f4e5c'); g.prism(x + 0.5, y + 0.45, 3.0, 1.0, 8, 9, '#a14a3c');   // 船体と赤い喫水線
    g.prism(x + 2.4, y + 0.6, 0.9, 0.7, 9, 14, '#d8d3c4'); g.prism(x + 2.7, y + 0.8, 0.14, 0.14, 14, 20, '#7a7a76');   // 船橋と煙突
    for (const px of [0.25, 3.5]) { g.prism(x + px, y + 0.2, 0.14, 0.14, 1.2, 36, '#d9a441'); g.prism(x + px, y + 1.55, 0.14, 0.14, 1.2, 36, '#d9a441'); g.prism(x + px, y + 0.2, 0.14, 1.5, 36, 37.6, '#b88a2c'); }   // 門型クレーン
    hall(g, x + 0.2, y + 2.0, 2.2, 0.8, 10, eraWall(o.era, '#9fb0bd', 0.3), o);
    grid(g, x + 2.7, y + 2.1, 3, 1, 0.38, (px, py) => g.prism(px, py, 0.34, 0.6, 1.2, 4, '#8a8a88'));   // 鋼板置き場
  };
  // ---- 航空機工場（4×3） ----
  T.aircraftFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#b9c6d2', 0.3);
    g.prism(x + 0.2, y + 0.2, 2.4, 2.2, 1.2, 12, col); g.prism(x + 0.3, y + 0.3, 2.2, 2.0, 12, 16, shade(col, 1.04)); g.prism(x + 0.5, y + 0.5, 1.8, 1.6, 16, 18.4, shade(col, 0.95));   // 段の付いたアーチ屋根
    g.decalL(x + 0.2, y + 0.2, 2.4, 2.2, 0.1, 0.9, 1.2, 9, '#4f6272');
    g.prism(x + 2.75, y + 1.45, 1.1, 0.16, 2, 3.6, '#f1f1ee'); g.prism(x + 3.1, y + 1.0, 0.22, 1.1, 2.2, 2.8, '#f1f1ee'); g.prism(x + 3.7, y + 1.35, 0.14, 0.36, 2, 5, '#c24a3a');   // 駐機の機体
    g.line([[x + 2.7, y + 0.4, 1.4], [x + 3.9, y + 0.4, 1.4]], '#e6e0c8', 1);
  };
  // ---- 半導体工場 ----
  T.semiconductorFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#c7d3dd', 0.1);
    g.prism(x + 0.2, y + 0.3, 2.6, 2.0, 1.2, 13, col); g.prism(x + 0.15, y + 0.25, 2.7, 2.1, 13, 14.4, shade(col, 0.8));
    for (let r = 0; r < 3; r++) { g.decalL(x + 0.2, y + 0.3, 2.6, 2.0, 0.04, 0.96, 3 + r * 3.4, 5.4 + r * 3.4, '#8fb7cf'); g.decalR(x + 0.2, y + 0.3, 2.6, 2.0, 0.04, 0.96, 3 + r * 3.4, 5.4 + r * 3.4, '#6f9bb5'); }
    grid(g, x + 0.5, y + 0.6, 3, 2, 0.7, (px, py) => g.prism(px, py, 0.5, 0.45, 14.4, 17.4, '#a9b3ba'));   // 屋上の空調機
    g.cyl(x + 2.45, y + 2.5, 0.2, 1.2, 12, '#e4e8ea', { rim: '#ffffff' }); g.cyl(x + 1.95, y + 2.55, 0.2, 1.2, 9, '#e4e8ea', { rim: '#ffffff' });   // 純水・ガスのタンク
    if (o.running) g.smoke(x + 1.2, y + 1.1, 18, 0.5);
  };
  // ---- PC工場 ----
  T.pcFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#bcc9d6', 0.15);
    g.prism(x + 0.2, y + 0.3, 1.6, 1.6, 1.2, 20, col);
    for (let r = 0; r < 4; r++) { g.decalL(x + 0.2, y + 0.3, 1.6, 1.6, 0.05, 0.95, 3 + r * 4.2, 5.8 + r * 4.2, '#8fb7cf'); g.decalR(x + 0.2, y + 0.3, 1.6, 1.6, 0.05, 0.95, 3 + r * 4.2, 5.8 + r * 4.2, '#6f9bb5'); }
    g.prism(x + 0.2, y + 0.3, 1.6, 1.6, 20, 21.4, shade(col, 0.8));
    hall(g, x + 1.9, y + 0.5, 1.0, 1.9, 9, eraWall(o.era, '#a9b4be', 0.3), o);                         // 組立の倉庫棟
    grid(g, x + 0.4, y + 2.3, 3, 1, 0.8, (px, py) => g.prism(px, py, 0.6, 0.4, 1.2, 3.6, '#c9a46a'));   // 出荷待ちの箱
  };
  // ---- 電池・EV工場 ----
  T.evFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#bfd1c4', 0.15);
    g.prism(x + 0.2, y + 0.3, 2.6, 1.6, 1.2, 12, col); g.prism(x + 0.15, y + 0.25, 2.7, 1.7, 12, 13.4, shade(col, 0.8));
    for (let i = 0; i < 6; i++) g.prism(x + 0.3, y + 0.35 + i * 0.25, 2.4, 0.18, 13.4, 14.4, '#2c4668');   // 屋根のソーラーパネル
    g.decalL(x + 0.2, y + 0.3, 2.6, 1.6, 0.05, 0.95, 3, 9, '#9fd0b0');
    grid(g, x + 0.3, y + 2.2, 4, 1, 0.55, (px, py, i) => g.prism(px, py, 0.46, 0.5, 1.2, 5.2, i % 2 ? '#e8ece8' : '#7fb08c'));   // 蓄電池のコンテナ
    g.prism(x + 2.75, y + 1.6, 0.1, 0.1, 1.2, 40, '#e8e8e4');                                           // 風力発電の柱と羽根
    const t = o.t || 0; g.line([[x + 2.8, y + 1.65, 40], [x + 2.8, y + 1.65, 50]], '#f4f4f0', 1.4); g.line([[x + 2.8, y + 1.65, 40], [x + 2.2, y + 1.3, 36]], '#f4f4f0', 1.4); g.line([[x + 2.8, y + 1.65, 40], [x + 3.2, y + 2.2, 36]], '#f4f4f0', 1.4);
  };
  // ---- 製薬工場 ----
  T.pharmaFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#e6dfe4', 0.1);
    g.prism(x + 0.2, y + 0.3, 1.8, 2.2, 1.2, 14, col); g.prism(x + 0.15, y + 0.25, 1.9, 2.3, 14, 15.4, '#7fb08c');   // 緑の屋根
    for (let r = 0; r < 3; r++) g.decalL(x + 0.2, y + 0.3, 1.8, 2.2, 0.06, 0.94, 3 + r * 3.6, 5.4 + r * 3.6, '#a9cfe0');
    g.cyl(x + 2.4, y + 0.7, 0.28, 1.2, 26, '#dfe3e4', { rim: '#ffffff' }); g.cyl(x + 2.4, y + 1.5, 0.28, 1.2, 20, '#dfe3e4', { rim: '#ffffff' });   // 発酵・貯蔵のタンク塔
    g.prism(x + 2.15, y + 2.1, 0.7, 0.7, 1.2, 6, '#c9cdd0'); g.prism(x + 2.45, y + 0.6, 0.1, 1.0, 12, 13, '#8e5a3c');
  };
  // ---- ロケット工場（3×4） ----
  T.rocketFactory = function (g, e, o) {
    slab(g, e); fence(g, e, o); const x = e.x, y = e.y, col = eraWall(o.era, '#cfd5da', 0.1);
    g.prism(x + 0.2, y + 0.3, 1.4, 1.7, 1.2, 46, col); g.prism(x + 0.15, y + 0.25, 1.5, 1.8, 46, 48, shade(col, 0.8));   // 組立棟（高い）
    g.decalL(x + 0.2, y + 0.3, 1.4, 1.7, 0.2, 0.8, 1.2, 36, '#4a5a68');
    g.prism(x + 0.2, y + 2.3, 1.2, 1.3, 1.2, 7, '#b9bec2');                                           // 付属棟
    const px = x + 2.3, py = y + 2.9;                                                                   // 発射台
    g.prism(px - 0.5, py - 0.5, 1.2, 1.2, 1.2, 2.4, '#7a7a76');
    g.prism(px + 0.35, py - 0.5, 0.14, 0.14, 2.4, 62, '#a79d86'); g.prism(px + 0.35, py + 0.55, 0.14, 0.14, 2.4, 62, '#a79d86'); g.prism(px + 0.35, py - 0.5, 0.14, 1.2, 62, 63.4, '#a79d86');
    g.cyl(px, py, 0.2, 2.4, 54, '#f3f3f1', { rim: '#ffffff' }); g.cyl(px, py, 0.2, 38, 54, '#d9d9d6', {}); g.cyl(px, py, 0.08, 54, 62, '#c24a3a', {});
    for (let z = 10; z <= 50; z += 10) g.line([[px + 0.2, py, z], [px + 0.4, py, z]], '#d9a441', 1);
  };
  // ---- 軍需工場 ----
  T.munitionsFactory = function (g, e, o) {
    slab(g, e, '#9a9a8a'); const x = e.x, y = e.y, earth = '#7f8a5f';
    if (o.era >= 2) g.line([[x, y, 4], [x + e.fw, y, 4], [x + e.fw, y + e.fd, 4], [x, y + e.fd, 4], [x, y, 4]], '#5a5a52', 1.4);   // 高いフェンス
    for (const [bx, by] of [[0.3, 0.3], [1.6, 0.3], [0.3, 1.5], [1.6, 1.5]]) {                      // 土を盛った掩体
      g.prism(bx + x, by + y, 1.1, 1.0, 1.2, 7, earth); g.prism(bx + x + 0.1, by + y + 0.1, 0.9, 0.8, 7, 9, shade(earth, 1.1));
      g.decalL(bx + x, by + y, 1.1, 1.0, 0.25, 0.75, 1.2, 5, '#3a4030');
    }
    g.prism(x + 2.7, y + 0.2, 0.14, 0.14, 1.2, 14, '#6a6a62'); g.prism(x + 2.7, y + 2.6, 0.14, 0.14, 1.2, 14, '#6a6a62'); g.prism(x + 2.6, y + 0.1, 0.34, 0.34, 14, 18, '#8a8a7a');   // 見張り台
    grid(g, x + 1.1, y + 2.7, 3, 1, 0.45, (px, py) => g.prism(px, py, 0.34, 0.3, 1.2, 3.4, '#6a4f2a'));   // 弾薬の木箱
    if (o.running) g.smoke(x + 2.0, y + 1.2, 10, 0.5);
  };

  // ---- 増設モジュール（2×2）：親の設備の仕様（S.SPEC）に合わせた小さな棟。足あと（2×2）の外に出ない ----
  T.module = function (g, e, o) {
    const x = e.x, y = e.y, sp = S.SPEC[e.parentType] || { color: '#b0b0b0', h: 14 }, col = eraWall(o.era, sp.color, sp.clean || sp.glass ? 0.15 : 0.35), h = clamp(sp.h, 8, 16);
    slab(g, e);
    if (sp.bunker) {
      g.prism(x + 0.2, y + 0.3, 1.5, 1.2, 1.2, 7, '#7f8a5f'); g.prism(x + 0.3, y + 0.4, 1.3, 1.0, 7, 9, '#8f9a6f'); g.decalL(x + 0.2, y + 0.3, 1.5, 1.2, 0.25, 0.75, 1.2, 5, '#3a4030');
    } else {
      hall(g, x + 0.15, y + 0.2, 1.7, 1.2, h, col, o);
      if (sp.glass) { g.decalL(x + 0.15, y + 0.2, 1.7, 1.2, 0.05, 0.95, 3, 3 + h * 0.5, sp.green ? '#9fd0b0' : '#8fb7cf'); g.decalR(x + 0.15, y + 0.2, 1.7, 1.2, 0.05, 0.95, 3, 3 + h * 0.5, '#6f9bb5'); }
      else windows(g, x + 0.15, y + 0.2, 1.7, 1.2, 1.2, 1.2 + h, 1);
    }
    if (sp.tanks) g.cyl(x + 0.55, y + 1.65, 0.28, 1.2, 12, '#d0d4d6', { rim: '#f3f5f6' });
    if (sp.logs) g.cyl(x + 0.55, y + 1.65, 0.24, 1.2, 8, '#8a6a46', { rim: '#c9a572' });
    if (sp.stacks) stack(g, x + 1.6, y + 0.45, 30, false, o.running, o);
    if (sp.furnace && o.running) g.glow(x + 1.4, y + 0.5, 12, 1);
    if (sp.crane) g.crane(x + 1.0, y + 1.0, 28, 1.2);
    if (sp.rocket) { g.prism(x + 1.3, y + 1.3, 0.12, 0.12, 1.2, 30, '#a79d86'); g.cyl(x + 1.0, y + 1.55, 0.18, 1.2, 26, '#f3f3f1', { rim: '#ffffff' }); }
    if (sp.hangar) g.prism(x + 0.3, y + 0.3, 1.5, 1.0, h + 1.2, h + 4, shade(col, 1.05));
  };

  // ---- 付属物（配管ラック・ドラム缶・変圧器・縞の杭）：すべての加工設備に重ねて、密度と重みを出す。足あとの内側の縁に収める ----
  const hash = (s, n) => { let h = 2166136261 ^ n; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; };
  function dress(g, e, o) {
    const x = e.x, y = e.y, w = e.fw, d = e.fd, r = k => hash(e.type, k);
    const pipe = o.era <= 2 ? '#7a4a34' : '#5f6469';
    // 奥の縁の配管ラック（支柱つき）
    g.prism(x + 0.1, y + 0.05, w - 0.2, 0.09, 6.5, 7.6, pipe); g.prism(x + 0.1, y + 0.05, w - 0.2, 0.09, 8.6, 9.4, shade(pipe, 1.2));
    for (let px = x + 0.3; px < x + w - 0.2; px += 0.9) g.prism(px, y + 0.05, 0.08, 0.09, 1.4, 6.5, '#4a4a46');
    // 手前の角：ドラム缶と変圧器
    const bx = x + 0.12 + r(1) * 0.2, by = y + d - 0.3;
    for (let i = 0; i < 3; i++) g.cyl(bx + i * 0.2, by + (i % 2) * 0.08, 0.075, 1.4, 5, ['#8a3a30', '#3a5a7a', '#6a6a30'][(i + Math.floor(r(2) * 3)) % 3], {});
    g.prism(x + w - 0.5, y + d - 0.34, 0.34, 0.26, 1.4, 6.6, '#6e747a'); g.prism(x + w - 0.46, y + d - 0.3, 0.26, 0.18, 6.6, 7.4, '#4a4f54');
    for (let i = 0; i < 3; i++) g.prism(x + 0.12 + i * 0.12, y + d - 0.08, 0.05, 0.05, 1.4, 4.4, i % 2 ? '#d9a441' : '#2b2b28');   // 縞の杭
  }
  for (const k of Object.keys(S.SPEC)) { const orig = T[k]; if (!orig) continue; T[k] = function (g, e, o) { orig(g, e, o); dress(g, e, o); }; }

  // 当たり判定用の高さ（全時代の最大。屋根のソーラー・煙突・塔を含む）
  S.H = { module: 38, chemPlant: 40, steelMill: 52, aluminumSmelter: 38, copperSmelter: 58, kiln: 46, sawmill: 24, paperMill: 62, detergentFactory: 38, garmentFactory: 18, buildmatFactory: 28, carFactory: 36, shipyard: 40, aircraftFactory: 22, semiconductorFactory: 20, pcFactory: 24, evFactory: 52, pharmaFactory: 28, rocketFactory: 66, munitionsFactory: 20 };
})();
