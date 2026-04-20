"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/app/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { 
  LayoutGrid, Plus, Filter, X, ArrowLeft, Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import Bombilla from '@/components/common/Bombilla';
import TableroCanvas from "@/components/Tablero/TableroCanvas";
import TableroPanel from "@/components/Tablero/TableroPanel";
import IdeaCard from "@/components/Tablero/IdeaCard";
import TimelineView from "@/components/Tablero/TimelineView";
import NodeEditorPanel from "@/components/Tablero/NodeEditorPanel";
import Libreta from '@/components/proyectos/Libreta';

export default function TableroClient() {
  const searchParams = useSearchParams();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projects, setProjects] = useState([]);
  const [currentProyectoId, setCurrentProyectoId] = useState(searchParams.get('proyecto_id'));
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ name: 'Cargando...' });

  // Controles de UI
  const [showMobilePanels, setShowMobilePanels] = useState(false);
  const [vistaTimeline, setVistaTimeline] = useState(false);
  const [ordenTimeline, setOrdenTimeline] = useState('fecha');
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  // Filtros y Capas
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEmocion, setFiltroEmocion] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [capaActiva, setCapaActiva] = useState('todas');
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);
  const [modoEmocion, setModoEmocion] = useState(false);

  // Estética de conexiones
  const [edgeStyle, setEdgeStyle] = useState('smoothstep');
  const [edgeColor, setEdgeColor] = useState('#FFB7C5');

  // Banco de ocurrencias
  const [ocurrenciasList, setOcurrenciasList] = useState([]);

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: perfil } = await supabase
        .from('usuarios')
        .select('nombre_usuario')
        .eq('id', authUser.id)
        .single();
      
      setCurrentUser({ name: perfil?.nombre_usuario || authUser.email.split('@')[0] });
      await getProjects(authUser.id);
      
      if (currentProyectoId) {
        await cargarDatosProyecto(currentProyectoId);
      }
    }
  };

  const getProjects = async (userId) => {
    const { data } = await supabase.from('proyectos').select('*').eq('id_usuario', userId).order('fecha_actualizacion', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const cargarDatosProyecto = async (pId) => {
    setLoading(true);
    const { data: proj } = await supabase.from('proyectos').select('*').eq('id', pId).single();
    if (proj) setSelectedProject(proj);

    // Cargar ideas (nodos) y conexiones (bordes)
    const { data: dbIdeas } = await supabase.from('ideas').select('*').eq('id_proyecto', pId);
    if (dbIdeas) {
      const formattedNodes = dbIdeas.map(idea => ({
        id: idea.id,
        type: 'custom',
        position: { x: idea.eje_x || 0, y: idea.eje_y || 0 },
        data: {
          title: idea.titulo,
          content: idea.texto,
          tipo: idea.tipo,
          estado: idea.estado,
          emocion: idea.emocion,
          color: idea.color,
          onChange: onChangeLcd
        }
      }));
      setNodes(formattedNodes);

      const ideaIds = dbIdeas.map(i => i.id);
      const { data: dbEdges } = await supabase.from('conexiones_ideas').select('*').in('id_origen', ideaIds);
      if (dbEdges) {
        setEdges(dbEdges.map(edge => ({
          id: edge.id,
          source: edge.id_origen,
          target: edge.id_destino,
          type: edgeStyle,
          style: { stroke: edgeColor, strokeWidth: 3 },
          markerEnd: { type: 'arrowclosed', color: edgeColor }
        })));
      }
    }
    
    // Cargar ocurrencias
    const { data: ocs } = await supabase.from('ocurrencias').select('*').eq('id_proyecto', pId);
    if (ocs) setOcurrenciasList(ocs);
    
    setLoading(false);
  };

  const onChangeLcd = () => {
    // Marcar que hay cambios pendientes o simplemente refrescar
  };

  const handleNodesDelete = useCallback(async (nodesToDelete) => {
    const ids = nodesToDelete.map(n => n.id);
    await supabase.from('ideas').delete().in('id', ids);
  }, []);

  const handleEdgesDelete = useCallback(async (edgesToDelete) => {
    const ids = edgesToDelete.map(e => e.id);
    await supabase.from('conexiones_ideas').delete().in('id', ids);
  }, []);

  const updateNode = async (id, newData) => {
    await supabase.from('ideas').update({
      titulo: newData.title,
      texto: newData.content,
      tipo: newData.tipo,
      estado: newData.estado,
      emocion: newData.emocion,
      color: newData.color
    }).eq('id', id);
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...newData } } : n));
  };

  const addNode = async (inputData = {}) => {
    if (!currentProyectoId) return;
    const { data: idea, error } = await supabase.from('ideas').insert([{
      id_proyecto: currentProyectoId,
      titulo: inputData.title || 'Nueva Idea',
      texto: inputData.content || '',
      tipo: inputData.tipo || 'idea',
      eje_x: 100,
      eje_y: 100,
      estado: 'borrador'
    }]).select().single();

    if (idea) {
      setNodes(nds => nds.concat({
        id: idea.id,
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          title: idea.titulo,
          content: idea.texto,
          tipo: idea.tipo,
          estado: idea.estado,
          emocion: idea.emocion,
          color: idea.color,
          onChange: onChangeLcd
        }
      }));
    }
  };

  const sugerirConexiones = () => {
    // Lógica de IA para sugerir conexiones
  };

  const nodosFiltrados = useMemo(() => {
    return nodes.filter(n => {
      const mTipo = filtroTipo === 'todos' || n.data.tipo === filtroTipo;
      const mEmo = filtroEmocion === 'todas' || n.data.emocion === filtroEmocion;
      const mEst = filtroEstado === 'todos' || n.data.estado === filtroEstado;
      const mCap = capaActiva === 'todas' || n.data.tipo === (capaActiva === 'personajes' ? 'personaje' : 'idea');
      const mArch = mostrarArchivadas ? true : n.data.estado !== 'archivado';
      return mTipo && mEmo && mEst && mCap && mArch;
    });
  }, [nodes, filtroTipo, filtroEmocion, filtroEstado, capaActiva, mostrarArchivadas]);

  const aplicarModoEmocion = () => (nds) => nds.map(n => ({
    ...n,
    data: { ...n.data, customStyle: { border: `2px solid ${n.data.color || '#ddd'}` } }
  }));

  const nodosAislados = useMemo(() => {
    const connectedIds = new Set();
    edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target); });
    return nodes.filter(n => !connectedIds.has(n.id)).length;
  }, [nodes, edges]);

  const nodosSinImpacto = 0; // Placeholder

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} viewMode="tablero" />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-4 md:p-8 flex flex-col h-screen overflow-hidden`}>
        
        {!currentProyectoId ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto mt-10 w-full">
            <Header user={currentUser} onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} isSidebarExpanded={isSidebarExpanded} title="Tablero" />
            <h2 className="text-2xl font-black text-slate-800 mb-8 mt-10">Selecciona un Proyecto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map((p) => (
                <div key={p.id} onClick={() => { setCurrentProyectoId(p.id); cargarDatosProyecto(p.id); }} className="group bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center flex flex-col items-center h-fit">
                  <div className={`w-20 h-24 mb-6 rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg ${p.color || 'bg-[#BFD7ED]'} flex items-center justify-center p-2`}>
                     {p.portada ? <img src={p.portada} className="w-full h-full object-cover rounded-lg" /> : <div className="w-full h-full border-2 border-white/30 rounded-lg" />}
                  </div>
                  <h3 className="text-xl font-serif font-black text-slate-900 mb-2 truncate w-full">{p.titulo}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#F497A9]">Abrir Tablero</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-hidden">
               <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm p-4 rounded-[30px] border border-white/50">
                  <button onClick={() => setCurrentProyectoId(null)} className="flex items-center gap-2 text-slate-400 hover:text-[#FF5C5C] font-bold text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Cambiar Proyecto
                  </button>
                  <div className="flex flex-col items-end">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tablero de:</p>
                     <p className="text-sm font-serif font-black text-slate-900">{selectedProject?.titulo}</p>
                  </div>
               </div>

               <div className="flex flex-1 gap-6 overflow-hidden">
                 {vistaTimeline ? (
                   <div className="flex-1">
                     <TimelineView
                       nodes={nodes}
                       edges={edges}
                       ordenPor={ordenTimeline}
                       setOrdenPor={setOrdenTimeline}
                       onVolver={() => setVistaTimeline(false)}
                     />
                   </div>
                 ) : (
                   <>
                     <div className="flex-1 min-w-0">
                       <TableroCanvas
                         nodes={modoEmocion ? aplicarModoEmocion()(nodosFiltrados) : nodosFiltrados}
                         setNodes={(fn) => { setNodes(fn); onChangeLcd(); }}
                         edges={edges}
                         setEdges={(fn) => { setEdges(fn); onChangeLcd(); }}
                         edgeStyle={edgeStyle}
                         edgeColor={edgeColor}
                         onNodesDelete={handleNodesDelete}
                          onEdgesDelete={handleEdgesDelete}
                          onNodeClick={(n) => setNodoSeleccionado(n)}
                       />
                     </div>

                      <button
                        onClick={() => setShowMobilePanels(!showMobilePanels)}
                        className="md:hidden fixed bottom-6 right-6 z-[60] bg-[#FF5C5C] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                      >
                        {showMobilePanels ? <X size={24} /> : <Filter size={24} />}
                      </button>

                      <AnimatePresence>
                        {(showMobilePanels || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                          <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            className={`${showMobilePanels ? 'fixed inset-0 z-[55] bg-white/95 p-6 flex flex-col gap-6 pt-20 overflow-y-auto' : 'hidden md:flex flex-col gap-6'}`}
                          >
                            {nodoSeleccionado && (
                              <NodeEditorPanel
                                node={nodoSeleccionado}
                                onClose={() => setNodoSeleccionado(null)}
                                onUpdate={updateNode}
                              />
                            )}
                            <TableroPanel
                              filtroTipo={filtroTipo}
                              setFiltroTipo={setFiltroTipo}
                              filtroEmocion={filtroEmocion}
                              setFiltroEmocion={setFiltroEmocion}
                              filtroEstado={filtroEstado}
                              setFiltroEstado={setFiltroEstado}
                              capaActiva={capaActiva}
                              setCapaActiva={setCapaActiva}
                              mostrarArchivadas={mostrarArchivadas}
                              setMostrarArchivadas={setMostrarArchivadas}
                              modoEmocion={modoEmocion}
                              setModoEmocion={setModoEmocion}
                              onVerTimeline={() => { setVistaTimeline(true); setShowMobilePanels(false); }}
                              nodosAislados={nodosAislados}
                              nodosSinImpacto={nodosSinImpacto}
                              edgeStyle={edgeStyle}
                              setEdgeStyle={setEdgeStyle}
                              edgeColor={edgeColor}
                              setEdgeColor={setEdgeColor}
                              onSugerirConexiones={sugerirConexiones}
                            />

                            <div className="w-full md:w-64 bg-[#FEF9E7] rounded-[40px] p-6 flex flex-col border border-amber-100 shadow-sm overflow-hidden min-h-[400px] md:min-h-0">
                              <h3 className="font-black text-lg text-orange-800 mb-4 flex items-center gap-2 flex-shrink-0">
                                <Zap size={18} /> Ocurrencias
                              </h3>
                              <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                                {ocurrenciasList.length > 0 ? (
                                  ocurrenciasList.map((oc, i) => (
                                    <IdeaCard
                                      key={oc.id}
                                      title={oc.title}
                                      content={oc.content}
                                      tipo={oc.type === 'list' ? 'lista' : 'ocurrencia'}
                                      onClick={() => {
                                        addNode({
                                          title: oc.title,
                                          content: oc.content || '',
                                          tipo: 'ocurrencia'
                                        });
                                        if (window.innerWidth < 768) setShowMobilePanels(false);
                                      }}
                                    />
                                  ))
                                ) : (
                                  <p className="text-sm text-amber-700/60 font-medium italic text-center mt-4">No hay ocurrencias. Ve a Ocurrencias para crear una.</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
            </div>
          )}
      </main>
      <Bombilla />
    </div>
  );
}
