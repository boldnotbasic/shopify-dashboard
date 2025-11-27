import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import SalesPage from './components/SalesPage';
import SalesOverviewPage from './components/SalesOverviewPage';
import RoyalTalensSalesPage from './components/RoyalTalensSalesPage';
import DremababySalesPage from './components/DremababySalesPage';
import CustomSalesPage from './components/CustomSalesPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import ThemesPage from './components/ThemesPage';
import AppsPage from './components/AppsPage';
import FaqClientsPage from './components/FaqClientsPage';
import UsersPage from './components/UsersPage';
import LoggingPage from './components/LoggingPage';
import SettingsPage from './components/SettingsPage';
import QuizPage from './components/QuizPage';
import BrandingPage from './components/BrandingPage';
import BrandingResourcesPage from './components/BrandingResourcesPage';
import DevModeToggle from './components/DevModeToggle';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('shopify-dashboard-logged-in') === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  // Listen for project selection events from sidebar
  useEffect(() => {
    const handleSelectProject = (event) => {
      setSelectedProject(event.detail.projectId);
    };

    window.addEventListener('selectProject', handleSelectProject);
    
    return () => {
      window.removeEventListener('selectProject', handleSelectProject);
    };
  }, []);

  // Clear selected project when switching tabs (except to projecten tab)
  useEffect(() => {
    if (activeTab !== 'projecten') {
      setSelectedProject(null);
    }
  }, [activeTab]);

  const renderContent = () => {
    // Show project detail if a project is selected
    if (selectedProject) {
      return <ProjectDetailPage 
        projectId={selectedProject} 
        setActiveTab={setActiveTab} 
        setSelectedProject={setSelectedProject} 
      />;
    }

    // Check if it's a custom sales tab
    if (activeTab.startsWith('sales-') && !['sales-calculator', 'sales-royal-talens', 'sales-dremababy'].includes(activeTab)) {
      const customClients = JSON.parse(localStorage.getItem('custom-sales-clients') || '[]');
      const client = customClients.find(c => c.tabId === activeTab);
      if (client) {
        return <CustomSalesPage clientName={client.name} tabId={client.tabId} />;
      }
    }


    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'sales':
        return <SalesOverviewPage setActiveTab={setActiveTab} />;
      case 'sales-calculator':
        return <SalesPage />;
      case 'sales-royal-talens':
        return <RoyalTalensSalesPage />;
      case 'sales-dremababy':
        return <DremababySalesPage />;
      case 'projecten':
        return <ProjectsPage setSelectedProject={setSelectedProject} setActiveTab={setActiveTab} />;
      case 'themes':
        return <ThemesPage />;
      case 'apps':
        return <AppsPage />;
      case 'faq-clients':
        return <FaqClientsPage />;
      case 'users':
        return <UsersPage />;
      case 'logging':
        return <LoggingPage />;
      case 'settings':
        return <SettingsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'upsells':
      case 'learning':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'branding':
        return <BrandingPage setActiveTab={setActiveTab} />;
      case 'branding-meteor':
        return <BrandingResourcesPage mode="meteor" />;
      case 'branding-templates':
        return <BrandingResourcesPage mode="templates" />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <Header setIsLoggedIn={setIsLoggedIn} setActiveTab={setActiveTab} />
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      <DevModeToggle />
    </div>
  );
}

export default App;
