"use client";

import { ArrowLeft, Menu, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import {
  useLanguage,
  LanguageSelector,
} from "../layout/navbar/LanguageSelector";
import { api, clearTokens } from "@/lib/api";

interface DashboardNavbarProps {
  link?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  returnData: {
    label: string;
    href: string;
  };
}

export function DashboardNavbar({ link, returnData }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { t } = useLanguage();

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: t("dashboard_nav_home"), href: "/dashboard" },
    { label: t("dashboard_nav_challenges"), href: "/dashboard/challenges" },
    { label: t("dashboard_nav_training"), href: "/dashboard/training" },
    { label: t("dashboard_nav_score"), href: "/dashboard/score" },
    { label: t("dashboard_nav_pro_plan"), href: "/dashboard/pro/plan" },
    { label: t("dashboard_nav_campaign"), href: "/dashboard/campaign" },
    { label: t("dashboard_nav_wallet"), href: "/dashboard/wallet" },
    { label: t("dashboard_nav_notifications"), href: "/dashboard/notifications" },
    { label: t("dashboard_nav_contract"), href: "/dashboard/contract" },
    { label: t("dashboard_nav_clubs"), href: "/dashboard/clubs" },
    { label: t("dashboard_nav_mission"), href: "/dashboard/mission" },
    { label: t("dashboard_nav_providers"), href: "/dashboard/providers" },
    { label: t("dashboard_nav_settings"), href: "/dashboard/settings" },
    // { label: t("dashboard_nav_upload"), href: "/dashboard/challenges/upload" },
  ];

  const visibleLinks = navLinks.slice(0, 5);
  const hiddenLinks = navLinks.slice(5);

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto flex flex-row gap-4 md:gap-0 justify-between items-center py-4">
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <Link
            href={returnData.href}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {returnData.label}
          </Link>

          <h1 className="font-kensmark font-bold text-xl whitespace-nowrap">
            Open League
          </h1>

          <div className="hidden xl:block">
            <LanguageSelector />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto justify-end relative">
          <ul className="hidden xl:flex items-center gap-2 overflow-x-auto">
            {visibleLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="flex-shrink-0">
                  <Link
                    href={item.href}
                    className={clsx(
                      "inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setMobileNav((x) => !x)}
            className="xl:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {mobileNav ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden xl:block relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu((x) => !x)}
              className="cursor-pointer px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 ring-1 ring-black/5 animate-fade-in">
                {hiddenLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "block px-4 py-2 text-sm transition-colors whitespace-nowrap",
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setOpenMenu(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="my-2 border-t border-gray-200" />
                <button
                  onClick={async () => {
                    try {
                      await api.auth.logout();
                    } catch {
                      // noop
                    } finally {
                      clearTokens();
                      setOpenMenu(false);
                      if (typeof window !== "undefined") {
                        window.location.replace("/onboarding/login");
                      }
                    }
                  }}
                  className="cursor-pointer w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {mobileNav && (
          <div className="xl:hidden absolute top-full right-4 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 flex flex-col justify-center items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "block w-full px-4 py-2 rounded-full text-sm font-semibold text-center transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700"
                  )}
                  onClick={() => setMobileNav(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            {link && (
              <Link
                href={link.href}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#060318] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full"
              >
                {link.icon && <span className="ml-1">{link.icon}</span>}
                {link.label}
              </Link>
            )}
            <LanguageSelector />
          </div>
        )}

        {link && (
          <div className="hidden xl:flex">

          </div>
        )}
      </div>
    </nav>
  );
}
