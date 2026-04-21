"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Loader2 } from 'lucide-react';

export function InputField({ label, icon, ...props }) {
  return (
    <div className="group text-left">
      <label className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2 group-focus-within:text-[#FF5C5C] transition-colors">
        {icon && icon} {label}
      </label>
      <input
        className="w-full px-6 py-4 xl:py-5 rounded-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#B4DDEB]/30 focus:border-[#B4DDEB] outline-none text-sm font-bold text-slate-700 transition-all shadow-sm"
        {...props}
      />
    </div>
  );
}

export function SectionTextarea({ label, icon, ...props }) {
  return (
    <div className="group text-left">
      <label className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-4 group-focus-within:text-[#FF5C5C] transition-colors">
        {icon && icon} {label}
      </label>
      <textarea
        rows={4}
        className="w-full p-8 rounded-[40px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#B4DDEB]/30 focus:border-[#B4DDEB] outline-none text-sm font-medium text-slate-600 leading-relaxed resize-none transition-all shadow-sm"
        {...props}
      />
    </div>
  );
}

export function SaveButton({ onSave, isSaving }) {
  return (
    <div className="flex justify-end mt-10">
      <button 
        type="button" 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 bg-[#FF5C5C] disabled:bg-[#FFC0C0] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        {isSaving ? "Guardando..." : "Guardar Sección"}
      </button>
    </div>
  );
}

export function useCharacterForm(tableName, personajeId, initialData, onSaveSuccess = null) {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personajeId) return;
    
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id_personaje', personajeId)
        .single();
        
      if (data) {
        setFormData(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [tableName, personajeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!personajeId) return;
    setIsSaving(true);
    
    // UPSERT: update if exists, insert if new
    const payload = { ...formData, id_personaje: personajeId };
    const { error } = await supabase
      .from(tableName)
      .upsert(payload, { onConflict: 'id_personaje' });
      
    if (error) {
      console.error(`🔴 Error crítico guardando ${tableName}:`, error);
      alert(`No se pudo guardar la sección.\nDetalle: ${error.message || error.code}`);
    } else if (onSaveSuccess) {
      onSaveSuccess();
    }
    setIsSaving(false);
  };

  return { formData, handleChange, handleSave, isSaving, loading };
}