// 拠点マップのアイソメ描画と操作（パン・ピンチ・タップ）。建物の絵は js/sprites.js。
// 投影：タイル (tx,ty) → 画面 x=(tx-ty)*32*z+cam.x、y=(tx+ty)*16*z+cam.y−高さ*z。
// 視点の回転（I.view=0〜3、90°ずつ）：世界の座標をマップ中心まわりに −90°×view 回してから投影する（pt＝世界座標→画面、ptv＝回したあとの座標→画面）。
// 建物の絵は Blender の4方向（GAME_DATA.spritesBL。向き番号＝建物の向き e.rot ＋ 視点 view）。
(function () {
  const TW = 32, TH = 16;   // タイルの半幅・半高（zoom=1）
  const HS = 1.4;           // 建物の高さの倍率（重厚感：すべての高さをこの倍率で描く）
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function hex(c) { c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
  function rgb(a) { return '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
  const shade = (c, f) => rgb(hex(c).map(v => v * f));
  const mix = (a, b, t) => { const x = hex(a), y = hex(b); return rgb(x.map((v, i) => v * (1 - t) + y[i] * t)); };

  function create(canvas, opts) {
    const mainCtx = canvas.getContext('2d'); let ctx = mainCtx;
    const I = { cam: { x: 0, y: 0, z: 0.9 }, selected: null, cursor: null, ghost: null, parts: [], sources: [], t: 0, dpr: 1, w: 0, h: 0, ents: [], onTap: opts.onTap || (() => {}) };
    const E = window.Engine, S = () => opts.getState();
    let capture = null;   // 建物の絵をキャッシュに描くあいだ、煙・炎・赤熱をここへ記録する（毎フレーム別に描く）

    // ---- 投影 ----
    // 視点の回転：世界の点を中心まわりに 90° 回す（1回分 (x,y)→(cx−cy+y, cx+cy−x)）。マップが正方形でないときは回さない
    const MAPW = () => GAME_DATA.map;
    const rotC = () => { const M = MAPW(); return [M.w / 2, M.h / 2]; };
    function tv1(x, y) { const [cx, cy] = rotC(); return [cx - cy + y, cx + cy - x]; }
    function ti1(x, y) { const [cx, cy] = rotC(); return [cx + cy - y, x - cx + cy]; }
    function tvN(x, y, v) { for (let i = 0; i < v; i++) { const q = tv1(x, y); x = q[0]; y = q[1]; } return [x, y]; }
    function tiN(x, y, v) { for (let i = 0; i < v; i++) { const q = ti1(x, y); x = q[0]; y = q[1]; } return [x, y]; }
    // ベクトル（移動量）の逆回転：回したあとの向き → 世界の向き（煙の流れる向きを画面基準にそろえる）
    function viN(dx, dy, v) { for (let i = 0; i < v; i++) { const q = [-dy, dx]; dx = q[0]; dy = q[1]; } return [dx, dy]; }
    I.view = 0; I.rotOff = false;
    const ptv = (vx, vy, z) => [(vx - vy) * TW * I.cam.z + I.cam.x, (vx + vy) * TH * I.cam.z + I.cam.y - (z || 0) * HS * I.cam.z];
    const pt = (tx, ty, z) => { if (I.view && !I.rotOff) { const q = tvN(tx, ty, I.view); tx = q[0]; ty = q[1]; } return ptv(tx, ty, z); };
    I.pt = pt; I.ptv = ptv;
    const unprojectV = (px, py) => { const mx = (px - I.cam.x) / I.cam.z / TW, my = (py - I.cam.y) / I.cam.z / TH; return { x: (mx + my) / 2, y: (my - mx) / 2 }; };
    I.unproject = (px, py) => { const q = unprojectV(px, py); if (!I.view) return q; const w = tiN(q.x, q.y, I.view); return { x: w[0], y: w[1] }; };
    I.center = (tx, ty) => { const q = tvN(tx, ty, I.view); I.cam.x = I.w / 2 - (q[0] - q[1]) * TW * I.cam.z; I.cam.y = I.h / 2 - (q[0] + q[1]) * TH * I.cam.z; };
    // 視点を回す（画面の中心に見えている場所は動かさない）。d＝+1/−1
    I.setView = v => { const M = MAPW(); if (M.w !== M.h) return; const c = I.unproject(I.w / 2, I.h / 2); I.view = ((v % 4) + 4) % 4; I.parts = []; I.tkey = null; I.center(c.x, c.y); saveCam(); };
    I.rotate = d => I.setView(I.view + d);
    // 世界の矩形（x,y,w,d）→ 回したあとの矩形
    function rectToView(x, y, w, d) {
      if (!I.view || I.rotOff) return [x, y, w, d];
      const a = tvN(x, y, I.view), b = tvN(x + w, y + d, I.view);
      return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])];
    }
    // 建物（mapEntities の要素）を回したあとの座標・足あとにする。vrot＝絵の向き番号（建物の向き＋視点）
    function viewOf(e) {
      const r = I.view, q = rectToView(e.x, e.y, e.fw, e.fd);
      return Object.assign({}, e, { x: q[0], y: q[1], fw: q[2], fd: q[3], vrot: ((e.rot || 0) + r) & 3 });
    }

    // ---- 描画の道具（sprites.js が使う）----
    function poly(pts, fill, stroke) {
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.6; ctx.stroke(); }
    }
    const g = {
      prism(x, y, w, d, z0, z1, base) {
        [x, y, w, d] = rectToView(x, y, w, d);   // 視点を回したときは、回したあとの矩形で描く（見える面が変わる）
        const hgt = z1 - z0, cz = I.cam.z;
        if (hgt > 5 && w * d > 0.2) g.shadow(x, y, w, d, hgt, z0);
        const T = shade(base, 1.12), ink = shade(base, 0.32);
        const face = (p0, p1, top, bot, seamsN) => {   // p0,p1 = 底辺の2点（タイル座標）。上から下へ明るさを落とし、足元に暗がりを入れる
          const a = ptv(p0[0], p0[1], z0), b = ptv(p1[0], p1[1], z0), c = ptv(p1[0], p1[1], z1), d2 = ptv(p0[0], p0[1], z1);
          const gr = ctx.createLinearGradient(0, Math.min(c[1], d2[1]), 0, Math.max(a[1], b[1]));
          gr.addColorStop(0, top); gr.addColorStop(0.7, mix(top, bot, 0.7)); gr.addColorStop(1, bot);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d2[0], d2[1]); ctx.closePath();
          ctx.fillStyle = gr; ctx.fill();
          if (seamsN > 1 && hgt > 7) {   // 外壁のパネルの継ぎ目
            ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = Math.max(0.5, 0.7 * cz); ctx.beginPath();
            for (let i = 1; i < seamsN; i++) { const u = i / seamsN, ta = ptv(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z0), tb = ptv(p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, z1); ctx.moveTo(ta[0], ta[1]); ctx.lineTo(tb[0], tb[1]); }
            ctx.stroke();
          }
          ctx.strokeStyle = ink; ctx.globalAlpha *= 0.55; ctx.lineWidth = Math.max(0.6, 0.8 * cz); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d2[0], d2[1]); ctx.closePath(); ctx.stroke(); ctx.globalAlpha /= 0.55;
        };
        face([x, y + d], [x + w, y + d], shade(base, 0.9), shade(base, 0.56), Math.round(w / 0.45));
        face([x + w, y + d], [x + w, y], shade(base, 0.64), shade(base, 0.36), Math.round(d / 0.45));
        poly([ptv(x, y, z1), ptv(x + w, y, z1), ptv(x + w, y + d, z1), ptv(x, y + d, z1)], T, ink);
        if (hgt > 3) { ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = Math.max(0.6, 0.9 * cz); const a = ptv(x, y + d, z1), b = ptv(x + w, y + d, z1), c = ptv(x + w, y, z1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }   // 屋根の縁の照り
      },
      // 地面に落ちる影（光は左上から）：足あとと、高さに応じてずらした足あとの凸包
      shadow(x, y, w, d, h, z0) {
        const k = Math.min(h, 60) * 0.05, pts = [];
        for (const [px, py] of [[x, y], [x + w, y], [x + w, y + d], [x, y + d]]) { pts.push(ptv(px, py, z0 || 0.4)); pts.push(ptv(px + k, py + k * 0.35, z0 || 0.4)); }
        pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), hull = [];
        for (const p of pts) { while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) hull.pop(); hull.push(p); }
        const lo = hull.length + 1; for (let i = pts.length - 2; i >= 0; i--) { const p = pts[i]; while (hull.length >= lo && cross(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) hull.pop(); hull.push(p); }
        hull.pop(); ctx.globalAlpha *= 0.3; poly(hull, '#101408'); ctx.globalAlpha /= 0.3;
      },
      cyl(cx, cy, r, z0, z1, col, o) {
        const p0 = pt(cx, cy, z0), p1 = pt(cx, cy, z1), rx = r * 45 * I.cam.z, ry = r * 22.6 * I.cam.z;
        const gr = ctx.createLinearGradient(p0[0] - rx, 0, p0[0] + rx, 0);
        gr.addColorStop(0, shade(col, 0.8)); gr.addColorStop(0.3, shade(col, 1.08)); gr.addColorStop(0.62, shade(col, 0.74)); gr.addColorStop(1, shade(col, 0.4));
        if (z1 - z0 > 5) { const k = Math.min(z1 - z0, 60) * 0.05, sx = p0[0] + k * 32 * I.cam.z, sy = p0[1] + k * 16 * I.cam.z * 1.35; ctx.globalAlpha *= 0.28; ctx.beginPath(); ctx.ellipse(sx, sy, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2); ctx.fillStyle = '#101408'; ctx.fill(); ctx.globalAlpha /= 0.28; }   // 足元の影
        ctx.beginPath(); ctx.moveTo(p1[0] - rx, p1[1]); ctx.lineTo(p0[0] - rx, p0[1]); ctx.ellipse(p0[0], p0[1], rx, ry, 0, Math.PI, 0, true);
        ctx.lineTo(p1[0] + rx, p1[1]); ctx.ellipse(p1[0], p1[1], rx, ry, 0, 0, Math.PI, true); ctx.closePath();
        ctx.fillStyle = gr; ctx.fill();
        ctx.beginPath(); ctx.ellipse(p1[0], p1[1], rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = (o && o.rim) ? shade(o.rim, 0.92) : shade(col, 1.1); ctx.fill(); ctx.strokeStyle = shade(col, 0.3); ctx.lineWidth = Math.max(0.6, 0.8 * I.cam.z); ctx.stroke();
      },
      decalL(x, y, w, d, u0, u1, za, zb, col) { poly([pt(x + u0 * w, y + d, za), pt(x + u1 * w, y + d, za), pt(x + u1 * w, y + d, zb), pt(x + u0 * w, y + d, zb)], col); },
      decalR(x, y, w, d, u0, u1, za, zb, col) { poly([pt(x + w, y + u0 * d, za), pt(x + w, y + u1 * d, za), pt(x + w, y + u1 * d, zb), pt(x + w, y + u0 * d, zb)], col); },
      line(pts, col, lw) { ctx.beginPath(); pts.forEach((p, i) => { const q = pt(p[0], p[1], p[2]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.strokeStyle = col; ctx.lineWidth = (lw || 1) * Math.max(0.7, I.cam.z); ctx.stroke(); },
      smoke(x, y, z, s) { if (capture) capture.push({ k: 'smoke', x, y, z, s }); else { const w = I.rotOff && I.view ? tiN(x, y, I.view) : [x, y]; I.sources.push({ x: w[0], y: w[1], z, s: s || 1 }); } },
      flame(x, y, z, t) { if (capture) { capture.push({ k: 'flame', x, y, z }); return; } const p = pt(x, y, z), f = 1 + 0.25 * Math.sin(t * 14 + x * 3); ctx.beginPath(); ctx.ellipse(p[0], p[1] - 4 * I.cam.z * f, 3 * I.cam.z, 6 * I.cam.z * f, 0, 0, Math.PI * 2); ctx.fillStyle = '#f2a33a'; ctx.fill(); ctx.beginPath(); ctx.ellipse(p[0], p[1] - 3 * I.cam.z * f, 1.6 * I.cam.z, 3.5 * I.cam.z * f, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff2a8'; ctx.fill(); },
      glow(x, y, z, k) { if (capture) { capture.push({ k: 'glow', x, y, z }); return; } const p = pt(x, y, z); const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 18 * I.cam.z); gr.addColorStop(0, 'rgba(255,140,40,0.6)'); gr.addColorStop(1, 'rgba(255,140,40,0)'); ctx.fillStyle = gr; ctx.fillRect(p[0] - 18 * I.cam.z, p[1] - 18 * I.cam.z, 36 * I.cam.z, 36 * I.cam.z); },
      // 配管・円筒：3次元の折れ線を、半径 r（zoom=1 のpx）の太さで描く（線幅は拡大に比例。ハイライトと輪郭つき）
      tube(pts, r, col) {
        const P = pts.map(p => pt(p[0], p[1], p[2])), cz = I.cam.z, w = Math.max(1, 2 * r * cz);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const path = () => { ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); };
        path(); ctx.strokeStyle = shade(col, 0.38); ctx.lineWidth = w + Math.max(0.8, 1.2 * cz); ctx.stroke();
        path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
        if (w >= 3) { ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1] - w * 0.2) : ctx.moveTo(p[0], p[1] - w * 0.2)); ctx.strokeStyle = shade(col, 1.45); ctx.lineWidth = Math.max(0.8, w * 0.28); ctx.stroke(); }
        ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
      },
      // 水平の輪（足場リング・手すり）：中心 (cx,cy)・半径 r（タイル）・高さ z
      ring(cx, cy, r, z, col, lw) { const p = pt(cx, cy, z); ctx.beginPath(); ctx.ellipse(p[0], p[1], r * 45 * I.cam.z, r * 22.6 * I.cam.z, 0, 0, Math.PI * 2); ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.7, (lw || 1.4) * I.cam.z); ctx.stroke(); },
      zoom() { return I.cam.z; },
      crane(x, y, h, z0) { const a = z0 || 0; g.line([[x - 0.35, y, a], [x, y, a + h], [x + 0.35, y, a]], '#d9a441', 1.4); g.line([[x, y, a + h], [x + 1.4, y + 0.5, a + h - 3], [x + 1.4, y + 0.5, a + h - 12]], '#8a6a2a', 1.2); }
    };

    // ---- 地形 ----
    // 飾り（木・岩・家・砂浜）：見た目だけ。タイル座標のハッシュで決まる（セーブには何も持たない）。建物の足あと（と隣）・道・港・海には置かない
    function deco(tx, ty, occ, era) {
      const h = (Math.imul(tx, 73856093) ^ Math.imul(ty, 19349663)) >>> 0, r = h % 1000;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (occ[(tx + dx) + ',' + (ty + dy)]) return;
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => E.terrainAt(S(), tx + dx, ty + dy));
      const nearRoad = nb.some(q => q === 'road'), nearSea = nb.some(q => q === 'sea');
      const forest = ((tx >> 2) * 31 + (ty >> 2) * 17) % 5 === 0;   // 森になる区画（4×4タイル単位）
      if (nearSea) { if (r < 80) g.prism(tx + 0.35, ty + 0.35, 0.3, 0.3, 0, 2.5, '#9a9a94'); return; }   // 海辺は岩
      if (nearRoad) {   // 道沿いに小さな家（時代が進むと屋根が灰色に）
        if (r < 70) {
          const wall = ['#d8cdb0', '#c9b79a', '#bfc7b8', '#d3b9a0'][h % 4], roof = era >= 4 ? '#8d8f93' : ['#a8573f', '#8a4a36', '#6d6a60'][(h >>> 3) % 3];
          g.prism(tx + 0.2, ty + 0.2, 0.6, 0.6, 0, 8, wall); g.prism(tx + 0.12, ty + 0.12, 0.76, 0.76, 8, 11.5, roof);
        }
        return;
      }
      const dens = forest ? 420 : 55;
      if (r < dens) {
        const hh = 9 + (h >>> 4) % 6, ox = ((h >>> 8) % 5) / 10, oy = ((h >>> 11) % 5) / 10, gr = ['#4f7a45', '#5a8650', '#456f3f', '#668f4f'][h % 4];
        g.prism(tx + 0.42 + ox / 4, ty + 0.42 + oy / 4, 0.12, 0.12, 0, 5, '#6b4f33');
        g.prism(tx + 0.14 + ox / 2, ty + 0.14 + oy / 2, 0.56, 0.56, 4, hh - 3, shade(gr, 0.9)); g.prism(tx + 0.24 + ox / 2, ty + 0.24 + oy / 2, 0.38, 0.38, hh - 3, hh + 1, gr); g.prism(tx + 0.33 + ox / 2, ty + 0.33 + oy / 2, 0.2, 0.2, hh + 1, hh + 4.5, shade(gr, 1.2));   // 3段（松のように先が細い）
      } else if (r > 985) g.prism(tx + 0.3, ty + 0.3, 0.35, 0.3, 0, 3.2, '#8c8c86');   // 岩
    }
    function drawTerrain(s, era) {
      const occ = E.mapOccupancy(s);
      const M = GAME_DATA.map, eraK = clamp((era - 1) * 0.07, 0, 0.35), landA = mix('#8d9a69', '#8f8d80', eraK + 0.1), landB = mix('#869363', '#8f8d80', eraK + 0.1);
      for (let sum = 0; sum <= M.w + M.h - 2; sum++) for (let vx = Math.max(0, sum - M.h + 1); vx <= Math.min(M.w - 1, sum); vx++) {
        const vy = sum - vx, a = ptv(vx, vy, 0);   // 回したあとの座標のタイルを奥から手前へ
        if (a[0] < -80 * I.cam.z || a[0] > I.w + 80 * I.cam.z || a[1] < -40 * I.cam.z || a[1] > I.h + 50 * I.cam.z) continue;
        const wq = tiN(vx + 0.5, vy + 0.5, I.view), tx = Math.floor(wq[0]), ty = Math.floor(wq[1]);
        const t = E.terrainAt(s, tx, ty), chk = (tx + ty) & 1;
        let col;
        if (t === 'sea') {
          const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const q = E.terrainAt(s, tx + dx, ty + dy); return q && q !== 'sea'; });
          col = near ? '#86b8cb' : (chk ? '#5f93b3' : '#5b8fb0');
        } else if (t === 'road') col = chk ? '#6f6d69' : '#6a6864';
        else if (t === 'port') col = chk ? '#a29b8c' : '#9b9486';
        else {
          col = chk ? landA : landB;
          if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => E.terrainAt(s, tx + dx, ty + dy) === 'sea')) col = chk ? '#cdc298' : '#c6bb90';   // 砂浜
        }
        poly([ptv(vx, vy, 0), ptv(vx + 1, vy, 0), ptv(vx + 1, vy + 1, 0), ptv(vx, vy + 1, 0)], col, col);
        if (t === 'road') {
          const alongX = ty % M.block === M.block - 1 && tx % M.block !== M.block - 1, alongY = tx % M.block === M.block - 1 && ty % M.block !== M.block - 1;
          if (alongX && (tx & 1)) g.line([[tx + 0.3, ty + 0.5, 0.2], [tx + 0.7, ty + 0.5, 0.2]], '#d6d3c8', 1);
          if (alongY && (ty & 1)) g.line([[tx + 0.5, ty + 0.3, 0.2], [tx + 0.5, ty + 0.7, 0.2]], '#d6d3c8', 1);
        }
        if (t === 'land' && ((tx * 7 + ty * 13) % 11 === 0)) g.prism(tx + 0.4, ty + 0.4, 0.2, 0.2, 0, 1, '#6f9a5a');   // 草むら
        if (t === 'land' && !I.noDeco) deco(tx, ty, occ, era);
      }
      // 陸の縁（海に面した側の崖）
      for (let tx = 0; tx < M.w; tx++) { const cy = E.coastY(tx); const t = E.terrainAt(s, tx, cy - 1); if (t && t !== 'sea') { const a = pt(tx, cy, 0); if (a[0] < -60 || a[0] > I.w + 60 || a[1] < -60 || a[1] > I.h + 60) continue; g.prism(tx, cy - 0.001, 1, 0.001, -4, 0, '#8d7e66'); } }
    }

    // 港（固定のランドマーク）：桟橋・上屋・クレーン・係留する船
    function portEntity(s) {
      const M = GAME_DATA.map, x0 = M.port.x0, x1 = M.port.x1, cy = Math.round((E.coastY(x0 + 3) + E.coastY(x0 + 4)) / 2);
      return { type: '_port', x: x0, y: E.portTop(), fw: x1 - x0 + 1, fd: M.port.depth + 4, key: '_port', cy, grade: s.portGrade };
    }
    function drawPort(e, s) {
      const M = GAME_DATA.map, x0 = e.x, cy = e.cy, grade = s.portGrade;
      // 桟橋と係留する船（海側。大きな足あとに合わせて拡大）
      g.prism(x0 + 4, cy - 1, 3, 9, 0, 3.4, '#8d7653');
      for (let i = 0; i < 5; i++) g.prism(x0 + 4 + (i % 2) * 2.8, cy + i * 1.9, 0.25, 0.25, -3, 3.4, '#5d4a30');
      g.prism(x0 + 8.4, cy + 0.2, 2.6, 7.4, 0, 8, '#4f6475'); g.prism(x0 + 8.8, cy + 1.0, 1.8, 2.0, 8, 17, '#d8d3c4'); g.prism(x0 + 9.4, cy + 1.4, 0.4, 0.4, 17, 25, '#7a7a76');
      // 陸側：コンテナヤード（最初から）、岸壁クレーン（改修1〜）、物流倉庫（改修2〜）、2基目のクレーン（改修3）。PNGの絵（NT の portcrane・container・logistics）
      const items = [];   // 視点を回しても前後が崩れないよう、視点変換後の x+y の小さい（奥の）順に描く
      const put = (type, ox) => { const x = x0 + ox, y = E.portTop(); items.push(viewOf({ type, x, y, fw: 4, fd: 4, building: false, parentType: null, rot: 0 })); };
      put('container', 0); if (grade >= 1) put('portcrane', 4); if (grade >= 2) put('warehouse_goods', 8); if (grade >= 3) put('portcrane', 12);
      items.sort((p, q) => (p.x + p.y) - (q.x + q.y));
      for (const v of items) drawEntity(v, { era: I.curEra || 3, t: I.t, running: false });
    }

    // ---- 建物の絵のキャッシュ ----
    // 静的な絵（建物の本体）は種類・時代・足あと・拡大の段階ごとにオフスクリーンへ1回だけ描く。煙・炎・赤熱は毎フレーム別に描く。
    const LEVELS = [0.35, 0.5, 0.7, 0.9, 1.2, 1.5, 1.8], cache = new Map(), CACHE_PX = 24e6; let cachePx = 0;   // 上限 約2400万ピクセル（約96MB）
    const pickLevel = z => LEVELS.find(l => l >= z - 1e-6) || LEVELS[LEVELS.length - 1];
    // 絵（PNG）。読み込みが終わるまでは手続き描画。終わったらその種類のキャッシュを捨てる
    //  ① Blender の4方向（assets/bl/、spritesBL）：向き番号 vrot＝建物の向き＋視点
    //  ② 旧 NT の1方向（assets/nt/、spritesNT）：視点が回っていない（vrot=0）ときだけ
    //  ③ どちらも無い・回っている：手続き描画（js/sprites*.js。回したあとの座標で描くので向きが合う）
    const NTM = (window.GAME_DATA && GAME_DATA.spritesNT) || {}, ntImg = {}, BLM = (window.GAME_DATA && GAME_DATA.spritesBL) || {}, blImg = {};
    function dropCache(prefix) { for (const [k, v] of cache) if (k.startsWith(prefix)) { cache.delete(k); cachePx -= v.px || 0; } I.dirty = true; }
    function ntImage(type) {
      const m = NTM[type]; if (!m) return null;
      let im = ntImg[type];
      if (!im) { im = new Image(); im.onload = () => { im._ok = true; dropCache('nt:' + type + '|'); }; im.onerror = () => { im._err = true; console.error('絵の読み込みに失敗', type, m.file); }; im.src = m.file; ntImg[type] = im; }
      return im._ok ? im : null;
    }
    function blImage(name, k) {
      const m = BLM[name] && BLM[name].r[k]; if (!m) return null;
      const key = name + '#' + k; let im = blImg[key];
      if (!im) { im = new Image(); im.onload = () => { im._ok = true; dropCache('bl:' + name + ':' + k + '|'); }; im.onerror = () => { im._err = true; console.error('絵の読み込みに失敗', name, k, m.file); }; im.src = m.file; blImg[key] = im; }
      return im._ok ? im : null;
    }
    // 建物 → Blender の絵の名前（増設モジュールは親ごと、研究棟は段階ごと）
    function blName(e) {
      if (e.type === 'module') return e.parentType ? 'module_' + e.parentType : null;
      if (e.type === 'researchLab') return e.level >= 3 ? 'researchLab_L3' : e.level === 2 ? 'researchLab_L2' : 'researchLab';
      return e.type;
    }
    // 絵を貼る：足あと中心（地面）の位置 m.ax,m.ay → 足あとの上の頂点 A の位置（e は回したあとの足あと fw×fd）
    function buildCacheImg(e, im, m, level, pre) {
      const pad = 6 * level, dpr = I.dpr, W = im.width * level + 2 * pad, Ht = im.height * level + 2 * pad;
      const cv = document.createElement('canvas'); cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(Ht * dpr);
      const c2 = cv.getContext('2d'); c2.setTransform(dpr, 0, 0, dpr, 0, 0); c2.imageSmoothingEnabled = true; c2.imageSmoothingQuality = 'high';
      c2.drawImage(im, pad, pad, im.width * level, im.height * level);
      const cx = pad + m.ax * level, cy = pad + m.ay * level;
      return { cv, ax: cx - (e.fw - e.fd) / 2 * TW * level, ay: cy - (e.fw + e.fd) / 2 * TH * level, W, H: Ht, level, dyn: fxOf(e, m), px: cv.width * cv.height };
    }
    // 絵の上の目印（fx = [{k,dx,dy,s}]。dx,dy は足あと中心（地面）から絵のpx）を、足あとの角(e.x,e.y)からの相対のタイル座標＋高さに直す（建物ごとに位置が違っても同じキャッシュを使えるように）
    function fxOf(e, m) { const cx = e.fw / 2, cy = e.fd / 2; return (m.fx || []).map(f => ({ k: f.k, x: cx + f.dx / 64, y: cy - f.dx / 64, z: -f.dy / HS, s: f.s || 1 })); }
    function buildCache(e, o, level, key, img) {
      if (img) { const c = buildCacheImg(e, img.im, img.m, level); cache.set(key, c); cachePx += c.px; trim(key); return c; }
      const hType = e.type === 'module' ? 'module' : e.type;
      const H = (window.Sprites.height(hType) + 12) * HS, pad = 12 * level, dpr = I.dpr;
      const W = (e.fw + e.fd) * TW * level + 2 * pad, Ht = (e.fw + e.fd) * TH * level + H * level + 2 * pad;
      const cv = document.createElement('canvas'); cv.width = Math.ceil(W * dpr); cv.height = Math.ceil(Ht * dpr);
      const ax = pad + e.fd * TW * level, ay = pad + H * level;
      const saveCtx = ctx, saveCam = I.cam, dyn = [], saveOff = I.rotOff;
      ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      I.cam = { x: ax - (e.x - e.y) * TW * level, y: ay - (e.x + e.y) * TH * level, z: level };
      capture = dyn; I.rotOff = true;   // 回したあとの座標のまま描く（e は viewOf 済み）
      let failed = false;
      try { window.Sprites.draw(g, e, Object.assign({}, o, { running: true })); } catch (err) { failed = true; if (!I.errLogged) { I.errLogged = true; console.error('iso sprite', e.type, err); } } finally { capture = null; I.rotOff = saveOff; ctx = saveCtx; I.cam = saveCam; }
      for (const d of dyn) { d.x -= e.x; d.y -= e.y; }
      const c = { cv: failed ? null : cv, ax, ay, W, H: Ht, level, dyn, px: failed ? 0 : cv.width * cv.height };   // 描画が例外でも空の絵を入れて、毎フレーム投げ直さない
      cache.set(key, c); cachePx += c.px; trim(key);
      return c;
    }
    function trim(key) { for (const [k, v] of cache) { if (cachePx <= CACHE_PX || cache.size <= 1) break; if (k === key) continue; cache.delete(k); cachePx -= v.px; } }   // 古い順に捨てる（総ピクセル数の上限）
    // 建物を描く（e は viewOf 済み＝回したあとの座標）。建設中の足場（進み具合で変わる）はキャッシュしない。alpha＜1 はゴースト用（煙なし）
    let builds = 0; const BUILD_PER_FRAME = 3;   // 1フレームに作るキャッシュの数（初回表示・拡大の段階が変わったときに固まらないように）
    function drawProcedural(e, o) { const sv = I.rotOff; I.rotOff = true; try { window.Sprites.draw(g, e, o); } finally { I.rotOff = sv; } }
    function drawEntity(e, o, alpha) {
      if (e.building) { ctx.globalAlpha = alpha === undefined ? 1 : alpha; drawProcedural(e, o); ctx.globalAlpha = 1; return; }
      const level = pickLevel(I.cam.z), bn = blName(e), bm = bn && BLM[bn] && BLM[bn].r[e.vrot], bim = bm && blImage(bn, e.vrot), ntm = !bm && !e.vrot && NTM[e.type], nim = ntm && ntImage(e.type);
      const img = bim ? { im: bim, m: bm } : nim ? { im: nim, m: ntm } : null;
      const pre = img ? (bim ? 'bl:' + bn + ':' + e.vrot : 'nt:' + e.type) + '|' + e.fw + '|' + e.fd : 'p:' + [e.type, e.parentType || '', o.era, e.fw, e.fd].join('|'), key = pre + '|' + level + '|' + I.dpr;
      let c = cache.get(key);
      if (c) { cache.delete(key); cache.set(key, c); }
      else if (builds >= BUILD_PER_FRAME && !I.buildAll) {   // 今フレームの構築枠を使い切った：別の段階の絵を拡大縮小して代用。無ければ簡単な箱
        let alt = null; for (const v of cache.values()) if (v.pre === pre && v.cv) { alt = v; break; }
        if (alt) c = alt;
        else { ctx.globalAlpha = alpha === undefined ? 1 : alpha; const sv = I.rotOff; I.rotOff = true; g.prism(e.x, e.y, e.fw, e.fd, 1.2, Math.max(8, window.Sprites.height(e.type === 'module' ? 'module' : e.type) * 0.5), '#6f6c66'); I.rotOff = sv; ctx.globalAlpha = 1; return; }
      } else { c = buildCache(e, o, level, key, img); c.pre = pre; builds++; }
      if (!c.cv) return;
      const sc = I.cam.z / c.level, a = ptv(e.x, e.y, 0);
      ctx.globalAlpha = alpha === undefined ? 1 : alpha; ctx.drawImage(c.cv, a[0] - c.ax * sc, a[1] - c.ay * sc, c.W * sc, c.H * sc); ctx.globalAlpha = 1;
      if (o.running && !alpha) for (const d of c.dyn) { const w = tiN(e.x + d.x, e.y + d.y, I.view); if (d.k === 'smoke') g.smoke(w[0], w[1], d.z, d.s); else if (d.k === 'flame') g.flame(w[0], w[1], d.z, o.t); else g.glow(w[0], w[1], d.z, 1); }
    }

    // ---- 1フレームの描画 ----
    function frame(dt) {
      const s = S(); if (!s || !GAME_DATA.map) return;
      I.t += dt; I.sources = []; builds = 0;
      ctx.setTransform(I.dpr, 0, 0, I.dpr, 0, 0);
      const era = I.eraOverride || E.currentTier(s); I.curEra = era;
      // 建物の一覧は、建物の数や埋め立てが変わったときだけ ensureMap で整える（毎フレームの全探索を避ける）
      const sig = s.plants.length + ':' + s.construction.length + ':' + Object.keys(s.buildings).reduce((a, k) => a + s.buildings[k], 0) + ':' + ((s.map && s.map.reclaim) || 0) + ':' + (s.map ? Object.keys(s.map.placed).length : -1);
      if (sig !== I.sig) { E.ensureMap(s); if (opts.onChanged) opts.onChanged(); I.sig = s.plants.length + ':' + s.construction.length + ':' + Object.keys(s.buildings).reduce((a, k) => a + s.buildings[k], 0) + ':' + ((s.map && s.map.reclaim) || 0) + ':' + Object.keys(s.map.placed).length; }
      // 地形は視点・時代・埋め立てが変わったときだけ描き直す（オフスクリーンに保持）
      const tkey = [I.view, I.cam.x.toFixed(1), I.cam.y.toFixed(1), I.cam.z.toFixed(3), era, (s.map && s.map.reclaim) || 0, s.map ? Object.keys(s.map.placed).length : 0, I.w, I.h, I.dpr].join('|');
      if (tkey !== I.tkey || !I.off) {
        if (!I.off) I.off = document.createElement('canvas');
        if (I.off.width !== canvas.width || I.off.height !== canvas.height) { I.off.width = canvas.width; I.off.height = canvas.height; }
        ctx = I.off.getContext('2d'); ctx.setTransform(I.dpr, 0, 0, I.dpr, 0, 0);
        ctx.fillStyle = '#5b8fb0'; ctx.fillRect(0, 0, I.w, I.h);
        drawTerrain(s, era);
        ctx = mainCtx; I.tkey = tkey;
      }
      ctx.drawImage(I.off, 0, 0, I.w, I.h);
      I.ents = E.mapEntities(s); I.vents = I.ents.map(viewOf);   // ents＝世界の座標、vents＝回したあとの座標（描画・タップ判定用）
      const items = I.vents.map(e => ({ e, key: e.x + e.fw / 2 + e.y + e.fd / 2 }));
      const pe = portEntity(s), pv = viewOf({ x: pe.x, y: pe.y, fw: pe.fw, fd: pe.fd }); items.push({ e: pe, key: pv.x + pv.fw / 2 + pv.y + pv.fd / 2 - 1.5 });
      items.sort((a, b) => a.key - b.key);
      for (const { e } of items) {
        if (e.type === '_port') { drawPort(e, s); continue; }
        const o = { era, t: I.t, running: running(s, e) };
        if (I.selected === e.key) outline(e, '#ffe08a', 2.2);
        drawEntity(e, o);
      }
      if (I.ghost) drawGhost(s, era);
      else if (I.cursor) { const c = I.cursor; ctx.globalAlpha = 0.6; poly([pt(c.x, c.y, 0.3), pt(c.x + 1, c.y, 0.3), pt(c.x + 1, c.y + 1, 0.3), pt(c.x, c.y + 1, 0.3)], '#ffe08a'); ctx.globalAlpha = 1; }   // 世界の座標で与え、pt が回す（正方形のまま）
      drawSmoke(dt);
    }
    function running(s, e) {
      if (e.building) return false;
      if (e.plant) return !!(e.plant.last && e.plant.last.reason === 'ok');
      if (e.type === 'refinery' || e.type === 'refineryLarge') return E.refineryOnline(s);
      if (e.type === 'powerPlant') return !!(s.power && s.power.gen > 0);
      return false;
    }
    function outline(e, col, lw) {
      const pts = [ptv(e.x, e.y, 0.5), ptv(e.x + e.fw, e.y, 0.5), ptv(e.x + e.fw, e.y + e.fd, 0.5), ptv(e.x, e.y + e.fd, 0.5)];   // e は viewOf 済み
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); ctx.globalAlpha = 0.25; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1;
    }
    function drawGhost(s, era) {
      const gh = I.ghost, pl = gh.plantId && s.plants.find(q => q.id === gh.plantId);
      const rot = pl ? E.parentRot(s, pl) : E.cleanRot(gh.type, gh.rot), [fw, fd] = E.footprintOf(gh.type, rot, pl ? pl.type : null);
      const chk = pl ? E.canPlaceModule(s, pl, gh.x, gh.y) : E.canPlace(s, gh.type, gh.x, gh.y, null, rot), col = chk.ok ? '#6fd08c' : '#e0645a';
      const ge = viewOf({ type: gh.type, parentType: pl ? pl.type : null, x: gh.x, y: gh.y, rot, fw, fd, building: false, progress: 1, plant: null, level: gh.type === 'researchLab' ? 1 : undefined });
      outline(ge, col, 2.4);
      drawEntity(ge, { era, t: I.t, running: false }, 0.7);
      gh.ok = chk.ok; gh.msg = chk.msg;
    }
    function drawSmoke(dt) {
      for (const src of I.sources) { if (I.parts.length > 220) break; if (Math.random() < dt * 5 * src.s) I.parts.push({ x: src.x, y: src.y, z: src.z, vz: 10 + Math.random() * 6, vx: 0.15 + Math.random() * 0.2, age: 0, life: 2.4 + Math.random() * 1.4, r: 3 * src.s }); }
      const dr = I.view ? viN(1, -0.7, I.view) : [1, -0.7];   // 流れる向きは画面基準（視点を回しても右上へ）
      for (const p of I.parts) { p.age += dt; p.z += p.vz * dt; p.x += p.vx * dt * 0.5 * dr[0]; p.y += p.vx * dt * 0.5 * dr[1]; p.vz *= 0.99; }
      I.parts = I.parts.filter(p => p.age < p.life);
      for (const p of I.parts) {
        const q = pt(p.x, p.y, p.z), k = p.age / p.life;
        ctx.globalAlpha = 0.55 * (1 - k); ctx.beginPath(); ctx.arc(q[0], q[1], (p.r + k * 9) * I.cam.z, 0, Math.PI * 2); ctx.fillStyle = k < 0.3 ? '#8a8782' : '#b9b7b2'; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ---- 当たり判定：建物の輪郭（足あと＋高さ）に点が入るか ----
    function hitEntity(px, py) {
      const list = (I.vents || []).slice().sort((a, b) => (b.x + b.fw / 2 + b.y + b.fd / 2) - (a.x + a.fw / 2 + a.y + a.fd / 2));   // 回したあとの座標
      for (const e of list) {
        const H = (e.building ? Math.max(40, window.Sprites.height(e.type) * 0.7) : window.Sprites.height(e.type)) * HS;
        const A = ptv(e.x, e.y, 0), B = ptv(e.x + e.fw, e.y, 0), C = ptv(e.x + e.fw, e.y + e.fd, 0), D = ptv(e.x, e.y + e.fd, 0), h = H * I.cam.z;
        const poly6 = [[D[0], D[1] - h], [A[0], A[1] - h], [B[0], B[1] - h], [B[0], B[1]], [C[0], C[1]], [D[0], D[1]]];
        let inside = false;
        for (let i = 0, j = poly6.length - 1; i < poly6.length; j = i++) { const xi = poly6[i][0], yi = poly6[i][1], xj = poly6[j][0], yj = poly6[j][1]; if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside; }
        if (inside) return e;
      }
      return null;
    }

    // ---- 入力：1本指でパン、2本指でピンチ、動かさずに離したらタップ ----
    const ptrs = new Map(); let moved = 0, startPinch = null, startCam = null;
    canvas.style.touchAction = 'none';
    const local = ev => { const r = canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
    canvas.addEventListener('pointerdown', ev => { canvas.setPointerCapture(ev.pointerId); ptrs.set(ev.pointerId, local(ev)); moved = 0; startCam = { ...I.cam }; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; startPinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: I.cam.z, mx: (a[0] + b[0]) / 2, my: (a[1] + b[1]) / 2 }; } });
    canvas.addEventListener('pointermove', ev => {
      if (!ptrs.has(ev.pointerId)) return;
      const prev = ptrs.get(ev.pointerId), cur = local(ev); ptrs.set(ev.pointerId, cur);
      if (ptrs.size === 1) { const dx = cur[0] - prev[0], dy = cur[1] - prev[1]; moved += Math.abs(dx) + Math.abs(dy); if (moved > 8) { I.cam.x += dx; I.cam.y += dy; clampCam(); } }
      else if (ptrs.size === 2 && startPinch) {
        moved = 99; const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomAt(startPinch.z * d / startPinch.d, startPinch.mx, startPinch.my);
      }
    });
    const up = ev => {
      if (!ptrs.has(ev.pointerId)) return;
      const wasOne = ptrs.size === 1; ptrs.delete(ev.pointerId); if (ptrs.size < 2) startPinch = null;
      if (wasOne && moved <= 8) { const [px, py] = local(ev), e = hitEntity(px, py), t = I.unproject(px, py + 0), we = e && (I.ents || []).find(q => q.key === e.key); I.onTap({ ent: we || e, tile: { x: Math.floor(t.x), y: Math.floor(t.y) } }); }
      saveCam();
    };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', ev => { ptrs.delete(ev.pointerId); startPinch = null; saveCam(); });
    canvas.addEventListener('contextmenu', ev => ev.preventDefault());
    canvas.addEventListener('wheel', ev => { ev.preventDefault(); const [px, py] = local(ev); zoomAt(I.cam.z * (ev.deltaY < 0 ? 1.12 : 0.89), px, py); saveCam(); }, { passive: false });
    function zoomAt(z, px, py) {
      z = clamp(z, 0.35, 1.8); const w = unprojectV(px, py), old = I.cam.z; I.cam.z = z;   // 回したあとの座標のまま拡大の中心を保つ
      I.cam.x = px - (w.x - w.y) * TW * z; I.cam.y = py - (w.x + w.y) * TH * z; clampCam();
    }
    function clampCam() {
      const M = GAME_DATA.map, c = I.unproject(I.w / 2, I.h / 2), cx = clamp(c.x, 0, M.w), cy = clamp(c.y, 0, M.h);
      if (cx !== c.x || cy !== c.y) I.center(cx, cy);
    }
    function saveCam() { try { const c = I.unproject(I.w / 2, I.h / 2); localStorage.setItem('factorySim.ui.town.cam', JSON.stringify({ x: c.x, y: c.y, z: I.cam.z, v: I.view })); } catch (e) {} }

    // ---- サイズと描画ループ ----
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return; const first = !I.w;
      I.dpr = dpr; I.w = w; I.h = h; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      if (first) {
        let c = null; try { c = JSON.parse(localStorage.getItem('factorySim.ui.town.cam')); } catch (e) {}
        const M = GAME_DATA.map; if (c && c.z) I.cam.z = c.z; if (c && Number.isInteger(c.v) && c.v >= 0 && c.v < 4 && M.w === M.h) I.view = c.v; I.center(c ? c.x : M.anchor.x, c ? c.y : M.anchor.y);
      }
    }
    window.addEventListener('resize', resize);
    let last = performance.now(), acc = 0;
    function loop(now) {
      requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now; acc += dt;
      if (document.hidden || acc < 1 / 30) return;
      if (!I.w) resize(); if (!I.w) return;
      const d = acc; acc = 0; try { frame(d); } catch (e) { if (!I.errLogged) { I.errLogged = true; console.error('iso frame', e); } }
    }
    I.start = () => { resize(); try { I.renderNow(); } catch (e) { console.error('iso first frame', e); } requestAnimationFrame(loop); for (const ms of [120, 500, 1500]) setTimeout(() => { try { resize(); I.renderNow(); } catch (e) {} }, ms); };   // 描画ループが回らない環境（ヘッドレスの撮影）や、レイアウト前の最初のフレームでも、あとから描き直す
    I.renderNow = () => { if (!I.w) resize(); frame(0.016); };
    return I;
  }
  window.Iso = { create };
})();
