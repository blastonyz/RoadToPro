'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <OnboardingHeader returnTo="/onboarding/login" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-black uppercase">Recuperar contraseña</h1>
            <p className="text-gray-600">Ingresa tu email para enviarte un enlace de recuperación</p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
              Te enviamos un email con instrucciones para restablecer tu contraseña (simulado).
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors"
              >
                Enviar enlace
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/onboarding/login" className="font-bold text-black hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}


