// 高密度の工場の絵（石油化学プラントの写真のような書き込み）：塔・足場・手すり・梯子・階段・配管の束・熱交換器・鉄骨ラック。
// 部品（プリミティブ）と、部品を分率座標 (u,v) で並べる「複合体」の組み立て。絵はキャッシュされるので1棟あたり数百パスまで使ってよい。
// 細部（手すりの支柱・梯子の段・帯）は拡大が小さいとき（g.zoom() < 0.7）は省く。
(function () {
  const S = window.Sprites, U = S.util, T = S.types;
  const { mix, shade, eraWall, slab, stack } = U;
  const YEL = '#d9a21e';
  const hash = (s, n) => { let h = 2166136261 ^ n; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; };
  const frameCol = o => o.era <= 2 ? '#7d4f33' : o.era <= 4 ? '#b9852a' : '#d9a21e';   // 足場・鉄骨の色
  const pipeCols = o => o.era <= 2 ? ['#7a4a34', '#5a4a40', '#8a6a4a', '#46403a'] : ['#c9cdcf', '#8f969a', '#a8553a', '#5f6469', '#d9d6cc'];
  const towerCol = o => o.era <= 2 ? ['#a8745a', '#8a5a44'] : o.era <= 4 ? ['#bfc4c6', '#a4aaad'] : ['#d3d8da', '#b6bcbf'];

  // 手すり（黄色）：(x0,y0)→(x1,y1) の縁、床の高さ z
  function railing(g, x0, y0, x1, y1, z) {
    g.line([[x0, y0, z + 3.4], [x1, y1, z + 3.4]], YEL, 1.2); g.line([[x0, y0, z + 1.7], [x1, y1, z + 1.7]], YEL, 0.9);
    if (g.zoom() >= 0.7) { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.45)); for (let i = 0; i <= n; i++) { const u = i / n, px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u; g.line([[px, py, z], [px, py, z + 3.4]], YEL, 0.8); } }
  }
  // 床（キャットウォーク）：矩形の板と、両縁の手すり
  function deck(g, x, y, w, d, z, rails) {
    g.prism(x, y, w, d, z - 0.7, z, '#6d6d68');
    if (rails !== false) { railing(g, x, y + d, x + w, y + d, z); railing(g, x + w, y + d, x + w, y, z); }
  }
  // 階段（ジグザグ）：axis 'x' なら x 方向に len 進みながら z0→z1 に上る。踊り場は赤
  function stairs(g, x, y, axis, len, z0, z1) {
    const n = Math.max(2, Math.round((z1 - z0) / 5)), ax = axis === 'x';
    const pts = []; for (let i = 0; i <= n; i++) { const u = i / n, a = len * u, z = z0 + (z1 - z0) * u; pts.push(ax ? [x + a, y, z] : [x, y + a, z]); }
    g.tube(pts, 0.9, '#2f3033');
    if (g.zoom() >= 0.7) for (let i = 1; i < n; i += 2) { const p = pts[i]; g.prism(p[0] - (ax ? 0 : 0.15), p[1] - (ax ? 0.15 : 0), ax ? 0.3 : 0.3, 0.3, p[2] - 0.6, p[2], '#a8362c'); }   // 踊り場
  }
  // 塔（蒸留塔・反応塔）：帯状の胴・足場リング・手すり・梯子・頭部
  function tower(g, cx, cy, r, h, o, k) {
    const [c1, c2] = towerCol(o), n = Math.max(2, Math.round(h / 15)), sk = shade(c2, 0.7);
    g.cyl(cx, cy, r * 1.18, 0, 4, sk, {});                                                                // スカート（基礎）
    for (let i = 0; i < n; i++) { const z0 = 4 + (h - 4) * i / n, z1 = 4 + (h - 4) * (i + 1) / n; g.cyl(cx, cy, r * (1 - 0.06 * (i / n)), z0, z1, (i + (k | 0)) % 2 ? c1 : c2, { rim: shade(c1, 1.1) }); if (i) g.cyl(cx, cy, r * 1.05, z0 - 0.7, z0 + 0.7, '#4f555a', {}); }   // 胴と溶接帯
    const nf = Math.max(3, Math.round(h / 13)), pc = pipeCols(o);
    for (let i = 1; i <= nf; i++) { const z = 4 + (h - 4) * i / (nf + 0.4), rr = r + 0.08; g.cyl(cx, cy, rr, z - 0.4, z, '#68686a', { rim: '#7d7d7a' }); g.ring(cx, cy, rr, z + 3.2, YEL, 1); if (i % 2) g.ring(cx, cy, rr, z + 1.6, YEL, 0.8); }   // 足場リングと手すり
    g.tube([[cx + r + 0.04, cy - r * 0.35, 2], [cx + r + 0.04, cy - r * 0.35, h - 2]], 0.9, pc[1 % pc.length]); g.tube([[cx - r * 0.3, cy + r + 0.04, 2], [cx - r * 0.3, cy + r + 0.04, h * 0.8]], 1.1, pc[2 % pc.length]);   // 縦の配管（添わせる）
    g.cyl(cx, cy, r * 0.62, h, h + 5, c1, { rim: shade(c1, 1.2) }); g.tube([[cx, cy, h + 5], [cx, cy, h + 12]], 1.1, '#6f757a');   // 頭部と放散管
    const lx = cx + r * 0.72, ly = cy + r * 0.72; g.line([[lx, ly, 3], [lx, ly, h]], YEL, 1.1);           // 梯子
    if (g.zoom() >= 0.7) for (let z = 6; z < h; z += 3.2) g.line([[lx - 0.07, ly + 0.05, z], [lx + 0.07, ly - 0.05, z]], YEL, 0.7);
  }
  // 鉄骨ラック：柱・梁・床。上に配管の束を通す
  function rack(g, x, y, w, d, h, lv, o, pipes) {
    const fc = frameCol(o), cols = [], nx = Math.max(2, Math.round(w / 0.9)), ny = Math.max(2, Math.round(d / 0.9));
    for (let i = 0; i <= nx; i++) for (const j of [0, ny]) cols.push([x + w * i / nx, y + d * j / ny]);
    for (let j = 1; j < ny; j++) for (const i of [0, nx]) cols.push([x + w * i / nx, y + d * j / ny]);
    for (const [px, py] of cols) g.prism(px - 0.045, py - 0.045, 0.09, 0.09, 1.2, h, fc);
    for (let l = 1; l <= lv; l++) {
      const z = 1.2 + (h - 1.2) * l / lv;
      g.prism(x - 0.04, y - 0.04, w + 0.08, 0.08, z - 0.5, z, fc); g.prism(x - 0.04, y + d - 0.04, w + 0.08, 0.08, z - 0.5, z, fc);
      g.prism(x - 0.04, y, 0.08, d, z - 0.5, z, fc); g.prism(x + w - 0.04, y, 0.08, d, z - 0.5, z, fc);
      if (g.zoom() >= 0.7) for (let i = 1; i < nx; i++) g.prism(x + w * i / nx - 0.03, y, 0.06, d, z - 0.5, z, shade(fc, 0.9));
      if (l === lv || l === 1) railing(g, x, y + d, x + w, y + d, z);
    }
    if (g.zoom() >= 0.7) for (let i = 0; i < nx; i++) { g.line([[x + w * i / nx, y + d, 1.2], [x + w * (i + 1) / nx, y + d, 1.2 + (h - 1.2) / lv]], shade(fc, 0.85), 0.9); }   // ブレース（筋交い）
    const pc = pipeCols(o);
    (pipes || 3).constructor === Number && (() => { const np = pipes || 3; for (let p = 0; p < np; p++) { const z = 1.2 + (h - 1.2) * (0.35 + 0.55 * (p / np)) + 2, yy = y + d * (0.15 + 0.7 * (p + 0.5) / np); g.tube([[x - 0.1, yy, z], [x + w + 0.1, yy, z]], 1.5 + (p % 2) * 0.5, pc[p % pc.length]); } })();
  }
  // 横型の熱交換器・槽：中心 (cx,cy)、軸方向 axis、長さ len、半径 r（zoom=1 のpx）、高さ z
  function exchanger(g, cx, cy, axis, len, r, z, o, k) {
    const a = axis === 'x' ? [[cx - len / 2, cy, z], [cx + len / 2, cy, z]] : [[cx, cy - len / 2, z], [cx, cy + len / 2, z]], c = towerCol(o)[(k | 0) % 2];
    g.prism(cx - (axis === 'x' ? len / 2 : 0.2), cy - (axis === 'x' ? 0.2 : len / 2), axis === 'x' ? len : 0.4, axis === 'x' ? 0.4 : len, 1.2, z - r * 0.5 + 0.5, '#55565a');   // 架台
    g.tube(a, r, c); g.tube([a[0], [a[0][0] + (axis === 'x' ? 0.12 : 0), a[0][1] + (axis === 'y' ? 0.12 : 0), z]], r * 1.15, '#6f757a');
  }
  // 球形・円筒のタンク（足場リング・梯子つき）
  function vessel(g, cx, cy, r, h, col, o) {
    g.cyl(cx, cy, r, 1.2, h, col, { rim: shade(col, 1.15) });
    g.cyl(cx, cy, r + 0.04, h * 0.5 - 0.6, h * 0.5 + 0.6, '#55565a', {});
    g.ring(cx, cy, r + 0.05, h + 0.6, YEL, 1); g.ring(cx, cy, r + 0.05, h - 1, YEL, 0.8);
    g.line([[cx + r * 0.7, cy + r * 0.7, 1.2], [cx + r * 0.7, cy + r * 0.7, h]], YEL, 1);
  }
  // 部品を奥行き順（奥の角 x+y が小さい順）に並べて描く
  function compose(g, items) { items.sort((a, b) => a.k - b.k); for (const it of items) it.f(); }
  const rk = (x, y, d) => x + y + (d || 0);
  S.prim = { railing, deck, stairs, tower, rack, exchanger, vessel, compose, hash, frameCol, pipeCols, towerCol, rk };

  // ---- 製油所（今の足あと 4×4 を基準に分率で配置。足あとを広げるとそのまま広がる）----
  T.refinery = function (g, e, o) {
    slab(g, e, '#76736b'); const x = e.x, y = e.y, w = e.fw, d = e.fd, X = u => x + u * w, Y = v => y + v * d, sc = Math.min(w, d) / 4;
    const items = [], add = (k, f) => items.push({ k, f });
    // 奥の列：高さの違う蒸留塔4本
    [[0.18, 0.2, 0.3, 78], [0.4, 0.17, 0.26, 64], [0.62, 0.2, 0.2, 50], [0.82, 0.2, 0.17, 38]].forEach(([u, v, r, h], i) => add(rk(X(u), Y(v)), () => tower(g, X(u), Y(v), r * sc, h, o, i)));
    // 中央の鉄骨ラック（配管の束）と、その手前の熱交換器
    add(rk(X(0.1), Y(0.45)), () => rack(g, X(0.1), Y(0.42), w * 0.8, d * 0.14, 16, 2, o, 6));
    [[0.22, 0.62], [0.42, 0.62], [0.62, 0.62]].forEach(([u, v], i) => add(rk(X(u), Y(v)), () => exchanger(g, X(u), Y(v), i % 2 ? 'y' : 'x', 0.9 * sc, 4.2, 7, o, i)));
    // 加熱炉と煙突
    add(rk(X(0.78), Y(0.68)), () => { g.prism(X(0.7), Y(0.6), w * 0.22, d * 0.2, 1.2, 16, '#6d675f'); g.prism(X(0.7), Y(0.6), w * 0.22, d * 0.2, 16, 17.4, '#4f4a44'); stack(g, X(0.81), Y(0.7), 36, false, o.running, o); });
    // 貯槽と制御棟
    add(rk(X(0.2), Y(0.86)), () => { vessel(g, X(0.14), Y(0.86), 0.24 * sc, 12, '#b8bcbd', o); vessel(g, X(0.3), Y(0.88), 0.2 * sc, 9, '#9aa0a2', o); });
    add(rk(X(0.55), Y(0.88)), () => { g.prism(X(0.46), Y(0.8), w * 0.26, d * 0.14, 1.2, 9, eraWall(o.era, '#9a9690', 0.3)); g.prism(X(0.46), Y(0.8), w * 0.26, d * 0.14, 9, 10.2, '#4a4742'); });
    // 階段・キャットウォーク・フレア
    add(rk(X(0.04), Y(0.4)), () => { stairs(g, X(0.04), Y(0.4), 'y', d * 0.2, 1.2, 14); deck(g, X(0.04), Y(0.36), w * 0.1, d * 0.08, 14.5); });
    add(rk(X(0.93), Y(0.1)), () => { g.prism(X(0.93), Y(0.08), 0.1, 0.1, 1.2, 74, '#4f4f4c'); g.tube([[X(0.93) + 0.05, Y(0.08) + 0.05, 74], [X(0.93) + 0.05, Y(0.08) + 0.05, 77]], 1.2, '#6a6a66'); if (o.running) { g.flame(X(0.93) + 0.05, Y(0.08) + 0.05, 80, o.t); g.smoke(X(0.93) + 0.05, Y(0.08) + 0.05, 84, 1.2); } });
    compose(g, items);
    // 塔頭から放散管・ラックへ落ちる配管（手前に描く）
    const pc = pipeCols(o);
    g.tube([[X(0.18), Y(0.2), 70], [X(0.4), Y(0.17), 70], [X(0.4), Y(0.17), 60]], 1.3, pc[0]); g.tube([[X(0.62), Y(0.2), 46], [X(0.62), Y(0.45), 20], [X(0.62), Y(0.45), 14]], 1.4, pc[2]); g.tube([[X(0.82), Y(0.2), 36], [X(0.82), Y(0.44), 18]], 1.2, pc[1]);
    if (o.running) g.glow(X(0.78), Y(0.66), 12, 1);
  };
  S.H.refinery = 100;

  // ---- 蒸留塔（製油所の増設）：塔が1本、足場つき（今の足あと 2×2）----
  T.distillation = function (g, e, o) {
    slab(g, e, '#76736b'); tower(g, e.x + e.fw * 0.5, e.y + e.fd * 0.5, 0.42 * Math.min(e.fw, e.fd) / 2, 58, o, 1);
    g.tube([[e.x + 0.2, e.y + e.fd - 0.25, 8], [e.x + e.fw - 0.2, e.y + e.fd - 0.25, 8]], 1.4, pipeCols(o)[0]);
  };
  S.H.distillation = 84;

  // ---- 化学プラント：塔3本・ラック・熱交換器・球形タンク ----
  T.chemPlant = function (g, e, o) {
    slab(g, e, '#76736b'); const x = e.x, y = e.y, w = e.fw, d = e.fd, X = u => x + u * w, Y = v => y + v * d, sc = Math.min(w, d) / 3;
    const items = [], add = (k, f) => items.push({ k, f });
    [[0.2, 0.22, 0.4, 54], [0.5, 0.2, 0.3, 42], [0.8, 0.24, 0.34, 48]].forEach(([u, v, r, h], i) => add(rk(X(u), Y(v)), () => tower(g, X(u), Y(v), r * sc * 0.5, h, o, i)));
    add(rk(X(0.12), Y(0.5)), () => rack(g, X(0.1), Y(0.46), w * 0.8, d * 0.16, 13, 2, o, 3));
    [[0.3, 0.68], [0.6, 0.68]].forEach(([u, v], i) => add(rk(X(u), Y(v)), () => exchanger(g, X(u), Y(v), 'x', 0.8 * sc, 4, 6, o, i)));
    add(rk(X(0.82), Y(0.78)), () => vessel(g, X(0.8), Y(0.78), 0.3 * sc, 13, '#e0e3e4', o));
    add(rk(X(0.2), Y(0.88)), () => { g.prism(X(0.08), Y(0.8), w * 0.3, d * 0.14, 1.2, 8, eraWall(o.era, '#9aa59e', 0.3)); g.prism(X(0.08), Y(0.8), w * 0.3, d * 0.14, 8, 9.2, '#4a4742'); });
    add(rk(X(0.95), Y(0.1)), () => { g.prism(X(0.94), Y(0.08), 0.1, 0.1, 1.2, 40, '#4f4f4c'); if (o.running) { g.flame(X(0.94) + 0.05, Y(0.08) + 0.05, 43, o.t); g.smoke(X(0.94) + 0.05, Y(0.08) + 0.05, 47, 1); } });
    compose(g, items);
    const pc = pipeCols(o); g.tube([[X(0.2), Y(0.22), 46], [X(0.5), Y(0.2), 46], [X(0.8), Y(0.24), 44]], 1.2, pc[1]); g.tube([[X(0.5), Y(0.2), 36], [X(0.5), Y(0.46), 14]], 1.3, pc[2]);
  };
  S.H.chemPlant = 66;
})();
