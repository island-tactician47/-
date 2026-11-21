// 採掘地のマップ（pages/field.html の「地図」タブ）。見るだけの図：データから配置を決め、セーブには何も足さない（Engine.ensureMap は呼ばない）。
// アイソメ：タイル(x,y)→画面((x-y)*32, (x+y)*16)（絵はタイル幅64px）。視点の回転は無し。
(function () {
  const G = GAME_DATA, E = Engine;
  const OREIMG = { coal: 'coal', ironore: 'iron', copperore: 'copper', limestone: 'limestone' };
  const GROUND = { oil: '#7b6a4a', crude: '#8d8878', coal: '#55565a', ironore: '#8a5a45', copperore: '#6f8468', limestone: '#bdb7a2' };
  const W = 36;   // 地図の幅（タイル）

  // ---- 配置（データだけで決まる。一度だけ計算）
  const zones = [];
  function addZone(z) { zones.push(z); }
  function layout() {
    for (const id in G.leases) { const L = G.leases[id], cols = Math.min(5, Math.ceil(Math.sqrt(L.slots * 0.9))); addZone({ id, kind: 'oil', label: L.name, n: L.slots, cell: 2, cols, ground: GROUND.oil }); }
    addZone({ id: '_crude', kind: 'crude', label: '原油タンク', n: 6, cell: 4, cols: 3, ground: GROUND.crude });
    for (const res of ['coal', 'ironore', 'copperore', 'limestone']) {
      for (const id in G.mineSites) if (G.mineSites[id].res === res) addZone({ id, kind: 'mine', res, label: G.mineSites[id].name, n: G.mineSites[id].slots, cell: 3, cols: Math.min(3, G.mineSites[id].slots), ground: GROUND[res] });
      addZone({ id: '_yard_' + res, kind: 'yard', res, label: G.resources[res].name + 'の貯鉱場', n: G.buildings.mine.yard.max, cell: 2, cols: 3, ground: GROUND[res] });
    }
    // 棚詰め：幅 W の行に左から並べる
    let x = 1, y = 1, rowH = 0;
    for (const z of zones) {
      z.rows = Math.ceil(z.n / z.cols); z.w = z.cols * z.cell + 2; z.h = z.rows * z.cell + 2;
      if (x + z.w > W) { x = 1; y += rowH + 1; rowH = 0; }
      z.x = x; z.y = y; x += z.w + 1; rowH = Math.max(rowH, z.h);
    }
    layout.H = y + rowH + 2;
  }

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

  function draw() {
    if (!ctx || !state) return;
    const s = state;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#8fa273'; ctx.fillRect(0, 0, cw, ch);
    ctx.save(); ctx.translate(cam.x, cam.y); ctx.scale(cam.z, cam.z);
    // 地面
    for (const z of zones) {
      const c = counts(s, z);
      diamond(z.x, z.y, z.w, z.h); ctx.fillStyle = z.ground; ctx.globalAlpha = c.owned ? 1 : 0.45; ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = z === sel ? 4 : 1.5; ctx.strokeStyle = z === sel ? '#d9531e' : 'rgba(40,30,20,.55)'; ctx.setLineDash(c.owned ? [] : [8, 6]); ctx.stroke(); ctx.setLineDash([]);
      for (let i = 0; i < z.n; i++) {   // 区画の枠（空き）
        const cx = z.x + 1 + (i % z.cols) * z.cell, cy = z.y + 1 + Math.floor(i / z.cols) * z.cell;
        diamond(cx + 0.1, cy + 0.1, z.cell - 0.2, z.cell - 0.2); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    // 建物：奥から手前（x+y 順）
    const items = [];
    for (const z of zones) {
      const c = counts(s, z), name = spriteOf(z);
      for (let i = 0; i < c.n + c.nb && i < z.n; i++) {
        const cx = z.x + 1 + (i % z.cols) * z.cell + z.cell / 2, cy = z.y + 1 + Math.floor(i / z.cols) * z.cell + z.cell / 2;
        items.push({ name, cx, cy, building: i >= c.n, paused: c.paused && z.kind === 'mine' });
      }
    }
    items.sort((a, b) => (a.cx + a.cy) - (b.cx + b.cy));
    for (const it of items) {
      const o = img(it.name); if (!o) continue;
      ctx.globalAlpha = it.building ? 0.5 : it.paused ? 0.7 : 1;
      ctx.drawImage(o.im, sx(it.cx, it.cy) - o.m.ax, sy(it.cx, it.cy) - o.m.ay, o.m.w, o.m.h);
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
    cam.z = 0.45; cam.x = cw / 2 - sx(tx, ty) * cam.z; cam.y = ch / 2 - sy(tx, ty) * cam.z; framed = true;
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
        if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pd) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nz = Math.max(0.25, Math.min(1.6, cam.z * d / pd)); cam.x = mx - (mx - cam.x) * nz / cam.z; cam.y = my - (my - cam.y) * nz / cam.z; cam.z = nz; } pd = d; moved = 99; draw(); return; }
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
      canvas.addEventListener('wheel', e => { e.preventDefault(); const p = pos(e), nz = Math.max(0.25, Math.min(1.6, cam.z * (e.deltaY < 0 ? 1.1 : 0.9))); cam.x = p.x - (p.x - cam.x) * nz / cam.z; cam.y = p.y - (p.y - cam.y) * nz / cam.z; cam.z = nz; draw(); }, { passive: false });
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
