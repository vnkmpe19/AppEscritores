"use client";

import React from "react";
import {
  Lightbulb,
  User,
  Film,
  Zap,
  Filter,
  Clock,
  Layers,
  AlertCircle,
  Eye,
  EyeOff,
  Link2,
  Palette,
} from "lucide-react";

const TIPOS = [
  { id: null, label: "Todos", icon: Filter },
  { id: "ocurrencia", label: "Ocurrencias", icon: Lightbulb },
  { id: "personaje", label: "Personajes", icon: User },
  { id: "escena", label: "Escenas", icon: Film },
  { id: "hecho", label: "Hechos", icon: Zap },
];

const ESTADOS = [
  { id: "cruda", label: "Idea cruda" },
  { id: "evaluacion", label: "En evaluación" },
  { id: "potencial", label: "Potencial fuerte" },
  { id: "experimento", label: "En experimento" },
  { id: "archivada", label: "Archivada" },
];

const EMOCIONES = [
  { id: "alegria", label: "Alegría", color: "#FDE68A" },
  { id: "tristeza", label: "Tristeza", color: "#BFDBFE" },
  { id: "tension", label: "Tensión", color: "#FECACA" },
  { id: "misterio", label: "Misterio", color: "#DDD6FE" },
  { id: "esperanza", label: "Esperanza", color: "#BBF7D0" },
];

const CAPAS = [
  { id: "todas", label: "Todas" },
  { id: "politica", label: "Política" },
  { id: "romance", label: "Romance" },
  { id: "psicologia", label: "Psicología" },
  { id: "misterio", label: "Misterio" },
];

export default function TableroPanel({
  filtroTipo,
  setFiltroTipo,
  filtroEmocion,
  setFiltroEmocion,
  filtroEstado,
  setFiltroEstado,
  capaActiva,
  setCapaActiva,
  mostrarArchivadas,
  setMostrarArchivadas,
  modoEmocion,
  setModoEmocion,
  onVerTimeline,
  nodosAislados,
  nodosSinImpacto,
  edgeStyle,
  setEdgeStyle,
  edgeColor,
  setEdgeColor,
  onSugerirConexiones,
}) {
  return (
    <div className="w-full lg:w-72 bg-[#FEF9E7] rounded-[24px] lg:rounded-[40px] p-5 lg:p-6 flex flex-col gap-5 lg:gap-6 border border-amber-100 shadow-sm overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-200px)] custom-scrollbar">
      
      <h3 className="font-black text-base lg:text-lg text-orange-800 flex items-center gap-2 sticky top-0 bg-[#FEF9E7] py-1 z-10">
        <Filter size={20} />
        Filtros y vista
      </h3>

      <div>
        <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-3">
          Tipo de nodo
        </p>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id ?? "all"}
                onClick={() => setFiltroTipo(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black transition-all active:scale-95 ${
                  filtroTipo === t.id
                    ? "bg-[#FF5C5C] text-white shadow-md shadow-[#FF5C5C]/20"
                    : "bg-white text-slate-600 border border-amber-100"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
        <div>
          <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-2">
            Estado
          </p>
          <select
            value={filtroEstado || ""}
            onChange={(e) => setFiltroEstado(e.target.value || null)}
            className="w-full px-4 py-3 rounded-2xl border border-amber-100 bg-white text-xs font-bold text-slate-700 outline-none"
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-2 flex items-center gap-1">
            <Layers size={12} />
            Capa narrativa
          </p>
          <select
            value={capaActiva || "todas"}
            onChange={(e) => setCapaActiva(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-amber-100 bg-white text-xs font-bold text-slate-700 outline-none"
          >
            {CAPAS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-3">
          Emoción
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOCIONES.map((e) => (
            <button
              key={e.id}
              onClick={() => setFiltroEmocion(filtroEmocion === e.id ? null : e.id)}
              className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border-2 active:scale-95 ${
                filtroEmocion === e.id ? "border-slate-800" : "border-transparent"
              }`}
              style={{ backgroundColor: e.color }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/50 p-4 rounded-3xl border border-amber-100">
        <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-1">
          <Link2 size={12} />
          Conexiones
        </p>
        <div className="flex gap-2 mb-3">
          {["continua", "punteada", "fragmentada"].map((s) => (
            <button
              key={s}
              onClick={() => setEdgeStyle(s)}
              className={`flex-1 px-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                edgeStyle === s ? "bg-[#7BA3C9] text-white" : "bg-white text-slate-400 border border-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={edgeColor}
              onChange={(e) => setEdgeColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
            />
            <span className="text-[10px] font-black text-slate-500 uppercase">{edgeColor}</span>
          </div>
          <Palette size={14} className="text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        <button
          onClick={() => setModoEmocion(!modoEmocion)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 ${
            modoEmocion ? "bg-violet-100 text-violet-800 border-2 border-violet-200" : "bg-white text-slate-600 border border-amber-100"
          }`}
        >
          {modoEmocion ? <Palette size={18} /> : <Eye size={18} />}
          {modoEmocion ? "MODO EMOCIÓN ACTIVO" : "COLOREAR POR EMOCIÓN"}
        </button>

        <button
          onClick={() => setMostrarArchivadas(!mostrarArchivadas)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 ${
            mostrarArchivadas ? "bg-slate-200 text-slate-700 border-2 border-slate-300" : "bg-white text-slate-600 border border-amber-100"
          }`}
        >
          {mostrarArchivadas ? <Eye size={18} /> : <EyeOff size={18} />}
          {mostrarArchivadas ? "MOSTRANDO ARCHIVADAS" : "OCULTAR ARCHIVADAS"}
        </button>

        {onSugerirConexiones && (
          <button
            onClick={() => {
              const n = onSugerirConexiones();
              if (n > 0) alert(`Se crearon ${n} nueva(s) conexión(es).`);
              else alert("No hay marcadores comunes para conectar.");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs bg-rose-50 text-rose-700 border border-rose-200 active:scale-95"
          >
            <Link2 size={18} />
            SUGERIR CONEXIONES
          </button>
        )}

        <button
          onClick={onVerTimeline}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs bg-[#BFD7ED] text-slate-800 border border-blue-200 active:scale-95"
        >
          <Clock size={18} />
          VER LÍNEA TEMPORAL
        </button>
      </div>

      {(nodosAislados?.length > 0 || nodosSinImpacto?.length > 0) && (
        <div className="p-4 rounded-[24px] bg-white border-2 border-orange-200 shadow-sm shadow-orange-100/50">
          <p className="text-[10px] font-black uppercase text-orange-600 mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Alertas de Narrativa
          </p>
          <div className="space-y-1">
            {nodosAislados?.length > 0 && (
              <p className="text-[10px] font-bold text-slate-500">• {nodosAislados.length} ideas sueltas</p>
            )}
            {nodosSinImpacto?.length > 0 && (
              <p className="text-[10px] font-bold text-slate-500">• {nodosSinImpacto.length} personajes pasivos</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}