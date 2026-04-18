"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  Sun, Cloud, CloudRain, Snowflake, Thermometer, Edit, X, Check 
} from 'lucide-react';

export default function WidgetClima({ proyectoId }) {
  const [geografiaId, setGeografiaId] = useState(null);
  const [clima, setClima] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [detalles, setDetalles] = useState('');
  
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (proyectoId) cargarClima();
  }, [proyectoId]);

  const cargarClima = async () => {
    setCargando(true);
    const { data } = await supabase
      .from('geografia')
      .select('id, clima, temperatura, detalles_clima')
      .eq('id_proyecto', proyectoId)
      .single();

    if (data) {
      setGeografiaId(data.id);
      setClima(data.clima || '');
      setTemperatura(data.temperatura || '');
      setDetalles(data.detalles_clima || '');
    }
    setCargando(false);
  };

  const guardarClima = async () => {
    setGuardando(true);
    const datosGuardar = {
      id_proyecto: proyectoId,
      clima,
      temperatura,
      detalles_clima: detalles
    };

    if (geografiaId) {
      await supabase.from('geografia').update(datosGuardar).eq('id', geografiaId);
    } else {
      const { data } = await supabase.from('geografia').insert([datosGuardar]).select().single();
      if (data) setGeografiaId(data.id);
    }

    setEditando(false);
    setGuardando(false);
  };

  const getIcono = () => {
    const texto = (clima + ' ' + detalles).toLowerCase();
    if (texto.includes('invierno') || texto.includes('nieve') || texto.includes('frío') || texto.includes('helado')) {
      return <Snowflake className="text-blue-300 w-6 h-6 md:w-7 md:h-7" />;
    }
    if (texto.includes('verano') || texto.includes('sol') || texto.includes('calor') || texto.includes('árido') || texto.includes('desierto')) {
      return <Sun className="text-[#FFB703] w-6 h-6 md:w-7 md:h-7" />;
    }
    if (texto.includes('lluvia') || texto.includes('tormenta') || texto.includes('húmedo') || texto.includes('agua')) {
      return <CloudRain className="text-slate-500 w-6 h-6 md:w-7 md:h-7" />;
    }
    if (texto.includes('nublado') || texto.includes('niebla')) {
      return <Cloud className="text-slate-400 w-6 h-6 md:w-7 md:h-7" />;
    }
    return <Thermometer className="text-[#FF5C5C] w-6 h-6 md:w-7 md:h-7" />; 
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 h-full flex items-center justify-center min-h-[200px]">
        <p className="text-slate-400 font-bold animate-pulse text-sm md:text-base">Cargando clima...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 h-full flex flex-col relative group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
          Clima Actual
        </h3>
        {!editando && (
          <button 
            onClick={() => setEditando(true)} 
            className="p-1.5 md:p-2 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <Edit size={14} className="md:w-4 md:h-4" />
          </button>
        )}
      </div>

      {editando ? (
        <div className="flex flex-col gap-2 md:gap-3 flex-1">
          <input 
            value={clima} 
            onChange={e => setClima(e.target.value)} 
            placeholder="Estación (Ej. Invierno)" 
            className="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] text-xs md:text-sm" 
          />
          <input 
            value={temperatura} 
            onChange={e => setTemperatura(e.target.value)} 
            placeholder="Temp (Ej. -5°C)" 
            className="w-full bg-slate-50 p-3 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] text-xs md:text-sm" 
          />
          <textarea 
            value={detalles} 
            onChange={e => setDetalles(e.target.value)} 
            placeholder="Descripción del clima..." 
            className="w-full bg-slate-50 p-3 rounded-xl outline-none text-slate-600 text-xs md:text-sm min-h-[60px] md:min-h-[80px] resize-none focus:ring-2 focus:ring-[#FFD1A4]" 
          />
          
          <div className="flex gap-2 mt-auto pt-2">
            <button onClick={() => setEditando(false)} className="flex-1 bg-slate-100 text-slate-500 font-bold py-2 rounded-xl hover:bg-slate-200 transition-colors flex justify-center items-center">
              <X size={16} />
            </button>
            <button onClick={guardarClima} disabled={guardando} className="flex-[2] bg-slate-800 text-white font-bold py-2 rounded-xl hover:bg-slate-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 text-xs md:text-sm">
              <Check size={16} /> {guardando ? '...' : 'Guardar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {clima || temperatura || detalles ? (
            <>
              <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="p-2 md:p-3 bg-white rounded-full shadow-sm flex-shrink-0">
                  {getIcono()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-700 text-sm truncate">{clima || 'Sin definir'}</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800 truncate">{temperatura || '--'}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-3 md:mt-4 leading-relaxed flex-1 overflow-y-auto custom-scrollbar">
                {detalles}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-300 gap-2 md:gap-3 opacity-70 py-4">
              <Thermometer size={28} className="md:w-8 md:h-8" />
              <p className="text-xs md:text-sm font-bold text-center">Aún no defines el clima.</p>
              <button onClick={() => setEditando(true)} className="text-[#FF5C5C] text-[10px] md:text-xs font-bold uppercase tracking-widest hover:underline mt-1">
                Definir ahora
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}