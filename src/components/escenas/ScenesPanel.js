"use client";
import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar'; 
import SceneSidebar from './SceneSidebar';
import SceneEditor from './SceneEditor';

export default function ScenePanel() {
  const [selectedScene, setSelectedScene] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-[#FDF5F5] overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'} overflow-hidden`}>
        
        <Header 
          title="Escenas de la Novela" 
          onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        />

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          <SceneSidebar 
            onSelectScene={setSelectedScene} 
            selectedScene={selectedScene} 
          />

          <main className="flex-1 overflow-hidden flex flex-col bg-white">
            <SceneEditor scene={selectedScene} />
          </main>
          
        </div>
      </div>
    </div>
  );
}