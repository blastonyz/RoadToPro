"use client";

import clsx from "clsx";

type AvailablePositions = "left" | "center" | "right";

interface SectionTitleProps {
  title: string;
  position?: AvailablePositions;
  className?: string;
}

export function SectionTitle({ title, position, className }: SectionTitleProps) {
  const parts = title.split("[jump]");

  return (
    <h2
      className={clsx(
        "text-4xl sm:text-6xl uppercase font-extrabold font-bmdohyeon z-100 flex flex-wrap gap-2",
        {
          "justify-start text-left": position === "left",
          "justify-center text-center": position === "center",
          "justify-end text-right": position === "right",
        },
        className
      )}
    >
      <style>{`
        @keyframes jump {
          0%   { transform: translateY(0); }
          35%  { transform: translateY(-14px); }
          70%  { transform: translateY(3px); }
          100% { transform: translateY(0); }
        }

        .jump-animate {
          display: inline-block;
          animation: jump 0.55s ease-out 1;
        }

        .jump-trigger:hover .jump-animate {
          animation: jump 0.55s ease-out 1;
        }
      `}</style>

      <span className="w-full sm:w-fit">{parts[0]}</span>

      {parts[1] && (
        <span className="jump-trigger w-full sm:w-fit">
          <span className="jump-animate inline-block">{parts[1]}</span>
        </span>
      )}
    </h2>
  );
}
