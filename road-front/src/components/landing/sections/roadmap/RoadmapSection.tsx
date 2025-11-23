"use client";

import { SectionTitle } from "../../ui/SectionTitle";
import { Separator } from "../../ui/Separator";
import { MilestoneArc } from "./MilestoneArc";

export function RoadmapSection() {
  const milestones = [
    {
      title: "Sub 0 Hackathon",
      description:
        "The year our story began. We established the club's foundation, defined our philosophy, recruited passionate talent, and played our first local friendlies.",
    },
    {
      title: "EthGlobal Hackathon",
      description:
        "Entered our first official league. Focused on building team chemistry, tactical discipline, and gaining vital match experience.",
    },
    {
      title: "Milestone 2",
      description:
        "Launched our youth academy to nurture local talent. Strengthened the coaching staff and secured key signings.",
    },
    {
      title: "Incubation",
      description:
        "Our most ambitious year yet. Competing for promotion, expanding our fanbase, and setting our sights on becoming a household name.",
    },
  ];

  return (
    <section className="relative w-full pt-12 pb-24 bg-[#0b0d0f]">
      <Separator index={5} title="Roadmap" theme="dark"></Separator>
      <div className="relative w-[91%] sm:w-[86%] md:w-[81%] mx-auto overflow-hidden space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 px-[1%] gap-10 md:gap-0">
          <div className="flex md:justify-end max-w-full md:max-w-[75%]">
            <span className="text-neutral-500 text-sm sm:text-base leading-relaxed">
              Every great team starts with a dream. Our journey is fueled by
              passion, hard work, and the drive to rise one season at a time.
            </span>
          </div>

          <div className="relative flex flex-row flex-nowrap">
            <span className="absolute top-0 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 font-slamdunk text-[#232526] text-6xl sm:text-9xl lg:text-[12rem] leading-none pointer-events-none select-none">
              ROADMAP
            </span>

            <SectionTitle
              title="OUR ROADMAP[jump]TO GLORY"
              className="relative pt-16 text-center sm:text-left sm:pl-8 md:pt-20 md:pl-12 lg:pl-16 text-white z-10"
            />
          </div>
        </div>

        <div className="space-y-6 relative z-10 flex flex-col items-center justify-center px-[1%]">
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-0">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex flex-col gap-8 group">
                  <MilestoneArc index={index} />
                  <div className="pr-5 transform transition-all duration-300 group-hover:scale-105 group-hover:translate-y-[-4px]">
                    <h3 className="text-4xl font-black mb-2 font-kensmark text-white transition-colors duration-300 group-hover:text-[#FFD700]">
                      {milestone.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed transition-colors duration-300 group-hover:text-white">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
