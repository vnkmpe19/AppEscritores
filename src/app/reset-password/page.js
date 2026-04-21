"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Loader2, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase maneja el token en la URL automáticamente para actualizar la sesión del usuario
    // Solo necesitamos asegurarnos de que el usuario esté "autenticado" temporalmente por el link
  }, []);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validación de fortaleza (Mismas reglas que registro)
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("La contraseña debe incluir al menos una letra mayúscula.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("La contraseña debe incluir al menos una letra minúscula.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("La contraseña debe incluir al menos un número.");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setError("La contraseña debe incluir al menos un carácter especial.");
      return;
    }

    setCargando(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError("Error al restablecer contraseña: " + error.message);
      setCargando(false);
    } else {
      setSuccess(true);
      setCargando(false);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#FDF1E6] p-4 relative">
      <div className="bg-white w-full max-w-lg p-10 md:p-14 rounded-[50px] shadow-2xl flex flex-col z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#DB7093] font-serif">
          Restablecer Contraseña
        </h1>

        {success ? (
          <div className="text-center space-y-6 py-4 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">¡Contraseña actualizada!</h2>
            <p className="text-gray-600">Tu contraseña ha sido cambiada con éxito. Redirigiendo al inicio de sesión...</p>
            <button 
              onClick={() => router.push('/login')}
              className="flex items-center gap-2 text-[#DB7093] font-bold mx-auto hover:underline"
            >
              Ir al login ahora <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-6 w-full">
            <p className="text-slate-600 text-center text-sm mb-2">Ingresa tu nueva contraseña a continuación.</p>
            
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-2xl text-sm font-bold border border-red-200">{error}</p>}

            <div className="relative">
              <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Nueva Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Medidor de fortaleza */}
              {password.length > 0 && (
                <div className="mt-4 px-4 space-y-3">
                  <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${
                      strength <= 2 ? 'bg-red-500 w-1/3' : 
                      strength <= 4 ? 'bg-yellow-500 w-2/3' : 
                      'bg-green-500 w-full'
                    }`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <StrengthIndicator label="8+ caracteres" met={password.length >= 8} />
                    <StrengthIndicator label="Mayúscula" met={/[A-Z]/.test(password)} />
                    <StrengthIndicator label="Minúscula" met={/[a-z]/.test(password)} />
                    <StrengthIndicator label="Número" met={/[0-9]/.test(password)} />
                    <StrengthIndicator label="Especial" met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  required 
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button 
                type="submit" 
                disabled={cargando}
                className="flex items-center gap-2 bg-[#94C3E6] disabled:bg-slate-300 disabled:hover:scale-100 text-gray-900 font-bold font-serif text-xl py-4 px-12 rounded-full shadow-md hover:scale-105 transition-transform w-full md:w-auto"
              >
                {cargando && <Loader2 size={24} className="animate-spin" />}
                {cargando ? 'Actualizando...' : 'Restablecer Contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function StrengthIndicator({ label, met }) {
  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${met ? 'text-green-600' : 'text-gray-400 transition-colors'}`}>
      {met ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border-2 border-gray-200" />}
      <span>{label}</span>
    </div>
  );
}
