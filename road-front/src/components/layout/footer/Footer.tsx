import { Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const mainLinks = [
    { label: "HOME", href: "/" },
    // { label: "BECOME A MEMBER", href: "/become-member" },
    // { label: "TEAM MEMBERS", href: "/team-members" },
    // { label: "MATCHES", href: "/matches" },
  ];

  const socialLinks = [
    { label: "Twitter", href: "#" },
    // { label: "Facebook", href: "#" },
    { label: "Instagram", href: "https://www.instagram.com/openleague.pro" },
    { label: "LinkedIn", href: "#" },
    // { label: "TikTok", href: "#" },
  ];

  const legalLinks: Array<{ label: string, href: string }> = [
    // { label: "Imprint", href: "#" },
    // { label: "Privacy policy", href: "#" },
    // { label: "Cookies", href: "#" },
  ];

  return (
    <footer className="relative w-full py-12 bg-white">
      <div className="relative w-[90%] sm:w-[85%] md:w-[80%] mx-auto overflow-hidden space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-8 mb-16">
          <nav className="flex flex-wrap items-center gap-8">
            {mainLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-wrap items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-12 mb-16">
          <div className="max-w-md">
            <span className="font-kensmark font-bold text-xl">Road To Pro</span>
            <p className="text-sm text-gray-500 leading-relaxed">
              Driven by passion, united by purpose, RoadToPro is built on
              grit, loyalty, and the dream of footballing greatness.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Contact us via:
            </h3>
            <a
              href="mailto:info@roadtopro.com"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 hover:border-gray-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@roadtopro.com
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden mb-8">
          <div className="flex items-center justify-center">
            <span className="text-center font-kensmark text-[100px] md:text-[140px] lg:text-[180px] font-black opacity-30">
              Roan To Pro
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">©2025 ROADTOPRO</p>

          <nav className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
