// Service Worker：初回アクセス時にファイル一式を端末に保存し、以後オフラインで動かす
const CACHE = "kintore-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./apple-touch-icon.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  // 古いバージョンのキャッシュを削除
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // キャッシュ優先（オフラインでも即表示）。無ければネットワークへ
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});
