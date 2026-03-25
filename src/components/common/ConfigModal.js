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
    // Limpiar mensajes al abrir/cerrar
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
          
        if (uploadError) {
          throw new Error('No se pudo subir la imagen. Verifica que el bucket "avatars" exista en Supabase y sea público.');
        }
        
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
        if (nuevaPassword.length < 6) {
           throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        updates.password = nuevaPassword;
      }

      const { error: updateError } = await supabase.auth.updateUser(updates);
      
      if (updateError) {
         if (updateError.message.includes('same as the old one')) {
            throw new Error('La nueva contraseña no puede ser igual a la anterior');
         }
         throw updateError;
      }
      
      onUpdate({ ...user, nombre: nombre, avatar_url: finalAvatarUrl, email: email });
      
      if (requireReauthMsg) {
         setSuccessMSG('¡Actualizado! Si cambiaste tu correo, revisa tu buzón para confirmarlo.');
         setTimeout(() => { onClose(); }, 3000);
      } else {
         onClose();
      }
      
      
    } catch (err) {
      console.error(err);
      setErrorMSG(err.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
          
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Configurar Cuenta</h2>
            
            {errorMSG && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100">{errorMSG}</div>}
            {successMSG && <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-xl text-sm font-bold border border-green-100">{successMSG}</div>}
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full border-4 border-[#BFD7ED] overflow-hidden bg-slate-100 shadow-inner group-hover:border-blue-400 transition-colors">
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <button onClick={() => fileInputRef.current?.click()} className="mt-3 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2">
                <Upload size={16} /> Cambiar foto
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Nombre de usuario</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800" placeholder="Tu nombre" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800" placeholder="tu@correo.com" />
                <p className="text-[10px] text-slate-400 ml-1 mt-1 font-bold">Si cambias el correo, tendrás que verificarlo.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Nueva Contraseña</label>
                <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-800" placeholder="Añade una nueva contraseña (opcional)" />
                <p className="text-[10px] text-slate-400 ml-1 mt-1 font-bold">Déjalo en blanco si no quieres cambiarla.</p>
              </div>
            </div>
            
            <button onClick={saveSettings} disabled={loading} className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar Cambios</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
