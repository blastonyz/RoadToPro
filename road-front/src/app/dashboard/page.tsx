"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";
import { api } from "@/lib/api";
import { WalletSummary } from "@/components/wallet/WalletSummary";
import type { Challenge, Notification } from "@/sdk/types";

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<
    {
      id: string;
      title: string;
      body?: string | null;
      createdAt: string;
      read: boolean;
    }[]
  >([]);
  const [me, setMe] = useState<{ name?: string | null; email?: string } | null>(
    null
  );
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [overall, setOverall] = useState<number>(0);
  const [deltaWeek, setDeltaWeek] = useState<number>(0);
  const [components, setComponents] = useState<{
    technical: number;
    physical: number;
    commitment: number;
    transparency: number;
    reputation: number;
  } | null>(null);
  const [stats, setStats] = useState<{
    completedChallenges: number;
    currentStreakDays: number;
    videosUploaded: number;
    globalRank: number | null | undefined;
  }>({
    completedChallenges: 0,
    currentStreakDays: 0,
    videosUploaded: 0,
    globalRank: null,
  });

  const [todayChallenges, setTodayChallenges] = useState<
    { id: string; title: string; status: string; createdAt: string }[]
  >([]);
  const [todayChallengesLoading, setTodayChallengesLoading] = useState(true);
  const [todayChallengesError, setTodayChallengesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await api.auth.me();
        if (mounted) setMe(user);
      } catch {
        // noop
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingNotifications(true);
        const list = await api.notifications.list();
        if (!mounted) return;
        const isArray = (v: unknown): v is Notification[] => Array.isArray(v);
        const getKey = (
          obj: unknown,
          key: "items" | "data" | "results"
        ): unknown => {
          return obj && typeof obj === "object"
            ? (obj as Record<string, unknown>)[key]
            : undefined;
        };
        let normalized: Notification[] = [];
        if (isArray(list)) normalized = list;
        else if (isArray(getKey(list, "items")))
          normalized = getKey(list, "items") as Notification[];
        else if (isArray(getKey(list, "data")))
          normalized = getKey(list, "data") as Notification[];
        else if (isArray(getKey(list, "results")))
          normalized = getKey(list, "results") as Notification[];
        setNotifications(
          normalized.map((n: Notification) => ({
            id: n.id ?? "",
            title: n.title ?? "",
            body: n.body ?? "",
            createdAt: n.createdAt ?? "",
            read: n.read ?? false,
          }))
        );
      } catch (err) {
        console.error(err);
        if (mounted) setLoadingNotifications(false);
      } finally {
        if (mounted) setLoadingNotifications(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
        setTodayChallengesLoading(true);
        const list = await api.challenges.list();
        if (!mounted) return;
        const items = normalizeChallenges(list);
        setTodayChallenges(
          items.map((c) => ({
            id: c.id,
            title: c.title,
            status: c.status,
            createdAt: c.createdAt,
          }))
        );
      } catch (e) {
        console.log(e);
        if (mounted) setTodayChallengesError("No se pudieron cargar los retos.");
      } finally {
        if (mounted) setTodayChallengesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const score = await api.players.getScore();
        if (!mounted) return;
        setOverall(Math.round(score.overall ?? 0));
        setDeltaWeek(Math.round(score.deltaWeek ?? 0));
        setComponents(score.components ?? null);
      } catch {
        // deja valores por defecto
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await api.dashboard.getMyStats();
        if (!mounted) return;
        setStats({
          completedChallenges: s.completedChallenges ?? 0,
          currentStreakDays: s.currentStreakDays ?? 0,
          videosUploaded: s.videosUploaded ?? 0,
          globalRank: s.globalRank,
        });
      } catch {
        // noop
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: "Volver al inicio",
          href: "/",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Tu centro de alto rendimiento
        </h2>
        {!loadingMe && (
          <p className="text-gray-600 mb-4">
            Bienvenido
            {me?.name ? `, ${me.name}` : me?.email ? `, ${me.email}` : ""}.
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-8 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                    Nivel Actual
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl sm:text-7xl font-bold">
                      {overall}
                    </span>
                    <span className="text-2xl text-gray-400">/100</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Categoría:{" "}
                    {overall >= 85
                      ? "Profesional"
                      : overall >= 70
                      ? "Semi-Profesional"
                      : "Base"}
                  </p>
                </div>
                <div className="bg-white/10 px-6 py-3 rounded-full">
                  <span className="text-green-400 font-bold text-lg">
                    {deltaWeek >= 0 ? `+${deltaWeek}` : `${deltaWeek}`} esta
                    semana
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  name: "Habilidad",
                  value: Math.round(components?.technical ?? 0),
                  color: "bg-blue-500",
                },
                {
                  name: "Compromiso",
                  value: Math.round(components?.commitment ?? 0),
                  color: "bg-green-500",
                },
                {
                  name: "Transparencia",
                  value: Math.round(components?.transparency ?? 0),
                  color: "bg-purple-500",
                },
                {
                  name: "Reputación",
                  value: Math.round(components?.reputation ?? 0),
                  color: "bg-orange-500",
                },
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
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/explore"
                    className="text-sm font-bold text-white bg-black px-4 py-2 rounded-full hover:bg-gray-900 transition-colors"
                  >
                    Explorar y calificar
                  </Link>
                  <Link
                    href="/dashboard/challenges"
                    className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {todayChallenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl ${
                      challenge.status === "COMPLETED"
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          challenge.status === "COMPLETED"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {challenge.status === "COMPLETED" ? (
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
                        <p className="text-sm text-gray-600 capitalize">
                          {challenge.status === "PENDING"
                            ? "Pendiente"
                            : challenge.status === "COMPLETED"
                            ? "Completado"
                            : challenge.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    {challenge.status === "PENDING" && (
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
            <WalletSummary />

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black uppercase">
                  Notificaciones
                </h3>
                <Link
                  href="/dashboard/notifications"
                  className="text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  Ver todas
                </Link>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {loadingNotifications && (
                  <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-black">
                      Cargando notificaciones...
                    </p>
                  </div>
                )}
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-black">
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString("es-AR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No hay notificaciones
                  </p>
                )}
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
                  <span className="font-bold text-black">
                    {stats.completedChallenges}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Racha actual</span>
                  <span className="font-bold text-black">
                    {stats.currentStreakDays} días
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Videos subidos</span>
                  <span className="font-bold text-black">
                    {stats.videosUploaded}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Ranking global</span>
                  <span className="font-bold text-black">
                    {typeof stats.globalRank === "number"
                      ? `#${stats.globalRank.toLocaleString("es-AR")}`
                      : "-"}
                  </span>
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
