"use client";

import TeamMemberList from "@/components/ui/lists/team/TeamMemberList";

export function CommunityCard() {
  return (
    <div className="col-span-2 sm:col-span-1 relative w-full max-w-md h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        id="visual"
        viewBox="0 0 200 400"
        width="200"
        height="400"
        version="1.1"
      >
        <text
          className="font-kensmark"
          textAnchor="start"
          fontSize="80"
          fill="rgba(156, 163, 175, 0.2)"
          fontWeight="bold"
        >
          <tspan x="0%" dy="25%">
            Road
          </tspan>
          <tspan x="-20%" dy="25%">
            To Pro
          </tspan>
        </text>
      </svg>

      <div className="relative z-10 flex flex-col justify-end h-full gap-3">
        <span className="w-fit text-sm px-3 py-1.5 rounded-full bg-gray-200">
          Community
        </span>
        <div className="flex items-start justify-center flex-col gap-1">
          <div className="flex flex-row items-center justify-center gap-3">
            <span className="font-semibold text-2xl">600+</span>
            <TeamMemberList
              team={[
                {
                  name: "Emanuel Guzmán",
                  role: "Back-end Developer",
                  image: "/assets/images/pfp1.jpeg",
                },
                {
                  name: "Arturo Grande",
                  role: "Product Manager / Designer",
                  image: "/assets/images/pfp2.png",
                },
                {
                  name: "Lautaro Spiazzi",
                  role: "Front-end Developer",
                  image: "/assets/images/pfp3.png",
                },
              ]}
            ></TeamMemberList>
          </div>
          <span className="w-fit text-sm text-gray-500">
            Join our global community
          </span>
        </div>
      </div>
    </div>
  );
}
