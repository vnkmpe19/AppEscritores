"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, Brain, Users, Star, Lightbulb, Plus, Zap, Target, History, Theater 
} from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

// --- IMPORTACIÓN DE TODOS LOS FORMULARIOS ---
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

  useEffect(() => {
    const saved = localStorage.getItem('mis_personajes');
    if (saved) {
      const lista = JSON.parse(saved);
      const encontrado = lista.find(p => p.id === params.id);
      setPersonaje(encontrado);
    }
  }, [params.id]);

  if (!personaje) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5F5]">
      <p className="animate-pulse font-black text-slate-300 italic">Abriendo archivos de {params.id}...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDF5F5] font-sans text-slate-800">
      <Sidebar viewMode="personajes" isExpanded={false} />
      
      <main className="flex-1 ml-24 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
        {/* CABECERA DE NAVEGACIÓN */}
        <div className="max-w-[1400px] mx-auto w-full mb-4 flex justify-between items-center">
          <Link href="/personajes" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF5C5C] font-bold transition-colors text-xs uppercase tracking-widest no-underline">
            <ChevronLeft size={18} /> Galería de Personajes
          </Link>
          <div className="px-4 py-1 bg-white rounded-full border border-slate-100 shadow-sm text-[10px] font-black uppercase text-slate-400">
            ID: {personaje.id}
          </div>
        </div>

        <Header title={`Módulo: ${activeTab}`} user={{name: "Patito Sexy"}} />

        <div className="max-w-[1400px] mx-auto w-full flex flex-1 gap-6 overflow-hidden mt-4">
          
          {/* PANEL IZQUIERDO: TODAS LAS DIMENSIONES */}
          <div className="w-72 bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
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
                  <p className="text-[9px] font-bold text-[#FFB7C5] uppercase mb-2">Complejidad</p>
                  <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                     <div className="w-[65%] h-full bg-[#FFB7C5]"></div>
                  </div>
                  <p className="text-[10px] mt-2 font-bold text-slate-400">{personaje.rol}</p>
               </div>
            </div>
          </div>

          {/* CENTRO: ÁREA DE TRABAJO DINÁMICA */}
          <div className="flex-1 bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 overflow-y-auto custom-scrollbar relative">
             <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6 text-left">
                <div>
                    <h2 className="text-4xl font-serif font-black text-slate-900 tracking-tight">{activeTab}</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Ficha de {personaje.nombre}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <img src={personaje.image || '/avatar.png'} className="w-12 h-12 rounded-full object-cover border-2 border-[#BFD7ED]" alt="" />
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest italic">{personaje.estado}</span>
                </div>
             </div>

             {/* RENDERIZADO DE TODOS LOS FORMULARIOS */}
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'Identidad' && <FormIdentidad personaje={personaje} />}
                {activeTab === 'Psicología' && <FormPsicologia personaje={personaje} />}
                {activeTab === 'Motivaciones' && <FormMotivaciones personaje={personaje} />}
                {activeTab === 'Relaciones' && <FormRelaciones personaje={personaje} />}
                {activeTab === 'Historia' && <FormHistoria personaje={personaje} />}
                {activeTab === 'Máscaras' && <FormMascaras personaje={personaje} />}
                {activeTab === 'Detalles' && <FormDetallesMinimos personaje={personaje} />}
             </div>
          </div>

          {/* PANEL DERECHO: IDEAS */}
          <div className="w-80 bg-[#D6EAF8]/40 backdrop-blur-sm rounded-[40px] p-8 flex flex-col shadow-lg border border-white">
            <h3 className="font-black text-xl text-blue-900 mb-6 flex items-center gap-2">
              <Lightbulb size={22} className="text-blue-500" /> Ideas de Arco
            </h3>
            
            <div className="space-y-4">
                <IdeaBox text={`¿Cómo reaccionaría ${personaje.nombre} si pierde su mayor tesoro?`} />
                <IdeaBox text="Define 3 manías que lo hagan sentir humano." />
                <IdeaBox text={`¿Cuál es el secreto más oscuro de este ${personaje.rol}?`} />
            </div>

            <button className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-white text-blue-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-sm">
              <Plus size={16}/> Nueva Idea
            </button>
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

function IdeaBox({ text }) {
    return (
        <div className="bg-white/80 p-5 rounded-[28px] shadow-sm border border-white hover:rotate-1 transition-transform cursor-pointer">
            <p className="text-xs font-bold text-blue-800 italic leading-relaxed">"{text}"</p>
        </div>
    );
}