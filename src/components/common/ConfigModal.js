"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Loader2, Save } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

export default function ConfigModal({ isOpen, onClose, user, onUpdate }) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '/avatar.png');
  const [email, setEmail] = useState(user?.email || '');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');
  const [successMSG, setSuccessMSG] = useState('');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setAvatarPreview(user.avatar_url || '/avatar.png');
      setEmail(user.email || '');
    }
    setErrorMSG('');
    setSuccessMSG('');
    setNuevaPassword('');
  }, [user, isOpen]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setAvatarPreview(url);
    }
  };

  const saveSettings = async () => {
    if (!nombre.trim()) {
      setErrorMSG('El nombre no puede estar vacío');
      return;
    }
    
    setLoading(true);
    setErrorMSG('');
    setSuccessMSG('');
    
    try {
      let finalAvatarUrl = user?.avatar_url;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });
          
        if (uploadError) throw new Error('Error al subir imagen.');
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicUrl;
      }

      const updates = { data: { nombre: nombre, avatar_url: finalAvatarUrl } };
      
      let requireReauthMsg = false;
      if (email && email !== user?.email) {
        updates.email = email;
        requireReauthMsg = true;
      }
      
      if (nuevaPassword) {
        if (nuevaPassword.length < 6) throw new Error('Mínimo 6 caracteres');
        updates.password = nuevaPassword;
      }

      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;
      
      onUpdate({ ...user, nombre: nombre, avatar_url: finalAvatarUrl, email: email });
      
      if (requireReauthMsg) {
        setSuccessMSG('¡Actualizado! Revisa tu nuevo correo para confirmar.');
        setTimeout(() => { onClose(); }, 3000);
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMSG(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Configuración</h2>
              <button 
                onClick={onClose} 
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
              
              {errorMSG && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">{errorMSG}</div>}
              {successMSG && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold border border-green-100">{successMSG}</div>}
              
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#BFD7ED] overflow-hidden bg-slate-50 shadow-inner group-hover:border-[#FFB7C5] transition-all">
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#F497A9] hover:text-red-400 transition-colors"
                >
                  Cambiar imagen de perfil
                </button>
              </div>
              
              <div className="space-y-4 md:space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Nombre de usuario</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#BFD7ED] focus:ring-4 focus:ring-[#BFD7ED]/10 outline-none transition-all font-bold text-slate-700" placeholder="Ej: Kei" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Correo electrónico</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#BFD7ED] focus:ring-4 focus:ring-[#BFD7ED]/10 outline-none transition-all font-bold text-slate-700" placeholder="tu@correo.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Nueva Contraseña</label>
                  <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#BFD7ED] focus:ring-4 focus:ring-[#BFD7ED]/10 outline-none transition-all font-bold text-slate-700" placeholder="••••••••" />
                  <p className="text-[9px] text-slate-300 ml-1 font-bold italic">Déjala en blanco si no quieres cambiarla.</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-50 bg-white shrink-0">
              <button 
                onClick={saveSettings} 
                disabled={loading} 
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar Cambios</>}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}