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
        if (!def || !def.effects[k]) continue;
        const strength = ev.monthsLeft / ev.monthsTotal; // 時間とともに薄れる
        mul *= 1 + (def.effects[k] - 1) * Math.min(1, strength * 1.5);
      }
      return mul;
    },

    // いま売ったときの単価（手数料前）
    price(state, k) {
      const r = D().resources[k];
      const satEff = Math.min(0.5, SAT_IMPACT * state.market.sat[k] / r.marketDepth);
      return state.market.level[k] * this.eventMul(state, k) * (1 - satEff);
    },
    sellPrice(state, k) { return this.price(state, k) * (1 - SELL_FEE); },
    // 自社の売りによる飽和を除いた相場（採算の見積もりで、将来の飽和を別に織り込むときの基準）
    priceNoSat(state, k) { return state.market.level[k] * this.eventMul(state, k); },
    // 購入単価（自社の売りによる値崩れは関係なく、相場＋上乗せ）
    buyPrice(state, k) { return state.market.level[k] * this.eventMul(state, k) * (1 + BUY_PREMIUM); },

    // 売却：飽和が進むぶん平均単価で精算
    sellRevenue(state, k, qty) {
      const p0 = this.sellPrice(state, k);
      state.market.sat[k] += qty;
      const p1 = this.sellPrice(state, k);
      return qty * (p0 + p1) / 2;
    },

    dailyDecay(state) {
      for (const k in state.market.sat) state.market.sat[k] *= SAT_DECAY_PER_DAY;
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
        const candidates = E.list.filter(e => !state.activeEvents.some(a => a.id === e.id));
        const total = candidates.reduce((a, e) => a + e.weight, 0);
        let x = rng() * total;
        for (const e of candidates) {
          x -= e.weight;
          if (x <= 0) { this.startEvent(state, e.id); return e; }
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
