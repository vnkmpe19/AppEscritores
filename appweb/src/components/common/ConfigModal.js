"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Link as LinkIcon, Info } from 'lucide-react';

export default function ConfigModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col relative z-10 border border-slate-100 overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-[#BFD7ED]/10">
              <h2 className="text-xl md:text-2xl font-black text-[#2C3E50]">Configuración de Página</h2>
              <button 
                onClick={onClose} 
                className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              
              <div className="bg-[#FFB7C5]/20 text-[#D84A64] p-4 rounded-2xl flex items-start gap-4">
                <Info size={24} className="shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-relaxed">
                  Las opciones de configuración mostradas a continuación estarán disponibles en próximas actualizaciones.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-200 rounded-xl text-slate-500">
                      <Moon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700">Modo Oscuro</h3>
                      <p className="text-xs text-slate-400 font-medium">Cambiar paleta de colores</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-200 rounded-xl text-slate-500">
                      <LinkIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700">Google Docs</h3>
                      <p className="text-xs text-slate-400 font-medium">Enlazar libretas a la nube</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold bg-slate-200 text-slate-500 px-4 py-2 rounded-xl">Conectar</button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}