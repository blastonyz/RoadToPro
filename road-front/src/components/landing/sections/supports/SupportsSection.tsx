import Image from "next/image";
import { SectionTitle } from "../../ui/SectionTitle";

export function SupportsSection() {
  const partners = [
    {
      name: "Arka CDN",
      logo: "/assets/images/arca.png",
      width: 1200,
      height: 457,
    },
    {
      name: "Cloudy Coding",
      logo: "/assets/images/cloudy.png",
      width: 1200,
      height: 457,
    },
    {
      name: "Arkiv",
      logo: "/assets/images/arkiv.png",
      width: 1200,
      height: 457,
    },
    {
      name: "Salta Dev",
      logo: "/assets/images/saltadev.webp",
      width: 1200,
      height: 457,
    },

    {
      name: "Fudio",
      logo: "/assets/images/fudio.png",
      width: 1200,
      height: 457,
    },
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full py-12">
      <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto overflow-hidden space-y-12">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <span className="text-center block sm:hidden font-slamdunk text-gray-200 text-[7rem] sm:text-9xl leading-none pointer-events-none select-none">
            01
          </span>
          <div className="flex flex-row flex-nowrap gap-5">
            <span className="hidden sm:block font-slamdunk text-gray-200 text-[7rem] sm:text-9xl leading-none pointer-events-none select-none">
              01
            </span>
            <SectionTitle
              title="The ones who support us"
              className="relative text-center sm:text-left z-10"
            ></SectionTitle>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-20" />

          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-20" />

          <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333%); }
    }
    .scrolling-partners {
      animation: scroll 30s linear infinite;
      display: flex;
      width: fit-content;
    }
    .scrolling-partners:hover {
      animation-play-state: paused;
    }
  `}</style>

          <div className="scrolling-partners">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 flex justify-center items-center px-6 md:px-12 md:min-w-[200px]"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="
            h-12 sm:h-16 md:h-20
            w-auto
            opacity-50 hover:opacity-100
            transition-all duration-200
            filter grayscale hover:grayscale-0
          "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
