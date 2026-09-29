const CACHE = 'aip2026-v1.3.2';
// 전시장 와이파이가 약해도 배치도를 볼 수 있도록 미리 저장합니다.
const PRECACHE = ['./', './index.html', './floor-plan.png', './manifest.json',
  ...['E3','E4','E5','E6','E7','N1','N2','N3','N4','N5'].map(h => `./plans/${h}.jpg`)];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 네트워크 우선 → 실패 시 캐시
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
