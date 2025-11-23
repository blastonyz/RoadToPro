"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Footer } from "@/components/layout/footer/Footer";
import { Star } from "lucide-react";

export default function ProvidersPage() {
  const providers = [
    {
      name: "Nutricionista Pro Fit",
      type: "Nutrición",
      location: "Remoto / AR",
      rating: 4.8,
    },
    {
      name: "Coach Fuerza Max",
      type: "Entrenador",
      location: "CABA",
      rating: 4.7,
    },
    {
      name: "Fisio Recovery",
      type: "Fisioterapia",
      location: "Remoto / AR",
      rating: 4.9,
    },
    {
      name: "Shop EquipoX",
      type: "Equipamiento",
      location: "Ecommerce",
      rating: 4.6,
    },
  ];

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
          Proveedores verificados
        </h2>
        <div className="flex-1 gap-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <svg
                  className="w-5 h-5 text-black flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-800">{item.name}</span>-
                <span className="text-gray-800">{item.type}</span>-
                <span className="text-gray-800">{item.location}</span>-
                <span className="text-gray-800 flex flex-row items-center justify-center gap-2">{item.rating} <Star size={16}/></span>
              </li>
            ))}
          </ul>
          {/* {providers.map((p) => (
            <div key={p.name} className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black">{p.name}</h3>
              <p className="text-gray-700">{p.type}</p>
              <p className="text-sm text-gray-500 mt-1">{p.location}</p>
              <div className="mt-3 inline-flex px-3 py-1 rounded-full text-sm font-bold bg-black text-white">
                {p.rating}★
              </div>
              <button className="cursor-pointer w-full mt-4 bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                Ver detalles
              </button>
            </div>
          ))} */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
