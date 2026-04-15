"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  ChevronLeft, Trash2, Edit, Plus, LayoutGrid,
  Map, Users, BookOpen as BookIcon, Languages, Network, X, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import Bombilla from '@/components/common/Bombilla';
import Libreta from '@/components/proyectos/Libreta';


import DashboardModule from '@/components/mundo/dashboard/DashboardModule';
import GeografiaModule from '@/components/mundo/geografia/GeografiaModule';
import SociopoliticalModule from '@/components/mundo/sociopolitica/SociopoliticalModule';
import HistoryModule from '@/components/mundo/historia/HistoryModule';
import CulturesModule from '@/components/mundo/culturas/CulturesModule';
import RelationshipsModule from '@/components/mundo/relaciones/RelationshipsModule';

const COLORS = ['bg-[#BFD7ED]', 'bg-[#FFB7C5]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#D4C1EC]'];

const WORLD_MODULES = [
  { id: 'dashboard', label: 'Panel de Control', icon: <LayoutGrid size={18} />, href: null },
  { id: 'geografia', label: 'Geografía y Clima', icon: <Map size={18} />, href: null },
  { id: 'sociedad', label: 'Estructura Sociopolítica', icon: <Users size={18} />, href: null },
  { id: 'historia', label: 'Historia y Eras', icon: <BookIcon size={18} />, href: null },
  { id: 'culturas', label: 'Cultura', icon: <Languages size={18} />, href: null },
  { id: 'relaciones', label: 'Red de Relaciones', icon: <Network size={18} />, href: null },
];

export default function MundoPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [worlds, setWorlds] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorld, setEditingWorld] = useState(null);
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

    const userName = perfil?.nombre_usuario || 'Escritor';
    setCurrentUser({ id: authData.user.id, name: userName });

    const { data: mundosBd } = await supabase
      .from('proyectos')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (mundosBd) {
      const mapeados = mundosBd.map(w => ({
        id: w.id,
        title: w.titulo,
        description: w.descripcion,
        coverColor: w.color || COLORS[0],
        image: w.portada,
        author: userName
      }));
      setWorlds(mapeados);

      const urlParams = new URLSearchParams(window.location.search);
      const urlId = urlParams.get('proyecto_id');
      const localId = localStorage.getItem('mundoActivoId');

      const mundoIdBuscar = urlId || localId;

      if (mundoIdBuscar) {
        const mundoEncontrado = mapeados.find(w => w.id === mundoIdBuscar);
        if (mundoEncontrado) {
          setSelectedWorld(mundoEncontrado);
          setViewMode('detail');
          setActiveModule('dashboard');
        }
      }
    }
  };

  const mundosFiltrados = worlds.filter(mundo =>
    mundo.title.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    (mundo.description && mundo.description.toLowerCase().includes(terminoBusqueda.toLowerCase()))
  );

  const handleSearch = (termino) => setTerminoBusqueda(termino);

  const handleOpenDetail = (world) => {
    setSelectedWorld(world);
    setViewMode('detail');
    setActiveModule('dashboard');
    localStorage.setItem('mundoActivoId', world.id);
  };

  const handleCloseDetail = () => {
    setSelectedWorld(null);
    setViewMode('grid');
    localStorage.removeItem('mundoActivoId');

    window.history.replaceState(null, '', '/mundo');
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('proyectos')
      .insert([{
        id_usuario: currentUser.id,
        titulo: formTitle || 'Nuevo Mundo',
        descripcion: formDesc,
        color: formColor,
        portada: formImage || null
      }])
      .select()
      .single();

    if (!error && data) {
      const newWorld = {
        id: data.id,
        title: data.titulo,
        description: data.descripcion,
        coverColor: data.color,
        image: data.portada,
        author: currentUser.name
      };
      setWorlds([newWorld, ...worlds]);
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
      .eq('id', editingWorld.id);

    if (!error) {
      setWorlds(worlds.map(w => w.id === editingWorld.id ? { ...w, title: formTitle, description: formDesc, coverColor: formColor, image: formImage || null } : w));
      setEditingWorld(null);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mundo? Se borrará todo su Lore.')) {
      await supabase.from('proyectos').delete().eq('id', id);
      setWorlds(worlds.filter(w => w.id !== id));
      if (selectedWorld?.id === id) handleCloseDetail();
    }
  };

  const resetForm = () => { setFormTitle(''); setFormDesc(''); setFormColor(COLORS[0]); setFormImage(''); };

  const openEditModal = (world) => {
    setEditingWorld(world);
    setFormTitle(world.title);
    setFormDesc(world.description || '');
    setFormColor(world.coverColor);
    setFormImage(world.image || '');
    setShowCreateModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-x-hidden">

      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        viewMode="mundo"
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-4 md:p-8 flex flex-col h-screen overflow-y-auto`}>

        <Header
          user={{ name: currentUser.name }}
          onSearch={handleSearch}
          onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
          title="Mundo"
        />

        <div className="max-w-[1400px] mx-auto relative min-h-[500px]">
          <AnimatePresence mode="wait">

            {!selectedWorld && (
              <motion.div key="grid-mundos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-700">Tus Universos</h2>
                  <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 bg-[#FFB7C5] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                    <Plus size={20} /><span>Crear Mundo</span>
                  </button>
                </div>

                {mundosFiltrados.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <Globe size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No hay mundos creados.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mundosFiltrados.map((mundo) => (
                      <div key={mundo.id} className="flex flex-col items-center gap-4 group">
                        <div onClick={() => handleOpenDetail(mundo)} className="cursor-pointer transition-transform group-hover:-translate-y-2">
                          <Libreta project={mundo} />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-slate-800">{mundo.title}</h3>
                          <div className="flex gap-2 mt-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(mundo)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-white rounded-full shadow-sm"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(mundo.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white rounded-full shadow-sm"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedWorld && (
              <motion.div key="detalle-mundo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <Link 
                      href="/proyectos"
                      className="flex items-center gap-2 text-slate-500 hover:text-[#FF5C5C] font-bold mb-6 transition-colors"
                    >
                      <ChevronLeft size={20} /> Volver a Proyectos
                    </Link>

                  <div className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Módulos del Mundo</h3>
                    <div className="flex flex-col gap-1">
                      {WORLD_MODULES.map(mod => {
                        const isCurrent = activeModule === mod.id;
                        const btnClasses = `flex w-full text-left items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${isCurrent ? 'bg-[#FFB7C5] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`;

                        if (mod.href) {
                          return (
                            <Link key={mod.id} href={mod.href} className={btnClasses}>
                              {mod.icon} {mod.label}
                            </Link>
                          );
                        }

                        return (
                          <button key={mod.id} onClick={() => setActiveModule(mod.id)} className={btnClasses}>
                            {mod.icon} {mod.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-transparent">
                  <AnimatePresence mode="wait">

                    {activeModule === 'dashboard' && <DashboardModule key="dashboard" proyectoId={selectedWorld.id} />}
                    {activeModule === 'geografia' && <GeografiaModule key="geografia" proyectoId={selectedWorld.id} />}
                    {activeModule === 'sociedad' && <SociopoliticalModule key="sociedad" proyectoId={selectedWorld.id} />}
                    {activeModule === 'historia' && <HistoryModule key="historia" proyectoId={selectedWorld.id} />}
                    {activeModule === 'culturas' && <CulturesModule key="culturas" proyectoId={selectedWorld.id} />}
                    {activeModule === 'relaciones' && <RelationshipsModule key="relaciones" proyectoId={selectedWorld.id} />}
                  </AnimatePresence>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Bombilla />

      <AnimatePresence>
        {(showCreateModal || editingWorld) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowCreateModal(false); setEditingWorld(null); resetForm(); }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col">
              <div className="p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-800">{editingWorld ? 'Editar Mundo' : 'Nuevo Mundo'}</h3>
                  <button onClick={() => { setShowCreateModal(false); setEditingWorld(null); resetForm(); }} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Mundo</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Color Temático</label>
                    <div className="flex gap-3">
                      {COLORS.map((color) => (
                        <button key={color} onClick={() => setFormColor(color)} className={`w-10 h-10 rounded-full ${color} border-4 ${formColor === color ? 'border-[#FF5C5C] scale-110 shadow-md' : 'border-transparent'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={editingWorld ? handleUpdate : handleCreate} className="w-full bg-slate-800 text-white font-black py-4 rounded-2xl mt-8 shadow-lg hover:bg-slate-700 active:scale-[0.98] transition-all">
                  {editingWorld ? 'Guardar Cambios' : 'Comenzar a Crear'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}