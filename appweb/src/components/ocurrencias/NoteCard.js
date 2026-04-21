"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FileText, FileImage, FileDown, Trash2 } from 'lucide-react';
// Importaciones dinámicas dentro de las funciones para evitar errores de SSR en Vercel/Build

export default function NoteCard({ note, onDelete, onToggleItem }) {
  const [showMenu, setShowMenu] = useState(false);
  const noteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const exportPDF = async () => {
    setShowMenu(false);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const canvas = await html2canvas(noteRef.current);
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
      pdf.save(`${note.title}.pdf`);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
      alert("No se pudo generar el PDF. Inténtalo de nuevo.");
    }
  };

  const exportPNG = async () => {
    setShowMenu(false);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(noteRef.current);
      const link = document.createElement('a');
      link.download = `${note.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("Error al exportar PNG:", err);
    }
  };

  const exportDOC = async () => {
    setShowMenu(false);
    try {
      const { saveAs } = await import('file-saver');
      const content = `${note.title}\n\n${note.content || note.items?.map(i => `- ${i.text}`).join('\n')}`;
      saveAs(new Blob([content], { type: "application/msword" }), `${note.title}.doc`);
    } catch (err) {
      console.error("Error al exportar DOC:", err);
    }
  };

  return (
    <div ref={noteRef} className="bg-white p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group relative cursor-pointer break-inside-avoid mb-4 sm:mb-6">
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 menu-container">
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors shadow-sm">
          <MoreVertical size={16} className="sm:w-5 sm:h-5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-2xl z-30 py-1.5 sm:py-2 overflow-hidden">
            <button onClick={exportPDF} className="flex items-center gap-3 px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileDown size={14} className="sm:w-4 sm:h-4"/> Exportar PDF</button>
            <button onClick={exportPNG} className="flex items-center gap-3 px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileImage size={14} className="sm:w-4 sm:h-4"/> Exportar PNG</button>
            <button onClick={exportDOC} className="flex items-center gap-3 px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileText size={14} className="sm:w-4 sm:h-4"/> Exportar DOC</button>
            <div className="h-px bg-slate-100 my-1" />
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(); }} className="flex items-center gap-3 px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs w-full hover:bg-red-50 text-red-500 font-bold transition-colors"><Trash2 size={14} className="sm:w-4 sm:h-4"/> Eliminar</button>
          </div>
        )}
      </div>

      <h3 className="font-black text-lg sm:text-xl text-slate-800 mb-3 sm:mb-4 pr-8 sm:pr-10 leading-tight">{note.title}</h3>
      
      {(note.imagen_url || note.foto || note.imagen) && (
        <div className="rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-50 bg-slate-50">
          <img 
            src={note.imagen_url || note.foto || note.imagen} 
            alt="Imagen adjunta" 
            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}

      {note.type === 'list' && note.items ? (
        <div className="space-y-2.5 sm:space-y-3 mt-1">
          {note.items.map((item, i) => (
            <div key={i} className="flex items-start sm:items-center gap-2.5 sm:gap-3 cursor-pointer group/item" onClick={() => onToggleItem && onToggleItem(i)}>
              <div className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors mt-0.5 ${item.done ? 'bg-[#BFD7ED] border-[#BFD7ED]' : 'border-slate-300 group-hover/item:border-[#BFD7ED]'}`}>
                {item.done && (
                  <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium leading-snug transition-colors ${item.done ? 'line-through text-slate-300' : 'text-slate-600 group-hover/item:text-slate-800'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-6 font-medium italic whitespace-pre-wrap">{`"${note.content || ''}"`}</p>
      )}
    </div>
  );
}