"use client";

import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";

export default function UpgradeTrainingPage() {
  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: "Volver a Formación",
          href: "/dashboard/training",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Activar Modo PRO
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">
              Lleva tu juego al siguiente nivel
            </h3>
            <p className="text-purple-100 mb-6">
              Accede a entrenamientos personalizados, seguimiento físico y
              mental, plan nutricional, chat con coaches certificados, análisis
              biomecánico y tu cuaderno digital de progreso.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Plan semanal personalizado",
                "Seguimiento físico y mental",
                "Plan nutricional",
                "Chat con Coach Certificado",
                "Análisis biomecánico de videos",
                "Cuaderno digital de progreso",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-300 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <button className="cursor-pointer w-full bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Solicitar beca
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold mb-4">
                BECA DISPONIBLE
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                Beca Open League
              </h3>
              <p className="text-gray-600">
                Accede al Modo PRO sin costo, sujeto a evaluación de compromiso
                y nivel.
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Acceso PRO completo",
                "Renovación cada 3 meses",
                "Cupos limitados",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
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
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/training"
              className="cursor-pointer w-full inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors"
            >
              Solicitar beca
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
