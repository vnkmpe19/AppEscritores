"use client";
import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Trash2, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Importa Supabase globalmente para manejar autoconfiguración del usuario
import { supabase } from '@/app/lib/supabase';

// Asegúrate de que esta ruta apunte bien a donde tienes tu componente Buscador
import Buscador from '../proyectos/Buscador';
import AccountModal from './AccountModal';

export default function Header({ user, onLogout, onSearch, onMenuClick, isSidebarExpanded, title = "Ocurrencias" }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    fetchSessionUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        formatUser(session.user);
      } else {
        setLocalUser(null);
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchSessionUser = async () => {
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    if (sessionUser) {
      formatUser(sessionUser);
    } else if (user && user.name !== "Patito Sexy") {
      setLocalUser(user);
    }
  };

  const formatUser = (u) => {
    setLocalUser({
      id: u.id,
      nombre: u.user_metadata?.nombre || u.email?.split('@')[0] || 'Usuario',
      avatar_url: u.user_metadata?.avatar_url || '/avatar.png',
      email: u.email,
      role: 'Escritor'
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const activeUser = localUser || (user?.name === "Patito Sexy" ? null : user);

  return (
    <header className={`flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto gap-4 relative z-50 px-4 md:px-0 transition-opacity duration-300 ${
      isSidebarExpanded ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'
    }`}>
      <div className="flex items-center justify-between w-full md:w-auto">
        <button 
          onClick={onMenuClick} 
          className="p-2 md:hidden bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 hover:text-[#FF5C5C] transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
        <div className="w-10 md:hidden" />
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
       
        <Buscador onSearch={onSearch} />

    

        {activeUser ? (
          <div className="relative">
            <div onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 bg-white pr-4 py-1.5 pl-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all">
              <div className="w-9 h-9 bg-orange-200 rounded-full border-2 border-orange-400 overflow-hidden shrink-0">
                <img src={activeUser.avatar_url || "/avatar.png"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block text-left w-24">
                <p className="text-xs font-black leading-none truncate" title={activeUser.nombre || activeUser.name}>{activeUser.nombre || activeUser.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Escritor</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl z-[70] py-2 border border-slate-100 overflow-hidden">
                  <button onClick={() => { setShowUserMenu(false); setShowAccountModal(true); }} className="flex items-center gap-3 px-4 py-3 text-sm w-full text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                    <Settings size={16} /> Configurar cuenta
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm w-full text-red-500 font-bold hover:bg-red-50 transition-colors">
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

      <AccountModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
        user={activeUser}
        onUpdate={(updatedUser) => setLocalUser(updatedUser)}
      />
    </header>
  );
}