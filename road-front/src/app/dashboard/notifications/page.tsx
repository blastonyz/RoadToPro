'use client';

import { useEffect, useState } from 'react';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Footer } from '@/components/layout/footer/Footer';
import { api } from '@/lib/api';
import type { Notification } from '@/sdk/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body?: string | null; createdAt: string; read: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await api.notifications.list();
        if (!mounted) return;
        const isArray = (v: unknown): v is Notification[] => Array.isArray(v);
        const getKey = (obj: unknown, key: 'items' | 'data' | 'results'): unknown => {
          return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined;
        };
        let normalized: Notification[] = [];
        if (isArray(list)) normalized = list;
        else if (isArray(getKey(list, 'items'))) normalized = getKey(list, 'items') as Notification[];
        else if (isArray(getKey(list, 'data'))) normalized = getKey(list, 'data') as Notification[];
        else if (isArray(getKey(list, 'results'))) normalized = getKey(list, 'results') as Notification[];
        setNotifications(
          normalized.map((n: Notification) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            createdAt: n.createdAt,
            read: n.read,
          }))
        );
      } catch (err) {
        console.error(err);
        if (mounted) setError('No se pudieron cargar las notificaciones.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: 'Volver al panel',
          href: '/dashboard',
        }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">Notificaciones</h2>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
            {error}
          </div>
        )}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-black">{n.title}</p>
                <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              {n.body && <p className="text-sm text-gray-700 mt-1">{n.body}</p>}
            </div>
          ))}
          {!loading && notifications.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-600">
              No tienes notificaciones.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}


