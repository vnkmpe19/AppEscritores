"use client";
import React from 'react';

export function InputField({ label, ...props }) {
  return (
    <div className="group text-left">
      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-2 group-focus-within:text-[#FF5C5C] transition-colors">
        {label}
      </label>
      <input
        className="w-full px-6 py-4 rounded-full bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#B4DDEB]/30 focus:border-[#B4DDEB] outline-none text-sm font-bold text-slate-700 transition-all shadow-sm"
        {...props}
      />
    </div>
  );
}

export function SectionTextarea({ label, ...props }) {
  return (
    <div className="group text-left">
      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 ml-4 group-focus-within:text-[#FF5C5C] transition-colors">
        {label}
      </label>
      <textarea
        rows={4}
        className="w-full p-8 rounded-[40px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#B4DDEB]/30 focus:border-[#B4DDEB] outline-none text-sm font-medium text-slate-600 leading-relaxed resize-none transition-all shadow-sm"
        {...props}
      />
    </div>
  );
}

export function SaveButton() {
  return (
    <div className="flex justify-end mt-10">
      <button type="button" className="bg-[#FF5C5C] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all">
        Guardar Sección
      </button>
    </div>
  );
}