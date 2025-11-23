"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/footer/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Campaign } from "@/sdk/types";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

export default function PublicCampaignPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "player";

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await api.campaigns.getById(String(id));
        if (!mounted) return;
        setCampaign(data ?? null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar la campaña pública.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const overallScore = campaign?.olRating ?? 0;
  const b = campaign?.budget;
  const budgetEntries: Array<{ label: string; value: number }> = [];
  if (b) {
    if (typeof b.nutrition === "number")
      budgetEntries.push({ label: "Nutrición", value: b.nutrition });
    if (typeof b.personalTrainer === "number")
      budgetEntries.push({
        label: "Entrenador personal",
        value: b.personalTrainer,
      });
    if (typeof b.travels === "number")
      budgetEntries.push({ label: "Viajes a pruebas", value: b.travels });
    if (typeof b.equipment === "number")
      budgetEntries.push({ label: "Equipamiento", value: b.equipment });
    if (typeof b.physiotherapy === "number")
      budgetEntries.push({ label: "Fisioterapia", value: b.physiotherapy });
  }
  const total = b?.total ?? budgetEntries.reduce((a, bb) => a + bb.value, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />
      <main className="flex-1 w-[90%] sm:w-[85%] md:w-[80%] mx-auto py-12 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-black uppercase">
            {campaign?.title
              ? `Campaña: ${campaign.title}`
              : `Campaña: ${decodeURIComponent(String(id))}`}
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}
              {loading ? (
                <p className="text-sm text-gray-600">Cargando campaña...</p>
              ) : (
                <>
                  <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                    {campaign?.presentationVideo ? (
                      <video controls className="w-full h-full rounded-xl">
                        <source src={campaign.presentationVideo} />
                      </video>
                    ) : (
                      <span className="text-gray-500">Video presentación</span>
                    )}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-3">
                    <span className="text-sm uppercase text-gray-600">
                      Rating OL
                    </span>
                    <div className="px-3 py-1 rounded-full bg-black text-white text-sm font-bold">
                      {overallScore}/100
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">Sobre mí</h3>
              <p className="text-gray-700">
                {campaign?.description
                  ? campaign.description
                  : "Soy un jugador comprometido en avanzar a nivel profesional. Busco apoyo para ejecutar mi plan de alto rendimiento y alcanzar pruebas en clubes."}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">
                Objetivo de campaña
              </h3>
              <ul className="space-y-2">
                {budgetEntries.length ? (
                  budgetEntries.map((bb) => (
                    <li
                      key={bb.label}
                      className="flex items-center justify-between text-gray-800"
                    >
                      <span>{bb.label}</span>
                      <span className="font-bold">${bb.value}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Sin desglose disponible.</li>
                )}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-between">
                <span className="text-gray-600">Total estimado</span>
                <span className="text-xl font-bold text-black">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
