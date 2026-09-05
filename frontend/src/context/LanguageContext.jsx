import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { TRANSLATIONS } from '../constants/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { user, updateLanguagePreference } = useAuth();

  // Initialize from user preference, localStorage, or default 'en'
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('fmch_lang') || 'en';
  });

  // Keep language in sync if user logs in with a specific preference
  useEffect(() => {
    if (user?.preferredLanguage && user.preferredLanguage !== language) {
      setLanguageState(user.preferredLanguage);
      localStorage.setItem('fmch_lang', user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  // Handler to switch language globally
  const setLanguage = useCallback(async (newLang) => {
    if (!newLang) return;
    setLanguageState(newLang);
    localStorage.setItem('fmch_lang', newLang);

    // If logged in, also update backend preference asynchronously
    if (user && user.id && updateLanguagePreference) {
      try {
        await updateLanguagePreference(newLang);
      } catch (err) {
        console.warn('Could not sync language preference to backend profile:', err);
      }
    }
  }, [user, updateLanguagePreference]);

  // Translation function t(key, fallback)
  const t = useCallback((key, fallback) => {
    if (!key) return '';
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback !== undefined ? fallback : key;
  }, [language]);

  const value = {
    language,
    currentLanguage: language,
    setLanguage,
    changeLanguage: setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

