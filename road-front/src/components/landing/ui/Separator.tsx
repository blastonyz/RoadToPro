import clsx from "clsx";

interface SeparatorProps {
  index: number;
  title: string;
  theme?: "dark" | "light" | "extralight"
}

export function Separator({ index, title, theme = "light" }: SeparatorProps) {
  const isDark = theme === "dark";
  const isLight = theme === "light";
  const isExtraLight = theme === "extralight";

  return (
    <section className="w-full py-12">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="w-full flex items-center justify-center gap-5">
          <div
            className={clsx(
              "flex flex-row gap-4 font-semibold px-5 py-4 border rounded-full transition-colors",
              {
                "border-gray-300/80 text-black bg-white": isLight,
                "border-none text-white bg-[#232526] font-normal": isDark,
                "border-gray-200/80 text-black bg-white": isExtraLight,
              }
            )}
          >
            <span>#{index}</span>
            <span>{title}</span>
          </div>

          <div className="flex items-center justify-center gap-0 w-full">
            <div
              className={clsx("w-1 h-1 rounded-full", {
                "bg-black": !isDark,
                "bg-white": isDark,
              })}
            ></div>

            <div className="flex-1">
              <hr
                className={clsx("transition-colors", {
                  "border-gray-300": !isDark,
                  "border-[#232526]": isDark,
                })}
              />
            </div>

            <div
              className={clsx("w-1 h-1 rounded-full", {
                "bg-black": !isDark,
                "bg-white": isDark,
              })}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
