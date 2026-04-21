export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import EscenasClient from './EscenasClient';

/**
 * Server Component wrapper for the Escenas page.
 * Forces dynamic rendering and isolates the Suspense boundary for useSearchParams.
 */
export default function EscenasPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">
          Cargando escenas...
        </div>
      }
    >
      <EscenasClient />
    </Suspense>
  );
}