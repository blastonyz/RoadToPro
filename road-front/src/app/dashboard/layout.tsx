"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getAccessToken } from "@/lib/api";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const token = getAccessToken();
    if (!token) {
      router.replace("/onboarding/login");
      return;
    }
    (async () => {
      try {
        await api.auth.me();
        if (mounted) setAllowed(true);
      } catch {
        router.replace("/onboarding/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}


