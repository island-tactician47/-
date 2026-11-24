// 市場：価格変動（平均回帰＋景気循環＋イベント）と需要の飽和
(function () {
  const D = () => window.GAME_DATA;
  const SAT_DECAY_PER_DAY = 0.977;   // 飽和は約1か月で半分に戻る
  const SAT_IMPACT = 0.15;           // 飽和1単位（marketDepth分）あたりの値下がり
  const SELL_FEE = 0.02;             // 売却手数料・運賃
  const BUY_PREMIUM = 0.04;          // 購入時の上乗せ

  function randn(rng) {
    let u = 0, v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  const Market = {
    SELL_FEE, BUY_PREMIUM, SAT_IMPACT, SAT_DECAY_PER_DAY,

    // 自社で作れる品目の集合（データから一度だけ作る）：加工設備のレシピの出力・鉱区の鉱石・精製の産出・原油（油井）。exempt（天然ガス）は除く
    producible() {
      const G = D();
      if (G._producible) return G._producible;
      const set = { crude: true };
      for (const id in G.recipes || {}) for (const k in G.recipes[id].outputs) set[k] = true;
      for (const id in G.mineSites || {}) set[G.mineSites[id].res] = true;
      for (const m in G.distillModes || {}) for (const k in G.distillModes[m].yields) set[k] = true;
      for (const k of (G.importPremium && G.importPremium.exempt) || []) delete set[k];
      Object.defineProperty(G, '_producible', { value: set, enumerable: false });
      return set;
    },
    importExtra(k) { const ip = D().importPremium; return ip && this.producible()[k] ? ip.extra : 0; },

    init(state) {
      const m = { level: {}, sat: {}, cyclePhase: Math.random() * Math.PI * 2 };
      for (const k of D().productOrder) {
        m.level[k] = D().resources[k].basePrice;
        m.sat[k] = 0;
      }
      state.market = m;
      state.activeEvents = [];
    },

    // 品目が増えた後に古いセーブを読んだとき、欠けた品目の相場を補う（Engine.normalize から呼ぶ）
    // 補完された品目は productOrder に入っているときだけ価格が動き、出荷される
    ensure(state) {
      const m = state.market;
      for (const k in D().resources) {
        if (m.level[k] === undefined) m.level[k] = D().resources[k].basePrice * this.priceIndex(state);   // 物価上昇後のセーブでも相場から大きく外れないよう
        if (m.sat[k] === undefined) m.sat[k] = 0;
      }
    },

    priceIndex(state) { return Math.pow(1 + D().inflationPerYear, state.day / 360); },

    eventMul(state, k) {
      let mul = 1;
      for (const ev of state.activeEvents) {
        const def = D().events.list.find(e => e.id === ev.id);
        const f = !def ? 0 : (def.effects[k] || def.all);   // 品目の指定が無ければ、全品目の倍率（all）
        if (!f) continue;
        const strength = ev.monthsLeft / ev.monthsTotal; // 時間とともに薄れる
        mul *= 1 + (f - 1) * Math.min(1, strength * 1.5);
      }
      return mul;
    },

    // いま売ったときの単価（手数料前）
    priceBase(state, k) {
      const r = D().resources[k];
      const satEff = Math.min(0.5, SAT_IMPACT * state.market.sat[k] / r.marketDepth);
      return state.market.level[k] * this.eventMul(state, k) * (1 - satEff);
    },
    price(state, k) { return this.priceBase(state, k) * this.demandMul(state, k); },
    sellPrice(state, k) { return this.price(state, k) * (1 - SELL_FEE); },
    // 自社の売りによる飽和を除いた相場（採算の見積もりで、将来の飽和を別に織り込むときの基準）
    priceNoSat(state, k) { return state.market.level[k] * this.eventMul(state, k); },
    // 購入単価（自社の売りによる値崩れは関係なく、相場＋上乗せ）
    buyPrice(state, k) { return state.market.level[k] * this.eventMul(state, k) * (1 + BUY_PREMIUM + this.importExtra(k)); },

    // 売却：飽和が進むぶん平均単価で精算
    sellRevenue(state, k, qty) {
      const r = D().resources[k], steps = r && r.demandSteps;
      const p0 = this.priceBase(state, k) * (1 - SELL_FEE);
      state.market.sat[k] += qty;
      const p1 = this.priceBase(state, k) * (1 - SELL_FEE), avg = (p0 + p1) / 2;
      if (!steps) return qty * avg;
      // 需要の段：1基ずつ、直近に売った数の段の価格で売る（端数は按分）。売った記録は state.market.recent に残す（最初の売却まで作らない）
      const rec = (state.market.recent || (state.market.recent = {}))[k] || (state.market.recent[k] = []);
      const from = state.day - (r.demandDays || 300); while (rec.length && rec[0].d <= from) rec.shift();
      let pos = 0; for (const e of rec) pos += e.q;
      let rem = qty, tot = 0;
      while (rem > 1e-9) { const idx = Math.floor(pos + 1e-9), m = steps[Math.min(steps.length - 1, idx)], seg = idx >= steps.length - 1 ? rem : Math.min(rem, idx + 1 - pos); tot += seg * avg * m; pos += seg; rem -= seg; }
      rec.push({ d: state.day, q: qty });
      return tot;
    },

    // 品目ごとの飽和の戻り方（resources の satDecay。無ければ全品目共通の 0.977/日＝約1か月で半分）
    satDecayOf(k) { const r = D().resources[k]; return (r && r.satDecay) || SAT_DECAY_PER_DAY; },
    // 月に Q を売ったときの、売るときの平均の飽和＝Q×この係数。共通の戻り方なら約1.5（定常のピークは約2Q）。遅い戻り方なら 0.5＋f/(1−f)（f＝30日の残り率）
    satAvgFactor(k) { const d = this.satDecayOf(k); if (d === SAT_DECAY_PER_DAY) return 1.5; const f = Math.pow(d, 30); return 0.5 + f / (1 - f); },
    // ---- 需要の段（Tier 6 の最終プロジェクト：resources の demandSteps・demandDays）----
    // 直近 demandDays 日に売った数に応じて、次の1基の価格が段で下がる。steps[n]＝直近に n 基売ったあとの次の1基の価格（満額＝1）。無い品目は 1
    demandCount(state, k) { const r = D().resources[k], rec = state.market.recent && state.market.recent[k]; if (!r || !r.demandSteps || !rec) return 0; const from = state.day - (r.demandDays || 300); let n = 0; for (const e of rec) if (e.d > from) n += e.q; return n; },
    demandMul(state, k) { const r = D().resources[k]; if (!r || !r.demandSteps) return 1; const n = this.demandCount(state, k); return r.demandSteps[Math.min(r.demandSteps.length - 1, Math.floor(n + 1e-9))]; },
    dailyDecay(state) {
      for (const k in state.market.sat) state.market.sat[k] *= this.satDecayOf(k);
    },

    // 月次の相場更新。イベントが起きたらそれを返す
    monthly(state, rng) {
      rng = rng || Math.random;
      const idx = this.priceIndex(state);
      const months = state.day / 30;
      const cycle = 1 + 0.06 * Math.sin(2 * Math.PI * months / 84 + state.market.cyclePhase);
      for (const k of D().productOrder) {
        const r = D().resources[k];
        const target = r.basePrice * idx * cycle;
        const lp = Math.log(state.market.level[k]);
        const next = lp + 0.15 * (Math.log(target) - lp) + r.volatility * randn(rng);
        state.market.level[k] = Math.exp(next);
      }
      // イベントの経過
      for (const ev of state.activeEvents) ev.monthsLeft--;
      state.activeEvents = state.activeEvents.filter(ev => ev.monthsLeft > 0);
      // 新しいイベントの抽選
      const E = D().events;
      if (rng() < E.monthlyChance) {
        // その本部の事業をしていないときは、その本部のイベントは起こさない。本部（と景気全般＝segment 無し）を均等に選んでから、その中で重みで選ぶ
        const ok = e => !(e.minYears && state.day < e.minYears * 360) && !state.activeEvents.some(a => a.id === e.id || (e.excl && (D().events.list.find(d => d.id === a.id) || {}).excl === e.excl)) && (!e.segment || !window.Engine || !Engine.segmentActive || Engine.segmentActive(state, e.segment)) && (!e.building || !window.Engine || Engine.count(state, e.building) > 0);   // building＝その工場を持っているときだけ起こす
        const groups = {};
        for (const e of E.list) if (ok(e)) (groups[e.segment || '*'] = groups[e.segment || '*'] || []).push(e);
        const keys = Object.keys(groups);
        if (keys.length) {
          const g = groups[keys[Math.min(keys.length - 1, Math.floor(rng() * keys.length))]], total = g.reduce((a, e) => a + e.weight, 0);
          let x = rng() * total;
          for (const e of g) {
            x -= e.weight;
            if (x <= 0) { this.startEvent(state, e.id); return e; }
          }
        }
      }
      return null;
    },

    startEvent(state, id) {
      const def = D().events.list.find(e => e.id === id);
      if (!def) return null;
      state.activeEvents = state.activeEvents.filter(a => a.id !== id);
      state.activeEvents.push({ id, monthsLeft: def.months, monthsTotal: def.months });
      return def;
    }
  };
  window.Market = Market;
})();
