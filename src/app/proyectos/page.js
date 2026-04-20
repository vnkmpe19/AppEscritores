"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, Trash2, Edit, Plus, X, LayoutGrid, BookOpen, Image as ImageIcon, ChevronLeft, Search, User, Edit3, Globe, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header'; 
import Libreta from '@/components/proyectos/Libreta'; 
import Bombilla from '@/components/common/Bombilla'; 

const COLORS = [
  'bg-[#BFD7ED]', 'bg-[#FFB7C5]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#D4C1EC]'
];

const PROJECT_SECTIONS = [
  { id: 'personajes', label: 'Personajes', href: '/personajes', icon: <User size={20} /> },
  { id: 'escenas', label: 'Escenas', href: '/escenas', icon: <Edit3 size={20} /> },
  { id: 'Mundo', label: 'Mundo', href: '/mundo', icon: <Globe size={20} /> },
  { id: 'ocurrencias', label: 'Ocurrencias', href: '/ocurrencias', icon: <Lightbulb size={20} /> },
  { id: 'tablero', label: 'Tablero', href: '/tablero', icon: <LayoutGrid size={20} /> }
];

export default function ProyectosPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [projects, setProjects] = useState([]); 
  const [viewMode, setViewMode] = useState('carousel'); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [formImage, setFormImage] = useState(''); 

  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  const [currentUser, setCurrentUser] = useState({ id: null, name: 'Cargando...' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;

    const { data: perfil } = await supabase
      .from('usuarios')
      .select('nombre_usuario')
      .eq('id', authData.user.id)
      .single();

    const userName = perfil?.nombre_usuario || 'Escritor Anonimo';
    setCurrentUser({ id: authData.user.id, name: userName });

    const { data: proyectosBd } = await supabase
      .from('proyectos')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (proyectosBd) {
      const mapeados = proyectosBd.map(p => ({
        id: p.id,
        title: p.titulo,
        description: p.descripcion,
        coverColor: p.color || COLORS[0],
        image: p.portada,
        author: userName
      }));
      setProjects(mapeados);
    }
  };

  const proyectosFiltrados = projects.filter(proyecto => 
    proyecto.title.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    proyecto.description.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const handleSearch = (termino) => {
    setTerminoBusqueda(termino);
    setCurrentIndex(0);
  };

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % proyectosFiltrados.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + proyectosFiltrados.length) % proyectosFiltrados.length);
  const handleOpenDetail = (project) => { setSelectedProject(project); setViewMode('detail'); };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('proyectos')
      .insert([{
        id_usuario: currentUser.id,
        titulo: formTitle || 'Nuevo Proyecto',
        descripcion: formDesc || 'Sin descripción',
        color: formColor,
        portada: formImage || null
      }])
      .select()
      .single();

    if (!error && data) {
      const newProject = {
        id: data.id,
        title: data.titulo,
        description: data.descripcion,
        coverColor: data.color,
        image: data.portada,
        author: currentUser.name 
      };
      setProjects([newProject, ...projects]); 
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('proyectos')
      .update({
        titulo: formTitle,
        descripcion: formDesc,
        color: formColor,
        portada: formImage || null
      })
      .eq('id', editingProject.id);

    if (!error) {
      setProjects(projects.map(p => p.id === editingProject.id ? {
        ...p, title: formTitle, description: formDesc, coverColor: formColor, image: formImage || null
      } : p));
      setEditingProject(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto? Todo su mundo se borrará.')) {
      await supabase.from('proyectos').delete().eq('id', id);
      
      setProjects(projects.filter(p => p.id !== id));
      if (viewMode === 'detail') setViewMode('carousel');
      if (currentIndex >= proyectosFiltrados.length - 1) setCurrentIndex(0);
    }
  };

  const resetForm = () => { setFormTitle(''); setFormDesc(''); setFormColor(COLORS[0]); setFormImage(''); };
  
  const openEditModal = (project) => {
    setEditingProject(project); 
    setFormTitle(project.title); 
    setFormDesc(project.description); 
    setFormColor(project.coverColor); 
    setFormImage(project.image || ''); 
    setShowCreateModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-x-hidden">
      
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        viewMode="proyectos" 
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-4 md:p-8`}>
        
        <Header 
            user={{name: currentUser.name}} 
            onSearch={handleSearch} 
            onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            isSidebarExpanded={isSidebarExpanded}
            title="Proyectos" 
        />

        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center mt-10">
          <div className="flex gap-2 bg-white/50 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setViewMode('carousel')} className={`p-2 rounded-lg transition-all ${viewMode === 'carousel' ? 'bg-[#FF5C5C] text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}><BookOpen size={20} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#FF5C5C] text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}><LayoutGrid size={20} /></button>
          </div>
          {viewMode !== 'detail' && (
            <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 bg-[#FFB7C5] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
              <Plus size={20} /><span>Nuevo Proyecto</span>
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {proyectosFiltrados.length === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Search size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold">No se encontraron proyectos</h3>
                <p>Crea tu primer mundo para empezar.</p>
              </motion.div>
            )}

            {proyectosFiltrados.length > 0 && viewMode === 'carousel' && (
              <motion.div key="carousel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center gap-8">
                <div className="flex items-center gap-4 md:gap-12 w-full justify-center">
                  <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-xl hover:bg-slate-50 transition-all text-[#FF5C5C]"><ChevronLeft size={32} /></button>
                  <div className="flex gap-6 overflow-hidden py-4 px-2">
                    <div className="hidden lg:block opacity-30 scale-90 blur-[1px]">
                      <Libreta project={proyectosFiltrados[(currentIndex - 1 + proyectosFiltrados.length) % proyectosFiltrados.length]} />
                    </div>
                    <motion.div layoutId="active-notebook" className="cursor-pointer" onClick={() => handleOpenDetail(proyectosFiltrados[currentIndex])}>
                      <Libreta project={proyectosFiltrados[currentIndex]} active />
                    </motion.div>
                    <div className="hidden lg:block opacity-30 scale-90 blur-[1px]">
                      <Libreta project={proyectosFiltrados[(currentIndex + 1) % proyectosFiltrados.length]} />
                    </div>
                  </div>
                  <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-xl hover:bg-slate-50 transition-all text-[#FF5C5C]"><ChevronRight size={32} /></button>
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-slate-800 mb-2">{proyectosFiltrados[currentIndex]?.title}</h2>
                  <p className="text-slate-400 max-w-md mx-auto">{proyectosFiltrados[currentIndex]?.description}</p>
                </div>
              </motion.div>
            )}

            {proyectosFiltrados.length > 0 && viewMode === 'grid' && (
              <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {proyectosFiltrados.map((project) => (
                  <div key={project.id} className="flex flex-col items-center gap-4">
                    <div onClick={() => handleOpenDetail(project)} className="cursor-pointer">
                      <Libreta project={project} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-800">{project.title}</h3>
                      <div className="flex gap-2 mt-2 justify-center">
                        <button onClick={() => openEditModal(project)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {viewMode === 'detail' && selectedProject && (
              <motion.div key="detail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-slate-50/50 relative">
                  <button onClick={() => setViewMode('carousel')} className="absolute top-8 left-8 p-3 rounded-full bg-white shadow-md hover:bg-slate-100 transition-all text-[#FF5C5C]"><ChevronLeft size={24} /></button>
                  <div className="flex gap-4 absolute top-8 right-8">
                    <button onClick={() => openEditModal(selectedProject)} className="p-3 rounded-full bg-white shadow-md hover:bg-blue-50 transition-all text-blue-500"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(selectedProject.id)} className="p-3 rounded-full bg-white shadow-md hover:bg-red-50 transition-all text-red-500"><Trash2 size={20} /></button>
                  </div>
                  <Libreta project={selectedProject} active />
                </div>
                
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
                  <h2 className="text-5xl font-black text-slate-900 mb-4">{selectedProject.title}</h2>
                  <p className="text-lg text-slate-500 mb-10 leading-relaxed">{selectedProject.description}</p>
                  
                  <div className="space-y-3">
                    {PROJECT_SECTIONS.map((section) => (
                      <Link 
                        key={section.id} 
                        href={`${section.href}?proyecto_id=${selectedProject.id}`}
                        className="group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all bg-slate-50 hover:bg-[#BFD7ED]/60 text-slate-500 hover:text-slate-900"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white text-slate-400 rounded-xl transition-all group-hover:bg-[#FF5C5C] group-hover:text-white shadow-sm ring-1 ring-slate-200 group-hover:ring-[#FF5C5C]">
                            {section.icon}
                          </div>
                          <span className="font-bold text-xl text-slate-700 group-hover:text-[#FF5C5C] transition-colors">{section.label}</span>
                        </div>
                        <ChevronRight size={24} className="transition-opacity opacity-0 group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Bombilla />

      <AnimatePresence>
        {(showCreateModal || editingProject) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowCreateModal(false); setEditingProject(null); resetForm(); }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
              <div className="p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800">{editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                  <button onClick={() => { setShowCreateModal(false); setEditingProject(null); resetForm(); }} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Título</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Nombre de tu aventura..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all font-bold" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                    <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="¿De qué trata este proyecto?" className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all min-h-[80px] resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Portada (URL de la imagen)</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Pega la URL de la imagen aquí..." value={formImage} onChange={(e) => setFormImage(e.target.value)} className="flex-1 bg-slate-50 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all text-sm" />
                    </div>
                    {formImage && (
                      <div className="mt-3 relative h-28 rounded-xl overflow-hidden border-2 border-slate-100 group">
                        <img src={formImage} alt="Vista previa" className="w-full h-full object-cover" />
                        <button onClick={() => setFormImage('')} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><X size={14} /></button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Color</label>
                    <div className="flex gap-3">
                      {COLORS.map((color) => (
                        <button key={color} onClick={() => setFormColor(color)} className={`w-10 h-10 rounded-full ${color} border-4 transition-all ${formColor === color ? 'border-[#FF5C5C] scale-110 shadow-md' : 'border-transparent hover:scale-105'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={editingProject ? handleUpdate : handleCreate} className="w-full bg-[#FF5C5C] text-white font-black py-4 rounded-2xl mt-8 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                  {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}