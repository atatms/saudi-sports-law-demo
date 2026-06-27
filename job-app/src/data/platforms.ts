import { JobPlatform } from './types';

/**
 * منصات التوظيف التي يمكن ربط التطبيق بها.
 * Known job-board platforms the user can link; once connected, their
 * listings appear in the unified jobs feed.
 */
export const jobPlatforms: JobPlatform[] = [
  {
    id: 'linkedin',
    name: 'لينكدإن',
    nameEn: 'LinkedIn',
    color: '#0A66C2',
    initials: 'in',
    description: 'أكبر شبكة مهنية عالمية',
  },
  {
    id: 'bayt',
    name: 'بيت.كوم',
    nameEn: 'Bayt',
    color: '#1F8A70',
    initials: 'بيت',
    description: 'منصة توظيف رائدة في الشرق الأوسط',
  },
  {
    id: 'taqat',
    name: 'طاقات (هدف)',
    nameEn: 'Taqat - HRDF',
    color: '#4E6137',
    initials: 'طا',
    description: 'البوابة الوطنية للتوظيف - صندوق تنمية الموارد البشرية',
  },
  {
    id: 'indeed',
    name: 'إنديد',
    nameEn: 'Indeed',
    color: '#2557A7',
    initials: 'ID',
    description: 'محرك بحث وظائف عالمي',
  },
  {
    id: 'mihnati',
    name: 'مهنتي',
    nameEn: 'Mihnati',
    color: '#C0564B',
    initials: 'مه',
    description: 'منصة توظيف سعودية',
  },
  {
    id: 'glassdoor',
    name: 'جلاسدور',
    nameEn: 'Glassdoor',
    color: '#0CAA41',
    initials: 'GD',
    description: 'وظائف وتقييمات الشركات والرواتب',
  },
];

export function getPlatformById(id: string): JobPlatform | undefined {
  return jobPlatforms.find((p) => p.id === id);
}
