"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit3, SearchX, Sparkles } from 'lucide-react';

// IMPORTACIÓN DE TUS COMPONENTES ORGANIZADOS
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import NoteCard from '@/components/ocurrencias/NoteCard';
import NoteEditor from '@/components/ocurrencias/NoteEditor';

export default function OcurrenciasPage() {
  // --- ESTADOS ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [user, setUser] = useState({ name: 'Patito Sexy', role: 'Usuario' });
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [busqueda, setBusqueda] = useState(""); // Estado para el buscador

  const notasFiltradas = notes.filter(note => 
    note.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    note.content.toLowerCase().includes(busqueda.toLowerCase())
  );

  const saveNote = (noteData) => {
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...noteData, id: n.id } : n));
    } else {
      const newId = Date.now();
      setNotes([{ ...noteData, id: newId }, ...notes]);
    }
    closeEditor();
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNotes(items);
  };

  const handleDoubleClick = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-x-hidden">
      
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        viewMode="notes" 
      />

      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-4 md:p-8`}>
        
        <Header 
          user={user} 
          onLogout={() => setUser(null)} 
          onSearch={(termino) => setBusqueda(termino)} 
          title="Ocurrencias" 
        />

        <div className="max-w-6xl mx-auto relative min-h-[500px]">
          
          {busqueda !== "" && notasFiltradas.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center gap-4">
              <div className="p-4 bg-[#FFB7C5]/30 rounded-full text-[#FF5C5C]">
                <SearchX size={48} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">No encontramos coincidencias</h3>
                <p className="text-slate-500 font-medium max-w-xs mt-2 leading-relaxed">
                No hay notas que contengan <span className="text-[#FF5C5C] font-bold italic">&quot;{busqueda}&quot;</span>.
                </p>
              </div>
              <button 
                onClick={() => setBusqueda("")}
                className="mt-2 text-xs font-black text-[#FF5C5C] hover:text-[#FFB7C5] transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <Sparkles size={14} /> Ver todas las ocurrencias
              </button>
              </div>
            </motion.div>
            ) : notes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-96 text-slate-400">
              <Edit3 size={64} className="mb-4 opacity-40" />
              <p className="font-bold tracking-tight opacity-60">Haz clic en la bombilla para capturar una idea</p>
            </motion.div>
            ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="notes-grid" direction="horizontal">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {notasFiltradas.map((note, index) => (
                      <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            onDoubleClick={() => handleDoubleClick(note)}
                          >
                            <NoteCard 
                              note={note} 
                              onDelete={() => setNotes(notes.filter(n => n.id !== note.id))}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </main>

      <div className="fixed bottom-10 right-10 z-[60] flex flex-col items-end gap-4">
        <AnimatePresence>
          {showEditor && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <NoteEditor 
                onSave={saveNote} 
                onClose={closeEditor} 
                data={editingNote} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => {
            if (showEditor) closeEditor();
            else setShowEditor(true);
          }}
          className="bg-white p-4 rounded-full shadow-2xl border-2 border-[#E8F5A2] hover:scale-110 active:scale-95 transition-all group"
        >
          <Image 
            src="/bombilla.png" 
            alt="Nueva Idea" 
            width={56}
            height={56}
            className={`transition-transform duration-300 ${showEditor ? 'rotate-12 scale-90' : ''}`} 
          />
          <div className="absolute -top-2 -right-2 bg-[#FF5C5C] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={16} />
          </div>
        </button>
      </div>

    </div>
  );
}