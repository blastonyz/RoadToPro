'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Footer } from '@/components/layout/footer/Footer';
import { api } from '@/lib/api';
import type { Challenge } from '@/sdk/types';

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await api.challenges.getById(id);
        if (!mounted) return;
        setChallenge(data);
      } catch {
        if (!mounted) return;
        setError('No se pudo cargar el reto.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const getVotes = (
    meta: Challenge['meta']
  ): { pro?: number; community?: number; staff?: boolean } | null => {
    if (!meta || typeof meta !== 'object') return null;
    const raw = (meta as Record<string, unknown>)['votes'];
    if (!raw || typeof raw !== 'object') return null;
    const obj = raw as Record<string, unknown>;
    return {
      pro: typeof obj.pro === 'number' ? obj.pro : undefined,
      community: typeof obj.community === 'number' ? obj.community : undefined,
      staff: typeof obj.staff === 'boolean' ? obj.staff : undefined,
    };
  };

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: 'Volver a Retos',
          href: '/dashboard/challenges',
        }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">Detalle del Reto</h2>
        {loading ? (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl">Cargando reto...</div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">{error}</div>
        ) : !challenge ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl">
            No se encontró el reto.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2">
              <div className="w-full aspect-video rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-gray-500">Video del reto (placeholder)</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">{challenge.title}</h3>
              <p className="text-gray-600 mb-4">
                {challenge.createdAt
                  ? new Date(challenge.createdAt).toLocaleDateString('es-AR')
                  : ''}{' '}
                • {challenge.status}
              </p>
              <p className="text-sm text-gray-700">
                {challenge.description ?? 'Descripción no disponible.'}
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-black mb-2">Estado</h4>
                <div className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-black text-white capitalize">
                  {challenge.status.toLowerCase()}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-black mb-3">Validación 3 capas</h4>
                {(() => {
                  const votes = getVotes(challenge.meta);
                  return votes ? (
                    <ul className="space-y-2 text-sm text-gray-800">
                      <li className="flex items-center justify-between">
                        <span>Jugadores PRO</span>
                        <span className="font-bold">{votes.pro ?? '-'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Comunidad</span>
                        <span className="font-bold">{votes.community ?? '-'}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Staff OL</span>
                        <span className="font-bold">{votes.staff ? '✓' : 'Pendiente'}</span>
                      </li>
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm">Aún no enviado para validación.</p>
                  );
                })()}
              </div>
              <Link
                href={`/dashboard/challenges/upload?challengeId=${challenge.id}`}
                className="inline-flex items-center justify-center w-full bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
              >
                Cargar reto
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}


