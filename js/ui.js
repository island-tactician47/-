// 全ページ共通のUI：ヘッダー（日付・資金・速度）、下部ナビ、時間のループ、イベント通知、セーブ
(function () {
  const DAY_MS = 2000;            // 1倍速で1日＝2秒 → 1か月＝約1分
  const SPEEDS = [0, 1, 4, 8, 16];
  const NAV = [
    { href: 'town.html',     icon: '🗺️', label: '町' },
    // alt：このタブの下にある別ページ（開いているときもこのタブを強調する）。採掘地・製油所は工場の石油本部から開く
    { href: 'factory.html',  icon: '🏗️', label: '工場', alt: ['field.html', 'refinery.html'] },
    { href: 'market.html',   icon: '📈', label: '市場' },
    { href: 'dashboard.html', icon: '📊', label: '経営', show: s => Engine.dashboardVisible(s) },
    { href: 'finance.html',  icon: '💰', label: '財務', alt: ['statements.html'] },
    { href: 'research.html', icon: '🔬', label: '研究' }
  ];
  // 右上のメニュー（下のタブに無いページ）
  const MENU = [
    { href: 'field.html',        icon: '🛢️', label: '採掘地（油井・鉱山・貯鉱場）' },
    { href: 'statements.html',   icon: '📑', label: '財務三表（過去の決算）' },
    { href: 'refinery.html',     icon: '🏭', label: '製油所' },
    { href: '../launcher.html',  icon: '🏠', label: 'ホーム（設定・セーブの引き継ぎ・新規）' },
    { href: 'debug.html',        icon: '🔧', label: 'デバッグ（PC用）' }
  ];

  let foldState = {};
  try { foldState = JSON.parse(localStorage.getItem('factorySim.ui.fold') || '{}') || {}; } catch (e) { foldState = {}; }
  let state = null, renderFn = null, acc = 0, lastT = 0, dirty = true, lastSave = 0, modalOpen = false;
  // 押している最中に再描画するとボタンが作り直されてクリックが消えるため、押下中は描画を止める
  let noSave = false, warnedSave = false;
  let pressing = false, releaseTimer = null;
  // スマホ：画面をスクロールし始めると pointercancel が来るが、指はまだ画面に触れている。そのまま再描画すると、メニューが作り直されてスクロールが止まる
  // （地図のメニューなど）。指が1本でも触れている間は、描画を止める（touches で数える）
  let touches = 0;
  document.addEventListener('pointerdown', () => { pressing = true; clearTimeout(releaseTimer); }, true);
  const release = () => { clearTimeout(releaseTimer); if (touches > 0) return; releaseTimer = setTimeout(() => { if (touches === 0) pressing = false; }, 80); };
  document.addEventListener('pointerup', release, true);
  document.addEventListener('pointercancel', release, true);
  document.addEventListener('touchstart', ev => { touches = ev.touches.length; pressing = true; clearTimeout(releaseTimer); }, { capture: true, passive: true });
  const touchEnd = ev => { touches = ev.touches.length; if (touches === 0) { clearTimeout(releaseTimer); releaseTimer = setTimeout(() => { if (touches === 0) pressing = false; }, 120); } };
  document.addEventListener('touchend', touchEnd, { capture: true, passive: true });
  document.addEventListener('touchcancel', touchEnd, { capture: true, passive: true });

  const UI = {
    get state() { return state; },
    DAY_MS,

    boot(opts) {
      state = Save.load();
      if (!state) { location.href = '../launcher.html'; return; }
      Engine.normalize(state);
      renderFn = opts.render;
      if (state.speed === undefined) state.speed = 0;
      if (!SPEEDS.includes(state.speed)) state.speed = SPEEDS.find(v => v >= state.speed) || SPEEDS[SPEEDS.length - 1];   // 古いセーブの速度（×2）は近い速度へ
      buildChrome(opts.page);
      offlineCatchUp();
      lastT = performance.now();
      setInterval(loop, 100);
      document.addEventListener('visibilitychange', () => { if (document.hidden) UI.save(); });
      window.addEventListener('pagehide', () => UI.save());
      document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => UI.save()));
      showPending();
      UI.refresh();
    },

    // 中身が変わったときだけ innerHTML を差し替える
    // ---- 共通部品：折りたたみ（開閉の状態は保存し、再描画しても保つ）と、本部のタブ ----
    addRecord(g) { try { const k = 'factorySim.records.v1', a = JSON.parse(localStorage.getItem(k) || '[]'); a.push(g); a.sort((x, y) => y.score - x.score); localStorage.setItem(k, JSON.stringify(a.slice(0, 30))); } catch (e) {} },
    // fold(key, 見出しHTML, 中身HTML, 既定で開くか)。key は英数字とハイフンだけ
    fold(key, summary, body, defOpen) {
      const open = key in foldState ? foldState[key] : !!defOpen;
      return `<details class="fold" data-o="${open ? 1 : 0}" ${open ? 'open' : ''} ontoggle="UI.toggled('${key}',this)"><summary>${summary}</summary><div class="foldbody">${body}</div></details>`;
    },
    // 描画したときの開閉（data-o）と同じなら、解析時に出る toggle イベントなので何もしない（既定の開閉を保存してしまわないため）。ユーザーの操作のときだけ保存する
    toggled(key, el) { const v = el.open; if (el.dataset.o === (v ? '1' : '0')) return; el.dataset.o = v ? '1' : '0'; foldState[key] = v; try { localStorage.setItem('factorySim.ui.fold', JSON.stringify(foldState)); } catch (e) {} UI.refresh(); },
    // 工場の利益の数え方（見積もりの表示だけ。セーブには入れない）：false＝自社で使う原料も市場の売値で数える（従来）／true＝自社で使う原料は原価で受け渡す
    costMode() { try { return localStorage.getItem('factorySim.ui.costMode') === '1'; } catch (e) { return false; } },
    setCostMode(v) { try { localStorage.setItem('factorySim.ui.costMode', v ? '1' : '0'); } catch (e) {} UI.refresh(); },
    costToggle() {
      const on = UI.costMode();
      return `<div class="chips" style="margin:4px 0"><span class="chip ${on ? '' : 'on'}" onclick="UI.setCostMode(false)">売値で数える</span><span class="chip ${on ? 'on' : ''}" onclick="UI.setCostMode(true)">原価で受け渡す</span></div><div class="sub">${on ? '自社で使う原料は、作った工場の費用（原料＋操業費＋維持費）で受け渡す。作る工場は自社分の利益0、最終の工場に利益が集まる。工場でない供給元（油井・鉱山・製油所）の品は市場の価格のまま。' : '自社で使う原料も、市場の売値で数える（作る工場の利益に、売値ぶんが入る）。'}（見積もりの表示だけ。実際のお金は変わらない）</div>`;
    },
    // 本部のタブ：page ごとに選択を保存。items = [{ id, label, badge? }]
    tab(page, def) { try { return localStorage.getItem('factorySim.ui.tab.' + page) || def; } catch (e) { return def; } },
    setTab(page, id) { try { localStorage.setItem('factorySim.ui.tab.' + page, id); } catch (e) {} UI.refresh(); },
    chips(page, items, cur) {
      return `<div class="chips">${items.map(it => `<span class="chip ${it.id === cur ? 'on' : ''}" onclick="UI.setTab('${page}','${it.id}')">${it.label}${it.badge ? ` <b class="${it.bad ? 'bad' : ''}">${it.badge}</b>` : ''}</span>`).join('')}</div>`;
    },
    html(el, str) { if (typeof el === 'string') el = document.getElementById(el); if (el && el._h !== str) { el.innerHTML = str; el._h = str; } },

    save() { if (state && !noSave) { const ok = Save.save(state); lastSave = performance.now(); if (!ok && !warnedSave) { warnedSave = true; UI.toast("⚠️ セーブできません（" + (Save.why || "不明") + "）。メニューの書き出しで控えを取ってください", 9000); } } },
    // 取り込み（import）直後に reload するとき、メモリ上の古い state で上書きされないようにする
    blockSave() { noSave = true; },
    refresh() { dirty = true; },

    // 操作を実行してセーブ・再描画。失敗時はトースト
    act(fn) {
      const r = fn(state);
      if (r && r.ok === false && r.msg) UI.toast(r.msg);
      UI.save(); showPending(); UI.refresh();
      return r;
    },

    setSpeed(sp) { state.speed = sp; UI.save(); updateHeader(); },

    toast(msg, ms) {
      const t = document.getElementById('toast');
      t.textContent = msg; t.classList.add('show');
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), ms || 2200);
    },

    modal(title, html, buttons) {
      const m = document.getElementById('modal');
      m.querySelector('.box').innerHTML = `<h3>${title}</h3><div>${html}</div><div class="btns" style="margin-top:12px;justify-content:flex-end"></div>`;
      const bw = m.querySelector('.btns');
      (buttons || [{ label: 'OK' }]).forEach(b => {
        const el = document.createElement('button');
        el.className = 'btn' + (b.cls ? ' ' + b.cls : ''); el.textContent = b.label;
        el.onclick = () => { m.classList.remove('show'); modalOpen = false; if (b.onClick) b.onClick(); showPending(); UI.refresh(); };
        bw.appendChild(el);
      });
      m.classList.add('show'); modalOpen = true;
    },

    // 小さな折れ線（sparkline）
    spark(canvas, values, color, opts) {
      opts = opts || {};
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      const c = canvas.getContext('2d'); c.scale(dpr, dpr);
      c.clearRect(0, 0, w, h);
      if (values.length < 2) { c.fillStyle = '#7a6f62'; c.font = '11px sans-serif'; c.fillText('データ待ち', 4, h / 2); return; }
      let min = Math.min(...values), max = Math.max(...values);
      if (opts.zero) min = Math.min(0, min);
      if (max - min < 1e-9) { max += 1; min -= 1; }
      const x = i => 2 + (w - 4) * i / (values.length - 1);
      const y = v => h - 3 - (h - 6) * (v - min) / (max - min);
      if (opts.zero && min < 0) { c.strokeStyle = '#ccc'; c.beginPath(); c.moveTo(0, y(0)); c.lineTo(w, y(0)); c.stroke(); }
      c.strokeStyle = color; c.lineWidth = 2; c.beginPath();
      values.forEach((v, i) => i ? c.lineTo(x(i), y(v)) : c.moveTo(x(i), y(v)));
      c.stroke();
      if (opts.labels) {
        c.fillStyle = '#7a6f62'; c.font = '10px sans-serif';
        c.fillText(opts.fmt ? opts.fmt(max) : max.toFixed(2), 2, 10);
        c.fillText(opts.fmt ? opts.fmt(min) : min.toFixed(2), 2, h - 2);
      }
    },

    // 推移のグラフ（年ごと）。pts = [{ y, v }]（v が null の年は線を引かない）。縦に目盛り線と数値、横に年。opts = { fmt, zero, note（最初の値の位置に出す注記）}
    trendChart(canvas, pts, color, opts) {
      opts = opts || {};
      const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      const c = canvas.getContext('2d'); c.scale(dpr, dpr); c.clearRect(0, 0, w, h);
      const fmt = opts.fmt || (v => String(Math.round(v))), L = 52, R = 8, T = 8, B = 16;
      const vs = pts.map(p => p.v).filter(v => v !== null && v !== undefined);
      if (!vs.length) { c.fillStyle = '#7a6f62'; c.font = '11px sans-serif'; c.fillText('データ待ち', 6, h / 2); return; }
      let min = Math.min(...vs), max = Math.max(...vs); if (opts.zero !== false) min = Math.min(0, min); if (max - min < 1e-9) { max = min + 1; }
      const raw = (max - min) / 3, pw = Math.pow(10, Math.floor(Math.log10(raw))), st = [1, 2, 2.5, 5, 10].map(m => m * pw).find(v => v >= raw) || raw;
      const lo = Math.floor(min / st) * st, hi = Math.ceil(max / st) * st;
      const n = pts.length, x = i => L + (w - L - R) * (n === 1 ? 0.5 : i / (n - 1)), y = v => T + (h - T - B) * (1 - (v - lo) / (hi - lo));
      c.font = '10px sans-serif'; c.textBaseline = 'middle'; c.textAlign = 'right';
      for (let v = lo; v <= hi + st * 0.01; v += st) { c.strokeStyle = v === 0 ? '#bdb3a2' : '#e6dfd0'; c.lineWidth = 1; c.beginPath(); c.moveTo(L, y(v)); c.lineTo(w - R, y(v)); c.stroke(); c.fillStyle = '#7a6f62'; c.fillText(fmt(v), L - 4, y(v)); }
      c.textBaseline = 'alphabetic'; c.textAlign = 'center';
      const span = pts[n - 1].y - pts[0].y, xs = [1, 2, 5, 10, 20, 25, 50].find(v => span / v <= 5) || 50;
      let lastX = -99; for (let i = 0; i < n; i++) { if (pts[i].y % xs !== 0 && i !== 0) continue; const px = x(i); if (px - lastX < 34) continue; c.fillStyle = '#7a6f62'; c.fillText(String(pts[i].y), Math.min(Math.max(px, L + 10), w - R - 12), h - 3); c.strokeStyle = '#e6dfd0'; c.beginPath(); c.moveTo(px, T); c.lineTo(px, h - B); c.stroke(); lastX = px; }
      c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); let pen = false;
      pts.forEach((p, i) => { if (p.v === null || p.v === undefined) { pen = false; return; } pen ? c.lineTo(x(i), y(p.v)) : c.moveTo(x(i), y(p.v)); pen = true; }); c.stroke();
      if (n <= 40) { c.fillStyle = color; pts.forEach((p, i) => { if (p.v !== null && p.v !== undefined) { c.beginPath(); c.arc(x(i), y(p.v), 2.2, 0, 7); c.fill(); } }); }
      if (opts.note) { const i0 = pts.findIndex(p => p.v !== null && p.v !== undefined); if (i0 > 0) { c.fillStyle = '#7a6f62'; c.textAlign = 'left'; c.font = '10px sans-serif'; c.fillText(opts.note, Math.min(x(i0) + 4, w - 60), Math.max(y(pts[i0].v) - 6, 12)); } }
    },

    goal(s) {
      if (!s.flags.refineryRunning) return (Engine.constructing(s, 'refinery') || Engine.constructing(s, 'refineryLarge')) ? '目標：製油所の完成を待つ' : '目標：製油所を建てる（用地・蒸留塔・製品タンク込み）';
      for (let t = 3; t <= 6; t++) {
        if (Engine.tierUnlocked(s, t) || !Engine.tierDef(t)) continue;
        const p = Engine.tierProgress(s, t), d = Engine.tierDef(t);
        if (p.undefinedCond) break;
        const x = p.parts.find(q => !q.ok);
        if (!x) return `目標：${d.name}へ（条件達成。月末に解放）`;
        return `目標：${d.name}へ — ${x.label}${x.cur === undefined ? '' : (x.money ? ' ' + Engine.fmtMoney(x.cur) + ' / ' + Engine.fmtMoney(x.need) : ' ' + Engine.fmtNum(x.cur) + ' / ' + Engine.fmtNum(x.need))}`;
      }
      { const g = Engine.nodeGoal ? Engine.nodeGoal(s) : null; if (g) return g; }
      return '目標：精製品で稼ぎ、事業を広げる';
    }
  };

  function buildChrome(page) {
    const hdr = document.createElement('div'); hdr.id = 'hdr';
    hdr.innerHTML = `<div class="row"><div class="date" id="h-date"></div><div class="money" id="h-money"></div><button type="button" id="h-menu" aria-label="メニュー">☰</button></div>
      <div class="speed">${SPEEDS.map(sp => `<button data-sp="${sp}">${sp === 0 ? '⏸ 停止' : '▶' + (sp > 1 ? '×' + sp : ' 1倍')}</button>`).join('')}</div>
      <div class="goal" id="h-goal"></div>`;
    document.body.prepend(hdr);
    const menu = document.createElement('div'); menu.id = 'menu'; menu.style.display = 'none';
    menu.innerHTML = `<a href="#" id="m-company"><span>🏢</span><b id="m-cname"></b><span class="sub" style="font-size:11px">（変更）</span></a>` + MENU.map(m => `<a href="${m.href}"><span>${m.icon}</span>${m.label}</a>`).join('');
    const cn = menu.querySelector('#m-cname'); cn.textContent = Engine.companyName ? Engine.companyName(state) : '港町工業株式会社';
    menu.querySelector('#m-company').onclick = e => { e.preventDefault(); const cur = Engine.companyBase(state), v = prompt('会社名（〇〇工業株式会社の〇〇の部分。10文字まで）', cur); if (v === null) return; const r = Engine.setCompanyName(state, v); if (r.ok) { cn.textContent = Engine.companyName(state); UI.save(); UI.refresh(); UI.toast('社名を変更しました'); } else UI.toast(r.msg); };
    hdr.appendChild(menu);
    const mb = hdr.querySelector('#h-menu');
    mb.onclick = e => { e.stopPropagation(); menu.style.display = menu.style.display === 'none' ? 'block' : 'none'; };
    document.addEventListener('click', e => { if (menu.style.display !== 'none' && !menu.contains(e.target)) menu.style.display = 'none'; });
    hdr.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => UI.setSpeed(+b.dataset.sp));
    const nav = document.createElement('nav'); nav.id = 'nav';
    const isOn = n => n.href === page + '.html' || (n.alt || []).includes(page + '.html');
    nav.innerHTML = NAV.map(n => `<a href="${n.href}" class="${isOn(n) ? 'on' : ''}"${n.show && !n.show(state) && !isOn(n) ? ' style="display:none"' : ''}><span>${n.icon}</span>${n.label}</a>`).join('');
    document.body.appendChild(nav);
    const m = document.createElement('div'); m.id = 'modal'; m.innerHTML = '<div class="box"></div>';
    document.body.appendChild(m);
    const t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t);
    const main = document.querySelector('main');
    if (main) { const q = document.createElement('div'); q.id = 'queue'; main.prepend(q); }
  }

  // 全タブ共通の建設キュー
  function renderQueue(s) {
    const q = document.getElementById('queue');
    if (!q) return;
    if (!s.construction.length) { UI.html(q, ''); return; }
    const onMap = !!document.getElementById('townwrap'), all = s.construction.slice().sort((a, b) => a.daysLeft - b.daysLeft), shown = onMap ? all.slice(0, 3) : all;   // 町の地図の上では、残りの短い3件だけ（地図を隠さない）
    UI.html(q, `<div class="card"><div class="row"><h3>🚧 建設中 ${s.construction.length}件</h3>${onMap && all.length > shown.length ? `<span class="sub">ほか${all.length - shown.length}件</span>` : ''}</div>` +
      shown.map(c =>
        `<div class="qrow"><div class="row"><span>${Engine.constructionLabel(c, s)}</span><span class="sub">残り${Engine.fmtDuration(c.daysLeft)}</span></div>
        <div class="bar"><i style="width:${(1 - c.daysLeft / c.totalDays) * 100}%"></i></div></div>`).join('') + '</div>');
  }

  function updateHeader() {
    const s = state;
    document.getElementById('h-date').textContent = Engine.dateStr(s);
    const debt = Engine.totalDebt(s);
    UI.html('h-money', `資金 <b class="${s.cash < 0 ? 'bad' : ''}">${Engine.fmtMoney(s.cash)}</b><br>借入 ${Engine.fmtMoney(debt)}　⚓${Engine.daysToShipment(s)}日後`);
    document.querySelectorAll('#hdr [data-sp]').forEach(b => b.classList.toggle('on', +b.dataset.sp === s.speed));
    document.getElementById('h-goal').textContent = UI.goal(s);
    NAV.forEach(n => { if (!n.show) return; const a = document.querySelector(`#nav a[href="${n.href}"]`); if (a) a.style.display = (n.show(s) || a.classList.contains('on')) ? '' : 'none'; });
  }

  // 知らせ：modal のもの（最初の製油所の完成・目標の達成・留守中の報告）だけ、時間を止めてポップアップで出す。
  // ほかの出来事（相場のイベント・ノードの解放・解放権・大規模製油所など）は、時間を止めずに、画面の下にさっと出す（記録は経営画面のログに残る）
  function eventToast(ev) {
    let msg = ev.title;
    if (ev.effects) msg += ' ' + Object.entries(ev.effects).map(([k, v]) => `${GAME_DATA.resources[k].name}${v > 1 ? '↑' : '↓'}${Math.round(Math.abs(v - 1) * 100)}%`).join('・');
    else if (ev.text) msg += '：' + String(ev.text).replace(/<[^>]*>/g, '').slice(0, 36) + (String(ev.text).length > 36 ? '…' : '');
    UI.toast(msg, 3600);
  }
  function showPending() {
    if (modalOpen) return;
    while (state.pendingEvents.length && !state.pendingEvents[0].modal) eventToast(state.pendingEvents.shift());
    if (!state.pendingEvents.length) return;
    const ev = state.pendingEvents.shift();
    let html = `<p>${ev.text}</p>`;
    if (ev.effects) {
      html += '<p class="sub">' + Object.entries(ev.effects).map(([k, v]) =>
        `${GAME_DATA.resources[k].name} ${v > 1 ? '↑' : '↓'}${Math.round(Math.abs(v - 1) * 100)}%`).join('　') + `（約${ev.months}か月かけて元に戻る）</p>`;
    }
    if (ev.goal) UI.addRecord(ev.goal);   // 目標達成の記録（会社名つき）を、ブラウザに残す（セーブとは別のキー。新しいゲームを始めても消えない）
    UI.save();
    UI.modal(ev.title, html);
  }

  function loop() {
    const now = performance.now();
    const dt = now - lastT; lastT = now;
    if (state.speed > 0 && !modalOpen) {
      acc += dt * state.speed;
      const days = Math.floor(acc / DAY_MS);
      if (days > 0) {
        acc -= days * DAY_MS;
        const n = Math.min(days, 60), ran = Engine.advanceDays(state, n);
        if (ran < n || state.pendingEvents.some(e => e.modal)) { state.speed = 0; acc = 0; }
        dirty = true;
      }
    }
    if (state.pendingEvents.length && !modalOpen) showPending();
    if (dirty && !pressing) { updateHeader(); renderQueue(state); if (renderFn) renderFn(state); dirty = false; }
    if (now - lastSave > 3000) UI.save();
  }

  // 留守中の操業（設定ONのとき）：閉じていた時間ぶん1倍速で進め、決裁ポイントで止める
  function offlineCatchUp() {
    if (!state.settings.offline || !state.lastReal) return;
    const elapsed = Date.now() - state.lastReal;
    const days = Math.min(Math.floor(elapsed / DAY_MS), 360 * 5);
    if (days < 15) return;
    const before = { cash: state.cash, day: state.day };
    const ran = Engine.advanceDays(state, days);
    const gained = state.cash - before.cash;
    state.pendingEvents.unshift({
      title: '留守中の報告書', modal: true,
      text: `${Math.round(ran / 30 * 10) / 10}か月操業しました${ran < days ? '（決裁が必要な出来事で停止）' : ''}。資金は ${gained >= 0 ? '+' : ''}${Engine.fmtMoney(gained)}。`
    });
    UI.save();
  }

  try { if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register((location.pathname.indexOf('/pages/') >= 0 ? '../' : '') + 'sw.js'); } catch (e) {}

  window.UI = UI;
})();
