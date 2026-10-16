const CACHE = 'hadid-eez-v93';

const ASSETS = [
  // ====== الصفحات ======
  './',
  './index.html',
  './homework.html',
  './books.html',

  // ====== CSS ======
  './css/style.css',
  './css/css2.css',
  './css/books.css',

  // ====== الخطوط العربية المحلية ======
  './css/fonts/tajawal-400-arabic.woff2',
  './css/fonts/tajawal-400-latin.woff2',
  './css/fonts/tajawal-500-arabic.woff2',
  './css/fonts/tajawal-500-latin.woff2',
  './css/fonts/tajawal-700-arabic.woff2',
  './css/fonts/tajawal-700-latin.woff2',
  './css/fonts/tajawal-800-arabic.woff2',
  './css/fonts/tajawal-800-latin.woff2',

  // ====== JavaScript ======
  './js/app.js',
  './js/books.js',
  './js/lib/pdf.min.js',
  './js/lib/pdf.worker.min.js',
  './js/lib/qrcode.min.js',

  // ====== Manifest ======
  './manifest.json',

  // ====== الأيقونات ======
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/splash.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  './icons/apple-touch-icon.png',
  './icons/logo.png'
];

/* ================================================================
   🟢 INSTALL
   ================================================================ */
self.addEventListener('install', (e) => {
  console.log('🔧 [SW] تثبيت:', CACHE);

  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => {
        console.log('📦 [SW] جاري تخزين', ASSETS.length, 'ملف...');
        return Promise.allSettled(
          ASSETS.map((url) =>
            cache.add(url)
              .then(() => console.log('  ✅', url))
              .catch((err) => console.warn('  ⚠️ فشل:', url, err.message))
          )
        );
      })
      .then((results) => {
        const ok = results.filter(r => r.status === 'fulfilled').length;
        console.log(`✅ [SW] تم تثبيت ${ok}/${ASSETS.length} ملف`);
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('❌ [SW] فشل التثبيت:', err);
        return self.skipWaiting();
      })
  );
});

/* ================================================================
   🔵 ACTIVATE
   ================================================================ */
self.addEventListener('activate', (e) => {
  console.log('🚀 [SW] تفعيل:', CACHE);

  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && k.startsWith('hadid-eez-'))
            .map((k) => {
              console.log('🗑️ [SW] حذف كاش قديم:', k);
              return caches.delete(k);
            })
        )
      )
      .then(() => {
        console.log('✅ [SW] تم التفعيل');
        return self.clients.claim();
      })
  );
});

/* ================================================================
   📨 MESSAGE — تفعيل فوري
   ================================================================ */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    console.log('⚡ [SW] تفعيل فوري بطلب من الصفحة');
    self.skipWaiting();
    // 🚀 أبلغ كل التابات المفتوحة تعمل reload
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'RELOAD' });
      });
    });
  }
});

/* ================================================================
   🟣 FETCH — استراتيجيات ذكية
   ================================================================ */
self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // تجاهل الطلبات الخارجية
  if (url.origin !== self.location.origin) return;

  // تجاهل قنوات chrome-extension وغيرها
  if (!url.protocol.startsWith('http')) return;

  /* ---------- 1) الصفحات: Network First ---------- */
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // 🔻 فشل الشبكة → من الكاش
          return caches.match(request, { ignoreSearch: true })
            .then((cached) => cached
              || caches.match('./index.html')
              || caches.match('./homework.html')
              || offlineFallback()
            );
        })
    );
    return;
  }

  /* ---------- 2) CSS / JS / JSON: Stale-While-Revalidate ---------- */
  // ⬅️ 🔥 ده الحل الأساسي: بيعرض الكاش فوراً + يحدّث في الخلفية
  const isCodeOrData =
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.mjs');

  if (isCodeOrData) {
    e.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((c) => c.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);   // فشل الشبكة → الكاش

        // لو موجود في الكاش: رجّعه فوراً + حدّث في الخلفية
        return cached || networkFetch;
      })
    );
    return;
  }

  /* ---------- 3) صور / خطوط / باقي الملفات: Cache First ---------- */
  e.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (!response || !response.ok) throw new Error('Bad response');
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return response;
          })
          .catch(() => {
            if (request.destination === 'image') {
              return caches.match('./icons/logo.png')
                .then((r) => r || new Response('', { status: 404 }));
            }
            return new Response('', { status: 404 });
          });
      })
  );
});

/* ================================================================
   🆘 صفحة عدم الاتصال
   ================================================================ */
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>لا يوجد اتصال</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 80px 20px;
          background: #f0ebf8;
          color: #202124;
          direction: rtl;
        }
        h1 { color: #ea7c0c; font-size: 32px; }
        p { font-size: 16px; line-height: 1.8; margin-top: 20px; }
        .hint {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          max-width: 400px;
          margin: 30px auto;
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }
      </style>
    </head>
    <body>
      <h1>📴 لا يوجد اتصال</h1>
      <div class="hint">
        <p><b>افتح الموقع مرة واحدة على الأقل بالإنترنت</b></p>
        <p>حتى يتم تخزينه والعمل بدون اتصال بعد ذلك.</p>
      </div>
    </body>
    </html>`,
    {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    }
  );
}
