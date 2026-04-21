"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home, FolderOpen, Users, Globe, Zap, LayoutDashboard,
  FileUp, Sparkles, ChevronRight, ChevronLeft, X
} from 'lucide-react';

const STEPS = [
  {
    icon: <Home size={42} className="text-[#FF5C5C]" />,
    title: "Inicio",
    description: "Tu punto de partida. Desde aquí puedes navegar a tus Mundos, Personajes, Proyectos y Ocurrencias con un solo clic.",
    link: "/home",
    color: "from-[#FFF5F5] to-[#FFE8E8]",
  },
  {
    icon: <FolderOpen size={42} className="text-[#5B8DEF]" />,
    title: "Proyectos",
    description: "Aquí organizas tus proyectos literarios. Cada proyecto es un universo propio con sus personajes, escenas, mundo y tablero de ideas.",
    link: "/proyectos",
    color: "from-[#F5F8FF] to-[#E8EEFF]",
  },
  {
    icon: <Users size={42} className="text-[#F497A9]" />,
    title: "Personajes",
    description: "Construye las almas de tu historia. Crea fichas detalladas: apariencia, historia, edad, origen y la frase épica de cada personaje.",
    link: "/personajes",
    color: "from-[#FFF5F8] to-[#FFE8EE]",
  },
  {
    icon: <Globe size={42} className="text-[#7CC89B]" />,
    title: "Mundo",
    description: "Define las reglas de tu universo. Geografía, historia de eras, sociedad, culturas y la red de relaciones entre personajes.",
    link: "/mundo",
    color: "from-[#F5FFF8] to-[#E8FFEE]",
  },
  {
    icon: <Zap size={42} className="text-[#F5A623]" />,
    title: "Ocurrencias",
    description: "Captura ideas al instante. Arrastra y ordena notas rápidas, luego el Tablero te permitirá conectarlas en un mapa visual.",
    link: "/ocurrencias",
    color: "from-[#FFFDF5] to-[#FFF5E0]",
  },
  {
    icon: <LayoutDashboard size={42} className="text-[#A07BE5]" />,
    title: "Tablero de Ideas",
    description: "Un canvas visual tipo mapa mental. Filtra por emoción, estado narrativo, y activa la línea de tiempo para ver tu historia fluir.",
    link: "/tablero",
    color: "from-[#F8F5FF] to-[#EEE8FF]",
  },
  {
    icon: (
      <div className="flex gap-4">
        <FileUp size={36} className="text-[#7BA3C9]" />
        <Sparkles size={36} className="text-[#F497A9]" />
      </div>
    ),
    title: "Próximamente",
    description: "El Asistente IA te ayudará con alarmas, recordatorios, ruletas de temas, sinónimos e investigación de conceptos. Las escenas las escribes tú, porque ese es tu talento.",
    link: null,
    color: "from-[#FAFAFA] to-[#F0F0F0]",
  }
];

export default function TutorialModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Resetear al paso 0 cuando se abre
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  // Se eliminó el useEffect que hacía router.push automático 
  // para evitar que la página cambie sola mientras ves el tutorial.

  const handleClose = () => {
    // Marcamos como visto
    localStorage.setItem('escrimundo_tutorial_seen', 'true');
    
    // Redirigimos al Login en lugar de al Home
    router.push('/login'); 
    
    onClose();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleClose();
  };

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const current = STEPS[step];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 md:p-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
        >
          {/* Botón Saltar modificado para ir al Login */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            <X size={14} /> Saltar
          </button>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className={`bg-gradient-to-b ${current.color} w-full max-w-md rounded-t-[40px] md:rounded-[40px] shadow-2xl border border-white/70 p-10 flex flex-col items-center text-center`}
          >
            <div className="flex gap-1.5 mb-8">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-6 bg-[#FF5C5C]' : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="mb-6 flex items-center justify-center h-16">
              {current.icon}
            </div>

            <h2 className="text-3xl font-serif font-black text-slate-900 mb-4 leading-tight">
              {current.title}
            </h2>

            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-10">
              {current.description}
            </p>

            <div className="flex items-center gap-4 w-full">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-400 hover:text-slate-700 font-bold text-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              <button
                onClick={handleNext}
                className="flex-1 bg-[#FF5C5C] text-white py-3 rounded-full font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {step < STEPS.length - 1 ? (
                  <>Siguiente <ChevronRight size={16} /></>
                ) : (
                  '¡Empezar a escribir!'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}