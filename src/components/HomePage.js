import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Folder, 
  Palette, 
  Smartphone, 
  LayoutGrid,
  Clock, 
  DollarSign, 
  Activity,
  Star
} from 'lucide-react';

const HomePage = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalThemes: 0,
    totalApps: 0,
    totalHours: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
    const themes = JSON.parse(localStorage.getItem('shopify-dashboard-themes') || '[]');
    const apps = JSON.parse(localStorage.getItem('shopify-dashboard-apps') || '[]');
    const salesData = JSON.parse(localStorage.getItem('shopify-dashboard-sales') || '[]');

    const activeProjects = projects.filter(p => p.status === 'In Progress').length;
    const totalHours = salesData.filter(s => s.included).reduce((sum, s) => sum + s.hours, 0);
    const totalRevenue = salesData.filter(s => s.included).reduce((sum, s) => sum + s.total, 0);

    setStats({
      totalProjects: projects.length,
      activeProjects,
      totalThemes: themes.length,
      totalApps: apps.length,
      totalHours,
      totalRevenue
    });
  }, []);

  const quickActions = [
    { 
      id: 'sales', 
      title: 'Sales Calculator', 
      description: 'Bereken project kosten', 
      icon: TrendingUp, 
      color: 'bg-gradient-blue-purple' 
    },
    { 
      id: 'projecten', 
      title: 'Projecten', 
      description: 'Beheer je projecten', 
      icon: Folder, 
      color: 'bg-gradient-green-blue' 
    },
    { 
      id: 'themes', 
      title: 'Themes', 
      description: 'Shopify themes', 
      icon: Palette, 
      color: 'bg-gradient-purple-pink' 
    },
    { 
      id: 'apps', 
      title: 'Apps', 
      description: 'App integraties', 
      icon: LayoutGrid, 
      color: 'bg-gradient-orange-pink' 
    }
  ];

  const recentActivity = [
    { type: 'project', title: 'E-commerce Store Redesign', action: 'Updated', time: '2 uur geleden', status: 'success' },
    { type: 'theme', title: 'Minimal Pro', action: 'Added', time: '4 uur geleden', status: 'info' },
    { type: 'app', title: 'Inventory Manager', action: 'Installed', time: '1 dag geleden', status: 'success' },
    { type: 'sales', title: 'Quote Generated', action: 'Created', time: '2 dagen geleden', status: 'warning' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project': return Folder;
      case 'theme': return Palette;
      case 'app': return LayoutGrid;  // ⚏ Grid icoon
      case 'sales': return TrendingUp;
      default: return Activity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welkom terug, Gijs! 👋
        </h1>
        <p className="text-white/70 text-lg">
          Hier is een overzicht van je Shopify dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Folder className="w-8 h-8 text-blue-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Totaal Projecten</p>
              <p className="text-white text-2xl font-bold">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Actieve Projecten</p>
              <p className="text-white text-2xl font-bold">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Totaal Uren</p>
              <p className="text-white text-2xl font-bold">{stats.totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Totale Omzet</p>
              <p className="text-white text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white text-2xl font-semibold mb-4">Snelle Acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="gradient-card rounded-xl p-6 hover:scale-105 transition-transform text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-white/70 text-sm">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recente Activiteit
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-center py-3 border-b border-white/10 last:border-b-0">
                  <Icon className={`w-5 h-5 mr-3 ${getStatusColor(activity.status)}`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-white/60 text-sm">{activity.action} • {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Handige Resources
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Themes</p>
                <p className="text-white/60 text-sm">{stats.totalThemes} beschikbaar</p>
              </div>
              <button 
                onClick={() => setActiveTab('themes')}
                className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
              >
                Bekijk
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Apps</p>
                <p className="text-white/60 text-sm">{stats.totalApps} geïnstalleerd</p>
              </div>
              <button 
                onClick={() => setActiveTab('apps')}
                className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
              >
                Beheer
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Logging</p>
                <p className="text-white/60 text-sm">Tijd registratie</p>
              </div>
              <button 
                onClick={() => setActiveTab('logging')}
                className="btn-primary px-4 py-2 rounded-lg text-white text-sm"
              >
                Log Tijd
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alessandro Message */}
      <div className="gradient-card rounded-xl p-4 mb-8 text-center">
        <p className="text-white/80 text-lg font-medium">
          💡 A logske a day keeps Alessandro away
        </p>
      </div>

    </div>
  );
};

export default HomePage;
