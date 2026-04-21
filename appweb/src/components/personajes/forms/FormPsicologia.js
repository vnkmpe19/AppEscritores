"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton, useCharacterForm } from './FormUtils';
import { Heart, EyeOff } from 'lucide-react';

export default function FormPsicologia({ personaje, onUpdate }) {
  const { formData, handleChange, handleSave, isSaving, loading } = useCharacterForm(
    'personaje_psicologia',
    personaje?.id,
    {
      autodescripcion: '', descripcion_enemigo: '', tres_virtudes: '', tres_defectos: '',
      emocion_dominante: '', deseo_principal: '', situacion_desestabiliza: '', necesidad_real: '',
      mayor_miedo: '', secreto_vergonzoso: ''
    },
    onUpdate
  );

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-64 bg-slate-100 rounded-[35px]"></div></div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/50 p-6 rounded-[35px] border border-slate-100 shadow-sm">
          <SectionTextarea 
            name="autodescripcion" value={formData.autodescripcion || ''} onChange={handleChange}
            label="¿Cómo se describiría a sí mismo?" 
            placeholder="Autopercepción (puede ser una mentira que crea)" 
          />
        </div>
        <div className="bg-slate-900/5 p-6 rounded-[35px] border border-slate-200 shadow-sm">
          <SectionTextarea 
            name="descripcion_enemigo" value={formData.descripcion_enemigo || ''} onChange={handleChange}
            label="¿Cómo lo describiría su enemigo?" 
            placeholder="La versión más cruda o injusta de él" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <SectionTextarea name="tres_virtudes" value={formData.tres_virtudes || ''} onChange={handleChange} label="Tres virtudes reales" placeholder="Aquello que lo salva en los peores momentos" />
        <SectionTextarea name="tres_defectos" value={formData.tres_defectos || ''} onChange={handleChange} label="Tres defectos destructivos" placeholder="El 'talón de Aquiles' que sabotea sus planes" />
      </div>

      <div className="bg-[#B4DDEB]/20 p-8 rounded-[40px] border border-[#B4DDEB]/30 space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Heart size={18} className="text-[#FF5C5C]"/> Motores e Impulsos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="emocion_dominante" value={formData.emocion_dominante || ''} onChange={handleChange} label="Emoción dominante" placeholder="Ira, melancolía, alegría..." />
          <InputField name="deseo_principal" value={formData.deseo_principal || ''} onChange={handleChange} label="Deseo principal" placeholder="¿Qué desea conseguir activamente?" />
          <InputField name="situacion_desestabiliza" value={formData.situacion_desestabiliza || ''} onChange={handleChange} label="Situación que lo desestabiliza" placeholder="¿Qué le quita el control?" />
          <InputField name="necesidad_real" value={formData.necesidad_real || ''} onChange={handleChange} label="Necesidad real" placeholder="¿Qué necesita sanar?" />
          <div className="md:col-span-2">
            <InputField name="mayor_miedo" value={formData.mayor_miedo || ''} onChange={handleChange} label="El mayor miedo" placeholder="¿Qué teme perder por encima de todo?" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4 shadow-xl text-left">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
          <EyeOff size={18} className="text-[#FFB7C5]"/> El Secreto Vergonzoso
        </h4>
        <textarea 
          name="secreto_vergonzoso" value={formData.secreto_vergonzoso || ''} onChange={handleChange}
          placeholder="Ese secreto que destruiría su vida si saliera a la luz..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium text-slate-200 outline-none focus:ring-2 focus:ring-[#FFB7C5] min-h-[100px] resize-none blur-md hover:blur-none focus:blur-none transition-all duration-700 select-none"
        />
      </div>

      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}