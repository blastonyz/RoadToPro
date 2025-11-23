"use client";

import { translations } from "@/i18n/Translations";
import { ChevronDown } from "lucide-react";
import { useState, createContext, useContext, ReactNode, useEffect, useRef } from "react";

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
      setLanguage(stored);
      return;
    }
    if (!stored) {
      const browserLang =
        (navigator.language?.slice(0, 2) as AvailableLanguages) || "en";
      const normalized =
        browserLang === "es" || browserLang === "en" ? browserLang : "en";
      setLanguage(normalized);
      localStorage.setItem("app-language", normalized);
    }
  }, [language]);
  const changeLanguage = (lang: AvailableLanguages) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app-language", lang);
    }
  };

  const t = (key: string) => translations[language][key] || key;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

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

  const selectorRef = useRef<HTMLDivElement | null>(null);

  const languages: { code: "es" | "en"; label: string }[] = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={selectorRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          cursor-pointer flex items-center gap-2 
          px-4 py-2.5 
          rounded-full border border-gray-300 
          bg-white 
          text-sm font-medium text-gray-700
          hover:bg-gray-100 transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none
        "
      >
        {language.toUpperCase()}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-3 
            w-44 bg-white 
            rounded-xl shadow-xl border border-gray-200 
            overflow-hidden z-50
            animate-fade-in ring-1 ring-black/5
          "
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
              }}
              disabled={code === language}
              className={`
                w-full text-left px-4 py-3 
                text-sm transition-all duration-150
                focus-visible:outline-none focus-visible:bg-gray-100
                ${
                  code === language
                    ? "bg-gray-100 text-gray-600 font-medium cursor-not-allowed"
                    : "cursor-pointer text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};