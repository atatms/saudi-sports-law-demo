import { AtsCheck, AtsPlatform, ResumeBreakdown, ResumeSuggestion } from './types';

export const profile = {
  name: 'أحمد الراشدي',
  title: 'مدير منتج أول',
  location: 'الرياض، المملكة العربية السعودية',
  resumeFile: 'Ahmad_Resume_2024.pdf',
  resumeMeta: '2 صفحة · 614 كلمة · تم التحليل الآن',
  education: 'جامعة الملك سعود · بكالوريوس علوم الحاسب',
  experience: '7 سنوات · 3 شركات',
  portfolioLinked: false,
  atsScore: 84,
  resumeScore: 72,
  skills: [
    'أبحاث تجربة المستخدم',
    'استراتيجية المنتج',
    'Agile / Scrum',
    'تحليل البيانات',
    'SQL',
    'Figma',
    'A/B Testing',
    'العربية',
    'الإنجليزية',
  ],
};

export const homeStats = {
  resumeScore: 72,
  atsScore: 84,
  betterThanApplicants: 161,
  pointsToReach85: 8,
  interviews: 2,
  applications: 11,
  newMatches: 3,
};

// ---- Resume analyzer ----
export const resumeScore = 72;

export const resumeBreakdown: ResumeBreakdown[] = [
  { label: 'الخبرة العملية', score: 88 },
  { label: 'المهارات', score: 74 },
  { label: 'التعليم', score: 95 },
  { label: 'الإنجازات', score: 45 },
  { label: 'الملخص', score: 60 },
];

export const resumeSuggestions: ResumeSuggestion[] = [
  {
    type: 'warning',
    title: 'لا توجد إنجازات مدعّمة بأرقام',
    detail:
      'أضف أرقاماً إلى النقاط — مثلاً "زدت الإيرادات 30%" أو "أدرت فريقاً من 8 أشخاص" — يحب المسؤولون عن التوظيف النتائج القابلة للقياس.',
    action: 'تصحيح بالذكاء الاصطناعي',
  },
  {
    type: 'warning',
    title: 'الملخص عام وغير محدد',
    detail:
      'ملخصك يبدو كأي ملخص. دع الذكاء الاصطناعي يكتبه ليطابق الوظائف المستهدفة.',
    action: 'إعادة كتابة بالذكاء الاصطناعي',
  },
  {
    type: 'positive',
    title: 'أعمال قوية ومتنوعة',
    detail: '14 فعلاً مؤثراً — نوع وافر لا تكرار.',
  },
];

// ---- ATS compatibility ----
export const atsScore = 84;

export const atsPlatforms: AtsPlatform[] = [
  { name: 'Taleo', score: 88 },
  { name: 'Workday', score: 91 },
  { name: 'iCIMS', score: 74 },
  { name: 'Greenhouse', score: 85 },
  { name: 'BambooHR', score: 90 },
  { name: 'SuccessFactors', score: 87 },
];

export const atsChecks: AtsCheck[] = [
  {
    status: 'pass',
    title: 'صيغة PDF قابلة للقراءة',
    detail: 'لم تُكتشف طبقة نص — قابل للقراءة بواسطة جميع أنظمة ATS الرئيسية.',
  },
  {
    status: 'pass',
    title: 'عناوين أقسام قياسية',
    detail: 'الخبرة، التعليم، المهارات — جميعها معارف بها.',
  },
  {
    status: 'warn',
    title: 'تناقض في تنسيق التواريخ',
    detail: 'مزيج من يناير 2021 و 01/2021 — قم بتوحيد أسلوب واحد.',
    action: 'إصلاح تلقائي',
  },
  {
    status: 'warn',
    title: 'رموز نقاط خاصة',
    detail: '2 نقطة تستخدم رمزاً خاصاً — استبدلها بنقاط عادية.',
    action: 'استبدال الكل',
  },
];

export const atsMissingKeywords = [
  'خارطة طريق المنتج',
  'OKRs',
  'إدارة أصحاب المصلحة',
  'تخطيط الطريق',
  'منهج الوظائف',
  'الطرح في السوق',
  'مؤشرات الأداء KPIs',
];
