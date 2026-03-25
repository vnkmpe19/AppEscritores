"use client";
import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, ImageIcon, FileDown, Lightbulb, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import OcurrenciasDrawer from './OcurrenciasDrawer';

export default function ManuscriptProcesor({ onSave, onClose, initialData = null }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [title, setTitle] = useState(initialData?.label || '');
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: initialData?.content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: { 
        class: 'prose prose-sm md:prose-lg focus:outline-none max-w-full min-h-[600px] text-slate-700 font-serif leading-relaxed' 
      },
    },
  });

  if (!editor) return null;

  const exportToWord = () => {
    const content = editor.getHTML();
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head>
      <body style="font-family: 'Times New Roman', serif; padding: 50px;">
        <h1 style="text-align: center;">${title || 'Escena Sin Título'}</h1>
        ${content}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    saveAs(blob, `${title || 'escena'}.doc`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 md:p-4"
    >
      <div className="bg-white w-full max-w-6xl h-[100dvh] md:h-[95vh] md:rounded-[40px] flex flex-col overflow-hidden shadow-2xl relative">
        
        <div className="bg-white px-4 py-3 md:px-8 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 shadow-sm shrink-0">
          
          <div className="flex items-center gap-1 md:gap-2 bg-slate-50 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
            <ToolbarButton 
              active={editor.isActive('bold')} 
              onClick={() => editor.chain().focus().toggleBold().run()} 
              icon={<Bold size={18} className="md:w-5 md:h-5"/>} 
            />
            <ToolbarButton 
              active={editor.isActive('italic')} 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
              icon={<Italic size={18} className="md:w-5 md:h-5"/>} 
            />
            <ToolbarButton 
              active={editor.isActive('underline')} 
              onClick={() => editor.chain().focus().toggleUnderline().run()} 
              icon={<UnderlineIcon size={18} className="md:w-5 md:h-5"/>} 
            />
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 shrink-0">
              <ImageIcon size={18} className="md:w-5 md:h-5"/>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => editor.chain().focus().setImage({ src: ev.target.result }).run();
                reader.readAsDataURL(file);
              }
            }} />
          </div>
          
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <button onClick={exportToWord} className="text-blue-600 font-bold text-[10px] md:text-[11px] uppercase tracking-wider hover:bg-blue-50 px-3 py-2 md:px-4 md:py-2 rounded-xl transition-colors flex items-center gap-2">
                <FileDown size={16} className="md:w-[18px] md:h-[18px]"/> <span className="hidden lg:inline">Word</span>
              </button>
              <button onClick={() => setShowDrawer(true)} className="bg-amber-50 text-amber-700 px-3 py-2 md:px-5 md:py-2 rounded-full font-bold text-[10px] md:text-[11px] uppercase tracking-wider flex items-center gap-2">
                <Lightbulb size={16}/> <span className="hidden lg:inline">Ocurrencias</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSave({ 
                  id: initialData?.id || `sc-${Date.now()}`, 
                  label: title || "Sin título", 
                  content: editor.getHTML(),
                  summary: editor.getText().substring(0, 80) + "..." 
                })} 
                className="bg-slate-900 text-white px-4 py-2 md:px-8 md:py-2.5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2"
              >
                <Check size={16} className="md:w-[18px] md:h-[18px]"/> <span className="hidden sm:inline">Guardar</span>
              </button>
              <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-[#F8FAFC] flex justify-center custom-scrollbar">
          <div className="bg-white w-full max-w-[816px] shadow-sm border border-slate-200 p-6 md:p-12 lg:p-24 min-h-[100vh] lg:min-h-[1056px] rounded-sm relative mb-10 md:mb-20">
             
             <div className="absolute left-4 md:left-16 top-0 bottom-0 w-px bg-red-50" />
             
             <div className="pl-4 md:pl-0">
               <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Título de la escena..." 
                  className="w-full text-2xl md:text-4xl font-serif font-black mb-6 md:mb-10 outline-none bg-transparent placeholder:text-slate-200" 
               />
               <EditorContent editor={editor} />
             </div>
             
          </div>
        </div>

        <OcurrenciasDrawer 
          isOpen={showDrawer} 
          onClose={() => setShowDrawer(false)} 
          onInsert={(text) => editor.chain().focus().insertContent(text).run()} 
          projectId={initialData?.proyecto_id}
        />
      </div>
    </motion.div>
  );
}

function ToolbarButton({ active, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-1.5 md:p-2 rounded-xl transition-all shrink-0 ${active ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:bg-white'}`}
    >
      {icon}
    </button>
  );
}