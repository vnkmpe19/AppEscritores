"use client";
import React from 'react';

export default function Libreta({ project, active = false }) {
 
  const autor = project.author || "Patito Sexy"; 

  return (
    <div className={`relative transition-all duration-500 ${active ? 'scale-105' : 'scale-100'}`}>
      
      <div className={`w-[240px] h-[340px] md:w-[280px] md:h-[400px] ${project.coverColor} rounded-r-[20px] rounded-l-[4px] shadow-2xl relative overflow-hidden flex flex-col border-l-[12px] border-black/10`}>
        
       
        <div className="absolute right-8 top-0 bottom-0 w-4 bg-black/5 z-10" />
        
        <div className="flex-1 m-4 bg-white/20 rounded-lg overflow-hidden relative border border-white/30">
          
          
          {project.image && (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover mix-blend-multiply opacity-80" 
            />
          )}
          
          
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-sm border border-slate-200 shadow-md text-center w-full">
              <h4 className="font-serif font-black text-2xl text-slate-800 line-clamp-2 mb-2">{project.title}</h4>
              <div className="h-[2px] bg-slate-800 w-full mt-2 mb-2" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Escrito por: <span className="text-[#FF5C5C]">{autor}</span>
              </p>
            </div>
          </div>
        </div>

      
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
      </div>

     
      <div className="absolute -bottom-4 left-4 right-0 h-4 bg-black/10 blur-xl rounded-full -z-10" />
    </div>
  );
}