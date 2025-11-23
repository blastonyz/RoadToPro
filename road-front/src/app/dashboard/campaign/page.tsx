"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Campaign } from "@/sdk/types";

export default function CampaignPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        // Intentamos traer campañas activas del jugador (si el backend asocia usuario->player)
        const list = await api.campaigns.list({ status: "ACTIVE" });
        if (!mounted) return;
        setCampaign(Array.isArray(list) && list.length > 0 ? list[0] : null);
      } catch {
        if (!mounted) return;
        setError("No se pudo cargar la campaña.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const overallScore = campaign?.olRating ?? 0;

  const featuredChallenges =
    campaign?.featuredChallenges?.map((c) => ({
      title: c.name,
      type: c.category,
      points: c.points,
      validated: c.validated,
      validator: c.validator,
    })) ?? [];

  const milestones =
    campaign?.timeline?.map((t) => ({
      date: (t.date ?? "").slice(0, 10),
      text: t.milestone,
    })) ?? [];

  const budgetEntries: Array<{ label: string; value: number }> = [];
  const b = campaign?.budget;
  if (b) {
    if (typeof b.nutrition === "number") budgetEntries.push({ label: "Nutrición", value: b.nutrition });
    if (typeof b.personalTrainer === "number") budgetEntries.push({ label: "Entrenador personal", value: b.personalTrainer });
    if (typeof b.travels === "number") budgetEntries.push({ label: "Viajes a pruebas", value: b.travels });
    if (typeof b.equipment === "number") budgetEntries.push({ label: "Equipamiento", value: b.equipment });
    if (typeof b.physiotherapy === "number") budgetEntries.push({ label: "Fisioterapia", value: b.physiotherapy });
  }
  const total = b?.total ?? budgetEntries.reduce((acc, i) => acc + i.value, 0);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-black uppercase font-kensmark">
            Campaña del Jugador
          </h2>
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors text-sm"
          >
            Ver todas las campañas
          </Link>
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
              ) : !campaign ? (
                <p className="text-sm text-gray-600">No hay campaña activa.</p>
              ) : (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-48 h-48 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                  {campaign.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.photoUrl} alt="Foto de campaña" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">Foto</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                    {campaign.presentationVideo ? (
                      <video controls className="w-full h-full rounded-xl">
                        <source src={campaign.presentationVideo} />
                      </video>
                    ) : (
                      <span className="text-gray-500">Video presentación</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm uppercase text-gray-600">
                      Rating OL
                    </span>
                    <div className="px-3 py-1 rounded-full bg-black text-white text-sm font-bold">
                      {overallScore}/100
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-black mb-3">
                  Metas deportivas
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {campaign?.sportingGoals?.length
                    ? campaign.sportingGoals.map((g, idx) => (
                        <li key={idx}>{g.goal}</li>
                      ))
                    : (
                      <li className="text-gray-500">Sin metas registradas.</li>
                    )}
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-black mb-3">
                  Presupuesto con desglose
                </h3>
                <ul className="space-y-2 text-gray-800">
                  {budgetEntries.length
                    ? budgetEntries.map((bb) => (
                        <li key={bb.label} className="flex items-center justify-between">
                          <span>{bb.label}</span>
                          <span className="font-bold">${bb.value}</span>
                        </li>
                      ))
                    : (
                      <li className="text-gray-500">Sin desglose disponible.</li>
                    )}
                </ul>
                <div className="border-t border-gray-200 mt-4 pt-3 flex items-center justify-between">
                  <span className="text-gray-600">Total estimado</span>
                  <span className="text-xl font-bold text-black">${total}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">Cronograma</h3>
              <ul className="space-y-3">
                {milestones.length
                  ? milestones.map((m, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-24">{m.date}</span>
                        <span className="text-gray-800">{m.text}</span>
                      </li>
                    ))
                  : (
                    <li className="text-gray-500">Sin cronograma.</li>
                  )}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">
                Retos destacados verificados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredChallenges.length
                  ? featuredChallenges.map((ch, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-200 bg-gray-50"
                      >
                        <p className="font-bold text-black">{ch.title}</p>
                        <p className="text-sm text-gray-600">
                          {ch.type} • +{ch.points} puntos
                        </p>
                        {ch.validated && (
                          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                            Validado • {ch.validator || "Staff OL"}
                          </div>
                        )}
                      </div>
                    ))
                  : (
                    <p className="text-sm text-gray-600">No hay retos destacados.</p>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-green-900 mb-2">
                Validaciones del Staff
              </h4>
              <p className="text-green-800 text-sm">
                Este jugador cuenta con validaciones en retos clave y avances
                significativos registrados por el equipo de Open League.
              </p>
            </div>

            <div className="bg-black text-white rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-2">Apoyar campaña</h4>
              <p className="text-gray-300 text-sm mb-4">
                Puedes contribuir con inversiones o donaciones a su Wallet OL.
              </p>
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center justify-center w-full bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Ver Wallet
              </Link>
              <Link
                href={`/campaign/${encodeURIComponent(campaign?.title || "player")}`}
                className="inline-flex items-center justify-center w-full mt-3 bg-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-colors"
              >
                Ver campaña pública
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

