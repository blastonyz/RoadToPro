import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface PlayerCardProps {
  name: string;
  position: string;
  goals: number;
  imageUrl: string;
  jerseyNumber: string;
}

export function PlayerCard({
  name,
  position,
  goals,
  imageUrl,
  jerseyNumber,
}: PlayerCardProps) {
  const nameParts = name.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts[nameParts.length - 1];

  return (
    <div className="bg-white p-6 sm:p-8 relative overflow-hidden min-h-[500px] flex flex-col hover:shadow-xl rounded-lg transition-shadow duration-300 group">
      <div className="mb-6 sm:mb-8 z-10">
        <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">
          {firstName} <span className="font-bold text-black">{lastName}</span>
        </h2>

        <div className="flex flex-wrap gap-6 mb-4 sm:mb-6">
          <div>
            <div className="text-sm font-medium text-black mb-1">Position</div>
            <div className="text-gray-400 text-sm">{position}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-black mb-1">Goals</div>
            <div className="text-gray-400 text-sm">{goals}</div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-100/80 border border-gray-200 transition-colors duration-150">
          Full bio <ArrowRight size={20} />
        </button>
      </div>

      <div className="relative mt-auto overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-start pointer-events-none z-0">
          <div className="text-[150px] sm:text-[200px] font-black text-gray-100 select-none group-hover:text-gray-200 transition duration-200 font-slamdunk">
            {jerseyNumber}
          </div>
        </div>

        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={600}
          height={600}
          className="w-full h-[400px] sm:h-[500px] object-cover object-top group-hover:scale-105 group-hover:drop-shadow-md transition duration-200 rounded-lg relative z-10 translate-x-20"
        />
      </div>
    </div>
  );
}
