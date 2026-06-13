/* ===========================================================
   app.js — تشغيل المنصة وواجهتها
   يربط: المصادقة، الأبحاث، المجلات، التنبيهات، الترشيح بالذكاء الاصطناعي
   =========================================================== */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ------- أدوات التاريخ -------
  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('ar-SA-u-ca-gregory', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function daysSince(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  }

  function toast(msg, kind) {
    const wrap = $('#toastWrap');
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2800);
  }

  // ===========================================================
  //  المصادقة وشاشة الدخول
  // ===========================================================
  const authScreen = $('#authScreen');
  const appRoot = $('#app');

  function showAuth() {
    authScreen.style.display = 'flex';
    appRoot.classList.remove('visible');
    const registerMode = !Auth.hasAccount();
    $('#authTitle').textContent = registerMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول';
    $('#registerFields').style.display = registerMode ? 'block' : 'none';
    $('#authSubmit').textContent = registerMode ? 'إنشاء الحساب والدخول' : 'دخول';
    $('#authSwitch').style.display = 'none'; // حساب واحد محلي لكل جهاز
    $('#authError').textContent = '';
    authScreen.dataset.mode = registerMode ? 'register' : 'login';
  }

  function enterApp() {
    authScreen.style.display = 'none';
    appRoot.classList.add('visible');
    const acc = Store.getAccount();
    $('#userName').textContent = acc.displayName || acc.username;
    applyTheme(Store.getSettings().theme || 'light');
    renderAll();
    switchTab('dashboard');
  }

  $('#authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = $('#authError');
    errEl.textContent = '';
    const mode = authScreen.dataset.mode;
    const username = $('#authUser').value;
    const password = $('#authPass').value;
    try {
      if (mode === 'register') {
        await Auth.register({
          username, password,
          displayName: $('#authDisplay').value,
          academicEmail: $('#authAcademic').value,
          personalEmail: $('#authPersonal').value
        });
      } else {
        await Auth.login({ username, password });
      }
      enterApp();
    } catch (err) {
      errEl.textContent = err.message;
    }
  });

  $('#logoutBtn').addEventListener('click', () => {
    Auth.logout();
    showAuth();
  });

  // ===========================================================
  //  التبويبات
  // ===========================================================
  function switchTab(name) {
    $$('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (name === 'dashboard') renderDashboard();
    if (name === 'papers') renderPapers();
    if (name === 'journals') renderJournals();
    if (name === 'alerts') renderAlerts();
    if (name === 'settings') renderSettings();
    window.scrollTo(0, 0);
  }
  $$('.tabs button').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

  // ===========================================================
  //  لوحة المتابعة (Dashboard)
  // ===========================================================
  function renderDashboard() {
    const papers = Store.getPapers();
    const journals = Store.getJournals();
    const activeAlerts = Store.getActiveAlerts();

    // الإحصاءات
    const byStatus = {};
    papers.forEach(p => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
    const inReview = (byStatus.submitted || 0) + (byStatus.review || 0) + (byStatus.revision || 0) + (byStatus.accepted || 0);
    const contactedJournals = journals.filter(j => j.contacted).length;

    $('#statsGrid').innerHTML = [
      statCard('bi-journal-text', papers.length, 'إجمالي الأبحاث'),
      statCard('bi-send-check', inReview, 'قيد التقييم/المراجعة'),
      statCard('bi-patch-check', byStatus.published || 0, 'منشورة'),
      statCard('bi-buildings', contactedJournals, 'مجلات تمت مراسلتها'),
      statCard('bi-bell', activeAlerts.length, 'تنبيهات تنتظر الرد')
    ].join('');

    // الحالة اليومية
    const stale = papers.filter(p => {
      const d = daysSince(p.lastUpdate);
      return ['submitted', 'review', 'revision'].includes(p.status) && d != null && d >= 14;
    });
    let dailyMsg = 'كل شيء على ما يرام. لا توجد أبحاث متوقفة منذ مدة طويلة.';
    if (activeAlerts.length) {
      dailyMsg = 'لديك <strong>' + activeAlerts.length + '</strong> تنبيه/ملاحظة من المجلات تنتظر ردّك وإغلاقها.';
    } else if (stale.length) {
      dailyMsg = '<strong>' + stale.length + '</strong> بحث/أبحاث قيد التقييم لم تتحدّث منذ أسبوعين أو أكثر — قد يستحق المتابعة مع المجلة.';
    }
    const today = new Date().toLocaleDateString('ar-SA-u-ca-gregory', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    $('#dailyBanner').innerHTML =
      '<i class="bi bi-calendar2-check"></i><div><h3>الحالة اليومية — ' + esc(today) + '</h3><p>' + dailyMsg + '</p></div>';

    // الأعمدة الأربع المطلوبة
    const cols = [
      { key: 'writing', title: 'أبحاث تحت الكتابة', color: 'var(--st-writing)', filter: p => p.status === 'writing' },
      { key: 'ready', title: 'جاهزة للتسليم', color: 'var(--st-ready)', filter: p => p.status === 'ready' },
      { key: 'submitted', title: 'أبحاث مُرسلة', color: 'var(--st-submitted)', filter: p => ['submitted', 'review', 'revision', 'accepted'].includes(p.status) },
      { key: 'journals', title: 'مجلات تمت مراسلتها', color: 'var(--st-published)', isJournals: true }
    ];

    $('#board').innerHTML = cols.map(col => {
      let cards = '', count = 0;
      if (col.isJournals) {
        const list = journals.filter(j => j.contacted);
        count = list.length;
        cards = list.length ? list.map(j => journalMiniCard(j)).join('')
          : '<div class="empty-col">لم تُحدَّد مجلات مُراسَلة بعد</div>';
      } else {
        const list = papers.filter(col.filter);
        count = list.length;
        cards = list.length ? list.map(p => paperMiniCard(p)).join('')
          : '<div class="empty-col">لا توجد عناصر</div>';
      }
      return '<div class="column"><h3><span><span class="dot" style="background:' + col.color + '"></span>' + esc(col.title) +
        '</span><span class="cnt">' + count + '</span></h3><div class="col-cards">' + cards + '</div></div>';
    }).join('');

    // ربط النقر
    $$('#board .mini-card[data-paper]').forEach(c => c.addEventListener('click', () => openPaperModal(c.dataset.paper)));
    $$('#board .mini-card[data-journal]').forEach(c => c.addEventListener('click', () => openJournalModal(c.dataset.journal)));
  }

  function statCard(icon, n, label) {
    return '<div class="stat"><div class="ic"><i class="bi ' + icon + '"></i></div><div class="n">' + n + '</div><div class="l">' + esc(label) + '</div></div>';
  }

  function paperMiniCard(p) {
    const st = Store.STATUSES[p.status] || { label: p.status, color: 'var(--primary)' };
    const hasAlert = Store.getActiveAlerts().some(a => a.paperId === p.id);
    return '<div class="mini-card" data-paper="' + p.id + '" style="border-inline-start-color:' + st.color + '">' +
      '<div class="t">' + esc(p.title || 'بحث بدون عنوان') + '</div>' +
      '<div class="m">' +
      '<span class="badge" style="background:' + st.color + '">' + esc(st.label) + '</span>' +
      (p.journalName ? '<span class="latin">' + esc(p.journalName) + '</span>' : '') +
      (hasAlert ? '<span class="alert-flag"><i class="bi bi-bell-fill"></i> ملاحظة بانتظار الرد</span>' : '') +
      '</div></div>';
  }

  function journalMiniCard(j) {
    return '<div class="mini-card" data-journal="' + j.id + '">' +
      '<div class="t latin">' + esc(j.name) + '</div>' +
      '<div class="m">' +
      (j.quartile ? '<span class="q-badge ' + quartileClass(j.quartile) + '">' + esc(j.quartile) + '</span>' : '') +
      (j.category ? '<span>' + esc(j.category) + '</span>' : '') +
      '</div></div>';
  }

  function quartileClass(q) {
    const m = /q([1-4])/i.exec(q || '');
    return m ? 'q' + m[1] : '';
  }

  // ===========================================================
  //  الأبحاث (Papers)
  // ===========================================================
  let paperFilter = 'all';

  function renderPapers() {
    const wrap = $('#papersList');
    let papers = Store.getPapers();
    const q = ($('#paperSearch').value || '').trim().toLowerCase();
    if (paperFilter !== 'all') {
      if (paperFilter === 'submitted') papers = papers.filter(p => ['submitted', 'review', 'revision', 'accepted'].includes(p.status));
      else papers = papers.filter(p => p.status === paperFilter);
    }
    if (q) papers = papers.filter(p => (p.title + ' ' + p.journalName + ' ' + p.keywords).toLowerCase().includes(q));

    if (!papers.length) {
      wrap.innerHTML = '<div class="hint" style="text-align:center">لا توجد أبحاث مطابقة. اضغط «إضافة بحث» للبدء.</div>';
      return;
    }
    wrap.innerHTML =
      '<div class="table-wrap"><table class="data"><thead><tr>' +
      '<th>العنوان</th><th>الحالة</th><th>المجلة</th><th>تاريخ التسليم</th><th>آخر تحديث</th><th></th>' +
      '</tr></thead><tbody>' +
      papers.map(p => {
        const st = Store.STATUSES[p.status] || { label: p.status, color: 'var(--primary)' };
        const hasAlert = Store.getActiveAlerts().some(a => a.paperId === p.id);
        return '<tr>' +
          '<td><strong>' + esc(p.title || 'بدون عنوان') + '</strong>' +
          (hasAlert ? ' <span class="alert-flag" style="color:var(--danger)"><i class="bi bi-bell-fill"></i></span>' : '') + '</td>' +
          '<td><span class="badge" style="background:' + st.color + '">' + esc(st.label) + '</span></td>' +
          '<td class="latin">' + esc(p.journalName || '—') + '</td>' +
          '<td>' + fmtDate(p.submittedDate) + '</td>' +
          '<td>' + fmtDate(p.lastUpdate) + '</td>' +
          '<td class="row-actions">' +
          '<button class="btn ghost sm" data-open="' + p.id + '"><i class="bi bi-eye"></i></button>' +
          '<button class="btn ghost sm" data-del="' + p.id + '"><i class="bi bi-trash"></i></button>' +
          '</td></tr>';
      }).join('') +
      '</tbody></table></div>';

    $$('#papersList [data-open]').forEach(b => b.addEventListener('click', () => openPaperModal(b.dataset.open)));
    $$('#papersList [data-del]').forEach(b => b.addEventListener('click', () => {
      if (confirm('حذف هذا البحث نهائيًا؟')) { Store.deletePaper(b.dataset.del); renderAll(); }
    }));
  }

  $('#paperSearch').addEventListener('input', renderPapers);
  $$('#paperFilters button').forEach(b => b.addEventListener('click', () => {
    paperFilter = b.dataset.filter;
    $$('#paperFilters button').forEach(x => x.classList.toggle('active', x === b));
    renderPapers();
  }));
  $('#addPaperBtn').addEventListener('click', () => openPaperModal(null));

  // ------- نافذة البحث -------
  function statusOptions(current) {
    return Store.STATUS_ORDER.map(s =>
      '<option value="' + s + '"' + (s === current ? ' selected' : '') + '>' + esc(Store.STATUSES[s].label) + '</option>'
    ).join('');
  }
  function journalOptions(current) {
    const js = Store.getJournals();
    return '<option value="">— بدون مجلة —</option>' + js.map(j =>
      '<option value="' + j.id + '"' + (j.id === current ? ' selected' : '') + '>' + esc(j.name) + '</option>'
    ).join('');
  }

  function openPaperModal(id) {
    const isNew = !id;
    const p = isNew ? null : Store.getPaper(id);
    if (!isNew && !p) return;

    const body =
      '<div class="form-grid">' +
        '<label class="field full"><span>عنوان البحث</span><input id="pm_title" value="' + esc(p ? p.title : '') + '" placeholder="عنوان المقال"></label>' +
        '<label class="field"><span>الحالة</span><select id="pm_status">' + statusOptions(p ? p.status : 'writing') + '</select></label>' +
        '<label class="field"><span>المجلة المستهدفة</span><select id="pm_journal">' + journalOptions(p ? p.journalId : '') + '</select></label>' +
        '<label class="field"><span>عدد الكلمات</span><input id="pm_words" value="' + esc(p ? p.wordCount : '') + '" placeholder="مثال: 8000"></label>' +
        '<label class="field"><span>تاريخ التسليم</span><input id="pm_subdate" type="date" value="' + (p && p.submittedDate ? p.submittedDate.slice(0, 10) : '') + '"></label>' +
        '<label class="field full"><span>الكلمات المفتاحية</span><input id="pm_keywords" value="' + esc(p ? p.keywords : '') + '" placeholder="مفصولة بفواصل"></label>' +
        '<label class="field full"><span>الملخص</span><textarea id="pm_abstract" placeholder="ملخص المقال (يُستخدم في الترشيح بالذكاء الاصطناعي)">' + esc(p ? p.abstract : '') + '</textarea></label>' +
      '</div>' +
      (p ? renderPaperTimeline(p) : '');

    const footExtra = p ?
      '<button class="btn accent" id="pm_addnote"><i class="bi bi-chat-dots"></i> تسجيل ملاحظة من المجلة</button>' : '';

    openModal({
      title: (isNew ? 'إضافة بحث جديد' : 'تفاصيل البحث'),
      icon: 'bi-journal-plus',
      body,
      footHTML: '<button class="btn" id="pm_save"><i class="bi bi-check-lg"></i> حفظ</button>' +
                '<button class="btn ghost" data-close>إغلاق</button>' + footExtra,
      onMount() {
        $('#pm_save').addEventListener('click', () => {
          const patch = {
            title: $('#pm_title').value.trim(),
            status: $('#pm_status').value,
            journalId: $('#pm_journal').value,
            journalName: $('#pm_journal').value ? (Store.getJournal($('#pm_journal').value) || {}).name || '' : '',
            wordCount: $('#pm_words').value.trim(),
            submittedDate: $('#pm_subdate').value ? new Date($('#pm_subdate').value).toISOString() : '',
            keywords: $('#pm_keywords').value.trim(),
            abstract: $('#pm_abstract').value.trim()
          };
          if (!patch.title) { toast('أدخل عنوان البحث', 'err'); return; }
          if (isNew) {
            Store.addPaper(patch);
            toast('تم إضافة البحث', 'ok');
          } else {
            if (patch.status !== p.status) Store.setPaperStatus(p.id, patch.status);
            delete patch.status;
            Store.updatePaper(p.id, patch);
            toast('تم حفظ التعديلات', 'ok');
          }
          closeModal(); renderAll();
        });
        if (p) {
          $('#pm_addnote').addEventListener('click', () => openNoteModal(p.id));
        }
      }
    });
  }

  function renderPaperTimeline(p) {
    if (!p.events || !p.events.length) return '';
    return '<h3 style="margin:18px 0 6px;font-size:1.05rem"><i class="bi bi-clock-history"></i> الخط الزمني</h3>' +
      '<ul class="timeline">' + p.events.map(e =>
        '<li class="' + (e.type === 'note' ? 'evt-note' : '') + '"><span class="tdot"></span>' +
        '<div class="te-date">' + fmtDate(e.date) + '</div>' +
        '<div class="te-text">' + esc(e.text) + '</div></li>'
      ).join('') + '</ul>';
  }

  // ------- تسجيل ملاحظة من المجلة (ينشئ تنبيهًا مستمرًا) -------
  function openNoteModal(paperId) {
    openModal({
      title: 'تسجيل ملاحظة/رد من المجلة',
      icon: 'bi-chat-left-dots',
      body:
        '<p class="muted-note">سيُنشئ هذا تنبيهًا مستمرًا يبقى ظاهرًا حتى تردّ عليه وتغلقه.</p>' +
        '<label class="field"><span>نص الملاحظة أو الرد الوارد</span><textarea id="note_text" placeholder="مثال: طلب المحرّر تعديلات على المنهجية..."></textarea></label>',
      footHTML: '<button class="btn danger" id="note_save"><i class="bi bi-bell"></i> حفظ وإنشاء تنبيه</button><button class="btn ghost" data-close>إلغاء</button>',
      onMount() {
        $('#note_save').addEventListener('click', () => {
          const text = $('#note_text').value.trim();
          if (!text) { toast('اكتب نص الملاحظة', 'err'); return; }
          Store.addPaperEvent(paperId, { type: 'note', text: 'ملاحظة من المجلة: ' + text });
          const paper = Store.getPaper(paperId);
          Store.addAlert({ paperId, title: 'ملاحظة من المجلة على بحث: ' + (paper ? paper.title : ''), message: text });
          // نقل الحالة إلى "تعديلات مطلوبة" إن كانت قيد المراجعة
          if (paper && ['submitted', 'review'].includes(paper.status)) Store.setPaperStatus(paperId, 'revision');
          toast('تم إنشاء التنبيه', 'ok');
          closeModal(); renderAll();
        });
      }
    });
  }

  // ===========================================================
  //  المجلات (Journals) + الاستيراد + الترشيح
  // ===========================================================
  function renderJournals() {
    const wrap = $('#journalsList');
    let journals = Store.getJournals();
    const q = ($('#journalSearch').value || '').trim().toLowerCase();
    if (q) journals = journals.filter(j => (j.name + ' ' + j.category + ' ' + j.scope + ' ' + j.wos).toLowerCase().includes(q));

    $('#journalCount').textContent = Store.getJournals().length;

    if (!journals.length) {
      wrap.innerHTML = '<div class="hint" style="text-align:center">لا توجد مجلات بعد. أضف مجلة يدويًا أو ارفع ملف CSV/Excel.</div>';
      return;
    }
    wrap.innerHTML =
      '<div class="table-wrap"><table class="data"><thead><tr>' +
      '<th>المجلة</th><th>WoS</th><th>Scopus</th><th>التصنيف</th><th>المجال</th><th>مدة النشر</th><th>حد الكلمات</th><th>التوثيق</th><th>مُراسَلة</th><th></th>' +
      '</tr></thead><tbody>' +
      journals.map(j =>
        '<tr>' +
        '<td><span class="latin"><strong>' + esc(j.name) + '</strong></span>' + (j.url ? ' <a href="' + esc(j.url) + '" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-left"></i></a>' : '') + '</td>' +
        '<td>' + (j.wos ? '<span class="idx-badge">' + esc(j.wos) + '</span>' : '—') + '</td>' +
        '<td>' + (/نعم|yes/i.test(j.scopus) ? '<i class="bi bi-check-circle-fill" style="color:var(--primary)"></i>' : (j.scopus ? esc(j.scopus) : '—')) + '</td>' +
        '<td>' + (j.quartile ? '<span class="q-badge ' + quartileClass(j.quartile) + '">' + esc(j.quartile) + '</span>' : '—') + '</td>' +
        '<td>' + esc(j.category || '—') + '</td>' +
        '<td>' + esc(j.publishDuration || '—') + '</td>' +
        '<td>' + esc(j.wordLimit || '—') + '</td>' +
        '<td>' + esc(j.citationStyle || '—') + '</td>' +
        '<td>' + (j.contacted ? '<i class="bi bi-check-circle-fill" style="color:var(--primary)"></i>' : '<i class="bi bi-dash-circle" style="color:var(--muted)"></i>') + '</td>' +
        '<td class="row-actions">' +
        '<button class="btn ghost sm" data-jopen="' + j.id + '"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn ghost sm" data-jdel="' + j.id + '"><i class="bi bi-trash"></i></button>' +
        '</td></tr>'
      ).join('') +
      '</tbody></table></div>';

    $$('#journalsList [data-jopen]').forEach(b => b.addEventListener('click', () => openJournalModal(b.dataset.jopen)));
    $$('#journalsList [data-jdel]').forEach(b => b.addEventListener('click', () => {
      if (confirm('حذف هذه المجلة؟')) { Store.deleteJournal(b.dataset.jdel); renderAll(); }
    }));
  }
  $('#journalSearch').addEventListener('input', renderJournals);
  $('#addJournalBtn').addEventListener('click', () => openJournalModal(null));

  function openJournalModal(id) {
    const isNew = !id;
    const j = isNew ? null : Store.getJournal(id);
    if (!isNew && !j) return;
    const v = (k) => esc(j ? (j[k] || '') : '');
    const body =
      '<div class="form-grid">' +
        '<label class="field full"><span>اسم المجلة (بالإنجليزية)</span><input id="jm_name" class="latin" dir="ltr" value="' + v('name') + '" placeholder="Journal Name"></label>' +
        '<label class="field"><span>تصنيف Web of Science</span><input id="jm_wos" value="' + v('wos') + '" placeholder="SCIE / SSCI / ESCI"></label>' +
        '<label class="field"><span>مفهرسة في Scopus</span><input id="jm_scopus" value="' + v('scopus') + '" placeholder="نعم / لا"></label>' +
        '<label class="field"><span>التصنيف (Quartile)</span><input id="jm_quartile" value="' + v('quartile') + '" placeholder="Q1 / Q2 / Q3 / Q4"></label>' +
        '<label class="field"><span>المجال/التخصص</span><input id="jm_category" value="' + v('category') + '" placeholder="مثال: القانون الرياضي"></label>' +
        '<label class="field"><span>مدة النشر</span><input id="jm_dur" value="' + v('publishDuration') + '" placeholder="مثال: 3-6 أشهر"></label>' +
        '<label class="field"><span>حد عدد الكلمات</span><input id="jm_words" value="' + v('wordLimit') + '" placeholder="مثال: 10000"></label>' +
        '<label class="field"><span>نمط التوثيق</span><input id="jm_cite" value="' + v('citationStyle') + '" placeholder="APA / OSCOLA / Chicago"></label>' +
        '<label class="field"><span>البريد/الموقع</span><input id="jm_email" value="' + v('email') + '" placeholder="email أو رابط"></label>' +
        '<label class="field"><span>رابط الموقع</span><input id="jm_url" dir="ltr" value="' + v('url') + '" placeholder="https://"></label>' +
        '<label class="field full"><span>نطاق المجلة / الكلمات المفتاحية (يُستخدم في الترشيح)</span><textarea id="jm_scope" placeholder="وصف موضوعات المجلة">' + v('scope') + '</textarea></label>' +
        '<label class="field full" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="jm_contacted" style="width:auto" ' + (j && j.contacted ? 'checked' : '') + '><span style="margin:0">تمت مراسلة هذه المجلة</span></label>' +
      '</div>';

    openModal({
      title: isNew ? 'إضافة مجلة' : 'تعديل مجلة',
      icon: 'bi-journal-bookmark',
      body,
      footHTML: '<button class="btn" id="jm_save"><i class="bi bi-check-lg"></i> حفظ</button><button class="btn ghost" data-close>إغلاق</button>',
      onMount() {
        $('#jm_save').addEventListener('click', () => {
          const patch = {
            name: $('#jm_name').value.trim(),
            wos: $('#jm_wos').value.trim(),
            scopus: $('#jm_scopus').value.trim(),
            quartile: $('#jm_quartile').value.trim(),
            category: $('#jm_category').value.trim(),
            publishDuration: $('#jm_dur').value.trim(),
            wordLimit: $('#jm_words').value.trim(),
            citationStyle: $('#jm_cite').value.trim(),
            email: $('#jm_email').value.trim(),
            url: $('#jm_url').value.trim(),
            scope: $('#jm_scope').value.trim(),
            contacted: $('#jm_contacted').checked
          };
          if (!patch.name) { toast('أدخل اسم المجلة', 'err'); return; }
          if (isNew) { Store.addJournal(patch); toast('تمت الإضافة', 'ok'); }
          else { Store.updateJournal(j.id, patch); toast('تم الحفظ', 'ok'); }
          closeModal(); renderAll();
        });
      }
    });
  }

  // ------- رفع CSV/Excel -------
  $('#importBtn').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast('جارٍ قراءة الملف…');
    try {
      const journals = await Importer.parseFile(file);
      if (!journals.length) { toast('لم يتم العثور على بيانات مجلات في الملف', 'err'); }
      else {
        const added = Store.addJournalsBulk(journals);
        toast('تمت إضافة ' + added + ' مجلة', 'ok');
        renderAll();
      }
    } catch (err) {
      toast(err.message, 'err');
    }
    e.target.value = '';
  });

  // ------- الترشيح بالذكاء الاصطناعي -------
  $('#matchBtn').addEventListener('click', async () => {
    const abstract = $('#matchAbstract').value.trim();
    const keywords = $('#matchKeywords').value.trim();
    const words = $('#matchWords').value.trim();
    const out = $('#matchResults');
    if (!abstract) { toast('الصق ملخص المقال أولًا', 'err'); return; }

    out.innerHTML = '<div style="text-align:center;padding:20px"><span class="spinner"></span> جارٍ تحليل الملخص وترشيح المجلات…</div>';
    const res = await Matcher.recommend(abstract, keywords, words);

    if (res.error) { out.innerHTML = '<div class="hint">' + esc(res.error) + '</div>'; return; }

    let header = '<div class="muted-note" style="margin-bottom:10px">' +
      (res.engine === 'claude' ? '<i class="bi bi-stars"></i> التحليل عبر Claude (claude-opus-4-8)' :
        '<i class="bi bi-cpu"></i> تحليل محلي ذكي' + (Matcher.hasApiKey() ? '' : ' — أضف مفتاح Claude API في الإعدادات لتحليل أعمق')) + '</div>';
    if (res.warn) header += '<div class="hint" style="margin-bottom:10px;color:var(--danger)">' + esc(res.warn) + '</div>';

    if (!res.recommendations.length) {
      out.innerHTML = header + '<div class="hint">لم يُعثر على مجلات مناسبة بدرجة كافية. حاول إثراء وصف نطاق المجلات.</div>';
      return;
    }
    out.innerHTML = header + res.recommendations.map(r => {
      const j = Store.getJournal(r.id);
      return '<div class="rec-card">' +
        '<div class="rh"><span class="name latin">' + esc(r.name) + '</span><span class="score">' + r.score + '%</span></div>' +
        '<div class="reason">' + esc(r.reason) + '</div>' +
        (j ? '<div class="meta">' +
          (j.quartile ? '<span class="q-badge ' + quartileClass(j.quartile) + '">' + esc(j.quartile) + '</span>' : '') +
          (j.wos ? '<span class="idx-badge">' + esc(j.wos) + '</span>' : '') +
          (j.wordLimit ? '<span class="muted-note">حد الكلمات: ' + esc(j.wordLimit) + '</span>' : '') +
          (j.citationStyle ? '<span class="muted-note">التوثيق: ' + esc(j.citationStyle) + '</span>' : '') +
          '</div>' : '') +
        '</div>';
    }).join('');
  });

  // ===========================================================
  //  التنبيهات (Alerts)
  // ===========================================================
  function renderAlerts() {
    const wrap = $('#alertsList');
    const alerts = Store.getAlerts();
    const active = alerts.filter(a => !a.resolved);
    const resolved = alerts.filter(a => a.resolved);

    if (!alerts.length) {
      wrap.innerHTML = '<div class="hint" style="text-align:center"><i class="bi bi-bell-slash"></i> لا توجد تنبيهات. عند ورود ملاحظة من مجلة، سجّلها من نافذة البحث لتظهر هنا.</div>';
      return;
    }
    let html = '';
    if (active.length) {
      html += '<h3 class="section-title" style="font-size:1.1rem"><i class="bi bi-bell-fill"></i> تنتظر الرد (' + active.length + ')</h3>';
      html += active.map(alertItem).join('');
    }
    if (resolved.length) {
      html += '<h3 class="section-title" style="font-size:1.1rem;margin-top:24px"><i class="bi bi-check2-all"></i> مغلقة</h3>';
      html += resolved.map(alertItem).join('');
    }
    wrap.innerHTML = html;

    $$('#alertsList [data-reply]').forEach(b => b.addEventListener('click', () => openReplyModal(b.dataset.reply)));
    $$('#alertsList [data-gopaper]').forEach(b => b.addEventListener('click', () => { switchTab('papers'); setTimeout(() => openPaperModal(b.dataset.gopaper), 100); }));
  }

  function alertItem(a) {
    const paper = a.paperId ? Store.getPaper(a.paperId) : null;
    return '<div class="alert-item' + (a.resolved ? ' resolved' : '') + '">' +
      '<i class="bi ' + (a.resolved ? 'bi-check-circle' : 'bi-exclamation-circle-fill') + '"></i>' +
      '<div class="ai-body">' +
      '<div class="ai-t">' + esc(a.title) + '</div>' +
      '<div class="ai-m">' + esc(a.message) + '</div>' +
      (a.reply ? '<div class="ai-m" style="margin-top:6px"><strong>ردّك:</strong> ' + esc(a.reply) + '</div>' : '') +
      '<div class="muted-note" style="margin-top:6px">' + fmtDate(a.createdAt) +
      (paper ? ' • <a data-gopaper="' + paper.id + '" style="cursor:pointer">' + esc(paper.title) + '</a>' : '') + '</div>' +
      (a.resolved ? '' : '<div style="margin-top:10px"><button class="btn sm" data-reply="' + a.id + '"><i class="bi bi-reply"></i> الرد وإغلاق التنبيه</button></div>') +
      '</div></div>';
  }

  function openReplyModal(alertId) {
    const a = Store.getAlerts().find(x => x.id === alertId);
    if (!a) return;
    openModal({
      title: 'الرد وإغلاق التنبيه',
      icon: 'bi-reply',
      body:
        '<div class="hint" style="margin-bottom:14px"><strong>الملاحظة الواردة:</strong><br>' + esc(a.message) + '</div>' +
        '<label class="field"><span>ردّك / الإجراء المتخذ</span><textarea id="reply_text" placeholder="مثال: تم إجراء التعديلات وإعادة التسليم بتاريخ..."></textarea></label>',
      footHTML: '<button class="btn" id="reply_save"><i class="bi bi-check-lg"></i> حفظ وإغلاق</button><button class="btn ghost" data-close>إلغاء</button>',
      onMount() {
        $('#reply_save').addEventListener('click', () => {
          const text = $('#reply_text').value.trim();
          Store.resolveAlert(alertId, text);
          toast('تم إغلاق التنبيه', 'ok');
          closeModal(); renderAll();
        });
      }
    });
  }

  // ===========================================================
  //  الإعدادات (Settings)
  // ===========================================================
  function renderSettings() {
    const acc = Store.getAccount();
    $('#set_display').value = acc.displayName || '';
    $('#set_academic').value = acc.academicEmail || '';
    $('#set_personal').value = acc.personalEmail || '';
    $('#set_apikey').value = acc.apiKey || '';
    $('#themeToggle').checked = (Store.getSettings().theme === 'dark');
  }

  $('#saveProfileBtn').addEventListener('click', () => {
    Store.updateAccount({
      displayName: $('#set_display').value.trim(),
      academicEmail: $('#set_academic').value.trim(),
      personalEmail: $('#set_personal').value.trim()
    });
    $('#userName').textContent = Store.getAccount().displayName || Store.getAccount().username;
    toast('تم حفظ الملف الشخصي', 'ok');
  });

  $('#saveApiKeyBtn').addEventListener('click', () => {
    Store.updateAccount({ apiKey: $('#set_apikey').value.trim() });
    toast(Store.getAccount().apiKey ? 'تم حفظ مفتاح Claude API' : 'تم مسح المفتاح', 'ok');
  });

  $('#changePassBtn').addEventListener('click', async () => {
    const oldP = $('#set_oldpass').value, newP = $('#set_newpass').value;
    try {
      await Auth.changePassword(oldP, newP);
      $('#set_oldpass').value = ''; $('#set_newpass').value = '';
      toast('تم تغيير الرقم السري', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  });

  $('#themeToggle').addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    Store.setSetting('theme', theme);
    applyTheme(theme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }

  // تصدير
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'research-tracker-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('تم تنزيل نسخة احتياطية', 'ok');
  });
  // استيراد بيانات المنصة
  $('#importDataBtn').addEventListener('click', () => $('#dataFileInput').click());
  $('#dataFileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const obj = JSON.parse(await file.text());
      const mode = confirm('استبدال البيانات الحالية؟\nموافق = استبدال، إلغاء = دمج') ? 'replace' : 'merge';
      Store.importData(obj, mode);
      toast('تم استيراد البيانات', 'ok');
      renderAll();
    } catch (err) { toast('ملف غير صالح', 'err'); }
    e.target.value = '';
  });

  // ===========================================================
  //  التنبيهات في الشريط العلوي
  // ===========================================================
  function renderAlertBadge() {
    const n = Store.getActiveAlerts().length;
    const badge = $('#alertBadge');
    if (n > 0) {
      badge.textContent = n;
      badge.style.display = 'grid';
      badge.classList.add('pulse');
    } else {
      badge.style.display = 'none';
      badge.classList.remove('pulse');
    }
  }
  $('#alertBellBtn').addEventListener('click', () => switchTab('alerts'));

  // ===========================================================
  //  تحديث شامل
  // ===========================================================
  function renderAll() {
    renderAlertBadge();
    const active = $('.tabs button.active');
    const tab = active ? active.dataset.tab : 'dashboard';
    if (tab === 'dashboard') renderDashboard();
    else if (tab === 'papers') renderPapers();
    else if (tab === 'journals') renderJournals();
    else if (tab === 'alerts') renderAlerts();
    else if (tab === 'settings') renderSettings();
  }

  // ===========================================================
  //  نظام النوافذ المنبثقة
  // ===========================================================
  const overlay = $('#modalOverlay');
  function openModal({ title, icon, body, footHTML, onMount }) {
    overlay.innerHTML =
      '<div class="modal"><header><h3><i class="bi ' + (icon || 'bi-window') + '"></i> ' + esc(title) + '</h3>' +
      '<button class="close-x" data-close>&times;</button></header>' +
      '<div class="body">' + body + '</div>' +
      '<div class="foot">' + (footHTML || '<button class="btn ghost" data-close>إغلاق</button>') + '</div></div>';
    overlay.classList.add('open');
    $$('[data-close]', overlay).forEach(b => b.addEventListener('click', closeModal));
    if (onMount) onMount();
  }
  function closeModal() { overlay.classList.remove('open'); overlay.innerHTML = ''; }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ===========================================================
  //  بذرة بيانات أولية (مجلات قانونية نموذجية) عند أول تشغيل
  // ===========================================================
  function seedIfEmpty() {
    if (Store.getJournals().length) return;
    const samples = [
      { name: 'International Sports Law Journal', wos: 'ESCI', scopus: 'نعم', quartile: 'Q2', category: 'القانون الرياضي', publishDuration: '4-6 أشهر', wordLimit: '10000', citationStyle: 'OSCOLA', scope: 'sports law arbitration governance athletes contracts القانون الرياضي التحكيم الحوكمة' },
      { name: 'Journal of Legal Studies', wos: 'SSCI', scopus: 'نعم', quartile: 'Q1', category: 'دراسات قانونية عامة', publishDuration: '6-9 أشهر', wordLimit: '12000', citationStyle: 'Chicago', scope: 'legal studies law theory regulation policy دراسات قانونية تنظيم سياسات' },
      { name: 'Arab Law Quarterly', wos: 'ESCI', scopus: 'نعم', quartile: 'Q3', category: 'القانون العربي والإسلامي', publishDuration: '3-5 أشهر', wordLimit: '8000', citationStyle: 'OSCOLA', scope: 'arab law islamic law sharia commercial القانون العربي الشريعة التجاري' },
      { name: 'Marquette Sports Law Review', wos: '—', scopus: 'لا', quartile: 'Q4', category: 'القانون الرياضي', publishDuration: '5-7 أشهر', wordLimit: '15000', citationStyle: 'Bluebook', scope: 'sports law disputes athletes labor القانون الرياضي منازعات اللاعبين' }
    ];
    Store.addJournalsBulk(samples);
  }

  // ===========================================================
  //  الإقلاع
  // ===========================================================
  function boot() {
    applyTheme(Store.getSettings().theme || 'light');
    seedIfEmpty();
    if (Auth.isLoggedIn()) enterApp();
    else showAuth();
  }

  boot();
})();
