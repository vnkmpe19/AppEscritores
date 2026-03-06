"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Church, LayoutGrid, Scale, Edit3, 
  TrendingUp, Gem, Ship, Sparkles, Plus, Trash2, X, Edit, Cog, Crown, Users, Shield, User
} from 'lucide-react';


import TarjetaGobierno from './TarjetaGobierno';
import NodoJerarquia from './NodoJerarquia';


const obtenerIcono = (nombreIcono, tamaño = 20) => {
  switch (nombreIcono) {
    case 'Crown': return <Crown size={tamaño} />;
    case 'Church': return <Church size={tamaño} />;
    case 'Users': return <Users size={tamaño} />;
    case 'Shield': return <Shield size={tamaño} />;
    case 'User': return <User size={tamaño} />;
    case 'Gem': return <Gem size={tamaño} />;
    case 'Ship': return <Ship size={tamaño} />;
    case 'Sparkles': return <Sparkles size={tamaño} />;
    case 'Cog': return <Cog size={tamaño} />;
    default: return <TrendingUp size={tamaño} />;
  }
};

export default function SociopoliticalModule() {
  

  const [tiposGobierno, setTiposGobierno] = useState([
    { id: 'g1', titulo: 'Monarquía', descripcion: 'Poder absoluto heredado por linaje de sangre.', icono: 'Crown' },
    { id: 'g2', titulo: 'Teocracia', descripcion: 'Liderado por deidades o autoridades religiosas.', icono: 'Church' },
    { id: 'g3', titulo: 'Democracia', descripcion: 'Participación ciudadana en decisiones clave.', icono: 'Users' },
    { id: 'g4', titulo: 'Oligarquía', descripcion: 'Poder en manos de unos pocos privilegiados.', icono: 'Shield' }
  ]);
  const [gobiernoActivo, setGobiernoActivo] = useState('g1');
  
  const [jerarquia, setJerarquia] = useState({
    id: '1', rol: 'REY / SOBERANO', descripcion: 'La autoridad suprema', icono: 'Crown',
    hijos: [
      { id: '2', rol: 'Señores & Nobles', descripcion: 'Dueños de tierras y vasallos', icono: 'Shield', hijos: [] },
      { id: '3', rol: 'Alto Clero', descripcion: 'Guías espirituales y políticos', icono: 'Church', hijos: [] }
    ]
  });

  const [nombreCodigoLegal, setNombreCodigoLegal] = useState('Código');
  const [leyes, setLeyes] = useState([
    { id: 1, texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 3, texto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  ]);

  const [economia, setEconomia] = useState([
    { id: 1, etiqueta: 'Lorem ipsum dolor sit amet', valor: 85, icono: 'Gem' },
    { id: 2, etiqueta: 'Lorem ipsum dolor sit amet', valor: 62, icono: 'Ship' },
    { id: 3, etiqueta: 'Lorem ipsum dolor sit amet', valor: 45, icono: 'Sparkles' }
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [configModal, setConfigModal] = useState({ tipo: '', titulo: '' });
  const [elementoEditado, setElementoEditado] = useState(null); 

  const [textoFormulario, setTextoFormulario] = useState('');
  const [descripcionFormulario, setDescripcionFormulario] = useState('');
  const [valorFormulario, setValorFormulario] = useState(50);
  const [iconoFormulario, setIconoFormulario] = useState('Gem');

  const procesarJerarquia = (nodo, idObjetivo, accion, datos) => {
    if (accion === 'ELIMINAR') {
      const nuevosHijos = nodo.hijos.filter(h => h.id !== idObjetivo).map(h => procesarJerarquia(h, idObjetivo, accion, datos));
      return { ...nodo, hijos: nuevosHijos };
    }
    if (action === 'AGREGAR' && nodo.id === idObjetivo) return { ...nodo, hijos: [...nodo.hijos, datos] };
    if (action === 'EDITAR' && nodo.id === idObjetivo) return { ...nodo, ...datos };
    return { ...nodo, hijos: nodo.hijos.map(h => procesarJerarquia(h, idObjetivo, accion, datos)) };
  };

  const eliminarNodoJerarquia = (id) => {
    if (id === '1') return alert("No puedes eliminar el rango supremo base.");
    if (window.confirm("¿Eliminar este rango y todos sus subordinados?")) setJerarquia(procesarJerarquia(jerarquia, id, 'ELIMINAR', null));
  };

  const abrirModal = (tipo, titulo, elemento = null) => {
    setConfigModal({ tipo, titulo }); setElementoEditado(elemento);
    setTextoFormulario(''); setDescripcionFormulario(''); setValorFormulario(50); setIconoFormulario('Crown');
    if (tipo === 'nombreLegal') setTextoFormulario(nombreCodigoLegal);
    else if (tipo === 'gobierno' && elemento) { setTextoFormulario(elemento.titulo); setDescripcionFormulario(elemento.descripcion); setIconoFormulario(elemento.icono); }
    else if (tipo === 'editarNodo' && elemento) { setTextoFormulario(elemento.rol); setDescripcionFormulario(elemento.descripcion); setIconoFormulario(elemento.icono); }
    else if (tipo === 'agregarNodo') setIconoFormulario('User');
    else if (elemento && (tipo === 'ley' || tipo === 'economia')) { setTextoFormulario(elemento.texto || elemento.etiqueta || ''); setValorFormulario(elemento.valor || 50); setIconoFormulario(elemento.icono || 'Gem'); }
    setMostrarModal(true);
  };

  const guardarCambios = () => {
    if (!textoFormulario) return alert("El campo principal es obligatorio");
    if (configModal.tipo === 'nombreLegal') setNombreCodigoLegal(textoFormulario);
    else if (configModal.tipo === 'gobierno') {
      const nuevoGob = { id: elementoEditado ? elementoEditado.id : crypto.randomUUID(), titulo: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario };
      if (elementoEditado) setTiposGobierno(tiposGobierno.map(g => g.id === elementoEditado.id ? nuevoGob : g)); else setTiposGobierno([...tiposGobierno, nuevoGob]);
    }
    else if (configModal.tipo === 'agregarNodo') {
      const nuevoNodo = { id: crypto.randomUUID(), rol: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario, hijos: [] };
      setJerarquia(procesarJerarquia(jerarquia, elementoEditado, 'AGREGAR', nuevoNodo)); 
    }
    else if (configModal.tipo === 'editarNodo') setJerarquia(procesarJerarquia(jerarquia, elementoEditado.id, 'EDITAR', { rol: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario }));
    else if (configModal.tipo === 'ley') {
      const nuevaLey = { id: elementoEditado ? elementoEditado.id : Date.now(), texto: textoFormulario };
      if (elementoEditado) setLeyes(leyes.map(l => l.id === elementoEditado.id ? nuevaLey : l)); else setLeyes([...leyes, nuevaLey]);
    }
    else if (configModal.tipo === 'economia') {
      const nuevaEco = { id: elementoEditado ? elementoEditado.id : Date.now(), etiqueta: textoFormulario, valor: valorFormulario, icono: iconoFormulario };
      if (elementoEditado) setEconomia(economia.map(e => e.id === elementoEditado.id ? nuevaEconomia : e)); else setEconomia([...economia, nuevaEco]);
    }
    setMostrarModal(false);
  };

  const eliminarElemento = (tipo, id) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      if (tipo === 'gobierno') setTiposGobierno(tiposGobierno.filter(g => g.id !== id));
      if (tipo === 'ley') setLeyes(leyes.filter(l => l.id !== id));
      if (tipo === 'economia') setEconomia(economia.filter(e => e.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      
      {/* ENCABEZADO */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5C5C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-slate-900 mb-4">Configuración del mundo</h2>
          <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">Define el marco legal, social y económico que rige a tu civilización. Elige cómo se distribuye el poder y quiénes sostienen la corona.</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8 pr-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-800">Tipos de Gobierno</h3>
          </div>
          <button onClick={() => abrirModal('gobierno', 'Nuevo Tipo de Gobierno')} className="px-5 py-2.5 bg-[#BFD7ED] text-slate-800 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-2">
            <Plus size={16}/> Añadir Tipo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {tiposGobierno.map(gob => (
              <motion.div key={gob.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <TarjetaGobierno titulo={gob.titulo} descripcion={gob.descripcion} icono={obtenerIcono(gob.icono, 24)} activo={gobiernoActivo === gob.id} alHacerClic={() => setGobiernoActivo(gob.id)} alEditar={() => abrirModal('gobierno', 'Editar Gobierno', gob)} alEliminar={() => eliminarElemento('gobierno', gob.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <h3 className="text-2xl font-black text-slate-800">Jerarquía Social</h3>
        </div>
        <div className="bg-slate-50 rounded-[40px] p-12 border border-slate-100 overflow-x-auto min-h-[500px] flex justify-center shadow-inner">
          <div className="flex flex-col items-center gap-16 py-4">
            <NodoJerarquia nodo={jerarquia} alAgregar={(idPadre) => abrirModal('agregarNodo', 'Agregar Rango Subordinado', idPadre)} alEditar={(nodo) => abrirModal('editarNodo', 'Editar Rango', nodo)} alEliminar={eliminarNodoJerarquia} esRaiz={true} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        
        <section>
          <div className="flex items-center gap-3 mb-8"><Scale className="text-[#FF5C5C]" size={28} /><h3 className="text-2xl font-black text-slate-800">Leyes y Justicia</h3></div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Edit3 className="text-[#3A82F6]" size={20} />
                <h4 className="text-xl font-black text-slate-800">{nombreCodigoLegal}</h4>
              </div>
              <button onClick={() => abrirModal('nombreLegal', 'Editar Nombre del Código')} className="p-2 text-slate-400 hover:text-[#9BC5E6] bg-slate-50 rounded-full transition-colors"><Edit size={16}/></button>
            </div>
            <div className="space-y-4 mb-8">
              <AnimatePresence>
                {leyes.map((ley, indice) => (
                  <motion.div key={ley.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4 group p-3 hover:bg-slate-50 rounded-2xl transition-colors relative">
                    <span className="text-[#9BC5E6] font-black text-lg min-w-[24px]">{(indice + 1).toString().padStart(2, '0')}.</span>
                    <p className="text-slate-600 leading-relaxed pr-16 text-sm">{ley.texto}</p>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button onClick={() => abrirModal('ley', 'Editar Ley', ley)} className="p-1.5 text-blue-400 bg-white shadow-sm rounded-lg"><Edit size={14}/></button>
                      <button onClick={() => eliminarElemento('ley', ley.id)} className="p-1.5 text-red-400 bg-white shadow-sm rounded-lg"><Trash2 size={14}/></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button onClick={() => abrirModal('ley', 'Añadir Nueva Ley')} className="w-full py-4 border-2 border-dashed border-[#3B82F6]/30 text-[#3B82F6] font-black rounded-2xl hover:bg-[#FF5C5C]/10 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <Plus size={16} /> Añadir Ley
            </button>
          </div>
        </section>

        
        <section>
          <div className="flex items-center gap-3 mb-8"><TrendingUp className="text-[#F97316]" size={28} /><h3 className="text-2xl font-black text-slate-800">Motores Económicos</h3></div>
          <div className="space-y-4">
            <AnimatePresence>
              {economia.map(eco => (
                <motion.div key={eco.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group relative">
                  <div className="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity z-10">
                    <button onClick={() => abrirModal('economia', 'Editar Motor Económico', eco)} className="p-2 text-blue-500 bg-white border border-slate-100 shadow-md rounded-full hover:scale-110 transition-transform"><Edit size={14}/></button>
                    <button onClick={() => eliminarElemento('economia', eco.id)} className="p-2 text-red-500 bg-white border border-slate-100 shadow-md rounded-full hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#FFD1A4]/50 rounded-xl text-[#F97316] group-hover:scale-110 transition-transform">{obtenerIcono(eco.icono)}</div>
                      <span className="font-black text-slate-800 text-lg">{eco.etiqueta}</span>
                    </div>
                    <span className="text-[#F97316] font-black text-xl">{eco.valor}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${eco.valor}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#FFD1A4] shadow-[0_0_15px_rgba(255,209,164,0.6)]" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => abrirModal('economia', 'Nuevo Motor Económico')} className="w-full py-6 border-2 border-dashed border-slate-200 text-slate-400 font-black rounded-3xl hover:border-[#FFD1A4] hover:text-[#F97316] transition-all flex flex-col items-center justify-center gap-2 uppercase tracking-widest text-xs group">
              <div className="p-2 bg-slate-100 rounded-full group-hover:bg-[#FFD1A4]/50 transition-colors"><Plus size={20} /></div> Añadir Sector
            </button>
          </div>
        </section>
      </div>

      
      <AnimatePresence>
        {mostrarModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMostrarModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col border border-slate-100">
              <div className="p-8 overflow-y-auto space-y-6">
                
                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <Edit3 className={`text-${configModal.tipo === 'gov' ? '[#3B82F6]' : configModal.tipo === 'economia' ? '[#F97316]' : configModal.tipo === 'ley' ? '[#FF5C5C]' : '[#7C3AED]' }`} /> {configModal.titulo}
                  </h3>
                  <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="space-y-6 pt-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{configModal.tipo === 'nombreLegal' ? 'Nombre del Documento Legal' : configModal.tipo === 'ley' ? 'Descripción de la Ley' : configModal.tipo === 'editarNodo' || configModal.tipo === 'agregarNodo' ? 'Nombre del Rango' : 'Título'}</label>
                    {configModal.tipo === 'ley' ? (
                      <textarea value={textoFormulario} onChange={(e) => setTextoFormulario(e.target.value)} placeholder="Escribe el mandato..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] transition-all min-h-[120px] resize-none font-medium text-slate-700 text-sm" />
                    ) : (
                      <input type="text" value={textoFormulario} onChange={(e) => setTextoFormulario(e.target.value)} placeholder="Escribe aquí..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] transition-all font-bold text-slate-800 text-sm" />
                    )}
                  </div>
                  {(configModal.tipo === 'gobierno' || configModal.tipo === 'agregarNodo' || configModal.tipo === 'editarNodo') && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripción Breve</label>
                      <textarea value={descripcionFormulario} onChange={(e) => setDescripcionFormulario(e.target.value)} placeholder="Detalles o responsabilidades..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] transition-all min-h-[80px] resize-none font-medium text-slate-700 text-sm" />
                    </div>
                  )}
                  {configModal.tipo === 'economia' && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Importancia / Valor (%)</label>
                      <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl">
                        <input type="range" min="1" max="100" value={valorFormulario} onChange={(e) => setValorFormulario(Number(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]" />
                        <span className="font-black text-[#F97316] w-10 text-right">{valorFormulario}%</span>
                      </div>
                    </div>
                  )}
                  {(configModal.tipo === 'gobierno' || configModal.tipo === 'economia' || configModal.tipo === 'agregarNodo' || configModal.tipo === 'editarNodo') && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Icono Representativo</label>
                      <div className="flex flex-wrap gap-3">
                        {['Crown', 'Church', 'Users', 'Shield', 'User', 'Gem', 'Ship', 'Sparkles', 'Cog', 'TrendingUp'].map(icono => (
                          <button key={icono} onClick={() => setIconoFormulario(icono)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${iconoFormulario === icono ? `border-${configModal.tipo === 'gov' ? '[#3B82F6]' : configModal.tipo === 'economia' ? '[#F97316]' : '[#7C3AED]' } bg-slate-100 text-${configModal.tipo === 'gov' ? '[#3B82F6]' : configModal.tipo === 'economia' ? '[#F97316]' : '[#7C3AED]' }` : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                            {obtenerIcono(icono)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={guardarCambios} className={`w-full ${configModal.tipo === 'gov' ? 'bg-[#9BC5E6] shadow-[0_10px_20px_rgba(59,130,246,0.3)]' : configModal.tipo === 'economia' ? 'bg-[#9BC5E6] shadow-[0_10px_20px_rgba(249,115,22,0.3)]' : configModal.tipo === 'ley' ? 'bg-[#9BC5E6] shadow-[0_10px_20px_rgba(255,92,92,0.3)]' : 'bg-[#9BC5E6] shadow-[0_10px_20px_rgba(124,58,237,0.3)]' } text-white font-black py-4 rounded-2xl mt-4 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}