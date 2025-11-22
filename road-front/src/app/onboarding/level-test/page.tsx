'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader'

const questions = [
  {
    id: 1,
    question: '¿Cuántos años llevas jugando fútbol?',
    options: ['Menos de 1 año', '1-3 años', '3-5 años', '5-10 años', 'Más de 10 años']
  },
  {
    id: 2,
    question: '¿Con qué frecuencia entrenas actualmente?',
    options: [
      '1 vez por semana',
      '2-3 veces por semana',
      '4-5 veces por semana',
      'Todos los días'
    ]
  },
  {
    id: 3,
    question: '¿Has jugado en equipos organizados o clubes?',
    options: ['Nunca', 'Nivel amateur local', 'Nivel semi-profesional', 'Nivel profesional']
  },
  {
    id: 4,
    question: '¿Cómo calificarías tu control del balón?',
    options: ['Básico', 'Intermedio', 'Avanzado', 'Experto']
  },
  {
    id: 5,
    question: '¿Cómo es tu condición física actual?',
    options: [
      'Necesito mejorar',
      'Promedio',
      'Buena',
      'Muy buena',
      'Excelente'
    ]
  }
]

export default function LevelTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [videoUploaded, setVideoUploaded] = useState(false)

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer })
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    router.push('/dashboard')
  }

  const isTestComplete = Object.keys(answers).length === questions.length && videoUploaded
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/onboarding/player-profile" />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <div className="w-8 h-1 bg-black rounded-full"></div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black uppercase">
              Test de nivel inicial
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Responde algunas preguntas para establecer tu punto de partida
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`cursor-pointer w-full text-left p-4 rounded-xl border-2 transition-all hover:border-black ${
                    answers[questions[currentQuestion].id] === option
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{option}</span>
                    {answers[questions[currentQuestion].id] === option && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentQuestion === questions.length - 1 && (
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg sm:text-xl font-bold text-black">
                  Video de habilidades (10 segundos)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Sube un video corto mostrando tus habilidades. Puede ser control del balón, regates, tiros al arco, etc.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={() => setVideoUploaded(true)}
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  {videoUploaded ? (
                    <div className="space-y-2">
                      <svg
                        className="w-12 h-12 mx-auto text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="font-semibold text-black">Video subido correctamente</p>
                      <p className="text-sm text-gray-600">Click para cambiar</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400"
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
                      <p className="font-semibold text-black">Click para subir video</p>
                      <p className="text-sm text-gray-600">MP4, MOV, AVI (máx. 50MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="cursor-pointer flex-1 border-2 border-gray-300 text-black px-8 py-4 rounded-full font-bold hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isTestComplete}
                className="cursor-pointer flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Finalizar test
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!answers[questions[currentQuestion].id]}
                className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                Siguiente
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
