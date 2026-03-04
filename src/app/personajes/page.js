"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import CharacterModule from '@/components/CharacterModule';
import Bombilla from '@/components/common/Bombilla'; // El componente de tu compañera

export default function PersonajesPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FDF5F5] font-sans text-slate-800 overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} viewMode="personajes" />
      
      <main className={`flex-1 transition-all duration-500 ${isSidebarExpanded ? 'ml-64' : 'ml-24'} p-4 md:p-8 flex flex-col h-screen overflow-hidden`}>
        <Header user={{ name: "Patito Sexy" }} title="Personajes" />

        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col relative pt-4 overflow-hidden">
          <CharacterModule />
        </div>
      </main>

      <Bombilla />
    </div>
  );
}