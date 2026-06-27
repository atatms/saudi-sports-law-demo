/**
 * المناطق الإدارية في المملكة العربية السعودية (13 منطقة)
 * The 13 administrative regions of Saudi Arabia, each with its major cities.
 * Used by the region dropdown filter on the Jobs screen.
 */
export interface Region {
  id: string;
  name: string; // Arabic name
  nameEn: string;
  cities: string[];
}

export const ALL_REGIONS_ID = 'all';

export const regions: Region[] = [
  {
    id: 'riyadh',
    name: 'منطقة الرياض',
    nameEn: 'Riyadh',
    cities: ['الرياض', 'الخرج', 'الدوادمي', 'المجمعة', 'الزلفي', 'وادي الدواسر'],
  },
  {
    id: 'makkah',
    name: 'منطقة مكة المكرمة',
    nameEn: 'Makkah',
    cities: ['مكة المكرمة', 'جدة', 'الطائف', 'رابغ', 'القنفذة'],
  },
  {
    id: 'madinah',
    name: 'منطقة المدينة المنورة',
    nameEn: 'Madinah',
    cities: ['المدينة المنورة', 'ينبع', 'العلا', 'بدر', 'مهد الذهب'],
  },
  {
    id: 'qassim',
    name: 'منطقة القصيم',
    nameEn: 'Al-Qassim',
    cities: ['بريدة', 'عنيزة', 'الرس', 'المذنب', 'البكيرية'],
  },
  {
    id: 'eastern',
    name: 'المنطقة الشرقية',
    nameEn: 'Eastern Province',
    cities: ['الدمام', 'الخبر', 'الظهران', 'الأحساء', 'الجبيل', 'حفر الباطن', 'القطيف'],
  },
  {
    id: 'asir',
    name: 'منطقة عسير',
    nameEn: 'Asir',
    cities: ['أبها', 'خميس مشيط', 'بيشة', 'النماص', 'محايل عسير'],
  },
  {
    id: 'tabuk',
    name: 'منطقة تبوك',
    nameEn: 'Tabuk',
    cities: ['تبوك', 'الوجه', 'ضباء', 'تيماء', 'حقل', 'نيوم'],
  },
  {
    id: 'hail',
    name: 'منطقة حائل',
    nameEn: "Ha'il",
    cities: ['حائل', 'بقعاء', 'الشنان', 'الغزالة'],
  },
  {
    id: 'northern',
    name: 'منطقة الحدود الشمالية',
    nameEn: 'Northern Borders',
    cities: ['عرعر', 'رفحاء', 'طريف'],
  },
  {
    id: 'jazan',
    name: 'منطقة جازان',
    nameEn: 'Jazan',
    cities: ['جازان', 'صبيا', 'أبو عريش', 'صامطة', 'فيفاء'],
  },
  {
    id: 'najran',
    name: 'منطقة نجران',
    nameEn: 'Najran',
    cities: ['نجران', 'شرورة', 'حبونا', 'بدر الجنوب'],
  },
  {
    id: 'bahah',
    name: 'منطقة الباحة',
    nameEn: 'Al-Bahah',
    cities: ['الباحة', 'بلجرشي', 'المندق', 'المخواة'],
  },
  {
    id: 'jawf',
    name: 'منطقة الجوف',
    nameEn: 'Al-Jawf',
    cities: ['سكاكا', 'دومة الجندل', 'القريات', 'طبرجل'],
  },
];

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}
