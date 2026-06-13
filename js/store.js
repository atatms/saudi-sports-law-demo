/* ===========================================================
   store.js — طبقة البيانات والتخزين المحلي (localStorage)
   نسخة قابلة للتطوير: schemaVersion يسمح بالترقية لاحقًا
   =========================================================== */
(function (global) {
  'use strict';

  const KEY = 'rjt_data_v1';        // مفتاح التخزين
  const SCHEMA_VERSION = 1;

  // الحالات المعتمدة لمسار البحث من التسليم إلى النشر
  const STATUSES = {
    writing:   { label: 'تحت الكتابة',     color: 'var(--st-writing)',   order: 1, group: 'writing' },
    ready:     { label: 'جاهزة للتسليم',   color: 'var(--st-ready)',     order: 2, group: 'ready' },
    submitted: { label: 'مُرسلة',          color: 'var(--st-submitted)', order: 3, group: 'submitted' },
    review:    { label: 'تحت المراجعة',    color: 'var(--st-review)',    order: 4, group: 'submitted' },
    revision:  { label: 'تعديلات مطلوبة',  color: 'var(--st-revision)',  order: 5, group: 'submitted' },
    accepted:  { label: 'مقبول',           color: 'var(--st-accepted)',  order: 6, group: 'submitted' },
    published: { label: 'منشور',           color: 'var(--st-published)', order: 7, group: 'done' },
    rejected:  { label: 'مرفوض',           color: 'var(--st-rejected)',  order: 8, group: 'done' }
  };

  const STATUS_ORDER = ['writing','ready','submitted','review','revision','accepted','published','rejected'];

  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function defaultData() {
    return {
      schemaVersion: SCHEMA_VERSION,
      account: null,          // { username, passHash, salt, displayName, academicEmail, personalEmail, apiKey }
      papers: [],             // الأبحاث
      journals: [],           // قاعدة بيانات المجلات
      alerts: [],             // التنبيهات المستمرة
      settings: { theme: 'light' }
    };
  }

  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? JSON.parse(raw) : defaultData();
    } catch (e) {
      console.error('فشل قراءة البيانات، سيتم البدء من جديد', e);
      cache = defaultData();
    }
    cache = migrate(cache);
    return cache;
  }

  // ترقية المخطط عند تطوير المنصة مستقبلاً
  function migrate(data) {
    if (!data.schemaVersion) data.schemaVersion = 1;
    if (!data.settings) data.settings = { theme: 'light' };
    if (!Array.isArray(data.papers)) data.papers = [];
    if (!Array.isArray(data.journals)) data.journals = [];
    if (!Array.isArray(data.alerts)) data.alerts = [];
    return data;
  }

  function persist() {
    if (!cache) return;
    localStorage.setItem(KEY, JSON.stringify(cache));
  }

  const Store = {
    STATUSES, STATUS_ORDER, SCHEMA_VERSION,
    uid,

    all() { return load(); },
    save() { persist(); },

    /* ---------- الحساب ---------- */
    getAccount() { return load().account; },
    setAccount(acc) { load().account = acc; persist(); },
    updateAccount(patch) {
      const d = load();
      d.account = Object.assign({}, d.account, patch);
      persist();
      return d.account;
    },

    /* ---------- الإعدادات ---------- */
    getSettings() { return load().settings; },
    setSetting(k, v) { load().settings[k] = v; persist(); },

    /* ---------- الأبحاث ---------- */
    getPapers() { return load().papers; },
    getPaper(id) { return load().papers.find(p => p.id === id); },
    addPaper(p) {
      const d = load();
      const now = new Date().toISOString();
      const paper = Object.assign({
        id: uid('paper'),
        title: '',
        abstract: '',
        keywords: '',
        wordCount: '',
        status: 'writing',
        journalId: '',
        journalName: '',
        submittedDate: '',
        createdAt: now,
        lastUpdate: now,
        events: []
      }, p);
      if (!paper.events.length) {
        paper.events.push({ id: uid('e'), date: now, type: 'status', text: 'تم إنشاء البحث بحالة: ' + (STATUSES[paper.status] ? STATUSES[paper.status].label : paper.status) });
      }
      d.papers.unshift(paper);
      persist();
      return paper;
    },
    updatePaper(id, patch) {
      const d = load();
      const p = d.papers.find(x => x.id === id);
      if (!p) return null;
      Object.assign(p, patch);
      p.lastUpdate = new Date().toISOString();
      persist();
      return p;
    },
    deletePaper(id) {
      const d = load();
      d.papers = d.papers.filter(p => p.id !== id);
      d.alerts = d.alerts.filter(a => a.paperId !== id);
      persist();
    },
    addPaperEvent(id, evt) {
      const d = load();
      const p = d.papers.find(x => x.id === id);
      if (!p) return null;
      const e = Object.assign({ id: uid('e'), date: new Date().toISOString(), type: 'note', text: '' }, evt);
      p.events.unshift(e);
      p.lastUpdate = e.date;
      persist();
      return e;
    },
    setPaperStatus(id, status) {
      const d = load();
      const p = d.papers.find(x => x.id === id);
      if (!p || p.status === status) return p;
      const prev = p.status;
      p.status = status;
      p.lastUpdate = new Date().toISOString();
      if (status === 'submitted' && !p.submittedDate) {
        p.submittedDate = p.lastUpdate;
      }
      p.events.unshift({
        id: uid('e'), date: p.lastUpdate, type: 'status',
        text: 'تغيّرت الحالة من «' + (STATUSES[prev] ? STATUSES[prev].label : prev) +
              '» إلى «' + (STATUSES[status] ? STATUSES[status].label : status) + '»'
      });
      persist();
      return p;
    },

    /* ---------- المجلات ---------- */
    getJournals() { return load().journals; },
    getJournal(id) { return load().journals.find(j => j.id === id); },
    addJournal(j) {
      const d = load();
      const journal = Object.assign({
        id: uid('jr'),
        name: '',
        wos: '',          // تصنيف ويب أوف ساينس (SCIE/SSCI/ESCI/—)
        scopus: '',       // مفهرسة في سكوبس (نعم/لا)
        quartile: '',     // Q1..Q4
        category: '',      // المجال/التخصص
        publishDuration: '', // مدة النشر
        wordLimit: '',    // عدد الكلمات المقبول
        citationStyle: '',// نمط التوثيق
        scope: '',        // نطاق المجلة/الكلمات المفتاحية
        email: '',
        url: '',
        contacted: false, // هل تمت مراسلتها
        createdAt: new Date().toISOString()
      }, j);
      d.journals.unshift(journal);
      persist();
      return journal;
    },
    addJournalsBulk(list) {
      const d = load();
      let added = 0;
      list.forEach(item => {
        const journal = Object.assign({
          id: uid('jr'), name: '', wos: '', scopus: '', quartile: '', category: '',
          publishDuration: '', wordLimit: '', citationStyle: '', scope: '', email: '', url: '',
          contacted: false, createdAt: new Date().toISOString()
        }, item);
        if (!journal.name) return;
        d.journals.push(journal);
        added++;
      });
      persist();
      return added;
    },
    updateJournal(id, patch) {
      const d = load();
      const j = d.journals.find(x => x.id === id);
      if (!j) return null;
      Object.assign(j, patch);
      persist();
      return j;
    },
    deleteJournal(id) {
      const d = load();
      d.journals = d.journals.filter(j => j.id !== id);
      persist();
    },

    /* ---------- التنبيهات المستمرة ---------- */
    getAlerts() { return load().alerts; },
    getActiveAlerts() { return load().alerts.filter(a => !a.resolved); },
    addAlert(alert) {
      const d = load();
      const a = Object.assign({
        id: uid('al'),
        paperId: '',
        title: 'ملاحظة من المجلة',
        message: '',
        createdAt: new Date().toISOString(),
        resolved: false,
        resolvedAt: null
      }, alert);
      d.alerts.unshift(a);
      persist();
      return a;
    },
    resolveAlert(id, replyText) {
      const d = load();
      const a = d.alerts.find(x => x.id === id);
      if (!a) return null;
      a.resolved = true;
      a.resolvedAt = new Date().toISOString();
      a.reply = replyText || '';
      // سجّل الرد في الخط الزمني للبحث
      if (a.paperId && replyText) {
        Store.addPaperEvent(a.paperId, { type: 'reply', text: 'تم الرد على ملاحظة المجلة: ' + replyText });
      }
      persist();
      return a;
    },

    /* ---------- التصدير / الاستيراد ---------- */
    exportJSON() {
      const d = load();
      const copy = JSON.parse(JSON.stringify(d));
      if (copy.account) { delete copy.account.passHash; delete copy.account.salt; delete copy.account.apiKey; }
      return JSON.stringify(copy, null, 2);
    },
    importData(obj, mode) {
      const d = load();
      if (mode === 'replace') {
        if (Array.isArray(obj.papers)) d.papers = obj.papers;
        if (Array.isArray(obj.journals)) d.journals = obj.journals;
        if (Array.isArray(obj.alerts)) d.alerts = obj.alerts;
      } else {
        if (Array.isArray(obj.papers)) d.papers = obj.papers.concat(d.papers);
        if (Array.isArray(obj.journals)) d.journals = d.journals.concat(obj.journals);
        if (Array.isArray(obj.alerts)) d.alerts = obj.alerts.concat(d.alerts);
      }
      migrate(d);
      persist();
    }
  };

  global.Store = Store;
})(window);
