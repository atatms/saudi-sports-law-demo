import { Ionicons } from '@expo/vector-icons';
import { WorkMode } from '../data/types';
import { colors } from '../theme';

export function formatSalary(sar: number): string {
  if (sar >= 1000) {
    const k = sar / 1000;
    const txt = Number.isInteger(k) ? `${k}` : k.toFixed(1);
    return `${txt} ألف ريال/شهر`;
  }
  return `${sar} ريال/شهر`;
}

export function workModeLabel(mode: WorkMode): string {
  switch (mode) {
    case 'remote':
      return 'عن بعد';
    case 'hybrid':
      return 'هجين';
    default:
      return 'في الموقع';
  }
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
