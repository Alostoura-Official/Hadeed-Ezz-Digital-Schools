/* ================================================================
   📚 Books Library — JavaScript
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
        title: "النحو والصرف",
        titleEn: "Grammar & Morphology",
        file: "book.pdf",
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
        title: "أساسيات الميكاترونكس",
        titleEn: "Mechatronics Basics",
        file: "Mech-Unit 1-SB 14 Sept2026.pdf",
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
   2) 🌐 حالة التطبيق
   ================================================================ */
let currentFilter = 'all';
let searchQuery = '';
let activeSubject = null;
let readerPdf = null;
let readerPage = 1;
let transLang = localStorage.getItem('books-trans-lang') || 'ar';
let translationVisible = true;
let selectedTextSpans = [];

// ✅ اسم فريد لتجنب التعارض مع app.js
let bookReaderZoom = 1;
let bookResizeTimer = null;

/* ================================================================
   3) 🚀 التهيئة
   ================================================================ */
function initBooks() {
  console.log('📚 [books] بدء التهيئة...');

  const savedTheme = localStorage.getItem('mech-theme');
  if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = '☀️';
  }

  updateTransButtons();
  const readerTrans = document.getElementById('readerTrans');
  if (readerTrans) readerTrans.classList.add('active');

  renderFilters();
  renderSubjects();

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const viewer = document.getElementById('readerViewer');
      if (viewer && viewer.classList.contains('show')) closeReader();
    }
  });

  console.log('✅ [books] جاهز');
}

/* ================================================================
   4) 🎨 الفلاتر
   ================================================================ */
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
   5) 🗂️ عرض المواد
   ================================================================ */
function renderSubjects() {
  const grid = document.getElementById('subjectsGrid');
  const booksWrap = document.getElementById('booksGridWrap');
  const emptyState = document.getElementById('booksEmptyState');
  if (!grid) return;

  grid.style.display = 'grid';
  if (booksWrap) booksWrap.style.display = 'none';

  let subjects = Object.entries(BOOKS_CONFIG);

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

  if (subjects.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

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
   6) 📖 فتح مادة
   ================================================================ */
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToSubjects() {
  activeSubject = null;
  const grid = document.getElementById('subjectsGrid');
  const booksWrap = document.getElementById('booksGridWrap');
  if (grid) grid.style.display = 'grid';
  if (booksWrap) booksWrap.style.display = 'none';
  renderSubjects();
}

/* ================================================================
   7) 📚 عرض الكتب
   ================================================================ */
function renderBooks(subjKey) {
  const grid = document.getElementById('booksGrid');
  const emptyState = document.getElementById('booksEmptyState');
  if (!grid) return;

  const subj = BOOKS_CONFIG[subjKey];
  if (!subj) return;

  let books = subj.books;

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

function updateCount(n) {
  const el = document.getElementById('booksCount');
  if (el) el.textContent = n > 0 ? `${n} كتاب` : '';
}

/* ================================================================
   8) 📖 عارض PDF
   ================================================================ */
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
    const loadingTask = pdfjsLib.getDocument({
      url: encodeURI(filePath),
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

    await buildTextLayer(page, vp, canvasWrap);

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
   9) 🔤 طبقة النص
   ================================================================ */
async function buildTextLayer(page, viewport, container) {
  try {
    const textContent = await page.getTextContent();
    const layer = document.createElement('div');
    layer.className = 'text-layer';
    layer.style.width = viewport.width + 'px';
    layer.style.height = viewport.height + 'px';

    textContent.items.forEach(item => {
      if (!item.str || !item.str.trim()) return;

      const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
      const fontHeight = Math.hypot(tx[2], tx[3]);
      const left = tx[4];
      const top = tx[5] - fontHeight;

      const span = document.createElement('span');
      span.className = 'text-span';
      span.textContent = item.str;
      span.style.left = left + 'px';
      span.style.top = top + 'px';
      span.style.fontSize = fontHeight + 'px';
      span.style.fontFamily = 'sans-serif';
      span.style.lineHeight = '1';
      span.style.whiteSpace = 'pre';
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
   10) 🌐 الترجمة — مع Google Translate API
   ================================================================ */

/* ترجمة عبر Google Translate (مجاني بدون API key) */
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
    // fallback للقاموس المحلي
    return simpleTranslate(text, targetLang);
  }
}

/* قاموس احتياطي (يُستخدم لو فشل Google) */
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

/* الدالة الرئيسية للترجمة */
async function translateText(text) {
  if (!text || !text.trim()) return;

  const content = document.getElementById('transContent');
  if (!content) return;

  const empty = content.querySelector('.trans-empty');
  if (empty) empty.remove();

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

  const translated = await translateWithGoogle(text, transLang);

  loadingItem.innerHTML = `
    <div class="original">${esc(text)}</div>
    <div class="translated">${esc(translated)}</div>
    <span class="lang-badge">${getLangLabel(transLang)}</span>
  `;
  loadingItem.classList.remove('trans-loading');

  if (!translationVisible) toggleTranslation();
}

function getLangLabel(lang) {
  return { ar: '🇪🇬 عربي', en: '🇬🇧 English', it: '🇮🇹 Italiano' }[lang] || lang;
}

function setTransLang(lang) {
  transLang = lang;
  localStorage.setItem('books-trans-lang', lang);
  updateTransButtons();

  document.querySelectorAll('.trans-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lang === lang);
  });

  showToast(`🌐 تم تغيير لغة الترجمة إلى ${getLangLabel(lang)}`, 'success', 1800);
}

function switchTransLang(lang) {
  setTransLang(lang);
  const menu = document.getElementById('settingsMenu');
  const btn = document.getElementById('settingsBtn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.classList.remove('active');
}

function updateTransButtons() {
  document.querySelectorAll('.trans-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lang === transLang);
  });
  document.querySelectorAll('.trans-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === transLang);
  });
}

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

function translateInput() {
  const input = document.getElementById('transInput');
  if (!input || !input.value.trim()) return;
  translateText(input.value.trim());
  input.value = '';
}

function toggleTranslation() {
  translationVisible = !translationVisible;
  const panel = document.getElementById('translationPanel');
  const btn = document.getElementById('readerTrans');

  if (panel) {
    if (window.innerWidth <= 900) {
      panel.classList.toggle('open', translationVisible);
    } else {
      panel.classList.toggle('hidden', !translationVisible);
    }
  }

  if (btn) btn.classList.toggle('active', translationVisible);
}

/* ================================================================
   11) 🖼️ المصغرات
   ================================================================ */
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
   12) 🎮 أدوات العارض
   ================================================================ */
function readerGo(dir) {
  renderPage(readerPage + dir);
}

function readerZoom(dir) {
  bookReaderZoom = Math.max(0.5, Math.min(3, bookReaderZoom + dir * 0.2));
  renderPage(readerPage);
}

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
   13) ⌨️ اختصارات
   ================================================================ */
document.addEventListener('keydown', (e) => {
  const viewer = document.getElementById('readerViewer');
  if (!viewer || !viewer.classList.contains('show')) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    readerGo(1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    readerGo(-1);
  }
  if (e.key === '+' || e.key === '=') {
    e.preventDefault();
    readerZoom(1);
  }
  if (e.key === '-') {
    e.preventDefault();
    readerZoom(-1);
  }
});

/* ================================================================
   14) 🛠️ أدوات مساعدة
   ================================================================ */
function esc(s) {
  return String(s || '').replace(/[&<>"]/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])
  );
}

window.addEventListener('resize', () => {
  clearTimeout(bookResizeTimer);
  bookResizeTimer = setTimeout(() => {
    if (readerPdf) renderPage(readerPage);
  }, 300);
});

/* ================================================================
   15) 🚀 الانطلاق
   ================================================================ */
(function bootstrap() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBooks, { once: true });
  } else {
    initBooks();
  }
})();
