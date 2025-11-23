'use client';

import Link from 'next/link';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Footer } from '@/components/layout/footer/Footer';

export default function ScoreHistoryPage() {
  const history = [
    { day: 'Día 1', score: 72 },
    { day: 'Día 5', score: 73 },
    { day: 'Día 10', score: 74 },
    { day: 'Día 15', score: 76 },
    { day: 'Día 20', score: 77 },
    { day: 'Día 24', score: 78 },
  ];

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: 'Volver a Puntaje',
          href: '/dashboard/score',
        }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">Historial de puntaje</h2>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Gráfico de evolución (placeholder)</span>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {history.map((h) => (
              <div key={h.day} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{h.day}</p>
                <p className="text-lg font-bold text-black">{h.score}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/dashboard/pro/plan"
          className="inline-flex items-center justify-center mt-6 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
        >
          Ver Plan PRO
        </Link>
      </div>
      <Footer />
    </div>
  );
}


