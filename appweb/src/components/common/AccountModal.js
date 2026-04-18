"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

export default function AccountModal({ isOpen, onClose, user, onUpdate }) {
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Password change fields
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `avatar-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('imagenes').upload(filename, file, { upsert: true });
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(filename);
      setAvatarUrl(publicUrl);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const updates = { data: { nombre, avatar_url: avatarUrl } };
    if (newPassword.length >= 8) updates.password = newPassword;

    const { error } = await supabase.auth.updateUser(updates);

    if (!error) {
      // Also update the public usuarios table
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase.from('usuarios').update({ nombre_usuario: nombre }).eq('id', currentUser.id);
      }
      setMessage({ type: 'success', text: '¡Perfil actualizado!' });
      onUpdate?.({ ...user, nombre, avatar_url: avatarUrl });
    } else {
      setMessage({ type: 'error', text: error.message });
    }
    setSaving(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
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
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-orange-50/60">
              <h2 className="text-xl md:text-2xl font-black text-slate-800">Mi Cuenta</h2>
              <button onClick={onClose} className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              
              {message && (
                <p className={`text-sm font-bold p-3 rounded-2xl ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {message.text}
                </p>
              )}

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={32} className="text-slate-300" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-[#FF5C5C] text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                    <Upload size={14} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
                </div>
                {uploading && <p className="text-xs text-slate-400 font-bold flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Subiendo...</p>}
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nombre de usuario</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border border-transparent font-bold text-slate-700"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Correo electrónico</label>
                <p className="bg-slate-50 p-4 rounded-2xl font-bold text-slate-400 text-sm">{user?.email || '—'}</p>
              </div>

              {/* Change password */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nueva contraseña <span className="normal-case text-slate-300">(dejar vacío para no cambiar)</span></label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border border-transparent font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#FF5C5C] disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
