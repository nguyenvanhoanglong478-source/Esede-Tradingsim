const CACHE_NAME = 'pixel-gacha-dynamic-cache';

// Danh sách các file cần lưu ngay từ đầu
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Sự kiện Install: Lưu bộ nhớ đệm lần đầu
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Ép service worker mới hoạt động ngay lập tức
});

// Sự kiện Activate: Dọn dẹp
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Sự kiện Fetch: CHIẾN LƯỢC NETWORK-FIRST (Ưu tiên tải từ mạng)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Nếu có mạng và tải thành công, lưu bản mới nhất vào cache
                return caches.open(CACHE_NAME).then(cache => {
                    // Chỉ cache các request hợp lệ
                    if (event.request.method === 'GET') {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                });
            })
            .catch(() => {
                // Nếu mất mạng hoặc GitHub lỗi, móc từ Cache ra dùng
                return caches.match(event.request);
            })
    );
});
