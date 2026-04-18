import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-crema-login">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a Escrimundo</h1>
      <Link 
        href="/login" 
        className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-all"
      >
        Comenzar
      </Link>
    </div>
  )
}