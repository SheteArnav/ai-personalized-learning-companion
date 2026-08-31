import React, { useState } from 'react';
import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';
import { ToastContainer } from '../common/Toast.js';
import { useLearning } from '../../context/LearningContext.js';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTab } = useLearning();

  const isFullWidthPage = activeTab === 'landing' || activeTab === 'onboarding';

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {!isFullWidthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className={`flex-1 min-w-0 ${isFullWidthPage ? 'w-full' : 'p-4 sm:p-6 lg:p-8'}`}>
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
