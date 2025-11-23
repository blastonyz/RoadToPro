"use client";

import { useState, useMemo } from "react";
import { SectionTitle } from "../../ui/SectionTitle";
import { PlayerCard } from "./PlayerCard";

type PlayerCategory = "All" | "Footballers" | "Coaches" | "Medics" | "Managers";

interface Player {
  name: string;
  position: string;
  goals: number;
  imageUrl: string;
  jerseyNumber: string;
  category: PlayerCategory;
}

export function MembersSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<PlayerCategory>("All");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const players: Player[] = [
    {
      name: "Armando Herrera",
      position: "Defender",
      goals: 23,
      imageUrl: "/assets/images/aaa.png",
      jerseyNumber: "09",
      category: "Footballers",
    },
    {
      name: "Andrés Villalva",
      position: "Forward",
      goals: 63,
      imageUrl: "/assets/images/bbb.png",
      jerseyNumber: "13",
      category: "Footballers",
    },
    {
      name: "Juan Guerrero",
      position: "Left Winger",
      goals: 12,
      imageUrl: "/assets/images/ccc.png",
      jerseyNumber: "17",
      category: "Footballers",
    },
  ];

  const filteredPlayers = useMemo(() => {
    if (selectedCategory === "All") return players;
    return players.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, players]);

  const categories: PlayerCategory[] = [
    "All",
    "Footballers",
    "Coaches",
    "Medics",
    "Managers",
  ];

  return (
    <section className="w-full pt-12">
      <div className="relative w-[92%] sm:w-[87%] md:w-[82%] mx-auto overflow-hidden space-y-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start sm:items-center">
          <div className="relative flex flex-row gap-4">
            <span className="absolute top-0 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 font-slamdunk text-gray-200 text-6xl sm:text-9xl lg:text-[12rem] leading-none pointer-events-none select-none">
              TEAM
            </span>
            <SectionTitle
              title="Introducing the team"
              className="relative pt-16 text-center sm:text-left sm:pl-8 md:pt-20 md:pl-12 lg:pl-16 z-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap justify-center xl:justify-end overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer
                  flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium transition whitespace-nowrap
                  ${selectedCategory === cat
                    ? "bg-[#060318] text-white hover:opacity-90"
                    : "bg-white text-black border border-gray-200 hover:bg-gray-100/80"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <PlayerCard key={index} {...player} />
          ))}
        </div>
      </div>
    </section>
  );
}
