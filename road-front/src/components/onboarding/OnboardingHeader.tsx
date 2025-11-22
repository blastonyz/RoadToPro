import Link from "next/link";

interface OnboardingHeaderProps {
    returnTo: string;
}

export function OnboardingHeader({ returnTo }: OnboardingHeaderProps) {
  return (
    <nav className="w-full py-6 border-b border-gray-200">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto flex justify-between items-center">
        <h1 className="font-kensmark font-bold text-xl">Open League</h1>
        <Link
          href={returnTo ?? "/"}
          className="text-sm text-gray-600 hover:text-black transition-colors"
        >
          ← Volver
        </Link>
      </div>
    </nav>
  );
}
