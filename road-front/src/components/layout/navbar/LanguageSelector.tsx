"use client";

import { translations } from "@/i18n/Translations";
import { ChevronDown } from "lucide-react";
import { useState, createContext, useContext, ReactNode, useEffect } from "react";

type AvailableLanguages = "es" | "en";
export type Translations = {
  [key in AvailableLanguages]: { [key: string]: string };
};

interface LanguageContextProps {
  language: AvailableLanguages;
  setLanguage: (lang: AvailableLanguages) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<AvailableLanguages>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("app-language") as AvailableLanguages;
    if (stored && stored !== language) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguage(stored)
    }
  }, [language]);
  const changeLanguage = (lang: AvailableLanguages) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app-language", lang);
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: AvailableLanguages[] = ["es", "en"];

  return (
    <div className="relative inline-block px-4 py-2.5 border rounded-full border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
      >
        {language.toUpperCase()}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-border">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 ${
                language === lang
                  ? "text-primary font-medium cursor-not-allowed bg-secondary"
                  : "text-foreground hover:bg-secondary cursor-pointer"
              }`}
              disabled={language === lang}
            >
              {lang === "es" ? "Español" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
