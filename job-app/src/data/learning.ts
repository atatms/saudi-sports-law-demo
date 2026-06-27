import { Course } from './types';

/**
 * دورات تطويرية موصى بها بناءً على فجوات المهارات في السيرة الذاتية.
 * تشمل منصات سعودية مجانية بشهادات معتمدة:
 *  - دروب (صندوق تنمية الموارد البشرية - هدف)
 *  - أكاديمية طويق
 *  - منصة هدف / دورات مهارات التوظيف
 * بالإضافة إلى منصات عالمية.
 */
export const courses: Course[] = [
  {
    id: 'c1',
    title: 'تحليل البيانات باستخدام Python',
    provider: 'دروب - هدف',
    hours: 6,
    level: 'beginner',
    required: true,
    free: true,
    certificate: true,
    skill: 'تحليل البيانات',
  },
  {
    id: 'c2',
    title: 'أساسيات الذكاء الاصطناعي وتعلم الآلة',
    provider: 'أكاديمية طويق',
    hours: 12,
    level: 'intermediate',
    required: true,
    free: true,
    certificate: true,
    skill: 'الذكاء الاصطناعي',
  },
  {
    id: 'c3',
    title: 'إدارة المنتجات الرقمية',
    provider: 'منصة هدف',
    hours: 10,
    level: 'intermediate',
    required: true,
    free: true,
    certificate: true,
    skill: 'إدارة المنتجات',
  },
  {
    id: 'c4',
    title: 'مهارات القيادة وإدارة الفرق',
    provider: 'دروب - هدف',
    hours: 5,
    level: 'intermediate',
    required: false,
    free: true,
    certificate: true,
    skill: 'القيادة',
  },
  {
    id: 'c5',
    title: 'اللغة الإنجليزية للأعمال',
    provider: 'دروب - هدف',
    hours: 20,
    level: 'beginner',
    required: false,
    free: true,
    certificate: true,
    skill: 'اللغة الإنجليزية',
  },
  {
    id: 'c6',
    title: 'تصميم تجربة المستخدم المتقدم',
    provider: 'Google (Coursera)',
    hours: 8,
    level: 'advanced',
    required: false,
    free: false,
    certificate: true,
    skill: 'تصميم تجربة المستخدم',
  },
];

export const skillsToImprove = [
  'تحليل البيانات',
  'إدارة المنتجات',
  'اللغة الإنجليزية',
  'القيادة',
  'الذكاء الاصطناعي',
];

export const learningProgress = {
  completedCourses: 2,
  totalCourses: 5,
  percent: 40,
  newSkills: 3,
  learningHours: 18,
  certificates: 2,
};

/** Courses recommended to close the gaps detected in the uploaded CV. */
export function recommendedCoursesForSkills(skills: string[]): Course[] {
  const matched = courses.filter((c) => c.skill && skills.includes(c.skill));
  // Prioritise free + certified courses.
  return matched.sort((a, b) => Number(b.free) - Number(a.free)).slice(0, 4);
}
