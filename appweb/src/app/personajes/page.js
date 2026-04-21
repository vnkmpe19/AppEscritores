export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import PersonajesClient from './PersonajesClient';

/**
 * Server Component wrapper for the Personajes page.
 * Forces dynamic rendering and isolates the Suspense boundary for useSearchParams.
 */
export default function PersonajesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FDF5F5]">
          Cargando personajes...
        </div>
      }
    >
      <PersonajesClient />
    </Suspense>
  );
}