"use client";

import { ChevronRight, Play } from "lucide-react";
import { TeamsCard } from "./cards/TeamsCard";
import { CommunityCard } from "./cards/CommunityCard";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-12">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16 items-end">
          <div className="space-y-8 col-span-2">
            <div className="space-y-4">
              <div className="space-y-2 flex flex-col items-center justify-center md:items-start md:justify-start">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                    19 YEARS
                  </h1>
                  <div className="text-xs font-medium">
                    <div>UNITED</div>
                    <div>TEAMS</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs font-medium">
                    <div className="text-left">11</div>
                    <div className="text-left">NATIONS</div>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                    EXPERIENCE
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <h3 className="pl-2 text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                    PLAYERS/
                  </h3>
                  <div className="text-xs font-medium">
                    <div>FROM ALL AROUND</div>
                    <div>THE GLOBE</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="pl-4 text-xs font-medium">
                    <div className="text-left">VICTORY</div>
                    <div className="text-left">SEASONS</div>
                  </div>
                  <h4 className="pl-4 text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                    WORLDWIDE
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Link href="/onboarding" className="cursor-pointer bg-black text-white px-8 py-4 h-fit rounded-full font-medium flex items-center gap-2 hover:bg-black/90 transition-colors">
                Join us
                <ChevronRight />
              </Link>

              <Link href="/#journey" className="group hover:underline cursor-pointer px-8 py-4 font-medium flex items-center gap-3 hover:bg-accent transition-colors">
                <div className="group-hover:bg-gray-200 bg-gray-200/60 p-2.5 rounded-full">
                  <Play size={18} />
                </div>
                Watch Video
              </Link>
            </div>
          </div>
          <CommunityCard />
          <TeamsCard />
        </div>
      </div>
    </section>
  );
}
