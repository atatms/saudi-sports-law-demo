import { Course } from './types';

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'تحليل البيانات باستخدام Python',
    provider: 'Coursera',
    hours: 6,
    level: 'beginner',
    required: true,
  },
  {
    id: 'c2',
    title: 'إدارة المنتجات الرقمية',
    provider: 'Udemy',
    hours: 10,
    level: 'intermediate',
    required: true,
  },
  {
    id: 'c3',
    title: 'تصميم تجربة المستخدم المتقدم',
    provider: 'Google',
    hours: 8,
    level: 'advanced',
    required: false,
  },
  {
    id: 'c4',
    title: 'القيادة وإدارة الفرق',
    provider: 'LinkedIn Learning',
    hours: 5,
    level: 'intermediate',
    required: false,
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
