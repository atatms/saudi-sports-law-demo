import React, { createContext, useContext, useMemo, useState } from 'react';
import { TextStyle } from 'react-native';

export type Lang = 'ar' | 'en';

interface LanguageContextValue {
  lang: Lang;
  isRTL: boolean;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Inline translation helper: pick Arabic or English by current language. */
  L: (ar: string, en: string) => string;
  /** Text style honouring the current writing direction. */
  rtlText: (extra?: TextStyle) => TextStyle;
  /** Flex direction for a "start→end" row in the current language. */
  rowStart: 'row' | 'row-reverse';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  const isRTL = lang === 'ar';

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      isRTL,
      setLang,
      toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
      L: (ar, en) => (lang === 'ar' ? ar : en),
      rtlText: (extra) => ({
        textAlign: isRTL ? 'right' : 'left',
        writingDirection: isRTL ? 'rtl' : 'ltr',
        ...(extra || {}),
      }),
      rowStart: isRTL ? 'row-reverse' : 'row',
    }),
    [lang, isRTL],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
