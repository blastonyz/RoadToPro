"use client";

import { navbarItemsStatic, NavbarItemStatic } from "./NavbarLinks";
import { LanguageSelector, useLanguage } from "./LanguageSelector";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const renderItem = (item: NavbarItemStatic, isMobile = false) => {
    if (item.type === "link") {
      const isActive = pathname === item.href;

      return (
        <a
          key={item.id}
          href={item.href}
          className={clsx(
            "relative inline-block hover:text-gray-900 transition group py-2",
            isActive
              ? "font-semibold text-gray-900 underline-active"
              : "text-gray-500 underline-hover",
            isMobile && "text-base block"
          )}
        >
          {t(item.id)}
        </a>
      );
    } else {
      const isChildActive = item.children.some(
        (child) => child.type === "link" && child.href === pathname
      );
      const isOpen = openDropdown === item.id;

      return (
        <li key={item.id} className="relative w-full">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={clsx(
              "cursor-pointer flex items-center justify-between w-full py-2 hover:text-gray-900 transition",
              isChildActive ? "font-semibold text-gray-900" : "text-gray-500"
            )}
          >
            <span>{t(item.id)}</span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <ul
              className={clsx(
                "bg-white rounded shadow-md mt-1 text-sm z-10",
                isMobile
                  ? "relative p-2 border border-gray-100"
                  : "absolute top-full left-0 min-w-[150px]"
              )}
            >
              {item.children.map((child) => renderItem(child, isMobile))}
            </ul>
          )}
        </li>
      );
    }
  };

  return (
    <nav className="w-full py-6">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h1 className="font-kensmark font-bold text-xl">Road To Pro</h1>
            <LanguageSelector />
          </div>

          <ul className="hidden lg:flex items-center gap-8">
            {navbarItemsStatic.map((item) => renderItem(item))}
          </ul>

          <div className="hidden lg:flex items-center gap-3.5">
            <Link
              href="/login"
              className="w-fit cursor-pointer hover:text-black hover:underline text-base font-medium text-gray-700 w-full text-left"
            >
              {t("navbar_buttons_login")}
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/onboarding"
              className="flex items-center gap-2 px-6 py-3.5 bg-[#060318] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {t("navbar_buttons_joinus")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 text-gray-700"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden mt-4 bg-white shadow-lg rounded-xl p-5 animate-fadeIn">
            <ul className="flex flex-col gap-3">
              {navbarItemsStatic.map((item) => renderItem(item, true))}
            </ul>

            <div className="flex flex-col gap-4 mt-6">
              <Link
                href="/login"
                className="cursor-pointer hover:text-black hover:underline text-base font-medium text-gray-700 w-full text-left"
              >
                {t("navbar_buttons_login")}
              </Link>
              <Link
                href={"/onboarding"}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#060318] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t("navbar_buttons_joinus")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
