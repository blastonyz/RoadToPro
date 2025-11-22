"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  User2,
  Building2,
  ClipboardCheck,
  Heart,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roles: Role[] = [
  {
    id: "player",
    title: "Jugador",
    description: "Construye tu perfil, muestra tu talento y conecta con clubes",
    icon: <User2 className="w-12 h-12" />,
  },
  {
    id: "club",
    title: "Club",
    description: "Descubre talento, gestiona fichajes y construye tu equipo",
    icon: <Building2 className="w-12 h-12" />,
  },
  {
    id: "coach",
    title: "Coach / DT",
    description:
      "Encuentra jugadores, analiza rendimiento y construye estrategias",
    icon: <ClipboardCheck className="w-12 h-12" />,
  },
  {
    id: "fan",
    title: "Fan / Seguidor",
    description:
      "Sigue a tus jugadores favoritos y mantente al día con sus logros",
    icon: <Heart className="w-12 h-12" />,
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRole === "player") {
      router.push("/onboarding/player-profile");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/onboarding/register" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl w-full space-y-10">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-1 bg-black rounded-full" />
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black uppercase tracking-tight">
              Elige tu rol
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Selecciona cómo deseas participar en la plataforma. Podrás cambiar
              esto más adelante.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 pt-6 max-w-3xl mx-auto w-full">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`cursor-pointer group text-left p-6 sm:p-8 rounded-2xl border-2 transition-all 
                    hover:scale-[1.01] relative overflow-hidden transition duration-200 bg-white
                    ${
                      isSelected
                        ? "border-black !bg-black text-white"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <div className="space-y-4">
                    <div className={isSelected ? "text-white" : "text-black"}>
                      {role.icon}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        {role.title}
                      </h3>
                      <p
                        className={`text-sm sm:text-base transition-colors ${
                          isSelected ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {role.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-2 text-sm font-semibold mt-4 text-white">
                        <CheckCircle className="w-5 h-5" />
                        Seleccionado
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="cursor-pointer bg-black text-white px-12 py-4 rounded-full font-bold 
              flex items-center gap-2 hover:bg-gray-800 transition-colors
              disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed
              group"
            >
              Continuar
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
