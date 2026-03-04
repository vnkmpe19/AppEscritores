"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';

export default function FormHistoria({ personaje }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6 text-left">
        <SectionTextarea label="Infancia" placeholder="¿Cómo fue su ambiente y los eventos clave de su niñez?" />
        <InputField label="Figura de Influencia" placeholder="¿Quién lo marcó en sus primeros años?" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
        <SectionTextarea label="Primera Pérdida" placeholder="¿Cuál fue su primer contacto con el desapego?" />
        <SectionTextarea label="El Gran Error" placeholder="Esa acción de la que se arrepiente profundamente" />
      </div>

      <div className="space-y-6 pt-4 border-t border-slate-100 text-left">
        <SectionTextarea label="Momento Detonante" placeholder="El evento que cambió el rumbo de su vida para siempre" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionTextarea label="Orgullo" placeholder="¿Cuándo sintió que valía la pena?" />
          <SectionTextarea label="Vergüenza" placeholder="Ese recuerdo que intenta enterrar" />
        </div>
      </div>

      <SaveButton />
    </div>
  );
}