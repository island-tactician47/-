// 採掘地のマップ（pages/field.html の「地図」タブ）。見るだけの図：データから配置を決め、セーブには何も足さない（Engine.ensureMap は呼ばない）。
// アイソメ：タイル(x,y)→画面((x-y)*32, (x+y)*16)（絵はタイル幅64px）。視点の回転は無し。
(function () {
  const G = GAME_DATA, E = Engine;
  const OREIMG = { coal: 'coal', ironore: 'iron', copperore: 'copper', limestone: 'limestone' };
  const GROUND = { oil: '#7b6a4a', crude: '#8d8878', coal: '#55565a', ironore: '#8a5a45', copperore: '#6f8468', limestone: '#bdb7a2' };
  const W = 36;   // 地図の幅（タイル）

  // ---- 配置（データだけで決まる。一度だけ計算）
  // 麓の集積地（原油タンク・鉱石の貯鉱場）を下に、資源地帯（銅・油田・石炭・鉄・石灰石）を上に、離して散らす。各地帯の左の縁から道路が集積地へ
  const zones = [], roads = [], hills = [], blocks = [];
  let MAPH = 74;
  function pack(list, x0, y0, maxW) {   // 棚詰め：幅 maxW の行に左から並べる。地帯の外形を返す
    let x = x0, y = y0, rowH = 0, right = x0;
    for (const z of list) {
      z.rows = Math.ceil(z.n / z.cols); z.w = z.cols * z.cell + 2; z.h = z.rows * z.cell + 2;
      if (x + z.w > x0 + maxW) { x = x0; y += rowH + 1; rowH = 0; }
      z.x = x; z.y = y; x += z.w + 1; rowH = Math.max(rowH, z.h); right = Math.max(right, z.x + z.w); zones.push(z);
    }
    return { x: x0, y: y0, w: right - x0, h: y + rowH - y0 };
  }
  function cluster(zs, x0, y0, maxW, hillLevels, rock) {
    const r = pack(zs, x0, y0, maxW);
    hills.push({ x: x0 - 1, y: y0 - 7, w: r.w + 2, h: 6, levels: hillLevels, rock });
    roads.push({ x1: x0 - 1, y1: y0 + 1, x2: x0 + 1, y2: y0 + 1 }, { x1: x0 - 1, y1: y0 + 1, x2: x0 - 1, y2: 56 });   // 地帯への入口と、集積地への道
    blocks.push({ x: x0 - 2, y: y0 - 8, w: r.w + 4, h: r.h + 9 });
  }
  function layout() {
    zones.length = 0; roads.length = 0; hills.length = 0; blocks.length = 0;
    const site = res => Object.keys(G.mineSites).filter(id => G.mineSites[id].res === res).map(id => ({ id, kind: 'mine', res, label: G.mineSites[id].name, n: G.mineSites[id].slots, cell: 3, cols: Math.min(3, G.mineSites[id].slots), ground: GROUND[res] }));
    const oil = Object.keys(G.leases).map(id => { const L = G.leases[id]; return { id, kind: 'oil', label: L.name, n: L.slots, cell: 2, cols: Math.min(5, Math.ceil(Math.sqrt(L.slots * 0.9))), ground: GROUND.oil }; });
    cluster(site('copperore'), 3, 10, 24, 3, 'copperore');
    cluster(oil, 3, 27, 32, 2, 'oil');
    cluster(site('coal'), 37, 10, 18, 3, 'coal');
    cluster(site('ironore'), 58, 10, 18, 3, 'ironore');
    cluster(site('limestone'), 58, 35, 18, 3, 'limestone');
    // 集積地（麓）：幹線道路 y=56（左右）と x=42（下）。原油タンクは幹線の左、貯鉱場は右
    const crude = { id: '_crude', kind: 'crude', label: '原油タンク', n: 6, cell: 4, cols: 3, ground: GROUND.crude, rows: 2, w: 14, h: 10, x: 27, y: 58 }; zones.push(crude);
    [['coal', 44, 58], ['ironore', 53, 58], ['copperore', 44, 65], ['limestone', 53, 65]].forEach(([res, x, y]) => zones.push({ id: '_yard_' + res, kind: 'yard', res, label: G.resources[res].name + 'の貯鉱場', n: G.buildings.mine.yard.max, cell: 2, cols: 3, ground: GROUND[res], rows: 2, w: 8, h: 6, x, y }));
    roads.push({ x1: 1, y1: 56, x2: 76, y2: 56 }, { x1: 42, y1: 56, x2: 42, y2: 72 }, { x1: 27, y1: 71, x2: 62, y2: 71 });
    hub = { x: 25, y: 54, w: 46, h: 20 };
    blocks.push(hub); MAPH = 75;
    // 区画の外の飾り（木・岩）：座標のハッシュ。森の区画（5×5タイル単位）は密。道路・崖・区画の上には置かない
    bg.length = 0;
    for (let tx = -4; tx < 82; tx++) for (let ty = -4; ty < MAPH + 4; ty++) {
      if (zones.some(z => tx >= z.x - 1 && tx <= z.x + z.w && ty >= z.y - 1 && ty <= z.y + z.h) || blocks.some(q => tx >= q.x && tx <= q.x + q.w && ty >= q.y && ty <= q.y + q.h) || roads.some(r => tx >= Math.min(r.x1, r.x2) - 1 && tx <= Math.max(r.x1, r.x2) + 1 && ty >= Math.min(r.y1, r.y2) - 1 && ty <= Math.max(r.y1, r.y2) + 1)) continue;
      const h = (Math.imul(tx, 73856093) ^ Math.imul(ty, 19349663)) >>> 0, r = h % 1000, forest = ((Math.floor(tx / 5) * 31 + Math.floor(ty / 5) * 17) % 3) === 0;
      if (r < (forest ? 520 : 70)) bg.push({ k: 'tree', x: tx + 0.2 + (h >>> 8) % 6 / 10, y: ty + 0.2 + (h >>> 12) % 6 / 10, s: 0.8 + (h >>> 4) % 5 / 10, c: (h >>> 16) % 3 });
      else if (r > 975) bg.push({ k: 'rock', x: tx + 0.4, y: ty + 0.4, s: 0.7 + (h >>> 5) % 6 / 10 });
    }
    bg.sort((a, b) => (a.x + a.y) - (b.x + b.y));
  }
  let hub = null;
  const bg = [];

  const imgs = {};
  function img(name) {
    if (imgs[name] !== undefined) return imgs[name];
    const m = G.spritesBL && G.spritesBL[name]; imgs[name] = null;
    if (!m || !m.r || !m.r[0]) return null;
    const im = new Image(); im.onload = () => { imgs[name] = { im, m: m.r[0] }; FieldMap.invalidate(); }; im.src = m.r[0].file;
    return null;
  }

  let canvas, ctx, dpr = 1, cw = 0, ch = 0, cam = { x: 0, y: 0, z: 0.7 }, sel = null, lastSig = '', onSelect = null, state = null, framed = false;
  const sx = (x, y) => (x - y) * 32, sy = (x, y) => (x + y) * 16;

  function counts(s, z) {
    if (z.kind === 'oil') return { n: E.wellsOnLease(s, z.id), nb: E.buildingOnLease(s, z.id), owned: s.leases[z.id] && s.leases[z.id].owned };
    if (z.kind === 'mine') { const st = E.mineSiteState(s, z.id); return { n: E.minesOnSite(s, z.id), nb: E.buildingOnSite(s, z.id), owned: st.owned, paused: !!st.paused }; }
    if (z.kind === 'yard') return { n: E.yardCount(s, z.res), nb: E.yardBuilding(s, z.res), owned: true };
    return { n: E.count(s, 'crudeTank'), nb: E.constructing(s, 'crudeTank'), owned: true };
  }
  function spriteOf(z) { return z.kind === 'oil' ? 'oilWell' : z.kind === 'mine' ? 'mine_' + OREIMG[z.res] : z.kind === 'yard' ? 'yard_' + OREIMG[z.res] : 'crudeTank'; }

  function diamond(x, y, w, d) { ctx.beginPath(); ctx.moveTo(sx(x, y), sy(x, y)); ctx.lineTo(sx(x + w, y), sy(x + w, y)); ctx.lineTo(sx(x + w, y + d), sy(x + w, y + d)); ctx.lineTo(sx(x, y + d), sy(x, y + d)); ctx.closePath(); }

  // 採石場の段々：区画の縁の1タイルを2段の斜面にして、中を低くする。奥側（左上・右上）の壁だけが見える
  const WALL = { coal: ['#4a4a50', '#6a6a72', '#85858d'], ironore: ['#7a6f66', '#9d8f84', '#b9aa9d'], copperore: ['#6f776c', '#8e988a', '#aab5a5'], limestone: ['#a9a595', '#c9c5b3', '#e3dfcd'] };   // 北西の壁・北東の壁・地層の線
  const STEP = 22, STEPS = 2;
  function pit(z) {
    const cols = WALL[z.res] || WALL.coal; let o = { x: z.x, y: z.y, w: z.w, d: z.h }, lv = 0;
    for (let k = 0; k < STEPS; k++) {
      const i = 0.5, n = { x: o.x + i, y: o.y + i, w: o.w - 2 * i, d: o.d - 2 * i }, a = lv, b = lv + STEP;
      const P = (x, y, l) => [sx(x, y), sy(x, y) + l];
      for (const [qi, q] of [[P(o.x, o.y + o.d, a), P(o.x, o.y, a), P(n.x, n.y, b), P(n.x, n.y + n.d, b)], [P(o.x, o.y, a), P(o.x + o.w, o.y, a), P(n.x + n.w, n.y, b), P(n.x, n.y, b)]].entries()) {
        ctx.beginPath(); q.forEach((p, j) => j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = cols[qi]; ctx.fill();
        ctx.strokeStyle = cols[2]; ctx.lineWidth = 1.2; ctx.beginPath(); for (const f of [0.35, 0.7]) { const p0 = [q[0][0] + (q[3][0] - q[0][0]) * f, q[0][1] + (q[3][1] - q[0][1]) * f], p1 = [q[1][0] + (q[2][0] - q[1][0]) * f, q[1][1] + (q[2][1] - q[1][1]) * f]; ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); } ctx.stroke();
      }
      // 段の床（一段下がった面）。下の段ほど暗い
      ctx.beginPath(); [[n.x, n.y], [n.x + n.w, n.y], [n.x + n.w, n.y + n.d], [n.x, n.y + n.d]].forEach((c, j) => { const p = P(c[0], c[1], b); j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath();
      ctx.fillStyle = z.ground; ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,' + (0.08 * (k + 1)) + ')'; ctx.fill();
      o = n; lv = b;
    }
    return lv;
  }
  // 崖：段々に積んだ山（ジグラット）。前の2面（左下・右下）が岩肌、上面は草。下の段ほど大きい
  const HILL = { copperore: ['#7c8577', '#9aa593', '#b8c3b0'], oil: ['#8a7b5f', '#a89878', '#c4b794'], coal: ['#55555b', '#74747c', '#8f8f98'], ironore: ['#8a6a58', '#a98772', '#c6a590'], limestone: ['#b8b4a2', '#d2cfbd', '#e8e5d4'] };
  function hill(h) {
    const c = HILL[h.rock] || HILL.coal, H = 24;
    for (let i = 0; i < h.levels; i++) {
      const ins = i * 1.1, x = h.x + ins, y = h.y + ins, w = h.w - 2 * ins, d = h.h - 2 * ins; if (w < 1 || d < 1) break;
      const l0 = -i * H, l1 = -(i + 1) * H, P = (px, py, l) => [sx(px, py), sy(px, py) + l];
      const quad = (pts, fill) => { ctx.beginPath(); pts.forEach((q, j) => j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
      const q1 = [P(x, y + d, l0), P(x + w, y + d, l0), P(x + w, y + d, l1), P(x, y + d, l1)], q2 = [P(x + w, y + d, l0), P(x + w, y, l0), P(x + w, y, l1), P(x + w, y + d, l1)];
      quad(q1, c[0]); quad(q2, c[1]);
      ctx.strokeStyle = c[2]; ctx.lineWidth = 1.2; ctx.beginPath();
      for (const q of [q1, q2]) for (const f of [0.3, 0.62]) { ctx.moveTo(q[0][0] + (q[3][0] - q[0][0]) * f, q[0][1] + (q[3][1] - q[0][1]) * f); ctx.lineTo(q[1][0] + (q[2][0] - q[1][0]) * f, q[1][1] + (q[2][1] - q[1][1]) * f); }
      ctx.stroke();
      quad([P(x, y, l1), P(x + w, y, l1), P(x + w, y + d, l1), P(x, y + d, l1)], i === h.levels - 1 ? '#86a068' : '#7c9660');
    }
  }
  function road(r) {   // 縦か横の道路（幅1.6タイル）。中央に破線
    const x = Math.min(r.x1, r.x2), y = Math.min(r.y1, r.y2), w = Math.abs(r.x2 - r.x1), d = Math.abs(r.y2 - r.y1), a = 0.8;
    const alongX = w >= d, rx = alongX ? x : x - a, ry = alongX ? y - a : y, rw = alongX ? w : 2 * a, rd = alongX ? 2 * a : d;
    diamond(rx, ry, rw, rd); ctx.fillStyle = '#6c6b67'; ctx.fill();
    ctx.strokeStyle = '#d6d3c8'; ctx.lineWidth = 1.4; ctx.setLineDash([7, 9]); ctx.beginPath();
    ctx.moveTo(sx(alongX ? x : x, alongX ? y : y), sy(alongX ? x : x, alongX ? y : y)); ctx.lineTo(sx(alongX ? x + w : x, alongX ? y : y + d), sy(alongX ? x + w : x, alongX ? y : y + d)); ctx.stroke(); ctx.setLineDash([]);
  }
  function tree(b) {
    const x = sx(b.x, b.y), y = sy(b.x, b.y), s = b.s, g = ['#47703d', '#557f46', '#3d6636'][b.c];
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x + 4 * s, y + 2, 11 * s, 5 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#5d4630'; ctx.fillRect(x - 1.5 * s, y - 9 * s, 3 * s, 9 * s);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - 15 * s, 9 * s, 10 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.ellipse(x - 2.5 * s, y - 18 * s, 4.5 * s, 4.5 * s, 0, 0, 7); ctx.fill();
  }
  function rock(b) { const x = sx(b.x, b.y), y = sy(b.x, b.y), s = b.s; ctx.fillStyle = '#8b8a84'; ctx.beginPath(); ctx.moveTo(x - 8 * s, y); ctx.lineTo(x - 4 * s, y - 7 * s); ctx.lineTo(x + 3 * s, y - 8 * s); ctx.lineTo(x + 9 * s, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - 7 * s); ctx.lineTo(x + 3 * s, y - 8 * s); ctx.lineTo(x, y - 3 * s); ctx.closePath(); ctx.fill(); }

  function draw() {
    if (!ctx || !state) return;
    const s = state;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#8fa273'; ctx.fillRect(0, 0, cw, ch);
    ctx.save(); ctx.translate(cam.x, cam.y); ctx.scale(cam.z, cam.z);
    if (hub) { diamond(hub.x, hub.y, hub.w, hub.h); ctx.fillStyle = '#a9a595'; ctx.fill(); ctx.strokeStyle = 'rgba(60,50,40,.5)'; ctx.lineWidth = 2; ctx.stroke(); }   // 集積地の舗装
    for (const r of roads) road(r);
    for (const h of hills) hill(h);
    // 地面
    for (const z of zones) {
      const c = counts(s, z);
      if (z.kind === 'mine') { diamond(z.x, z.y, z.w, z.h); ctx.fillStyle = '#7d8f66'; ctx.fill(); z.depth = pit(z); }
      diamond(z.x, z.y, z.w, z.h); ctx.fillStyle = z.kind === 'mine' ? 'rgba(0,0,0,0)' : z.ground; ctx.globalAlpha = c.owned ? 1 : 0.45; ctx.fill(); ctx.globalAlpha = 1;
      if (z.kind === 'mine' && !c.owned) { diamond(z.x, z.y, z.w, z.h); ctx.fillStyle = 'rgba(143,162,115,.5)'; ctx.fill(); }
      ctx.lineWidth = z === sel ? 4 : 1.5; ctx.strokeStyle = z === sel ? '#d9531e' : 'rgba(40,30,20,.55)'; ctx.setLineDash(c.owned ? [] : [8, 6]); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < z.n; i++) {   // 区画の枠（空き）
        const cx = z.x + 1 + (i % z.cols) * z.cell, cy = z.y + 1 + Math.floor(i / z.cols) * z.cell;
        diamond(cx + 0.1, cy + 0.1, z.cell - 0.2, z.cell - 0.2); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    for (const b of bg) { const px = sx(b.x, b.y) * cam.z + cam.x, py = sy(b.x, b.y) * cam.z + cam.y; if (px < -40 || px > cw + 40 || py < -20 || py > ch + 60) continue; if (b.k === 'tree') tree(b); else rock(b); }
    // 建物：奥から手前（x+y 順）
    const items = [];
    for (const z of zones) {
      const c = counts(s, z), name = spriteOf(z);
      for (let i = 0; i < c.n + c.nb && i < z.n; i++) {
        const cx = z.x + 1 + (i % z.cols) * z.cell + z.cell / 2, cy = z.y + 1 + Math.floor(i / z.cols) * z.cell + z.cell / 2;
        items.push({ name, cx, cy, dy: z.kind === 'mine' ? (z.depth || 0) : 0, building: i >= c.n, paused: c.paused && z.kind === 'mine' });
      }
    }
    items.sort((a, b) => (a.cx + a.cy) - (b.cx + b.cy));
    for (const it of items) {
      const o = img(it.name); if (!o) continue;
      ctx.globalAlpha = it.building ? 0.5 : it.paused ? 0.7 : 1;
      ctx.drawImage(o.im, sx(it.cx, it.cy) - o.m.ax, sy(it.cx, it.cy) - o.m.ay + it.dy, o.m.w, o.m.h);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    // 文字（画面の固定サイズ）
    ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    for (const z of zones) {
      const c = counts(s, z), px = (sx(z.x + z.w / 2, z.y) ) * cam.z + cam.x, py = sy(z.x + z.w / 2, z.y) * cam.z + cam.y - 4;
      if (px < -80 || px > cw + 80 || py < -20 || py > ch + 20) continue;
      const t = z.label + (c.owned ? `　${c.n}${c.nb ? '+' + c.nb : ''}/${z.n}` : '　未取得');
      const w = ctx.measureText(t).width + 10;
      ctx.fillStyle = 'rgba(30,26,22,.78)'; ctx.fillRect(px - w / 2, py - 14, w, 18);
      ctx.fillStyle = c.owned ? '#fff' : '#cfc7b0'; ctx.fillText(t, px, py - 1);
    }
  }

  function frameOwned(s) {
    let tx = zones[0].x + zones[0].w / 2, ty = zones[0].y + zones[0].h / 2;
    const own = zones.filter(z => counts(s, z).owned && z.kind !== 'yard');
    if (own.length) { tx = own.reduce((a, z) => a + z.x + z.w / 2, 0) / own.length; ty = own.reduce((a, z) => a + z.y + z.h / 2, 0) / own.length; }
    if (hub) { tx = (tx + hub.x + hub.w / 2) / 2; ty = (ty + hub.y + hub.h / 2) / 2; }
    cam.z = (/[?&]fz=([\d.]+)/.exec(location.search) || [0, 0.3])[1] * 1 || 0.3; cam.x = cw / 2 - sx(tx, ty) * cam.z; cam.y = ch / 2 - sy(tx, ty) * cam.z; framed = true;
  }

  function sigOf(s) { return zones.map(z => { const c = counts(s, z); return z.id + ':' + c.n + ':' + c.nb + ':' + (c.owned ? 1 : 0) + (c.paused ? 'p' : ''); }).join('|') + '|' + (sel ? sel.id : '') + '|' + Math.round(cam.x) + ',' + Math.round(cam.y) + ',' + cam.z.toFixed(2) + '|' + cw + 'x' + ch; }

  function resize() {
    const r = canvas.getBoundingClientRect(); dpr = window.devicePixelRatio || 1; cw = Math.round(r.width); ch = Math.round(r.height);
    if (!cw || !ch) return false; canvas.width = cw * dpr; canvas.height = ch * dpr; return true;
  }
  const FieldMap = {
    zones: () => zones, selected: () => sel,
    invalidate() { lastSig = ''; if (state && canvas && canvas.offsetParent) draw(); },
    select(id) { sel = zones.find(z => z.id === id) || null; lastSig = ''; if (onSelect) onSelect(sel); },
    init(cv, cb) {
      canvas = cv; ctx = cv.getContext('2d'); onSelect = cb; layout();
      let pts = new Map(), moved = 0, last = null, pd = 0;
      const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, pos(e)); moved = 0; last = pos(e); pd = pts.size === 2 ? Math.hypot(...[...pts.values()].reduce((a, p, i) => i ? [a[0] - p.x, a[1] - p.y] : [p.x, p.y], [0, 0])) : 0; });
      canvas.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) return; const p = pos(e); pts.set(e.pointerId, p);
        if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pd) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nz = Math.max(0.18, Math.min(1.6, cam.z * d / pd)); cam.x = mx - (mx - cam.x) * nz / cam.z; cam.y = my - (my - cam.y) * nz / cam.z; cam.z = nz; } pd = d; moved = 99; draw(); return; }
        const dx = p.x - last.x, dy = p.y - last.y; moved += Math.abs(dx) + Math.abs(dy); if (moved > 6) { cam.x += dx; cam.y += dy; draw(); } last = p;
      });
      const up = e => {
        if (pts.size === 1 && moved <= 6) {   // タップ：区画の判定
          const p = pos(e), wx = (p.x - cam.x) / cam.z, wy = (p.y - cam.y) / cam.z, tx = (wx / 32 + wy / 16) / 2, ty = (wy / 16 - wx / 32) / 2;
          const hit = zones.filter(z => tx >= z.x && tx <= z.x + z.w && ty >= z.y && ty <= z.y + z.h).pop();
          FieldMap.select(hit ? hit.id : null); if (state) { lastSig = ''; draw(); }
        }
        pts.delete(e.pointerId); pd = 0;
      };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', e => { pts.delete(e.pointerId); pd = 0; });
      canvas.addEventListener('wheel', e => { e.preventDefault(); const p = pos(e), nz = Math.max(0.18, Math.min(1.6, cam.z * (e.deltaY < 0 ? 1.1 : 0.9))); cam.x = p.x - (p.x - cam.x) * nz / cam.z; cam.y = p.y - (p.y - cam.y) * nz / cam.z; cam.z = nz; draw(); }, { passive: false });
      for (const z of zones) for (const n of [spriteOf(z)]) img(n);
    },
    // 表示中に状態が変わったときだけ描き直す
    update(s) {
      state = s; if (!canvas || !canvas.offsetParent) return;
      if (!cw || !ch) { if (!resize()) return; }
      if (!framed) frameOwned(s);
      const sg = sigOf(s); if (sg === lastSig) return; lastSig = sg; draw();
    }
  };
  window.FieldMap = FieldMap;
})();
