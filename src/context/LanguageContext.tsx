/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en' | 'pt' | 'ru' | 'de' | null;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const STORAGE_KEY = 'elpuestito_language';

function loadLanguage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Language;
      if (parsed && ['es', 'en', 'pt', 'ru', 'de'].includes(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return 'es';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => loadLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (lang) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lang));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Language;
          if (parsed && ['es', 'en', 'pt', 'ru', 'de'].includes(parsed)) {
            setLanguageState(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
