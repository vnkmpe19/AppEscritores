'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase'; 

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [cargando, setCargando] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setCargando(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos."); 
      setCargando(false);
    } else {
      router.push('/home'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#FFF5F5] p-4">
      
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[60px] overflow-hidden shadow-2xl min-h-[550px]">
        
        <div className="bg-[#BDD8E9] w-full md:w-[45%] p-10 md:p-14 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 font-serif">
            Iniciar sesión
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {error && <p className="text-red-600 bg-red-100 p-2 rounded text-sm text-center font-bold">{error}</p>}

            <div>
              <label className="block font-bold text-gray-700 mb-1 ml-2">Correo electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-full bg-white/70 outline-none border-none shadow-sm focus:ring-2 focus:ring-[#DB7093]" 
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1 ml-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 rounded-full bg-white/70 outline-none border-none shadow-sm focus:ring-2 focus:ring-[#DB7093]" 
              />
              <p className="text-xs text-gray-600 mt-2 ml-2 cursor-pointer hover:underline">Olvidé mi contraseña</p>
            </div>

            <div className="mt-4 flex flex-col items-start">
              <button 
                type="submit" 
                disabled={cargando}
                className="bg-[#DB7093] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {cargando ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            </div>

            <p className="mt-6 font-bold text-gray-800">
              ¿No tienes una cuenta?{' '}
              <Link href="/registro" className="text-blue-600 cursor-pointer hover:underline">
                Crea una
              </Link>
            </p>
          </form>
        </div>

        <div className="bg-[#FDF1E6] flex-1 flex items-center justify-center p-4">
          <img 
            src="/imglogin1.png" 
            alt="Escritor" 
            className="max-w-full h-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
}