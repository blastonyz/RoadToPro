import Image from "next/image";
import { useState } from "react";
import { SectionTitle } from "../../ui/SectionTitle";
import { ArrowLeft, ArrowRight, Bell } from "lucide-react";
import clsx from "clsx";

const matches = [
  {
    league: "BUNDESLEAGUE",
    status: "final",
    team1: { name: "KONO.ECF", logo: "/assets/images/Borussia.png", score: 3 },
    team2: {
      name: "TSV WAHLMBECK",
      logo: "/assets/images/Borussia.png",
      score: 2,
    },
    action: "Results",
  },
  {
    league: "BUNDESLEAGUE",
    status: "final",
    team1: { name: "KONO.ECF", logo: "/assets/images/Borussia.png", score: 1 },
    team2: {
      name: "PRO ACADEMY",
      logo: "/assets/images/Borussia.png",
      score: 0,
    },
    action: "Results",
  },
  {
    league: "BUNDESLEAGUE",
    status: "ongoing",
    isLive: true,
    team1: { name: "KONO.ECF", logo: "/assets/images/Borussia.png" },
    team2: { name: "ROCHESTER", logo: "/assets/images/Borussia.png" },
    time: "09:00 PM",
    location: "Olympiastation Berlin",
  },
  {
    league: "BUNDESLEAGUE",
    status: "upcoming",
    team1: { name: "KONO.ECF", logo: "/assets/images/Borussia.png" },
    team2: { name: "HONG LINH HA", logo: "/assets/images/Borussia.png" },
    date: "19.08.2025",
    time: "10:00 PM",
    location: "Olympiastation Berlin",
  },
];

const upcomingMatches = [
  {
    date: "28 march, 2025",
    time: "09:00 PM",
    team1: "KONO.ECF",
    team2: "DONG A THANH HOA",
  },
  {
    date: "17 April, 2025",
    time: "06:30 PM",
    team1: "KONO.ECF",
    team2: "CONG AN HA NOI",
  },
  {
    date: "05 May, 2025",
    time: "11:00 AM",
    team1: "KONO.ECF",
    team2: "ARSENAL",
  },
  {
    date: "22 May, 2025",
    time: "03:00 PM",
    team1: "KONO.ECF",
    team2: "GREATER CHICAGO",
  },
  {
    date: "03 June, 2025",
    time: "08:00 PM",
    team1: "KONO.ECF",
    team2: "SHERIF FOOTBALL CLUB",
  },
];

const scoreboard = [
  { pos: 1, team: "KONO.ECF", gp: 5, pkt: 13, diff: 8 },
  { pos: 2, team: "FC Barcelona", gp: 6, pkt: 11, diff: 5 },
  { pos: 3, team: "Bayern Munich", gp: 5, pkt: 10, diff: 6 },
  { pos: 4, team: "Paris Saint-Germain", gp: 4, pkt: 8, diff: 4 },
  { pos: 5, team: "Arsenal FC", gp: 5, pkt: 9, diff: 3 },
  { pos: 6, team: "Juventus", gp: 6, pkt: 6, diff: 2 },
  { pos: 7, team: "Inter Milan", gp: 7, pkt: 7, diff: 2 },
  { pos: 8, team: "Ajax Amsterdam", gp: 8, pkt: 9, diff: 1 },
  { pos: 9, team: "Borussia Dortmund", gp: 9, pkt: 9, diff: 0 },
  { pos: 10, team: "Atletico Madrid", gp: 10, pkt: 10, diff: -1 },
  { pos: 11, team: "AC Milan", gp: 11, pkt: 11, diff: -2 },
  { pos: 12, team: "Manchester United", gp: 12, pkt: 12, diff: -3 },
  { pos: 13, team: "VfL Wolfsburg", gp: 13, pkt: 13, diff: -4 },
  { pos: 14, team: "Real Madrid", gp: 14, pkt: 14, diff: -6 },
];

export function MatchesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(matches.length - 1, prev + 1));
  };

  return (
    <section className="w-full py-12">
      <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto overflow-hidden space-y-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start sm:items-center">
          <div className="relative flex flex-row gap-4">
            <span className="absolute top-0 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 font-slamdunk text-gray-200 text-6xl sm:text-9xl lg:text-[12rem] leading-none pointer-events-none select-none">
              ROASTERS
            </span>
            <SectionTitle
              title="Upcoming and latest matches"
              className="relative pt-16 text-center sm:text-left sm:pl-8 md:pt-20 md:pl-12 lg:pl-16 z-10"
            ></SectionTitle>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex justify-between">
            <h2 className="text-xl">Featured Matches</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="cursor-pointer w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === matches.length - 1}
                className="cursor-pointer w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
            {matches.map((match, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="text-xs font-medium uppercase border border-gray-200 rounded-full px-3 py-2 flex flex-row flex-nowrap gap-2 items-center justify-center">
                      <svg
                        className="w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M16 8C16 10.3005 15.029 12.3742 13.4744 13.8336L12.0147 11.8244L13.4959 7.26574L15.8592 6.49785C15.9516 6.98439 16 7.48655 16 8Z"
                            fill="#000000"
                          ></path>{" "}
                          <path
                            d="M10.3966 13L11.8573 15.0104C10.7134 15.6411 9.39861 16 8 16C6.60139 16 5.28661 15.6411 4.14273 15.0104L5.60335 13H10.3966Z"
                            fill="#000000"
                          ></path>{" "}
                          <path
                            d="M0 8C0 10.3005 0.971022 12.3742 2.52556 13.8336L3.98532 11.8244L2.50412 7.26575L0.140801 6.49786C0.0483698 6.9844 0 7.48655 0 8Z"
                            fill="#000000"
                          ></path>{" "}
                          <path
                            d="M3.12212 5.36363L0.758423 4.59561C1.90208 2.16713 4.23136 0.40714 6.99999 0.0618925V2.54619L3.12212 5.36363Z"
                            fill="#000000"
                          ></path>{" "}
                          <path
                            d="M8.99999 2.54619V0.0618896C11.7686 0.40713 14.0979 2.16712 15.2416 4.5956L12.8779 5.36362L8.99999 2.54619Z"
                            fill="#000000"
                          ></path>{" "}
                          <path
                            d="M4.47328 6.85409L7.99999 4.29179L11.5267 6.85409L10.1796 11H5.82037L4.47328 6.85409Z"
                            fill="#000000"
                          ></path>{" "}
                        </g>
                      </svg>
                      <span>{match.league}</span>
                    </div>
                  </div>
                  {match.action && (
                    <button className="flex flex-row flex-nowrap gap-2 text-xs w-fit bg-black text-white py-2 px-3 rounded-full hover:bg-gray-800 transition-colors">
                      {match.action} <ArrowRight size={16} />
                    </button>
                  )}
                  {match.isLive && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100/80 px-3 py-2 rounded-full">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      Live
                    </span>
                  )}
                  {!match.isLive && match.status === "upcoming" && (
                    <Bell className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={match.team1.logo}
                      alt={match.team1.name}
                      width={40}
                      height={40}
                    />
                    <span className="text-xs font-medium text-center">
                      {match.team1.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">VS</span>
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src={match.team2.logo}
                      alt={match.team2.name}
                      width={40}
                      height={40}
                    />
                    <span className="text-xs font-medium text-center">
                      {match.team2.name}
                    </span>
                  </div>
                </div>

                {match.status === "final" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4">
                      <div className="bg-gray-100 p-6 rounded-xl text-center">
                        <span className="text-4xl font-bold">
                          {match.team1.score}
                        </span>
                      </div>
                      <div className="bg-gray-100 p-6 rounded-xl text-center">
                        <span className="text-4xl font-bold">
                          {match.team2.score}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {match.status === "ongoing" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm gap-2 bg-green-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <span className="text-green-600 font-medium">
                          Ongoing
                        </span>
                      </div>
                      <div className="text-sm gap-2 bg-gray-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span>{match.time}</span>
                      </div>
                    </div>
                    <div className="text-sm gap-2 bg-gray-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{match.location}</span>
                    </div>
                  </div>
                )}

                {match.status === "upcoming" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm gap-2 bg-gray-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{match.date}</span>
                      </div>
                      <div className="text-sm gap-2 bg-gray-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span>{match.time}</span>
                      </div>
                    </div>
                    <div className="text-sm gap-2 bg-gray-100 p-2 rounded-xl text-center flex flex-row flex-nowrap items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{match.location}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex gap-8">
                  {["Date", "Time", "Match", "Notif"].map((tab, idx) => (
                    <button
                      key={idx}
                      className={clsx(
                        "pb-3 text-sm font-medium",
                        idx === 0
                          ? "border-b-2 border-black"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="space-y-4">
                {upcomingMatches.map((match, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl gap-2 md:gap-0",
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    )}
                  >
                    <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-4">
                      <span className="w-32 text-sm text-gray-900">
                        {match.date}
                      </span>
                      <span className="w-24 text-sm text-gray-600">
                        {match.time}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                      <span className="font-medium">{match.team1}</span>
                      <span className="text-gray-400">VS</span>
                      <span className="font-medium">{match.team2}</span>
                    </div>

                    <button
                      className={clsx(
                        "w-8 h-8 flex items-center justify-center rounded-lg transition-colors mt-2 sm:mt-0",
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      )}
                    >
                      <Bell className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 2xl:col-span-1">
              <h3 className="text-lg font-bold mb-4">
                Bundesleague Scoreboard
              </h3>
              <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                  <thead className="text-xs font-base text-gray-500">
                    <tr>
                      {["Notif.", "Teams", "SPL", "PKT", "Diff"].map(
                        (th, idx) => (
                          <th
                            key={idx}
                            className={clsx(
                              idx === 1
                                ? "text-left"
                                : idx > 1
                                ? "text-center"
                                : "text-left",
                              "py-2 px-2"
                            )}
                          >
                            {th}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scoreboard.map((team, idx) => (
                      <tr
                        key={idx}
                        className={clsx(
                          team.pos === 1 ? "font-bold bg-white rounded-xl" : ""
                        )}
                      >
                        <td className="py-2 px-2 text-gray-600">{team.pos}.</td>
                        <td className="py-2 px-2 truncate">{team.team}</td>
                        <td className="py-2 px-2 text-center">{team.gp}</td>
                        <td className="py-2 px-2 text-center font-medium">
                          {team.pkt}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {team.diff > 0 ? "+" : ""}
                          {team.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
