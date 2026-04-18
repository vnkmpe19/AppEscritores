"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase'; // Ajusta tu ruta
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Plus, Edit, Trash2, Ghost, Utensils, 
  Activity, X, Sparkles
} from 'lucide-react';

export default function CulturesModule({ proyectoId }) {
  // Estados vacíos listos para llenarse con BD
  const [ethnicities, setEthnicities] = useState([]);
  const [rites, setRites] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [beliefs, setBeliefs] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '' });
  const [editingEntity, setEditingEntity] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Estados del formulario
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRegion, setFormRegion] = useState(''); 
  const [formImage, setFormImage] = useState(''); 
  const [formType, setFormType] = useState(''); 

  // Cargar todo al iniciar
  useEffect(() => {
    if (proyectoId) cargarTodo();
  }, [proyectoId]);

  const cargarTodo = async () => {
    const [resCulturas, resRitos, resTradiciones, resCreencias] = await Promise.all([
      supabase.from('culturas').select('*').eq('id_proyecto', proyectoId),
      supabase.from('ritos').select('*').eq('id_proyecto', proyectoId),
      supabase.from('tradiciones').select('*').eq('id_proyecto', proyectoId),
      supabase.from('creencias').select('*').eq('id_proyecto', proyectoId)
    ]);

    if (resCulturas.data) setEthnicities(resCulturas.data);
    if (resRitos.data) setRites(resRitos.data);
    if (resTradiciones.data) setTraditions(resTradiciones.data);
    if (resCreencias.data) setBeliefs(resCreencias.data);
  };

  const openModal = (type, title, entity = null) => {
    setModalConfig({ type, title });
    setEditingEntity(entity);
    
    if (entity) {
      setFormName(entity.nombre || '');
      setFormDesc(entity.descripcion || '');
      setFormRegion(entity.region || '');
      setFormImage(entity.foto || '');
      setFormType(entity.tipo || '');
    } else {
      setFormName(''); setFormDesc(''); setFormRegion(''); setFormImage(''); setFormType('');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName) return alert("El nombre es obligatorio");
    setGuardando(true);

    // Mapeamos el tipo de modal a la tabla correcta de BD
    const configs = {
      ethnicity: { tabla: 'culturas', datos: { nombre: formName, descripcion: formDesc, region: formRegion, foto: formImage } },
      rite: { tabla: 'ritos', datos: { nombre: formName, descripcion: formDesc } },
      tradition: { tabla: 'tradiciones', datos: { nombre: formName, descripcion: formDesc, foto: formImage } },
      belief: { tabla: 'creencias', datos: { nombre: formName, descripcion: formDesc, tipo: formType } }
    };

    const { tabla, datos } = configs[modalConfig.type];
    datos.id_proyecto = proyectoId;

    if (editingEntity) {
      await supabase.from(tabla).update(datos).eq('id', editingEntity.id);
    } else {
      await supabase.from(tabla).insert([datos]);
    }

    setShowModal(false);
    setGuardando(false);
    cargarTodo(); // Refresca las listas
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      const tablas = { ethnicity: 'culturas', rite: 'ritos', tradition: 'tradiciones', belief: 'creencias' };
      await supabase.from(tablas[type]).delete().eq('id', id);
      cargarTodo();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 pb-20">
      
      <div className="bg-white p-5 md:p-7 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4C1EC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <div className="p-2 md:p-3 bg-[#D4C1EC]/50 text-slate-800 rounded-xl shadow-inner">
            <Globe size={24} className="w-6 h-6 md:w-auto md:h-auto" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Cultura</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5 max-w-2xl leading-relaxed">
              Explora las etnias, tradiciones y ritos sagrados de tu mundo.
            </p>
          </div>
        </div>
      </div>

      {/* ETNIAS */}
      <section>
        <div className="flex justify-between items-center mb-8 pr-4">
          <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">Etnias Principales</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {ethnicities.map(eth => (
              <motion.div key={eth.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all flex flex-col">
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  {eth.foto && <img src={eth.foto} alt={eth.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                  {eth.region && <div className="absolute top-4 left-4 bg-[#FFB703] text-slate-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-md">{eth.region}</div>}
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2 z-10">
                    <button onClick={() => openModal('ethnicity', 'Editar Etnia', eth)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-500 hover:scale-110 shadow-lg"><Edit size={16}/></button>
                    <button onClick={() => handleDelete('ethnicity', eth.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 shadow-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-2xl font-black text-slate-800 mb-3">{eth.nombre}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{eth.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={() => openModal('ethnicity', 'Nueva Etnia')} className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-[#FFB703] hover:text-[#FFB703] transition-all min-h-[400px] bg-slate-50/50 group">
            <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><Plus size={32} /></div>
            <span className="font-black uppercase tracking-widest text-sm">Agregar Nueva Etnia</span>
          </button>
        </div>
      </section>

      {/* LOS TIROS Y TRADICIONES*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* RITOS */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Ghost className="text-[#FF5C5C]" size={32} />
            <h3 className="text-2xl font-black text-slate-800">Ritos Funerarios</h3>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {rites.map(rite => (
                <motion.div key={rite.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-md transition-all relative">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                    <button onClick={() => openModal('rite', 'Editar Rito', rite)} className="p-1.5 text-slate-300 hover:text-blue-500"><Edit size={16}/></button>
                    <button onClick={() => handleDelete('rite', rite.id)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-2">{rite.nombre}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed pr-8">{rite.descripcion}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => openModal('rite', 'Nuevo Rito')} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-black uppercase tracking-widest text-xs hover:border-[#FF5C5C] hover:text-[#FF5C5C] transition-all flex items-center justify-center gap-2">
              <Plus size={16}/> Nuevo Rito
            </button>
          </div>
        </section>

        {/* TRADICIONES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Utensils className="text-[#FFB703]" size={32} />
            <h3 className="text-2xl font-black text-slate-800">Tradiciones Culinarias</h3>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {traditions.map(trad => (
                <motion.div key={trad.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex gap-5 group hover:shadow-md transition-all relative">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                    <button onClick={() => openModal('tradition', 'Editar Tradición', trad)} className="p-1.5 text-slate-300 hover:text-blue-500 bg-white rounded-full shadow-sm"><Edit size={14}/></button>
                    <button onClick={() => handleDelete('tradition', trad.id)} className="p-1.5 text-slate-300 hover:text-red-500 bg-white rounded-full shadow-sm"><Trash2 size={14}/></button>
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                    {trad.foto && <img src={trad.foto} alt={trad.nombre} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 pr-8">
                    <h4 className="font-black text-slate-800 text-lg mb-1">{trad.nombre}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{trad.descripcion}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => openModal('tradition', 'Nueva Tradición')} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-black uppercase tracking-widest text-xs hover:border-[#FFB703] hover:text-[#FFB703] transition-all flex items-center justify-center gap-2">
              <Plus size={16}/> Nueva Tradición
            </button>
          </div>
        </section>

      </div>

      {/* CREENCIAS */}
      <section className="pt-6">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-[#FF5C5C]" size={32} />
          <h3 className="text-3xl font-black text-slate-800">Creencias Religiosas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {beliefs.map(belief => (
              <motion.div key={belief.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-md transition-all relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                  <button onClick={() => openModal('belief', 'Editar Creencia', belief)} className="p-1.5 text-slate-300 hover:text-blue-500"><Edit size={16}/></button>
                  <button onClick={() => handleDelete('belief', belief.id)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-1">{belief.nombre}</h4>
                {belief.tipo && <p className="text-[10px] font-black text-[#FFB703] uppercase tracking-widest mb-4">{belief.tipo}</p>}
                <p className="text-sm text-slate-500 leading-relaxed">{belief.descripcion}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          <button onClick={() => openModal('belief', 'Nueva Creencia')} className="border-2 border-dashed border-slate-200 rounded-[40px] p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-[#FF5C5C] hover:text-[#FF5C5C] transition-all min-h-[200px] bg-slate-50/50">
            <Plus size={32} />
            <span className="font-black uppercase tracking-widest text-xs">Añadir Creencia</span>
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col border border-slate-100">
              <div className="p-8 overflow-y-auto space-y-8">
                
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <Globe className="text-[#FFB703]" /> {modalConfig.title}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre / Título</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ej. Los Kaltari..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB703]/20 transition-all font-bold shadow-inner" />
                  </div>
                  
                  {modalConfig.type === 'ethnicity' && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Región Geográfica</label>
                      <input type="text" value={formRegion} onChange={(e) => setFormRegion(e.target.value)} placeholder="Ej. Desierto de Ámbar" className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB703]/20 transition-all text-sm shadow-inner" />
                    </div>
                  )}

                  {modalConfig.type === 'belief' && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Creencia</label>
                      <input type="text" value={formType} onChange={(e) => setFormType(e.target.value)} placeholder="Ej. Deidad de la creación..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB703]/20 transition-all text-sm shadow-inner" />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe los detalles principales..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB703]/20 transition-all min-h-[100px] resize-none shadow-inner" />
                  </div>

                  {(modalConfig.type === 'ethnicity' || modalConfig.type === 'tradition') && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Imagen (URL)</label>
                      <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB703]/20 transition-all text-sm shadow-inner" />
                    </div>
                  )}
                </div>

                <button onClick={handleSave} disabled={guardando} className="w-full bg-[#FFD1A4] text-slate-900 font-black py-4 rounded-2xl mt-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}