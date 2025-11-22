"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Plus } from "lucide-react";
import { Footer } from "@/components/layout/footer/Footer";

export default function UploadChallengePage() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const challengeTypes = [
    {
      id: "technical",
      name: "Técnica",
      icon: "⚽",
      challenges: [
        "Control orientado",
        "Precisión en pases largos",
        "Remate a portería",
        "Conducción en zigzag",
        "Control de balón aéreo",
      ],
    },
    {
      id: "physical",
      name: "Física",
      icon: "💪",
      challenges: [
        "Sprint 40 metros",
        "Resistencia aeróbica",
        "Agilidad con escalera",
        "Salto vertical",
        "Cambios de dirección",
      ],
    },
    {
      id: "tactical",
      name: "Táctica",
      icon: "🧠",
      challenges: [
        "Toma de decisiones bajo presión",
        "Posicionamiento defensivo",
        "Lectura de jugada",
        "Anticipación en duelos",
        "Desmarque inteligente",
      ],
    },
    {
      id: "mental",
      name: "Mental",
      icon: "🎖️",
      challenges: [
        "Disciplina semanal",
        "Constancia en entrenamientos",
        "Gestión del estrés",
        "Concentración en partido",
        "Recuperación activa",
      ],
    },
  ];

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
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
          label: "Volver a los retos",
          href: "/dashboard/challenges",
        }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Subir Reto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-black mb-4">
              1. Selecciona el tipo de reto
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {challengeTypes.map((type) => (
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

          {selectedType && (
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
          )}

          {selectedChallenge && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                3. Sube tu video
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

          {selectedChallenge && (
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

          {videoFile && selectedChallenge && (
            <div className="flex gap-4">
              <Link
                href="/dashboard/challenges"
                className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-center hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors disabled:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
              >
                {isUploading ? "Subiendo..." : "Enviar reto"}
              </button>
              <span className="sr-only" aria-live="polite">
                {isUploading ? "Subiendo video" : ""}
              </span>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
