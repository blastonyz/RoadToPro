import { useEffect, useRef, useState } from "react";

interface MilestoneArcProps {
    index: number;
  }
  
  export function MilestoneArc({ index }: MilestoneArcProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
  
    useEffect(() => {
      if (!ref.current) return;
      const resize = () => setWidth(ref.current!.offsetWidth);
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);
  
    const diameter = width;
    const radius = diameter / 2;
    const startX = 0;
    const endX = diameter;
  
    return (
      <div ref={ref} className="w-full pointer-events-none">
        {width > 0 && (
          <svg width={endX} height={radius} className="overflow-visible -translate-y-2">
            <defs>
              <radialGradient id={`fade-arc-${index}`} cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
  
            <path
              d={`M ${startX} ${radius} A ${radius} ${radius} 0 0 1 ${endX} ${radius}`}
              fill={`url(#fade-arc-${index})`}
              className="opacity-20 group-hover:opacity-100 transition-opacity duration-300"
            />
  
            <path
              d={`M ${startX} ${radius} A ${radius} ${radius} 0 0 1 ${endX} ${radius}`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="opacity-20 group-hover:opacity-100 transition-opacity duration-300"
            />
  
            {index === 0 && (
              <circle
              className="opacity-20 group-hover:opacity-100 transition-opacity duration-300 translate-y-2"
                cx={startX}
                cy={radius}
                r={5}
                stroke="white"
                strokeWidth="2"
                fill="black"
              />
            )}
  
            <circle
              cx={endX}
              cy={radius}
              r={5}
              stroke="white"
              strokeWidth="2"
              fill="black"
              className="opacity-20 group-hover:opacity-100 transition-opacity duration-300 translate-y-2"
            />
          </svg>
        )}
      </div>
    );
  }
  