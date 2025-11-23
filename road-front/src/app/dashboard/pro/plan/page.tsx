"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProPlanPage() {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [maintainedDays, setMaintainedDays] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [score, level] = await Promise.all([
          api.players.getScore(),
          api.players.getLevel(),
        ]);
        if (!mounted) return;
        setOverallScore(Math.round(score.overall ?? 0));
        const sustainedSince = level.sustainedSince ? new Date(level.sustainedSince) : null;
        const today = new Date();
        const days =
          sustainedSince && !isNaN(sustainedSince.getTime())
            ? Math.max(0, Math.floor((today.getTime() - sustainedSince.getTime()) / (1000 * 60 * 60 * 24)))
            : 0;
        setMaintainedDays(days);
        setUnlocked(level.sustainedEligibility === true && (score.overall ?? 0) >= 70 && days >= 30);
      } catch {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const evaluationItems = [
    "Análisis de tus videos",
    "Métricas de retos",
    "Físico, posición y estilo de juego",
  ];

  const planItems = [
    "Entrenamiento semanal",
    "Nutrición",
    "Suplementación",
    "Fisioterapia",
    "Psicología deportiva",
    "Objetivos mensuales",
  ];

  const budgetItems = [
    { label: "Nutrición", value: 200 },
    { label: "Entrenador personal", value: 350 },
    { label: "Viajes a pruebas", value: 300 },
    { label: "Equipamiento", value: 150 },
    { label: "Fisioterapia", value: 200 },
  ];
  const total = budgetItems.reduce((acc, i) => acc + i.value, 0);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Plan PRO personalizado
        </h2>

        {!unlocked && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-bold text-yellow-900">
              Aún no desbloqueado
            </h3>
            <p className="text-yellow-800 text-sm mt-1">
              Necesitas mantener un puntaje ≥ 70 por 30 días. Actualmente:{" "}
              <strong>{maintainedDays}</strong>/30 días con puntaje {">="} 70.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-2xl font-bold text-black mb-4">
              Evaluación con IA
            </h3>
            <ul className="space-y-3">
              {evaluationItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <svg
                    className="w-5 h-5 text-purple-600 flex-shrink-0"
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

            <h3 className="text-2xl font-bold text-black mt-8 mb-4">
              Plan de Rendimiento OL
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planItems.map((item) => (
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
          </section>

          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-6">
              <h4 className="text-xl font-bold mb-2">Estado de desbloqueo</h4>
              <p className="text-purple-100 text-sm">
                Puntaje actual:{" "}
                <strong className="text-white">{overallScore}</strong>
              </p>
              <p className="text-purple-100 text-sm">
                Días {">="} 70:{" "}
                <strong className="text-white">{maintainedDays}</strong>/30
              </p>
              <div className="mt-4">
                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                    unlocked ? "bg-green-300 text-black" : "bg-white/20"
                  }`}
                >
                  {unlocked ? "DESBLOQUEADO" : "En progreso"}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-black mb-3">
                Presupuesto estimado
              </h4>
              <ul className="space-y-2">
                {budgetItems.map((b) => (
                  <li
                    key={b.label}
                    className="flex items-center justify-between text-gray-800"
                  >
                    <span>{b.label}</span>
                    <span className="font-bold">${b.value}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                <span className="text-gray-600">Total campaña estimada</span>
                <span className="text-xl font-bold text-black">${total}</span>
              </div>
              <button className="cursor-pointer w-full mt-6 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors">
                Solicitar beca
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
