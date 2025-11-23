"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { api } from "@/lib/api";
import type { ChallengeSubmissionWithVotes } from "@/sdk/types";
import { Loader2 } from "lucide-react";

type SortKey = "recent" | "top";

export default function ExploreSubmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmissionWithVotes[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [videoUrlsBySubmissionId, setVideoUrlsBySubmissionId] = useState<Record<string, string>>({});

  const normalize = (input: unknown): ChallengeSubmissionWithVotes[] => {
    if (Array.isArray(input)) return input as ChallengeSubmissionWithVotes[];
    if (input && typeof input === "object") {
      const obj = input as { data?: unknown; items?: unknown; results?: unknown };
      if (Array.isArray(obj.data)) return obj.data as ChallengeSubmissionWithVotes[];
      if (Array.isArray(obj.items)) return obj.items as ChallengeSubmissionWithVotes[];
      if (Array.isArray(obj.results)) return obj.results as ChallengeSubmissionWithVotes[];
    }
    return [];
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await api.challenges.listAllSubmissions({ limit: 50 });
        if (!mounted) return;
        const normalized = normalize(list);
        const withVotes = await Promise.all(
          normalized.map(async (s) => {
            try {
              const votes = await api.challenges.getSubmissionVotes(s.id);
              return { ...s, votes: { ...votes, total: (votes.up + votes.down) } };
            } catch {
              return s;
            }
          })
        );
        if (!mounted) return;
        setSubmissions(withVotes);
      } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudieron cargar los retos subidos por la comunidad.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!submissions.length) return;

    let cancelled = false;
    (async () => {
      const pending = submissions
        .map((s) => ({ id: s.id, fileId: s.arkaFileId }))
        .filter(({ id }) => !videoUrlsBySubmissionId[id]);

      if (!pending.length) return;

      try {
        const results = await Promise.allSettled(
          pending.map(async ({ id, fileId }) => {
            const resp = await api.upload.getPublicUrl(fileId);
            const url = typeof resp === "string" ? resp : "";
            return { id, url };
          })
        );

        if (cancelled) return;

        const next: Record<string, string> = {};
        for (const r of results) {
          if (r.status === "fulfilled" && r.value.url) {
            next[r.value.id] = `https://arkacdn.cloudycoding.com/api/data/${r.value.url}`;
          }
        }
        if (Object.keys(next).length) {
          setVideoUrlsBySubmissionId((prev) => ({ ...prev, ...next }));
        }
      } catch {
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [submissions, videoUrlsBySubmissionId]);

  const sorted = useMemo(() => {
    const copy = [...submissions];
    if (sortBy === "top") {
      return copy.sort((a, b) => (b.votes?.score ?? 0) - (a.votes?.score ?? 0));
    }
    return copy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [submissions, sortBy]);

  const handleVote = async (submissionId: string, value: "UP" | "DOWN") => {
    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id !== submissionId) return s;
        const up = s.votes?.up ?? 0;
        const down = s.votes?.down ?? 0;
        const next =
          value === "UP"
            ? { up: up + 1, down, score: (up + 1) - down }
            : { up, down: down + 1, score: up - (down + 1) };
        return { ...s, votes: { ...next, total: (next.up + next.down) } };
      })
    );
    try {
      await api.challenges.voteSubmission(submissionId, value);
      // Sincronizar con la verdad del servidor
      const votes = await api.challenges.getSubmissionVotes(submissionId);
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, votes: { ...votes, total: (votes.up + votes.down) } }
            : s
        )
      );
    } catch (e) {
      console.error(e);
      // Revert (simple refetch)
      try {
        const list = await api.challenges.listAllSubmissions({ limit: 50 });
        setSubmissions(normalize(list));
      } catch {
        // noop
      }
    }
  };

  // Se elimina el manejo manual de carga de video; ahora es automático vía useEffect

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: "Volver al dashboard",
          href: "/dashboard",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black uppercase font-kensmark">
              Explorar retos de la comunidad
            </h1>
            <p className="text-gray-600 mt-1">
              Mira y califica con pulgar arriba o abajo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                sortBy === "recent"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              Recientes
            </button>
            <button
              onClick={() => setSortBy("top")}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                sortBy === "top"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              Top
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Cargando publicaciones...</div>
        )}
        {error && (
          <div className="text-center text-red-600">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((s) => {
              const up = s.votes?.up ?? 0;
              const down = s.votes?.down ?? 0;
              const score = s.votes?.score ?? (up - down);
              // Campos opcionales por si el backend retorna datos enriquecidos
              const any = s as unknown as {
                videoUrl?: string;
                thumbnailUrl?: string;
                description?: string;
                user?: { name?: string } | null;
              };

              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                    {videoUrlsBySubmissionId[s.id] ? (
                      <video
                        src={videoUrlsBySubmissionId[s.id]}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <>
                        {any.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={any.thumbnailUrl}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /></span>
                        )}
                        <span className="absolute inset-x-0 bottom-3 mx-auto w-max px-4 py-2 rounded-full bg-black text-white text-sm font-bold">
                          Cargando video...
                        </span>
                      </>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        Reto #{s.challengeId.slice(0, 6)}
                      </span>
                    </div>
                    {any.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{any.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(s.id, "UP")}
                          className="cursor-pointer px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-sm font-bold"
                          aria-label="Pulgar arriba"
                        >
                          👍 {up}
                        </button>
                        <button
                          onClick={() => handleVote(s.id, "DOWN")}
                          className="cursor-pointer px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-sm font-bold"
                          aria-label="Pulgar abajo"
                        >
                          👎 {down}
                        </button>
                      </div>
                      <span className="text-sm font-bold text-black">
                        Score: {score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}