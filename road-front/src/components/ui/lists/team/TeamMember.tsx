import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  size?: number;
  image?: string;
  tooltipEnabled?: boolean;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  size = 2.4,
  image,
  tooltipEnabled = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const initials = name
    .split(" ")
    .map((n) => n?.charAt(0) ?? "")
    .join("");

  const handleError = () => setHasError(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipVisible(false);
      }
    };

    if (tooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipVisible]);

  return (
    <div className="relative inline-block">
      <div
        className="rounded-full text-white flex items-center justify-center text-xs font-medium border-2 border-white group relative cursor-pointer"
        style={{ width: `${size}rem`, height: `${size}rem` }}
        title={tooltipEnabled ? name : ""}
        role="img"
        aria-label={name}
        onClick={() => setTooltipVisible(!tooltipVisible)}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {hasError || !image ? (
          <span>{initials}</span>
        ) : (
          <Image
            src={image}
            alt={name}
            width={Math.round(size * 16)}
            height={Math.round(size * 16)}
            className="aspect-square object-cover rounded-full border border-[1px] border-gray-100"
            onError={handleError}
          />
        )}
      </div>

      {tooltipEnabled && tooltipVisible && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded-md shadow-lg whitespace-nowrap"
        >
          {name}
          <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-t-black border-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default TeamMember;