"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton, useCharacterForm } from './FormUtils';

import { supabase } from '@/app/lib/supabase';

export default function FormIdentidad({ personaje, onUpdate }) {
  const [localNombre, setLocalNombre] = React.useState(personaje?.nombre || '');
  const [localFraseEpica, setLocalFraseEpica] = React.useState(personaje?.frase_epica || '');
  const [isSavingLocal, setIsSavingLocal] = React.useState(false);
  const { formData, handleChange, handleSave, isSaving, loading } = useCharacterForm(
    'personaje_identidad',
    personaje?.id,
    {
      apodos: '', edad: '', origen: '', clase_social: '', ocupacion: '',
      vestimenta_impresion: '', vestimenta_solo: '', rasgo_fisico: '',
      incomodidad_fisica: '', primera_impresion: '', percepcion_deseada: ''
    },
    onUpdate
  );

  const customSave = async () => {
    setIsSavingLocal(true);
    await handleSave(); // Guarda el resto del formIdentidad (apodos, edad, etc.)

    const updates = { nombre: localNombre, frase_epica: localFraseEpica };
    const { error } = await supabase.from('personajes').update(updates).eq('id', personaje.id);
    if (!error && onUpdate) {
      onUpdate(updates);
    }

    setIsSavingLocal(false);
  };


  if (loading) return <div className="animate-pulse space-y-8"><div className="h-64 bg-slate-100 rounded-[35px]"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Nombre" value={localNombre} onChange={(e) => setLocalNombre(e.target.value)} placeholder="¿Cómo se llama?" />
        <InputField label="Frase épica" value={localFraseEpica} onChange={(e) => setLocalFraseEpica(e.target.value)} placeholder="Su frase característica..." />
        <InputField name="apodos" value={formData.apodos || ''} onChange={handleChange} label="Apodos" placeholder="¿Qué apodos tiene y quién se los puso?" />
        <InputField name="edad" value={formData.edad || ''} onChange={handleChange} label="Edad" placeholder="Cronológica y aparente" />
        <InputField name="origen" value={formData.origen || ''} onChange={handleChange} label="Origen" placeholder="¿Dónde nació y dónde creció?" />
        <InputField name="clase_social" value={formData.clase_social || ''} onChange={handleChange} label="Clase Social" placeholder="¿A qué clase pertenece?" />
        <InputField name="ocupacion" value={formData.ocupacion || ''} onChange={handleChange} label="Ocupación" placeholder="¿Qué hace para vivir?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea name="vestimenta_impresion" value={formData.vestimenta_impresion || ''} onChange={handleChange} label="Vestimenta: Impresión" placeholder="¿Cómo viste para impresionar?" />
        <SectionTextarea name="vestimenta_solo" value={formData.vestimenta_solo || ''} onChange={handleChange} label="Vestimenta: Solo" placeholder="¿Cómo viste cuando está cómodo?" />
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-100">
        <SectionTextarea name="rasgo_fisico" value={formData.rasgo_fisico || ''} onChange={handleChange} label="Rasgo físico reconocible" placeholder="¿Qué lo hace único?" />
        <SectionTextarea name="incomodidad_fisica" value={formData.incomodidad_fisica || ''} onChange={handleChange} label="Incomodidad física" placeholder="¿Qué parte de su apariencia le incomoda?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea name="primera_impresion" value={formData.primera_impresion || ''} onChange={handleChange} label="Primera impresión" placeholder="¿Qué causa al conocerlo?" />
        <SectionTextarea name="percepcion_deseada" value={formData.percepcion_deseada || ''} onChange={handleChange} label="Percepción deseada" placeholder="¿Cómo le gustaría ser percibido?" />
      </div>

      <SaveButton onSave={customSave} isSaving={isSaving || isSavingLocal} />
    </div>
  );
}