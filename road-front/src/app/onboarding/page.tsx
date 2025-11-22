import Link from 'next/link'
import Image from 'next/image'
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader'

export default function OnboardingLanding() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black uppercase leading-tight">
                Tu camino{' '}
                <span className="block">empieza aquí</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-md">
                Crea tu perfil, completa tu evaluación inicial y da el primer paso hacia tu futuro profesional en el fútbol.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/onboarding/register"
                className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-2 group"
              >
                Comenzar
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
              </Link>
              <Link
                href="/onboarding/login"
                className="border-2 border-black text-black px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-colors text-center"
              >
                Ya tengo cuenta
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">600+</div>
                <div className="text-xs sm:text-sm text-gray-600">Jugadores activos</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Clubes asociados</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-black">15+</div>
                <div className="text-xs sm:text-sm text-gray-600">Países</div>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
              <Image
                src="/assets/images/placeholder1.png"
                alt="Player training"
                className="w-full h-full object-cover"
                width={512}
                height={512}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div>
                  <div className="text-sm font-bold text-black">Verificación completa</div>
                  <div className="text-xs text-gray-600">Open League ID</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
