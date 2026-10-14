/* ================================================================
   📚 Books Library — JavaScript
   صفحة المكتبة الرقمية — مع ترجمة نصية وصوتية
   ================================================================ */
'use strict';

/* ================================================================
   1) 📋 إعدادات المكتبة
   ================================================================ */
const BOOKS_CONFIG = {

    /* ---------- 📗 عربي ---------- */
  arabic: {
    name: "لغة عربية",
    nameEn: "Arabic",
    icon: "📗",
    color: "#dc2626",
    folder: "books/arabic",
    books: [
      {
        title: "اللغة العربية — الصف الأول — الترم الأول",
        titleEn: "Arabic - Grade 1 - Term 1",
        file: "arabic-grade1-term1.pdf",
        cover: "cover.png"
      }
    ]
  },

  /* ---------- 🧪 كيمياء ---------- */
  chemistry: {
    name: "كيمياء",
    nameEn: "Chemistry",
    icon: "🧪",
    color: "#ea580c",
    folder: "books/chemistry",
    books: [
      {
        title: "الكيمياء العامة",
        titleEn: "General Chemistry",
        file: "book.pdf",
        cover: "cover.png"
      }
    ]
  },

  /* ---------- 🇬🇧 إنجليزي ---------- */
  english: {
    name: "لغة إنجليزية",
    nameEn: "English",
    icon: "🇬🇧",
    color: "#16a34a",
    folder: "books/english",
    books: [
      {
        title: "English Grammar",
        titleEn: "قواعد اللغة الإنجليزية",
        file: "book.pdf",
        cover: "cover.png"
      }
    ]
  },

  /* ---------- 🔢 رياضيات ---------- */
  math: {
    name: "رياضيات",
    nameEn: "Mathematics",
    icon: "🔢",
    color: "#7c3aed",
    folder: "books/math",
    books: [
      {
        title: "الرياضيات — الصف الأول — الترم الأول",
        titleEn: "Math - Grade 1 - Term 1",
        file: "math-g1-t1.pdf",
        cover: "cover.png"
      }
    ]
  },

  /* ---------- ⚙️ ميكاترونكس ---------- */
  mech: {
    name: "ميكاترونكس",
    nameEn: "Mechatronics",
    icon: "⚙️",
    color: "#2563eb",
    folder: "books/mech",
    books: [
      {
        title: "الوحدة 1 — الدرس 1",
        titleEn: "Unit 1 — Lesson 1",
        file: "mech-g1-t1-l1.pdf",
        cover: "cover.png"
      },
      {
        title: "الوحدة 1 — الدرس 2",
        titleEn: "Unit 1 — Lesson 2",
        file: "mech-g1-t1-l2.pdf",
        cover: "cover.png"
      },
      {
        title: "الوحدة 1 — الدرس 3",
        titleEn: "Unit 1 — Lesson 3",
        file: "mech-g1-t1-l3.pdf",
        cover: "cover.png"
      }
    ]
  },

  /* ---------- ⚛️ فيزياء ---------- */
  physics: {
    name: "فيزياء",
    nameEn: "Physics",
    icon: "⚛️",
    color: "#0891b2",
    folder: "books/physics",
    books: [
      {
        title: "الفيزياء العامة",
        titleEn: "General Physics",
        file: "book.pdf",
        cover: "cover.png"
      }
    ]
  }

};

/* ================================================================
   2) 🌐 حالة التطبيق (State Variables)
   ----------------------------------------------------------------
   - متغيرات عامة تُستخدم في كل دوال المكتبة
   - كل متغير له اسم فريد لتجنب التعارض مع app.js
   ================================================================ */

/** 🎯 الفلتر الحالي (all = كل المواد) */
let currentFilter = 'all';

/** 🔍 نص البحث الحالي */
let searchQuery = '';

/** 📖 المادة النشطة حالياً (null = عرض المواد) */
let activeSubject = null;

/** 📄 كائن PDF الحالي المحمّل في العارض */
let readerPdf = null;

/** 🔢 رقم الصفحة الحالية في العارض */
let readerPage = 1;

/** 🌐 لغة الترجمة الحالية (ar/en/it) */
let transLang = localStorage.getItem('books-trans-lang') || 'ar';

/** 👁️ هل لوحة الترجمة ظاهرة؟ */
let translationVisible = true;

/** ✅ النصوص المحددة حالياً */
let selectedTextSpans = [];

/** 🔍 مستوى التكبير في العارض (اسم فريد لتجنب تعارض app.js) */
let bookReaderZoom = 1;

/** ⏱️ مؤقت resize (اسم فريد) */
let bookResizeTimer = null;

/** 🔊 هل النطق التلقائي مفعّل؟ (يُحمَّل من localStorage) */
let autoSpeakEnabled = localStorage.getItem('books-auto-speak') !== '0';

/* ================================================================
   3) 🚀 التهيئة (Initialization)
   ----------------------------------------------------------------
   - تُنفَّذ مرة واحدة عند فتح الصفحة
   - تحمّل الثيم، الإعدادات، الفلاتر، المواد
   ================================================================ */
function initBooks() {
  console.log('📚 [books] بدء التهيئة...');

  /* 🎨 تحميل الثيم المحفوظ */
  const savedTheme = localStorage.getItem('mech-theme');
  if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '☀️';
  }

  /* 🔊 تحميل إعداد النطق التلقائي */
  autoSpeakEnabled = localStorage.getItem('books-auto-speak') !== '0';
  const autoSpeakBtn = document.getElementById('readerAutoSpeak');
  if (autoSpeakBtn) {
    autoSpeakBtn.classList.toggle('active', autoSpeakEnabled);
    autoSpeakBtn.textContent = autoSpeakEnabled ? '🔊' : '🔇';
  }

  /* 🌐 تحديث أزرار الترجمة */
  updateTransButtons();
  const readerTrans = document.getElementById('readerTrans');
  if (readerTrans) readerTrans.classList.add('active');

  /* 🎨 عرض الفلاتر والمواد */
  renderFilters();
  renderSubjects();

  /* 🔍 ربط صندوق البحث */
  const searchInput = document.getElementById('booksSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (activeSubject) {
        renderBooks(activeSubject);
      } else {
        renderSubjects();
      }
    });
  }

  /* ⌨️ زر Escape لإغلاق العارض */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const viewer = document.getElementById('readerViewer');
      if (viewer && viewer.classList.contains('show')) closeReader();
    }
  });

  console.log('✅ [books] جاهز');
}

/* ================================================================
   4) 🎨 الفلاتر (Filters)
   ----------------------------------------------------------------
   - renderFilters: يعرض أزرار تصفية المواد
   - setFilter: يفعّل فلتر مادة معينة
   ================================================================ */

/**
 * 🎨 عرض أزرار التصفية حسب المواد المتاحة
 */
function renderFilters() {
  const wrap = document.getElementById('booksFilters');
  if (!wrap) return;

  const subjectsWithBooks = Object.entries(BOOKS_CONFIG)
    .filter(([, s]) => s.books.length > 0);

  let html = `<button class="filter-chip active" data-subj="all" onclick="setFilter('all')">
    📚 الكل <span style="opacity:.7">(${subjectsWithBooks.reduce((a, [, s]) => a + s.books.length, 0)})</span>
  </button>`;

  subjectsWithBooks.forEach(([key, subj]) => {
    html += `<button class="filter-chip" data-subj="${key}" onclick="setFilter('${key}')">
      ${subj.icon} ${subj.name} <span style="opacity:.7">(${subj.books.length})</span>
    </button>`;
  });

  wrap.innerHTML = html;
}

/**
 * 🎯 تفعيل فلتر معين
 * @param {string} subjKey - مفتاح المادة ('all' أو اسم المادة)
 */
function setFilter(subjKey) {
  currentFilter = subjKey;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.subj === subjKey);
  });

  if (subjKey === 'all') {
    backToSubjects();
    renderSubjects();
  } else {
    openSubject(subjKey);
  }
}

/* ================================================================
   5) 🗂️ عرض المواد (Subjects Grid)
   ================================================================ */

/**
 * 🗂️ عرض شبكة المواد (بطاقات المواد)
 * - يطبّق فلتر البحث لو موجود
 * - يخفي شبكة الكتب ويظهر المواد
 */
function renderSubjects() {
  const grid = document.getElementById('subjectsGrid');
  const booksWrap = document.getElementById('booksGridWrap');
  const emptyState = document.getElementById('booksEmptyState');
  if (!grid) return;

  grid.style.display = 'grid';
  if (booksWrap) booksWrap.style.display = 'none';

  let subjects = Object.entries(BOOKS_CONFIG);

  /* 🔍 فلترة حسب البحث */
  if (searchQuery) {
    subjects = subjects.filter(([, s]) => {
      const inSubject = s.name.toLowerCase().includes(searchQuery) ||
                       s.nameEn.toLowerCase().includes(searchQuery);
      const inBooks = s.books.some(b =>
        b.title.toLowerCase().includes(searchQuery) ||
        b.titleEn.toLowerCase().includes(searchQuery)
      );
      return inSubject || inBooks;
    });
  }

  /* ❌ لا يوجد نتائج */
  if (subjects.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  /* 🎨 إنشاء البطاقات */
  grid.innerHTML = subjects.map(([key, subj]) => {
    const count = subj.books.length;
    const isEmpty = count === 0;
    return `
      <div class="subject-card" style="--sc:${subj.color}" onclick="openSubject('${key}')">
        <div class="subj-icon">${subj.icon}</div>
        <div class="subj-name">${esc(subj.name)}</div>
        <div class="subj-name-en">${esc(subj.nameEn)}</div>
        <div class="subj-count ${isEmpty ? 'empty' : ''}">
          ${isEmpty ? '📭 فارغ' : `📚 ${count} كتاب`}
        </div>
      </div>
    `;
  }).join('');

  updateCount(subjects.reduce((a, [, s]) => a + s.books.length, 0));
}

/* ================================================================
   6) 📖 فتح مادة (Open Subject)
   ================================================================ */

/**
 * 📖 فتح مادة معينة وعرض كتبها
 * @param {string} subjKey - مفتاح المادة
 */
function openSubject(subjKey) {
  const subj = BOOKS_CONFIG[subjKey];
  if (!subj) return;

  activeSubject = subjKey;

  const grid = document.getElementById('subjectsGrid');
  const booksWrap = document.getElementById('booksGridWrap');
  const title = document.getElementById('currentSubjectTitle');
  const count = document.getElementById('currentSubjectCount');

  if (grid) grid.style.display = 'none';
  if (booksWrap) booksWrap.style.display = 'block';
  if (title) title.textContent = `${subj.icon} ${subj.name} — ${subj.nameEn}`;
  if (count) count.textContent = `${subj.books.length} كتاب`;

  renderBooks(subjKey);

  /* 🎯 تمرير ذكي: بداية شبكة الكتب */
  setTimeout(() => {
    const booksWrap = document.getElementById('booksGridWrap');
    if (!booksWrap) return;

    const header = document.getElementById('appHeader');
    const headerH = header ? header.offsetHeight : 72;

    const targetTop = booksWrap.getBoundingClientRect().top + window.scrollY;
    const minScroll = targetTop - headerH - 20;

    window.scrollTo({
      top: Math.max(0, minScroll),
      behavior: 'smooth'
    });
  }, 80);
}

/**
 * ← العودة لعرض المواد (إغلاق مادة)
 */
function backToSubjects() {
  activeSubject = null;
  const grid = document.getElementById('subjectsGrid');
  const booksWrap = document.getElementById('booksGridWrap');
  if (grid) grid.style.display = 'grid';
  if (booksWrap) booksWrap.style.display = 'none';
  renderSubjects();

  /* 🎯 تمرير لأعلى المواد عند الرجوع */
  setTimeout(() => {
    const subjectsGrid = document.getElementById('subjectsGrid');
    if (!subjectsGrid) return;

    const header = document.getElementById('appHeader');
    const headerH = header ? header.offsetHeight : 72;

    const targetTop = subjectsGrid.getBoundingClientRect().top + window.scrollY;
    const minScroll = targetTop - headerH - 20;

    window.scrollTo({
      top: Math.max(0, minScroll),
      behavior: 'smooth'
    });
  }, 80);
}

/* ================================================================
   7) 📚 عرض الكتب (Books Grid)
   ================================================================ */

/**
 * 📚 عرض شبكة كتب مادة معينة
 * @param {string} subjKey - مفتاح المادة
 */
function renderBooks(subjKey) {
  const grid = document.getElementById('booksGrid');
  const emptyState = document.getElementById('booksEmptyState');
  if (!grid) return;

  const subj = BOOKS_CONFIG[subjKey];
  if (!subj) return;

  let books = subj.books;

  /* 🔍 فلترة حسب البحث */
  if (searchQuery) {
    books = books.filter(b =>
      b.title.toLowerCase().includes(searchQuery) ||
      b.titleEn.toLowerCase().includes(searchQuery)
    );
  }

  if (books.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    updateCount(0);
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  /* 🎨 إنشاء بطاقات الكتب — مع encodeURI لتجنب مشاكل المسافات */
  grid.innerHTML = books.map((book) => {
    const coverPath = encodeURI(`${subj.folder}/${book.cover}`);
    const filePath  = encodeURI(`${subj.folder}/${book.file}`);
    const safeTitle = esc(book.title);
    const safeTitleEn = esc(book.titleEn);

    return `
      <div class="book-card" style="--bc:${subj.color}"
           onclick="openReader('${filePath}', '${safeTitle}', '${subj.color}')">
        <div class="book-cover">
          <img src="${coverPath}" alt="${safeTitle}"
               loading="lazy"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;cover-fallback&quot;>📕</div>';">
          <div class="cover-overlay">
            <span class="read-btn">📖 اقرأ الآن</span>
          </div>
        </div>
        <div class="book-info">
          <div class="book-title">${safeTitle}</div>
          <div class="book-meta">
            <span>${safeTitleEn}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateCount(books.length);
}

/**
 * 🔢 تحديث عدد الكتب المعروضة
 * @param {number} n - عدد الكتب
 */
function updateCount(n) {
  const el = document.getElementById('booksCount');
  if (el) el.textContent = n > 0 ? `${n} كتاب` : '';
}

/* ================================================================
   8) 📖 عارض PDF (PDF Reader)
   ================================================================ */

/**
 * 📖 فتح كتاب في العارض
 * @param {string} filePath - مسار ملف PDF (مشفَّر مسبقاً)
 * @param {string} title - عنوان الكتاب
 * @param {string} color - لون المادة
 */
async function openReader(filePath, title, color) {
  if (typeof pdfjsLib === 'undefined') {
    showToast('❌ مكتبة عرض PDF لم تُحمَّل', 'error');
    return;
  }

  const viewer = document.getElementById('readerViewer');
  const overlay = document.getElementById('readerOverlay');
  const canvasWrap = document.getElementById('readerCanvasWrap');
  const titleEl = document.getElementById('readerTitle');
  const thumbs = document.getElementById('readerThumbs');

  if (!viewer || !canvasWrap) return;

  if (titleEl) titleEl.textContent = title;
  viewer.classList.add('show');
  if (overlay) overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  canvasWrap.innerHTML = '<div class="reader-loading">⏳ جارٍ تحميل الكتاب...</div>';
  if (thumbs) thumbs.innerHTML = '';

  try {
    /* 📥 تحميل PDF — بدون encodeURI إضافي (لأن filePath مُرمَّز مسبقاً) */
    const loadingTask = pdfjsLib.getDocument({
      url: filePath,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
      useSystemFonts: true
    });

    readerPdf = await loadingTask.promise;
    const totalEl = document.getElementById('readerTotal');
    if (totalEl) totalEl.textContent = readerPdf.numPages;

    await renderPage(1);
    buildThumbs().catch(e => console.warn('thumbs:', e));

  } catch (err) {
    console.error('❌ فشل تحميل الكتاب:', err);
    canvasWrap.innerHTML = `
      <div class="reader-loading">
        ❌ فشل تحميل الكتاب<br>
        <small style="font-size:12px;opacity:.8;line-height:1.8;display:block;margin-top:8px">
          ${esc(err.message || 'خطأ غير معروف')}<br>
          تأكد من وجود الملف في: <code>${esc(filePath)}</code>
        </small>
      </div>
    `;
    showToast('❌ فشل تحميل الكتاب', 'error');
  }
}

/**
 * 🔢 عرض صفحة معينة من الكتاب
 * @param {number} n - رقم الصفحة
 */
async function renderPage(n) {
  if (!readerPdf) return;
  if (n < 1 || n > readerPdf.numPages) return;

  readerPage = n;

  const curEl = document.getElementById('readerCur');
  const prevBtn = document.getElementById('readerPrev');
  const nextBtn = document.getElementById('readerNext');
  const canvasWrap = document.getElementById('readerCanvasWrap');

  if (curEl) curEl.textContent = n;
  if (prevBtn) prevBtn.disabled = n <= 1;
  if (nextBtn) nextBtn.disabled = n >= readerPdf.numPages;

  try {
    const page = await readerPdf.getPage(n);
    const containerW = canvasWrap.clientWidth - 40 || 800;
    const vp1 = page.getViewport({ scale: 1 });
    const baseScale = Math.min(containerW / vp1.width, 1.8);
    const scale = baseScale * bookReaderZoom;
    const vp = page.getViewport({ scale });

    /* 🎨 رسم الصفحة على canvas */
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = Math.floor(vp.width) + 'px';
    canvas.style.height = Math.floor(vp.height) + 'px';
    canvas.style.maxWidth = '100%';

    ctx.scale(dpr, dpr);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;

    canvasWrap.innerHTML = '';
    canvasWrap.appendChild(canvas);

    /* 🔤 بناء طبقة النص للترجمة */
    await buildTextLayer(page, vp, canvasWrap);

    /* 🎯 تمييز المصغرة الحالية */
    document.querySelectorAll('.reader-thumb').forEach((t, i) => {
      t.classList.toggle('on', i + 1 === n);
    });

    canvasWrap.scrollTop = 0;

  } catch (err) {
    console.error('renderPage:', err);
    if (canvasWrap) {
      canvasWrap.innerHTML = `<div class="reader-loading">❌ فشل عرض الصفحة ${n}</div>`;
    }
  }
}

/* ================================================================
   9) 🔤 طبقة النص (Text Layer)
   ----------------------------------------------------------------
   - تضيف طبقة شفافة فوق الـ canvas
   - كل جملة نصية تُصبح قابلة للضغط
   - عند الضغط: ترجمة فورية
   ================================================================ */

/**
 * 🔤 بناء طبقة النص القابل للضغط
 * @param {Object} page - كائن الصفحة من pdfjs
 * @param {Object} viewport - الأبعاد
 * @param {HTMLElement} container - الحاوية
 */
async function buildTextLayer(page, viewport, container) {
  try {
    const textContent = await page.getTextContent();
    const layer = document.createElement('div');
    layer.className = 'text-layer';
    layer.style.width = viewport.width + 'px';
    layer.style.height = viewport.height + 'px';

    textContent.items.forEach(item => {
      if (!item.str || !item.str.trim()) return;

      /* 📐 حساب موضع النص في PDF */
      const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);

      /* 🔤 حجم الخط */
      const fontHeight = Math.hypot(tx[2], tx[3]);

      /* 📍 موضع البداية (يسار) */
      const left = tx[4];

      /* 📍 موضع الخط السفلي للحرف (baseline) */
      const baseline = tx[5];

      /* 📐 الارتفاع الكامل للعنصر حسب PDF.js */
      const totalHeight = item.height ? item.height * viewport.scale : fontHeight;

      /* ✅ top الصحيح = baseline - ارتفاع الصعود (ascender)
         نستخدم 0.8 من حجم الخط كـ تقريب آمن لأن معظم الخطوط
         عندها ascender حوالي 80% من حجم الخط */
      const ascenderRatio = 0.8;
      const top = baseline - (fontHeight * ascenderRatio);

      /* 🎨 إنشاء span */
      const span = document.createElement('span');
      span.className = 'text-span';
      span.textContent = item.str;
      span.style.left = left + 'px';
      span.style.top = top + 'px';
      span.style.fontSize = fontHeight + 'px';
      span.style.fontFamily = 'sans-serif';
      span.style.lineHeight = '1';
      span.style.whiteSpace = 'pre';

      /* 🎯 ارتفاع النص — لو مش دقيق، استخدم fontHeight */
      if (totalHeight && totalHeight > 0 && totalHeight < fontHeight * 2) {
        span.style.height = totalHeight + 'px';
      } else {
        span.style.height = fontHeight + 'px';
      }

      span.dataset.text = item.str;

      span.addEventListener('click', (e) => {
        e.stopPropagation();
        translateText(item.str);
        document.querySelectorAll('.text-span.selected').forEach(s => s.classList.remove('selected'));
        span.classList.add('selected');
      });

      layer.appendChild(span);
    });

    container.appendChild(layer);
  } catch (err) {
    console.warn('⚠️ فشل بناء طبقة النص:', err);
  }
}

/* ================================================================
   10) 🌐 الترجمة (Translation)
   ----------------------------------------------------------------
   - translateWithGoogle: ترجمة عبر API جوجل (مجاني)
   - simpleTranslate: قاموس احتياطي
   - translateText: الدالة الرئيسية (مع صوت + نسخ)
   - speakTranslation: نطق الترجمة
   - copyToClipboard: نسخ للحافظة
   ================================================================ */

/**
 * 🌐 ترجمة عبر Google Translate API (مجاني بدون API key)
 * @param {string} text - النص المراد ترجمته
 * @param {string} targetLang - اللغة الهدف (ar/en/it)
 * @returns {Promise<string>} النص المترجم
 */
async function translateWithGoogle(text, targetLang) {
  if (!text || !text.trim()) return '';

  const langMap = { ar: 'ar', en: 'en', it: 'it' };
  const tl = langMap[targetLang] || 'ar';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error ' + response.status);
    const data = await response.json();

    if (data && data[0] && Array.isArray(data[0])) {
      return data[0].map(item => item[0]).join('');
    }
    return text;
  } catch (err) {
    console.error('❌ Google Translate فشل:', err);
    /* 🆘 fallback للقاموس المحلي */
    return simpleTranslate(text, targetLang);
  }
}

/* 📚 قاموس احتياطي (يُستخدم لو فشل Google) */
const SIMPLE_DICT = {
  "the": "الـ", "and": "و", "of": "من", "to": "إلى", "in": "في",
  "is": "هو", "are": "هم", "was": "كان", "were": "كانوا", "be": "يكون",
  "this": "هذا", "that": "ذلك", "these": "هؤلاء", "those": "أولئك",
  "book": "كتاب", "page": "صفحة", "chapter": "فصل", "lesson": "درس",
  "student": "طالب", "teacher": "معلم", "school": "مدرسة", "class": "فصل",
  "math": "رياضيات", "physics": "فيزياء", "chemistry": "كيمياء",
  "biology": "أحياء", "english": "إنجليزي", "italian": "إيطالي",
  "science": "علم", "technology": "تقنية", "computer": "حاسوب",
  "water": "ماء", "air": "هواء", "fire": "نار", "earth": "أرض",
  "energy": "طاقة", "force": "قوة", "motion": "حركة", "speed": "سرعة",
  "light": "ضوء", "heat": "حرارة", "sound": "صوت", "power": "قدرة",
  "number": "رقم", "equation": "معادلة", "formula": "صيغة", "result": "نتيجة",
  "example": "مثال", "exercise": "تمرين", "question": "سؤال", "answer": "جواب",
  "find": "أوجد", "added": "أُضيف", "when": "عندما", "ratio": "نسبة",
  "proportion": "تناسب", "antecedent": "المقدم", "consequent": "التالي"
};

const ITALIAN_DICT = {
  "il": "الـ", "lo": "الـ", "la": "الـ", "i": "الـ", "gli": "الـ", "le": "الـ",
  "e": "و", "di": "من", "a": "إلى", "in": "في", "è": "هو", "sono": "هم",
  "libro": "كتاب", "pagina": "صفحة", "capitolo": "فصل", "lezione": "درس",
  "studente": "طالب", "insegnante": "معلم", "scuola": "مدرسة", "classe": "فصل",
  "matematica": "رياضيات", "fisica": "فيزياء", "chimica": "كيمياء",
  "biologia": "أحياء", "inglese": "إنجليزي", "italiano": "إيطالي",
  "scienza": "علم", "tecnologia": "تقنية", "computer": "حاسوب",
  "acqua": "ماء", "aria": "هواء", "fuoco": "نار", "terra": "أرض",
  "energia": "طاقة", "forza": "قوة", "moto": "حركة", "velocità": "سرعة",
  "luce": "ضوء", "calore": "حرارة", "suono": "صوت", "potenza": "قدرة",
  "numero": "رقم", "equazione": "معادلة", "formula": "صيغة", "risultato": "نتيجة",
  "esempio": "مثال", "esercizio": "تمرين", "domanda": "سؤال", "risposta": "جواب",
  "sì": "نعم", "no": "لا", "buono": "جيد", "cattivo": "سيء", "nuovo": "جديد",
  "vecchio": "قديم", "grande": "كبير", "piccolo": "صغير", "primo": "أول", "ultimo": "أخير"
};

/**
 * 📚 ترجمة بسيطة كلمة بكلمة (احتياطي)
 * @param {string} text - النص
 * @param {string} targetLang - اللغة
 * @returns {string} الترجمة
 */
function simpleTranslate(text, targetLang) {
  if (!text) return '';

  const words = text.split(/(\s+|[.,!?;:()\[\]{}"'])/);
  const result = words.map(word => {
    const clean = word.toLowerCase().trim();
    if (!clean) return word;

    if (targetLang === 'ar') {
      if (SIMPLE_DICT[clean]) return SIMPLE_DICT[clean];
      if (ITALIAN_DICT[clean]) return ITALIAN_DICT[clean];
    } else if (targetLang === 'en') {
      for (const [en, ar] of Object.entries(SIMPLE_DICT)) {
        if (ar === clean) return en;
      }
      for (const [it, ar] of Object.entries(ITALIAN_DICT)) {
        if (ar === clean) return it;
      }
    } else if (targetLang === 'it') {
      for (const [it, ar] of Object.entries(ITALIAN_DICT)) {
        if (ar === clean) return it;
      }
      for (const [en, ar] of Object.entries(SIMPLE_DICT)) {
        if (ar === clean) return en;
      }
    }

    return word;
  });

  return result.join('');
}

/* ================================================================
   🔊 دالة النطق (Speech Synthesis)
   ================================================================ */

/**
 * 🔊 نطق نص باللغة المحددة
 * - يستخدم دالة speak من app.js لو موجودة
 * - fallback لـ Web Speech API مباشرة
 * @param {string} text - النص المراد نطقه
 * @param {HTMLElement} btnEl - زر التشغيل (للتأثير البصري)
 */
function speakTranslation(text, btnEl) {
  if (!text || !text.trim()) return;

  /* 🎯 اختصار اللغة */
  const langMap = {
    ar: 'ar-EG',     /* عربي مصري */
    en: 'en-US',     /* إنجليزي أمريكي */
    it: 'it-IT'      /* إيطالي */
  };
  const lang = langMap[transLang] || 'ar-EG';

  /* 🎯 استخدام دالة speak من app.js */
  if (typeof speak === 'function') {
    speak(text, lang, 0.85, btnEl);
  } else {
    /* 🆘 fallback: Web Speech API مباشرة */
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;

      if (btnEl) {
        btnEl.classList.add('speaking-now');
        u.onend = () => btnEl.classList.remove('speaking-now');
        u.onerror = () => btnEl.classList.remove('speaking-now');
      }

      window.speechSynthesis.speak(u);
    } else {
      showToast('❌ المتصفح لا يدعم النطق', 'error');
    }
  }
}

/* ================================================================
   📋 دالة النسخ (Clipboard)
   ================================================================ */

/**
 * 📋 نسخ نص للحافظة
 * @param {string} text - النص
 * @param {HTMLElement} btnEl - الزر (للتأثير البصري)
 */
async function copyToClipboard(text, btnEl) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      /* 🆘 fallback للمتصفحات القديمة */
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    if (btnEl) {
      const original = btnEl.textContent;
      btnEl.textContent = '✅';
      btnEl.classList.add('copied');
      setTimeout(() => {
        btnEl.textContent = original;
        btnEl.classList.remove('copied');
      }, 1500);
    }

    showToast('✅ تم نسخ الترجمة', 'success', 1500);
  } catch (err) {
    console.error('Copy error:', err);
    showToast('❌ فشل النسخ', 'error');
  }
}

/* ================================================================
   🌐 الدالة الرئيسية للترجمة
   ================================================================ */

/**
 * 🌐 ترجمة نص وعرضه مع صوت وزر نسخ
 * - تظهر "جارٍ الترجمة..." أثناء الانتظار
 * - بعد الترجمة: النص + الصوت + زر النسخ
 * @param {string} text - النص المراد ترجمته
 */
async function translateText(text) {
  if (!text || !text.trim()) return;

  const content = document.getElementById('transContent');
  if (!content) return;

  /* 🗑️ إزالة الحالة الفارغة */
  const empty = content.querySelector('.trans-empty');
  if (empty) empty.remove();

  /* ⏳ عرض "جارٍ الترجمة..." */
  const loadingItem = document.createElement('div');
  loadingItem.className = 'trans-item trans-loading';
  loadingItem.innerHTML = `
    <div class="original">${esc(text)}</div>
    <div class="translated" style="color: var(--gray); font-style: italic;">
      ⏳ جارٍ الترجمة...
    </div>
  `;
  content.insertBefore(loadingItem, content.firstChild);
  content.scrollTop = 0;

  /* 🌐 الترجمة الفعلية */
  const translated = await translateWithGoogle(text, transLang);

  /* 🎨 بناء العنصر النهائي: النص + الصوت + النسخ */
  loadingItem.innerHTML = `
    <div class="trans-header-row">
      <div class="original">${esc(text)}</div>
      <button class="trans-speak-btn" title="اسمع الترجمة" aria-label="اسمع الترجمة">🔊</button>
    </div>
    <div class="translated">${esc(translated)}</div>
    <div class="trans-footer">
      <span class="lang-badge">${getLangLabel(transLang)}</span>
      <button class="trans-copy-btn" title="انسخ الترجمة" aria-label="انسخ الترجمة">📋</button>
    </div>
  `;
  loadingItem.classList.remove('trans-loading');

  /* 🔊 ربط زر النطق */
  const speakBtn = loadingItem.querySelector('.trans-speak-btn');
  if (speakBtn) {
    speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speakTranslation(translated, speakBtn);
    });
  }

  /* 📋 ربط زر النسخ */
  const copyBtn = loadingItem.querySelector('.trans-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(translated, copyBtn);
    });
  }

  /* 🔊 تشغيل صوتي تلقائي (لو مفعّل) */
  if (autoSpeakEnabled && speakBtn) {
    speakTranslation(translated, speakBtn);
  }

  /* 👁️ إظهار لوحة الترجمة لو مخفية */
  if (!translationVisible) toggleTranslation();
}

/**
 * 🏷️ الحصول على اسم اللغة مع علم
 * @param {string} lang - كود اللغة
 * @returns {string} اسم اللغة
 */
function getLangLabel(lang) {
  return { ar: '🇪🇬 عربي', en: '🇬🇧 English', it: '🇮🇹 Italiano' }[lang] || lang;
}

/**
 * 🌐 تغيير لغة الترجمة
 * @param {string} lang - اللغة الجديدة (ar/en/it)
 */
function setTransLang(lang) {
  transLang = lang;
  localStorage.setItem('books-trans-lang', lang);
  updateTransButtons();

  document.querySelectorAll('.trans-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lang === lang);
  });

  showToast(`🌐 تم تغيير لغة الترجمة إلى ${getLangLabel(lang)}`, 'success', 1800);
}

/**
 * 🌐 تغيير اللغة (يُستخدم من الإعدادات)
 * @param {string} lang - اللغة
 */
function switchTransLang(lang) {
  setTransLang(lang);
  const menu = document.getElementById('settingsMenu');
  const btn = document.getElementById('settingsBtn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.classList.remove('active');
}

/**
 * 🔄 تحديث أزرار اللغة (إبراز اللغة النشطة)
 */
function updateTransButtons() {
  document.querySelectorAll('.trans-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lang === transLang);
  });
  document.querySelectorAll('.trans-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === transLang);
  });
}

/**
 * 🗑️ مسح كل الترجمات من اللوحة
 */
function clearTranslation() {
  const content = document.getElementById('transContent');
  if (!content) return;
  content.innerHTML = `
    <div class="trans-empty">
      <div class="trans-empty-icon">📝</div>
      <p>اضغط على أي نص في الصفحة<br>أو حدد نصاً للترجمة</p>
    </div>
  `;
  document.querySelectorAll('.text-span.selected').forEach(s => s.classList.remove('selected'));
}

/**
 * ✍️ ترجمة النص المكتوب في مربع الإدخال
 */
function translateInput() {
  const input = document.getElementById('transInput');
  if (!input || !input.value.trim()) return;
  translateText(input.value.trim());
  input.value = '';
}

/**
 * 👁️ إظهار/إخفاء لوحة الترجمة
 */
/**
 * 👁️ إظهار/إخفاء لوحة الترجمة
 * - على الموبايل: تُفتح كدرج جانبي مع overlay
 * - على الديسكتوب: تُخفى/تظهر عادي
 */
function toggleTranslation() {
  translationVisible = !translationVisible;
  const panel = document.getElementById('translationPanel');
  const btn = document.getElementById('readerTrans');
  const overlay = document.getElementById('transOverlay');

  if (!panel) return;

  if (window.innerWidth <= 900) {
    /* 📱 موبايل: درج جانبي */
    panel.classList.toggle('open', translationVisible);
    if (overlay) overlay.classList.toggle('show', translationVisible);
  } else {
    /* 💻 ديسكتوب: إخفاء/إظهار عادي */
    panel.classList.toggle('hidden', !translationVisible);
    if (overlay) overlay.classList.remove('show');
  }

  if (btn) btn.classList.toggle('active', translationVisible);
}

/**
 * 🔊 تفعيل/إلغاء النطق التلقائي
 */
function toggleAutoSpeak() {
  autoSpeakEnabled = !autoSpeakEnabled;
  localStorage.setItem('books-auto-speak', autoSpeakEnabled ? '1' : '0');

  const btn = document.getElementById('readerAutoSpeak');
  if (btn) {
    btn.classList.toggle('active', autoSpeakEnabled);
    btn.textContent = autoSpeakEnabled ? '🔊' : '🔇';
  }

  showToast(
    autoSpeakEnabled ? '🔊 تم تفعيل النطق التلقائي' : '🔇 تم إيقاف النطق التلقائي',
    'success',
    1800
  );
}

/* ================================================================
   11) 🖼️ المصغرات (Thumbnails)
   ================================================================ */

/**
 * 🖼️ بناء مصغرات كل صفحات الكتاب
 * - تُعرض أسفل العارض
 * - عند الضغط على مصغرة: الانتقال للصفحة
 */
async function buildThumbs() {
  const wrap = document.getElementById('readerThumbs');
  if (!wrap || !readerPdf) return;

  wrap.innerHTML = '';

  for (let i = 1; i <= readerPdf.numPages; i++) {
    try {
      const page = await readerPdf.getPage(i);
      const vp = page.getViewport({ scale: 0.18 });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: vp }).promise;

      const thumb = document.createElement('div');
      thumb.className = 'reader-thumb' + (i === readerPage ? ' on' : '');
      thumb.appendChild(canvas);
      thumb.onclick = () => renderPage(i);
      wrap.appendChild(thumb);
    } catch (e) {
      console.warn('thumb ' + i, e);
    }
  }
}

/* ================================================================
   12) 🎮 أدوات العارض (Reader Controls)
   ================================================================ */

/**
 * ▶️ التنقل بين الصفحات
 * @param {number} dir - اتجاه (1 = التالي، -1 = السابق)
 */
function readerGo(dir) {
  renderPage(readerPage + dir);
}

/**
 * 🔍 تكبير/تصغير العرض
 * @param {number} dir - اتجاه (1 = تكبير، -1 = تصغير)
 */
function readerZoom(dir) {
  bookReaderZoom = Math.max(0.5, Math.min(3, bookReaderZoom + dir * 0.2));
  renderPage(readerPage);
}

/**
 * ⛶ ملء الشاشة
 */
function readerFullscreen() {
  const viewer = document.getElementById('readerViewer');
  if (!viewer) return;

  if (!document.fullscreenElement) {
    if (viewer.requestFullscreen) viewer.requestFullscreen();
    else if (viewer.webkitRequestFullscreen) viewer.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}

/**
 * ✕ إغلاق العارض
 */
function closeReader() {
  const viewer = document.getElementById('readerViewer');
  const overlay = document.getElementById('readerOverlay');
  const canvasWrap = document.getElementById('readerCanvasWrap');
  const thumbs = document.getElementById('readerThumbs');
  const panel = document.getElementById('translationPanel');

  if (viewer) viewer.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
  if (panel) panel.classList.remove('open');
  document.body.style.overflow = '';
  readerPdf = null;
  readerPage = 1;
  bookReaderZoom = 1;

  if (canvasWrap) canvasWrap.innerHTML = '<div class="reader-loading">⏳ جارٍ التحميل...</div>';
  if (thumbs) thumbs.innerHTML = '';
}

/* ================================================================
   13) ⌨️ اختصارات لوحة المفاتيح
   ================================================================ */
document.addEventListener('keydown', (e) => {
  const viewer = document.getElementById('readerViewer');
  if (!viewer || !viewer.classList.contains('show')) return;

  /* ➡️ ⬇️ التالي */
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    readerGo(1);
  }
  /* ⬅️ ⬆️ السابق */
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    readerGo(-1);
  }
  /* ➕ تكبير */
  if (e.key === '+' || e.key === '=') {
    e.preventDefault();
    readerZoom(1);
  }
  /* ➖ تصغير */
  if (e.key === '-') {
    e.preventDefault();
    readerZoom(-1);
  }
});

/* ================================================================
   14) 🛠️ أدوات مساعدة (Helpers)
   ================================================================ */

/**
 * 🔒 حماية النص من XSS (تحويل الرموز الخاصة)
 * @param {string} s - النص
 * @returns {string} النص الآمن
 */
function esc(s) {
  return String(s || '').replace(/[&<>"]/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])
  );
}

/**
 * 🔄 إعادة رسم الصفحة عند تغيير حجم النافذة
 */
window.addEventListener('resize', () => {
  clearTimeout(bookResizeTimer);
  bookResizeTimer = setTimeout(() => {
    if (readerPdf) renderPage(readerPage);
  }, 300);
});

/* ================================================================
   15) 🚀 الانطلاق (Bootstrap)
   ----------------------------------------------------------------
   - تُنفَّذ تلقائياً عند تحميل الصفحة
   - تنتظر DOM ثم تشغّل initBooks
   ================================================================ */
(function bootstrap() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBooks, { once: true });
  } else {
    initBooks();
  }
})();
