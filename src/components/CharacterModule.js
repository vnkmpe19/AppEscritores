"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Heart, Zap, Sparkles, Plus, X, Camera, Trash2
} from 'lucide-react';
import Link from 'next/link';

const INITIAL_DATA = [
  {
    id: "p1", nombre: "Elara Vance", rol: "Protagonista", estado: "Activo", marco: "/marco1.png", image: null,
    frase: "La magia no es un don, es una condena.", deseo: "Descubrir la verdad.", conflicto: "Su magia borra sus recuerdos."
  }
];

export default function CharacterModule() {
  const [characters, setCharacters] = useState([]);
  const [view, setView] = useState('gallery'); 
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRol, setNewRol] = useState('Protagonista');
  const [selectedMarco, setSelectedMarco] = useState('/marco1.png');
  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Cargar personajes al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('mis_personajes');
    if (saved) {
      setCharacters(JSON.parse(saved));
    } else {
      setCharacters(INITIAL_DATA);
      localStorage.setItem('mis_personajes', JSON.stringify(INITIAL_DATA));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCharacter = (e) => {
    e.preventDefault();
    if (!newName) return;
    const newChar = {
      id: `id-${Date.now()}`,
      nombre: newName, rol: newRol, estado: "Activo", marco: selectedMarco, image: newImage,
      frase: "Nueva frase...", deseo: "Nuevo deseo...", conflicto: "Nuevo conflicto..."
    };
    const updated = [newChar, ...characters];
    setCharacters(updated);
    localStorage.setItem('mis_personajes', JSON.stringify(updated));
    setShowCreateModal(false);
    setNewName(''); setNewImage(null);
  };

  const deleteCharacter = (e, id) => {
    e.stopPropagation(); // Evita abrir la ficha al borrar
    if (confirm("¿Eliminar este personaje?")) {
      const updated = characters.filter(c => c.id !== id);
      setCharacters(updated);
      localStorage.setItem('mis_personajes', JSON.stringify(updated));
    }
  };

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        {view === 'gallery' && (
          <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                      className="flex gap-10 overflow-x-auto py-12 px-10 no-scrollbar snap-x items-center min-h-[500px]">
            
            <div onClick={() => setShowCreateModal(true)} className="snap-center shrink-0 flex flex-col items-center justify-center w-64 h-[380px] border-4 border-dashed border-slate-200 rounded-[60px] group hover:border-[#FF5C5C] transition-all cursor-pointer bg-white/30">
              <div className="p-6 bg-white rounded-full text-slate-300 group-hover:text-[#FF5C5C] shadow-sm"><Plus size={40} /></div>
              <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-[#FF5C5C]">Crear Personaje</p>
            </div>

            {characters.map(c => (
              <div key={c.id} className="snap-center shrink-0 relative group" onClick={() => { setSelected(c); setView('quick'); }}>
                {/* BOTÓN ELIMINAR */}
                <button 
                  onClick={(e) => deleteCharacter(e, c.id)}
                  className="absolute top-2 right-2 z-30 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>

                <div className="relative flex flex-col items-center w-64 cursor-pointer">
                  <div className="relative w-full aspect-[3/4]">
                    <img src={c.marco} className="absolute inset-0 w-full h-full object-contain drop-shadow-xl z-10" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                      <div className="w-full h-full bg-white rounded-[100px] border-4 border-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                        {c.image ? <img src={c.image} className="w-full h-full object-cover" /> : <span className="text-7xl font-serif font-black text-[#B9D9EB]/40 italic">{c.nombre[0]}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center bg-white/60 px-6 py-2 rounded-2xl border border-white/50 shadow-sm group-hover:bg-white transition-all">
                    <h3 className="text-2xl font-serif font-black text-slate-900 leading-none">{c.nombre}</h3>
                    <p className="text-[9px] font-black text-[#F497A9] uppercase tracking-widest mt-2">{c.rol}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {view === 'quick' && (
          <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setView('gallery')}
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl flex flex-col md:flex-row items-center relative py-10">
              {/* Marco y Datos ... */}
              <div className="relative z-20 w-72 h-96 md:w-[350px] md:h-[480px] shrink-0 transform -rotate-1">
                <img src={selected.marco} className="w-full h-full object-contain drop-shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center p-14 font-serif font-black text-9xl text-[#B9D9EB]/20 italic">
                   {selected.image ? <img src={selected.image} className="w-full h-full rounded-[100px] object-cover" /> : selected.nombre[0]}
                </div>
              </div>

              <div className="bg-[#B9D9EB] flex-1 md:-ml-24 pt-12 md:pt-10 md:pl-32 p-10 rounded-[60px] shadow-2xl border-4 border-white flex flex-col relative min-h-[460px] text-left">
                <h2 className="text-5xl font-serif font-black text-slate-900 mb-2">{selected.nombre}</h2>
                <p className="text-xl font-serif italic text-slate-800 border-l-4 border-[#F497A9] pl-6 mb-8 italic">"{selected.frase}"</p>
                
                {/* BOTÓN MÁS INFORMACIÓN (CORREGIDO) */}
                <div className="mt-auto flex justify-between items-end">
                   <Link 
                    href={`/personajes/${selected.id}`} 
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center gap-3 no-underline"
                   >
                    <Sparkles size={16}/> Más información profunda
                  </Link>
                  <img src="/bombilla.png" className="w-16 h-16 drop-shadow-md cursor-pointer hover:rotate-12 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CREAR (Igual que antes pero con handleDelete) */}
      {/* ... (Tu código de modal aquí) ... */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl">
              <form onSubmit={handleAddCharacter} className="space-y-6">
                <div className="flex justify-between items-center"><h3 className="text-2xl font-black">Nuevo Personaje</h3><button type="button" onClick={() => setShowCreateModal(false)}><X/></button></div>
                <div className="flex flex-col items-center gap-4">
                  <div onClick={() => fileInputRef.current.click()} className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-red-400">
                    {newImage ? <img src={newImage} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300">Subir Foto</div>}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre..." className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
                <button type="submit" className="w-full bg-[#FF5C5C] text-white font-black py-4 rounded-2xl shadow-lg">Agregar Personaje</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}