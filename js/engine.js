// 時間進行（1日単位のtick）と生産計算・建設・出荷・融資
// 1か月＝30日、1年＝360日の簡略暦。tickは画面に依存しないので、早送りや留守中の精算に何度でも回せる。
(function () {
  const D = () => window.GAME_DATA;
  const DAYS_PER_MONTH = 30, DAYS_PER_YEAR = 360;
  const PRODUCTS = ['gasoline', 'diesel', 'naphtha', 'heavy'];

  function emptyMonth() {
    return { revenue: {}, purchase: 0, opex: 0, fixed: 0, interest: 0, principal: 0, borrowed: 0, construction: 0, produced: {}, sold: {}, lostCrude: 0, refined: 0 };
  }
  const add = (obj, k, v) => { obj[k] = (obj[k] || 0) + v; };

  const Engine = {
    DAYS_PER_MONTH, DAYS_PER_YEAR, PRODUCTS,

    // ---------- 新規ゲーム ----------
    newGame(diffKey) {
      const diff = D().difficulties[diffKey];
      const s = {
        version: Save.VERSION, difficulty: diffKey, day: 0,
        cash: diff.cash, overdraft: 0, loans: {},
        inventory: {}, hold: {}, leases: {}, wells: [],
        buildings: {}, construction: [], portGrade: 0, plants: [], nextPlantId: 1, tiers: {},
        refinery: { mode: 'standard', runRate: 1, autoBuyCrude: false },
        month: emptyMonth(), history: [], shipments: [], log: [],
        stats: { totalRevenue: 0 }, flags: {},
        settings: { offline: false }, pendingEvents: []
      };
      for (const k in D().resources) { s.inventory[k] = 0; s.hold[k] = false; }
      for (const id in D().leases) {
        const L = D().leases[id];
        s.leases[id] = { owned: !!L.owned, revealed: !!L.owned };
      }
      for (const id in diff.loans) {
        const L = D().loans[id];
        s.loans[id] = { principal: diff.loans[id], monthly: diff.loans[id] / (L.years * 12) };
      }
      // 祖父から受け継いだ油井1本（築5年）と原油タンク1基
      s.wells.push({ lease: 'kitahama', builtDay: -5 * DAYS_PER_YEAR });
      s.buildings.crudeTank = 1;
      s.inventory.crude = 1500;
      Market.init(s);
      this.log(s, `「${diff.name}」で創業。祖父の油井1本と原油タンクを受け継いだ。`);
      return s;
    },

    // セーブを読んだ直後に呼ぶ。品目が増えても古いセーブでNaNが出ないよう、欠けた品目の在庫・出荷見送り・相場を補う
    // （buy / capacity などは s.inventory[k] が数値であることを前提にしている）
    normalize(s) {
      for (const k in D().resources) {
        if (s.inventory[k] === undefined) s.inventory[k] = 0;
        if (s.hold[k] === undefined) s.hold[k] = false;
      }
      Market.ensure(s);
      if (!s.plants) s.plants = [];
      if (!s.nextPlantId) s.nextPlantId = 1;
      if (!s.tiers) s.tiers = {};
      if (s.contracts) for (const k in s.contracts) { const c = s.contracts[k]; if (!this.contractCfg(k) || !c || !(c.qty >= 0)) delete s.contracts[k]; else { c.delivered = c.delivered || 0; c.start = c.start || 0; c.months = c.months || 0; c.ending = !!c.ending; } }
      if (s.oreYards || s.construction.some(c => c.type === 'oreYard')) {   // 貯鉱場（鉱石でない・棟数が不正なものは外す）
        const OR = D().buildings.mine.ores, YM = this.yardCfg().max;
        if (!s.oreYards || typeof s.oreYards !== 'object') s.oreYards = {};
        for (const k in s.oreYards) { const n = s.oreYards[k]; if (!OR[k] || !(n >= 1)) delete s.oreYards[k]; else s.oreYards[k] = Math.min(YM, Math.floor(n)); }
        s.construction = s.construction.filter(c => c.type !== 'oreYard' || OR[c.res]);
      }
      if (s.mines || s.mineSites || s.construction.some(c => c.type === 'mine')) {   // 鉱山（データに無い鉱区は外す）
        const MS = this.mineSites();
        s.mines = (Array.isArray(s.mines) ? s.mines : []).filter(m => m && MS[m.site] && isFinite(m.builtDay));
        if (!s.mineSites || typeof s.mineSites !== 'object') s.mineSites = {};
        for (const id in s.mineSites) if (!MS[id]) delete s.mineSites[id];
        s.construction = s.construction.filter(c => c.type !== 'mine' || (MS[c.site] && s.mineSites[c.site] && s.mineSites[c.site].owned));
      }
      if (s.power && !(D().power && D().power.fuels[s.power.fuel])) s.power.fuel = 'heavy';
      // 研究（開始するまで s.research は無い。あれば欠けた項目を補い、データに無い研究は進行中から外す）
      if (s.research) {
        const RS = D().research || {};
        if (!s.research.done) s.research.done = {};
        const a = s.research.active;
        if (a) {
          if (!RS[a.id] || s.research.done[a.id]) s.research.active = null;
          else { if (!(a.months >= 0)) a.months = 0; a.paused = !!a.paused; if (!(a.accel >= 1)) a.accel = 1; }
        }
      }
      // データからレシピが消えていたら先頭のレシピに戻す
      for (const p of s.plants) {
        const pd = this.plantDef(p);
        if (pd && (!pd.recipes.includes(p.recipe) || !this.recipeUnlocked(s, p.recipe))) p.recipe = pd.recipes.find(id => this.recipeUnlocked(s, id)) || pd.recipes[0];
      }
      return s;
    },

    // 本部別の実績の計上（s.month.seg に遅延で足す）。seg が無ければ 'corp'（全社）。f = rev|tin|tout|purchase|opex|fixed|research|penalty
    // rev=市場への売上、tout=他の本部へ使わせた分（社内売上）、tin=他の本部から使った分（社内仕入）。社内取引は市場の中値で、生産側と消費側に同額
    pl(s, seg, f, v) {
      if (!v) return;
      const m = s.month, t = m.seg || (m.seg = {}), k = seg || 'corp', o = t[k] || (t[k] = {});
      o[f] = (o[f] || 0) + v;
    },

    // 月の本部別の実績を履歴用に丸める（セント単位、0の項目は省く）
    roundSegPL(seg) {
      const out = {};
      for (const k in seg || {}) { const o = {}; for (const f in seg[k]) { const v = Math.round(seg[k][f] * 100) / 100; if (v !== 0) o[f] = v; } if (Object.keys(o).length) out[k] = o; }
      return out;
    },
    // 本部の損益（履歴の直近 n か月の合計）。rev+tout−tin−purchase−opex−fixed−research
    segmentPL(s, n) {
      const out = {};
      for (const h of s.history.slice(-n)) for (const k in h.segPL || {}) {
        const o = out[k] || (out[k] = { rev: 0, tout: 0, tin: 0, purchase: 0, opex: 0, fixed: 0, research: 0, penalty: 0 });
        for (const f in h.segPL[k]) o[f] = (o[f] || 0) + h.segPL[k][f];
      }
      for (const k in out) { const o = out[k]; o.profit = o.rev + o.tout - o.tin - o.purchase - o.opex - o.fixed - o.research - o.penalty; }
      Object.defineProperty(out, 'months', { value: s.history.slice(-n).filter(h => h.segPL).length, enumerable: false });   // 集計できた月数（古いセーブや導入直後は n に満たない）
      return out;
    },

    // ---------- 取引先（契約。data/resources.js の GAME_DATA.contracts） ----------
    contractCfg(k) { const C = D().contracts; return (C && C.items && C.items[k]) || null; },
    contractItems() { const C = D().contracts; return C && C.items ? Object.keys(C.items).filter(k => D().resources[k]) : []; },
    contractPeriod(k) { const cfg = this.contractCfg(k); return (cfg && cfg.period) || 1; },
    // いまの1期間の産出（その品目を出力する加工設備の日量×30×期間の月数）
    contractCapacity(s, k) {
      let c = 0;
      for (const p of s.plants || []) { const rec = D().recipes[p.recipe], def = this.plantDef(p); if (rec && def && rec.outputs && rec.outputs[k]) c += this.plantCapOf(p) * (p.runRate === undefined ? 1 : p.runRate) * rec.outputs[k] * DAYS_PER_MONTH * this.contractPeriod(k); }   // 稼働率を下げた設備はその分だけ
      return c;
    },
    // 期間のノルマ＝産出（稼働率込み）×share を切り捨て。期間の途中で設備を減らしても、その期のノルマは変わらない
    contractQuota(s, k) {
      const cfg = this.contractCfg(k); if (!cfg) return 0;
      const cap = this.contractCapacity(s, k); let q = cap * cfg.share;
      q = Math.floor(q + 1e-9);   // 整数品目も同じ（産出×share が1に満たなければ契約できない＝設備を増やす）
      return q;
    },
    contractPrice(s, k) { const cfg = this.contractCfg(k); return cfg ? Market.priceNoSat(s, k) * (1 + cfg.premium) : 0; },
    contractLockReason(s, k) {
      const cfg = this.contractCfg(k); if (!cfg) return 'この品目は契約できない';
      if (cfg.research && !this.researchDone(s, cfg.research)) return `研究「${this.researchName(cfg.research)}」が必要`;
      if (this.contractCapacity(s, k) <= 0) return `${D().resources[k].name}を作る設備がない`;
      if (this.contractQuota(s, k) < 1) return '産出が少なすぎて契約できない';
      return null;
    },
    // 契約する。翌月から納品が始まる（契約月は納品も違約もない）。解約予約中に押すと予約を取り消す
    signContract(s, k) {
      const why = this.contractLockReason(s, k); if (why) return { ok: false, msg: why };
      const c = s.contracts && s.contracts[k];
      if (c) { if (!c.ending) return { ok: false, msg: 'すでに契約している' }; c.ending = false; return { ok: true }; }
      if (!s.contracts) s.contracts = {};
      s.contracts[k] = { start: Math.ceil(s.day / DAYS_PER_MONTH) * DAYS_PER_MONTH, qty: this.contractQuota(s, k), delivered: 0, months: 0, ending: false };
      this.log(s, `🤝 ${D().resources[k].name}の取引先と契約（${this.contractPeriod(k) > 1 ? this.contractPeriod(k) + 'か月' : '月'}${this.fmtNum(s.contracts[k].qty)}${D().resources[k].unit}、市場より+${Math.round(this.contractCfg(k).premium * 100)}%。翌月から）`);
      return { ok: true };
    },
    // 解約：その期間の末に有効（その期間のノルマと違約金はそのまま）。まだ始まっていなければ取り消し
    cancelContract(s, k) {
      const c = s.contracts && s.contracts[k]; if (!c) return { ok: false, msg: '契約していない' };
      if (s.day <= c.start) { delete s.contracts[k]; if (!Object.keys(s.contracts).length) delete s.contracts; return { ok: true }; }
      c.ending = true; return { ok: true };
    },
    // 月末：不足分の違約金を現金から引き、解約の反映とノルマの更新をする
    contractMonth(s) {
      const m = s.month;
      for (const k in s.contracts) {
        const c = s.contracts[k], cfg = this.contractCfg(k), R = D().resources[k];
        if (!cfg || !R) { delete s.contracts[k]; continue; }
        if (s.day <= c.start) { c.qty = this.contractQuota(s, k); c.delivered = 0; c.months = 0; continue; }   // 契約月：翌月から期間が始まる
        c.months = (c.months || 0) + 1;
        if (c.months < this.contractPeriod(k)) continue;
        {
          const short = Math.max(0, c.qty - c.delivered);
          if (short > 1e-6) {
            const pen = short * this.contractPrice(s, k) * cfg.penaltyRate;
            s.cash -= pen; m.penalty = (m.penalty || 0) + pen; this.pl(s, this.segmentOfItem(k), 'penalty', pen);
            this.log(s, `⚠️ ${R.name}の納入が不足（${this.fmtNum(c.delivered)}/${this.fmtNum(c.qty)}${R.unit}）→ 違約金 ${this.fmtMoney(pen)}`);
          }
        }
        if (c.ending) { delete s.contracts[k]; this.log(s, `🤝 ${R.name}の契約を終了`); continue; }
        const q = this.contractQuota(s, k);
        if (q < 1) { delete s.contracts[k]; this.log(s, `🤝 ${R.name}を作る設備が無くなったので契約を終了`); continue; }
        c.qty = q; c.delivered = 0; c.months = 0;
      }
      if (!Object.keys(s.contracts).length) delete s.contracts;
    },

    // ---------- 拠点マップ（data/map.js。s.map は町のページを開く・位置を指定して建てるときまで作らない） ----------
    // s.map = { placed: { key: {type,x,y} }, seq: { type: 連番 } }。key は 'type#連番'。建設中の設備も construction[].key で同じ key を持つ
    mapCfg() { return D().map || null; },
    // 町の地図に出さない建物（採掘地ページの建物）
    offMap(type) { const b = D().buildings[type]; return type === 'oilWell' || !b || !!b.needsSite || !!b.offMap; },
    mapTypes() { return Object.keys(D().buildings).filter(t => !this.offMap(t)); },
    // 足あと [x方向, y方向]。rot＝向き（0〜3、90°ずつ。奇数で縦横が入れ替わる）。増設モジュールは親の種類ごとに大きさが違う（map.js の moduleFootprint）
    footprintOf(type, rot, parentType) {
      const M = this.mapCfg(), f = M && M.footprint;
      const fp = (type === 'module' && parentType && M && M.moduleFootprint && M.moduleFootprint[parentType]) || (f && (f[type] || f.default)) || [3, 3];
      return (rot & 1) ? [fp[1], fp[0]] : fp;
    },
    // 置いた建物（s.map.placed の要素）の足あと。向きと、モジュールなら親の種類を反映
    placedFootprint(s, q) { const pp = q.parent && s.map && s.map.placed[q.parent]; return this.footprintOf(q.type, q.rot || 0, pp ? pp.type : null); },
    // 向きを選べる種類か（造船所は海側が決まっていて、研究棟は敷地に重ねるので不可。絵が4方向そろっていない種類も不可＝map.js の noRotate）
    canRotate(type) { const M = this.mapCfg(); return !!M && !this.seaFrontCfg(type) && !this.stackCfg(type) && !(M.noRotate && M.noRotate[type]) && type !== 'module'; },
    cleanRot(type, rot) { return this.canRotate(type) ? (((rot | 0) % 4) + 4) % 4 : 0; },
    // 加工設備の周囲に空けておく幅（増設モジュールを隣に置けるように。モジュールの大きい方の辺）
    // 区画（道路で囲まれた block-1 マス）に収まる範囲まで（製鉄所は区画 15 に対して 12 なので残りの 3）
    moduleGap(type) { const M = this.mapCfg(), mf = M && M.moduleFootprint && M.moduleFootprint[type], fp = this.footprintOf(type), room = M ? (M.block - 1) - Math.max(fp[0], fp[1]) : 2; return Math.max(2, Math.min(mf ? Math.max(mf[0], mf[1]) : 2, room)); },
    coastY(x) { const M = this.mapCfg(), c = (M && M.coast) || { base: 26, a1: 2.5, a2: 1.5 }; return Math.round(c.base + c.a1 * Math.sin(x * 0.35) + c.a2 * Math.sin(x * 0.13 + 1)); },
    // タイルの地形：'land'|'road'|'port'|'sea'（範囲外は null）
    terrainAt(s, x, y) {
      const M = this.mapCfg(); if (!M || x < 0 || y < 0 || x >= M.w || y >= M.h) return null;
      const coast = this.coastY(x), inPort = x >= M.port.x0 && x <= M.port.x1, rec = inPort ? 0 : (s.map && s.map.reclaim) || 0;
      if (y >= coast + rec) return 'sea';
      if (rec && y >= coast && this.inSeaFront(s, x, y)) return 'sea';   // 造船所の開口部の前は、埋め立てても海のまま
      if (inPort && y >= this.portTop()) return 'port';
      if (x % M.block === M.block - 1 || y % M.block === M.block - 1) return 'road';
      return 'land';
    },
    // 海に隣接して建てる設備の条件（data/map.js の seaFront）。なければ null
    seaFrontCfg(type) {
      const M = this.mapCfg(), c = M && M.seaFront && M.seaFront[type]; if (!c) return null;
      const [fw, fd] = this.footprintOf(type);   // 足あとより大きい設定でも矛盾しないように丸める
      return { mouth: Math.min(c.mouth, fd), open: Math.min(c.open, fw) };
    },
    // 敷地に重ねて建てる設備（data/map.js の stackable）。重ねられる最大段数。なければ null
    stackCfg(type) { const M = this.mapCfg(); return (M && M.stackable && M.stackable[type]) || null; },
    // その種類が置かれている敷地の key（重ねる先）。なければ null
    stackSite(s, type) { const placed = (s.map && s.map.placed) || {}; for (const k in placed) if (placed[k].type === type) return k; return null; },
    // 置いた造船所などの開口部の前（足あとの幅 × 海側の mouth 行より先）か
    inSeaFront(s, x, y) {
      const placed = (s.map && s.map.placed) || {};
      for (const k in placed) {
        const q = placed[k], cfg = this.seaFrontCfg(q.type); if (!cfg) continue;
        const [fw, fd] = this.placedFootprint(s, q);
        if (x >= q.x && x < q.x + fw && y >= q.y + fd - cfg.mouth) return true;
      }
      return false;
    },
    // 港の予約地の上端（予約地は矩形：港の列のいちばん浅い海岸線から depth タイル手前から海岸まで）
    portTop() { const M = this.mapCfg(); let c = Infinity; for (let x = M.port.x0; x <= M.port.x1; x++) c = Math.min(c, this.coastY(x)); return c - M.port.depth; },
    ensureMap(s) {
      const M = this.mapCfg();
      if (!s.map) s.map = { placed: {}, seq: {}, layoutVer: M ? M.layoutVer : 0 };
      const m = s.map; if (!m.placed) m.placed = {}; if (!m.seq) m.seq = {}; if (!(m.reclaim >= 0)) m.reclaim = 0;
      // 足あと・マップの大きさが変わった（layoutVer が違う）：置き場所を全部置き直す。手で置いた位置は失われるが、建設中・稼働中・増設モジュールの数は保つ
      let relayout = false;
      if (M && m.layoutVer !== M.layoutVer) {
        relayout = true; m.placed = {}; m.seq = {}; m.layoutVer = M.layoutVer;   // 埋め立ての行数（m.reclaim）は保つ
        for (const c of s.construction) delete c.key;
        for (const p of s.plants) delete p.key;
      }
      for (const k of Object.keys(m.placed)) { const q = m.placed[k]; if (!q || typeof q !== 'object') { delete m.placed[k]; continue; }
        const par = q.type === 'module' && q.parent && m.placed[q.parent], r = q.type === 'module' ? (par ? this.cleanRot(par.type, par.rot) : 0) : this.cleanRot(q.type, q.rot);   // 向きを 0〜3 の整数にそろえる（回せない種類は 0、モジュールは親と同じ）
        if (r) q.rot = r; else delete q.rot; }
      for (const c of s.construction) if (c.key && !m.placed[c.key]) delete c.key;   // 地図が壊れていても振り直せるように
      for (const p of s.plants) if (p.key && !m.placed[p.key]) delete p.key;
      // 親の設備が無い増設モジュールの置き場所は消す（p.modules は経済の値としてそのまま）。key の連番は既存の最大より後ろにそろえる
      for (const k of Object.keys(m.placed)) { const q = m.placed[k]; if (q.type === 'module' && !(q.parent && m.placed[q.parent] && s.plants.some(p => p.key === q.parent))) { if (!s.construction.some(c => c.key === k)) delete m.placed[k]; } }
      for (const k of Object.keys(m.placed)) { const mm = /^(.+)#(\d+)$/.exec(k); if (mm && (m.seq[mm[1]] || 0) < +mm[2]) m.seq[mm[1]] = +mm[2]; }
      for (const type of this.mapTypes()) {
        // 位置の無い建設中の設備に key と場所を与える（旧セーブ・自動配置で建てたもの）
        const stack = this.stackCfg(type);
        if (stack) {   // 重ねて建てる設備の敷地は1つだけ。古いセーブで余った敷地は（建設中のものを除いて）消す
          const sites = Object.keys(m.placed).filter(k => m.placed[k].type === type);
          if (sites.length > 1) { const used = new Set(s.construction.map(c => c.key).filter(Boolean)); const keep = sites.find(k => used.has(k)) || sites[0]; for (const k of sites) if (k !== keep && !used.has(k)) delete m.placed[k]; }
        }
        for (const c of s.construction) if (c.type === type && !c.key) { const k = (stack && this.stackSite(s, type)) || this.placeAuto(s, type); if (k) c.key = k; }
        const busy = new Set(s.construction.map(c => c.key).filter(Boolean));
        if (stack && (s.buildings[type] || 0) > 0) for (const k of Object.keys(m.placed)) if (m.placed[k].type === type) busy.delete(k);   // 完成した棟があれば、増築中でも敷地は「置き済み」
        const done = Object.keys(m.placed).filter(k => m.placed[k].type === type && !busy.has(k));
        const want = stack ? Math.min(1, s.buildings[type] || 0) : (s.buildings[type] || 0);   // 重ねて建てる設備は敷地を1つだけ
        for (let i = done.length; i < want; i++) { const k = this.placeAuto(s, type); if (!k) break; done.push(k); }
        // 加工設備に key を結びつける
        const claimed = new Set(s.plants.map(p => p.key).filter(Boolean));
        const free = done.filter(k => !claimed.has(k));
        for (const p of s.plants) if (p.type === type && !p.key && free.length) p.key = free.shift();
      }
      if (relayout) {   // 増設モジュール（完成済みと建設中）を、親の設備の隣に置き直す
        for (const p of s.plants) for (let i = 0; i < (p.modules || 0); i++) { const sp = this.moduleSpot(s, p); if (!sp) break; m.placed[this.newKey(s, 'module')] = { type: 'module', x: sp.x, y: sp.y, parent: p.key }; }
        for (const c of s.construction) if (c.type === 'module' && !c.key) { const p = s.plants.find(q => q.id === c.plantId), sp = p && this.moduleSpot(s, p); if (sp) { c.key = this.newKey(s, 'module'); m.placed[c.key] = { type: 'module', x: sp.x, y: sp.y, parent: p.key }; } }
      }
      return m;
    },
    // 足あと全体が陸（道路・港・海でない）で、ほかの建物と重ならないか
    canPlace(s, type, x, y, occIn, rot, parentType) {
      const M = this.mapCfg(); if (!M) return { ok: false, msg: 'マップ未対応' };
      const [fw, fd] = this.footprintOf(type, type === 'module' ? rot : this.cleanRot(type, rot), parentType), occ = occIn || this.mapOccupancy(s), sf = this.seaFrontCfg(type);
      for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) {
        const t = this.terrainAt(s, x + i, y + j);
        if (t === null) return { ok: false, msg: 'マップの外' };
        if (t === 'sea' && !(sf && j >= fd - sf.mouth)) return { ok: false, msg: '海の上には建てられない（埋め立てが必要）' };
        if (t === 'road') return { ok: false, msg: '道路には建てられない' };
        if (t === 'port') return { ok: false, msg: '港の用地' };
        if (occ[(x + i) + ',' + (y + j)]) return { ok: false, msg: 'ほかの建物と重なる' };
      }
      if (sf) {   // 海に隣接：海側の端の中央 open マスが海であること（ドックの開口部）
        const c0 = x + Math.floor((fw - sf.open) / 2);
        for (let i = 0; i < sf.open; i++) if (this.terrainAt(s, c0 + i, y + fd - 1) !== 'sea') return { ok: false, msg: 'ドックの開口部（海側の端）が海に面していない。海岸に建てる' };
        for (let i = 0; i < fw; i++) for (let j = fd; y + j < M.h; j++) if (occ[(x + i) + ',' + (y + j)]) return { ok: false, msg: 'ドックの開口部の前に建物がある' };   // 開口部の前（足あとの幅）は海のまま空けておく
      }
      return { ok: true };
    },
    mapOccupancy(s) {
      const occ = {};
      for (const k in (s.map && s.map.placed) || {}) { const p = s.map.placed[k], [fw, fd] = this.placedFootprint(s, p); for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) occ[(p.x + i) + ',' + (p.y + j)] = k; }
      return occ;
    },
    newKey(s, type) { const m = s.map; m.seq[type] = (m.seq[type] || 0) + 1; return type + '#' + m.seq[type]; },
    // 自動配置：アンカーに近い空きから詰める。置けたら key、置けなければ null
    // near 付近（省略するとアンカー）で置ける一番近い場所
    findSpot(s, type, near, rot) {
      const M = this.mapCfg(); if (!M) return null;
      const n = near || M.anchor, W = M.w, H = M.h, [fw, fd] = this.footprintOf(type, this.cleanRot(type, rot)), isPlant = !!(D().plants && D().plants[type]), AP = isPlant ? this.moduleGap(type) : 2;
      // 積分画像（1タイルずつ数えると大きな足あとで遅いので、長方形の合計をO(1)で引く）：blk＝陸でない・建物がある、occ＝建物がある、res＝加工設備の周囲（増設モジュール用に空けておく）
      const mk = () => new Int32Array((W + 1) * (H + 1)), I1 = mk(), I2 = mk(), I3 = mk(), IB = mk(), IS = mk(), sf = this.seaFrontCfg(type);
      const G1 = new Uint8Array(W * H), G2 = new Uint8Array(W * H), G3 = new Uint8Array(W * H), GB = new Uint8Array(W * H), GS = new Uint8Array(W * H), placedAll = (s.map && s.map.placed) || {};
      for (const k in placedAll) {
        const q = placedAll[k], [w, d] = this.placedFootprint(s, q), plant = !!(D().plants && D().plants[q.type]), apq = plant ? this.moduleGap(q.type) : 2;
        for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { const x = q.x + i, y = q.y + j; if (x >= 0 && y >= 0 && x < W && y < H) G2[y * W + x] = 1; }
        if (plant) for (let i = -apq; i < w + apq; i++) for (let j = -apq; j < d + apq; j++) { const x = q.x + i, y = q.y + j; if (x >= 0 && y >= 0 && x < W && y < H) G3[y * W + x] = 1; }
      }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const tt = this.terrainAt(s, x, y);
        G1[y * W + x] = (G2[y * W + x] || tt !== 'land') ? 1 : 0;
        if (sf) { GB[y * W + x] = (G2[y * W + x] || (tt !== 'land' && tt !== 'sea')) ? 1 : 0; GS[y * W + x] = tt === 'sea' ? 0 : 1; }   // 海に隣接する設備：海側の行は海でもよい／開口部の行は海
      }
      const build = (G, Iv) => { for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += G[y * W + x]; Iv[(y + 1) * (W + 1) + x + 1] = Iv[y * (W + 1) + x + 1] + row; } } };
      build(G1, I1); build(G2, I2); build(G3, I3); if (sf) { build(GB, IB); build(GS, IS); }
      const rect = (Iv, x0, y0, x1, y1) => { x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(W, x1); y1 = Math.min(H, y1); if (x1 <= x0 || y1 <= y0) return 0; return Iv[y1 * (W + 1) + x1] - Iv[y0 * (W + 1) + x1] - Iv[y1 * (W + 1) + x0] + Iv[y0 * (W + 1) + x0]; };
      for (const strict of [true, false]) {
        let best = null, bd = Infinity;
        for (let y = 0; y + fd <= H; y++) for (let x = 0; x + fw <= W; x++) {
          const d = Math.abs(x - n.x) + Math.abs(y - n.y) * 1.3;
          if (d >= bd) continue;
          if (sf) {
            if (rect(I1, x, y, x + fw, y + fd - sf.mouth) || rect(IB, x, y + fd - sf.mouth, x + fw, y + fd)) continue;
            const c0 = x + Math.floor((fw - sf.open) / 2);
            if (rect(IS, c0, y + fd - 1, c0 + sf.open, y + fd)) continue;
            if (rect(I2, x, y + fd, x + fw, H)) continue;   // 開口部の前に建物がある
          } else if (rect(I1, x, y, x + fw, y + fd)) continue;
          if (strict && (rect(I3, x, y, x + fw, y + fd) || (isPlant && rect(I2, x - AP, y - AP, x + fw + AP, y + fd + AP)))) continue;
          best = { x, y }; bd = d;
        }
        if (best) return best;
      }
      return null;
    },

    placeAuto(s, type) {
      const M = this.mapCfg(); let best = this.findSpot(s, type);
      while (!best && s.map.reclaim < M.reclaimMax) { s.map.reclaim++; best = this.findSpot(s, type); }
      if (!best) return null;
      const k = this.newKey(s, type); s.map.placed[k] = { type, x: best.x, y: best.y };
      return k;
    },
    // 町の建物の一覧（描画・タップ用）
    reclaimCost(s) { const M = this.mapCfg(); return Math.round(M.reclaimCostPerRow * this.priceIndex(s)); },
    canReclaim(s) {
      const M = this.mapCfg(); if (!M) return { ok: false, msg: 'マップ未対応' };
      if (((s.map && s.map.reclaim) || 0) >= M.reclaimMax) return { ok: false, msg: 'これ以上は埋め立てられない' };
      const cost = this.reclaimCost(s); if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    // 海岸線を1行（全幅）広げる。費用は設備と同じ建設費の欄（港の前は海のまま）
    reclaim(s) {
      const chk = this.canReclaim(s); if (!chk.ok) return chk;
      this.ensureMap(s); s.cash -= chk.cost; s.month.construction += chk.cost; s.map.reclaim++;
      this.log(s, `🏗️ 埋め立てで用地を広げた（${this.fmtMoney(chk.cost)}）`);
      return { ok: true };
    },
    // ---------- 増設モジュール（加工設備の隣に置き、日量を増やす） ----------
    // 設備の向き（増設モジュールは親と同じ向きで置く）
    parentRot(s, p) { const q = s.map && p.key && s.map.placed[p.key]; return (q && q.rot) || 0; },
    moduleCost(s, p) { return Math.round(D().buildings[p.type].cost * this.moduleCfg().costMul * this.priceIndex(s)); },
    moduleCount(s, p) { return (p.modules || 0) + s.construction.filter(c => c.type === 'module' && c.plantId === p.id).length; },
    // 設備（本体＋置いたモジュール）の足あとの一覧
    plantRects(s, p) {
      const out = [], m = s.map; if (!m) return out;
      const rect = k => { const q = m.placed[k]; if (q) { const f = this.placedFootprint(s, q); out.push({ x: q.x, y: q.y, w: f[0], d: f[1] }); } };
      if (p.key) rect(p.key);
      for (const k of Object.keys(m.placed)) if (m.placed[k].parent === p.key) rect(k);
      return out;
    },
    canPlaceModule(s, p, x, y, occ) {
      if (!this.moduleCfg() || !this.plantDef(p) || !this.hasModule(p.type)) return { ok: false, msg: 'モジュールを置けない設備' };
      if (this.moduleCount(s, p) >= this.moduleCfg().max) return { ok: false, msg: `増設モジュールは最大${this.moduleCfg().max}個` };
      this.ensureMap(s);
      const prot = this.parentRot(s, p), pc = this.canPlace(s, 'module', x, y, occ, prot, p.type); if (!pc.ok) return pc;
      const [w, d] = this.footprintOf('module', prot, p.type), rects = this.plantRects(s, p);
      const touch = rects.some(r => ((x + w === r.x || r.x + r.w === x) && y < r.y + r.d && r.y < y + d) || ((y + d === r.y || r.y + r.d === y) && x < r.x + r.w && r.x < x + w));
      return touch ? { ok: true } : { ok: false, msg: '設備に隣接して置く' };
    },
    // 設備の近くで置ける一番近い場所
    findModuleSpot(s, p) { this.ensureMap(s); return this.moduleSpot(s, p); },
    // 隣に置ける一番近い場所（個数の上限は見ない。置き直しにも使う）
    moduleSpot(s, p) {
      const M = this.mapCfg(); if (!M) return null; const r0 = this.plantRects(s, p)[0]; if (!r0) return null;
      const prot = this.parentRot(s, p), occ = this.mapOccupancy(s), [w, d] = this.footprintOf('module', prot, p.type), rects = this.plantRects(s, p); let best = null, bd = Infinity;
      for (let y = Math.max(0, r0.y - d - 1); y < Math.min(M.h, r0.y + r0.d + d + 2); y++) for (let x = Math.max(0, r0.x - w - 1); x < Math.min(M.w, r0.x + r0.w + w + 2); x++) {
        const dd = Math.abs(x - r0.x) + Math.abs(y - r0.y); if (dd >= bd) continue;
        if (!this.canPlace(s, 'module', x, y, occ, prot, p.type).ok) continue;
        if (rects.some(r => ((x + w === r.x || r.x + r.w === x) && y < r.y + r.d && r.y < y + d) || ((y + d === r.y || r.y + r.d === y) && x < r.x + r.w && r.x < x + w))) { best = { x, y }; bd = dd; }
      }
      return best;
    },
    canBuildModule(s, p) {
      if (!p) return { ok: false, msg: '設備がない' };
      if (!this.moduleCfg() || !this.plantDef(p) || !this.hasModule(p.type)) return { ok: false, msg: 'モジュールを置けない設備' };
      if (this.moduleCount(s, p) >= this.moduleCfg().max) return { ok: false, msg: `増設モジュールは最大${this.moduleCfg().max}個` };
      const cost = this.moduleCost(s, p); if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    buildModule(s, plantId, pos) {
      const p = s.plants.find(q => q.id === plantId), chk = this.canBuildModule(s, p); if (!chk.ok) return chk;
      if (!pos) { pos = this.findModuleSpot(s, p); if (!pos) return { ok: false, msg: '隣に置ける場所がない' }; }
      const pc = this.canPlaceModule(s, p, pos.x, pos.y); if (!pc.ok) return pc;
      const B = D().buildings[p.type], MC = this.moduleCfg(), days = Math.max(3, Math.round(B.months * MC.monthsMul)) * DAYS_PER_MONTH;
      s.cash -= chk.cost; s.month.construction += chk.cost;
      const key = this.newKey(s, 'module'); s.map.placed[key] = { type: 'module', x: pos.x, y: pos.y, parent: p.key }; if (this.parentRot(s, p)) s.map.placed[key].rot = this.parentRot(s, p);
      s.construction.push({ type: 'module', plantId: p.id, daysLeft: days, totalDays: days, key });
      this.log(s, `🚧 ${B.name}の増設モジュールの建設を開始（${this.fmtMoney(chk.cost)}、${Math.round(days / DAYS_PER_MONTH)}か月）`);
      return { ok: true };
    },
    mapEntities(s) {
      if (!s.map) this.ensureMap(s);
      const out = [];
      for (const key in s.map.placed) {
        const p = s.map.placed[key], c = s.construction.find(q => q.key === key), [fw, fd] = this.placedFootprint(s, p), stack = this.stackCfg(p.type), lv = stack ? Math.min(stack, s.buildings[p.type] || 0) : 0;
        out.push({ key, type: p.type, level: stack ? lv : undefined, upgrading: !!(stack && c && lv > 0), parent: p.parent || null, parentType: p.parent && s.map.placed[p.parent] ? s.map.placed[p.parent].type : null, x: p.x, y: p.y, rot: p.rot || 0, fw, fd, building: stack ? (!!c && lv === 0) : !!c, progress: c ? Math.max(0, Math.min(1, 1 - c.daysLeft / (c.totalDays || c.daysLeft || 1))) : 1, daysLeft: c ? c.daysLeft : 0, plant: s.plants.find(q => q.key === key) || null });
      }
      return out;
    },

    // ---------- 本部（表示用の分類。data/segments.js） ----------
    segmentIds() { return (D().segmentOrder || []).filter(id => D().segments[id]); },
    segmentOfItem(k) { return ((D().segmentOf || {}).resources || {})[k] || null; },
    segmentOfBuilding(type) { return ((D().segmentOf || {}).buildings || {})[type] || null; },
    // 本部名（石油本部は化学プラントを建てたら石化本部に変わる）
    segmentName(s, id) {
      const d = D().segments[id]; if (!d) return id;
      if (d.fullName && d.fullWhen && d.fullWhen.building && (this.count(s, d.fullWhen.building) > 0 || this.constructing(s, d.fullWhen.building) > 0)) return d.fullName;
      return d.name;
    },

    // ---------- 技術ティア ----------
    tierDef(t) { return (D().tiers || {})[t] || null; },
    tierName(t) { const d = this.tierDef(t); return d ? d.name : `ティア${t}`; },
    tierUnlocked(s, t) { return t <= 2 || !!(s.tiers && s.tiers[t]); },
    // レシピ単位の解放（rec.tier が無ければ設備と同じ＝常に選べる）。設備のティアより後に解放するレシピ（製鋼所の合金など）用
    recipeLockReason(s, id) {
      const rec = D().recipes[id]; if (!rec) return '不明なレシピ';
      if (rec.tier && !this.tierUnlocked(s, rec.tier)) return `${this.tierName(rec.tier)}になると選べる`;
      if (rec.research && !this.researchDone(s, rec.research)) return `研究「${this.researchName(rec.research)}」が必要`;
      return null;
    },
    recipeUnlocked(s, id) { return this.recipeLockReason(s, id) === null; },
    // 設備の建設の解放（ティアと研究）。解放済みなら null、そうでなければ理由
    buildLockReason(s, type) {
      const b = D().buildings[type]; if (!b) return '不明な設備';
      if (b.tier && !this.tierUnlocked(s, b.tier)) return `${this.tierName(b.tier)}になると建てられる`;
      if (b.research && !this.researchDone(s, b.research)) return `研究「${this.researchName(b.research)}」が必要`;
      return null;
    },

    // ---------- 電力・自家発電（段階3b） ----------
    // 自家発電所は、今日の電力需要（加工設備のレシピの energyShare から出る MWh）の範囲で発電し、発電量×送電単価×物価指数を現金で払い戻す
    // （加工設備は従来どおり電力分を含めて全額払うので、発電所が無ければ計算は変わらない）。燃料は在庫から燃やす（足りなければ発電が減る。自動購入ONなら市場で買う）
    powerCapacity(s) { return this.count(s, 'powerPlant') * D().power.plantMWh; },
    settlePower(s, idx, demand) {
      const n = this.count(s, 'powerPlant'); if (!n) return;
      const PW = D().power, pw = s.power || (s.power = { fuel: 'heavy', autoBuy: false, gen: 0 });
      const f = PW.fuels[pw.fuel], k = pw.fuel; if (!f) return;
      if (demand > 0) pw.demand = demand;   // 直近の（0でない）電力需要。燃料の確保量に使う
      let gen = Math.min(demand, n * PW.plantMWh);
      const inv0 = s.inventory[k];
      if (pw.autoBuy && D().resources[k].canBuy && gen * f.perMWh > inv0 + 1e-12) this.buy(s, k, gen * f.perMWh - inv0, true, { ignoreSpace: true, seg: 'corp' });
      gen = Math.min(gen, s.inventory[k] / f.perMWh);
      if (!(gen > 1e-9)) { pw.gen = 0; return; }
      const burn = gen * f.perMWh; s.inventory[k] -= burn; pw.gen = gen;
      const iseg = this.segmentOfItem(k);
      if (iseg && iseg !== 'corp') { const v = Math.min(burn, inv0) * Market.price(s, k); this.pl(s, iseg, 'tout', v); this.pl(s, 'corp', 'tin', v); }   // 在庫から使った燃料は社内取引
      const credit = gen * PW.gridPrice * idx;
      s.cash += credit; s.month.refund = (s.month.refund || 0) + credit; this.pl(s, 'corp', 'rev', credit);
    },
    setPowerFuel(s, k) {
      const f = D().power.fuels[k], r = D().resources[k];
      if (!f || !r) return { ok: false, msg: 'その燃料は使えない' };
      if (!this.tierUnlocked(s, r.tier || 1)) return { ok: false, msg: `${this.tierName(r.tier)}になると使える` };
      (s.power || (s.power = { fuel: 'heavy', autoBuy: false, gen: 0 })).fuel = k; return { ok: true };
    },
    setPowerAutoBuy(s, on) { (s.power || (s.power = { fuel: 'heavy', autoBuy: false, gen: 0 })).autoBuy = !!on; return { ok: true }; },
    // 自家発電所の採算（満稼働1棟、いまの相場。燃料は市場の買値で見積もる＝自社の重油を燃やす場合は売れば得られた値段）
    powerEconomics(s, k) {
      const PW = D().power, idx = this.priceIndex(s), f = PW.fuels[k], b = D().buildings.powerPlant;
      const fuelCost = f.perMWh * Market.buyPrice(s, k), saving = PW.gridPrice * idx - fuelCost;
      const monthly = saving * PW.plantMWh * 30 - b.fixedPerMonth * idx;
      return { fuelCost, saving, monthly, paybackYears: monthly > 0 ? b.cost * idx / (monthly * 12) : Infinity };
    },

    // ---------- 研究開発（段階2c。同時に1件、毎月均等払い、現金が足りない月は止まる） ----------
    researchName(id) { const d = (D().research || {})[id]; return d ? d.name : id; },
    researchDone(s, id) { return !!(s.research && s.research.done && s.research.done[id]); },
    labCount(s) { return this.count(s, 'researchLab'); },
    researchBase(s) { return 1 + 0.3 * Math.max(0, this.labCount(s) - 1); },
    researchMaxAccel(s) { return Math.min(4, 1 + this.labCount(s)); },
    // 進行中の研究の実際の加速（希望と上限の小さいほう）
    researchAccel(s) { const a = s.research && s.research.active; return Math.max(1, Math.min((a && a.accel) || 1, this.researchMaxAccel(s))); },
    // 1か月に進む量（か月分）。accel を省くと進行中の加速
    researchSpeed(s, accel) { return this.researchBase(s) * (accel || this.researchAccel(s)); },
    // 月額。accel を省くと進行中の加速（無ければ×1）
    researchMonthly(s, id, accel) {
      const d = D().research[id], ac = accel || this.researchAccel(s);
      return d.cost / d.months * this.researchSpeed(s, ac) * (1 + 0.15 * (ac - 1)) * this.priceIndex(s);
    },
    setResearchAccel(s, accel) {
      const a = s.research && s.research.active; if (!a) return { ok: false, msg: '進行中の研究が無い' };
      if (!Number.isInteger(accel) || accel < 1 || accel > this.researchMaxAccel(s)) return { ok: false, msg: `加速は×${this.researchMaxAccel(s)}まで（研究棟を増やすと上がる）` };
      a.accel = accel; return { ok: true };
    },
    canResearch(s, id) {
      const d = (D().research || {})[id];
      if (!d) return { ok: false, msg: '不明な研究' };
      if (this.researchDone(s, id)) return { ok: false, msg: '完了済み' };
      if (s.research && s.research.active) return { ok: false, msg: '別の研究が進行中（同時に1件だけ）' };
      if (d.tier && !this.tierUnlocked(s, d.tier)) return { ok: false, msg: `${this.tierName(d.tier)}になると始められる` };
      if (this.labCount(s) < 1) return { ok: false, msg: '研究棟が必要' };
      for (const r of d.requires || []) if (!this.researchDone(s, r)) return { ok: false, msg: `先に「${this.researchName(r)}」が必要` };
      return { ok: true };
    },
    startResearch(s, id) {
      const chk = this.canResearch(s, id); if (!chk.ok) return chk;
      if (!s.research) s.research = { done: {}, active: null };
      s.research.active = { id, months: 0, paused: false, accel: 1 };
      this.log(s, `🔬 研究を開始：${this.researchName(id)}（${D().research[id].months}か月、月 ${this.fmtMoney(this.researchMonthly(s, id, 1))}）`);
      return { ok: true };
    },
    // デバッグ・テスト用：支払いなしで完了にする
    forceResearch(s, id) {
      if (!(D().research || {})[id]) return false;
      if (!s.research) s.research = { done: {}, active: null };
      s.research.done[id] = true; if (s.research.active && s.research.active.id === id) s.research.active = null; return true;
    },
    cancelResearch(s) {
      const a = s.research && s.research.active; if (!a) return { ok: false, msg: '進行中の研究が無い' };
      s.research.active = null;
      this.log(s, `🔬 研究を中止：${this.researchName(a.id)}（進捗 ${parseFloat(a.months.toFixed(1))}か月分は失われ、支払い済みは戻らない）`);
      return { ok: true };
    },
    // 月末の研究費の支払い（融資の返済の後、当座貸越の補填の前）。完了したら true
    researchMonth(s) {
      const a = s.research && s.research.active; if (!a) return false;
      const d = D().research[a.id], sp = this.researchSpeed(s);
      // 最後の月は残りの分だけ払う（進みが1か月分に満たないとき日割り）。小数の誤差で完了が1か月ずれないよう 1e-9 の余裕を見る
      const rem = Math.max(0, d.months - a.months), step = Math.min(sp, rem), pay = this.researchMonthly(s, a.id) * (step / sp);
      if (s.cash >= pay && !(s.overdraft > 0)) {
        s.cash -= pay; s.month.research = (s.month.research || 0) + pay; a.months += step; this.pl(s, 'corp', 'research', pay);
        if (a.paused) { a.paused = false; this.log(s, `🔬 研究を再開：${d.name}`); }
        if (a.months >= d.months - 1e-9) {
          s.research.done[a.id] = true; s.research.active = null;
          this.log(s, `🔬 研究が完了：${d.name}`);
          s.pendingEvents.push({ title: `${d.icon || '🔬'} ${d.name}が完了`, text: d.desc || '新しい設備・レシピが使えるようになった。' });
          return true;
        }
      } else if (!a.paused) { a.paused = true; this.log(s, `⏸ 資金不足のため研究が止まった：${d.name}`); }
      return false;
    },
    currentTier(s) { let t = 2; for (let i = 3; i <= 6; i++) if (this.tierUnlocked(s, i)) t = i; return t; },
    // 資産額：現金−借入＋設備の評価額（建設費×物価指数、減価なし）。在庫は含めない
    netWorth(s) { return s.cash - this.totalDebt(s) + this.assetValue(s); },
    // 設備の評価額（再調達額＝建設費×物価指数、減価なし。港の改修は含めない）
    assetValue(s) {
      const B = D().buildings, idx = this.priceIndex(s);
      let v = s.wells.length * B.oilWell.cost * idx;
      for (const m of s.mines || []) v += this.mineCost(s, m.site) / this.priceIndex(s) * idx;
      if (s.oreYards) for (const k in s.oreYards) v += s.oreYards[k] * B.mine.yard.cost * idx;
      for (const type in s.buildings) if (B[type]) v += B[type].cost * s.buildings[type] * idx;
      for (const p of s.plants) if (p.modules && B[p.type]) v += B[p.type].cost * this.moduleCfg().costMul * p.modules * idx;
      return v;
    },
    // ナビ・ランチャーの「経営」の表示条件（設備か12か月分の履歴ができたら）
    dashboardVisible(s) { return s.plants.length > 0 || (s.history && s.history.length >= 12); },
    // 解放条件の進み具合。{ met, parts:[{label, cur, need, ok, money}] }。cond が null なら undefinedCond:true
    tierProgress(s, t) {
      const d = this.tierDef(t), c = d && d.cond;
      if (!c) return { met: false, parts: [], undefinedCond: true };
      const parts = [];
      if (c.refinery) { const ok = this.refineryOnline(s); parts.push({ label: '製油所を稼働させる', ok }); }
      if (c.refinedRevenue) { const cur = s.stats.refinedRevenue || 0; parts.push({ label: '精製品の累計売上', cur, need: c.refinedRevenue, ok: cur >= c.refinedRevenue, money: true }); }
      if (c.netWorth) { const cur = this.netWorth(s); parts.push({ label: '資産額', cur, need: c.netWorth, ok: cur >= c.netWorth, money: true }); }
      for (const k in c.produced || {}) {
        const cur = ((s.stats.producedTotal || {})[k]) || 0;
        parts.push({ label: `${D().resources[k].name}の累計生産`, cur, need: c.produced[k], ok: cur >= c.produced[k] });
      }
      if (!parts.length) return { met: false, parts, undefinedCond: true };   // cond が空（{}）でも未定として扱う
      return { met: parts.every(x => x.ok), parts };
    },
    unlockTier(s, t) {
      if (this.tierUnlocked(s, t) || !this.tierDef(t)) return false;
      s.tiers[t] = true;
      const d = this.tierDef(t);
      this.log(s, `${d.icon || '🔓'} ${d.name}に入った`);
      s.pendingEvents.push({ title: `${d.icon || '🔓'} ${d.name}`, text: d.text || '新しい設備が使えるようになった。' });
      return true;
    },
    // 月末に判定。解放があれば true（一時停止して知らせる）
    checkTiers(s) {
      let any = false;
      for (let t = 3; t <= 6; t++) {
        // 前のティアが解放済みのときだけ（同じ月に続けて解放されることはある）
        if (!this.tierUnlocked(s, t) && this.tierUnlocked(s, t - 1) && this.tierProgress(s, t).met && this.unlockTier(s, t)) any = true;
      }
      return any;
    },

    // ---------- レシピの採算（いまの相場。1単位の主産物あたり） ----------
    // plantType を渡すと日量・月次の粗利・回収年数も返す。入力は自社在庫を使う場合（売値）と市場で買う場合（買値）の両方
    // 売れない出力（canSell=false）は売上に数えず、買えない入力（canBuy=false）は unbuyable に挙げる（買う場合の数字は参考値）
    // runRate は plantType を渡したときの月次・回収年数にだけ効く（維持費は稼働率に関係なくかかる）
    // mods：その設備の増設モジュールの数（省略＝0。日量・維持費・建設費を増設ぶん増やす）
    recipeEconomics(s, id, plantType, runRate, mods) {
      const rec = D().recipes[id], idx = this.priceIndex(s), R = D().resources;
      if (!rec) return null;
      let revenue = 0, revenueNoSat = 0, inBuy = 0, inOwn = 0;
      const unbuyable = [];
      for (const k in rec.outputs) if (R[k].canSell !== false) { revenue += rec.outputs[k] * Market.sellPrice(s, k); revenueNoSat += rec.outputs[k] * Market.priceNoSat(s, k) * (1 - Market.SELL_FEE); }
      for (const k in rec.inputs) {
        inBuy += rec.inputs[k] * Market.buyPrice(s, k); inOwn += rec.inputs[k] * Market.sellPrice(s, k);
        if (!R[k].canBuy) unbuyable.push(k);
      }
      const opex = (rec.opexPerUnit || 0) * idx;
      const r = { revenue, inputCostBuy: inBuy, inputCostOwn: inOwn, opex, unbuyable, marginBuy: revenue - inBuy - opex, marginOwn: revenue - inOwn - opex };
      const def = plantType && D().plants && D().plants[plantType], b = plantType && D().buildings[plantType];
      if (def && b) {
        const rr = runRate === undefined ? 1 : runRate, MC = this.moduleCfg(), nm = mods || 0;
        const cap = this.plantCap(def, rec) * (1 + nm * MC.gain);
        r.perDay = cap * rr;
        const fixed = (b.fixedPerMonth || 0) * idx * (1 + nm * MC.fixedMul);
        r.monthlyBuy = r.marginBuy * cap * rr * 30 - fixed;
        r.monthlyOwn = r.marginOwn * cap * rr * 30 - fixed;
        // 飽和（値崩れ）込み：月に Q を売ると平均で約1.5Qぶん飽和した価格で売れる（減衰0.977/日で定常のピークは約2Q）。
        // いまの飽和は含めず（二重計上を避ける）、飽和のない相場に定常の値崩れを掛ける。値崩れは主産物の marketDepth で計算し、副産物にも同じ率を掛ける（いまは単一出力）
        const main = Object.keys(rec.outputs)[0], Q = cap * rr * 30;
        r.satLoss = Math.min(0.5, Market.SAT_IMPACT * Math.max(1.5 * Q, 0.5) / R[main].marketDepth);   // 船のように1単位ずつまとめて売る品目は、1回の売却の平均（0.5単位）が下限
        r.monthlyBuySat = (revenueNoSat * (1 - r.satLoss) - inBuy - opex) * cap * rr * 30 - fixed;
        const cost = b.cost * idx * (1 + nm * MC.costMul);
        r.paybackYearsBuy = r.monthlyBuy > 0 ? cost / (r.monthlyBuy * 12) : Infinity;
        r.paybackYearsBuySat = r.monthlyBuySat > 0 ? cost / (r.monthlyBuySat * 12) : Infinity;
        r.paybackYearsOwn = r.monthlyOwn > 0 ? cost / (r.monthlyOwn * 12) : Infinity;
      }
      return r;
    },

    // データの整合性検査。問題の文字列の配列を返す（空なら正常）。selftest と debug で使う
    validateData() {
      const G = D(), out = [];
      const R = G.resources, B = G.buildings, RC = G.recipes || {}, P = G.plants || {};
      for (const id in RC) {
        const r = RC[id];
        for (const side of ['inputs', 'outputs']) {
          for (const k in r[side] || {}) {
            if (!R[k]) { out.push(`レシピ ${id} の ${side} に未定義の品目 ${k}`); continue; }
            if (!G.productOrder.includes(k)) out.push(`レシピ ${id} の品目 ${k} が productOrder に無い（価格が動かず出荷もされない）`);
            if (!(r[side][k] > 0) || !isFinite(r[side][k])) out.push(`レシピ ${id} の ${side}.${k} の量が正の有限数でない`);
          }
        }
        const ok = Object.keys(r.outputs || {});
        if (!ok.length) out.push(`レシピ ${id} に出力が無い`);
        else if (r.outputs[ok[0]] !== 1) out.push(`レシピ ${id} の主産物（最初の出力）は1にする`);
      }
      for (const type in P) {
        if (!B[type]) out.push(`加工設備 ${type} が buildings に無い`);
        if (!P[type].recipes || !P[type].recipes.length) out.push(`加工設備 ${type} に recipes が無い`);
        else if (new Set(P[type].recipes).size !== P[type].recipes.length) out.push(`加工設備 ${type} の recipes に重複がある`);
        for (const id of P[type].recipes || []) if (!RC[id]) out.push(`加工設備 ${type} のレシピ ${id} が未定義`);
        if (!(P[type].throughput > 0)) out.push(`加工設備 ${type} の throughput が不正`);
      }
      if (B.mine) for (const k in B.mine.ores) if (!(B.mine.yard.cap[k] > 0)) out.push(`鉱石 ${k} の貯鉱場の容量（mine.yard.cap）が正でない`);
      if (B.mine) for (const id in G.mineSites || {}) if (!B.mine.ores[G.mineSites[id].res]) out.push(`鉱区 ${id} の鉱石 ${G.mineSites[id].res} が mine.ores に無い`);
      const SC = G.storageClasses || {}, T = G.tiers || {};
      for (const type in B) {
        if (B[type].tier !== undefined && B[type].tier > 2 && !T[B[type].tier]) out.push(`設備 ${type} の tier ${B[type].tier} が tiers に無い`);
        for (const key in B[type].capacity || {}) if (!R[key] && !SC[key]) out.push(`設備 ${type} の capacity キー ${key} が品目でも保管クラスでもない`);
      }
      for (const t in T) for (const k in (T[t].cond && T[t].cond.produced) || {}) if (!R[k]) out.push(`ティア ${t} の条件に未定義の品目 ${k}`);
      for (const k in R) if (R[k].storage && !SC[R[k].storage]) out.push(`品目 ${k} の storage ${R[k].storage} が storageClasses に無い`);
      for (const k in R) {
        for (const f of ['storeVol', 'shipVol']) if (R[k][f] !== undefined && !(R[k][f] > 0)) out.push(`品目 ${k} の ${f} が正でない`);
        if (!R[k].storage) continue;
        for (const type in B) if (B[type].capacity && B[type].capacity[k]) out.push(`品目 ${k} は storage を持つのに専用タンク（${type}）がある`);
      }
      // 全品目が productOrder にあり、重複せず、価格などが正（無いと価格が NaN になる／動かない）
      const po = G.productOrder || [];
      if (new Set(po).size !== po.length) out.push('productOrder に重複がある');
      for (const k in R) {
        if (!po.includes(k)) out.push(`品目 ${k} が productOrder に無い`);
        for (const f of ['basePrice', 'marketDepth']) if (!(R[k][f] > 0)) out.push(`品目 ${k} の ${f} が正でない`);
        if (!R[k].unit) out.push(`品目 ${k} に unit が無い`);
      }
      for (const k of po) if (!R[k]) out.push(`productOrder の ${k} が resources に無い`);
      // 保管クラスの容量を持つ設備は category:'storage'（工場画面の建設メニューに出す条件）で、倉庫の tier は中身の品目の tier 以下
      for (const type in B) for (const key in B[type].capacity || {}) {
        if (!SC[key]) continue;
        if (B[type].category !== 'storage') out.push(`設備 ${type} は保管クラス ${key} の容量を持つのに category が storage でない`);
        for (const k in R) if (R[k].storage === key && (R[k].tier || 1) < (B[type].tier || 1)) out.push(`倉庫 ${type}（tier ${B[type].tier}）より低い tier の品目 ${k} が同じ保管クラスにある`);
      }
      // 加工設備の tier：入力・出力の品目の tier が設備の tier 以下（設備が解放されていれば扱える）
      for (const type in P) {
        const pt = (B[type] && B[type].tier) || 1;
        (P[type].recipes || []).forEach((id, i) => {
          const r = RC[id]; if (!r) return;
          const rt = Math.max(pt, r.tier || 0);
          if (r.tier && !T[r.tier]) out.push(`レシピ ${id} の tier ${r.tier} が tiers に無い`);
          if (i === 0 && (r.tier || 0) > pt) out.push(`設備 ${type} の先頭のレシピ ${id} が設備より高い tier（建設時の既定になるため、先頭は設備と同じ tier にする）`);
          for (const side of ['inputs', 'outputs']) for (const k in r[side]) if (R[k] && (R[k].tier || 1) > rt) out.push(`設備 ${type}（tier ${pt}）のレシピ ${id}（tier ${r.tier || '-'}）の ${side}.${k} が tier ${R[k].tier} で高い`);
          // 日量×入力量が極小だと購入が断られる（下限 1e-9）。実質0のレシピを弾く
          for (const k in r.inputs) if (!(P[type].throughput * (r.speed || 1) * r.inputs[k] > 1e-6)) out.push(`レシピ ${id} の日量×入力 ${k} が小さすぎる`);
        });
      }
      // 電力：energyShare は0以上1未満、燃料は品目で perMWh が正、発電所の建物がある
      for (const id in RC) { const e = RC[id].energyShare; if (e !== undefined && !(e >= 0 && e < 1)) out.push(`レシピ ${id} の energyShare が0以上1未満でない`); }   // 燃料・発電所の存在は selftest_real が検査する
      // 研究：参照の整合
      const RS = G.research || {};
      for (const id in RS) {
        const d = RS[id];
        if (!(d.cost > 0) || !(d.months >= 1)) out.push(`研究 ${id} の cost / months が不正`);
        if (d.tier && !T[d.tier]) out.push(`研究 ${id} の tier ${d.tier} が tiers に無い`);
        for (const r of d.requires || []) { if (!RS[r]) out.push(`研究 ${id} の requires ${r} が未定義`); else if ((RS[r].tier || 0) > (d.tier || 0)) out.push(`研究 ${id} の前提 ${r} の tier が高い`); }
        if (!(Number.isInteger(d.months))) out.push(`研究 ${id} の months が整数でない`);
        const seen = new Set(), walk = x => { if (seen.has(x)) return; seen.add(x); for (const r of (RS[x] && RS[x].requires) || []) walk(r); };
        for (const r of d.requires || []) walk(r);
        if (seen.has(id)) out.push(`研究 ${id} の requires が循環している`);
      }
      for (const type in B) if (B[type].research) {
        if (!RS[B[type].research]) out.push(`設備 ${type} の research ${B[type].research} が未定義`);
        else if ((B[type].tier || 0) < (RS[B[type].research].tier || 0)) out.push(`設備 ${type} の tier が研究 ${B[type].research} の tier より低い`);
      }
      for (const id in RC) if (RC[id].research) {
        if (!RS[RC[id].research]) out.push(`レシピ ${id} の research ${RC[id].research} が未定義`);
        else if ((RC[id].tier || 0) < (RS[RC[id].research].tier || 0)) out.push(`レシピ ${id} の tier が研究 ${RC[id].research} の tier より低い`);
        for (const type in P) if (P[type].recipes[0] === id) out.push(`設備 ${type} の先頭のレシピ ${id} に research が付いている（建設時の既定になるため付けない）`);
      }
      return out;
    },

    // ---------- 暦 ----------
    year(s) { return D().startYear + Math.floor(s.day / DAYS_PER_YEAR); },
    monthNum(s) { return Math.floor((s.day % DAYS_PER_YEAR) / DAYS_PER_MONTH) + 1; },
    dateStr(s) { return `${this.year(s)}年${this.monthNum(s)}月${(s.day % DAYS_PER_MONTH) + 1}日`; },
    priceIndex(s) { return Market.priceIndex(s); },

    log(s, text) {
      s.log.unshift({ day: s.day, text });
      if (s.log.length > 80) s.log.length = 80;
    },

    // ---------- 容量・能力 ----------
    count(s, type) { return s.buildings[type] || 0; },
    constructing(s, type) { return s.construction.filter(c => c.type === type).length; },
    // 保管：storage を持たない品目は品目専用タンク（buildings の capacity[品目キー]）。
    // storage（保管クラス）を持つ品目は、同じクラスの全品目で共用する倉庫プール（capacity[クラス]、単位は保管枠）。
    // プール品目は専用タンクを持たない（validateData で検査）。品目の1単位は storeVol 枠を使う（既定1）
    poolCap(s, cls) {
      let cap = 0;
      for (const type in s.buildings) {
        const b = D().buildings[type];
        if (b && b.capacity && b.capacity[cls]) cap += b.capacity[cls] * s.buildings[type];
      }
      return cap;
    },
    poolUsed(s, cls) {
      let used = 0;
      const R = D().resources;
      for (const k in R) if (R[k].storage === cls) {
        const yc = s.oreYards ? this.yardCap(s, k) : 0;   // 貯鉱場があれば、その鉱石はあふれた分だけ倉庫を使う
        if (yc > 0) used += Math.max(0, (s.inventory[k] || 0) - yc) * (R[k].storeVol || 1);
        else used += (s.inventory[k] || 0) * (R[k].storeVol || 1);
      }
      return used;
    },
    poolFree(s, cls) { return Math.max(0, this.poolCap(s, cls) - this.poolUsed(s, cls)); },
    // 互換：呼び出し側は capacity(s,k) - s.inventory[k] で空きを出す。プール品目は「在庫＋空き枠÷storeVol」を返す
    capacity(s, k) {
      const res = D().resources[k];
      if (res && res.storage) {
        const yc = s.oreYards ? this.yardCap(s, k) : 0, inv = s.inventory[k] || 0;
        return inv + this.poolFree(s, res.storage) / (res.storeVol || 1) + (yc > inv ? yc - inv : 0);
      }
      let cap = 0;
      for (const type in s.buildings) {
        const b = D().buildings[type];
        if (b && b.capacity && b.capacity[k]) cap += b.capacity[k] * s.buildings[type];
      }
      return cap;
    },
    // 製油所は小規模（refinery）と大規模（refineryLarge）の2種類。どちらかが完成していれば稼働。運転の設定（s.refinery）は共通
    refineryOnline(s) { return this.count(s, 'refinery') > 0 || this.count(s, 'refineryLarge') > 0; },
    refineryThroughput(s) {
      if (!this.refineryOnline(s)) return 0;
      const B = D().buildings;
      let tp = this.count(s, 'refinery') > 0 ? B.refinery.throughput : 0;   // 大規模が無いときは従来と同じ式（浮動小数点も変わらない）
      if (this.count(s, 'refineryLarge') > 0) tp += B.refineryLarge.throughput;
      return tp + this.count(s, 'distillation') * B.distillation.throughput;
    },
    // 1bblあたりの処理コスト（物価指数を掛ける前）。大規模があるときは、小規模＋蒸留塔と大規模の処理量で加重平均
    refineryOpexPerBbl(s) {
      const B = D().buildings;
      if (!(this.count(s, 'refineryLarge') > 0)) return B.refinery.opexPerBbl;
      const small = (this.count(s, 'refinery') > 0 ? B.refinery.throughput : 0) + this.count(s, 'distillation') * B.distillation.throughput, large = B.refineryLarge.throughput;
      return (small * B.refinery.opexPerBbl + large * B.refineryLarge.opexPerBbl) / (small + large);
    },

    // 港
    port(s) { return D().portGrades[s.portGrade]; },
    nextPort(s) { return D().portGrades[s.portGrade + 1] || null; },
    daysToShipment(s) { const iv = this.port(s).interval; return iv - (s.day % iv); },

    // ---------- 鉱山（鉱区ごとに鉱石が決まる。s.mines / s.mineSites は初めて買う・建てるまで作らない） ----------
    mineSites() { return D().mineSites || {}; },
    mineSiteState(s, id) { return (s.mineSites && s.mineSites[id]) || { owned: false, revealed: false }; },
    minesOnSite(s, id) { return (s.mines || []).filter(m => m.site === id).length; },
    buildingOnSite(s, id) { return s.construction.filter(c => c.type === 'mine' && c.site === id).length; },
    mineFree(s, id) { return this.mineSites()[id].slots - this.minesOnSite(s, id) - this.buildingOnSite(s, id); },
    mineCost(s, id) { const b = D().buildings.mine, S = this.mineSites()[id]; return Math.round(b.cost * b.ores[S.res].costMul * this.priceIndex(s)); },
    mineRate(s, m) {
      const b = D().buildings.mine, S = this.mineSites()[m.site], o = b.ores[S.res];
      const age = Math.max(0, (s.day - m.builtDay) / DAYS_PER_YEAR);
      return S.richness * Math.max(o.rate * b.floorFrac, o.rate * Math.exp(-b.declinePerYear * age));
    },
    // ---------- 貯鉱場（鉱石ごとの専用の置き場。s.oreYards = {鉱石: 棟数} は初めて建てるまで作らない） ----------
    yardCfg() { return D().buildings.mine.yard; },
    yardCount(s, res) { return (s.oreYards && s.oreYards[res]) || 0; },
    yardBuilding(s, res) { return s.construction.filter(c => c.type === 'oreYard' && c.res === res).length; },
    yardCap(s, res) { return this.yardCount(s, res) * (this.yardCfg().cap[res] || 0); },
    yardCost(s) { return Math.round(this.yardCfg().cost * this.priceIndex(s)); },
    canBuildYard(s, res) {
      const Y = this.yardCfg();
      if (!D().buildings.mine.ores[res]) return { ok: false, msg: '鉱石ではない' };
      { const lock = this.buildLockReason(s, 'mine'); if (lock) return { ok: false, msg: lock }; }
      if (this.yardCount(s, res) + this.yardBuilding(s, res) >= Y.max) return { ok: false, msg: `最大${Y.max}棟まで` };
      const cost = this.yardCost(s);
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    buildYard(s, res) {
      const chk = this.canBuildYard(s, res); if (!chk.ok) return chk;
      const Y = this.yardCfg(), days = Y.months * DAYS_PER_MONTH, rn = D().resources[res].name;
      s.cash -= chk.cost; s.month.construction += chk.cost;
      s.construction.push({ type: 'oreYard', res, lease: null, daysLeft: days, totalDays: days, label: `🗄️ ${rn}の貯鉱場` });
      this.log(s, `🚧 ${rn}の貯鉱場の建設を開始（${this.fmtMoney(chk.cost)}、${Y.months}か月）`);
      return { ok: true };
    },
    // 掘れた鉱石が入れる量：貯鉱場の空きだけ（貯鉱場が無ければ0＝掘れた分は捨てる）
    oreRoom(s, res) { return Math.max(0, this.yardCap(s, res) - (s.inventory[res] || 0)); },
    mineRateOn(s, id) { return this.mineSiteState(s, id).paused ? 0 : (s.mines || []).filter(m => m.site === id).reduce((a, m) => a + this.mineRate(s, m), 0); },
    mineRateOf(s, res) { return (s.mines || []).filter(m => this.mineSites()[m.site].res === res && !this.mineSiteState(s, m.site).paused).reduce((a, m) => a + this.mineRate(s, m), 0); },
    buyMineSite(s, id) {
      const S = this.mineSites()[id]; if (!S) return { ok: false, msg: '不明な鉱区' };
      if (this.mineSiteState(s, id).owned) return { ok: false, msg: '取得済み' };
      { const lock = this.buildLockReason(s, 'mine'); if (lock) return { ok: false, msg: lock }; }
      const cost = Math.round(S.cost * this.priceIndex(s));
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      s.cash -= cost; s.month.construction += cost;
      if (!s.mineSites) s.mineSites = {};
      s.mineSites[id] = { owned: true, revealed: false };
      this.log(s, `${S.name}の採掘権を取得（${this.fmtMoney(cost)}）`);
      return { ok: true };
    },
    toggleMineSite(s, id) {   // 鉱区の休止・再開（休止中は掘らず、固定費だけ掛かる）
      const st = this.mineSiteState(s, id); if (!st.owned || !s.mineSites[id]) return { ok: false, msg: '鉱区が未取得' };
      s.mineSites[id].paused = !s.mineSites[id].paused;
      this.log(s, `${this.mineSites()[id].name}を${s.mineSites[id].paused ? '休止' : '再開'}した`);
      return { ok: true };
    },
    canBuildMine(s, id) {
      const S = this.mineSites()[id]; if (!S) return { ok: false, msg: '不明な鉱区' };
      { const lock = this.buildLockReason(s, 'mine'); if (lock) return { ok: false, msg: lock }; }
      if (!this.mineSiteState(s, id).owned) return { ok: false, msg: '鉱区を取得してください' };
      if (this.mineFree(s, id) <= 0) return { ok: false, msg: '鉱区の空き枠がない' };
      const cost = this.mineCost(s, id);
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    buildMine(s, id) {
      const chk = this.canBuildMine(s, id); if (!chk.ok) return chk;
      const b = D().buildings.mine, days = b.months * DAYS_PER_MONTH;
      s.cash -= chk.cost; s.month.construction += chk.cost;
      s.construction.push({ type: 'mine', site: id, lease: null, daysLeft: days, totalDays: days });
      this.log(s, `🚧 ${D().resources[this.mineSites()[id].res].name}の鉱山（${this.mineSites()[id].name}）の建設を開始（${this.fmtMoney(chk.cost)}、${b.months}か月）`);
      return { ok: true };
    },

    // 油井
    wellRate(s, w) {
      const b = D().buildings.oilWell;
      const L = D().leases[w.lease];
      const age = Math.max(0, (s.day - w.builtDay) / DAYS_PER_YEAR);
      return L.richness * Math.max(b.floorRate, b.initialRate * Math.exp(-b.declinePerYear * age));
    },
    totalWellRate(s) { return s.wells.reduce((a, w) => a + this.wellRate(s, w), 0); },
    wellsOnLease(s, id) { return s.wells.filter(w => w.lease === id).length; },
    buildingOnLease(s, id) { return s.construction.filter(c => c.type === 'oilWell' && c.lease === id).length; },
    leaseFree(s, id) { return D().leases[id].slots - this.wellsOnLease(s, id) - this.buildingOnLease(s, id); },

    // ---------- 融資 ----------
    totalDebt(s) { return Object.values(s.loans).reduce((a, l) => a + l.principal, 0) + s.overdraft; },
    revenue12(s) { return s.history.slice(-12).reduce((a, h) => a + h.revenue, 0); },
    loanLimit(s, id) { return Math.round(D().loans[id].limit * this.priceIndex(s) / 1000) * 1000; },
    loanAvailable(s, id) {
      const L = D().loans[id], c = L.cond;
      if (s.loans[id]) return { ok: false, msg: '返済中（完済すると再び借りられる）' };
      if (c) {
        if (c.wells && s.wells.length < c.wells) return { ok: false, msg: `条件：${L.condText}` };
        if (c.revenue12 && this.revenue12(s) < c.revenue12 * this.priceIndex(s)) return { ok: false, msg: `条件：${L.condText}` };
        if (c.refinery && !this.refineryOnline(s)) return { ok: false, msg: `条件：${L.condText}` };
      }
      return { ok: true };
    },
    borrow(s, id, amount) {
      const chk = this.loanAvailable(s, id);
      if (!chk.ok) return chk;
      const L = D().loans[id];
      amount = Math.min(amount, this.loanLimit(s, id));
      if (amount < 1000) return { ok: false, msg: '金額が小さすぎる' };
      s.loans[id] = { principal: amount, monthly: amount / (L.years * 12) };
      s.cash += amount; s.month.borrowed += amount;
      this.log(s, `🏦 ${L.name}から ${this.fmtMoney(amount)} を借入（年利${(L.rate * 100).toFixed(1)}%・${L.years}年）`);
      return { ok: true };
    },
    repayLoan(s, id, amount) {
      const loan = s.loans[id];
      if (!loan) return { ok: false, msg: '借入なし' };
      amount = Math.min(amount, loan.principal, Math.max(0, s.cash));
      if (amount <= 0) return { ok: false, msg: '返済できる資金がない' };
      loan.principal -= amount; s.cash -= amount; s.month.principal += amount;
      if (loan.principal < 1) { delete s.loans[id]; this.log(s, `🏦 ${D().loans[id].name}の借入を完済`); }
      else this.log(s, `🏦 ${D().loans[id].name}に ${this.fmtMoney(amount)} を繰上返済`);
      return { ok: true };
    },

    // ---------- 建設 ----------
    costOf(s, type, lease) {
      let c = D().buildings[type].cost * this.priceIndex(s);
      if (type === 'oilWell' && lease) c *= D().leases[lease].wellCostMul;
      return Math.round(c);
    },
    canBuild(s, type, lease) {
      const b = D().buildings[type];
      if (!b) return { ok: false, msg: '不明な設備' };
      if (b.unique && (this.count(s, type) > 0 || this.constructing(s, type) > 0)) return { ok: false, msg: 'すでに建設済み・建設中' };
      { const lock = this.buildLockReason(s, type); if (lock) return { ok: false, msg: lock }; }
      if (b.maxCount && this.count(s, type) + this.constructing(s, type) >= b.maxCount) return { ok: false, msg: `最大${b.maxCount}棟まで` };
      if (b.requiresBuilding && this.count(s, b.requiresBuilding) === 0 && this.constructing(s, b.requiresBuilding) === 0)
        return { ok: false, msg: `${D().buildings[b.requiresBuilding].name}が必要` };
      if (b.needsSite) return { ok: false, msg: '鉱区のページから建てる' };
      if (b.needsLeaseSlot) {
        if (!lease || !s.leases[lease] || !s.leases[lease].owned) return { ok: false, msg: '鉱区を選んでください' };
        if (this.leaseFree(s, lease) <= 0) return { ok: false, msg: '鉱区の空き枠がない' };
      }
      const cost = this.costOf(s, type, lease);
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    // pos = {x,y}：町の地図で場所を指定して建てる（省略すると、位置は町のページを開いたときに自動で決まる）
    build(s, type, lease, pos) {
      const chk = this.canBuild(s, type, lease);
      if (!chk.ok) return chk;
      let stackKey = null;
      if (this.stackCfg(type) && (s.map || pos)) { if (!s.map) this.ensureMap(s); stackKey = this.stackSite(s, type); }   // 重ねて建てる設備：2棟目以降は1棟目の敷地に重ねる（場所の指定は無視）。地図も位置も無いゲームは従来どおり
      const rot = pos ? this.cleanRot(type, pos.rot) : 0;
      if (pos && !stackKey) { this.ensureMap(s); const pc = this.canPlace(s, type, pos.x, pos.y, null, rot); if (!pc.ok) return pc; }
      const b = D().buildings[type];
      s.cash -= chk.cost; s.month.construction += chk.cost;
      const days = b.months * DAYS_PER_MONTH;
      const entry = { type, lease: lease || null, daysLeft: days, totalDays: days };
      if (stackKey) entry.key = stackKey;
      else if (pos) { entry.key = this.newKey(s, type); s.map.placed[entry.key] = { type, x: pos.x, y: pos.y }; if (rot) s.map.placed[entry.key].rot = rot; }
      s.construction.push(entry);
      this.log(s, `🚧 ${b.name}${lease ? '（' + D().leases[lease].name + '）' : ''}の建設を開始（${this.fmtMoney(chk.cost)}、${b.months}か月）`);
      return { ok: true };
    },
    portUpgradeCost(s) { const n = this.nextPort(s); return n ? Math.round(n.cost * this.priceIndex(s)) : 0; },
    canUpgradePort(s) {
      const n = this.nextPort(s);
      if (!n) return { ok: false, msg: '最高グレード' };
      if (s.construction.some(c => c.type === 'port')) return { ok: false, msg: '港を改修中' };
      const cost = this.portUpgradeCost(s);
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      return { ok: true, cost };
    },
    upgradePort(s) {
      const chk = this.canUpgradePort(s);
      if (!chk.ok) return chk;
      const n = this.nextPort(s);
      s.cash -= chk.cost; s.month.construction += chk.cost;
      const days = n.months * DAYS_PER_MONTH;
      s.construction.push({ type: 'port', lease: null, daysLeft: days, totalDays: days, label: `港の改修（${n.name}へ）` });
      this.log(s, `🚧 港を${n.name}へ改修開始（${this.fmtMoney(chk.cost)}、${n.months}か月）`);
      return { ok: true };
    },
    buyLease(s, id) {
      const L = D().leases[id], st = s.leases[id];
      if (st.owned) return { ok: false, msg: '取得済み' };
      const cost = Math.round(L.cost * this.priceIndex(s));
      if (s.cash < cost) return { ok: false, msg: `資金不足（${this.fmtMoney(cost)}）` };
      s.cash -= cost; s.month.construction += cost;
      st.owned = true;
      this.log(s, `${L.name}の採掘権を取得（${this.fmtMoney(cost)}）`);
      return { ok: true };
    },
    constructionLabel(c, s) {
      if (c.label) return c.label;
      if (c.type === 'module') { const p = (s && s.plants.find(q => q.id === c.plantId)); const b = p && D().buildings[p.type]; return `🧱 ${b ? b.name : ''}の増設モジュール`; }
      const b = D().buildings[c.type];
      if (c.type === 'mine' && c.site) return `${b.icon} ${D().resources[this.mineSites()[c.site].res].name}の${b.name}（${this.mineSites()[c.site].name}）`;
      return `${b.icon} ${b.name}${c.lease ? '（' + D().leases[c.lease].name + '）' : ''}`;
    },

    // ---------- 加工設備 ----------
    plantDef(p) { return D().plants && D().plants[p.type]; },
    // そのレシピの実際の日量（設備の基準日量 × レシピの speed）
    plantCap(def, rec) { return def.throughput * (rec.speed || 1); },
    // 増設モジュールを含めた設備の日量（モジュールが無ければ plantCap と同じ）
    // その設備に増設モジュールを置けるか（造船所はドックの増設が難しいので置けない＝map.js の modules.exclude）
    hasModule(type) { const c = this.moduleCfg(); return !!c && !(c.exclude && c.exclude[type]); },
    moduleCfg() { return (D().map && D().map.modules) || { max: 0, gain: 0, costMul: 1, monthsMul: 1, fixedMul: 0 }; },   // マップのデータが無いと増設は0個
    plantCapOf(p) { const def = this.plantDef(p), rec = D().recipes[p.recipe], MC = this.moduleCfg(); return this.plantCap(def, rec) * (1 + (p.modules || 0) * MC.gain); },
    // 出荷から確保する量（次の出荷日までに製油所と加工設備が使う入力）。品目 → 量
    reserveMap(s, interval) {
      const res = {};
      const rt = this.refineryThroughput(s) * s.refinery.runRate * interval;
      if (rt > 0) res.crude = rt;
      if (this.count(s, 'powerPlant') > 0 && s.power && s.power.demand > 0) { const f = D().power.fuels[s.power.fuel]; if (f) res[s.power.fuel] = (res[s.power.fuel] || 0) + Math.min(s.power.demand, this.powerCapacity(s)) * f.perMWh * interval; }   // 加工設備が止まった日に gen=0 になっても燃料を出荷で売り切らない
      for (const p of s.plants) {
        const def = this.plantDef(p), rec = D().recipes[p.recipe];
        if (!def || !rec) continue;
        if (p.last && p.last.reason === 'full') continue;   // 出力の置き場が満杯で止まっている設備の入力は確保しない（売れずに溜まって製油所まで止まるのを防ぐ）
        for (const k in rec.inputs) res[k] = (res[k] || 0) + rec.inputs[k] * this.plantCapOf(p) * p.runRate * interval;
      }
      return res;
    },
    setPlantRecipe(s, id, recipeId) {
      const p = s.plants.find(x => x.id === id);
      const def = p && this.plantDef(p);
      if (!def || !def.recipes.includes(recipeId)) return { ok: false, msg: 'このレシピは選べない' };
      { const lock = this.recipeLockReason(s, recipeId); if (lock) return { ok: false, msg: lock }; }
      p.recipe = recipeId; return { ok: true };
    },
    setPlantRate(s, id, rate) {
      const p = s.plants.find(x => x.id === id);
      if (!p || !(rate >= 0)) return { ok: false, msg: '設備が無い' };
      p.runRate = Math.min(1, rate); return { ok: true };
    },
    setPlantAutoBuy(s, id, on) {
      const p = s.plants.find(x => x.id === id);
      if (!p) return { ok: false, msg: '設備が無い' };
      p.autoBuy = !!on; return { ok: true };
    },
    // 1日分の加工。入力の在庫、出力の置き場（保管プールは入出力の体積で見る）、日量で頭打ち。
    // 在庫から使う入力は体積を空けるが、自動購入した入力はその日のうちに使い切るのでプールを占めない
    runPlants(s, idx) {
      const R = D().resources;
      let demand = 0;   // 今日の電力需要（MWh）
      for (const p of s.plants) {
        const def = this.plantDef(p), rec = D().recipes[p.recipe];
        if (!def || !rec) { p.last = { t: 0, reason: 'none' }; continue; }
        if (!(p.runRate > 0)) { p.last = { t: 0, reason: 'off' }; continue; }
        const inKeys = Object.keys(rec.inputs), outKeys = Object.keys(rec.outputs);
        const pseg = this.segmentOfBuilding(p.type) || 'corp', inv0 = {};
        for (const k of inKeys) inv0[k] = s.inventory[k];   // 自動購入の前の在庫（社内取引と原料不足の判定に使う）
        const want = this.plantCapOf(p) * p.runRate;
        // 単位出力あたりの体積（クラス別）と、専用タンク品目の増減
        const outVol = {}, inVol = {}, outDed = {}, inDed = {};
        for (const k of outKeys) { const r = R[k]; if (r.storage) outVol[r.storage] = (outVol[r.storage] || 0) + rec.outputs[k] * (r.storeVol || 1); else outDed[k] = rec.outputs[k]; }
        for (const k of inKeys) { const r = R[k]; if (r.storage) inVol[r.storage] = (inVol[r.storage] || 0) + rec.inputs[k] * (r.storeVol || 1); else inDed[k] = rec.inputs[k]; }
        // 1) 在庫だけで回せる分
        let tStock = Infinity;
        for (const k of inKeys) tStock = Math.min(tStock, s.inventory[k] / rec.inputs[k]);
        let tA = Math.min(want, tStock);
        for (const c in outVol) { const net = outVol[c] - (inVol[c] || 0); if (net > 0) tA = Math.min(tA, this.poolFree(s, c) / net); }
        for (const k in outDed) { const net = outDed[k] - (inDed[k] || 0); if (net > 0) tA = Math.min(tA, Math.max(0, this.capacity(s, k) - s.inventory[k]) / net); }
        if (s.oreYards) for (const c in outVol) {   // 貯鉱場にある入力は使っても倉庫の空きが増えない（あふれた分だけ増える）：その分を差し引いた条件も満たす
          let freeIn = 0, over = 0;
          for (const k of inKeys) if (R[k].storage === c) { const yc = this.yardCap(s, k); if (yc > 0) over += Math.max(0, s.inventory[k] - yc) * (R[k].storeVol || 1); else freeIn += rec.inputs[k] * (R[k].storeVol || 1); }
          if (outVol[c] - freeIn > 0) tA = Math.min(tA, (this.poolFree(s, c) + over) / (outVol[c] - freeIn));
        }
        tA = Math.max(0, tA);
        let t = tA, why = null, roomLim = false;
        // 2) 自動購入：在庫が足りないぶんを市場から買って上乗せ（出力の置き場の範囲で）
        if (p.autoBuy && want > tA && tA >= Math.min(want, tStock) - 1e-9) {
          let tb = want - tA;
          for (const c in outVol) tb = Math.min(tb, Math.max(0, this.poolFree(s, c) - tA * (outVol[c] - (inVol[c] || 0))) / outVol[c]);
          for (const k in outDed) tb = Math.min(tb, Math.max(0, this.capacity(s, k) - s.inventory[k] - tA * (outDed[k] - (inDed[k] || 0))) / outDed[k]);
          tb = Math.max(0, tb);
          if (tb < want - tA - 1e-9) roomLim = true;
          if (tb > 0) {
            // 資金で買える量を先に逆算する（買った入力の一部だけが使われて在庫に残るのを防ぐ）
            let hi = tA + tb;
            for (const k of inKeys) if (!R[k].canBuy) hi = Math.min(hi, s.inventory[k] / rec.inputs[k]);
            const cost = T => inKeys.reduce((a, k) => R[k].canBuy ? a + Math.max(0, rec.inputs[k] * T - s.inventory[k]) * Market.buyPrice(s, k) : a, 0);
            const cash = this.spendable(s);   // 現金＋当座貸越の運転資金枠
            if (cost(hi) > cash) {
              why = 'cash';
              let lo = Math.min(tA, hi);
              for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (cost(mid) <= cash) lo = mid; else hi = mid; }
              hi = lo;
            }
            for (const k of inKeys) { const lack = rec.inputs[k] * hi - s.inventory[k]; if (lack > 1e-12) this.buy(s, k, lack, true, { ignoreSpace: true, seg: pseg }); }
            t = hi;
            for (const k of inKeys) t = Math.min(t, s.inventory[k] / rec.inputs[k]);
          }
        }
        // 止まっている（または部分稼働の）理由：full=置き場、input=入力不足、cash=資金不足
        let reason = 'ok';
        if (t < want - 1e-9) {
          if (why) reason = why;
          else if (roomLim || tA < Math.min(want, tStock) - 1e-9) reason = 'full';
          else if (tStock < want - 1e-9) reason = (p.autoBuy && inKeys.every(k => R[k].canBuy)) ? 'cash' : 'input';   // 買えない入力が足りないなら原料不足
          else reason = 'full';
        }
        p.last = { t: Math.max(0, t), reason };
        if (reason === 'input' || reason === 'cash') {   // 律速した入力（1日分の必要量に対する在庫の割合がいちばん小さい入力。ダッシュボードで表示）
          let sk = null, sr = Infinity;
          for (const k of inKeys) { const r0 = inv0[k] / rec.inputs[k]; if (r0 < sr) { sr = r0; sk = k; } }
          p.last.short = sk;
        }
        if (!(t > 1e-9)) continue;
        const pt = s.stats.producedTotal || (s.stats.producedTotal = {});
        for (const k of outKeys) pt[k] = (pt[k] || 0) + rec.outputs[k] * t;
        for (const k of inKeys) s.inventory[k] -= rec.inputs[k] * t;
        for (const k of outKeys) { s.inventory[k] += rec.outputs[k] * t; add(s.month.produced, k, rec.outputs[k] * t); }
        const c = t * (rec.opexPerUnit || 0) * idx;
        s.month.opex += c; s.cash -= c;
        this.pl(s, pseg, 'opex', c);
        demand += t * (rec.opexPerUnit || 0) * (rec.energyShare || 0) / D().power.gridPrice;
        // 他の本部の素材を自社の在庫から使った分は社内取引（市場の中値。買った分は購入に計上済みなので在庫から使った分だけ）
        for (const k of inKeys) {
          const iseg = this.segmentOfItem(k) || 'corp';
          if (iseg === pseg) continue;
          const fromStock = Math.min(rec.inputs[k] * t, inv0[k]);
          if (fromStock > 0) { const v = fromStock * Market.price(s, k); this.pl(s, iseg, 'tout', v); this.pl(s, pseg, 'tin', v); }
        }
      }
      return demand;
    },

    // ---------- 出荷（港のグレードに応じて一定間隔で一括売却） ----------
    // 出荷枠は shipVol（1単位が食う枠）で数える。売れない品目（canSell=false）と、加工設備の入力として確保した分は売らない
    shipment(s) {
      const port = this.port(s);
      let room = port.capacity;
      const reserve = this.reserveMap(s, port.interval);
      const R = D().resources;
      const sv = k => R[k].shipVol || 1;
      const order = D().productOrder.filter(k => R[k].canSell !== false)
        .sort((a, b) => Market.sellPrice(s, b) / sv(b) - Market.sellPrice(s, a) / sv(a));
      const lines = []; let total = 0;
      // 取引先への納品（市場より先。出荷の見送りは効かない。市場の飽和は進めず、売却手数料もない。出荷枠は使う）
      if (s.contracts) for (const k in s.contracts) {
        const c = s.contracts[k]; if (!(s.day > c.start) || !this.contractCfg(k)) continue;
        let qty = Math.min(Math.max(0, s.inventory[k] - (reserve[k] || 0)), c.qty - c.delivered, Math.max(0, room) / sv(k));
        if (this.contractCfg(k).integer) qty = Math.floor(qty + 1e-9);
        if (!(qty > 1e-9)) continue;
        const rev = qty * this.contractPrice(s, k);
        s.inventory[k] -= qty; s.cash += rev; room -= qty * sv(k); c.delivered += qty;
        add(s.month.revenue, k, rev); add(s.month.sold, k, qty); this.pl(s, this.segmentOfItem(k), 'rev', rev);
        s.stats.totalRevenue += rev; total += rev; s.stats.refinedRevenue = (s.stats.refinedRevenue || 0) + rev;
        lines.push({ k, qty, rev, contract: true });
      }
      for (const k of order) {
        if (s.hold[k] || room <= 0) continue;
        const sellable = s.inventory[k] - (reserve[k] || 0);
        const qty = Math.min(Math.max(0, sellable), room / sv(k));
        if (qty < 1) continue;
        const rev = Market.sellRevenue(s, k, qty);
        s.inventory[k] -= qty; s.cash += rev; room -= qty * sv(k);
        add(s.month.revenue, k, rev); add(s.month.sold, k, qty); this.pl(s, this.segmentOfItem(k), 'rev', rev);
        s.stats.totalRevenue += rev; total += rev;
        if (R[k].kind !== 'raw') s.stats.refinedRevenue = (s.stats.refinedRevenue || 0) + rev;
        lines.push({ k, qty, rev });
      }
      // 積み残し（出荷能力が足りなかった分）
      const left = order.filter(k => !s.hold[k]).reduce((a, k) => a + Math.max(0, s.inventory[k] - (reserve[k] || 0)) * sv(k), 0);
      s.shipments.unshift({ day: s.day, lines, total, used: port.capacity - room, cap: port.capacity, left });
      if (s.shipments.length > 24) s.shipments.length = 24;
      if (lines.length) this.log(s, `⚓ 出荷 ${this.fmtNum(port.capacity - room)}bbl → ${this.fmtMoney(total)}${left > 1 ? `（積み残し ${this.fmtNum(left)}bbl）` : ''}`);
    },

    // 原料の購入に使える額：現金＋当座貸越の運転資金枠（直近12か月の売上の25%から、すでに借りた分と現金の赤字を引いた残り）。
    // 現金が尽きても、売上のある事業は原料を買い続けられる（月末に不足分が当座貸越になる）。売上が無い事業には枠が無い
    spendable(s) {
      const room = Math.max(0, 0.25 * this.revenue12(s) - s.overdraft - Math.max(0, -s.cash));
      return Math.max(0, s.cash) + room;
    },
    // 市場から購入（買える品目だけ）。購入量は保管の空きと資金（運転資金枠込み）で頭打ち
    // opts.ignoreSpace：買ってその日のうちに使い切る前提の購入（加工設備の自動購入）。保管の空きを見ない
    buy(s, k, qty, auto, opts) {
      const res = D().resources[k];
      if (!res || !res.canBuy) return { ok: false, msg: 'この品目は買えない' };
      const space = opts && opts.ignoreSpace ? Infinity : this.capacity(s, k) - s.inventory[k];
      const price = Market.buyPrice(s, k);
      qty = Math.min(qty, space, this.spendable(s) / price);
      if (!(qty > (opts && opts.ignoreSpace ? 1e-9 : 0.01))) return { ok: false, msg: !(space > 0.01) ? (res.storage ? '倉庫の空きが無い（倉庫を建てる）' : 'タンクの空きが無い') : '資金が足りない' };
      const cost = qty * price;
      s.cash -= cost; s.inventory[k] += qty; s.month.purchase += cost;
      this.pl(s, (opts && opts.seg) || this.segmentOfItem(k), 'purchase', cost);
      if (!auto) this.log(s, `${res.name} ${this.fmtNum(qty)}${res.unit} を ${this.fmtMoney(cost)} で購入`);
      return { ok: true };
    },
    buyCrude(s, qty, auto) { return this.buy(s, 'crude', qty, auto); },

    // ---------- 1日の進行 ----------
    // 戻り値：一時停止すべき出来事があれば true
    stepDay(s) {
      let stop = false;
      const idx = this.priceIndex(s);
      const B = D().buildings;

      // 1) 建設
      for (const c of s.construction) c.daysLeft--;
      const done = s.construction.filter(c => c.daysLeft <= 0);
      s.construction = s.construction.filter(c => c.daysLeft > 0);
      for (const c of done) {
        if (c.type === 'oilWell') {
          s.wells.push({ lease: c.lease, builtDay: s.day });
          const st = s.leases[c.lease];
          if (!st.revealed) {
            st.revealed = true;
            const L = D().leases[c.lease];
            this.log(s, `🔍 ${L.name}の初号井が完成。油層の豊かさは ${L.richness.toFixed(2)} と判明`);
          }
        } else if (c.type === 'oreYard') {
          if (!s.oreYards) s.oreYards = {};
          s.oreYards[c.res] = (s.oreYards[c.res] || 0) + 1;
          this.log(s, `✅ ${D().resources[c.res].name}の貯鉱場が完成（容量 ${this.fmtNum(this.yardCap(s, c.res))}t）`);
          continue;
        } else if (c.type === 'mine') {
          if (!s.mines) s.mines = [];
          s.mines.push({ site: c.site, builtDay: s.day });
          const S = this.mineSites()[c.site], st = s.mineSites[c.site], rn = D().resources[S.res].name;
          this.log(s, `✅ ${rn}の鉱山が完成（${S.name}）`);
          if (!st.revealed) { st.revealed = true; this.log(s, `🔍 ${S.name}の初号鉱山が完成。鉱床の豊かさは ${S.richness.toFixed(2)} と判明`); }
          continue;
        } else if (c.type === 'module') {
          const p = s.plants.find(q => q.id === c.plantId);
          if (p) { p.modules = (p.modules || 0) + 1; this.log(s, `✅ ${D().buildings[p.type].name}の増設モジュールが完成（日量 ${this.fmtNum(this.plantCapOf(p))}）`); }
          continue;
        } else if (c.type === 'port') {
          s.portGrade++;
          this.log(s, `✅ 港が${this.port(s).name}になった`);
          continue;
        } else {
          s.buildings[c.type] = (s.buildings[c.type] || 0) + 1;
          const pd = D().plants && D().plants[c.type];
          if (pd) s.plants.push({ id: s.nextPlantId++, type: c.type, recipe: pd.recipes[0], runRate: 1, autoBuy: false, ...(c.key ? { key: c.key } : {}) });
        }
        this.log(s, `✅ ${B[c.type].name}が完成`);
        if (c.type === 'refinery' || c.type === 'refineryLarge') {
          if (!s.flags.refineryRunning) {   // 最初の製油所の完成だけ「稼働」の知らせ（従来どおり）
            s.flags.refineryRunning = true;
            s.pendingEvents.push({ title: '製油所が稼働', text: '蒸留塔に火が入った。原油は製油所で優先的に使われ、余った分と精製品は出荷日にまとめて売られる。製品タンクの空きと港の出荷能力に注意。' });
            stop = true;
          } else if (c.type === 'refineryLarge') {   // 2棟目以降（大規模）は、処理能力が増えたことと港の上限だけ知らせる
            s.pendingEvents.push({ title: '大規模製油所が稼働', text: `処理能力が日量${this.fmtNum(this.refineryThroughput(s))}bblになった。精製品の出荷は港の出荷能力が上限になる（石油積出港なら定格まで出せる）。` });
            stop = true;
          }
        }
      }

      // 2) 採掘
      const rate = this.totalWellRate(s);
      const space = Math.max(0, this.capacity(s, 'crude') - s.inventory.crude);
      const produced = Math.min(rate, space);
      s.inventory.crude += produced;
      add(s.month.produced, 'crude', produced);
      s.month.lostCrude += rate - produced;
      const wc = produced * B.oilWell.opexPerBbl * idx;
      s.month.opex += wc; s.cash -= wc; this.pl(s, 'oil', 'opex', wc);

      // 2b) 鉱山：鉱石は素材倉庫の空きの範囲で入る（倉庫が無い・満杯なら掘れた分は捨てる）。操業費は掘れた分だけ
      if (s.mines && s.mines.length) {
        for (const m of s.mines) {
          const S = this.mineSites()[m.site], o = B.mine.ores[S.res], rate = this.mineRate(s, m);
          if (this.mineSiteState(s, m.site).paused) continue;   // 休止中は掘らない（固定費だけ掛かる）
          const got = Math.min(rate, this.oreRoom(s, S.res));    // 貯鉱場が満杯なら掘らない（止まる。操業費も掛からない）
          if (!(got > 0)) continue;
          s.inventory[S.res] += got;
          add(s.month.produced, S.res, got);
          const mc = got * o.opexPerUnit * idx;
          s.month.opex += mc; s.cash -= mc; this.pl(s, this.segmentOfItem(S.res), 'opex', mc);
        }
      }

      // 3) 精製
      const tp = this.refineryThroughput(s) * s.refinery.runRate;
      if (tp > 0) {
        if (s.refinery.autoBuyCrude && s.inventory.crude < tp) this.buyCrude(s, tp - s.inventory.crude, true);
        const yields = D().distillModes[s.refinery.mode].yields;
        let t = Math.min(tp, s.inventory.crude);
        for (const k in yields) t = Math.min(t, (this.capacity(s, k) - s.inventory[k]) / yields[k]);
        t = Math.max(0, t);
        s.inventory.crude -= t;
        for (const k in yields) { s.inventory[k] += t * yields[k]; add(s.month.produced, k, t * yields[k]); }
        s.month.refined += t;
        const c = t * this.refineryOpexPerBbl(s) * idx;
        s.month.opex += c; s.cash -= c; this.pl(s, 'oil', 'opex', c);
      }

      // 3b) 加工設備（建てた順に処理。同じ入力を取り合うときは先に建てた設備が優先）
      const powerDemand = this.runPlants(s, idx);
      this.settlePower(s, idx, powerDemand);

      // 4) 固定費
      let fixed = s.wells.length * B.oilWell.fixedPerMonth + (s.mines ? s.mines.length * B.mine.fixedPerMonth : 0);
      if (s.oreYards) for (const k in s.oreYards) fixed += s.oreYards[k] * B.mine.yard.fixedPerMonth;
      for (const type in s.buildings) fixed += (B[type].fixedPerMonth || 0) * s.buildings[type];
      for (const p of s.plants) if (p.modules) fixed += (B[p.type].fixedPerMonth || 0) * this.moduleCfg().fixedMul * p.modules;
      fixed = fixed * idx / DAYS_PER_MONTH;
      s.month.fixed += fixed; s.cash -= fixed;
      this.pl(s, 'oil', 'fixed', s.wells.length * B.oilWell.fixedPerMonth * idx / DAYS_PER_MONTH);
      if (s.oreYards) for (const k in s.oreYards) this.pl(s, this.segmentOfItem(k), 'fixed', s.oreYards[k] * B.mine.yard.fixedPerMonth * idx / DAYS_PER_MONTH);
      for (const m of s.mines || []) this.pl(s, this.segmentOfItem(this.mineSites()[m.site].res), 'fixed', B.mine.fixedPerMonth * idx / DAYS_PER_MONTH);
      for (const type in s.buildings) this.pl(s, this.segmentOfBuilding(type), 'fixed', (B[type].fixedPerMonth || 0) * s.buildings[type] * idx / DAYS_PER_MONTH);
      for (const p of s.plants) if (p.modules) this.pl(s, this.segmentOfBuilding(p.type), 'fixed', (B[p.type].fixedPerMonth || 0) * this.moduleCfg().fixedMul * p.modules * idx / DAYS_PER_MONTH);

      Market.dailyDecay(s);
      s.day++;

      // 5) 出荷日
      if (s.day % this.port(s).interval === 0) this.shipment(s);

      // 6) 月末処理
      if (s.day % DAYS_PER_MONTH === 0 && this.monthEnd(s)) stop = true;
      if (s.pendingEvents.length) stop = true;
      return stop;
    },

    monthEnd(s) {
      let stop = false;
      const m = s.month;
      // 融資の返済（元金均等＋利息）
      for (const id in s.loans) {
        const loan = s.loans[id], L = D().loans[id];
        const interest = loan.principal * L.rate / 12;
        const pr = Math.min(loan.monthly, loan.principal);
        loan.principal -= pr; s.cash -= interest + pr;
        m.interest += interest; m.principal += pr;
        if (loan.principal < 1) { delete s.loans[id]; this.log(s, `🏦 ${L.name}の借入を完済`); }
      }
      const odi = s.overdraft * D().overdraftRate / 12;
      s.cash -= odi; m.interest += odi;
      this.researchMonth(s);
      if (s.contracts) this.contractMonth(s);   // 違約金は当座貸越の判定より前
      // 資金不足は当座貸越で自動的に埋める
      if (s.cash < 0) {
        s.overdraft += -s.cash;
        this.log(s, `⚠️ 資金不足のため当座貸越 ${this.fmtMoney(-s.cash)}（年利${D().overdraftRate * 100}%）`);
        s.cash = 0;
      } else if (s.overdraft > 0) {
        const r = Math.min(s.overdraft, s.cash);
        s.overdraft -= r; s.cash -= r; m.principal += r;
      }
      const revenue = Object.values(m.revenue).reduce((a, b) => a + b, 0);
      const cost = m.purchase + m.opex + m.fixed + m.interest + (m.research || 0) + (m.penalty || 0) - (m.refund || 0);   // 自家発電の払い戻しは費用から引く（売上には入れない：運転資金枠の計算を変えないため）
      const prices = {};
      for (const k of D().productOrder) prices[k] = Market.price(s, k);
      const d = s.day - 1;
      s.history.push({
        y: D().startYear + Math.floor(d / DAYS_PER_YEAR), m: Math.floor((d % DAYS_PER_YEAR) / DAYS_PER_MONTH) + 1,
        prices, revenue, cost, profit: revenue - cost, capex: m.construction, principal: m.principal, borrowed: m.borrowed,
        cash: s.cash, debt: this.totalDebt(s),
        produced: { ...m.produced }, sold: { ...m.sold }, lostCrude: m.lostCrude, refined: m.refined,
        costs: { purchase: m.purchase, opex: m.opex, fixed: m.fixed, interest: m.interest, research: m.research || 0, refund: m.refund || 0, ...(m.penalty ? { penalty: m.penalty } : {}) }, segPL: this.roundSegPL(m.seg)
      });
      if (s.history.length > 600) s.history.shift();
      if (m.lostCrude > 1) this.log(s, `⚠️ 原油タンクが満杯で ${this.fmtNum(m.lostCrude)}bbl を採り損ねた`);
      s.month = emptyMonth();
      const ev = Market.monthly(s);
      if (ev) {
        this.log(s, `📰 ${ev.title}`);
        s.pendingEvents.push({ title: ev.title, text: ev.text, effects: ev.effects, months: ev.months });
        stop = true;
      }
      if (this.checkTiers(s)) stop = true;
      return stop;
    },

    // n日進める。止めるべき出来事が起きたらそこで止まる。進んだ日数を返す
    advanceDays(s, n, ignoreStops) {
      for (let i = 0; i < n; i++) {
        const stop = this.stepDay(s);
        if (ignoreStops) s.pendingEvents.length = 0;
        if (stop && !ignoreStops) return i + 1;
      }
      return n;
    },

    // ---------- 表示用 ----------
    fmtMoney(v) {
      const sign = v < 0 ? '-' : '';
      v = Math.abs(v);
      if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(2)}M`;
      if (v >= 1e4) return `${sign}$${Math.round(v / 1000).toLocaleString()}k`;
      return `${sign}$${Math.round(v).toLocaleString()}`;
    },
    fmtNum(v) { return Math.round(v).toLocaleString(); },
    fmtPrice(v) { return `$${v.toFixed(2)}`; }
  };
  window.Engine = Engine;
})();
