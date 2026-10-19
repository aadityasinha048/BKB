'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from './translations';

const LanguageContext = createContext(null);

/**
 * Provides language state and translation function to the entire app.
 * Language preference is persisted in localStorage under 'bkb_language'.
 */
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bkb_language');
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (code) => {
    if (translations[code]) {
      setLanguageState(code);
      localStorage.setItem('bkb_language', code);
    }
  };

  /**
   * Translation function.
   * Falls back to English if the key is missing in the selected language.
   * Falls back to the raw key if missing in English too.
   */
  const t = (key) => {
    return (
      translations[language]?.[key] ??
      translations['en']?.[key] ??
      key
    );
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to consume language context in any client component.
 *
 * Usage:
 *   const { t, language, setLanguage } = useLanguage();
 *   <button>{t('common.addToCart')}</button>
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Return safe defaults when called outside provider (e.g., during SSR)
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key) => translations['en']?.[key] ?? key,
      currentLang: { code: 'en', label: 'English', nativeLabel: 'English', script: 'latin' },
      LANGUAGES,
    };
  }
  return ctx;
}
