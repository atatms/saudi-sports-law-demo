export interface EducationLevel {
  id: string;
  ar: string;
  en: string;
}

/** مراحل التعليم من المتوسطة إلى الدكتوراه. */
export const educationLevels: EducationLevel[] = [
  { id: 'intermediate', ar: 'المتوسطة', en: 'Intermediate' },
  { id: 'highschool', ar: 'الثانوية', en: 'High School' },
  { id: 'diploma', ar: 'دبلوم', en: 'Diploma' },
  { id: 'bachelor', ar: 'بكالوريوس', en: "Bachelor's" },
  { id: 'master', ar: 'ماجستير', en: "Master's" },
  { id: 'phd', ar: 'دكتوراه', en: 'Doctorate (PhD)' },
];

export function getEducationLevel(id?: string): EducationLevel | undefined {
  return educationLevels.find((e) => e.id === id);
}
