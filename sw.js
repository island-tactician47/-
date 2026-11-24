// 工場地帯シミュ：オフライン用のキャッシュ。http(s) で配信したときだけ使われる（file:// では登録されない）。内容を変えたら CACHE を上げる
const CACHE = 'factorysim-v12';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 保存済みを先に返し、裏で取り直して保存を更新する（stale-while-revalidate）。ページ切り替えのたびに25本ほどの確認の往復が起きて遅かったため。
  // 更新は、次に開いたときに反映される（1回遅れる）。保存が無いときだけ、ネットワークを待つ。
  e.respondWith(caches.open(CACHE).then(ch => ch.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => { if (r && r.status === 200) ch.put(e.request, r.clone()).catch(() => {}); return r; });
    if (hit) { net.catch(() => {}); return hit; }
    return net;
  })));
});
