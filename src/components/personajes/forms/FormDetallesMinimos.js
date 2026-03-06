"use client";
import React from 'react';
import { InputField, SectionTextarea, SaveButton } from './FormUtils';
import { Music, Moon, Droplets, Mic2, Package, Wind, Quote, Fingerprint, EyeOff } from 'lucide-react';

export default function FormDetallesMinimos({ personaje }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      
      <div className="bg-white/40 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-4">
          <Mic2 size={18} className="text-[#FFB7C5]"/> Percepción Sensorial
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="¿Cómo suena su risa?" 
            placeholder="Ej: Escandalosa, contenida, musical..." 
            icon={<Mic2 size={14}/>}
          />
          <InputField 
            label="Olor característico" 
            placeholder="Ej: A pergamino viejo, lluvia, tabaco..." 
            icon={<Wind size={14}/>}
          />
          <InputField 
            label="Música preferida" 
            placeholder="¿Qué melodías resuenan con su alma?" 
            icon={<Music size={14}/>}
          />
          <InputField 
            label="Objeto inseparable" 
            placeholder="Ese amuleto o herramienta que siempre lleva" 
            icon={<Package size={14}/>}
          />
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div className="bg-[#B4DDEB]/10 p-6 rounded-[35px] border border-[#B4DDEB]/30">
          <div className="flex items-center gap-2 mb-4 text-[#4A90E2]">
            <Droplets size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest">El Llanto</p>
          </div>
          <SectionTextarea 
            label="¿Cómo llora?" 
            placeholder="¿En silencio, con sollozos, solo cuando nadie ve?" 
          />
        </div>
        <div className="bg-slate-50 p-6 rounded-[35px] border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Moon size={18}/>
            <p className="text-[10px] font-black uppercase tracking-widest">El Descanso</p>
          </div>
          <SectionTextarea 
            label="¿Cómo duerme?" 
            placeholder="¿Inquieto, profundamente, necesita luz prendida?" 
          />
        </div>
      </div>

      
      <div className="space-y-8 pt-6 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <div className="flex items-center gap-2 mb-3 text-slate-400 group-focus-within:text-[#FF5C5C] transition-colors">
              <Quote size={18}/>
              <label className="text-[10px] font-black uppercase tracking-widest">Frase Recurrente</label>
            </div>
            <textarea 
              placeholder="Esa coletilla o muletilla que dice sin pensar..." 
              className="w-full p-6 rounded-[30px] bg-slate-50 border border-slate-100 outline-none text-sm font-medium h-24 resize-none focus:bg-white focus:ring-4 focus:ring-[#FFB7C5]/20 transition-all"
            />
          </div>

          <div className="group">
            <div className="flex items-center gap-2 mb-3 text-slate-400 group-focus-within:text-[#FF5C5C] transition-colors">
              <Fingerprint size={18}/>
              <label className="text-[10px] font-black uppercase tracking-widest">Gesto al mentir</label>
            </div>
            <textarea 
              placeholder="¿Se toca la oreja, evita la mirada, aclara la voz?" 
              className="w-full p-6 rounded-[30px] bg-slate-50 border border-slate-100 outline-none text-sm font-medium h-24 resize-none focus:bg-white focus:ring-4 focus:ring-[#FFB7C5]/20 transition-all"
            />
          </div>
        </div>

       
        <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <EyeOff size={20} className="text-[#FFB7C5]"/>
            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Hábito en Soledad</h4>
          </div>
          <textarea 
            placeholder="¿Qué hace el personaje cuando está absolutamente convencido de que nadie lo observa?" 
            className="w-full bg-white/5 border-none rounded-[24px] p-6 text-sm font-medium text-slate-200 outline-none focus:ring-2 focus:ring-[#FFB7C5] min-h-[120px] resize-none leading-relaxed"
          />
        </div>
      </div>

      <SaveButton />
    </div>
  );
}