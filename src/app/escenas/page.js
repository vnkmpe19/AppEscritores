"use client";
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { supabase } from '../lib/supabase'; // Ajusta la ruta si es diferente
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Componentes comunes
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import Libreta from '@/components/proyectos/Libreta'; // Importamos tu libreta

// Componentes específicos
import ManuscriptProcesor from '@/components/escenas/ManuscriptProcesor';
import SceneCard from '@/components/escenas/SceneCard';

// Estados y librerías
import { useAppStore } from '@/store/useAppStore';
import { useSearchParams } from 'next/navigation';
import { Plus, LayoutGrid, MousePointer2, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const COLORS = ['bg-[#BFD7ED]', 'bg-[#FFB7C5]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#D4C1EC]'];
const nodeTypes = { scene: SceneCard };

function EscenasPageInner() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('proyecto_id');

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  
  // --- ESTADOS PARA LOS PROYECTOS ---
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: 'Cargando...' });

  // Estados y funciones de useAppStore.js (Zustand para las escenas)
  const { 
    scenes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addScene, 
    setScenes, 
    deleteScene 
  } = useAppStore();

  // --- CARGAR PROYECTOS DESDE SUPABASE ---
  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;

    // Obtener usuario
    const { data: perfil } = await supabase
      .from('usuarios')
      .select('nombre_usuario')
      .eq('id', authData.user.id)
      .single();

    const userName = perfil?.nombre_usuario || 'Escritor Anonimo';
    setCurrentUser({ name: userName });

    // Obtener proyectos
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

      // SI HAY UN ID EN LA URL, AUTOSELECCIONAR
      if (initialProjectId) {
         const found = mapeados.find(p => p.id === initialProjectId);
         if (found) setSelectedProject(found);
      }
    }
  };

  // --- FILTRADO DE NODOS Y CONEXIONES (SOLO DEL PROYECTO SELECCIONADO) ---
  const nodes = useMemo(() => {
    if (!selectedProject) return [];
    
    // Filtramos las escenas para que solo salgan las del proyecto seleccionado
    const escenasDelProyecto = scenes.filter(s => s.proyecto_id === selectedProject.id);
    
    return escenasDelProyecto.map((s) => ({
      ...s,
      data: { 
        ...s.data, 
        onEdit: (dataToEdit) => {
          setEditingScene(dataToEdit);
          setIsWriting(true);
        },
        onDelete: (id) => deleteScene(id) 
      }
    }));
  }, [scenes, selectedProject, deleteScene]); 

  const currentEdges = useMemo(() => {
    const nodeIds = new Set(nodes.map(n => n.id));
    return edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [edges, nodes]);

  // --- GUARDAR ESCENA NUEVA O EDITADA ---
  const handleFinishScene = (sceneData) => {
    const existingNode = scenes.find(n => n.id === sceneData.id);
    
    if (!existingNode) {
      const newNode = {
        id: sceneData.id || `sc-${Math.random().toString(36).substr(2, 9)}`,
        type: 'scene',
        position: { x: 150, y: 150 },
        data: sceneData,
        // CLAVE: Le asignamos el ID del proyecto actual para que no se revuelvan
        proyecto_id: selectedProject.id 
      };
      addScene(newNode);
    } else {
      const updatedScenes = scenes.map(n => 
        n.id === sceneData.id ? { ...n, data: sceneData } : n
      );
      setScenes(updatedScenes);
    }
    
    setIsWriting(false);
    setEditingScene(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} viewMode="escenas" />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-4 md:p-8 flex flex-col h-screen overflow-y-auto`}>
        
        {/* --- VISTA 1: LISTA DE PROYECTOS --- */}
        {!selectedProject ? (
          <>
            <Header user={{name: currentUser.name}} onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} isSidebarExpanded={isSidebarExpanded} title="Escenas" />
            
            <div className="max-w-6xl mx-auto mt-10 w-full">
              <h2 className="text-2xl font-black text-slate-800 mb-8">Tus Escenas</h2>
              
              {projects.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <p>Las historias toman forma… espera un momento mientras las palabras encuentran su lugar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="flex flex-col items-center gap-4 group">
                      {/* Al hacer clic, entramos al lienzo de ese proyecto */}
                      <div onClick={() => setSelectedProject(project)} className="cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                        <Libreta project={project} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-slate-800 group-hover:text-[#FF5C5C] transition-colors">{project.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          
          /* --- VISTA 2: MAPA DE ESCENAS (REACT FLOW) --- */
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col h-full"
          >
            {/* Botón de regreso tipo "Mundo" */}
            <div className="mb-4">
              <button 
                onClick={() => setSelectedProject(null)} 
                className="flex items-center gap-2 text-slate-500 hover:text-[#FF5C5C] transition-colors font-bold text-sm"
              >
                <ChevronLeft size={20} /> Volver a Escenas
              </button>
            </div>

            {/* Cabecera del lienzo */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800">{selectedProject.title}</h2>
                <p className="text-sm text-slate-500">Mapa de escenas</p>
              </div>
              
              <button 
                onClick={() => {
                  setEditingScene(null);
                  setIsWriting(true);
                }}
                className="flex items-center gap-2 bg-[#FF5C5C] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={18}/> Nueva Escena
              </button>
            </div>

            {/* Contenedor del React Flow */}
            <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden relative min-h-[500px]">
              <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                 <LayoutGrid size={14} className="text-[#BFD7ED]"/>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   Organización Visual
                 </span>
              </div>

              <ReactFlow 
                nodes={nodes} 
                edges={currentEdges} 
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange} 
                onConnect={onConnect}         
                nodeTypes={nodeTypes} 
                onNodeDoubleClick={(_, node) => {
                  setEditingScene(node.data);
                  setIsWriting(true);
                }}
                deleteKeyCode={["Backspace", "Delete"]}
                fitView
              >
                <Background variant="dots" gap={20} size={1} color="#BFD7ED" />
                <Controls className="bg-white border-slate-100 shadow-xl rounded-xl" />
              </ReactFlow>

              {nodes.length === 0 && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none text-slate-400">
                    <MousePointer2 size={64} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-center">
                      Crea la primera escena para {selectedProject.title}
                    </p>
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* MODAL DE ESCRITURA */}
      <AnimatePresence>
        {isWriting && (
          <ManuscriptProcesor 
            projectId={selectedProject.id}
            initialData={editingScene}
            onSave={handleFinishScene} 
            onClose={() => {
              setIsWriting(false);
              setEditingScene(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EscenasPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">Cargando escenas...</div>}>
      <EscenasPageInner />
    </Suspense>
  );
}