import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['700'], 
});

export default function RegistroPage() {
  return (
   
    <div className={`min-h-screen flex items-center justify-center bg-[#A8D8E9] p-4 ${playfair.className}`}>
      
     
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-xl px-8 py-10 md:px-12 md:py-12">
        
     
        <h1 className="text-4xl text-center text-[#E63946] mb-8 font-bold tracking-wide">
          Crear una cuenta
        </h1>

        <form className="space-y-5">
         
          <div>
            <label className="block text-black font-bold text-lg mb-2 ml-1">
              Correo electrónico
            </label>
            <input 
              type="email" 
              className="w-full bg-[#FADADD] rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>

          
          <div>
            <label className="block text-black font-bold text-lg mb-2 ml-1">
              Contraseña
            </label>
            <input 
              type="password" 
              className="w-full bg-[#FADADD] rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-black font-bold text-lg mb-2 ml-1">
              Confirmar contraseña
            </label>
            <input 
              type="password" 
              className="w-full bg-[#FADADD] rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-black font-bold text-lg mb-2 ml-1">
              Nombre de usuario
            </label>
            <input 
              type="text" 
              className="w-full bg-[#FADADD] rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>

        
          <div className="pt-4 flex justify-center">
            <button 
              type="submit"
              className="bg-[#8AC6FA] text-black font-bold text-lg py-2 px-10 rounded-full hover:bg-[#6baae0] transition-colors shadow-sm"
            >
              Crear cuenta
            </button>
          </div>
        </form>

       
        <div className="mt-6 text-center">
          <p className="text-black font-bold text-base">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-[#3B7CA8] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}