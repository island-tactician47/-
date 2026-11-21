// 工場地帯シミュ：オフライン用のキャッシュ。http(s) で配信したときだけ使われる（file:// では登録されない）。内容を変えたら CACHE を上げる
const CACHE = 'factorysim-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { if (r.status === 200) { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)).catch(() => {}); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
