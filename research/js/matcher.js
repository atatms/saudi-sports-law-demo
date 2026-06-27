/* ===========================================================
   matcher.js — قارئ الملخص بالذكاء الاصطناعي
   يرشّح أفضل المجلات لملخص المقال.
   • إن وُجد مفتاح Claude API: يستخدم نموذج Claude (claude-opus-4-8)
     مباشرةً من المتصفح عبر رأس الوصول المباشر.
   • إن لم يوجد مفتاح: يستخدم تحليلًا محليًا ذكيًا (تطابق كلمات + ملاءمة
     حدّ الكلمات والتصنيف) مع شرح سبب الترشيح.
   =========================================================== */
(function (global) {
  'use strict';

  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-opus-4-8';

  // ---------- التحليل المحلي (احتياطي وبدون تكلفة) ----------
  const STOP = new Set(('في من إلى على عن مع هذا هذه ذلك التي الذي وقد كما أو ثم إن أن كان يكون عند بعد قبل بين حول نحو لكن غير دون مدى ضمن خلال the of and to in for on with a an is are this that as by from at be it its their which study research paper analysis based using').split(/\s+/));

  function tokenize(text) {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .replace(/[^ء-يa-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP.has(w));
  }

  function localScore(abstract, keywords, wordCount, journals) {
    const absTokens = new Set(tokenize(abstract + ' ' + (keywords || '')));
    const results = journals.map(j => {
      const jTokens = tokenize((j.scope || '') + ' ' + (j.category || '') + ' ' + (j.name || ''));
      let overlap = 0;
      jTokens.forEach(t => { if (absTokens.has(t)) overlap++; });
      const denom = Math.max(6, jTokens.length);
      let score = (overlap / denom) * 70;            // 0..70 من تطابق المجال
      const reasons = [];
      if (overlap > 0) reasons.push('تطابق ' + overlap + ' كلمة مع نطاق المجلة');

      // ملاءمة عدد الكلمات
      const wc = parseInt(String(wordCount).replace(/[^\d]/g, ''), 10);
      const lim = parseInt(String(j.wordLimit).replace(/[^\d]/g, ''), 10);
      if (wc && lim) {
        if (wc <= lim) { score += 15; reasons.push('عدد كلمات بحثك (' + wc + ') ضمن حد المجلة (' + lim + ')'); }
        else { score -= 10; reasons.push('عدد كلمات بحثك يتجاوز حد المجلة (' + lim + ')'); }
      }
      // أفضلية للتصنيف العالي
      if (/q1/i.test(j.quartile)) { score += 10; reasons.push('تصنيف Q1'); }
      else if (/q2/i.test(j.quartile)) { score += 6; }
      if (/scie|ssci/i.test(j.wos)) { score += 5; reasons.push('مفهرسة في Web of Science'); }
      if (/نعم|yes|scopus/i.test(j.scopus)) { score += 3; }

      score = Math.max(0, Math.min(100, Math.round(score)));
      return { id: j.id, name: j.name, score, reason: reasons.join(' • ') || 'تطابق محدود مع نطاق المجلة' };
    });
    results.sort((a, b) => b.score - a.score);
    return results.filter(r => r.score > 0).slice(0, 8);
  }

  // ---------- التحليل عبر Claude API ----------
  async function claudeScore(abstract, keywords, wordCount, journals, apiKey) {
    const journalList = journals.map((j, i) => ({
      index: i, id: j.id, name: j.name,
      scope: j.scope, category: j.category, quartile: j.quartile,
      wos: j.wos, scopus: j.scopus, wordLimit: j.wordLimit, citationStyle: j.citationStyle
    }));

    const sys = 'أنت مساعد أكاديمي خبير في النشر العلمي بمجال القانون. مهمتك ترشيح أنسب المجلات لمقال بناءً على ملخصه ومطابقته مع نطاق كل مجلة وتصنيفها وحد الكلمات. أعد ترتيبًا واقعيًا مع سبب موجز بالعربية لكل ترشيح. أعد النتائج بصيغة JSON فقط.';

    const userMsg =
      'ملخص المقال:\n"""' + (abstract || '') + '"""\n\n' +
      'الكلمات المفتاحية: ' + (keywords || 'غير محددة') + '\n' +
      'عدد كلمات المقال التقريبي: ' + (wordCount || 'غير محدد') + '\n\n' +
      'قائمة المجلات المتاحة (JSON):\n' + JSON.stringify(journalList) + '\n\n' +
      'رشّح حتى 8 مجلات الأنسب. لكل مجلة: id، name، score (0-100 يمثل درجة الملاءمة)، reason (سبب موجز بالعربية). ' +
      'رتّب تنازليًا حسب score. أعد فقط JSON بهذا الشكل: ' +
      '{"recommendations":[{"id":"...","name":"...","score":85,"reason":"..."}]}';

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: sys,
        messages: [{ role: 'user', content: userMsg }],
        output_config: {
          format: {
            type: 'json_schema',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      score: { type: 'integer' },
                      reason: { type: 'string' }
                    },
                    required: ['id', 'name', 'score', 'reason']
                  }
                }
              },
              required: ['recommendations']
            }
          }
        }
      })
    });

    if (!resp.ok) {
      let detail = '';
      try { const e = await resp.json(); detail = (e.error && e.error.message) || ''; } catch (_) {}
      const err = new Error('فشل الاتصال بـ Claude API (' + resp.status + ') ' + detail);
      err.status = resp.status;
      throw err;
    }

    const data = await resp.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    if (!textBlock) throw new Error('استجابة غير متوقعة من النموذج');
    let parsed;
    try { parsed = JSON.parse(textBlock.text); }
    catch (e) { throw new Error('تعذّر تحليل استجابة النموذج'); }
    const recs = (parsed.recommendations || []).map(r => ({
      id: r.id, name: r.name,
      score: Math.max(0, Math.min(100, parseInt(r.score, 10) || 0)),
      reason: r.reason || ''
    }));
    recs.sort((a, b) => b.score - a.score);
    return recs;
  }

  const Matcher = {
    hasApiKey() {
      const acc = Store.getAccount();
      return !!(acc && acc.apiKey && acc.apiKey.trim());
    },

    // يرجّع { engine: 'claude'|'local', recommendations: [...] }
    async recommend(abstract, keywords, wordCount) {
      const journals = Store.getJournals();
      if (!journals.length) {
        return { engine: 'none', recommendations: [], error: 'لا توجد مجلات في القاعدة بعد. أضف مجلات أو ارفع ملف CSV/Excel أولاً.' };
      }
      const acc = Store.getAccount();
      const key = acc && acc.apiKey ? acc.apiKey.trim() : '';

      if (key) {
        try {
          const recs = await claudeScore(abstract, keywords, wordCount, journals, key);
          return { engine: 'claude', recommendations: recs };
        } catch (e) {
          // عند فشل API نرجع للتحليل المحلي مع إعلام المستخدم
          const recs = localScore(abstract, keywords, wordCount, journals);
          return { engine: 'local', recommendations: recs, warn: 'تعذّر استخدام Claude API (' + e.message + ')، تم التحويل للتحليل المحلي.' };
        }
      }
      const recs = localScore(abstract, keywords, wordCount, journals);
      return { engine: 'local', recommendations: recs };
    }
  };

  global.Matcher = Matcher;
})(window);
