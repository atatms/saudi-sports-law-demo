export type WorkMode = 'onsite' | 'hybrid' | 'remote';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyShort: string; // initials for avatar
  regionId: string;
  city: string;
  salary: number; // SAR / month
  experienceYears: number;
  workMode: WorkMode;
  fullTime: boolean;
  matchScore: number; // AI match %
  postedAgo: string;
  saved: boolean;
  about: string;
  requirements: string[];
  aiRequirementsMet: number; // out of 10
  aiRequirementsTotal: number;
  betterThan: number; // "أفضل x5 من المتقدمين"
  companyAbout: string;
}

export type ApplicationStage =
  | 'applied'
  | 'review'
  | 'interview'
  | 'offer'
  | 'final';

export type ApplicationStatus =
  | 'applied' // تم التقديم
  | 'review' // مراجعة
  | 'interview' // مقابلة
  | 'offer' // عرض
  | 'rejected'; // لم يتم الاختيار

export interface Application {
  id: string;
  jobId: string;
  title: string;
  company: string;
  companyShort: string;
  city: string;
  status: ApplicationStatus;
  currentStage: ApplicationStage;
  salary?: number;
  dateLabel: string; // e.g. "تم التقديم 29 أبر"
  note?: string; // e.g. interview schedule
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  provider: string;
  hours: number;
  level: CourseLevel;
  required: boolean;
}

export interface AtsPlatform {
  name: string;
  score: number;
}

export interface AtsCheck {
  status: 'pass' | 'warn' | 'fail';
  title: string;
  detail: string;
  action?: string;
}

export interface ResumeBreakdown {
  label: string;
  score: number;
}

export interface ResumeSuggestion {
  type: 'positive' | 'warning';
  title: string;
  detail: string;
  action?: string;
}
