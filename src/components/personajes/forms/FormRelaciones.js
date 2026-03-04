"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';
import { Heart, Eye, Link2, Lock, ShieldAlert } from 'lucide-react';
// Eliminado: import { Input } from 'postcss'; <--- Esto causaría error

export default function FormRelaciones({ personaje }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/40 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Heart size={18} className="text-[#FF5C5C]"/> Órbita Emocional
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="¿A quién ama?" placeholder="El motor afectivo..." />
          <InputField label="¿A quién envidia?" placeholder="Su referente de frustración..." />
          <InputField label="¿A quién teme?" placeholder="La persona que lo paraliza..." />
          <InputField label="¿A quién desprecia?" placeholder="Su antítesis moral..." />
          <InputField label="¿Quién lo admira?" placeholder="Su fan número uno..." />
          <InputField label="¿Quién lo odia?" placeholder="Su némesis personal..." />
          <InputField label="¿Quién lo conoce?" placeholder="Su único espejo verdadero..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div className="bg-[#B4DDEB]/20 p-6 rounded-[35px] border border-[#B4DDEB]/30">
          <div className="flex items-center gap-2 mb-4 text-[#4A90E2]">
            <Eye size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest">Zona de Verdad</p>
          </div>
          <SectionTextarea 
            label="¿Con quién es más auténtico?" 
            placeholder="¿Ante quién se quita la armadura?" 
          />
        </div>
        <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <ShieldAlert size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest">Zona de Actuación</p>
          </div>
          <SectionTextarea 
            label="¿Con quién finge?" 
            placeholder="¿A quién intenta engañar o impresionar?" 
          />
        </div>
      </div>

      {/* BLOQUE 3: LÍNEA DE TIEMPO RELACIONAL */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Link2 size={18} className="text-[#F497A9]"/> Vínculos a través del tiempo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <InputField label="Pasado" placeholder="La relación que lo definió" />
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <InputField label="Presente" placeholder="La relación que lo sostiene hoy" />
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <InputField label="Futuro" placeholder="La relación que lo cambiará" />
          </div>
        </div>
      </div>

      {/* BLOQUE 4: VÍNCULOS OCULTOS (Secretos y Mentiras) */}
      <div className="bg-[#F497A9]/10 p-8 rounded-[40px] border border-[#F497A9]/20 space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-[#E68694] tracking-[0.2em]">
          <Lock size={18}/> Hilos Invisibles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <SectionTextarea 
             label="Secreto compartido" 
             placeholder="¿Qué pacto de silencio tiene y con quién?" 
           />
           <SectionTextarea 
             label="La Mentira Vital" 
             placeholder="¿Qué mentira sostiene una relación importante?" 
           />
        </div>
      </div>

      <SaveButton />
    </div>
  );
}