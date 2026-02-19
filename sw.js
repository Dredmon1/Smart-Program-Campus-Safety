// SoCal-SMART Command System — Service Worker (PWA)
const CACHE_NAME = 'scs-command-v2';
const ASSETS = [
    '/',
    '/SMART%20Program%20Campus%20Safety%20Optimization.html',
    '/smart-app.js',
    '/smart-styles.css',
    '/manifest.json'
];

// Install — cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching core assets');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
