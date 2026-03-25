"use client";
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

  const handleRegistro = async (e) => {
    e.preventDefault();
    
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
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Nombre de usuario</label>
            <input 
              type="text" 
              required
              value={nombreUsuario}
              onChange={e => setNombreUsuario(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Contraseña</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">Confirmar contraseña</label>
            <input 
              type="password"
              required 
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
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