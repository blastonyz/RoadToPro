"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Plus } from "lucide-react";

export default function MissionPage() {
  const playerTypes = [
    {
      title: "Jugador Base",
      description:
        "Suben retos, mejoran, pueden recibir pequeñas donaciones.",
    },
    {
      title: "Jugador PRO (beca)",
      description:
        "Entrenamiento avanzado, validación, análisis, reputación.",
    },
    {
      title: "Jugador Invertible (≥70 de rating)",
      description: "Con plan IA y campaña activa.",
    },
    {
      title: "Jugador con contrato OL",
      description:
        "Recaudó, ejecuta plan, avanza, puede ser fichado.",
    },
  ];

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Misión Open League
        </h2>

        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl mb-8">
          <p className="text-xl font-semibold">
            “No importa dónde naciste ni qué recursos tengas. Vas a tener acceso
            al mismo nivel de entrenamiento, visibilidad y oportunidades que un
            jugador de élite.”
          </p>
        </div>

        <h3 className="text-2xl font-bold text-black mb-4">
          Tipos de jugadores en la plataforma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playerTypes.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <h4 className="text-lg font-bold text-black mb-2">{p.title}</h4>
              <p className="text-gray-700">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

