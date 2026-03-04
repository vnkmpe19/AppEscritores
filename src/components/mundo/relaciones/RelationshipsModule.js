"use client";

import React, { useState, useRef } from 'react';
import { 
  Network, Users, Plus, Edit, Trash2, Crown, Sparkles, Gem, 
  ZoomIn, X, Cog, FileText, ChevronRight, Bell, ChevronDown, User, Activity, Image as ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- DATOS INICIALES ---
const INITIAL_FACTIONS = [
  { id: '1', name: 'La Corona', type: 'DOMINANTE', power: 'Supremo', leader: 'Rey Alaric III', objective: 'Control absoluto', desc: 'Linaje antiguo.', icon: <Crown size={20} />, image: '', color: '#FFB7C5', pos: { x: 50, y: 30 } },
  { id: '2', name: 'Rebeldes', type: 'INSURGENTES', power: 'Creciente', leader: 'Valeria la Feroz', objective: 'Derrocar la tiranía', desc: 'Luchadores de libertad.', icon: <Sparkles size={20} />, image: '', color: '#FF5C5C', pos: { x: 30, y: 70 } },
  { id: '3', name: 'Gremio', type: 'COMERCIAL', power: 'Económico', leader: 'Elena Vance', objective: 'Maximizar beneficios', desc: 'Ruta comercial.', icon: <Gem size={20} />, image: '', color: '#E8F5A2', pos: { x: 70, y: 70 } },
];

const INITIAL_TYPES = [
  { id: 'open_war', label: 'Guerra Abierta', color: '#FF5C5C', dashed: true },
  { id: 'trade_alliance', label: 'Alianza Comercial', color: '#4ADE80', dashed: false },
  { id: 'spiritual_pact', label: 'Pacto Espiritual', color: '#D4C1EC', dashed: false },
  { id: 'neutral_tension', label: 'Tensión Neutral', color: '#94A3B8', dashed: true },
];

const INITIAL_RELATIONS = [
  { from: '1', to: '2', typeId: 'open_war' },
  { from: '1', to: '3', typeId: 'trade_alliance' },
  { from: '2', to: '3', typeId: 'neutral_tension' },
];

export default function RelationshipsModule() {
  const [factions, setFactions] = useState(INITIAL_FACTIONS);
  const [relTypes, setRelTypes] = useState(INITIAL_TYPES);
  const [relations, setRelations] = useState(INITIAL_RELATIONS);
  
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState('map'); 
  const [selectedFaction, setSelectedFaction] = useState(null);
  
  // Estado para el Zoom del Mapa
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add_faction'); 
  const [editingItem, setEditingItem] = useState(null);

  // Formularios
  const [formFaccion, setFormFaccion] = useState({ name: '', type: '', power: '', leader: '', objective: '', image: '', color: '#FFB7C5' });
  const [formRelacion, setFormRelacion] = useState({ fromId: '', toId: '', typeId: '' });
  const [formTipo, setFormTipo] = useState({ label: '', color: '#94A3B8', dashed: false });

  // Controles de Arrastre
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // --- FUNCIONES CRUD ---

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);

    if (type === 'edit_faction' && item) {
      setFormFaccion({ ...item });
    } else {
      setFormFaccion({ name: '', type: '', power: '', leader: '', objective: '', image: '', color: '#FFB7C5' });
      setFormRelacion({ fromId: '', toId: '', typeId: relTypes[0]?.id || '' });
      setFormTipo({ label: '', color: '#94A3B8', dashed: false });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormFaccion({ ...formFaccion, image: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    if (modalType === 'add_faction' || modalType === 'edit_faction') {
      if (!formFaccion.name) return alert("El nombre es obligatorio");
      if (modalType === 'edit_faction') {
        setFactions(factions.map(f => f.id === editingItem.id ? { ...f, ...formFaccion, icon: <Crown size={20}/> } : f));
        if (selectedFaction?.id === editingItem.id) setSelectedFaction({ ...selectedFaction, ...formFaccion, icon: <Crown size={20}/> });
      } else {
        const newFact = { id: crypto.randomUUID(), ...formFaccion, icon: <Crown size={20}/>, pos: { x: 50, y: 50 } };
        setFactions([...factions, newFact]);
      }
    } else if (modalType === 'add_relation') {
      if (!formRelacion.fromId || !formRelacion.toId || !formRelacion.typeId) return alert("Completa todos los campos");
      if (formRelacion.fromId === formRelacion.toId) return alert("No puedes enlazar la misma facción.");
      setRelations([...relations, { ...formRelacion }]);
    } else if (modalType === 'add_type') {
      if (!formTipo.label) return alert("La etiqueta es obligatoria");
      setRelTypes([...relTypes, { id: crypto.randomUUID(), ...formTipo }]);
    }
    setShowModal(false);
  };

  const handleDeleteFaction = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta facción?")) {
      setFactions(factions.filter(f => f.id !== id));
      setRelations(relations.filter(r => r.from !== id && r.to !== id));
      if (selectedFaction?.id === id) setSelectedFaction(null);
    }
  };

  const handleDeleteRelation = (idx) => {
    if (window.confirm("¿Eliminar esta relación?")) setRelations(relations.filter((_, i) => i !== idx));
  };

  const handleDeleteType = (id) => {
    if (window.confirm("¿Eliminar este tipo de relación?")) setRelTypes(relTypes.filter(t => t.id !== id));
  };

  // --- DRAG & DROP MAPA ---

  const handleDragStart = (e, faction) => {
    if (isZoomed) return; // Evitar conflictos de arrastre cuando hay zoom activo
    setDraggingNode(faction);
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left - rect.width / 2, y: e.clientY - rect.top - rect.height / 2 });
    e.stopPropagation();
  };

  const handleDragMove = (e) => {
    if (!draggingNode || !mapRef.current || isZoomed) return;
    const mapRect = mapRef.current.getBoundingClientRect();
    const newX = ((e.clientX - mapRect.left - offset.x) / mapRect.width) * 100;
    const newY = ((e.clientY - mapRect.top - offset.y) / mapRect.height) * 100;
    
    const clampedX = Math.max(5, Math.min(95, newX));
    const clampedY = Math.max(10, Math.min(90, newY));
    
    setFactions(factions.map(f => f.id === draggingNode.id ? { ...f, pos: { x: clampedX, y: clampedY } } : f));
  };

  const handleDragEnd = () => setDraggingNode(null);

  // --- INTERFAZ ---

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#BFD7ED]/20 blur-3xl rounded-full" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#BFD7ED]/50 text-slate-800 rounded-2xl shadow-inner"><Network size={32} /></div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Red de Relaciones</h2>
            <p className="text-slate-400 text-lg mt-1 max-w-2xl">Visualización estratégica de facciones, alianzas y conflictos.</p>
          </div>
        </div>
        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner relative z-10">
          <TabBtn label="Mapa Visual" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
          <TabBtn label="Facciones" active={activeTab === 'factions'} onClick={() => setActiveTab('factions')} />
          <TabBtn label="Tipos de Relación" active={activeTab === 'types'} onClick={() => setActiveTab('types')} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* ÁREA DEL MAPA VISUAL */}
        <div className={`xl:col-span-8 ${activeTab === 'map' ? 'block' : 'hidden'}`}>
          <div className="bg-white border-2 border-slate-100 rounded-[40px] shadow-xl p-6 h-[650px] relative overflow-hidden flex flex-col">
            
            {/* Controles Flotantes del Mapa */}
            <div className="flex justify-between items-center z-20 mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal('add_faction')} className="px-4 py-2 bg-[#D4C1EC] text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-all"><Plus size={14} /> Añadir Facción</button>
                <button onClick={() => handleOpenModal('add_relation')} className="px-4 py-2 bg-slate-800 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-all"><Network size={14} /> Nueva Relación</button>
              </div>
              <div className="flex gap-2">
                {/* Botón de Zoom Único */}
                <button 
                  onClick={() => setIsZoomed(!isZoomed)} 
                  className={`p-2.5 rounded-full border transition-all ${isZoomed ? 'bg-[#FF5C5C] text-white border-[#FF5C5C] shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'}`}
                >
                  <ZoomIn size={18}/>
                </button>
              </div>
            </div>

            {/* Contenedor del Mapa interactivo */}
            <div 
              ref={mapRef} 
              onMouseMove={handleDragMove} 
              onMouseUp={handleDragEnd} 
              onMouseLeave={handleDragEnd} 
              className={`flex-1 relative rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 overflow-auto transition-all ${isZoomed ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <motion.div 
                className="w-full h-full relative"
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ transformOrigin: 'center center' }}
              >
                {/* Líneas SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <AnimatePresence>
                    {relations.map((rel, idx) => {
                      const fromFact = factions.find(f => f.id === rel.from);
                      const toFact = factions.find(f => f.id === rel.to);
                      const relType = relTypes.find(t => t.id === rel.typeId);
                      if (!fromFact || !toFact || !relType) return null;
                      
                      const midX = (fromFact.pos.x + toFact.pos.x) / 2;
                      const midY = (fromFact.pos.y + toFact.pos.y) / 2;
                      
                      return (
                        <g key={idx}>
                          <line 
                            x1={`${fromFact.pos.x}%`} y1={`${fromFact.pos.y}%`} 
                            x2={`${toFact.pos.x}%`} y2={`${toFact.pos.y}%`} 
                            stroke={relType.color} strokeWidth="3" 
                            strokeDasharray={relType.dashed ? "8,8" : "0"} 
                            className="opacity-40" 
                          />
                          <foreignObject x={`${midX}%`} y={`${midY}%`} width="100" height="20" className="overflow-visible" style={{ transform: `translate(-50px, -10px)` }}>
                            <div className="w-full flex justify-center text-center">
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-900 bg-white/70 backdrop-blur-sm border border-slate-100">{relType.label}</span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </AnimatePresence>
                </svg>

                {/* Nodos de Facción (Burbujas) */}
                {factions.map((f) => (
                  <motion.div 
                    key={f.id} layout 
                    style={{ left: `${f.pos.x}%`, top: `${f.pos.y}%` }} 
                    whileHover={!isZoomed ? { scale: 1.1 } : {}} 
                    onMouseDown={(e) => handleDragStart(e, f)}
                    onClick={() => setSelectedFaction(f)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className={`w-20 h-20 rounded-full ${f.id === selectedFaction?.id ? 'border-4 border-[#9BC5E6] scale-105 shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'border-4 border-white'} shadow-xl flex items-center justify-center text-slate-800 relative bg-cover bg-center overflow-hidden`} style={{ backgroundColor: f.color, backgroundImage: f.image ? `url(${f.image})` : 'none' }}>
                      {/* Si hay imagen se oculta el ícono, si no, se muestra el ícono genérico */}
                      {!f.image && f.icon}
                      
                      {/* Etiqueta de Tipo */}
                      <div className="absolute -bottom-1 bg-white px-2 py-0.5 rounded-full shadow-md border border-slate-100 z-20">
                        <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">{f.type}</span>
                      </div>
                    </div>
                    <span className="font-black text-slate-800 text-xs bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm whitespace-nowrap">{f.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* LISTA DE FACCLONES */}
        <div className={`xl:col-span-8 ${activeTab === 'factions' ? 'block' : 'hidden'} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factions.map(f => (
              <div key={f.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-5 relative group hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-full flex flex-shrink-0 items-center justify-center text-slate-900 shadow-inner bg-cover bg-center border-2 border-slate-100" style={{ backgroundColor: f.color, backgroundImage: f.image ? `url(${f.image})` : 'none' }}>
                  {!f.image && f.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-slate-900">{f.name}</h4>
                  <p className="text-xs text-[#FF5C5C] font-black uppercase tracking-widest mt-1">Poder: {f.power}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal('edit_faction', f)} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-full transition-all"><Edit size={16}/></button>
                  <button onClick={() => handleDeleteFaction(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ÁREA DE TIPOS DE RELACIÓN (Lista) */}
        <div className={`xl:col-span-8 ${activeTab === 'types' ? 'block' : 'hidden'} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relTypes.map(t => (
              <div key={t.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex items-center gap-4 relative group hover:shadow-lg transition-all">
                <div className="w-12 h-1 flex items-center rounded-full" style={{ borderBottom: t.dashed ? `3px dashed ${t.color}` : `3px solid ${t.color}`, height: t.dashed ? '0' : '3px' }} />
                <h4 className="font-black text-lg text-slate-900 flex-1">{t.label}</h4>
                <button onClick={() => handleDeleteType(t.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* --- SIDEBAR LATERAL DERECHO (Detalles + Leyenda) --- */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Detalles de Facción Seleccionada */}
          <AnimatePresence mode="wait">
            {selectedFaction ? (
              <motion.div key={selectedFaction.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 relative">
                <button onClick={() => setSelectedFaction(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 bg-slate-50 p-1.5 rounded-full"><X size={16}/></button>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-slate-800 shadow-inner bg-cover bg-center" style={{ backgroundColor: selectedFaction.color, backgroundImage: selectedFaction.image ? `url(${selectedFaction.image})` : 'none' }}>
                    {!selectedFaction.image && selectedFaction.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedFaction.name}</h3>
                    <p className="text-[#FF5C5C] font-black text-[10px] uppercase tracking-widest mt-1">Poder: {selectedFaction.power} • {selectedFaction.type}</p>
                  </div>
                </div>

                <div className="space-y-6 text-sm">
                  <DetailItem label="Líder" value={selectedFaction.leader} icon={<User size={18} />} />
                  <DetailItem label="Objetivo Principal" value={selectedFaction.objective} icon={<Sparkles size={18} />} italic />
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relaciones Activas</p>
                    {relations.filter(r => r.from === selectedFaction.id || r.to === selectedFaction.id).map((rel, idx) => {
                      const otherFact = factions.find(f => f.id === (rel.from === selectedFaction.id ? rel.to : rel.from));
                      const type = relTypes.find(t => t.id === rel.typeId);
                      if (!otherFact || !type) return null;
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl text-xs group border border-slate-100">
                          <span className="font-bold text-slate-800">{otherFact.name}</span>
                          <span className="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest bg-white shadow-sm" style={{ borderLeft: `4px solid ${type.color}`, color: type.color }}>{type.label}</span>
                          <button onClick={() => handleDeleteRelation(relations.indexOf(rel))} className="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-red-300 hover:text-red-500 bg-white rounded-full"><Trash2 size={12}/></button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => handleOpenModal('edit_faction', selectedFaction)} className="flex-1 py-4 bg-[#BFD7ED] hover:bg-[#a6c8e6] text-slate-800 font-black rounded-2xl transition-all flex items-center justify-center gap-2"><Edit size={16} /> Editar</button>
                  <button onClick={() => handleDeleteFaction(selectedFaction.id)} className="w-14 py-4 bg-red-50 hover:bg-red-100 text-red-500 font-black rounded-2xl transition-all flex items-center justify-center"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/80 border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
                <div className="p-5 bg-white rounded-full shadow-sm mb-4 text-slate-300"><Users size={32} /></div>
                <p className="text-slate-400 font-bold max-w-[200px] leading-relaxed">Selecciona una facción en el mapa para ver sus detalles.</p>
              </div>
            )}
          </AnimatePresence>

          {/* LEYENDA (Muda a la barra lateral) */}
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Cog size={14} className="text-[#FFB7C5]" /> Leyenda / Tipos
              </h4>
              <button onClick={() => handleOpenModal('add_type')} className="text-[#FF5C5C] hover:text-red-600 bg-[#FF5C5C]/10 p-1.5 rounded-full transition-colors"><Plus size={14}/></button>
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              {relTypes.map(t => (
                <LegendItem key={t.id} type={t} onDelete={() => handleDeleteType(t.id)}/>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL UNIFICADO (Crear/Editar) --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
              <div className="p-8 overflow-y-auto space-y-6">
                
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    {modalType === 'add_faction' && <><Plus className="text-[#4ADE80]" /> Nueva Facción</>}
                    {modalType === 'edit_faction' && <><Edit className="text-[#BFD7ED]" /> Editar Facción</>}
                    {modalType === 'add_relation' && <><Network className="text-[#FFB7C5]" /> Nueva Relación</>}
                    {modalType === 'add_type' && <><Cog className="text-[#D4C1EC]" /> Nuevo Tipo de Relación</>}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={20} /></button>
                </div>

                {/* FORMULARIO: FACCIONES (Con subida de imagen) */}
                {(modalType === 'add_faction' || modalType === 'edit_faction') && (
                  <div className="space-y-5">
                    <FormInput label="Nombre de la Facción" value={formFaccion.name} onChange={(v) => setFormFaccion({ ...formFaccion, name: v })} placeholder="Ej. La Legión..." />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Tipo" value={formFaccion.type} onChange={(v) => setFormFaccion({ ...formFaccion, type: v })} placeholder="Ej. Militar, Gremio..." />
                      <FormInput label="Nivel de Poder" value={formFaccion.power} onChange={(v) => setFormFaccion({ ...formFaccion, power: v })} placeholder="Ej. Supremo, Bajo..." />
                    </div>
                    <FormInput label="Líder Principal" value={formFaccion.leader} onChange={(v) => setFormFaccion({ ...formFaccion, leader: v })} placeholder="Ej. Gran Maestro..." />
                    <FormTextArea label="Objetivo / Motivación" value={formFaccion.objective} onChange={(v) => setFormFaccion({ ...formFaccion, objective: v })} placeholder="Describe su propósito principal..." />
                    
                    {/* Campo de Imagen (URL o Archivo) */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Imagen / Emblema</label>
                      <div className="flex gap-2">
                        <input type="text" value={formFaccion.image} onChange={(e) => setFormFaccion({ ...formFaccion, image: e.target.value })} placeholder="Pega URL o sube archivo..." className="flex-1 bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] font-medium text-sm" />
                        <label className="bg-slate-100 p-4 rounded-2xl text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center">
                          <ImageIcon size={20} />
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Color Temático</label>
                      <input type="color" value={formFaccion.color} onChange={(e) => setFormFaccion({ ...formFaccion, color: e.target.value })} className="w-16 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-100" />
                    </div>
                  </div>
                )}

                {/* FORMULARIO: RELACIONES */}
                {modalType === 'add_relation' && (
                  <div className="space-y-5">
                    <FormSelect label="Facción de Origen" value={formRelacion.fromId} onChange={(v) => setFormRelacion({ ...formRelacion, fromId: v })} options={factions.map(f => ({ value: f.id, label: f.name }))} />
                    <FormSelect label="Facción Destino" value={formRelacion.toId} onChange={(v) => setFormRelacion({ ...formRelacion, toId: v })} options={factions.map(f => ({ value: f.id, label: f.name }))} />
                    <FormSelect label="Naturaleza de la Relación" value={formRelacion.typeId} onChange={(v) => setFormRelacion({ ...formRelacion, typeId: v })} options={relTypes.map(t => ({ value: t.id, label: t.label }))} />
                  </div>
                )}

                {/* FORMULARIO: TIPOS DE RELACIÓN */}
                {modalType === 'add_type' && (
                  <div className="space-y-5">
                    <FormInput label="Nombre del Tipo" value={formTipo.label} onChange={(v) => setFormTipo({ ...formTipo, label: v })} placeholder="Ej. Pacto de No Agresión..." />
                    <div className="flex gap-6 items-center">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Color de Línea</label>
                        <input type="color" value={formTipo.color} onChange={(e) => setFormTipo({ ...formTipo, color: e.target.value })} className="w-16 h-12 rounded-xl cursor-pointer bg-slate-50 border border-slate-100" />
                      </div>
                      <div className="flex-1 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <input type="checkbox" checked={formTipo.dashed} onChange={(e) => setFormTipo({ ...formTipo, dashed: e.target.checked })} className="w-5 h-5 accent-[#FFB7C5] cursor-pointer" />
                        <span className="text-sm font-bold text-slate-700">Línea Punteada (Tensiones)</span>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={handleSave} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-4 shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  Guardar Información
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

// --- SUB-COMPONENTES UI ---

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${active ? 'bg-white shadow-sm border border-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
      {label}
    </button>
  );
}

function LegendItem({ type, onDelete }) {
  return (
    <div className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-8 flex items-center">
          <div className="w-full h-1 flex items-center rounded-full" style={{ borderBottom: type.dashed ? `3px dashed ${type.color}` : `3px solid ${type.color}`, height: type.dashed ? '0' : '3px' }} />
        </div>
        <span className="text-xs font-bold text-slate-700">{type.label}</span>
      </div>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-red-300 hover:text-white hover:bg-red-500 rounded-full bg-white shadow-sm"><Trash2 size={12}/></button>
    </div>
  );
}

function DetailItem({ label, value, icon, italic }) {
  return (
    <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="mt-1 text-[#BFD7ED] bg-white p-2 rounded-xl shadow-sm h-fit">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`font-medium leading-relaxed ${italic ? 'italic text-slate-500' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );
}

// FORM HELPERS

function FormInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] font-bold text-sm" />
    </div>
  );
}

function FormTextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] min-h-[100px] resize-none text-sm leading-relaxed font-medium" />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] font-bold text-sm appearance-none cursor-pointer">
          <option value="" disabled>Selecciona una opción...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}