"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Campaign, CampaignStatus } from "@/sdk/types";

export default function CampaignsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await api.campaigns.list(statusFilter === "ALL" ? undefined : { status: statusFilter });
        if (!mounted) return;
        setCampaigns(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setError("No se pudieron cargar las campañas.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-black uppercase font-kensmark">
            Campañas
          </h2>
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm text-gray-700 font-bold">Estado</label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | "ALL")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="ALL">Todas</option>
              <option value="ACTIVE">Activas</option>
              <option value="DRAFT">Borrador</option>
              <option value="PAUSED">Pausadas</option>
              <option value="COMPLETED">Completadas</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-sm text-gray-600">Cargando campañas...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-gray-600">No hay campañas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-2">
                  {c.photoUrl ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-lg">
                      <img
                        src={c.photoUrl}
                        alt={c.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      Sin foto
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-black truncate">{c.title}</p>
                    <span className="text-xs px-2 py-1 rounded-full border border-gray-300 text-gray-700">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.description || "Sin descripción"}</p>
                  <div className="text-sm text-gray-800">
                    Rating OL: <span className="font-bold">{c.olRating}/100</span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <Link
                      href={`/campaign/${encodeURIComponent(c.id)}`}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors"
                    >
                      Ver pública
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}


