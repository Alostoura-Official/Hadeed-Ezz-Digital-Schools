const CACHE = 'hadid-eez-v101';

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

  // ====== PDF.js CMap ======
  './js/lib/cmaps/Adobe-Japan1-0.bcmap',
  './js/lib/cmaps/Adobe-GB1-0.bcmap',
  './js/lib/cmaps/Adobe-CNS1-0.bcmap',
  './js/lib/cmaps/Adobe-Korea1-0.bcmap',
  './js/lib/cmaps/LICENSE',

  // ====== PDF.js Standard Fonts ======
  './js/lib/standard_fonts/FoxitSans.pfb',
  './js/lib/standard_fonts/FoxitSerif.pfb',
  './js/lib/standard_fonts/FoxitSymbol.pfb',
  './js/lib/standard_fonts/FoxitDingbats.pfb',
  './js/lib/standard_fonts/LiberationSans-Regular.ttf',
  './js/lib/standard_fonts/LiberationSans-Bold.ttf',
  './js/lib/standard_fonts/LiberationSans-Italic.ttf',
  './js/lib/standard_fonts/LiberationSans-BoldItalic.ttf',
  './js/lib/standard_fonts/LiberationSerif-Regular.ttf',
  './js/lib/standard_fonts/LiberationSerif-Bold.ttf',

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
   📨 MESSAGE
   ================================================================ */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    console.log('⚡ [SW] تفعيل فوري');
    self.skipWaiting();
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'RELOAD' });
      });
    });
  }
});

/* ================================================================
   🟣 FETCH
   ================================================================ */
self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
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

  /* ---------- 2) PDF Files: Cache First + Range Support ---------- */
  // 🔥 جديد: معالجة خاصة لملفات PDF
  if (url.pathname.endsWith('.pdf')) {
    e.respondWith(handlePdfRequest(request));
    return;
  }

  /* ---------- 3) CSS / JS / JSON: Stale-While-Revalidate ---------- */
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
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
    return;
  }

  /* ---------- 4) صور / خطوط / باقي الملفات: Cache First ---------- */
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
   📚 معالجة ملفات PDF مع دعم Range Requests
   ================================================================
   - إذا كان الملف في الكاش: نُرجع الجزء المطلوب فقط
   - إذا لم يكن في الكاش: نُحمّله من الشبكة ونخزّنه
   ================================================================ */
async function handlePdfRequest(request) {
  const url = request.url;
  const rangeHeader = request.headers.get('range');

  try {
    // 1. البحث في الكاش أولاً
    let cached = await caches.match(url, { ignoreSearch: true });

    // 2. إذا لم يكن في الكاش، حاول تحميله من الشبكة
    if (!cached) {
      try {
        console.log('📥 [SW] تحميل PDF من الشبكة:', url);
        const response = await fetch(request);
        if (response && response.ok) {
          const copy = response.clone();
          const cache = await caches.open(CACHE);
          await cache.put(url, copy);
          cached = response;
          console.log('✅ [SW] تم تخزين PDF:', url);
        }
      } catch (netErr) {
        console.warn('⚠️ [SW] فشل تحميل PDF من الشبكة:', netErr.message);
        return new Response('', { status: 404 });
      }
    }

    // 3. إذا لم نجد الملف في الكاش أو الشبكة
    if (!cached) {
      return new Response('', { status: 404 });
    }

    // 4. إذا لم يكن هناك طلب نطاق، أرجع الملف كاملاً
    if (!rangeHeader) {
      return cached;
    }

    // 5. معالجة طلب النطاق
    return await handleRangeRequest(cached, request);

  } catch (err) {
    console.error('❌ [SW] خطأ في معالجة PDF:', err);
    return new Response('', { status: 500 });
  }
}

/* ================================================================
   📦 معالجة طلبات النطاق (Range Requests)
   ================================================================ */
async function handleRangeRequest(cachedResponse, request) {
  try {
    const rangeHeader = request.headers.get('range');
    const blob = await cachedResponse.blob();
    const total = blob.size;

    // استخراج بداية ونهاية النطاق
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
    if (!match) return cachedResponse;

    const start = parseInt(match[1], 10);
    let end = match[2] ? parseInt(match[2], 10) : total - 1;

    // تصحيح النهاية إذا تجاوزت الحجم
    if (end >= total) end = total - 1;

    // إذا كانت البداية أكبر من النهاية، أرجع خطأ
    if (start > end || start >= total) {
      return new Response('', {
        status: 416,
        statusText: 'Range Not Satisfiable',
        headers: {
          'Content-Range': `bytes */${total}`
        }
      });
    }

    // قطع الجزء المطلوب
    const chunk = blob.slice(start, end + 1);

    // بناء الاستجابة
    return new Response(chunk, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Content-Length': String(chunk.size),
        'Accept-Ranges': 'bytes'
      }
    });

  } catch (err) {
    console.error('❌ [SW] خطأ في Range Request:', err);
    return cachedResponse;
  }
}

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
