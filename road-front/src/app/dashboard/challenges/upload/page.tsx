"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Loader2, Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";
import { api } from "@/lib/api";
import clsx from "clsx";

export default function UploadChallengePage() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");
  const [selectedType, setSelectedType] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [challengeTitle, setChallengeTitle] = useState<string | null>(null);
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!challengeId) return;
      try {
        const ch = await api.challenges.getById(challengeId);
        if (!mounted) return;
        setChallengeTitle(ch?.title ?? null);
        if (ch?.title) setSelectedChallenge(ch.title);
      } catch {
        if (!mounted) return;
        setChallengeTitle(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [challengeId]);


  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    setSuccessUrl(null);
    try {
      if (!videoFile) throw new Error("Debes seleccionar un video.");
      const resp = await api.upload.uploadFile(videoFile, {
        description:
          `${selectedType} - ${selectedChallenge} | ${description}`.trim(),
        enableDashStreaming: false,
      });
      const fileId = resp?.data?.id;
      const url = resp?.data?.publicUrl;
      setSuccessUrl(url || null);

      if (challengeId) {
        setIsSubmittingResult(true);
        try {
          await api.challenges.submitResult(challengeId, {
            challengeId,
            description: description?.trim() || undefined,
            arkaFileId: String(fileId),
            videoUrl: String(url),
            metadata: {
              type: selectedType || undefined,
              challenge: selectedChallenge || undefined,
            },
          } as const);
        } finally {
          setIsSubmittingResult(false);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error al subir el video. Intenta nuevamente.";
      setError(typeof msg === "string" ? msg : "Error al subir el video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: "Volver a los retos",
          href: "/dashboard/challenges",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Subir Reto
        </h2>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        {successUrl && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
            {challengeId ? "Video subido y resultado enviado. " : "Video subido correctamente. "}
            {successUrl ? (
              <a
                className="underline"
                href={successUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver archivo
              </a>
            ) : null}
            {challengeId && (
              <>
                {" · "}
                <Link className="underline" href={`/dashboard/challenges/${challengeId}`}>
                  Ver reto
                </Link>
              </>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {challengeId && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black mb-1">
                Reto seleccionado
              </h2>
              <p className="text-black font-semibold mt-1">
                {challengeTitle ?? "Cargando..."}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Sube el video para enviar la evidencia de este reto.
              </p>
            </div>
          )}
          {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-black mb-4">
              1. Selecciona el tipo de reto
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(challengeId ? [] : challengeTypes).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.id);
                    setSelectedChallenge("");
                  }}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all text-center ${
                    selectedType === type.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  aria-pressed={selectedType === type.id}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <p className="font-bold">{type.name}</p>
                </button>
              ))}
            </div>
          </div>

          {!challengeId && selectedType && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                2. Elige el reto específico
              </h2>
              <div className="space-y-2">
                {challengeTypes
                  .find((t) => t.id === selectedType)
                  ?.challenges.map((challenge) => (
                    <button
                      key={challenge}
                      type="button"
                      onClick={() => setSelectedChallenge(challenge)}
                      className={`cursor-pointer w-full text-left p-4 rounded-lg border transition-all ${
                        selectedChallenge === challenge
                          ? "border-black bg-black text-white"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold">{challenge}</p>
                    </button>
                  ))}
              </div>
            </div>
          )} */}

          {(challengeId || selectedChallenge) && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                1. Sube tu video
              </h2>
              <div className="space-y-4">
                <div
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
                  role="button"
                  aria-controls="video-upload"
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    {videoFile ? (
                      <div>
                        <svg
                          className="w-16 h-16 mx-auto text-green-500 mb-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="font-bold text-black">{videoFile.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Click para cambiar
                        </p>
                      </div>
                    ) : (
                      <div>
                        <svg
                          className="w-16 h-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="font-bold text-black">
                          Haz click o arrastra tu video aquí
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          MP4, MOV, AVI (max. 100MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Añade detalles sobre tu reto, condiciones, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {(challengeId || selectedChallenge) && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-2">
                ¿Cómo funciona la validación?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    Tu video será revisado por <strong>jugadores PRO</strong>{" "}
                    con reputación alta (votos ponderados)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    La <strong>comunidad</strong> puede votar con límites para
                    evitar manipulación
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    El <strong>staff de Open League</strong> verifica retos
                    importantes y hitos
                  </span>
                </li>
              </ul>
            </div>
          )}

          {videoFile && (challengeId || selectedChallenge) && (
            <div className="flex gap-4">
              <Link
                href="/dashboard/challenges"
                className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-center hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isUploading || isSubmittingResult}
                className={clsx(
                  "flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors disabled:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black flex items-center justify-center gap-2",
                  {
                    "opacity-50 cursor-not-allowed":
                      isUploading || isSubmittingResult,
                    "opacity-100 cursor-pointer": !isUploading && !isSubmittingResult,
                  }
                )}
              >
                {isUploading || isSubmittingResult ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isSubmittingResult ? "Enviando resultado..." : "Subiendo..."}
                  </>
                ) : (
                  "Enviar reto"
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {isUploading
                  ? "Subiendo video"
                  : isSubmittingResult
                  ? "Enviando resultado"
                  : ""}
              </span>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
