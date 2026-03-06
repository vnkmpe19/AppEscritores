import Link from 'next/link';

export default function RegistroPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#BDD8E9] p-4">
      
      <div className="bg-white w-full max-w-lg p-10 md:p-14 rounded-[50px] shadow-2xl flex flex-col">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#E3485D] font-serif">
          Crear una cuenta
        </h1>

        <form className="flex flex-col gap-5 w-full">
          
          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">
              Correo electrónico
            </label>
            <input 
              type="email" 
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">
              Contraseña
            </label>
            <input 
              type="password" 
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">
              Confirmar contraseña
            </label>
            <input 
              type="password" 
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 ml-4 font-serif text-lg">
              Nombre de usuario
            </label>
            <input 
              type="text" 
              className="w-full p-4 rounded-full bg-[#F8E4E4] outline-none border-none shadow-sm text-gray-800" 
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button 
              type="button" 
              className="bg-[#94C3E6] text-gray-900 font-bold font-serif text-xl py-3 px-12 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Crear cuenta
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