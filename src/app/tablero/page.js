"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { MarkerType } from "@xyflow/react";
import { ReactFlowProvider } from "@xyflow/react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import TableroCanvas from "@/components/Tablero/TableroCanvas";
import TableroPanel from "@/components/Tablero/TableroPanel";
import TimelineView from "@/components/Tablero/TimelineView";
import IdeaCard from "@/components/Tablero/IdeaCard";
import NodeEditorPanel from "@/components/Tablero/NodeEditorPanel";
import { supabase } from "@/app/lib/supabase";
import { Loader2, Cloud, CloudOff, FolderOpen, ArrowLeft, Filter, Zap, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function createNode(data, position = { x: 100, y: 100 }, customId = null) {
  return {
    id: customId || generateUUID(),
    type: "occurrence",
    position: {
      x: position.x + (Math.random() - 0.5) * 80,
      y: position.y + (Math.random() - 0.5) * 80,
    },
    data: {
      label: data.title || "Nueva Idea",
      title: data.title || "Nueva Idea",
      content: data.content || "",
      tipo: data.tipo || "ocurrencia",
      estado: data.estado || "cruda",
      emocion: data.emocion || null,
      emotionColor: data.emotionColor || null,
      marcadores: data.marcadores || [],
      capas: data.capas || [],
      archivada: data.estado === "archivada",
      creadoEn: data.creadoEn || new Date().toISOString(),
      historial: data.historial || [{ accion: "creacion", fecha: new Date().toISOString() }],
    },
  };
}

function TableroPageInner() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('proyecto_id');

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [ocurrenciasList, setOcurrenciasList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentProyectoId, setCurrentProyectoId] = useState(initialProjectId);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [showMobilePanels, setShowMobilePanels] = useState(false); 
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState(null);
  const [filtroEmocion, setFiltroEmocion] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [capaActiva, setCapaActiva] = useState("todas");
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);
  const [modoEmocion, setModoEmocion] = useState(false);
  const [edgeStyle, setEdgeStyle] = useState("punteada");
  const [edgeColor, setEdgeColor] = useState("#7BA3C9");

  const [vistaTimeline, setVistaTimeline] = useState(false);
  const [ordenTimeline, setOrdenTimeline] = useState("narrativo");
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  useEffect(() => {
    cargarBaseDeDatos();
  }, []);

  const cargarBaseDeDatos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setCurrentUserId(user.id);

    if (currentProyectoId) {
      const { data: p } = await supabase.from('proyectos').select('*').eq('id', currentProyectoId).single();
      if (p) {
        setSelectedProject(p);
        await cargarDatosProyecto(currentProyectoId);
      } else {
        await cargarProyectosLista(user.id);
      }
    } else {
      await cargarProyectosLista(user.id);
    }
  };

  const cargarProyectosLista = async (userId) => {
    const { data } = await supabase.from('proyectos')
      .select('*').eq('id_usuario', userId).order('fecha_actualizacion', { ascending: false });
    if (data) setProjects(data);
    setLoading(false);
  };

  const cargarDatosProyecto = async (pId) => {    const { data: ocurrencias } = await supabase.from('ocurrencias')
      .select('*').eq('id_proyecto', pId).order('orden', { ascending: true });
    
    if (ocurrencias) setOcurrenciasList(ocurrencias);
    const { data: dbIdeas } = await supabase.from('ideas').select('*').eq('id_proyecto', pId);
        if (dbIdeas && dbIdeas.length > 0) {
      const ideaIds = dbIdeas.map(i => i.id);
      
      const reactFlowNodes = dbIdeas.map(idea => {
         return createNode({
            title: idea.titulo,
            content: idea.texto,
            tipo: idea.tipo,
            estado: idea.estado,
            emocion: idea.emocion,
            emotionColor: idea.color,
         }, { x: idea.eje_x || 0, y: idea.eje_y || 0 }, idea.id);
      });
      setNodes(reactFlowNodes);

      const { data: dbEdges } = await supabase.from('conexiones_ideas').select('*').in('id_origen', ideaIds);
      if (dbEdges) {
         const reactFlowEdges = dbEdges.map(edge => ({
            id: edge.id,
            source: edge.id_origen,
            target: edge.id_destino,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
            style: { stroke: edgeColor, strokeWidth: 3 }
         }));
         setEdges(reactFlowEdges);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (hasUnsavedChanges && currentProyectoId && currentUserId) {
      setSyncStatus('saving');
      const timer = setTimeout(() => {
        saveToDatabase();
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [nodes, edges, hasUnsavedChanges]);

  const saveToDatabase = async () => {
    if (!currentProyectoId) return;
    try {
      const dbIdeas = nodes.map(n => ({
        id: n.id,
        id_proyecto: currentProyectoId,
        id_usuario: currentUserId,
        tipo: n.data.tipo || 'Idea',
        estado: n.data.estado || 'cruda',
        emocion: n.data.emocion,
        titulo: n.data.title || 'Sin Título',
        texto: n.data.content || '',
        color: n.data.emotionColor,
        eje_x: n.position.x,
        eje_y: n.position.y
      }));
      if (dbIdeas.length > 0) {
        await supabase.from('ideas').upsert(dbIdeas);
      }
      const dbEdges = edges.map(e => ({
        id: (e.id && e.id.length === 36) ? e.id : generateUUID(), 
        id_origen: e.source,
        id_destino: e.target,
        tipo_conexion: "reactflow"
      }));

      if (dbEdges.length > 0) {
        await supabase.from('conexiones_ideas').upsert(dbEdges, { onConflict: 'id' });
      }

      setHasUnsavedChanges(false);
      setSyncStatus('synced');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const onChangeLcd = () => { setHasUnsavedChanges(true); };

  const addNode = useCallback(
    (data) => {
      const offset = nodes.length * 80;
      const newNode = createNode(data, { x: 150 + offset, y: 150 + offset });
      setNodes((prev) => [...prev, newNode]);
      onChangeLcd();
    },
    [nodes.length]
  );

  const nodosFiltrados = React.useMemo(() => {
    return nodes.filter((n) => {
      if (!mostrarArchivadas && n.data?.archivada) return false;
      if (filtroTipo && n.data?.tipo !== filtroTipo) return false;
      if (filtroEmocion && n.data?.emocion !== filtroEmocion) return false;
      if (filtroEstado && n.data?.estado !== filtroEstado) return false;
      if (capaActiva && capaActiva !== 'todas') {
        const capas = n.data?.capas || [];
        if (!capas.includes(capaActiva)) return false;
      }
      return true;
    });
  }, [nodes, filtroTipo, filtroEmocion, filtroEstado, capaActiva, mostrarArchivadas]);

  const nodosAislados = React.useMemo(() => {
    const conectados = new Set();
    edges.forEach((e) => {
      conectados.add(e.source);
      conectados.add(e.target);
    });
    return nodes.filter((n) => !conectados.has(n.id) && !n.data?.archivada);
  }, [nodes, edges]);

  const nodosSinImpacto = React.useMemo(() => {
    const personajes = nodes.filter((n) => n.data?.tipo === "personaje");
    const conectados = new Set();
    edges.forEach((e) => {
      conectados.add(e.source);
      conectados.add(e.target);
    });
    return personajes.filter((n) => !conectados.has(n.id));
  }, [nodes, edges]);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...updates } }
          : n
      )
    );
    onChangeLcd();
  }, []);

  const handleNodesDelete = useCallback(async (nodesToDelete) => {
    if (!currentProyectoId) return;
    const ids = nodesToDelete.map(n => n.id);
    try {
      await supabase.from('ideas').delete().in('id', ids);
      setSyncStatus('synced');
    } catch (err) {
      console.error("Error deleting nodes:", err);
      setSyncStatus('error');
    }
  }, [currentProyectoId]);

  const handleEdgesDelete = useCallback(async (edgesToDelete) => {
    if (!currentProyectoId) return;
    const ids = edgesToDelete.map(e => e.id);
    try {
      await supabase.from('conexiones_ideas').delete().in('id', ids);
      setSyncStatus('synced');
    } catch (err) {
      console.error("Error deleting edges:", err);
      setSyncStatus('error');
    }
  }, [currentProyectoId]);

  const sugerirConexiones = useCallback(() => {
    const conMarcadores = nodes.filter(
      (n) => n.data?.marcadores?.length > 0 && !n.data?.archivada
    );
    const existentes = new Set(
      edges.map((e) => `${e.source}-${e.target}`)
    );
    const nuevas = [];
    for (let i = 0; i < conMarcadores.length; i++) {
      for (let j = i + 1; j < conMarcadores.length; j++) {
        const a = conMarcadores[i];
        const b = conMarcadores[j];
        const key1 = `${a.id}-${b.id}`;
        const key2 = `${b.id}-${a.id}`;
        if (existentes.has(key1) || existentes.has(key2)) continue;
        const common = a.data?.marcadores?.filter((m) =>
          b.data?.marcadores?.includes(m)
        );
        if (common?.length > 0) {
          nuevas.push({ source: a.id, target: b.id });
          existentes.add(key1);
        }
      }
    }
    if (nuevas.length > 0) {
      setEdges((prev) => [
        ...prev,
        ...nuevas.map((e) => ({
          id: generateUUID(),
          source: e.source,
          target: e.target,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#7BA3C9", strokeWidth: 2, strokeDasharray: "10 6" },
        })),
      ]);
      onChangeLcd();
      return nuevas.length;
    }
    return 0;
  }, [nodes, edges]);

  const aplicarModoEmocion = useCallback(() => {
    if (!modoEmocion) return null;
    const emotionColors = {
      alegria: "#FDE68A",
      tristeza: "#BFDBFE",
      tension: "#FECACA",
      misterio: "#DDD6FE",
      esperanza: "#BBF7D0",
    };
    return (nodes) =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          emotionColor:
            emotionColors[n.data?.emocion] || n.data?.emotionColor || "#FFFFFF",
        },
      }));
  }, [modoEmocion]);

  return (
    <div className="flex min-h-screen bg-[#FDF5F5] font-sans text-slate-800 overflow-hidden">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        viewMode="tablero"
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'} ml-0 p-6 flex flex-col h-screen relative`}>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
           {syncStatus === 'saving' && <span className="bg-[#BFD7ED] text-blue-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-2 border border-white transition-opacity"><Loader2 size={12} className="animate-spin" /> Guardando en la Nube...</span>}
           {syncStatus === 'synced' && <span className="bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-2 transition-opacity"><Cloud size={12} /> Sincronizado</span>}
           {syncStatus === 'error' && <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2 shadow-sm transition-opacity"><CloudOff size={12} /> Error al guardar</span>}
        </div>

        <Header title="Tablero de Ocurrencias" onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} isSidebarExpanded={isSidebarExpanded} />

        <div className="flex flex-1 gap-6 overflow-hidden mt-4">
          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[40px] shadow-sm">
                <Loader2 size={40} className="animate-spin mb-4 text-[#FFB7C5]" />
                <p className="font-bold tracking-tight">Recuperando información...</p>
             </div>
          ) : !currentProyectoId ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
              className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-10 bg-white/50 rounded-[40px] backdrop-blur-sm border border-white/50">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">No tienes proyectos creados aún.</p>
                </div>
              ) : projects.map(p => (
                <div key={p.id} onClick={() => { setCurrentProyectoId(p.id); setSelectedProject(p); setLoading(true); cargarDatosProyecto(p.id); }} 
                     className="group bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-center flex flex-col items-center h-fit">
                  <div className={`w-20 h-24 mb-6 rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg ${p.color || 'bg-[#BFD7ED]'} flex items-center justify-center p-2`}>
                     {p.portada ? <img src={p.portada} className="w-full h-full object-cover rounded-lg" /> : <div className="w-full h-full border-2 border-white/30 rounded-lg" />}
                  </div>
                  <h3 className="text-xl font-serif font-black text-slate-900 mb-2 truncate w-full">{p.titulo}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#F497A9]">Abrir Tablero</p>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 overflow-hidden">
               <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm p-4 rounded-[30px] border border-white/50">
                  <Link href="/proyectos" className="flex items-center gap-2 text-slate-400 hover:text-[#FF5C5C] font-bold text-xs uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Cambiar Proyecto
                  </Link>
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
                            className={`${showMobilePanels ? 'fixed inset-0 z-[55] bg-white/95 p-6 flex flex-col gap-6 pt-20 overflow-y-auto' : 'hidden md:flex flex gap-6'}`}
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
        </div>
      </main>
    </div>
  );
}
export default function TableroPage() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FDF5F5]">Cargando tu tablero...</div>}>
        <TableroPageInner />
      </Suspense>
    </ReactFlowProvider>
  );
}