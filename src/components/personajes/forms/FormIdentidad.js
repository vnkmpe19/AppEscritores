"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';

export default function FormIdentidad({ personaje }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Nombre" 
          placeholder="¿Cómo se llama?" 
          defaultValue={personaje?.nombre}
        />
        <InputField label="Apodos" placeholder="¿Qué apodos tiene y quién se los puso?" />
        <InputField label="Edad" placeholder="Cronológica y aparente" />
        <InputField label="Origen" placeholder="¿Dónde nació y dónde creció?" />
        <InputField label="Clase Social" placeholder="¿A qué clase pertenece?" />
        <InputField label="Ocupación" placeholder="¿Qué hace para vivir?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea label="Vestimenta: Impresión" placeholder="¿Cómo viste para impresionar?" />
        <SectionTextarea label="Vestimenta: Solo" placeholder="¿Cómo viste cuando está cómodo?" />
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-100">
        <SectionTextarea label="Rasgo físico reconocible" placeholder="¿Qué lo hace único?" />
        <SectionTextarea label="Incomodidad física" placeholder="¿Qué parte de su apariencia le incomoda?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea label="Primera impresión" placeholder="¿Qué causa al conocerlo?" />
        <SectionTextarea label="Percepción deseada" placeholder="¿Cómo le gustaría ser percibido?" />
      </div>

      <SaveButton />
    </div>
  );
}