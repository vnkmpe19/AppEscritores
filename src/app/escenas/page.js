"use client";
import React, { useState, useMemo } from 'react'; // ya metí el useMemo
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Componentes comunes
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

// Componentes específicos
import ManuscriptProcesor from '@/components/escenas/ManuscriptProcesor';
import SceneCard from '@/components/escenas/SceneCard';

// Estados y librerías
import { useAppStore } from '@/store/useAppStore';
import { Plus, LayoutGrid, MousePointer2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const nodeTypes = { scene: SceneCard };

export default function EscenasPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  
  // Estados y funciones de useAppStore.js
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

  //Ya cachorra, no le llegaba el mapeo a los nodos
  const nodes = useMemo(() => {
    return scenes.map((s) => ({
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
  }, [scenes, deleteScene]); 

  const handleFinishScene = (sceneData) => {
    const existingNode = scenes.find(n => n.id === sceneData.id);
    
    if (!existingNode) {
      
      const newNode = {
        id: sceneData.id || `sc-${Math.random().toString(36).substr(2, 9)}`,
        type: 'scene',
        position: { x: 150, y: 150 },
        data: sceneData
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
    <div className="flex min-h-screen bg-[#FDF5F5] font-sans text-slate-800 overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} viewMode="escenas" />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-24'} p-6 flex flex-col h-screen`}>
        <Header title="Mapa de Escenas" user={{name: "Patito Sexy"}} />

        <div className="flex justify-between items-center mb-6">
          <div className="bg-white/60 backdrop-blur-md px-6 py-2 rounded-full border border-white shadow-sm flex items-center gap-3">
             <LayoutGrid size={16} className="text-[#BFD7ED]"/>
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Organización Visual • Arrastra para vincular
             </span>
          </div>
          
          <button 
            onClick={() => {
              setEditingScene(null);
              setIsWriting(true);
            }}
            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
          >
            <Plus size={18}/> Crear Nueva Escena
          </button>
        </div>

        <div className="flex-1 bg-white rounded-[50px] border border-slate-100 shadow-inner overflow-hidden relative">
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange} // Pal movimiento
            onEdgesChange={onEdgesChange} // Pa mover conexiones
            onConnect={onConnect}         // Pa crear vínculos
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
             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none text-slate-400">
                <MousePointer2 size={64} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-center">
                  Crea tu primera escena para empezar
                </p>
             </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isWriting && (
          <ManuscriptProcesor 
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