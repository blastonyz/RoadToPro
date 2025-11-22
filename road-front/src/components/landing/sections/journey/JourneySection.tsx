"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { SectionTitle } from "../../ui/SectionTitle";
import { Separator } from "../../ui/Separator";
import { useRef, useState } from "react";

export function JourneySection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative w-full pb-12 bg-[#0b0d0f]">
      <div className="absolute bottom-0 left-0 w-full h-[12%] sm:h-[25%] bg-white" />
      <Separator index={4} title="Journey" theme="dark" />

      <div className="relative w-[92%] sm:w-[87%] md:w-[82%] mx-auto overflow-hidden space-y-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center">
          <div className="w-full md:w-1/5 flex justify-end">
            <span className="text-neutral-500 text-sm sm:text-base leading-relaxed">
              Transfers and latest news from OpenLeague
            </span>
          </div>

          <div className="relative flex-1 flex flex-row gap-5">
            <span className="absolute top-0 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 font-slamdunk text-[#232526] text-[7rem] sm:text-9xl lg:text-[12rem] leading-none pointer-events-none select-none">
              VIDEOS
            </span>

            <SectionTitle
              title="Know more about what's happening"
              className="relative pt-16 text-center sm:text-left sm:pl-8 md:pt-20 md:pl-12 lg:pl-16 text-white z-10"
            />
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              Watch Now <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-6 items-center justify-center w-full">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-lg font-medium text-gray-300">Latest Videos</h3>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-[#232526] text-white rounded-full hover:bg-zinc-700 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#232526] text-white rounded-full hover:bg-zinc-700 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-[90%] md:w-[80%] aspect-video bg-zinc-900 rounded-3xl overflow-hidden group cursor-pointer border-4 border-[#232526]">
            <video
              ref={videoRef}
              src="/assets/videos/soccer.mp4"
              className="w-full h-full object-cover rounded-3xl"
              controls={isPlaying}
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                <button
                  onClick={handlePlay}
                  className="cursor-pointer w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center bg-white/70 hover:bg-white rounded-full transition-transform transform group-hover:scale-110 transition duration-200"
                >
                  <Play size={24} className="text-black ml-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
