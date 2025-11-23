"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [me, setMe] = useState<{ name?: string | null; email?: string } | null>(
    null
  );
  const [formData, setFormData] = useState<{ name?: string | null }>({});
  const [loadingMe, setLoadingMe] = useState(true);
  // const [country, setCountry] = useState('Argentina');
  // const [position, setPosition] = useState('Mediocentro');
  // const [videoLink, setVideoLink] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await api.auth.me();
        if (mounted) setMe(user);
        if (mounted) setFormData({ name: user.name ?? "" });
      } catch {
        // noop
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.users.updateMe({
        name: formData.name ?? "",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{
          label: "Volver al panel",
          href: "/dashboard",
        }}
      />
      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Configuración
        </h2>
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-black">Perfil del jugador</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Nombre completo
                </label>
                <input
                  value={formData.name ?? ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-semibold text-black mb-2">País</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div> */}
              {/* <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Posición</label>
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-black mb-2">Link a video (opcional)</label>
                <input
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                />
              </div> */}
            </div>
          </div>
          <div className="space-y-6">
            {/* <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-black mb-2">Open League ID</h4>
              <p className="text-sm text-gray-700">
                Estado: <span className="font-bold">Verificado</span> (simulado)
              </p>
            </div> */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white px-6 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
