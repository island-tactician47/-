// 融資枠（4つ）。各枠につき借入は1本。毎月、元金均等＋利息を自動で返済する。繰上返済も可。
// limit は1950年価格（物価に合わせて増える）。condition は借りられる条件。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.loans = {
  shinkin:  { name: '港町信用金庫', limit: 80000,   rate: 0.07,  years: 5,  cond: null, condText: '条件なし' },
  chigin:   { name: '地方銀行',     limit: 300000,  rate: 0.055, years: 10, cond: { wells: 3 }, condText: '油井3本以上' },
  kaigin:   { name: '開発銀行（産業振興融資）', limit: 500000, rate: 0.035, years: 15, cond: { revenue12: 100000 }, condText: '直近12か月の売上 $100k以上' },
  rebuild:  { name: '再建融資（メインバンク）', limit: 0, rate: 0.06, years: 20, cond: null, condText: '債務の再編でのみ', special: true },   // 債務の再編（GAME_DATA.restructure）でだけ生まれる枠。通常は借りられない
  toshigin: { name: '都市銀行',     limit: 1500000, rate: 0.045, years: 10, cond: { refinery: true, revenue12: 800000 }, condText: '製油所が稼働中かつ直近12か月の売上 $800k以上' }
};
// 債務の再編（借金で首が回らなくなったときの救済）：すべての借入と当座貸越を、メインバンクの「再建融資」1本にまとめる。
// 返済が長くなり（years）月々が軽くなる代わりに、手数料（fee）と、しばらく新しく借りられない期間（lockMonths）がある。やり直しは cooldownMonths 空ける。
// 条件（苦しいとき）：当座貸越が枠いっぱい（売上の25%）に近い、または月々の返済（元金＋利息）が直近の月平均売上の distressRatio 以上。
GAME_DATA.restructure = { name: '再建融資（メインバンク）', rate: 0.06, years: 20, fee: 0.02, lockMonths: 60, cooldownMonths: 60, distressRatio: 0.5 };
// 資金がマイナスになったときに自動で入る当座貸越（高金利。資金がプラスになれば自動で返す）
GAME_DATA.overdraftRate = 0.12;
