"use client";

 import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

export default function WidgetClima() {
  // Datos de ejemplo para el clima
  const clima = {
    estacion: 'Invierno',
    temperatura: '-5°C',
    descripcion: 'Vientos helados y nevadas constantes en las cumbres.',
    icon: <Snowflake className="text-blue-300" size={28} />
  };

  return (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
        Clima Actual
      </h3>
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="p-3 bg-white rounded-full shadow-sm">
          {clima.icon}
        </div>
        <div>
          <p className="font-bold text-slate-700">{clima.estacion}</p>
          <p className="text-2xl font-black text-slate-800">{clima.temperatura}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-4 leading-relaxed">{clima.descripcion}</p>
    </div>
  );
}