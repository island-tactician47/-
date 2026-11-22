// 港のグレード。interval日ごとに、在庫のうち売れる分を capacity まで一括出荷する。
// 出荷は単価の高い品目から順に積む。原油は製油所が次の出荷日までに使う分を残す。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.portGrades = [
  { name: '漁港',             interval: 30, capacity: 15000, desc: '小型船で月末に1回出荷' },
  { name: '桟橋つき漁港',     interval: 15, capacity: 15000, cost: 40000,  months: 4,  desc: '月2回（15日・月末）出荷' },
  { name: '商業港',           interval: 15, capacity: 45000, cost: 250000, months: 12, desc: '大型船が入れる。月2回・1回45,000bbl' },
  { name: '石油積出港',       interval: 10, capacity: 90000, cost: 900000, months: 24, desc: 'タンカー桟橋。月3回・1回90,000bbl' },
  { name: '国際貿易港',       interval: 5,  capacity: 300000, cost: 3500000, months: 36, desc: 'コンテナ・バルクの専用岸壁。5日おき・1回300,000枠（日量6万枠）' },
  { name: '大規模国際ハブ港', interval: 5,  capacity: 1e9, cost: 12000000, months: 48, desc: '出荷枠の上限なし。在庫の売れる分は、出荷日にすべて売れる（最終段階）' }
];
