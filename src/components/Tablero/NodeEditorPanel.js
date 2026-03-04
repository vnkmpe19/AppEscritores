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
    <div className="w-80 bg-white rounded-[40px] shadow-xl border border-slate-100 flex flex-col max-h-[calc(100vh-200px)] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Editar nodo</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 overflow-y-auto flex-1 space-y-5">
        <div>
          <h4 className="font-bold text-sm text-slate-800 mb-1">
            {node.data?.label || node.data?.title}
          </h4>
          {node.data?.creadoEn && (
            <p className="text-[10px] text-slate-400">
              Creado: {formatFecha(node.data.creadoEn)}
            </p>
          )}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
            Estado
          </p>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
          >
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
            <Tag size={12} />
            Marcadores
          </p>
          <div className="flex flex-wrap gap-2">
            {MARCADORES.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMarcador(m.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                  marcadores.includes(m.id)
                    ? "bg-[#FF5C5C] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
            <Layers size={12} />
            Capas narrativas
          </p>
          <div className="flex flex-wrap gap-2">
            {CAPAS.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCapa(c.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                  capas.includes(c.id)
                    ? "bg-[#7BA3C9] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2">
            Emoción predominante
          </p>
          <select
            value={emocion || ""}
            onChange={handleEmocionChange}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
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
          <div>
            <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
              <History size={12} />
              Historial
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {node.data.historial.map((h, i) => (
                <div
                  key={i}
                  className="text-[11px] text-slate-600 py-1.5 px-3 rounded-xl bg-slate-50"
                >
                  <span className="font-bold">{h.accion}</span>
                  {h.valor && <span> → {h.valor}</span>}
                  <span className="text-slate-400 ml-2">
                    {formatFecha(h.fecha)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
