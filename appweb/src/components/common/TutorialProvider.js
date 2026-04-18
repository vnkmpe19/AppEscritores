"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import TutorialModal from '@/components/common/TutorialModal';

const TutorialContext = createContext(null);

export function useTutorial() {
  return useContext(TutorialContext);
}

export default function TutorialProvider({ children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('escrimundo_tutorial_seen');
    if (!seen) {
      const t = setTimeout(() => setShow(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const openTutorial = () => {
    setShow(true);
  };

  return (
    <TutorialContext.Provider value={{ openTutorial }}>
      {children}
      <TutorialModal isOpen={show} onClose={() => setShow(false)} />
    </TutorialContext.Provider>
  );
}
