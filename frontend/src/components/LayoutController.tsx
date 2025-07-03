// src/components/LayoutController.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header';
import { LayoutProvider, useLayout } from '@/contexts/layout-control'; // Import context

const LayoutControllerContent: React.FC = () => {
  const { displayHeader } = useLayout(); // Consume displayHeader from context

  return (
    <>
      {displayHeader && <Header />}
      <main className=''>
        <Outlet />
      </main>
    </>
  );
};

// Wrapper to provide the context
const LayoutController: React.FC = () => {
  return (
    <LayoutProvider>
      <LayoutControllerContent />
    </LayoutProvider>
  );
};

export default LayoutController;