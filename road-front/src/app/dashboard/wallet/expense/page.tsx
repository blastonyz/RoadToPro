'use client';

import { useState } from 'react';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Footer } from '@/components/layout/footer/Footer';

export default function WalletExpensePage() {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: 'Volver a Wallet',
          href: '/dashboard/wallet',
        }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">Cargar gasto</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-black">Recibo</h3>
              <label
                htmlFor="receipt"
                className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
              >
                <input
                  id="receipt"
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                />
                {receipt ? (
                  <div className="space-y-1">
                    <p className="font-bold text-black">{receipt.name}</p>
                    <p className="text-sm text-gray-600">Click para cambiar</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-black">Sube tu recibo (PDF/Imagen)</p>
                    <p className="text-sm text-gray-600 mt-1">Máx. 10MB</p>
                  </div>
                )}
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-black">Foto del producto/servicio</h3>
              <label
                htmlFor="photo"
                className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
              >
                <input
                  id="photo"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                />
                {photo ? (
                  <div className="space-y-1">
                    <p className="font-bold text-black">{photo.name}</p>
                    <p className="text-sm text-gray-600">Click para cambiar</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-black">Sube una foto</p>
                    <p className="text-sm text-gray-600 mt-1">Máx. 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-black">Detalle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Proveedor (opcional)</label>
                <input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Proveedor verificado o nombre del comercio"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Monto (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Notas (opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Detalles del gasto, relación con tu plan, etc."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="/dashboard/wallet"
              className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-center hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </a>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Enviando...' : 'Cargar gasto'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}


