"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Search, Plus, Edit, Trash2, Languages, Ghost, Utensils, 
  Activity, Bell, Sun, TrendingUp, X, MapPin, Image as ImageIcon, Sparkles, BookOpen, Users
} from 'lucide-react';

const INITIAL_ETHNICITIES = [
  { id: 1, name: 'Los Kaltari', desc: 'Nómadas conocidos por su maestría en la orfebrería y sus túnicas de seda teñida.', region: 'DESIERTO DE AMBAR', image: 'https://picsum.photos/seed/kaltari/400/300' },
  { id: 2, name: 'Guardianes de Skald', desc: 'Guerreros robustos de las montañas, sus vestiduras incorporan pieles de osos blancos.', region: 'CUMBRES NEVADAS', image: 'https://picsum.photos/seed/skald/400/300' },
  { id: 3, name: 'Mercaderes de Oriz', desc: 'Cultura urbana centrada en el comercio fluvial y la astronomía náutica.', region: 'CIUDAD DE LOS RÍOS', image: 'https://picsum.photos/seed/oriz/400/300' }
];

const INITIAL_RITES = [
  { id: 1, name: 'El Descenso Fluvial', desc: 'Los habitantes de Oriz colocan a sus difuntos en balsas de caña llenas de flores de loto blancas.' },
  { id: 2, name: 'Túmulos de Escarcha', desc: 'Los Skald entierran a sus héroes bajo capas de permafrost, marcando el lugar con una lanza.' }
];

const INITIAL_TRADITIONS = [
  { id: 1, name: 'Pan de Polvo Dorado', desc: 'Elaborado con polen de lirio de arena, este pan dulce es el pilar de los banquetes Kaltari.', image: 'https://picsum.photos/seed/bread/100/100' },
  { id: 2, name: 'Té de Resina Ahumada', desc: 'Bebida amarga consumida por los monjes de las Cumbres para resistir las bajas temperaturas.', image: 'https://picsum.photos/seed/tea/100/100' }
];

const INITIAL_BELIEFS = [
  { id: 1, name: 'El Gran Tejedor', type: 'DEIDAD DE LA CREACIÓN', desc: 'Se cree que el universo es un tapiz infinito. Cada vida es un hilo y el destino es el patrón.' },
  { id: 2, name: 'Los Hijos del Eco', type: 'ESPÍRITUS DE LA NATURALEZA', desc: 'No adoran a dioses, sino a los ecos de sus ancestros que residen en el viento y el agua.' }
];

export default function CulturesModule() {
  const [ethnicities, setEthnicities] = useState(INITIAL_ETHNICITIES);
  const [rites, setRites] = useState(INITIAL_RITES);
  const [traditions, setTraditions] = useState(INITIAL_TRADITIONS);
  const [beliefs, setBeliefs] = useState(INITIAL_BELIEFS);
  
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '' });
  const [editingEntity, setEditingEntity] = useState(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRegion, setFormRegion] = useState(''); 
  const [formImage, setFormImage] = useState(''); 
  const [formType, setFormType] = useState(''); 

  
  const openModal = (type, title, entity = null) => {
    setModalConfig({ type, title });
    setEditingEntity(entity);
    
    if (entity) {
      setFormName(entity.name || '');
      setFormDesc(entity.desc || '');
      setFormRegion(entity.region || '');
      setFormImage(entity.image || '');
      setFormType(entity.type || '');
    } else {
      setFormName(''); setFormDesc(''); setFormRegion(''); setFormImage(''); setFormType('');
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName) return alert("El nombre es obligatorio");

    const newEntity = {
      id: editingEntity ? editingEntity.id : crypto.randomUUID(),
      name: formName,
      desc: formDesc,
      region: formRegion || 'REGIÓN DESCONOCIDA',
      image: formImage || `https://picsum.photos/seed/${Math.random()}/400/300`,
      type: formType || 'TIPO DESCONOCIDO'
    };

    if (modalConfig.type === 'ethnicity') {
      if (editingEntity) setEthnicities(ethnicities.map(e => e.id === editingEntity.id ? newEntity : e));
      else setEthnicities([...ethnicities, newEntity]);
    } 
    else if (modalConfig.type === 'rite') {
      if (editingEntity) setRites(rites.map(e => e.id === editingEntity.id ? newEntity : e));
      else setRites([...rites, newEntity]);
    }
    else if (modalConfig.type === 'tradition') {
      if (editingEntity) setTraditions(traditions.map(e => e.id === editingEntity.id ? newEntity : e));
      else setTraditions([...traditions, newEntity]);
    }
    else if (modalConfig.type === 'belief') {
      if (editingEntity) setBeliefs(beliefs.map(e => e.id === editingEntity.id ? newEntity : e));
      else setBeliefs([...beliefs, newEntity]);
    }

    setShowModal(false);
  };

  const handleDelete = (type, id) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      if (type === 'ethnicity') setEthnicities(ethnicities.filter(e => e.id !== id));
      if (type === 'rite') setRites(rites.filter(e => e.id !== id));
      if (type === 'tradition') setTraditions(traditions.filter(e => e.id !== id));
      if (type === 'belief') setBeliefs(beliefs.filter(e => e.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 pb-20">
      
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4C1EC]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#D4C1EC]/50 text-slate-800 rounded-2xl shadow-inner">
            <Globe size={32} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Culturas y Lenguajes</h2>
            <p className="text-slate-400 text-lg mt-1 max-w-2xl">
              Explora las etnias, tradiciones, ritos sagrados y las lenguas que dan vida a los habitantes de tu mundo.
            </p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8 pr-4">
          <h3 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            Etnias Principales
          </h3>
          <button className="text-[#FF5C5C] font-black text-xs uppercase tracking-widest hover:underline">Ver todas</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {ethnicities.map(eth => (
              <motion.div 
                key={eth.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all flex flex-col"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={eth.image} alt={eth.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#FFB703] text-slate-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-md">
                    {eth.region}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2 z-10">
                    <button onClick={() => openModal('ethnicity', 'Editar Etnia', eth)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-500 hover:scale-110 shadow-lg"><Edit size={16}/></button>
                    <button onClick={() => handleDelete('ethnicity', eth.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 shadow-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-2xl font-black text-slate-800 mb-3">{eth.name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{eth.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={() => openModal('ethnicity', 'Nueva Etnia')}
            className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-[#FFB703] hover:text-[#FFB703] transition-all min-h-[400px] bg-slate-50/50 group"
          >
            <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform"><Plus size={32} /></div>
            <span className="font-black uppercase tracking-widest text-sm">Agregar Nueva Etnia</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
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
                  <h4 className="font-black text-slate-800 text-lg mb-2">{rite.name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed pr-8">{rite.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => openModal('rite', 'Nuevo Rito')} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-black uppercase tracking-widest text-xs hover:border-[#FF5C5C] hover:text-[#FF5C5C] transition-all flex items-center justify-center gap-2">
              <Plus size={16}/> Nuevo Rito
            </button>
          </div>
        </section>

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
                    <img src={trad.image} alt={trad.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 pr-8">
                    <h4 className="font-black text-slate-800 text-lg mb-1">{trad.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{trad.desc}</p>
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
                <h4 className="text-2xl font-black text-slate-800 mb-1">{belief.name}</h4>
                <p className="text-[10px] font-black text-[#FFB703] uppercase tracking-widest mb-4">{belief.type}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{belief.desc}</p>
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

                <button onClick={handleSave} className="w-full bg-[#FFB703] text-slate-900 font-black py-4 rounded-2xl mt-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <Sparkles size={20} /> Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}