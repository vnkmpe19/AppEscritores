export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import OcurrenciasClient from './OcurrenciasClient';

/**
 * Server Component wrapper for the Ocurrencias page.
 * This pattern ensures that useSearchParams() inside OcurrenciasClient
 * is correctly handled behind a Suspense boundary during both
 * Static Site Generation (Build) and Client-Side Rendering.
 */
export default function OcurrenciasPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">
          Cargando ocurrencias...
        </div>
      }
    >
      <OcurrenciasClient />
    </Suspense>
  );
}