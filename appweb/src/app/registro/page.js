"use client";
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);

  const [pwStrength, setPwStrength] = useState({ score: 0, length: false, upper: false, lower: false, num: false, special: false });

  const evaluatePassword = (pass) => {
    const length = pass.length >= 8;
    const upper = /[A-Z]/.test(pass);
    const lower = /[a-z]/.test(pass);
    const num = /[0-9]/.test(pass);
    const special = /[^A-Za-z0-9]/.test(pass);
    const score = [length, upper, lower, num, special].filter(Boolean).length;
    
    setPwStrength({ score, length, upper, lower, num, special });
    setPassword(pass);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    
    if (pwStrength.score < 5) {
      setError("La contraseña no cumple con los requisitos mínimos de seguridad.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    if (!nombreUsuario) {
      setError("Por favor, ingresa un nombre de usuario.");
      return;
    }

    setCargando(true);
    setError(null);
    setMensajeExito(null);

    // 1. Registro en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: nombreUsuario,
        }
      }
    });

    if (authError) {
      setError("Error al crear cuenta: " + authError.message);
      setCargando(false);
      return;
    }

    if (authData?.user) {
      // 2. Insertar perfil público en la tabla 'usuarios'
      // Tratamos de hacerlo manualmente por si no tienes Triggers en tu BD
      const { error: userError } = await supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          nombre_usuario: nombreUsuario
        }]);

      if (userError && userError.code !== '23505') { 
        console.warn("Aviso sobre tabla usuarios (puede ignorarse si tienes un Trigger):", userError);
      }

      // 3. Crear un Proyecto por defecto para que la app funcione correctamente
      const { error: projError } = await supabase
        .from('proyectos')
        .insert([{
          id_usuario: authData.user.id,
          titulo: 'Mi Primer Universo',
          descripcion: 'Un lienzo en blanco para comenzar tus historias.',
          color: '#BDD8E9'
        }]);

      if (projError) {
         console.warn("No se pudo crear proyecto inicial:", projError);
      }

      // Si Supabase exige verificación por correo, la sesión será null
      if (!authData.session) {
        setMensajeExito("¡Cuenta creada! Revisa tu bandeja de entrada o SPAM para confirmar tu correo.");
        setCargando(false);
      } else {
        alert("¡Bienvenido a AppEscritores!");
        router.push('/home'); // o '/mundo' dependiendo de tu flujo
      }
    } else {
      setCargando(false);
    }
  };

  const getStrengthBarColor = () => {
    if (pwStrength.score <= 2) return "bg-red-500 w-1/3";
    if (pwStrength.score <= 4) return "bg-yellow-500 w-2/3";
    return "bg-green-500 w-full";
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return "";
    if (pwStrength.score <= 2) return "Débil";
    if (pwStrength.score <= 4) return "Aceptable";
    return "Fuerte";
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#BDD8E9] p-4 relative">
      <div className="bg-white w-full max-w-lg p-10 md:p-14 rounded-[50px] shadow-2xl flex flex-col z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#E3485D] font-serif">
          Crear una cuenta
        </h1>

        <form onSubmit={handleRegistro} className="flex flex-col gap-5 w-full">
          
          {error && <p className="text-red-600 bg-red-50 p-3 rounded-2xl text-sm font-bold border border-red-200">{error}</p>}
          {mensajeExito && <p className="text-green-600 bg-green-50 p-3 rounded-2xl text-sm font-bold border border-green-200">{mensajeExito}</p>}

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Correo electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800 focus:ring-2 focus:ring-[#E3485D]/30 transition-all text-sm" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Nombre de usuario</label>
            <input 
              type="text" 
              required
              value={nombreUsuario}
              onChange={e => setNombreUsuario(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800 focus:ring-2 focus:ring-[#E3485D]/30 transition-all text-sm" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg flex items-center justify-between">
              Contraseña
              <span className="text-xs font-sans font-bold text-slate-400">{getStrengthLabel()}</span>
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => evaluatePassword(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800 focus:ring-2 focus:ring-[#E3485D]/30 transition-all text-sm" 
            />
            
            {password.length > 0 && (
              <div className="mt-3 ml-2 mr-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthBarColor()}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className={pwStrength.length ? 'text-green-600' : ''}>✓ 8 caracteres mín.</span>
                  <span className={pwStrength.upper ? 'text-green-600' : ''}>✓ Mayúscula</span>
                  <span className={pwStrength.lower ? 'text-green-600' : ''}>✓ Minúscula</span>
                  <span className={pwStrength.num ? 'text-green-600' : ''}>✓ Número</span>
                  <span className={pwStrength.special ? 'text-green-600' : ''}>✓ Carácter especial</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Confirmar contraseña</label>
            <input 
              type="password"
              required 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800 focus:ring-2 focus:ring-[#E3485D]/30 transition-all text-sm" 
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button 
              type="submit" 
              disabled={cargando}
              className="flex items-center gap-2 bg-[#94C3E6] disabled:bg-slate-300 disabled:hover:scale-100 text-gray-900 font-bold font-serif text-xl py-3 px-12 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              {cargando && <Loader2 size={20} className="animate-spin" />}
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

        <p className="mt-8 font-bold text-gray-900 text-center font-serif text-lg">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-[#3A6085] cursor-pointer hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}