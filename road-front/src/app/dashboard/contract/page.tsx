"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Plus } from "lucide-react";

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-white space-y-12">
      <DashboardNavbar
        returnData={{ label: "Volver al panel", href: "/dashboard" }}
      />

      <div className="w-[90%] sm:w-[85%] md:w-[80%] mx-auto">
        <h2 className="text-4xl font-bold text-black uppercase font-kensmark mb-6">
          Contrato de Inversión
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-black mb-4">
                Modelo representante + Web3
              </h3>
              <p className="text-gray-700 mb-3">
                Al aceptar apoyo, el jugador firma un contrato estándar:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-2.5 h-2.5 bg-black rounded-full" />
                  <span className="text-gray-800">
                    Open League recibe <strong>10%</strong> de sus ingresos de
                    carrera, como un representante.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-2.5 h-2.5 bg-black rounded-full" />
                  <span className="text-gray-800">
                    El <strong>100% de ese 10%</strong> se distribuye entre los{" "}
                    <strong>inversores</strong> del jugador.
                  </span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800">
                No es parte de OL; vuelve al ecosistema.
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-blue-900 mb-2">
                Transparencia y Web3
              </h4>
              <p className="text-blue-800 text-sm">
                El contrato y las distribuciones pueden registrarse on-chain según
                jurisdicción, permitiendo auditoría pública y reparto automático a
                inversores.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black text-white rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-3">Resumen</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>Porcentaje: 10% ingresos de carrera</li>
                <li>Destino: 100% distribuido a inversores</li>
                <li>Auditoría: opcional Web3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

