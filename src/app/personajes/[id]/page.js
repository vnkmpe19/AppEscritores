"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, Brain, Users, Star, Zap, Target, History, Theater 
} from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import { supabase } from '@/app/lib/supabase';

import FormIdentidad from '@/components/personajes/forms/FormIdentidad';
import FormPsicologia from '@/components/personajes/forms/FormPsicologia';
import FormRelaciones from '@/components/personajes/forms/FormRelaciones';
import FormMotivaciones from '@/components/personajes/forms/FormMotivaciones';
import FormHistoria from '@/components/personajes/forms/FormHistoria';
import FormMascaras from '@/components/personajes/forms/FormMascaras';
import FormDetallesMinimos from '@/components/personajes/forms/FormDetallesMinimos';

export default function FichaDetalladaPage() {
  const params = useParams();
  const [personaje, setPersonaje] = useState(null);
  const [activeTab, setActiveTab] = useState('Identidad');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleUpdate = (updates) => {
    setPersonaje((prev) => ({ ...prev, ...updates }));
  };

  const [progress, setProgress] = useState(0);

  const calculateProgress = (data) => {
    if (!data) return 0;
    
    // Tablas y sus campos a excluir del conteo (metadatos/IDs)
    const exclude = ['id', 'id_proyecto', 'id_personaje', 'fecha_creacion', 'foto', 'orden'];
    
    let totalFields = 0;
    let filledFields = 0;

    const countObjectFields = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      Object.entries(obj).forEach(([key, value]) => {
        if (exclude.includes(key)) return;
        if (Array.isArray(value)) {
          // Si es array (ej: items de checklist), contamos si hay contenido
          totalFields++;
          if (value.length > 0) filledFields++;
        } else if (typeof value === 'object' && value !== null) {
          // Si es un objeto anidado (relación join)
          countObjectFields(value);
        } else {
          totalFields++;
          if (value && String(value).trim() !== '') filledFields++;
        }
      });
    };

    countObjectFields(data);
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const loadPersonaje = async () => {
    const UuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UuidRegex.test(params.id)) return;

    // Traemos de una vez todas las tablas para el progreso
    const { data, error } = await supabase
      .from('personajes')
      .select(`
        *,
        personaje_identidad(*),
        personaje_psicologia(*),
        personaje_motivaciones(*),
        personaje_relaciones(*),
        personaje_historia(*),
        personaje_mascaras(*),
        personaje_detalles_minimos(*)
      `)
      .eq('id', params.id)
      .single();
    
    if (data) {
      setPersonaje(data);
      setProgress(calculateProgress(data));
    }
  };

  useEffect(() => {
    loadPersonaje();
  }, [params.id]);

  if (!personaje) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5F5]">
      <p className="animate-pulse font-black text-slate-300 italic">Abriendo archivos de {params.id}...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDF5F5] font-sans text-slate-800">
      <Sidebar viewMode="personajes" isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-4 md:p-8 flex flex-col h-screen overflow-hidden`}>
        <div className="max-w-[1400px] mx-auto w-full mb-4 flex justify-between items-center">
          <Link href="/personajes" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF5C5C] font-bold transition-colors text-xs uppercase tracking-widest no-underline">
            <ChevronLeft size={18} /> Galería de Personajes
          </Link>
          <div className="px-4 py-1 bg-white rounded-full border border-slate-100 shadow-sm text-[10px] font-black uppercase text-slate-400">
            ID: {personaje.id}
          </div>
        </div>

        <Header 
          title={`Módulo: ${activeTab}`} 
          onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />

        <div className="max-w-[1400px] mx-auto w-full flex flex-1 flex-col lg:flex-row gap-6 overflow-hidden mt-4">
          
          <div className="w-full lg:w-72 bg-white rounded-[30px] lg:rounded-[40px] p-4 lg:p-6 shadow-lg border border-slate-100 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar shrink-0 max-h-[250px] lg:max-h-none">
            <p className="text-[10px] font-black text-slate-300 uppercase mb-4 px-4 tracking-widest">Dimensiones</p>
            
            <TabButton active={activeTab === 'Identidad'} icon={<Star size={16}/>} label="Identidad" onClick={() => setActiveTab('Identidad')} />
            <TabButton active={activeTab === 'Psicología'} icon={<Brain size={16}/>} label="Psicología" onClick={() => setActiveTab('Psicología')} />
            <TabButton active={activeTab === 'Motivaciones'} icon={<Target size={16}/>} label="Motivaciones" onClick={() => setActiveTab('Motivaciones')} />
            <TabButton active={activeTab === 'Relaciones'} icon={<Users size={16}/>} label="Relaciones" onClick={() => setActiveTab('Relaciones')} />
            <TabButton active={activeTab === 'Historia'} icon={<History size={16}/>} label="Historia" onClick={() => setActiveTab('Historia')} />
            <TabButton active={activeTab === 'Máscaras'} icon={<Theater size={16}/>} label="Máscaras" onClick={() => setActiveTab('Máscaras')} />
            <TabButton active={activeTab === 'Detalles'} icon={<Zap size={16}/>} label="Detalles Íntimos" onClick={() => setActiveTab('Detalles')} />

            <div className="mt-auto pt-6">
               <div className="p-6 bg-[#FDF5F5] rounded-[30px] border border-[#FFB7C5]/20 text-center">
                  <p className="text-[9px] font-bold text-[#FFB7C5] uppercase mb-2">
                    {progress === 100 ? 'Finalizado' : 'En proceso'}
                  </p>
                  <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                     <div className="h-full bg-[#FF5C5C] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-[10px] mt-2 font-bold text-slate-400">{progress}% Completado</p>
               </div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 overflow-y-auto custom-scrollbar relative">
             <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6 text-left">
                <div>
                    <h2 className="text-4xl font-serif font-black text-slate-900 tracking-tight">{activeTab}</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Ficha de {personaje.nombre}</p>
                    <p className="mt-2 text-sm font-bold text-slate-400 italic">{personaje.frase_epica || ''}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <img src={personaje.foto || '/avatar.png'} className="w-12 h-12 rounded-full object-cover border-2 border-[#BFD7ED]" alt="" />
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest italic">{personaje.descripcion ? "Completado" : "Boceto"}</span>
                </div>
             </div>

             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'Identidad' && <FormIdentidad personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Psicología' && <FormPsicologia personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Motivaciones' && <FormMotivaciones personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Relaciones' && <FormRelaciones personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Historia' && <FormHistoria personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Máscaras' && <FormMascaras personaje={personaje} onUpdate={loadPersonaje} />}
                {activeTab === 'Detalles' && <FormDetallesMinimos personaje={personaje} onUpdate={loadPersonaje} />}
             </div>
          </div>


        </div>
      </main>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-4 w-full px-5 py-3.5 rounded-2xl font-bold text-xs transition-all ${active ? 'bg-[#FFB7C5] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <div className={`${active ? 'text-white' : 'text-[#FFB7C5]'}`}>{icon}</div>
            {label}
        </button>
    );
}
