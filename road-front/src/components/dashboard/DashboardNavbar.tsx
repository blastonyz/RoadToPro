import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface DashboardNavbarProps {
  link?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  returnData: {
    label: string;
    href: string;
  };
}

export function DashboardNavbar({ link, returnData }: DashboardNavbarProps) {
  const pathname = usePathname();
  const navLinks = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Retos", href: "/dashboard/challenges" },
    { label: "Formación", href: "/dashboard/training" },
    { label: "Puntaje", href: "/dashboard/score" },
    { label: "Plan PRO", href: "/dashboard/pro/plan" },
    { label: "Campaña", href: "/dashboard/campaign" },
    { label: "Wallet", href: "/dashboard/wallet" },
    { label: "Subir", href: "/dashboard/challenges/upload" },
  ];

  return (
    <nav className="w-full py-6 border-b border-gray-200">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href={returnData.href ?? "/"}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              aria-label={returnData.label}
            >
              <ArrowLeft className="w-4 h-4" />
              {returnData.label}
            </Link>
            <h1 className="font-kensmark font-bold text-xl">Open League</h1>
          </div>

          <div className="relative -mx-2">
            <ul
              className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2"
              role="tablist"
              aria-label="Navegación del panel"
            >
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="flex-shrink-0">
                    <Link
                      href={item.href}
                      className={clsx(
                        "inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black",
                        isActive
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {link && (
            <Link
              href={link.href}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#060318] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {link.icon && <span className="ml-1">{link.icon}</span>}
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
