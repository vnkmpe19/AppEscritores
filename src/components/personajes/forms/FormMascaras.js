"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton, useCharacterForm } from './FormUtils';

export default function FormMascaras({ personaje, onUpdate }) {
  const { formData, handleChange, handleSave, isSaving, loading } = useCharacterForm(
    'personaje_mascaras',
    personaje?.id,
    {
      autoimagen: '', imagen_publica: '', esencia_real: '', lo_que_oculta: '',
      lo_que_exagera: '', lado_oscuro: ''
    },
    onUpdate
  );

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-64 bg-slate-100 rounded-[35px]"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-[#B4DDEB]/10 rounded-[35px] border border-[#B4DDEB]/30">
          <SectionTextarea name="autoimagen" value={formData.autoimagen || ''} onChange={handleChange} label="Autoimagen" placeholder="¿Cómo cree él/ella que es?" />
        </div>
        <div className="p-6 bg-slate-50 rounded-[35px] border border-slate-200">
          <SectionTextarea name="imagen_publica" value={formData.imagen_publica || ''} onChange={handleChange} label="Imagen Pública" placeholder="¿Cómo lo percibe el resto del mundo?" />
        </div>
      </div>

      <SectionTextarea name="esencia_real" value={formData.esencia_real || ''} onChange={handleChange} label="Esencia Real" placeholder="Más allá de lo que dice o aparenta, ¿quién es en el fondo?" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <SectionTextarea name="lo_que_oculta" value={formData.lo_que_oculta || ''} onChange={handleChange} label="Lo que oculta" placeholder="Esa debilidad que nadie puede ver" />
        <SectionTextarea name="lo_que_exagera" value={formData.lo_que_exagera || ''} onChange={handleChange} label="Lo que exagera" placeholder="Virtudes o rasgos que finge tener más de la cuenta" />
      </div>

      <div className="bg-red-50/50 p-8 rounded-[40px] border border-red-100">
        <SectionTextarea name="lado_oscuro" value={formData.lado_oscuro || ''} onChange={handleChange} label="El Lado Oscuro" placeholder="¿Qué parte de sí mismo le aterra descubrir?" />
      </div>

      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}