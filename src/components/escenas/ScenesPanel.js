// src/components/escenas/ScenePanel.js
import React, { useState } from 'react';
import Header from '../common/Header'; // Tu header existente
import Sidebar from '../common/Sidebar'; // Tu sidebar existente
import SceneSidebar from './SceneSidebar';
import SceneEditor from './SceneEditor';

export default function ScenePanel() {
  // Estado para manejar qué escena se está editando
  const [selectedScene, setSelectedScene] = useState(null);

  return (
    <div className="flex h-screen bg-[#FDF5F5]">
      {/* Sidebar Global */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Global */}
        <Header title="Escenas de la Novela" />

        <div className="flex flex-1 overflow-hidden">
          {/* Panel Lateral de Escenas (tipo libreta) */}
          <SceneSidebar 
            onSelectScene={setSelectedScene} 
            selectedScene={selectedScene} 
          />

          {/* Editor Central (Bloc de notas grande) */}
          <SceneEditor scene={selectedScene} />
        </div>
      </div>
    </div>
  );
}