// セーブ（全ページで共有。localStorageに1スロット）
(function () {
  const KEY = 'factorySim.save.v3';
  const OLD_KEY = 'factorySim.save.v2';
  const VERSION = 3;
  // セーブとして最低限使える形か。問題があれば理由の文字列、なければ null
  // （壊れたデータを保存すると launcher ごと開けなくなるので、load と importText の両方で見る）
  function problem(s) {
    if (!s || typeof s !== 'object') return '中身が空';
    if (s.version !== VERSION) return `形式が違う（version ${s.version}）`;
    const isObj = v => v && typeof v === 'object';
    for (const k of ['inventory', 'hold', 'buildings', 'leases', 'loans', 'month']) if (!isObj(s[k])) return `${k} が無い`;
    if (!isObj(s.market) || !isObj(s.market.level) || !isObj(s.market.sat)) return 'market が無い';
    if (!Array.isArray(s.wells) || !Array.isArray(s.history) || !Array.isArray(s.construction)) return '配列が無い';
    if (typeof s.day !== 'number' || typeof s.cash !== 'number') return 'day / cash が無い';
    if (!window.GAME_DATA || !Object.prototype.hasOwnProperty.call(GAME_DATA.difficulties, s.difficulty)) return `難易度が不明（${s.difficulty}）`;
    if (!isObj(s.settings) || !isObj(s.refinery) || !Array.isArray(s.log) || !Array.isArray(s.pendingEvents)) return 'settings / refinery / log / pendingEvents が無い';
    return null;
  }
  function thin(state, keep) {
    const h = state.history || [];
    for (let i = 0; i < h.length - keep; i++) { const e = h[i]; delete e.prices; delete e.produced; delete e.consumed; delete e.sold; delete e.segPL; }
    return JSON.stringify(state);
  }
  const Save = {
    VERSION, problem,
    exists() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } },
    // 旧バージョン（v2）のセーブが残っているか。引き継げないので launcher で案内する
    hasOld() { try { return !!localStorage.getItem(OLD_KEY); } catch (e) { return false; } },
    load() {
      try {
        const t = localStorage.getItem(KEY);
        if (!t) return null;
        const s = JSON.parse(t);
        const p = problem(s);
        if (p) { console.warn('セーブを読み込まない：' + p); return null; }
        return s;
      } catch (e) { console.error('セーブの読み込みに失敗', e); return null; }
    },
    // 保存。localStorage の容量（約5MB）を超えると setItem が失敗して「前のセーブ」に戻ってしまうので、
    // 失敗したら古い月次履歴の細目（相場・生産・消費・出荷・本部別損益。直近36か月しか使わない）を捨てて再試行する
    save(state) {
      state.lastReal = Date.now();
      let text = JSON.stringify(state);
      if (text.length > 2.5e6) text = thin(state, 36);
      for (let keep = 36; ; keep = keep > 12 ? 12 : 0) {
        try { localStorage.setItem(KEY, text); Save.failed = false; return true; }
        catch (e) {
          console.error('セーブに失敗', e);
          if (keep === 0) { Save.failed = true; return false; }
          text = thin(state, keep);
        }
      }
    },
    failed: false,
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
    exportText() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } },
    importText(t) {
      const s = JSON.parse(t);
      const p = problem(s);
      if (p) throw new Error(p);
      localStorage.setItem(KEY, t);
    }
  };
  window.Save = Save;
})();
