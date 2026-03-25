"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative w-full h-screen bg-[#FEFFE8] font-serif overflow-hidden">
      
      <div className="absolute inset-0">
        <Image 
          src="/fondoHome_Mesa de trabajo 1.png" 
          alt="Habitación Creativa" 
          fill
          className="object-contain object-center select-none block" 
          priority
        />
      </div>

      <div className="absolute inset-0 text-[#334155]">

        <Link 
          href="/mundo" 
          className="
            absolute
            left-[11%] top-[35%]
            text-[2.5vw] font-bold
            [writing-mode:vertical-lr] rotate-180
            hover:text-black hover:scale-110 transition-all duration-300
          "
        >
          Mundos
        </Link>

        <Link 
          href="/personajes" 
          className="
            absolute
            left-[38%] bottom-[6%]
            -translate-x-1/2
            text-[3.5vw] font-bold
            hover:text-black hover:scale-110 transition-all duration-300
          "
        >
          Personajes
        </Link>

        <Link 
          href="/proyectos" 
          className="
            absolute
            left-[65%] bottom-[6%]
            -translate-x-1/2
            text-[3.5vw] font-bold
            hover:text-black hover:scale-110 transition-all duration-300
          "
        >
          Proyectos
        </Link>

      </div>

      <Link 
        href="/ocurrencias" 
        className="absolute bottom-[3%] right-[3%] w-[8vw] max-w-[120px] min-w-[40px] z-20"
      >
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