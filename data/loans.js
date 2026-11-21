// 融資枠（4つ）。各枠につき借入は1本。毎月、元金均等＋利息を自動で返済する。繰上返済も可。
// limit は1950年価格（物価に合わせて増える）。condition は借りられる条件。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.loans = {
  shinkin:  { name: '港町信用金庫', limit: 80000,   rate: 0.07,  years: 5,  cond: null, condText: '条件なし' },
  chigin:   { name: '地方銀行',     limit: 300000,  rate: 0.055, years: 10, cond: { wells: 3 }, condText: '油井3本以上' },
  kaigin:   { name: '開発銀行（産業振興融資）', limit: 500000, rate: 0.035, years: 15, cond: { revenue12: 100000 }, condText: '直近12か月の売上 $100k以上' },
  toshigin: { name: '都市銀行',     limit: 1500000, rate: 0.045, years: 10, cond: { refinery: true, revenue12: 800000 }, condText: '製油所が稼働中かつ直近12か月の売上 $800k以上' }
};
// 資金がマイナスになったときに自動で入る当座貸越（高金利。資金がプラスになれば自動で返す）
GAME_DATA.overdraftRate = 0.12;
