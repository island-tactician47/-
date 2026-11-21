// 研究開発（段階2c。最小限）。file:// で開いても動くよう、JSではなく代入形式
// GAME_DATA.research[id] = {
//   name, icon, desc
//   tier:   このティアに入っていると始められる
//   cost:   総額（1950年ドル。支払い時に物価指数を掛ける）。months か月かけて毎月均等に払う
//   months: 期間（か月）
//   requires: 先に完了している必要のある研究のid（任意）
// }
// 進め方：同時に1件だけ。研究棟（buildings.researchLab）が1棟以上必要。月末に、現金が月額以上あり当座貸越が無いときだけ払って進む（足りない月は止まる）。
//   1か月の進み＝基礎（1＋0.3×(棟数−1)）×加速（×1〜×(1+棟数)、最大×4）。月額＝cost/months×進み×(1+0.15×(加速−1))。つまり加速するほど総額が割高（×2で1.15倍、×4で1.45倍）で、棟を増やすと総額そのままに速くなる。完了で、
//   buildings[].research / recipes[].research がその研究のidを指す設備・レシピが使えるようになる。途中で中止すると進捗は失われ、支払い済みは戻らない。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.research = {
  pharma:     { name: '製薬の研究',     icon: '💊', tier: 5, cost: 1000000, months: 36, desc: '化学プラントで医薬原料が作れ、製薬工場が建てられる' },
  explosives: { name: '火薬・推進剤の研究', icon: '💥', tier: 5, cost: 800000,  months: 24, desc: '化学プラントで天然ガスから火薬が作れる' },
  rocketry:   { name: 'ロケット工学',   icon: '🛰️', tier: 5, cost: 2000000, months: 48, requires: ['explosives'], desc: 'ロケット工場が建てられる' },
  arms:       { name: '兵器開発',       icon: '🎖️', tier: 5, cost: 1200000, months: 36, requires: ['explosives'], desc: '軍需工場が建てられる' }
};
