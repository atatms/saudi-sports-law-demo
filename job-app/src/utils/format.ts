import { Ionicons } from '@expo/vector-icons';
import { WorkMode } from '../data/types';
import { colors } from '../theme';

export type Lang = 'ar' | 'en';

export function formatSalary(sar: number, lang: Lang = 'ar'): string {
  if (sar >= 1000) {
    const k = sar / 1000;
    const txt = Number.isInteger(k) ? `${k}` : k.toFixed(1);
    return lang === 'ar' ? `${txt} ألف ريال/شهر` : `${txt}K SAR/mo`;
  }
  return lang === 'ar' ? `${sar} ريال/شهر` : `${sar} SAR/mo`;
}

export function workModeLabel(mode: WorkMode, lang: Lang = 'ar'): string {
  const map: Record<WorkMode, [string, string]> = {
    remote: ['عن بعد', 'Remote'],
    hybrid: ['هجين', 'Hybrid'],
    onsite: ['في الموقع', 'On-site'],
  };
  return lang === 'ar' ? map[mode][0] : map[mode][1];
}

export function workModeIcon(mode: WorkMode): keyof typeof Ionicons.glyphMap {
  switch (mode) {
    case 'remote':
      return 'home-outline';
    case 'hybrid':
      return 'git-merge-outline';
    default:
      return 'business-outline';
  }
}

export function matchColor(score: number): string {
  if (score >= 85) return colors.primary;
  if (score >= 70) return colors.gold;
  return colors.textMuted;
}
