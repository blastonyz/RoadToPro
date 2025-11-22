"use client";

import { FoundersSection } from "@/components/landing/sections/founders/FoundersSection";
import { HeroSection } from "@/components/landing/sections/hero/HeroSection";
import { JourneySection } from "@/components/landing/sections/journey/JourneySection";
import { MatchesSection } from "@/components/landing/sections/matches/MatchesSection";
import { MembersSection } from "@/components/landing/sections/members/MembersSection";
import { RoadmapSection } from "@/components/landing/sections/roadmap/RoadmapSection";
import { SliderSection } from "@/components/landing/sections/slider/SliderSection";
import { SocialsSection } from "@/components/landing/sections/socials/SocialsSection";
import { SupportsSection } from "@/components/landing/sections/supports/SupportsSection";
import { Separator } from "@/components/landing/ui/Separator";
import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection></HeroSection>
      <SliderSection></SliderSection>
      <Separator index={1} title="Sponsors"></Separator>
      <SupportsSection></SupportsSection>
      <Separator index={2} title="Matches"></Separator>
      <MatchesSection></MatchesSection>
      <Separator index={3} title="Members"></Separator>
      <MembersSection></MembersSection>
      <JourneySection></JourneySection>
      <Separator index={5} title="Socials"></Separator>
      <SocialsSection></SocialsSection>
      <RoadmapSection></RoadmapSection>
      <FoundersSection></FoundersSection>
      <Footer></Footer>
    </>
  );
}
