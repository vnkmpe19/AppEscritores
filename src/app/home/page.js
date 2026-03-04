"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#FEFFE8] font-serif">
      
      {/* 1. EL ESCENARIO COMPLETO (Imagen única de Figma) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/fondoHome_Mesa de trabajo 1.png" 
          alt="Habitación Creativa" 
          fill
          className="object-cover select-none" 
        />
      </div>

      {/* 2. CAPA INTERACTIVA (Solo los textos) */}
      <div className="relative z-10 w-full h-full text-[#334155]">
        
        {/* TEXTO: Worldbuilding (Vertical) */}
        <Link 
          href="/mundo" 
          className="absolute left-[14%] top-[50%] -translate-y-1/2 
                     text-3xl md:text-5xl font-bold 
                     [writing-mode:vertical-lr] rotate-180
                     hover:text-black hover:scale-110 transition-all duration-300"
        >
          Worldbuilding
        </Link>

        {/* TEXTO: Personajes (Horizontal) */}
        <Link 
          href="/personajes" 
          className="absolute left-[43%] bottom-[28%] -translate-x-1/2
                     text-3xl md:text-6xl font-bold 
                     hover:text-black hover:scale-110 transition-all duration-300"
        >
          Personajes
        </Link>

        {/* TEXTO: Proyectos (Horizontal) */}
        <Link 
          href="/proyectos" 
          className="absolute left-[75%] bottom-[28%] -translate-x-1/2
                     text-3xl md:text-6xl font-bold 
                     hover:text-black hover:scale-110 transition-all duration-300"
        >
          Proyectos
        </Link>

      </div>

      {/* 3. ICONO BOMBILLA (Sigue siendo un elemento aparte para que brille) */}
      <Link href="/ocurrencias" className="absolute bottom-[4%] right-[4%] w-[10vw] max-w-37.5 z-20">
        <Image 
          src="/bombilla.png" 
          alt="Idea" 
          width={150}
          height={150}
          className="w-full h-auto drop-shadow-xl animate-pulse cursor-pointer hover:rotate-12 transition-transform" 
        />
      </Link>

    </main>
  );
}