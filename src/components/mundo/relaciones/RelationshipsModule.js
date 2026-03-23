"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Network, Users, Plus, Edit, Trash2, Crown, Sparkles, Gem, ZoomIn, X, Cog, ChevronDown, User, Image as ImageIcon, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/app/lib/supabase';

async function subirImagen(file) {
  const path = `facciones/${crypto.randomUUID()}.${file.name.split('.').pop()}`;
  const { error } = await supabase.storage.from('imagenes').upload(path, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from('imagenes').getPublicUrl(path).data.publicUrl;
}

const iconoPorTipo = (tipo) => {
  const t = tipo?.toLowerCase() || '';
  if (t.includes('comercial') || t.includes('gremio')) return <Gem size={20} />;
  if (t.includes('rebel') || t.includes('insurgent')) return <Sparkles size={20} />;
  return <Crown size={20} />;
};

const lineaEstilo = (t) => ({ borderBottom: `3px ${t.punteada ? 'dashed' : 'solid'} ${t.color}` });

const Label = ({ text }) => (
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{text}</p>
);

const inputCls = "w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] font-bold text-sm";

function FormInput({ label, value, onChange, placeholder }) {
  return <div><Label text={label} /><input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} /></div>;
}

function FormTextArea({ label, value, onChange, placeholder }) {
  return <div><Label text={label} /><textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} min-h-[100px] resize-none leading-relaxed font-medium`} /></div>;
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <Label text={label} />
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className={`${inputCls} appearance-none cursor-pointer`}>
          <option value="" disabled>Selecciona una opción...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Avatar({ foto, color, tipo }) {
  return (
    <div className="w-14 h-14 rounded-full flex shrink-0 items-center justify-center text-slate-800 bg-cover bg-center border-2 border-white shadow-inner"
      style={{ backgroundColor: color || '#FFB7C5', backgroundImage: foto ? `url(${foto})` : 'none' }}>
      {!foto && iconoPorTipo(tipo)}
    </div>
  );
}

function BtnAccion({ onClick, icon, className }) {
  return <button onClick={onClick} className={`p-2 rounded-full transition-all bg-slate-50 text-slate-400 ${className}`}>{icon}</button>;
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
      <AlertCircle size={18} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && <button onClick={onRetry} className="p-1.5 hover:bg-red-100 rounded-full"><RefreshCw size={14} /></button>}
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-white shadow-sm border border-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
      {label}
    </button>
  );
}

const FORM_FACCION_VACIO = { nombre: '', tipo: '', poder: '', lider: '', objetivo: '', descripcion: '', foto: '', color: '#FFB7C5' };

export default function RedDeRelaciones({ proyectoId }) {
  const [factions, setFactions]   = useState([]);
  const [relTypes, setRelTypes]   = useState([]);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);

  const [activeTab, setActiveTab]             = useState('map');
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [isZoomed, setIsZoomed]               = useState(false);

  const [showModal, setShowModal]     = useState(false);
  const [modalType, setModalType]     = useState('add_faction');
  const [editingItem, setEditingItem] = useState(null);

  const [formFaccion, setFormFaccion]   = useState(FORM_FACCION_VACIO);
  const [formRelacion, setFormRelacion] = useState({ id_origen: '', id_destino: '', id_tipo_relacion: '' });
  const [formTipo, setFormTipo]         = useState({ etiqueta: '', color: '#94A3B8', punteada: false });
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const mapRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [dragOff, setDragOff]   = useState({ x: 0, y: 0 });

 const fetchAll = useCallback(async () => {
    if (!proyectoId) return;
    setLoading(true); setError(null);
    try {
      const [{ data: facs, error: e1 }, { data: tipos, error: e2 }, { data: rels, error: e3 }] = await Promise.all([
        supabase.from('facciones').select('*').eq('id_proyecto', proyectoId),
        supabase.from('tipos_relacion').select('*').eq('id_proyecto', proyectoId),
        supabase.from('relaciones_facciones').select('*'),
      ]);
      if (e1) throw e1; if (e2) throw e2; if (e3) throw e3;

      const norm = (facs || []).map((f, i, arr) => ({
        ...f,
        pos: {
          x: f.eje_x || 50 + 35 * Math.cos((2 * Math.PI * i) / Math.max(arr.length, 1)),
          y: f.eje_y || 50 + 30 * Math.sin((2 * Math.PI * i) / Math.max(arr.length, 1)),
        },
      }));
      const ids = new Set(norm.map(f => f.id));
      setFactions(norm);
      setRelTypes(tipos || []);
      setRelations((rels || []).filter(r => ids.has(r.id_origen) && ids.has(r.id_destino)));
    } catch (err) { setError(err.message || 'Error al cargar'); }
    finally { setLoading(false); }
  }, [proyectoId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const guardarPosicion = useCallback((id, x, y) =>
    supabase.from('facciones').update({ eje_x: x, eje_y: y }).eq('id', id), []);

 const abrirModal = (type, item = null) => {
    setModalType(type); setEditingItem(item);
    setImageFile(null); setImagePreview('');
    if (type === 'edit_faction' && item) {
      const { nombre='', tipo='', poder='', lider='', objetivo='', descripcion='', foto='', color='#FFB7C5' } = item;
      setFormFaccion({ nombre, tipo, poder, lider, objetivo, descripcion, foto, color });
      setImagePreview(foto);
    } else {
      setFormFaccion(FORM_FACCION_VACIO);
      setFormRelacion({ id_origen: '', id_destino: '', id_tipo_relacion: relTypes[0]?.id || '' });
      setFormTipo({ etiqueta: '', color: '#94A3B8', punteada: false });
    }
    setShowModal(true);
  };

 const guardar = async () => {
    setSaving(true); setError(null);
    try {
      if (modalType.includes('faction')) {
        if (!formFaccion.nombre) { alert('El nombre es obligatorio'); return; }
        const foto = imageFile ? await subirImagen(imageFile) : formFaccion.foto;
        const payload = { id_proyecto: proyectoId, ...formFaccion, foto };

        if (modalType === 'edit_faction') {
          const { data, error } = await supabase.from('facciones').update(payload).eq('id', editingItem.id).select().single();
          if (error) throw error;
          const updated = { ...data, pos: editingItem.pos };
          setFactions(p => p.map(f => f.id === editingItem.id ? updated : f));
          if (selectedFaction?.id === editingItem.id) setSelectedFaction(updated);
        } else {
          const { data, error } = await supabase.from('facciones').insert({ ...payload, eje_x: 50, eje_y: 50 }).select().single();
          if (error) throw error;
          setFactions(p => [...p, { ...data, pos: { x: 50, y: 50 } }]);
        }

      } else if (modalType === 'add_relation') {
        const { id_origen, id_destino, id_tipo_relacion } = formRelacion;
        if (!id_origen || !id_destino || !id_tipo_relacion) { alert('Completa todos los campos'); return; }
        if (id_origen === id_destino) { alert('No puedes enlazar la misma facción.'); return; }
        const { data, error } = await supabase.from('relaciones_facciones').insert(formRelacion).select().single();
        if (error) throw error;
        setRelations(p => [...p, data]);

      } else if (modalType === 'add_type') {
        if (!formTipo.etiqueta) { alert('La etiqueta es obligatoria'); return; }
        const { data, error } = await supabase.from('tipos_relacion').insert({ ...formTipo, id_proyecto: proyectoId }).select().single();
        if (error) throw error;
        setRelTypes(p => [...p, data]);
      }
      setShowModal(false);
    } catch (err) { setError(err.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

 const eliminarFaccion = async (id) => {
    if (!confirm('¿Eliminar esta facción?')) return;
    const { error } = await supabase.from('facciones').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setFactions(p => p.filter(f => f.id !== id));
    setRelations(p => p.filter(r => r.id_origen !== id && r.id_destino !== id));
    if (selectedFaction?.id === id) setSelectedFaction(null);
  };

  const eliminarRelacion = async (id) => {
    if (!confirm('¿Eliminar esta relación?')) return;
    const { error } = await supabase.from('relaciones_facciones').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setRelations(p => p.filter(r => r.id !== id));
  };

  const eliminarTipo = async (id) => {
    if (!confirm('¿Eliminar este tipo?')) return;
    const { error } = await supabase.from('tipos_relacion').delete().eq('id', id);
    if (error) { setError(error.message); return; }
    setRelTypes(p => p.filter(t => t.id !== id));
  };

 const calcPos = (cx, cy) => {
    if (!mapRef.current) return null;
    const r = mapRef.current.getBoundingClientRect();
    return {
      x: Math.max(5, Math.min(95, ((cx - r.left - dragOff.x) / r.width) * 100)),
      y: Math.max(10, Math.min(90, ((cy - r.top - dragOff.y) / r.height) * 100)),
    };
  };

  const iniciarDrag = (clientX, clientY, rect, f) => {
    setDragging(f);
    setDragOff({ x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 });
  };

  const moverDrag = (cx, cy) => {
    if (!dragging || isZoomed) return;
    const pos = calcPos(cx, cy);
    if (pos) setFactions(p => p.map(f => f.id === dragging.id ? { ...f, pos } : f));
  };

  const terminarDrag = () => {
    if (dragging) {
      const node = factions.find(f => f.id === dragging.id);
      if (node) guardarPosicion(node.id, node.pos.x, node.pos.y);
    }
    setDragging(null);
  };

 if (!proyectoId) return <div className="text-center py-20 text-slate-400 font-bold text-sm">Falta el <code>proyectoId</code>.</div>;
  if (loading) return <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-slate-400"><Loader2 size={40} className="animate-spin text-[#BFD7ED]" /><p className="font-bold text-sm">Cargando…</p></div>;

 const relacionesDeSeleccionada = relations.filter(r => r.id_origen === selectedFaction?.id || r.id_destino === selectedFaction?.id);
  const opcionesFacciones = factions.map(f => ({ value: f.id, label: f.nombre }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-10 pb-20 px-2 sm:px-0">

      {error && <ErrorBanner message={error} onRetry={() => { setError(null); fetchAll(); }} />}

     <div className="flex flex-col gap-5 bg-white p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#BFD7ED]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 sm:p-4 bg-[#BFD7ED]/50 rounded-2xl shadow-inner shrink-0"><Network size={28} /></div>
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">Red de Relaciones</h2>
            <p className="text-slate-400 text-sm sm:text-lg mt-1">Visualización estratégica de facciones, alianzas y conflictos.</p>
          </div>
        </div>
        <div className="relative z-10 overflow-x-auto -mx-1 px-1">
          <div className="flex gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner w-fit min-w-full sm:w-fit">
            {[['map','Mapa Visual'],['factions','Facciones'],['types','Tipos de Relación']].map(([id, label]) => (
              <TabBtn key={id} label={label} active={activeTab === id} onClick={() => setActiveTab(id)} />
            ))}
          </div>
        </div>
      </div>

     {activeTab === 'map' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
         <div className="xl:col-span-8">
            <div className="bg-white border-2 border-slate-100 rounded-[28px] sm:rounded-[40px] shadow-xl p-4 sm:p-6 h-[480px] sm:h-[600px] xl:h-[650px] flex flex-col">
             <div className="flex flex-wrap justify-between items-center mb-4 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-2xl shadow-sm border border-slate-100 gap-2 z-20">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => abrirModal('add_faction')} className="px-3 py-2 sm:px-4 bg-[#D4C1EC] text-white rounded-full font-black text-[10px] sm:text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-all"><Plus size={13} /> Facción</button>
                  <button onClick={() => abrirModal('add_relation')} className="px-3 py-2 sm:px-4 bg-slate-800 text-white rounded-full font-black text-[10px] sm:text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-all"><Network size={13} /> Relación</button>
                </div>
                <button onClick={() => setIsZoomed(!isZoomed)} className={`p-2.5 rounded-full border transition-all ${isZoomed ? 'bg-[#FF5C5C] text-white border-[#FF5C5C]' : 'bg-white text-slate-400 border-slate-200'}`}><ZoomIn size={16} /></button>
              </div>
             <div ref={mapRef}
                onMouseMove={e => moverDrag(e.clientX, e.clientY)} onMouseUp={terminarDrag} onMouseLeave={terminarDrag}
                onTouchMove={e => { moverDrag(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }} onTouchEnd={terminarDrag}
                className="flex-1 relative rounded-[20px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden">
                <motion.div className="w-full h-full relative" animate={{ scale: isZoomed ? 1.45 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  {/* Líneas SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {relations.map(rel => {
                      const from = factions.find(f => f.id === rel.id_origen);
                      const to   = factions.find(f => f.id === rel.id_destino);
                      const tipo = relTypes.find(t => t.id === rel.id_tipo_relacion);
                      if (!from || !to || !tipo) return null;
                      const mx = (from.pos.x + to.pos.x) / 2, my = (from.pos.y + to.pos.y) / 2;
                      return (
                        <g key={rel.id}>
                          <line x1={`${from.pos.x}%`} y1={`${from.pos.y}%`} x2={`${to.pos.x}%`} y2={`${to.pos.y}%`}
                            stroke={tipo.color} strokeWidth="3" strokeDasharray={tipo.punteada ? '8,8' : '0'} className="opacity-40" />
                          <foreignObject x={`${mx}%`} y={`${my}%`} width="110" height="20" className="overflow-visible" style={{ transform: 'translate(-55px,-10px)' }}>
                            <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest text-slate-900 bg-white/80 border border-slate-100 block text-center">{tipo.etiqueta}</span>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </svg>

                 {factions.map(f => (
                    <motion.div key={f.id} layout
                      style={{ left: `${f.pos.x}%`, top: `${f.pos.y}%` }}
                      whileHover={!isZoomed ? { scale: 1.1 } : {}}
                      onMouseDown={e => { iniciarDrag(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect(), f); e.stopPropagation(); }}
                      onTouchStart={e => iniciarDrag(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.getBoundingClientRect(), f)}
                      onClick={() => setSelectedFaction(f)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer select-none touch-none"
                    >
                      <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden relative bg-cover bg-center
                        ${f.id === selectedFaction?.id ? 'border-4 border-[#9BC5E6] shadow-[0_0_20px_rgba(155,197,230,0.6)]' : 'border-4 border-white'} shadow-xl`}
                        style={{ backgroundColor: f.color || '#FFB7C5', backgroundImage: f.foto ? `url(${f.foto})` : 'none' }}>
                        {!f.foto && iconoPorTipo(f.tipo)}
                        <div className="absolute -bottom-1 bg-white px-1.5 py-0.5 rounded-full shadow-md border border-slate-100 z-20">
                          <span className="text-[6px] font-black uppercase tracking-widest text-slate-500">{f.tipo}</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-800 text-[10px] sm:text-xs bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-lg shadow-sm whitespace-nowrap max-w-[100px] truncate">{f.nombre}</span>
                    </motion.div>
                  ))}
                  {factions.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                      <Network size={40} /><p className="font-bold text-sm">Añade facciones para comenzar</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Sidebar de las relaciones */}
          <div className="xl:col-span-4 space-y-5 sm:space-y-6">
            <AnimatePresence mode="wait">
              {selectedFaction ? (
                <motion.div key={selectedFaction.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                  className="bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] shadow-xl border border-slate-100 relative">
                  <button onClick={() => setSelectedFaction(null)} className="absolute top-5 right-5 text-slate-300 hover:text-slate-500 bg-slate-50 p-1.5 rounded-full"><X size={16} /></button>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] flex items-center justify-center overflow-hidden bg-cover bg-center shrink-0 shadow-inner"
                      style={{ backgroundColor: selectedFaction.color || '#FFB7C5', backgroundImage: selectedFaction.foto ? `url(${selectedFaction.foto})` : 'none' }}>
                      {!selectedFaction.foto && iconoPorTipo(selectedFaction.tipo)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 truncate">{selectedFaction.nombre}</h3>
                      <p className="text-[#FF5C5C] font-black text-[10px] uppercase tracking-widest mt-1">Poder: {selectedFaction.poder || '—'} • {selectedFaction.tipo || '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[['Líder', selectedFaction.lider, <User size={16} />, false], ['Objetivo', selectedFaction.objetivo, <Sparkles size={16} />, true]].map(([lbl, val, ico, italic]) => (
                      <div key={lbl} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="mt-1 text-[#BFD7ED] bg-white p-2 rounded-xl shadow-sm h-fit">{ico}</div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lbl}</p>
                          <p className={`font-medium text-sm leading-relaxed ${italic ? 'italic text-slate-500' : 'text-slate-800'}`}>{val || '—'}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-5 border-t border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relaciones Activas</p>
                      {relacionesDeSeleccionada.length === 0 && <p className="text-xs text-slate-400 text-center py-3">Sin relaciones activas</p>}
                      {relacionesDeSeleccionada.map(rel => {
                        const otherId = rel.id_origen === selectedFaction.id ? rel.id_destino : rel.id_origen;
                        const other = factions.find(f => f.id === otherId);
                        const tipo  = relTypes.find(t => t.id === rel.id_tipo_relacion);
                        if (!other || !tipo) return null;
                        return (
                          <div key={rel.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl text-xs group border border-slate-100 gap-2">
                            <span className="font-bold text-slate-800 truncate">{other.nombre}</span>
                            <span className="px-2 py-1 rounded-full font-black text-[9px] uppercase tracking-widest bg-white shadow-sm shrink-0" style={{ borderLeft: `4px solid ${tipo.color}`, color: tipo.color }}>{tipo.etiqueta}</span>
                            <button onClick={() => eliminarRelacion(rel.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-300 hover:text-red-500 bg-white rounded-full shrink-0"><Trash2 size={11} /></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => abrirModal('edit_faction', selectedFaction)} className="flex-1 py-3 bg-[#BFD7ED] hover:bg-[#a6c8e6] text-slate-800 font-black rounded-2xl flex items-center justify-center gap-2 text-sm"><Edit size={15} /> Editar</button>
                    <button onClick={() => eliminarFaccion(selectedFaction.id)} className="w-12 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl flex items-center justify-center"><Trash2 size={16} /></button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-[28px] p-10 text-center flex flex-col items-center justify-center min-h-[280px]">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-slate-300"><Users size={28} /></div>
                  <p className="text-slate-400 font-bold text-sm max-w-[180px] leading-relaxed">Selecciona una facción en el mapa para ver sus detalles.</p>
                </div>
              )}
            </AnimatePresence>

            <div className="bg-white p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Cog size={13} className="text-[#FFB7C5]" /> Leyenda / Tipos</h4>
                <button onClick={() => abrirModal('add_type')} className="text-[#FF5C5C] bg-[#FF5C5C]/10 p-1.5 rounded-full hover:text-red-600"><Plus size={14} /></button>
              </div>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {relTypes.length === 0 && <p className="text-xs text-slate-300 text-center py-4">Sin tipos de relación</p>}
                {relTypes.map(t => (
                  <div key={t.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8" style={lineaEstilo(t)} />
                      <span className="text-xs font-bold text-slate-700">{t.etiqueta}</span>
                    </div>
                    <button onClick={() => eliminarTipo(t.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-red-300 hover:text-white hover:bg-red-500 rounded-full bg-white shadow-sm"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* facciones  */}
      {activeTab === 'factions' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-end">
            <button onClick={() => abrirModal('add_faction')} className="px-5 py-2.5 bg-[#D4C1EC] text-white rounded-full font-black text-xs flex items-center gap-2 shadow hover:scale-105 transition-all"><Plus size={14} /> Nueva Facción</button>
          </div>
          {factions.length === 0 && <p className="text-center py-16 text-slate-400 font-bold text-sm">No hay facciones todavía.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {factions.map(f => (
              <div key={f.id} className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm flex items-center gap-4 hover:shadow-lg transition-all">
                <Avatar foto={f.foto} color={f.color} tipo={f.tipo} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-lg text-slate-900 truncate">{f.nombre}</h4>
                  <p className="text-xs text-[#FF5C5C] font-black uppercase tracking-widest mt-1">Poder: {f.poder || '—'}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <BtnAccion onClick={() => abrirModal('edit_faction', f)} icon={<Edit size={15} />} className="hover:text-blue-500 hover:bg-blue-50" />
                  <BtnAccion onClick={() => eliminarFaccion(f.id)} icon={<Trash2 size={15} />} className="hover:text-red-500 hover:bg-red-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* tipos*/}
      {activeTab === 'types' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-end">
            <button onClick={() => abrirModal('add_type')} className="px-5 py-2.5 bg-slate-800 text-white rounded-full font-black text-xs flex items-center gap-2 shadow hover:scale-105 transition-all"><Plus size={14} /> Nuevo Tipo</button>
          </div>
          {relTypes.length === 0 && <p className="text-center py-16 text-slate-400 font-bold text-sm">No hay tipos de relación todavía.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {relTypes.map(t => (
              <div key={t.id} className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm flex items-center gap-4 hover:shadow-lg transition-all">
                <div className="w-12 shrink-0" style={lineaEstilo(t)} />
                <h4 className="font-black text-base text-slate-900 flex-1 truncate">{t.etiqueta}</h4>
                <BtnAccion onClick={() => eliminarTipo(t.id)} icon={<Trash2 size={15} />} className="hover:text-red-500 hover:bg-red-50 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[92dvh] sm:max-h-[90vh]">
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1.5 rounded-full bg-slate-200" /></div>
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-3">
                    {modalType === 'add_faction'  && <><Plus    className="text-[#4ADE80]" size={20} /> Nueva Facción</>}
                    {modalType === 'edit_faction' && <><Edit    className="text-[#BFD7ED]" size={20} /> Editar Facción</>}
                    {modalType === 'add_relation' && <><Network className="text-[#FFB7C5]" size={20} /> Nueva Relación</>}
                    {modalType === 'add_type'     && <><Cog     className="text-[#D4C1EC]" size={20} /> Nuevo Tipo</>}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                </div>

                {error && <ErrorBanner message={error} onRetry={() => setError(null)} />}

                {/* Formu faccon*/}
                {modalType.includes('faction') && (
                  <div className="space-y-4">
                    <FormInput label="Nombre" value={formFaccion.nombre} onChange={v => setFormFaccion(p => ({ ...p, nombre: v }))} placeholder="Ej. La Legión…" />
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Tipo"  value={formFaccion.tipo}  onChange={v => setFormFaccion(p => ({ ...p, tipo: v }))}  placeholder="Militar…" />
                      <FormInput label="Poder" value={formFaccion.poder} onChange={v => setFormFaccion(p => ({ ...p, poder: v }))} placeholder="Supremo…" />
                    </div>
                    <FormInput label="Líder" value={formFaccion.lider} onChange={v => setFormFaccion(p => ({ ...p, lider: v }))} placeholder="Gran Maestro…" />
                    <FormTextArea label="Objetivo" value={formFaccion.objetivo} onChange={v => setFormFaccion(p => ({ ...p, objetivo: v }))} placeholder="Propósito principal…" />
                    <div>
                      <Label text="Imagen / Emblema" />
                      {imagePreview && (
                        <div className="relative mb-2 w-16 h-16 rounded-2xl overflow-hidden border border-slate-100">
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                          <button onClick={() => { setImageFile(null); setImagePreview(''); setFormFaccion(p => ({ ...p, foto: '' })); }} className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"><X size={10} /></button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={formFaccion.foto}
                          onChange={e => { setFormFaccion(p => ({ ...p, foto: e.target.value })); setImagePreview(e.target.value); setImageFile(null); }}
                          placeholder="URL de imagen…" className={`${inputCls} flex-1`} />
                        <label className="bg-slate-100 p-4 rounded-2xl text-slate-500 cursor-pointer hover:bg-slate-200 flex items-center">
                          <ImageIcon size={18} />
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            const f = e.target.files[0]; if (!f) return;
                            setImageFile(f); setImagePreview(URL.createObjectURL(f)); setFormFaccion(p => ({ ...p, foto: '' }));
                          }} />
                        </label>
                      </div>
                    </div>
                    <div><Label text="Color Temático" /><input type="color" value={formFaccion.color} onChange={e => setFormFaccion(p => ({ ...p, color: e.target.value }))} className="w-16 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-100" /></div>
                  </div>
                )}

                {/* For de relacion */}
                {modalType === 'add_relation' && (
                  <div className="space-y-4">
                    <FormSelect label="Facción de Origen" value={formRelacion.id_origen}        onChange={v => setFormRelacion(p => ({ ...p, id_origen: v }))}        options={opcionesFacciones} />
                    <FormSelect label="Facción Destino"   value={formRelacion.id_destino}       onChange={v => setFormRelacion(p => ({ ...p, id_destino: v }))}       options={opcionesFacciones} />
                    <FormSelect label="Tipo de Relación"  value={formRelacion.id_tipo_relacion} onChange={v => setFormRelacion(p => ({ ...p, id_tipo_relacion: v }))} options={relTypes.map(t => ({ value: t.id, label: t.etiqueta }))} />
                  </div>
                )}

                {/* Form de tipo */}
                {modalType === 'add_type' && (
                  <div className="space-y-4">
                    <FormInput label="Nombre del Tipo" value={formTipo.etiqueta} onChange={v => setFormTipo(p => ({ ...p, etiqueta: v }))} placeholder="Ej. Pacto de No Agresión…" />
                    <div className="flex gap-4 items-center">
                      <div><Label text="Color" /><input type="color" value={formTipo.color} onChange={e => setFormTipo(p => ({ ...p, color: e.target.value }))} className="w-16 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-100" /></div>
                      <label className="flex-1 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 cursor-pointer">
                        <input type="checkbox" checked={formTipo.punteada} onChange={e => setFormTipo(p => ({ ...p, punteada: e.target.checked }))} className="w-5 h-5 accent-[#FFB7C5]" />
                        <span className="text-sm font-bold text-slate-700">Línea Punteada</span>
                      </label>
                    </div>
                  </div>
                )}

                <button onClick={guardar} disabled={saving}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Guardando…' : 'Guardar Información'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}