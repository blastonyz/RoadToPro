"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ScorePage() {
  const overallScore = 78;
  const maintainedDays = 24;
  const isInvertible = overallScore >= 70 && maintainedDays >= 30;

  const pillars = [
    { name: "Habilidad técnica", value: 82, color: "bg-blue-500" },
    { name: "Condición física", value: 75, color: "bg-green-500" },
    { name: "Compromiso", value: 80, color: "bg-yellow-500" },
    { name: "Transparencia", value: 90, color: "bg-purple-500" },
    { name: "Reputación", value: 68, color: "bg-orange-500" },
  ];

  const howToImprove = [
    "Retos diarios aprobados",
    "Entrenamientos completados",
    "Constancia semana a semana",
    "Validaciones de la comunidad + staff",
    "Cargas de recibos correctas",
    "No tener sanciones ni reportes",
  ];

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        link={{
          label: "Subir Video",
          href: "/dashboard/challenges/upload",
          icon: <Plus />,
        }}
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Puntaje Global OL
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-8 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                    Promedio OL (0-100)
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-bold">
                      {overallScore}
                    </span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Basado en evidencias verificadas
                  </p>
                </div>
                <div
                  className={`px-6 py-3 rounded-full font-bold ${
                    isInvertible ? "bg-green-500 text-black" : "bg-white/10"
                  }`}
                >
                  {isInvertible ? "INVERTIBLE" : "En progreso"}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-300">
                <p>
                  Regla: mantener ≥ 70 puntos durante 30 días. Días actuales:{" "}
                  <strong>{maintainedDays}</strong>/30.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.name}
                  className="bg-white border border-gray-200 p-5 rounded-xl"
                >
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">
                    {pillar.name}
                  </p>
                  <p className="text-3xl font-bold text-black mb-3">
                    {pillar.value}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${pillar.color} h-2 rounded-full transition-all`}
                      style={{ width: `${pillar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-4">
                ¿Cómo se sube?
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {howToImprove.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0"
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
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
              <h4 className="text-lg font-bold text-blue-900 mb-2">
                ¿Quieres activar tu Plan PRO?
              </h4>
              <p className="text-blue-800 text-sm mb-4">
                Mantén tu puntaje ≥ 70 por 30 días para desbloquear el plan
                personalizado con IA.
              </p>
              <Link
                href="/dashboard/pro/plan"
                className="inline-flex items-center justify-center w-full bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
              >
                Ver Plan PRO
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

