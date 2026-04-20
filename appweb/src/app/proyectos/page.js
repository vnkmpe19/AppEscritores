export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import ProyectosClient from './ProyectosClient';

/**
 * Server Component wrapper for the Proyectos page.
 * Forces dynamic rendering and isolates the Suspense boundary for useSearchParams.
 */
export default function ProyectosPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">
          Cargando biblioteca...
        </div>
      }
    >
      <ProyectosClient />
    </Suspense>
  );
}