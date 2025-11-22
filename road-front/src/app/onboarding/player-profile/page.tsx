'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader'

export default function PlayerProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    age: '',
    country: '',
    position: '',
    currentClub: '',
    videoLink: '',
    availability: '',
    goal: ''
  })

  const positions = [
    'Portero',
    'Defensa Central',
    'Lateral Derecho',
    'Lateral Izquierdo',
    'Mediocentro Defensivo',
    'Mediocentro',
    'Mediapunta',
    'Extremo Derecho',
    'Extremo Izquierdo',
    'Delantero Centro'
  ]

  const goals = [
    'Ser profesional',
    'Ser fichado por un club',
    'Mostrarme al mundo',
    'Recibir una beca deportiva',
    'Mejorar mis habilidades',
    'Otro'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/onboarding/level-test')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/onboarding/role-selection" />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black uppercase">
              Tu perfil de jugador
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Completa la información básica para crear tu Open League ID
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-black mb-2">
                  Edad *
                </label>
                <input
                  id="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="Tu edad"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-black mb-2">
                  País *
                </label>
                <input
                  id="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="Tu país"
                />
              </div>
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-semibold text-black mb-2">
                Posición principal *
              </label>
              <select
                id="position"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors bg-white"
              >
                <option value="">Selecciona tu posición</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="currentClub" className="block text-sm font-semibold text-black mb-2">
                Club actual
              </label>
              <input
                id="currentClub"
                type="text"
                value={formData.currentClub}
                onChange={(e) => setFormData({ ...formData, currentClub: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                placeholder="Nombre de tu club (opcional)"
              />
              <p className="text-xs text-gray-500 mt-1">Déjalo vacío si no tienes club actualmente</p>
            </div>

            <div>
              <label htmlFor="videoLink" className="block text-sm font-semibold text-black mb-2">
                Link a videos previos
              </label>
              <input
                id="videoLink"
                type="url"
                value={formData.videoLink}
                onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                placeholder="https://youtube.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, etc. (opcional)</p>
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-semibold text-black mb-2">
                Disponibilidad semanal para entrenar *
              </label>
              <select
                id="availability"
                required
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors bg-white"
              >
                <option value="">Selecciona tu disponibilidad</option>
                <option value="1-2">1-2 días por semana</option>
                <option value="3-4">3-4 días por semana</option>
                <option value="5-6">5-6 días por semana</option>
                <option value="7">Todos los días</option>
              </select>
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-semibold text-black mb-2">
                Objetivo principal *
              </label>
              <select
                id="goal"
                required
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors bg-white"
              >
                <option value="">¿Cuál es tu objetivo?</option>
                {goals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer flex-1 border-2 border-gray-300 text-black px-8 py-4 rounded-full font-bold hover:border-black transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                className="cursor-pointer flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
              >
                Continuar al test
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
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
