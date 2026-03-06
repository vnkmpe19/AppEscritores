"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';
import { Target, Flame, Ban, Zap } from 'lucide-react';

export default function FormMotivaciones({ personaje }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
     
      <div className="bg-white/40 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4 text-left">
          <Target size={18} className="text-[#FF5C5C]"/> El Motor de la Trama
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Objetivo Externo" placeholder="¿Qué quiere lograr físicamente?" />
          <InputField label="Necesidad Interna" placeholder="¿Qué necesita sanar emocionalmente?" />
          <InputField label="El Obstáculo" placeholder="¿Qué lo detiene ahora mismo?" />
          <InputField label="Opositor Directo" placeholder="¿Quién se opone a él cara a cara?" />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div className="bg-[#E8F5A2]/20 p-6 rounded-[35px] border border-[#E8F5A2]/40 text-left">
          <div className="flex items-center gap-2 mb-4 text-slate-600">
            <Flame size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest text-left">Sacrificios</p>
          </div>
          <SectionTextarea 
            label="¿Qué está dispuesto a sacrificar?" 
            placeholder="¿Hasta dónde llegaría por su meta?" 
          />
          <div className="mt-4">
             <SectionTextarea 
                label="¿Qué jamás sacrificaría?" 
                placeholder="Sus 'No negociables' morales" 
             />
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-200 text-left">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Ban size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest text-left">Consecuencias</p>
          </div>
          <SectionTextarea 
            label="¿Qué perdería si falla?" 
            placeholder="El peor de los escenarios" 
          />
          <div className="mt-4">
            <SectionTextarea 
                label="¿Qué ganaría si triunfa?" 
                placeholder="Más allá de la meta, ¿cómo se sentiría?" 
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-8 shadow-xl text-left">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
          <Zap size={18} className="text-[#E8F5A2]"/> El Punto de Inflexión
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <SectionTextarea 
             label="La Decisión Imposible" 
             placeholder="Ese dilema moral que lo romperá..." 
           />
           <SectionTextarea 
             label="Punto de quiebre" 
             placeholder="¿Cuándo dejará de seguir sus propias reglas?" 
           />
        </div>
        <div className="pt-4 border-t border-white/10">
           <InputField 
             label="El Momento del Cambio" 
             placeholder="¿En qué capítulo o evento cambiará su esencia?" 
           />
        </div>
      </div>

      <SaveButton />
    </div>
  );
}