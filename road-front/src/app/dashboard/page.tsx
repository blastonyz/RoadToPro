"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";

export default function DashboardPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: "validation",
      message: "Tu reto de precisión fue validado por el staff",
      time: "Hace 2h",
    },
    {
      id: 2,
      type: "scholarship",
      message: "Nueva beca disponible para Modo PRO",
      time: "Hace 5h",
    },
    {
      id: 3,
      type: "challenge",
      message: "Tienes 1 reto pendiente para hoy",
      time: "Hoy",
    },
  ]);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        link={{
          label: "Subir Video",
          href: "/dashboard/challenges/upload",
          icon: <Plus />,
        }}
        returnData={{
          label: "Volver al inicio",
          href: "/",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Tu centro de alto rendimiento
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-8 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                    Nivel Actual
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-bold">78</span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Categoría: Semi-Profesional
                  </p>
                </div>
                <div className="bg-white/10 px-6 py-3 rounded-full">
                  <span className="text-green-400 font-bold text-lg">
                    +3 esta semana
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Habilidad", value: 82, color: "bg-blue-500" },
                { name: "Compromiso", value: 75, color: "bg-green-500" },
                { name: "Transparencia", value: 90, color: "bg-purple-500" },
                { name: "Reputación", value: 68, color: "bg-orange-500" },
              ].map((pillar) => (
                <div key={pillar.name} className="bg-gray-50 p-4 rounded-xl">
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black uppercase">
                  Retos de Hoy
                </h2>
                <Link
                  href="/dashboard/challenges"
                  className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Control orientado",
                    type: "Técnica",
                    status: "pending",
                    points: 50,
                  },
                  {
                    title: "Sprint 40m",
                    type: "Física",
                    status: "completed",
                    points: 30,
                  },
                  {
                    title: "Toma de decisiones",
                    type: "Táctica",
                    status: "pending",
                    points: 40,
                  },
                ].map((challenge, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl ${
                      challenge.status === "completed"
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          challenge.status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {challenge.status === "completed" ? (
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-black">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {challenge.type} • +{challenge.points} puntos
                        </p>
                      </div>
                    </div>
                    {challenge.status === "pending" && (
                      <Link
                        href="/dashboard/challenges/upload"
                        className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-900 transition-colors text-center"
                      >
                        Completar
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-blue-200 text-sm uppercase tracking-wider mb-2">
                    Entrenamiento recomendado
                  </p>
                  <h3 className="text-2xl font-bold">
                    Mejora tu control bajo presión
                  </h3>
                  <p className="text-blue-100 mt-2">
                    Basado en tu nivel y objetivos
                  </p>
                </div>
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">
                  PRO
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href="/dashboard/training"
                  className="flex-1 bg-white text-black px-6 py-3 rounded-full font-bold text-center hover:bg-gray-100 transition-colors"
                >
                  Ver entrenamiento
                </Link>
                <Link
                  href="/dashboard/training/upgrade"
                  className="flex-1 bg-white/20 text-white px-6 py-3 rounded-full font-bold text-center hover:bg-white/30 transition-colors"
                >
                  Activar PRO
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black text-white p-6 rounded-2xl">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">
                Tu Wallet
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Tokens OL</p>
                  <p className="text-3xl font-bold">1,250</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Valor estimado</p>
                  <p className="text-xl font-bold">$125.00 USD</p>
                </div>
                <button className="w-full bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  Ver detalles
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black uppercase">
                  Notificaciones
                </h3>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-black">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-black uppercase mb-4">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">
                    Retos completados
                  </span>
                  <span className="font-bold text-black">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Racha actual</span>
                  <span className="font-bold text-black">12 días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Videos subidos</span>
                  <span className="font-bold text-black">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Ranking global</span>
                  <span className="font-bold text-black">#2,341</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
