"use client";

import { ArrowRight } from "lucide-react";
import { SectionTitle } from "../../ui/SectionTitle";
import { Separator } from "../../ui/Separator";
import { FounderCard } from "./FounderCard";

export function FoundersSection() {
  return (
    <section className="relative w-full pb-12 bg-gray-100">
      <Separator index={7} title="Founders" theme="extralight" />

      <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto overflow-hidden space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          <div className="order-2 md:order-1">
            <span className="text-neutral-700 text-sm sm:text-base">
              The Pioneers of Our Legacy
            </span>
          </div>

          <div className="order-1 md:order-2 flex flex-col text-left">
            <SectionTitle
              title="Our visionary"
              position="left"
              className="leading-none"
            />
            <SectionTitle
              title="- founders"
              position="left"
              className="opacity-30 leading-none"
            />
          </div>

          <div className="order-3">
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#060318] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              Learn more <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FounderCard
            role="Founder - CEO"
            name="Jason Harrison"
            description="A lifelong football strategist with a passion for grassroots development."
            image="/assets/images/pfp1.jpeg"
          />
          <FounderCard
            role="Founder - CEO"
            name="Jason Harrison"
            description="A lifelong football strategist with a passion for grassroots development."
            image="/assets/images/pfp2.png"
            direction="up"
          />
          <FounderCard
            role="Founder - CEO"
            name="Jason Harrison"
            description="A lifelong football strategist with a passion for grassroots development."
            image="/assets/images/pfp3.png"
          />
        </div>
      </div>
    </section>
  );
}
