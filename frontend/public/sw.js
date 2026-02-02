// NeuroLeaf Service Worker
// Enables offline mood logging and caching

const CACHE_NAME = 'neuroleaf-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/dashboard',
    '/mood',
    '/journal',
    '/offline.html',
    '/manifest.json',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Precaching app shell');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API requests (they should always be fresh)
    if (url.pathname.startsWith('/api')) return;

    // Skip cross-origin requests
    if (url.origin !== location.origin) return;

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version, but fetch updated version in background
                event.waitUntil(
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, networkResponse.clone());
                            });
                        }
                    }).catch(() => {
                        // Network failed, that's okay - we served from cache
                    })
                );
                return cachedResponse;
            }

            // Not in cache, try network
            return fetch(request)
                .then((networkResponse) => {
                    // Cache successful responses
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Network failed and not in cache - show offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});

// Handle background sync for offline mood entries
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-mood-entries') {
        event.waitUntil(syncMoodEntries());
    }
});

async function syncMoodEntries() {
    try {
        // Get pending mood entries from IndexedDB
        const db = await openMoodDB();
        const pendingEntries = await db.getAll('pending_moods');

        for (const entry of pendingEntries) {
            try {
                await fetch('/api/v1/mood/entry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entry.data),
                });
                // Remove from pending after successful sync
                await db.delete('pending_moods', entry.id);
                console.log('[SW] Synced mood entry:', entry.id);
            } catch (error) {
                console.error('[SW] Failed to sync mood entry:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

function openMoodDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('neuroleaf-offline', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve({
            getAll: (store) => {
                return new Promise((res, rej) => {
                    const tx = request.result.transaction(store, 'readonly');
                    const req = tx.objectStore(store).getAll();
                    req.onsuccess = () => res(req.result);
                    req.onerror = () => rej(req.error);
                });
            },
            delete: (store, key) => {
                return new Promise((res, rej) => {
                    const tx = request.result.transaction(store, 'readwrite');
                    const req = tx.objectStore(store).delete(key);
                    req.onsuccess = () => res();
                    req.onerror = () => rej(req.error);
                });
            }
        });

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pending_moods')) {
                db.createObjectStore('pending_moods', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/dashboard',
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'NeuroLeaf', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
