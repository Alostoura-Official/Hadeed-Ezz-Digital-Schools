const CACHE = 'hadid-eez-v34';

const ASSETS = [
  // ====== الصفحات ======
  './',
  './index.html',
  './homework.html',
  
  // ====== CSS ======
  './css/style.css',
  './css/css2.css',
  
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
   🟢 INSTALL — تخزين كل ملف بشكل مستقل
   ================================================================ */
self.addEventListener('install', (e) => {
  console.log('🔧 [SW] تثبيت:', CACHE);
  
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => {
        console.log('📦 [SW] جاري تخزين', ASSETS.length, 'ملف...');
        
        // ✅ كل ملف مستقل — لا يُلغي الباقي لو فشل
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
   🔵 ACTIVATE — حذف الكاش القديم
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
   📨 MESSAGE — رسائل من الصفحة
   ================================================================ */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    console.log('⚡ [SW] تفعيل فوري بطلب من الصفحة');
    self.skipWaiting();
  }
});

/* ================================================================
   🟣 FETCH — استراتيجية ذكية
   ================================================================ */
self.addEventListener('fetch', (e) => {
  const { request } = e;

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // تجاهل الطلبات الخارجية (Google Fonts لها كاش خاص بالمتصفح)
  if (url.origin !== self.location.origin) return;

  /* ---------- 1) الصفحات (Navigate / Document) ---------- */
  if (request.mode === 'navigate' || request.destination === 'document') {
    e.respondWith(
      caches.match(request, { ignoreSearch: true })
        .then((cached) => {
          // 🌐 تحديث في الخلفية
          const networkUpdate = fetch(request)
            .then((response) => {
              if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE).then((c) => c.put(request, copy));
              }
              return response;
            })
            .catch(() => null);

          // 🎯 Cache First + Network Update
          return cached || networkUpdate.then((r) => {
            if (r) return r;
            
            // 🆘 Fallback: افتح index.html أو homework.html
            return caches.match('./index.html')
              .then((fallback) => fallback || caches.match('./homework.html'))
              .then((fallback) => fallback || new Response(
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
              ));
          });
        })
    );
    return;
  }

  /* ---------- 2) الملفات الثابتة ---------- */
  e.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (!response || !response.ok) {
              throw new Error('Bad response');
            }
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return response;
          })
          .catch(() => {
            // 🖼️ Fallback للصور
            if (request.destination === 'image') {
              return caches.match('./icons/logo.png')
                .then((r) => r || new Response('', { status: 404 }));
            }
            return new Response('', { status: 404 });
          });
      })
  );
});
