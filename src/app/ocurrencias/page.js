"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit3, SearchX, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import NoteCard from '@/components/ocurrencias/NoteCard';
import NoteEditor from '@/components/ocurrencias/NoteEditor';

export default function OcurrenciasPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [user, setUser] = useState({ name: 'Cargando...', role: 'Usuario' });
  const [proyectoId, setProyectoId] = useState(null);
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    inicializar();
  }, []);

  const inicializar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser({ name: user.user_metadata?.nombre || user.email.split('@')[0], role: 'Escritor' });
      const { data: proyectos } = await supabase
        .from('proyectos')
        .select('id')
        .eq('id_usuario', user.id)
        .order('fecha_actualizacion', { ascending: false })
        .limit(1);

      if (proyectos && proyectos.length > 0) {
        const pId = proyectos[0].id;
        setProyectoId(pId);
        cargarNotas(pId);
      } else {
        setLoading(false);
      }
    }
  };

  const cargarNotas = async (pId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ocurrencias')
      .select('*')
      .eq('id_proyecto', pId)
      .order('orden', { ascending: true })
      .order('fecha_creacion', { ascending: false });

    if (!error && data) setNotes(data);
    setLoading(false);
  };

  const notasFiltradas = notes.filter(note => 
    (note.title && note.title.toLowerCase().includes(busqueda.toLowerCase())) ||
    (note.content && note.content.toLowerCase().includes(busqueda.toLowerCase())) ||
    (note.type === 'list' && note.items?.some(i => i.text.toLowerCase().includes(busqueda.toLowerCase())))
  );

  const saveNote = async (noteData) => {
    if (!proyectoId) return alert("Necesitas un proyecto activo para guardar notas.");
    if (!noteData.title || noteData.title.trim() === '') noteData.title = "Idea sin título";

    const payload = {
      id_proyecto: proyectoId,
      title: noteData.title,
      type: noteData.items && noteData.items.length > 0 ? 'list' : 'text',
      content: noteData.content,
      items: noteData.items,
      orden: editingNote ? editingNote.orden : notes.length
    };

    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...n, ...payload } : n));
      await supabase.from('ocurrencias').update(payload).eq('id', editingNote.id);
    } else {
      const { data, error } = await supabase.from('ocurrencias').insert([payload]).select().single();
      if (!error && data) setNotes([data, ...notes]);
    }
    closeEditor();
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingNote(null);
  };

  const deleteNote = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta ocurrencia?")) {
      setNotes(notes.filter(n => n.id !== id));
      await supabase.from('ocurrencias').delete().eq('id', id);
    }
  };

  const handleToggleItem = async (notaId, itemIndex) => {
    const nota = notes.find(n => n.id === notaId);
    if (!nota || nota.type !== 'list') return;

    const nuevosItems = [...nota.items];
    nuevosItems[itemIndex].done = !nuevosItems[itemIndex].done;

    setNotes(notes.map(n => n.id === notaId ? { ...n, items: nuevosItems } : n));
    await supabase.from('ocurrencias').update({ items: nuevosItems }).eq('id', notaId);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(notasFiltradas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setNotes(items);

    const updates = items.map((item, index) => ({ id: item.id, orden: index }));
    for (const update of updates) {
      await supabase.from('ocurrencias').update({ orden: update.orden }).eq('id', update.id);
    }
  };

  const handleDoubleClick = (note) => {
    setEditingNote({ ...note, content: note.content || '', items: note.items || [] });
    setShowEditor(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF5F5] font-sans text-slate-800 overflow-x-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} viewMode="notes" />
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'ml-0 md:ml-20'} p-4 md:p-8 pt-20 md:pt-8 w-full`}>
        <Header user={user} onLogout={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} onSearch={setBusqueda} title="Ocurrencias" />

        <div className="max-w-6xl mx-auto relative min-h-[500px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 md:h-96 text-slate-400">
               <Loader2 size={48} className="animate-spin mb-4 text-[#FFB7C5]" />
               <p className="font-bold tracking-tight opacity-60">Recuperando tus ideas...</p>
             </div>
          ) : !proyectoId ? (
            <div className="flex flex-col items-center justify-center h-64 md:h-96 text-slate-400">
              <Edit3 size={64} className="mb-4 opacity-40 text-red-400" />
              <p className="font-bold tracking-tight opacity-60 text-center px-4">Necesitas crear o abrir un Proyecto primero.</p>
            </div>
          ) : busqueda !== "" && notasFiltradas.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-64 md:h-96 text-center px-4">
              <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center gap-4 w-full max-w-md">
                <div className="p-4 bg-[#FFB7C5]/30 rounded-full text-[#FF5C5C]">
                  <SearchX className="w-9 h-9 md:w-12 md:h-12" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-800">No hay coincidencias</h3>
                  <p className="text-slate-500 font-medium text-sm md:text-base max-w-xs mt-2 leading-relaxed">No hay notas con <span className="text-[#FF5C5C] font-bold italic">&quot;{busqueda}&quot;</span>.</p>
                </div>
                <button onClick={() => setBusqueda("")} className="mt-2 text-[10px] md:text-xs font-black text-[#FF5C5C] hover:text-[#FFB7C5] transition-colors uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} /> Ver todas</button>
              </div>
            </motion.div>
          ) : notes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 md:h-96 text-slate-400 px-4 text-center">
              <Edit3 className="mb-4 opacity-40 w-14 h-14 md:w-16 md:h-16" />
              <p className="font-bold tracking-tight opacity-60 text-sm md:text-base">Haz clic en la bombilla inferior para capturar una idea</p>
            </motion.div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="notes-grid" direction="horizontal">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-max">
                    {notasFiltradas.map((note, index) => (
                      <Draggable key={note.id.toString()} draggableId={note.id.toString()} index={index}>
                        {(p, snapshot) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} onDoubleClick={() => handleDoubleClick(note)} className={snapshot.isDragging ? "z-50" : ""} style={{ ...p.draggableProps.style }}>
                            <NoteCard note={note} onDelete={() => deleteNote(note.id)} onToggleItem={(itemIndex) => handleToggleItem(note.id, itemIndex)} />
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

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col items-end gap-4">
        <AnimatePresence>
          {showEditor && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] md:hidden" onClick={closeEditor} />
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="origin-bottom-right absolute bottom-20 right-0 md:bottom-24">
                <NoteEditor onSave={saveNote} onClose={closeEditor} data={editingNote} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <button onClick={() => showEditor ? closeEditor() : setShowEditor(true)} className="bg-white p-3 md:p-4 rounded-full shadow-2xl border-2 border-[#E8F5A2] hover:scale-110 active:scale-95 transition-all group z-10">
          <Image src="/bombilla.png" alt="Nueva Idea" width={40} height={40} className={`transition-transform duration-300 md:w-[56px] md:h-[56px] ${showEditor ? 'rotate-12 scale-90' : ''}`} />
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#FF5C5C] text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"><Plus size={14} className="md:w-4 md:h-4" /></div>
        </button>
      </div>
    </div>
  );
}