"use client";
import React, { useState } from 'react';
import { Bell, ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Asegúrate de que esta ruta apunte bien a donde tienes tu componente Buscador
import Buscador from '../proyectos/Buscador';

export default function Header({ user, onLogout, onSearch, title = "Ocurrencias" }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto gap-4">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-4 md:gap-6">
       
        <Buscador onSearch={onSearch} />

    

        {user ? (
          <div className="relative">
            <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 bg-white pr-4 py-1.5 pl-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
              <div className="w-9 h-9 bg-orange-200 rounded-full border-2 border-orange-400 overflow-hidden">
                <img src="/avatar.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-black leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Escritor</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl z-[70] py-2 border border-slate-100 overflow-hidden">
                  <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-sm w-full text-red-500 font-bold hover:bg-red-50 transition-colors">
                    <Trash2 size={16} /> Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-black text-slate-400 hover:text-slate-600 transition-colors">Entrar</Link>
            <Link href="/registro" className="bg-[#BFD7ED] text-slate-700 text-sm font-black px-6 py-2.5 rounded-full shadow-md hover:scale-105 transition-all">Crear cuenta</Link>
          </div>
        )}
      </div>
    </header>
  );
}