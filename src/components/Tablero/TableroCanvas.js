"use client";

import React, { useCallback } from "react";
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
    <div className="w-full h-full bg-white rounded-[24px] md:rounded-[40px] shadow-inner border border-slate-100 overflow-hidden relative min-h-[400px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node)}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={true}
        zoomOnPinch={true}
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background variant="dots" gap={20} size={1} color="#F1C9C6" />
        
        <Controls 
          showInteractive={false} 
          className="bg-white border-slate-100 shadow-xl rounded-2xl overflow-hidden m-2 md:m-4 scale-110 md:scale-100" 
        />
      </ReactFlow>      
      <div className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-none z-10">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm transition-all">
          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="hidden sm:inline">Modo:</span> Mapa Conceptual
          </p>
        </div>
      </div>
    </div>
  );
}