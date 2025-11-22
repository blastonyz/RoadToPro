"use client";

import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SocialProps {
  link: string;
  social: string;
  theme?: "dark" | "light";
}

export function Social({ link, social, theme }: SocialProps) {
  const isDark = theme === "dark";

  return (
    <Link
      href={link}
      target="_blank"
      className={clsx(
        "mx-auto w-full py-8 border-t last:border-b uppercase group transition-all duration-300 ease-out",
        {
          "w-[90%] sm:w-[85%] md:w-[80%] border-gray-300 text-black hover:translate-x-1":
            !isDark,
          "w-full bg-[#0b0d0f] text-white overflow-hidden": isDark,
        }
      )}
    >
      {isDark && (
        <div className="scrolling-social flex-row items-center justify-center gap-12">
          {Array.from({ length: 10 }).map((_, index) => (
            <React.Fragment key={index}>
              <span className="group-hover:underline font-black text-5xl">
                {social}
              </span>
              <ArrowUpRight size={56} />
            </React.Fragment>
          ))}
        </div>
      )}

      {!isDark && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <span className="font-black text-3xl sm:text-4xl lg:text-5xl group-hover:underline transition-all duration-300">
            {social}
          </span>

          <span className="text-lg sm:text-base font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
            View more
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      )}

      <style>{` @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } } .scrolling-social { animation: scroll 30s linear infinite; display: flex; width: fit-content; } `}</style>
    </Link>
  );
}
