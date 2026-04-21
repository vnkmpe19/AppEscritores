import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export const useAppStore = create((set, get) => ({
  notes: [], 
  scenes: [], 
  edges: [],

  // --- LÓGICA DE NOTAS ---
  setNotes: (newNotes) => set({ notes: newNotes }),
  deleteNote: (id) => set((state) => ({ 
    notes: state.notes.filter(n => n.id !== id) 
  })),

  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
  deleteScene: (id) => set((state) => ({ 
    scenes: state.scenes.filter(s => s.id !== id),
    edges: state.edges.filter(e => e.source !== id && e.target !== id) 
  })),

  // conexiones
  onNodesChange: (changes) => set({
    scenes: applyNodeChanges(changes, get().scenes),
  }),
  onEdgesChange: (changes) => set({
    edges: applyEdgeChanges(changes, get().edges),
  }),
  onConnect: (connection) => set({
    edges: addEdge({ ...connection, style: { stroke: '#FFB7C5', strokeWidth: 3 }, animated: true }, get().edges),
  }),
  setScenes: (scenes) => set({ scenes }),
  setEdges: (edges) => set({ edges }),
  addNote: (note) => set((state) => ({ 
    notes: [...state.notes, { ...note, id: Date.now().toString() }] 
  })),
  setNotes: (notes) => set({ notes }),
}));