const CACHE_NAME = 'pixel-gacha-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Cache các link CDN bên ngoài để load nhanh hơn khi offline
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=VT323&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Sự kiện Install: Xảy ra khi Service Worker được cài đặt lần đầu
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Đang cache dữ liệu offline...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Sự kiện Fetch: Bắt mọi yêu cầu mạng của trang web
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Nếu tìm thấy file trong cache, trả về file đó (ngay cả khi rớt mạng)
                if (response) {
                    return response;
                }
                // Nếu không có trong cache, tải từ Internet bình thường
                return fetch(event.request);
            })
    );
});

// Sự kiện Activate: Dọn dẹp cache cũ khi có phiên bản mới
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

