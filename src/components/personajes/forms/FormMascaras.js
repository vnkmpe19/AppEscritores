"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';

export default function FormMascaras({ personaje }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#B4DDEB]/10 rounded-[35px] border border-[#B4DDEB]/30">
          <SectionTextarea label="Autoimagen" placeholder="¿Cómo cree él/ella que es?" />
        </div>
        <div className="p-6 bg-slate-50 rounded-[35px] border border-slate-200">
          <SectionTextarea label="Imagen Pública" placeholder="¿Cómo lo percibe el resto del mundo?" />
        </div>
      </div>

      <SectionTextarea label="Esencia Real" placeholder="Más allá de lo que dice o aparenta, ¿quién es en el fondo?" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <SectionTextarea label="Lo que oculta" placeholder="Esa debilidad que nadie puede ver" />
        <SectionTextarea label="Lo que exagera" placeholder="Virtudes o rasgos que finge tener más de la cuenta" />
      </div>

      <div className="bg-red-50/50 p-8 rounded-[40px] border border-red-100">
        <SectionTextarea label="El Lado Oscuro" placeholder="¿Qué parte de sí mismo le aterra descubrir?" />
      </div>

      <SaveButton />
    </div>
  );
}