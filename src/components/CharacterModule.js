"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Zap, Sparkles, Plus, X, Camera, Trash2, Loader2, FolderOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function CharacterModule() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('proyecto_id');

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedProjectName, setSelectedProjectName] = useState('');
  
  const [characters, setCharacters] = useState([]);
  const [view, setView] = useState('gallery');
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRol, setNewRol] = useState('Protagonista');
  const [selectedMarco, setSelectedMarco] = useState('/marco1.png');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedProjectId) {
      fetchCharacters(selectedProjectId);
      fetchProjectDetails(selectedProjectId);
    } else {
      fetchProjects();
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('proyectos')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (data) setProjects(data);
    setLoading(false);
  };

  const fetchProjectDetails = async (id) => {
    const { data } = await supabase.from('proyectos').select('titulo').eq('id', id).single();
    if (data) setSelectedProjectName(data.titulo);
  };

  const fetchCharacters = async (projectId) => {
    setLoading(true);
    const { data } = await supabase
      .from('personajes')
      .select('*, personaje_identidad(edad, origen)')
      .eq('id_proyecto', projectId)
      .order('fecha_creacion', { ascending: false });

    if (data) setCharacters(data);
    setLoading(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const extension = file.name.split('.').pop();
      const fileName = `personaje-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(fileName, file);

      if (uploadError) {
        alert("Error al subir imagen");
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName);
        setNewImage(publicUrl);
      }
      setUploading(false);
    }
  };

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    if (!newName || !selectedProjectId) return;

    const newChar = {
      id_proyecto: selectedProjectId,
      nombre: newName,
      rol: newRol,
      foto: newImage,
      frase_epica: "Nueva frase épica...",
      descripcion: "Breve descripción...",
      apariencia: "Descripción de su apariencia...",
      historia: "Historia resumida...",
    };

    const { data, error } = await supabase
      .from('personajes')
      .insert([newChar])
      .select()
      .single();

    if (!error) {
      setCharacters([data, ...characters]);
      setShowCreateModal(false);
      setNewName('');
      setNewImage(null);
    }
  };

  const deleteCharacter = async (e, id) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este personaje?")) {
      const { error } = await supabase.from('personajes').delete().eq('id', id);
      if (!error) setCharacters(characters.filter(c => c.id !== id));
    }
  };

  return (
    <div className="w-full h-full relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {!selectedProjectId ? (
          <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 p-4 md:p-10">
            {loading ? (
              <div className="col-span-full text-center py-20 text-slate-400 font-bold"><Loader2 className="animate-spin inline-block mr-2" /> Cargando proyectos...</div>
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-400">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">No tienes proyectos creados aún.</p>
                <Link href="/proyectos" className="text-[#FF5C5C] font-black uppercase text-xs tracking-widest mt-4 inline-block hover:underline">Ir a crear uno</Link>
              </div>
            ) : projects.map(p => (
              <div key={p.id} onClick={() => setSelectedProjectId(p.id)} 
                   className="group bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center flex flex-col items-center">
                <div className={`w-16 h-20 md:w-20 md:h-24 mb-6 rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg ${p.color || 'bg-[#BFD7ED]'} flex items-center justify-center p-2`}>
                   {p.portada ? <img src={p.portada} className="w-full h-full object-cover rounded-lg" /> : <div className="w-full h-full border-2 border-white/30 rounded-lg" />}
                </div>
                <h3 className="text-lg md:text-xl font-serif font-black text-slate-900 mb-2 truncate w-full">{p.titulo}</h3>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#F497A9]">Abrir Galería</p>
              </div>
            ))}
          </motion.div>
        ) : (
          
          view === 'gallery' && (
            <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col h-full">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-10 pt-6 gap-4">
                <Link href="/proyectos" className="flex items-center gap-2 text-slate-400 hover:text-[#FF5C5C] font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors">
                  <ArrowLeft size={16} /> Cambiar Proyecto
                </Link>
                <div className="bg-white/60 backdrop-blur-sm border border-white/50 px-5 py-2 rounded-full shadow-sm w-full md:w-auto">
                   <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Personajes de:</p>
                   <p className="text-xs md:text-sm font-serif font-black text-slate-900 truncate">{selectedProjectName}</p>
                </div>
              </div>

              <div className="flex gap-6 md:gap-10 overflow-x-auto py-10 px-6 md:px-10 no-scrollbar snap-x items-center min-h-[450px]">
                <div onClick={() => setShowCreateModal(true)} className="snap-center shrink-0 flex flex-col items-center justify-center w-56 h-[320px] md:w-64 md:h-[350px] border-4 border-dashed border-slate-200 rounded-[50px] md:rounded-[60px] group hover:border-[#FF5C5C] transition-all cursor-pointer bg-white/30">
                  <div className="p-5 bg-white rounded-full text-slate-300 group-hover:text-[#FF5C5C] shadow-sm"><Plus size={32} /></div>
                  <p className="mt-4 font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-[#FF5C5C]">Nuevo Personaje</p>
                </div>

                {loading ? (
                  <div className="w-full text-center text-slate-400 font-bold p-10"><Loader2 className="animate-spin inline-block" /> Cargando...</div>
                ) : characters.map(c => (
                  <div key={c.id} className="snap-center shrink-0 relative group" onClick={() => { setSelected(c); setView('quick'); }}>
                    <button onClick={(e) => deleteCharacter(e, c.id)} className="absolute top-2 right-4 z-30 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 size={14} />
                    </button>

                    <div className="relative flex flex-col items-center w-56 md:w-64 cursor-pointer">
                      <div className="relative w-full aspect-[3/4]">
                        <img src={selectedMarco} className="absolute inset-0 w-full h-full object-contain drop-shadow-xl z-10" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-7">
                          <div className="w-full aspect-square bg-white rounded-full border-4 border-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                            {c.foto ? <img src={c.foto} className="w-full h-full object-cover" /> : <span className="text-6xl md:text-7xl font-serif font-black text-[#B9D9EB]/40 italic">{c.nombre[0]}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-6 text-center bg-white/60 px-5 md:px-6 py-2 rounded-2xl border border-white/50 shadow-sm group-hover:bg-white transition-all w-full">
                        <h3 className="text-xl md:text-2xl font-serif font-black text-slate-900 truncate leading-none">{c.nombre}</h3>
                        <p className="text-[8px] md:text-[9px] font-black text-[#F497A9] uppercase tracking-widest mt-2">{c.rol}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        )}

        {view === 'quick' && selected && (
          <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            
            <div onClick={() => setView('gallery')} className="absolute inset-0 z-0" />
            
            <div className="w-full max-w-4xl flex flex-col md:flex-row items-center relative z-10 py-6 md:py-10">
              
              <div className="relative z-20 w-56 h-72 md:w-[350px] md:h-[480px] shrink-0 transform md:-rotate-1 mb-[-40px] md:mb-0">
                <img src={selectedMarco} className="w-full h-full object-contain drop-shadow-2xl" />
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                  <div className="w-full aspect-square rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
                    {selected.foto ? <img src={selected.foto} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-7xl font-serif font-black text-[#B9D9EB]/20 italic">{selected.nombre[0]}</div>}
                  </div>
                </div>
              </div>

              <div className="bg-[#B9D9EB] w-full md:flex-1 md:-ml-20 pt-16 md:pt-10 md:pl-28 p-6 md:p-10 rounded-[40px] md:rounded-[60px] shadow-2xl border-4 border-white flex flex-col relative min-h-[400px]">
                <button onClick={() => setView('gallery')} className="absolute top-6 right-8 p-2 text-slate-600 hover:text-black md:hidden">
                  <X size={24} />
                </button>

                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-2 leading-tight">{selected.nombre}</h2>
                  <p className="text-sm md:text-base font-serif italic text-slate-800 border-l-4 border-[#F497A9] pl-4 md:pl-6 mb-4 line-clamp-2 md:line-clamp-none">
                    "{selected.frase_epica || 'Sin frase registrada'}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 bg-white/30 p-4 md:p-6 rounded-[24px] md:rounded-[30px] border border-white/50">
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#F497A9] mb-1">Edad</p>
                    <p className="font-bold text-sm md:text-base text-slate-800">{selected.personaje_identidad?.edad || '?'}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#F497A9] mb-1">Origen</p>
                    <p className="font-bold text-sm md:text-base text-slate-800 truncate">{selected.personaje_identidad?.origen || '?'}</p>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start mt-auto">
                  <Link href={`/personajes/${selected.id}`}
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center gap-3 no-underline w-full md:w-fit justify-center"
                  >
                    <Sparkles size={16} /> Ver Expediente Completo
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100 }} 
              className="bg-white w-full max-w-md rounded-t-[40px] md:rounded-[40px] p-8 shadow-2xl relative">
              
              <form onSubmit={handleAddCharacter} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl md:text-2xl font-black">Nuevo Personaje</h3>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div onClick={() => fileInputRef.current.click()} className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-dashed border-slate-200 overflow-hidden cursor-pointer hover:border-[#FF5C5C] relative group">
                    {uploading ? (
                      <div className="h-full flex items-center justify-center text-slate-300 bg-slate-50"><Loader2 className="animate-spin" /></div>
                    ) : newImage ? (
                      <img src={newImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest bg-slate-50 group-hover:bg-slate-100">Subir Foto</div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                  </div>
                </div>

                <div className="space-y-4">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre del personaje..." 
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF5C5C]/20 border border-transparent focus:border-[#FF5C5C]/20 transition-all font-bold" />
                  
                  <select value={newRol} onChange={(e) => setNewRol(e.target.value)} 
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-transparent font-bold text-slate-600">
                    <option>Protagonista</option>
                    <option>Antagonista</option>
                    <option>Secundario</option>
                    <option>Terciario</option>
                  </select>
                </div>
                <button type="submit" disabled={uploading || !newName} 
                  className="w-full disabled:bg-slate-300 bg-[#FF5C5C] text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest">
                  {uploading ? 'Subiendo...' : 'Crear Personaje'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}