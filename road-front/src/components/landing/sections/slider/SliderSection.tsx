"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function SliderSection() {
  const slides: Slide[] = [
    { src: "/assets/images/placeholder1.png", alt: "Slide 1" },
    { src: "/assets/images/placeholder1.png", alt: "Slide 2" },
    { src: "/assets/images/placeholder1.png", alt: "Slide 3" },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const targetDateRef = useRef<Date>(new Date("2025-11-20T00:00:00Z"));

  const handlePrev = useCallback((): void => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNext = useCallback((): void => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback((): CountdownTime => {
    const now = Date.now();
    const target = targetDateRef.current.getTime();
    const distance = target - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  const pad = (num: number): string => String(num).padStart(2, "0");

  return (
    <section className="w-full py-12">
      <div className="w-full">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
            <div className="hidden sm:block flex flex-row flex-nowrap gap-2">
              <button
                onClick={handlePrev}
                className="cursor-pointer transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="cursor-pointer transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <span className="text-base sm:text-sm">Team Info</span>
            <span className="text-base sm:text-sm">Stadium</span>

            <div className="flex flex-row items-center justify-center gap-2">
              <span className="font-mono font-semibold text-gray-800 text-base">
                {pad(timeLeft.days)}:{pad(timeLeft.hours)}:
                {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </span>
              <span className="text-base sm:text-sm">Till next match</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl aspect-video sm:aspect-[16/6] w-[95%] sm:w-[90%] md:w-[85%] mx-auto">
            <div
              key={currentIndex}
              className={`
                absolute inset-0 
                transition-transform duration-500 ease-out
                ${direction === "right" ? "translate-x-0" : "translate-x-0"}
              `}
            >
              <Image
                src={slides[currentIndex].src}
                alt={slides[currentIndex].alt}
                fill
                className={`
                  object-cover rounded-3xl
                  transition-transform duration-500
                  ${
                    direction === "right"
                      ? "animate-slideInRight"
                      : "animate-slideInLeft"
                  }
                `}
              />
            </div>
          </div>

          <div className="block sm:hidden flex items-center justify-center flex-row flex-nowrap gap-2">
            <button
              onClick={handlePrev}
              className="transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNext}
              className="transition-transform hover:scale-110 active:scale-95 hover:text-gray-800"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease forwards;
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease forwards;
        }
      `}</style>
    </section>
  );
}
