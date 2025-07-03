// src/contexts/LayoutContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
  displayHeader: boolean;
  setHeaderVisibility: (visible: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [displayHeader, setDisplayHeader] = useState(true); // Default to true

  const value = {
    displayHeader,
    setHeaderVisibility: setDisplayHeader,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};