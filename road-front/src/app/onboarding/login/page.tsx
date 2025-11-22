'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/onboarding" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black uppercase">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600">
              Continúa tu camino hacia el profesionalismo
            </p>
          </div>

          <div className="space-y-3">
          <button className="cursor-pointer w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-full px-6 py-3 hover:border-black transition-colors">
              <Image
                src="/assets/images/logos/google.webp"
                alt="Google Logo"
                width={24}
                height={24}
              />
              <span className="font-semibold">Continuar con Google</span>
            </button>

            <button className="cursor-pointer w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-full px-6 py-3 hover:border-black transition-colors">
              <Image
                src="/assets/images/logos/apple.png"
                alt="Apple Logo"
                width={24}
                height={24}
              />
              <span className="font-semibold">Continuar con Apple</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-black">
                  Contraseña
                </label>
                {/* <Link
                  href="/onboarding/forgot-password"
                  className="text-xs font-semibold text-black hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </div>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
            >
              Iniciar sesión
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
          </form>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/onboarding/register" className="font-bold text-black hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
