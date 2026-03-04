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
    <div className="w-72 bg-[#FEF9E7] rounded-[40px] p-6 flex flex-col gap-6 border border-amber-100 shadow-sm overflow-y-auto max-h-[calc(100vh-200px)]">
      <h3 className="font-black text-lg text-orange-800 flex items-center gap-2">
        <Filter size={20} />
        Filtros y vista
      </h3>

      {/* Tipo */}
      <div>
        <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2">
          Tipo de nodo
        </p>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id ?? "all"}
                onClick={() => setFiltroTipo(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                  filtroTipo === t.id
                    ? "bg-[#FF5C5C] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-amber-50 border border-amber-100"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado */}
      <div>
        <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2">
          Estado
        </p>
        <select
          value={filtroEstado || ""}
          onChange={(e) => setFiltroEstado(e.target.value || null)}
          className="w-full px-4 py-2.5 rounded-2xl border border-amber-100 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Emoción */}
      <div>
        <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2">
          Emoción
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOCIONES.map((e) => (
            <button
              key={e.id}
              onClick={() =>
                setFiltroEmocion(filtroEmocion === e.id ? null : e.id)
              }
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border-2 ${
                filtroEmocion === e.id
                  ? "border-slate-600"
                  : "border-transparent hover:border-amber-200"
              }`}
              style={{ backgroundColor: e.color }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Capas narrativas */}
      <div>
        <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
          <Layers size={12} />
          Capa narrativa
        </p>
        <select
          value={capaActiva || "todas"}
          onChange={(e) => setCapaActiva(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl border border-amber-100 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-200"
        >
          {CAPAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Estilo de conexiones */}
      <div>
        <p className="text-[10px] font-bold uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1">
          <Link2 size={12} />
          Estilo de línea
        </p>
        <div className="flex gap-2">
          {["continua", "punteada", "fragmentada"].map((s) => (
            <button
              key={s}
              onClick={() => setEdgeStyle(s)}
              className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold capitalize ${
                edgeStyle === s
                  ? "bg-[#7BA3C9] text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Palette size={14} className="text-slate-500" />
          <input
            type="color"
            value={edgeColor}
            onChange={(e) => setEdgeColor(e.target.value)}
            className="w-10 h-8 rounded-lg cursor-pointer border border-slate-200"
          />
          <span className="text-xs font-bold text-slate-600">{edgeColor}</span>
        </div>
      </div>

      {/* Modo emoción */}
      <button
        onClick={() => setModoEmocion(!modoEmocion)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
          modoEmocion
            ? "bg-violet-100 text-violet-800 border-2 border-violet-200"
            : "bg-white text-slate-600 border border-amber-100 hover:bg-amber-50"
        }`}
      >
        {modoEmocion ? <Palette size={18} /> : <Eye size={18} />}
        {modoEmocion ? "Modo emoción activo" : "Colorear por emoción"}
      </button>

      {/* Archivadas */}
      <button
        onClick={() => setMostrarArchivadas(!mostrarArchivadas)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
          mostrarArchivadas
            ? "bg-slate-100 text-slate-600 border-2 border-slate-200"
            : "bg-white text-slate-600 border border-amber-100 hover:bg-amber-50"
        }`}
      >
        {mostrarArchivadas ? <Eye size={18} /> : <EyeOff size={18} />}
        {mostrarArchivadas ? "Mostrando archivadas" : "Ocultar archivadas"}
      </button>

      {/* Sugerir conexiones */}
      {onSugerirConexiones && (
        <button
          onClick={() => {
            const n = onSugerirConexiones();
            if (n > 0) alert(`Se crearon ${n} nueva(s) conexión(es) entre ideas con marcadores similares.`);
            else alert("No hay nodos con marcadores comunes para conectar.");
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors border border-rose-200"
        >
          <Link2 size={18} />
          Sugerir conexiones
        </button>
      )}

      {/* Ver timeline */}
      <button
        onClick={onVerTimeline}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm bg-[#BFD7ED] text-slate-800 hover:bg-[#9BC4E2] transition-colors border border-blue-200"
      >
        <Clock size={18} />
        Ver en línea temporal
      </button>

      {/* Alertas */}
      {(nodosAislados?.length > 0 || nodosSinImpacto?.length > 0) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-black uppercase text-amber-800 mb-2 flex items-center gap-1">
            <AlertCircle size={14} />
            Alertas
          </p>
          {nodosAislados?.length > 0 && (
            <p className="text-[11px] text-amber-800 mb-1">
              {nodosAislados.length} ocurrencia(s) sin conexión
            </p>
          )}
          {nodosSinImpacto?.length > 0 && (
            <p className="text-[11px] text-amber-800">
              {nodosSinImpacto.length} personaje(s) sin impacto en conflicto
            </p>
          )}
        </div>
      )}
    </div>
  );
}
