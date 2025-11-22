"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";

type ChallengeType = "technical" | "physical" | "tactical" | "mental";
type ChallengeStatus = "pending" | "in_validation" | "validated" | "rejected";

interface Challenge {
  id: number;
  title: string;
  type: ChallengeType;
  status: ChallengeStatus;
  points: number;
  date: string;
  videoUrl?: string;
  validationVotes?: {
    pro: number;
    community: number;
    staff: boolean;
  };
}

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );
  const [selectedType, setSelectedType] = useState<ChallengeType | "all">(
    "all"
  );

  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Control orientado bajo presión",
      type: "technical",
      status: "validated",
      points: 50,
      date: "2025-01-14",
      validationVotes: { pro: 8, community: 45, staff: true },
    },
    {
      id: 2,
      title: "Sprint 40 metros",
      type: "physical",
      status: "in_validation",
      points: 30,
      date: "2025-01-15",
      validationVotes: { pro: 3, community: 12, staff: false },
    },
    {
      id: 3,
      title: "Toma de decisiones en espacio reducido",
      type: "tactical",
      status: "pending",
      points: 40,
      date: "2025-01-15",
    },
    {
      id: 4,
      title: "Disciplina y constancia semanal",
      type: "mental",
      status: "validated",
      points: 35,
      date: "2025-01-13",
      validationVotes: { pro: 12, community: 67, staff: true },
    },
  ];

  const challengeTypes = [
    { id: "all", name: "Todos", icon: "🎯" },
    { id: "technical", name: "Técnica", icon: "⚽" },
    { id: "physical", name: "Física", icon: "💪" },
    { id: "tactical", name: "Táctica", icon: "🧠" },
    { id: "mental", name: "Mental", icon: "🎖️" },
  ];

  const getStatusColor = (status: ChallengeStatus) => {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_validation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ChallengeStatus) => {
    switch (status) {
      case "validated":
        return "Validado";
      case "in_validation":
        return "En validación";
      case "rejected":
        return "Rechazado";
      default:
        return "Pendiente";
    }
  };

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
          Tus Retos
        </h2>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-bold text-blue-900">
                Sistema de validación en 3 capas
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                Tus retos son validados por jugadores PRO, la comunidad y el
                staff de Open League para garantizar transparencia y evitar
                fraudes.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-3 mb-6"
          role="toolbar"
          aria-label="Filtrar por tipo de reto"
        >
          {challengeTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id as ChallengeType | "all")}
              className={`cursor-pointer px-6 py-3 rounded-full font-bold transition-colors ${
                selectedType === type.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-pressed={selectedType === type.id}
            >
              <span className="mr-2">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        <div className="border-b border-gray-200 mb-6 sticky top-0 bg-white z-10">
          <div className="flex gap-8">
            {[
              { id: "all", label: "Todos" },
              { id: "pending", label: "Pendientes" },
              { id: "completed", label: "Completados" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`cursor-pointer pb-4 px-1 font-bold transition-colors relative ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={activeTab === (tab.id as typeof activeTab)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        challenge.status
                      )}`}
                    >
                      {getStatusText(challenge.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {challenge.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {challenge.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-black">
                    +{challenge.points}
                  </p>
                  <p className="text-xs text-gray-500">puntos</p>
                </div>
              </div>

              {challenge.status === "in_validation" &&
                challenge.validationVotes && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">
                      Estado de validación:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Jugadores PRO</span>
                        <span className="font-bold">
                          {challenge.validationVotes.pro}/10
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Comunidad</span>
                        <span className="font-bold">
                          {challenge.validationVotes.community}/50
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Staff OL</span>
                        <span className="font-bold">
                          {challenge.validationVotes.staff ? "✓" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              {challenge.status === "validated" &&
                challenge.validationVotes && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-bold text-green-700 mb-2">
                      ✓ Validado exitosamente
                    </p>
                    <p className="text-xs text-green-600">
                      {challenge.validationVotes.pro} jugadores PRO •{" "}
                      {challenge.validationVotes.community} votos comunitarios •
                      Staff OL
                    </p>
                  </div>
                )}

              <div className="flex gap-3">
                {challenge.status === "pending" ? (
                  <Link
                    href={`/dashboard/challenges/upload?challenge=${challenge.id}`}
                    className="flex-1 bg-black text-white px-6 py-3 rounded-full font-bold text-center hover:bg-gray-900 transition-colors"
                  >
                    Subir video
                  </Link>
                ) : (
                  <button className="cursor-pointer flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                    Ver detalles
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-3">
              ¿Ya completaste tu reto diario?
            </h2>
            <p className="text-purple-100 mb-6">
              Mantén tu racha activa y sigue mejorando tu índice OL. Cada reto
              cuenta para tu progreso y reputación.
            </p>
            <Link
              href="/dashboard/challenges/upload"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Subir reto de hoy
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
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
