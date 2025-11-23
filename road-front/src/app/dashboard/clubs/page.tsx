"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Plus } from "lucide-react";

export default function ClubsPage() {
  const capabilities = [
    "Crear su escuela digital dentro de OL",
    "Becar jugadores locales",
    "Donar a talentos de otros clubes",
    "Reclutar desde el ranking OL",
    "Recibir informes de jugadores con IA",
  ];

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Clubes y Escuelas Digitales
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-black mb-4">
                El ecosistema abierto
              </h3>
              <p className="text-gray-700 mb-4">
                Los clubes no son “sedes”, sino participantes activos del
                ecosistema. Pueden operar de forma digital y colaborar con el
                desarrollo de talento en Open League.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <svg
                      className="w-5 h-5 text-black flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-blue-900 mb-2">
                Escuelas digitales
              </h4>
              <p className="text-blue-800 text-sm">
                Estructuras de formación, seguimiento y reclutamiento
                totalmente online, conectadas con el ranking OL y la evaluación
                con IA.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

