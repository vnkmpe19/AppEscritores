import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar'; 
import SceneSidebar from './SceneSidebar';
import SceneEditor from './SceneEditor';

export default function ScenePanel() {
  const [selectedScene, setSelectedScene] = useState(null);

  return (
    <div className="flex h-screen bg-[#FDF5F5]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Escenas de la Novela" />

        <div className="flex flex-1 overflow-hidden">
          <SceneSidebar 
            onSelectScene={setSelectedScene} 
            selectedScene={selectedScene} 
          />

          <SceneEditor scene={selectedScene} />
        </div>
      </div>
    </div>
  );
}