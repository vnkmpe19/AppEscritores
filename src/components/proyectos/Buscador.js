"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function Buscador({ onSearch = () => {} }) {
  const [termino, setTermino] = useState("");

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (termino.trim() && typeof onSearch === 'function') {
      onSearch(termino);
    }
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    setTermino(valor);
    
    if (typeof onSearch === 'function') {
      onSearch(valor); 
    }
  };

  return (
    <form onSubmit={manejarBusqueda} className="relative group hidden sm:block">
      <input
        type="text"
        placeholder="Buscar proyecto..."
        value={termino}
        onChange={handleChange}
        className="bg-[#FFB7C5]/20 py-2.5 px-6 pr-12 rounded-full outline-none focus:ring-2 focus:ring-[#FFB7C5] w-48 md:w-64 transition-all placeholder:text-[#FFB7C5] font-medium text-slate-700"
      />
      <button 
        type="submit" 
        className="absolute right-4 top-3 text-[#BFD7ED] hover:text-[#FFB7C5] transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}