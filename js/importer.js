/* ===========================================================
   importer.js — استيراد المجلات من ملفات CSV أو Excel
   • CSV: محلّل داخلي يدعم الفواصل وعلامات الاقتباس.
   • Excel (.xlsx/.xls): عبر مكتبة SheetJS (تُحمّل من CDN عند الحاجة).
   يحاول مطابقة الأعمدة تلقائيًا (عربي/إنجليزي).
   =========================================================== */
(function (global) {
  'use strict';

  // خريطة المرادفات لأسماء الأعمدة -> حقول المجلة
  const FIELD_ALIASES = {
    name: ['name', 'journal', 'journal name', 'title', 'المجلة', 'اسم المجلة', 'الاسم'],
    wos: ['wos', 'web of science', 'webofscience', 'wos category', 'ويب اوف ساينس', 'ويب أوف ساينس', 'web of science'],
    scopus: ['scopus', 'سكوبس', 'مفهرسة سكوبس'],
    quartile: ['quartile', 'q', 'rank', 'التصنيف', 'الربع', 'كوارتايل'],
    category: ['category', 'subject', 'field', 'المجال', 'التخصص', 'الفئة'],
    publishDuration: ['publish duration', 'duration', 'time to publish', 'review time', 'مدة النشر', 'مدة', 'مدة المراجعة'],
    wordLimit: ['word limit', 'words', 'word count', 'max words', 'عدد الكلمات', 'حد الكلمات', 'الكلمات'],
    citationStyle: ['citation', 'citation style', 'reference style', 'style', 'نمط التوثيق', 'التوثيق', 'نمط الاقتباس'],
    scope: ['scope', 'aims', 'aims and scope', 'description', 'النطاق', 'الوصف', 'نطاق المجلة', 'الكلمات المفتاحية', 'keywords'],
    email: ['email', 'e-mail', 'contact', 'البريد', 'الايميل', 'البريد الالكتروني'],
    url: ['url', 'website', 'link', 'الموقع', 'الرابط']
  };

  function normalizeHeader(h) {
    return String(h || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function buildHeaderMap(headers) {
    const map = {};
    headers.forEach((h, idx) => {
      const nh = normalizeHeader(h);
      for (const field in FIELD_ALIASES) {
        if (FIELD_ALIASES[field].some(a => normalizeHeader(a) === nh)) {
          map[idx] = field;
          break;
        }
      }
    });
    return map;
  }

  function rowsToJournals(headers, rows) {
    const map = buildHeaderMap(headers);
    const hasMapping = Object.keys(map).length > 0;
    const journals = [];
    rows.forEach(cells => {
      if (!cells || cells.every(c => String(c).trim() === '')) return;
      const j = {};
      if (hasMapping) {
        cells.forEach((val, idx) => {
          const field = map[idx];
          if (field) j[field] = String(val).trim();
        });
      } else {
        // لا توجد ترويسة معروفة: نفترض الأعمدة بالترتيب الشائع
        const order = ['name', 'wos', 'scopus', 'quartile', 'category', 'publishDuration', 'wordLimit', 'citationStyle', 'scope', 'email', 'url'];
        cells.forEach((val, idx) => { if (order[idx]) j[order[idx]] = String(val).trim(); });
      }
      if (j.name) journals.push(j);
    });
    return journals;
  }

  // محلّل CSV بسيط يدعم الاقتباس والفواصل داخل الحقول
  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',' || c === ';' || c === '\t') { row.push(field); field = ''; }
        else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
        else field += c;
      }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.length && !(r.length === 1 && r[0].trim() === ''));
  }

  function loadSheetJS() {
    return new Promise((resolve, reject) => {
      if (global.XLSX) return resolve(global.XLSX);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = () => resolve(global.XLSX);
      s.onerror = () => reject(new Error('تعذّر تحميل مكتبة قراءة Excel (تحقق من الاتصال بالإنترنت)'));
      document.head.appendChild(s);
    });
  }

  const Importer = {
    // يرجّع وعدًا بقائمة كائنات مجلات
    async parseFile(file) {
      const name = (file.name || '').toLowerCase();
      if (name.endsWith('.csv') || file.type === 'text/csv') {
        const text = await file.text();
        const rows = parseCSV(text);
        if (!rows.length) return [];
        return rowsToJournals(rows[0], rows.slice(1));
      }
      if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const XLSX = await loadSheetJS();
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (!aoa.length) return [];
        return rowsToJournals(aoa[0], aoa.slice(1));
      }
      throw new Error('صيغة غير مدعومة. استخدم CSV أو Excel (.xlsx/.xls)');
    }
  };

  global.Importer = Importer;
})(window);
