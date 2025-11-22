"use client";

import { LanguageProvider } from "@/components/layout/navbar/LanguageSelector";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
