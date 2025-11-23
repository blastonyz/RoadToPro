"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";
import { api } from "@/lib/api";
import type { Challenge } from "@/sdk";

type Tab = "all" | "pending" | "completed";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<
    { id: string; title: string; status: string; createdAt: string }[]
  >([]);

  const normalizeChallenges = (input: unknown): Challenge[] => {
    if (Array.isArray(input)) return input as Challenge[];
    if (input && typeof input === "object") {
      const obj = input as { data?: unknown; items?: unknown };
      if (Array.isArray(obj.data)) return obj.data as Challenge[];
      if (Array.isArray(obj.items)) return obj.items as Challenge[];
    }
    return [];
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await api.challenges.list();
        if (!mounted) return;
        const items = normalizeChallenges(list);
        setChallenges(items.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          createdAt: c.createdAt,
        })));
      } catch (e) {
        console.log(e)
        if (mounted) setError("No se pudieron cargar los retos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "pending") {
      return challenges.filter((c) => c.status === "PENDING");
    }
    if (activeTab === "completed") {
      return challenges.filter((c) => c.status === "COMPLETED");
    }
    return challenges;
  }, [activeTab, challenges]);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
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
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`cursor-pointer pb-4 px-1 font-bold transition-colors relative ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={activeTab === (tab.id as Tab)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 mb-4">
            {error}
          </div>
        )}
        {loading && !error && (
          <div className="bg-gray-50 text-gray-600 border border-gray-200 rounded-xl p-4 mb-4">
            Cargando retos...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        challenge.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : challenge.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {challenge.status === "COMPLETED"
                        ? "Completado"
                        : challenge.status === "PENDING"
                        ? "Pendiente"
                        : challenge.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(challenge.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">
                    {challenge.title}
                  </h3>
                </div>
              </div>
              <div className="flex gap-3">
                {challenge.status === "PENDING" ? (
                  <Link
                    href={`/dashboard/challenges/upload?challenge=${challenge.id}`}
                    className="flex-1 bg-black text-white px-6 py-3 rounded-full font-bold text-center hover:bg-gray-900 transition-colors"
                  >
                    Subir video
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/challenges/${challenge.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors text-center"
                  >
                    Ver detalles
                  </Link>
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
