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
    if (!window.GAME_DATA || !GAME_DATA.difficulties[s.difficulty]) return `難易度が不明（${s.difficulty}）`;
    return null;
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
    save(state) {
      try { state.lastReal = Date.now(); localStorage.setItem(KEY, JSON.stringify(state)); return true; }
      catch (e) { console.error('セーブに失敗', e); return false; }
    },
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
