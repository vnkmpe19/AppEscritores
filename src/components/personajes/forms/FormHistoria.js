"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton, useCharacterForm } from './FormUtils';

export default function FormHistoria({ personaje, onUpdate }) {
  const { formData, handleChange, handleSave, isSaving, loading } = useCharacterForm(
    'personaje_historia',
    personaje?.id,
    {
      infancia: '', figura_influencia: '', primera_perdida: '', gran_error: '',
      momento_detonante: '', orgullo: '', verguenza: ''
    },
    onUpdate
  );

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-64 bg-slate-100 rounded-[35px]"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6 text-left">
        <SectionTextarea name="infancia" value={formData.infancia || ''} onChange={handleChange} label="Infancia" placeholder="¿Cómo fue su ambiente y los eventos clave de su niñez?" />
        <InputField name="figura_influencia" value={formData.figura_influencia || ''} onChange={handleChange} label="Figura de Influencia" placeholder="¿Quién lo marcó en sus primeros años?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea name="primera_perdida" value={formData.primera_perdida || ''} onChange={handleChange} label="Primera Pérdida" placeholder="¿Cuál fue su primer contacto con el desapego?" />
        <SectionTextarea name="gran_error" value={formData.gran_error || ''} onChange={handleChange} label="El Gran Error" placeholder="Esa acción de la que se arrepiente profundamente" />
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-100 text-left">
        <SectionTextarea name="momento_detonante" value={formData.momento_detonante || ''} onChange={handleChange} label="Momento Detonante" placeholder="El evento que cambió el rumbo de su vida para siempre" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionTextarea name="orgullo" value={formData.orgullo || ''} onChange={handleChange} label="Orgullo" placeholder="¿Cuándo sintió que valía la pena?" />
          <SectionTextarea name="verguenza" value={formData.verguenza || ''} onChange={handleChange} label="Vergüenza" placeholder="Ese recuerdo que intenta enterrar" />
        </div>
      </div>

      <SaveButton onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}