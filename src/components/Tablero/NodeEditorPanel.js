"use client";

import React, { useState } from "react";
import { X, History, Tag, Layers } from "lucide-react";

const ESTADOS = [
  { id: "cruda", label: "Idea cruda" },
  { id: "evaluacion", label: "En evaluación" },
  { id: "potencial", label: "Potencial fuerte" },
  { id: "experimento", label: "En experimento" },
  { id: "archivada", label: "Archivada" },
];

const MARCADORES = [
  { id: "obsesion", label: "Obsesión" },
  { id: "dolor", label: "Dolor" },
  { id: "potencial", label: "Potencial" },
];

const CAPAS = [
  { id: "politica", label: "Política" },
  { id: "romance", label: "Romance" },
  { id: "psicologia", label: "Psicología" },
  { id: "misterio", label: "Misterio" },
];

const EMOCIONES = [
  { id: "alegria", label: "Alegría" },
  { id: "tristeza", label: "Tristeza" },
  { id: "tension", label: "Tensión" },
  { id: "misterio", label: "Misterio" },
  { id: "esperanza", label: "Esperanza" },
];

export default function NodeEditorPanel({ node, onClose, onUpdate }) {
  const [estado, setEstado] = useState(node?.data?.estado || "cruda");
  const [marcadores, setMarcadores] = useState(node?.data?.marcadores || []);
  const [capas, setCapas] = useState(node?.data?.capas || []);
  const [emocion, setEmocion] = useState(node?.data?.emocion || null);

  const toggleMarcador = (id) => {
    const next = marcadores.includes(id)
      ? marcadores.filter((m) => m !== id)
      : [...marcadores, id];
    setMarcadores(next);
    onUpdate?.(node.id, { marcadores: next });
  };

  const toggleCapa = (id) => {
    const next = capas.includes(id)
      ? capas.filter((c) => c !== id)
      : [...capas, id];
    setCapas(next);
    onUpdate?.(node.id, { capas: next });
  };

  const handleEstadoChange = (e) => {
    const v = e.target.value;
    setEstado(v);
    onUpdate?.(node.id, {
      estado: v,
      archivada: v === "archivada",
      historial: [
        ...(node.data?.historial || []),
        { accion: "cambio_estado", valor: v, fecha: new Date().toISOString() },
      ],
    });
  };

  const handleEmocionChange = (e) => {
    const v = e.target.value || null;
    setEmocion(v);
    onUpdate?.(node.id, { emocion: v });
  };

  const formatFecha = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("es", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (_) {
      return iso;
    }
  };

  if (!node) return null;

  return (
    <div className="w-full sm:w-80 bg-white rounded-t-[30px] sm:rounded-[40px] shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] sm:max-h-[calc(100vh-200px)] overflow-hidden transition-all duration-300">
      
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
        <h3 className="font-black text-slate-800 text-sm md:text-base uppercase tracking-tight">Editar nodo</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Contenido scrolleable */}
      <div className="p-5 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
        
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <h4 className="font-black text-sm md:text-base text-slate-800 mb-1 leading-tight">
            {node.data?.label || node.data?.title}
          </h4>
          {node.data?.creadoEn && (
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400">
              Creado: {formatFecha(node.data.creadoEn)}
            </p>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-1">
            Estado
          </p>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
          >
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-2">
            <Tag size={12} />
            Marcadores
          </p>
          <div className="flex flex-wrap gap-2">
            {MARCADORES.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMarcador(m.id)}
                className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all active:scale-95 ${
                  marcadores.includes(m.id)
                    ? "bg-[#FF5C5C] text-white shadow-md shadow-[#FF5C5C]/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-[#7BA3C9] tracking-widest mb-3 flex items-center gap-2">
            <Layers size={12} />
            Capas narrativas
          </p>
          <div className="flex flex-wrap gap-2">
            {CAPAS.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCapa(c.id)}
                className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black transition-all active:scale-95 ${
                  capas.includes(c.id)
                    ? "bg-[#7BA3C9] text-white shadow-md shadow-[#7BA3C9]/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
            Emoción predominante
          </p>
          <select
            value={emocion || ""}
            onChange={handleEmocionChange}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
          >
            <option value="">Ninguna</option>
            {EMOCIONES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {node.data?.historial?.length > 0 && (
          <div className="pb-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1">
              <History size={12} />
              Historial
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {node.data.historial.map((h, i) => (
                <div
                  key={i}
                  className="text-[10px] md:text-[11px] text-slate-600 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-black text-slate-700 uppercase tracking-tighter">{h.accion.replace('_', ' ')}</span>
                    <span className="text-slate-300 font-bold whitespace-nowrap">
                      {formatFecha(h.fecha)}
                    </span>
                  </div>
                  {h.valor && <div className="text-slate-400 mt-1 font-medium">Nuevo valor: <span className="text-orange-400 font-bold">{h.valor}</span></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}