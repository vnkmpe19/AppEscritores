export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import TableroClient from './TableroClient';
import { ReactFlowProvider } from '@xyflow/react';

/**
 * Server Component wrapper for the Tablero page.
 * Forces dynamic rendering and isolates the Suspense boundary for useSearchParams.
 */
export default function TableroPage() {
  return (
    <ReactFlowProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen font-bold text-slate-400 bg-[#FFF5F5]">
            Cargando tablero...
          </div>
        }
      >
        <TableroClient />
      </Suspense>
    </ReactFlowProvider>
  );
}

