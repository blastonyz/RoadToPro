import clsx from "clsx";
import Image from "next/image";

interface FounderCardProps {
  role: string;
  name: string;
  description: string;
  image: string;
  direction?: "down" | "up";
}

export function FounderCard({
  role,
  name,
  description,
  image,
  direction = "down",
}: FounderCardProps) {
  const isDownDirection = direction === "down";

  const [firstName = "", secondName = ""] = name.split(" ").slice(0, 2);

  return (
    <div
      className={clsx(
        "rounded-xl flex flex-col gap-5 p-4 sm:p-6 md:p-8 transition-all",
        {
          "bg-white": isDownDirection,
          "bg-gray-200": !isDownDirection,
        }
      )}
    >
      {!isDownDirection && (
        <Image
          className="object-cover rounded-xl w-full aspect-[4/3] sm:aspect-[5/4]"
          src={image}
          alt="Founder"
          width={512}
          height={512}
        />
      )}

      <span className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white text-black border border-gray-200 hover:bg-gray-100/80 transition">
        {role}
      </span>

      <div
        className={clsx("leading-tight px-1 sm:px-2", {
          "pb-2": !isDownDirection,
        })}
      >
        <h4 className="uppercase text-2xl sm:text-3xl md:text-4xl text-black leading-none">
          <span className="block">{firstName}</span>
          <span className="block font-bold">{secondName}</span>
        </h4>

        <p className="text-gray-500 mt-3 text-sm sm:text-base">{description}</p>
      </div>

      {isDownDirection && (
        <Image
          src={image}
          alt="Founder"
          width={512}
          height={512}
          className="object-cover rounded-xl w-full aspect-[4/3] sm:aspect-[5/4]"
        />
      )}
    </div>
  );
}
