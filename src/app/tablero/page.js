"use client";

import React, { useState, useCallback, useEffect } from "react";
import { MarkerType } from "@xyflow/react";
import { ReactFlowProvider } from "@xyflow/react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import TableroCanvas from "@/components/Tablero/TableroCanvas";
import TableroPanel from "@/components/Tablero/TableroPanel";
import TimelineView from "@/components/Tablero/TimelineView";
import IdeaCard from "@/components/Tablero/IdeaCard";
import NodeEditorPanel from "@/components/Tablero/NodeEditorPanel";

const STORAGE_KEY = "tablero-ocurrencias";

const IDEAS_INICIALES = [
  { title: "El secreto del Rey", content: "El rey no es humano...", tipo: "ocurrencia" },
  { title: "Mapa del Desierto", content: "Dunas que se mueven...", tipo: "ocurrencia" },
  { title: "La traición", content: "Un aliado cercano...", tipo: "hecho" },
];

function createNode(data, position = { x: 100, y: 100 }) {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "occurrence",
    position: {
      x: position.x + (Math.random() - 0.5) * 80,
      y: position.y + (Math.random() - 0.5) * 80,
    },
    data: {
      label: data.title,
      title: data.title,
      content: data.content,
      tipo: data.tipo || "ocurrencia",
      estado: data.estado || "cruda",
      emocion: data.emocion || null,
      emotionColor: data.emotionColor || null,
      marcadores: data.marcadores || [],
      capas: data.capas || [],
      archivada: data.estado === "archivada",
      creadoEn: new Date().toISOString(),
      historial: [{ accion: "creacion", fecha: new Date().toISOString() }],
    },
  };
}

function TableroPageInner() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { nodes: n, edges: e } = JSON.parse(raw);
        if (Array.isArray(n) && n.length > 0) {
          setNodes(n);
        }
        if (Array.isArray(e) && e.length > 0) {
          setEdges(e);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ nodes, edges })
        );
      } catch (_) {}
    }
  }, [nodes, edges]);

  const addNode = useCallback(
    (data) => {
      const offset = nodes.length * 80;
      const newNode = createNode(data, { x: 150 + offset, y: 150 + offset });
      setNodes((prev) => [...prev, newNode]);
    },
    [nodes.length]
  );

  const filtroActivo = React.useMemo(() => {
    const f = {};
    if (filtroTipo) f.tipo = filtroTipo;
    if (filtroEmocion) f.emocion = filtroEmocion;
    if (filtroEstado) f.estado = filtroEstado;
    return Object.keys(f).length ? f : null;
  }, [filtroTipo, filtroEmocion, filtroEstado]);

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
  }, []);

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
          id: `e-${e.source}-${e.target}-${Date.now()}`,
          source: e.source,
          target: e.target,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "#7BA3C9", strokeWidth: 2, strokeDasharray: "10 6" },
        })),
      ]);
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

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-64" : "ml-24"} p-6 flex flex-col h-screen`}
      >
        <Header title="Tablero de Ocurrencias" user={{ name: "Patito Sexy" }} />

        <div className="flex flex-1 gap-6 overflow-hidden mt-4">
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
                  nodes={modoEmocion ? aplicarModoEmocion()(nodes) : nodes}
                  setNodes={setNodes}
                  edges={edges}
                  setEdges={setEdges}
                  filtroActivo={filtroActivo}
                  capaActiva={capaActiva}
                  mostrarArchivadas={mostrarArchivadas}
                  edgeStyle={edgeStyle}
                  edgeColor={edgeColor}
                  onNodeClick={(n) => setNodoSeleccionado(n)}
                />
              </div>

              <div className="flex gap-6">
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
                  onVerTimeline={() => setVistaTimeline(true)}
                  nodosAislados={nodosAislados}
                  nodosSinImpacto={nodosSinImpacto}
                  edgeStyle={edgeStyle}
                  setEdgeStyle={setEdgeStyle}
                  edgeColor={edgeColor}
                  setEdgeColor={setEdgeColor}
                  onSugerirConexiones={sugerirConexiones}
                />

                <div className="w-64 bg-[#FEF9E7] rounded-[40px] p-6 flex flex-col border border-amber-100 shadow-sm">
                  <h3 className="font-black text-lg text-orange-800 mb-4 flex items-center gap-2">
                    Ideas para añadir
                  </h3>
                  <div className="space-y-3 overflow-y-auto">
                    {IDEAS_INICIALES.map((idea, i) => (
                      <IdeaCard
                        key={i}
                        title={idea.title}
                        content={idea.content}
                        tipo={idea.tipo}
                        onClick={addNode}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function TableroPage() {
  return (
    <ReactFlowProvider>
      <TableroPageInner />
    </ReactFlowProvider>
  );
}
