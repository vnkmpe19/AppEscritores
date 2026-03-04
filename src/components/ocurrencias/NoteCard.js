"use client";
import React, { useState, useRef } from 'react';
import { MoreVertical, FileText, FileImage, FileDown, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function NoteCard({ note, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const noteRef = useRef(null);

  const exportPDF = async () => {
    const canvas = await html2canvas(noteRef.current);
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
    pdf.save(`${note.title}.pdf`);
  };

  const exportPNG = async () => {
    const canvas = await html2canvas(noteRef.current);
    const link = document.createElement('a');
    link.download = `${note.title}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportDOC = () => {
    const content = `${note.title}\n\n${note.content || note.items?.map(i => `- ${i.text}`).join('\n')}`;
    saveAs(new Blob([content], { type: "application/msword" }), `${note.title}.doc`);
  };

  return (
    <div 
      ref={noteRef}
      className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow group relative cursor-grab active:cursor-grabbing"
    >
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
          <MoreVertical size={20} />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-2 overflow-hidden">
            <button onClick={exportPDF} className="flex items-center gap-3 px-4 py-2.5 text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileDown size={16}/> PDF</button>
            <button onClick={exportPNG} className="flex items-center gap-3 px-4 py-2.5 text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileImage size={16}/> PNG</button>
            <button onClick={exportDOC} className="flex items-center gap-3 px-4 py-2.5 text-xs w-full hover:bg-slate-50 text-slate-600 font-bold transition-colors"><FileText size={16}/> DOC</button>
            <div className="h-px bg-slate-50 my-1" />
            <button onClick={onDelete} className="flex items-center gap-3 px-4 py-2.5 text-xs w-full hover:bg-red-50 text-red-500 font-bold transition-colors"><Trash2 size={16}/> Eliminar</button>
          </div>
        )}
      </div>

      <h3 className="font-black text-xl text-slate-800 mb-4 pr-8 leading-tight">{note.title}</h3>
      {note.type === 'list' ? (
        <div className="space-y-2">
          {note.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border ${item.done ? 'bg-[#BFD7ED] border-[#BFD7ED]' : 'border-slate-200'}`} />
              <span className={`text-sm font-medium ${item.done ? 'line-through text-slate-300' : 'text-slate-600'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-6 font-medium italic">
          {`"${note.content}"`}
        </p>
      )}
    </div>
  );
}