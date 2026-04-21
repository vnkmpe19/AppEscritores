"use client";
import React, { useState } from 'react';
import { Home, PlusSquare, Settings, Trash2, FileUp, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import ConfigModal from './ConfigModal';
import { useTutorial } from './TutorialProvider';

export default function Sidebar({ isExpanded, setIsExpanded, viewMode }) {
  const [showConfig, setShowConfig] = useState(false);
  const { openTutorial } = useTutorial();

  const handleTrashClick = (e) => {
    e.preventDefault();
    alert("Será implementada en próximas actualizaciones");
  };

  const handleImportClick = (e) => {
    e.preventDefault();
    alert("Comando de importar documento: Será implementado en próximas actualizaciones.");
  };

  const handleAssistantClick = (e) => {
    e.preventDefault();
    alert("Próximas actualizaciones: El asistente sirve para poner alarmas, recordatorios, crear dinámicas como ruletas de temas, investigar conceptos y dar sinónimos de palabras, pero no estará capacitado para escribir escenas por ti ya que esa es tu imaginación.");
  };

  return (
    <>
      {/* Backdrop para cerrar al tocar fuera en móvil */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90] md:hidden transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full bg-[#BFD7ED] transition-all duration-300 z-[100] flex flex-col py-8 rounded-r-[40px] shadow-xl ${
          isExpanded ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6 w-full flex-1 justify-start pt-16">
          
          <div className="flex flex-col gap-4 w-full">
            <SidebarItem icon={<Home />} label="Inicio" expanded={isExpanded} href="/home" active={viewMode === 'home'} />
            <SidebarItem icon={<PlusSquare />} label="Proyectos" expanded={isExpanded} href="/proyectos" active={viewMode === 'proyectos'} />
          </div>

          <div className="flex flex-col gap-4 w-full">
            <SidebarItem icon={<FileUp />} label="Importar Doc." expanded={isExpanded} onClick={handleImportClick} />
            <SidebarItem icon={<Sparkles />} label="Asistente IA" expanded={isExpanded} onClick={handleAssistantClick} />
          </div>

          <div className="flex flex-col gap-4 w-full mt-auto">
            <SidebarItem 
              icon={<BookOpen />} 
              label="Ver Tutorial" 
              expanded={isExpanded} 
              onClick={openTutorial} 
            />
            <SidebarItem 
              icon={<Settings />} 
              label="Configuración" 
              expanded={isExpanded} 
              onClick={() => setShowConfig(true)} 
              active={showConfig} 
            />
            <SidebarItem 
              icon={<Trash2 />} 
              label="Papelera" 
              expanded={isExpanded} 
              onClick={handleTrashClick} 
              active={viewMode === 'papelera'} 
            />
          </div>
        </div>
      </aside>

      <ConfigModal 
        isOpen={showConfig} 
        onClose={() => setShowConfig(false)} 
        user={{ nombre: 'Autor' }} 
        onUpdate={() => {}} 
      />
    </>
  );
}

function SidebarItem({ icon, label, expanded, active, href, onClick }) {
  const isButton = !href;
  const content = (
    <>
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-[#FF5C5C] text-white shadow-lg shadow-[#FF5C5C]/30' : 'group-hover:bg-white/50'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <span className={`ml-4 font-bold text-lg transition-all duration-300 whitespace-nowrap ${
        expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
      }`}>
        {label}
      </span>

      {active && !expanded && (
        <div className="absolute left-0 w-1.5 h-8 bg-[#FF5C5C] rounded-r-full" />
      )}
    </>
  );

  const className = `flex items-center w-full px-6 py-2 cursor-pointer group transition-all duration-300 relative bg-transparent border-none outline-none text-left ${
    active ? 'text-[#FF5C5C]' : 'text-slate-400 hover:text-[#FF5C5C]'
  }`;

  if (isButton) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}