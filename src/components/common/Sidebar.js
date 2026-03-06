"use client";
import React from 'react';
import { Home, Book, User, PlusSquare, Edit3, Globe, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
const { Lightbulb } = require('lucide-react');

export default function Sidebar({ isExpanded, setIsExpanded, viewMode }) {
  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 h-full bg-[#BFD7ED] transition-all duration-300 z-50 flex flex-col py-8 rounded-r-[40px] shadow-xl ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col gap-4 w-full">
        <SidebarItem icon={<Home />} label="Home" expanded={isExpanded} href="/home" active={viewMode === 'home'} />
    
        <SidebarItem icon={<User />} label="Personajes" expanded={isExpanded} href="/personajes" active={viewMode === 'personajes'} />
        <SidebarItem icon={<PlusSquare />} label="Proyectos" expanded={isExpanded} href="/proyectos" active={viewMode === 'proyectos'} />
        <SidebarItem icon={<Edit3 />} label="Escenas" expanded={isExpanded} href="/escenas" active={viewMode === 'escenas'} />
        <SidebarItem icon={<Globe />} label="Mundo" expanded={isExpanded} href="/mundo" active={viewMode === 'mundo'} />
        
        <SidebarItem 
          icon={<LayoutGrid />} 
          label="Tablero" 
          expanded={isExpanded} 
          href="/tablero" 
          active={viewMode === 'tablero'} 
        />
      </div>

      <div className="mt-auto flex justify-center w-full">
        <Link href="/ocurrencias" className="w-12 h-12 bg-[#719fd7] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-black transition-colors border-2 border-white/20">
          <Lightbulb className="text-white" size={24} />
        </Link>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, expanded, active, href = "#" }) {
  return (
    <Link href={href} className={`flex items-center w-full px-6 py-2 cursor-pointer group transition-all duration-300 relative ${
      active ? 'text-[#FF5C5C]' : 'text-slate-400 hover:text-[#FF5C5C]'
    }`}>
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
    </Link>
  );
}