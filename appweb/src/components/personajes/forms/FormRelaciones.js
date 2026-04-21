"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton, useCharacterForm } from './FormUtils';
import { Heart, Eye, Link2, Lock, ShieldAlert } from 'lucide-react';

export default function FormRelaciones({ personaje, onUpdate }) {
  const { formData, handleChange, handleSave, isSaving, loading } = useCharacterForm(
    'personaje_relaciones',
    personaje?.id,
    {
      a_quien_ama: '', a_quien_envidia: '', a_quien_teme: '', a_quien_desprecia: '',
      quien_lo_admira: '', quien_lo_odia: '', quien_lo_conoce: '', con_quien_es_autentico: '', 
      con_quien_finge: '', relacion_pasado: '', relacion_presente: '', relacion_futuro: '', 
      secreto_compartido: '', mentira_vital: ''
    },
    onUpdate
  );

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-64 bg-slate-100 rounded-[35px]"></div></div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/40 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Heart size={18} className="text-[#FF5C5C]"/> Órbita Emocional
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="a_quien_ama" value={formData.a_quien_ama || ''} onChange={handleChange} label="¿A quién ama?" placeholder="El motor afectivo..." />
          <InputField name="a_quien_envidia" value={formData.a_quien_envidia || ''} onChange={handleChange} label="¿A quién envidia?" placeholder="Su referente de frustración..." />
          <InputField name="a_quien_teme" value={formData.a_quien_teme || ''} onChange={handleChange} label="¿A quién teme?" placeholder="La persona que lo paraliza..." />
          <InputField name="a_quien_desprecia" value={formData.a_quien_desprecia || ''} onChange={handleChange} label="¿A quién desprecia?" placeholder="Su antítesis moral..." />
          <InputField name="quien_lo_admira" value={formData.quien_lo_admira || ''} onChange={handleChange} label="¿Quién lo admira?" placeholder="Su fan número uno..." />
          <InputField name="quien_lo_odia" value={formData.quien_lo_odia || ''} onChange={handleChange} label="¿Quién lo odia?" placeholder="Su némesis personal..." />
          <InputField name="quien_lo_conoce" value={formData.quien_lo_conoce || ''} onChange={handleChange} label="¿Quién lo conoce?" placeholder="Su único espejo verdadero..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div className="bg-[#B4DDEB]/20 p-6 rounded-[35px] border border-[#B4DDEB]/30">
          <div className="flex items-center gap-2 mb-4 text-[#4A90E2]">
            <Eye size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest">Zona de Verdad</p>
          </div>
          <SectionTextarea 
            name="con_quien_es_autentico" value={formData.con_quien_es_autentico || ''} onChange={handleChange}
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
            name="con_quien_finge" value={formData.con_quien_finge || ''} onChange={handleChange}
            label="¿Con quién finge?" 
            placeholder="¿A quién intenta engañar o impresionar?" 
          />
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Link2 size={18} className="text-[#F497A9]"/> Vínculos a través del tiempo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/50 p-6 rounded-[35px] border border-slate-100 shadow-sm">
            <SectionTextarea name="relacion_pasado" value={formData.relacion_pasado || ''} onChange={handleChange} label="Pasado" placeholder="La relación que lo definió y cómo le afecta hoy" />
          </div>
          <div className="bg-white/50 p-6 rounded-[35px] border border-slate-100 shadow-sm">
            <SectionTextarea name="relacion_presente" value={formData.relacion_presente || ''} onChange={handleChange} label="Presente" placeholder="La relación que lo sostiene o lo inquieta hoy" />
          </div>
          <div className="bg-white/50 p-6 rounded-[35px] border border-slate-100 shadow-sm">
            <SectionTextarea name="relacion_futuro" value={formData.relacion_futuro || ''} onChange={handleChange} label="Futuro" placeholder="La relación que busca construir o teme encontrar" />
          </div>
        </div>
      </div>

      <div className="bg-[#F497A9]/10 p-8 rounded-[40px] border border-[#F497A9]/20 space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-[#E68694] tracking-[0.2em]">
          <Lock size={18}/> Hilos Invisibles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <SectionTextarea 
             name="secreto_compartido" value={formData.secreto_compartido || ''} onChange={handleChange}
             label="Secreto compartido" 
             placeholder="¿Qué pacto de silencio tiene y con quién?" 
           />
           <SectionTextarea 
             name="mentira_vital" value={formData.mentira_vital || ''} onChange={handleChange}
             label="La Mentira Vital" 
             placeholder="¿Qué mentira sostiene una relación importante?" 
           />
        </div>
      </div>

      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}