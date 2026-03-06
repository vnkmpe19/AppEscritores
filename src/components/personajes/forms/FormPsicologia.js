"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';
import { Heart, EyeOff } from 'lucide-react';

export default function FormPsicologia({ personaje }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/50 p-6 rounded-[35px] border border-slate-100 shadow-sm">
          <SectionTextarea 
            label="¿Cómo se describiría a sí mismo?" 
            placeholder="Autopercepción (puede ser una mentira que crea)" 
          />
        </div>
        <div className="bg-slate-900/5 p-6 rounded-[35px] border border-slate-200 shadow-sm">
          <SectionTextarea 
            label="¿Cómo lo describiría su enemigo?" 
            placeholder="La versión más cruda o injusta de él" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <SectionTextarea label="Tres virtudes reales" placeholder="Aquello que lo salva en los peores momentos" />
        <SectionTextarea label="Tres defectos destructivos" placeholder="El 'talón de Aquiles' que sabotea sus planes" />
      </div>

      <div className="bg-[#B4DDEB]/20 p-8 rounded-[40px] border border-[#B4DDEB]/30 space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Heart size={18} className="text-[#FF5C5C]"/> Motores e Impulsos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Emoción dominante" placeholder="Ira, melancolía, alegría..." />
          <InputField label="Deseo principal" placeholder="¿Qué desea conseguir activamente?" />
          <InputField label="Situación que lo desestabiliza" placeholder="¿Qué le quita el control?" />
          <InputField label="Necesidad real" placeholder="¿Qué necesita sanar?" />
          <div className="md:col-span-2">
            <InputField label="El mayor miedo" placeholder="¿Qué teme perder por encima de todo?" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4 shadow-xl">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
          <EyeOff size={18} className="text-[#FFB7C5]"/> El Secreto Vergonzoso
        </h4>
        {/* Usamos el componente SectionTextarea con clases personalizadas si es posible, 
            o el textarea nativo corregido para que no rompa el diseño */}
            {/*Vavava */}
        <textarea 
          placeholder="Ese secreto que destruiría su vida si saliera a la luz..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium text-slate-200 outline-none focus:ring-2 focus:ring-[#FFB7C5] min-h-[100px] resize-none"
        />
      </div>

      <SaveButton />
    </div>
  );
}