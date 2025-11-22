"use client";

import { useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";

export default function TrainingPage() {
  const [activeMode, setActiveMode] = useState<"base" | "pro">("base");

  const baseContent = [
    {
      title: "Retos Técnicos Básicos",
      description:
        "Ejercicios fundamentales para mejorar tu técnica individual",
      icon: "⚽",
      items: [
        "10 ejercicios semanales",
        "Videos instructivos",
        "Seguimiento de progreso",
      ],
    },
    {
      title: "Videos Educativos",
      description: "Contenido de entrenamiento físico y preparación",
      icon: "📹",
      items: [
        "Biblioteca de 50+ videos",
        "Rutinas de calentamiento",
        "Ejercicios de fuerza",
      ],
    },
    {
      title: "Tests Diarios",
      description: "Evaluaciones simples para medir tu evolución",
      icon: "📊",
      items: [
        "Test técnico diario",
        "Autoevaluación",
        "Historial de resultados",
      ],
    },
  ];

  const proContent = [
    {
      title: "Entrenamientos Personalizados",
      description: "Plan semanal adaptado a tu nivel y objetivos",
      icon: "🎯",
      items: [
        "Plan personalizado",
        "Actualización semanal",
        "Ejercicios específicos",
      ],
    },
    {
      title: "Seguimiento Completo",
      description: "Monitoreo físico y mental profesional",
      icon: "💪",
      items: ["Tracking físico", "Evaluación mental", "Reportes semanales"],
    },
    {
      title: "Plan Nutricional",
      description: "Dieta diseñada para maximizar tu rendimiento",
      icon: "🥗",
      items: ["Menú semanal", "Consejos nutricionales", "Seguimiento calórico"],
    },
    {
      title: "Chat con Coach Certificado",
      description: "Acceso directo a profesionales",
      icon: "💬",
      items: ["Chat 24/7", "Videollamadas mensuales", "Feedback personalizado"],
    },
    {
      title: "Análisis Biomecánico",
      description: "Estudio detallado de tu técnica en video",
      icon: "🔬",
      items: [
        "Análisis de movimientos",
        "Corrección técnica",
        "Comparativa con pros",
      ],
    },
    {
      title: "Cuaderno Digital",
      description: "Registro completo de tu evolución",
      icon: "📝",
      items: [
        "Historial completo",
        "Estadísticas avanzadas",
        "Objetivos y logros",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        link={{
          label: "Subir Video",
          href: "/dashboard/challenges/upload",
          icon: <Plus />,
        }}
        returnData={{
          label: "Volver al panel",
          href: "/dashboard",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Tu Formación
        </h2>

        <div className="bg-gray-100 p-2 rounded-full inline-flex gap-2 mb-8">
          <button
            onClick={() => setActiveMode("base")}
            className={`cursor-pointer px-8 py-3 rounded-full font-bold transition-all ${
              activeMode === "base"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600"
            }`}
            type="button"
            aria-pressed={activeMode === "base"}
          >
            Modo Base
          </button>
          <button
            onClick={() => setActiveMode("pro")}
            className={`cursor-pointer px-8 py-3 rounded-full font-bold transition-all ${
              activeMode === "pro"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600"
            }`}
            type="button"
            aria-pressed={activeMode === "pro"}
          >
            Modo PRO
          </button>
        </div>

        {activeMode === "base" && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Acceso Base - Gratis para todos
              </h2>
              <p className="text-blue-800">
                Todos los jugadores de Open League tienen acceso a contenido
                básico para iniciar su desarrollo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {baseContent.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.items.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="cursor-pointer w-full mt-6 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black">
                    Acceder
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl mt-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-3">
                  ¿Quieres llevar tu juego al siguiente nivel?
                </h2>
                <p className="text-purple-100 mb-6">
                  Activa el Modo PRO y obtén acceso a entrenamientos
                  personalizados, análisis biomecánico, chat con coaches
                  certificados y mucho más.
                </p>
                <button
                  onClick={() => setActiveMode("pro")}
                  className="cursor-pointer inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Ver Modo PRO
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMode === "pro" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-2">
                Modo PRO - Plan de Alto Rendimiento
              </h2>
              <p className="text-yellow-50">
                Acceso completo a todas las herramientas profesionales.
                Disponible por suscripción mensual o mediante becas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proContent.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-all"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.items.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <svg
                          className="w-4 h-4 text-purple-600 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    Suscripción Mensual
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-black">$29</span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Acceso completo a Modo PRO</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cancela cuando quieras</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Soporte prioritario</span>
                  </li>
                </ul>
                <button className="cursor-pointer w-full bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors">
                  Suscribirse ahora
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold mb-4">
                    RECOMENDADO
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Beca Open League</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold">GRATIS</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Acceso PRO sin costo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Renovación cada 3 meses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Basado en tu compromiso y nivel</span>
                  </li>
                </ul>
                <button className="cursor-pointer w-full bg-white text-black px-6 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  Solicitar beca
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
