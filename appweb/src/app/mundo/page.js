export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import MundoClient from './MundoClient';

/**
 * Server Component wrapper for the Mundo page.
 * Forces dynamic rendering and isolates the Suspense boundary for useSearchParams.
 */
export default function MundoPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">
          Cargando mundo...
        </div>
      }
    >
      <MundoClient />
    </Suspense>
  );
}