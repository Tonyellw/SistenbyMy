/**
 * App Principal - SISTEMA
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navigation, Page } from '@/components/Navigation';
import { IdentitySelection } from '@/pages/IdentitySelection';
import { Dashboard } from '@/pages/Dashboard';
import { Calendar } from '@/pages/Calendar';
import { Missions } from '@/pages/Missions';
import { Analytics } from '@/pages/Analytics';
import { Profile } from '@/pages/Profile';

const AppContent: React.FC = () => {
  const { initialized, setIdentity, loading } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 rounded-full border-2 border-neon-red shadow-neon-red-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black neon-text-red">S</span>
          </div>
          <p className="text-gray-600 font-mono text-sm">CARREGANDO...</p>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return <IdentitySelection onSelect={setIdentity} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <Calendar />;
      case 'missions': return <Missions />;
      case 'analytics': return <Analytics />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen grid-bg scanlines">
      <Navigation current={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content */}
      <main className="lg:ml-20 pb-20 lg:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
