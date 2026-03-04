"use client";

import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Importamos tu nodo personalizado
import OccurrenceNode from "./OccurrenceNode";

const nodeTypes = {
  occurrence: OccurrenceNode,
};

export default function TableroCanvas({
  nodes,
  setNodes,
  edges,
  setEdges,
  edgeStyle,
  edgeColor,
  onNodeClick,
}) {
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: "smoothstep",
        animated: edgeStyle === "fragmentada",
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
        style: {
          stroke: edgeColor,
          strokeWidth: 3,
          strokeDasharray: edgeStyle === "punteada" ? "10 6" : "0",
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, edgeStyle, edgeColor]
  );

  return (
    <div className="w-full h-full bg-white rounded-[40px] shadow-inner border border-slate-100 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node)}
        nodeTypes={nodeTypes}
        fitView
        // Estilos de la cuadrícula de fondo
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        <Background variant="dots" gap={20} size={1} color="#F1C9C6" />
        <Controls className="bg-white border-slate-100 shadow-lg rounded-xl overflow-hidden" />
      </ReactFlow>
      
      {/* Indicador visual de modo edición */}
      <div className="absolute top-6 left-6 pointer-events-none z-10">
        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Modo: Mapa Conceptual
          </p>
        </div>
      </div>
    </div>
  );
}