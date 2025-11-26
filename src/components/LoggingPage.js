import React from 'react';
import { ExternalLink, Clock, Calendar } from 'lucide-react';

const LoggingPage = () => {
  const loggingTools = [
    {
      id: 1,
      name: 'Tortilla App',
      description: 'Werkuren registratie en project tracking',
      url: 'https://tortilla.phpro.be/worklogs',
      icon: Clock,
      color: 'bg-gradient-orange-pink'
    },
    {
      id: 2,
      name: 'Timesheets Cronos',
      description: 'Timesheet beheer en rapportage',
      url: 'https://timesheets.cronos.be/',
      icon: Calendar,
      color: 'bg-gradient-blue-purple'
    }
  ];

  const handleExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Logging</h1>
          <p className="text-white/70">Werkuren registratie en timesheet beheer</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Vandaag gelogd</p>
              <p className="text-white text-2xl font-bold">7.5h</p>
            </div>
          </div>
        </div>
        
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Deze week</p>
              <p className="text-white text-2xl font-bold">32h</p>
            </div>
          </div>
        </div>
        
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <ExternalLink className="w-8 h-8 text-purple-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Actieve projecten</p>
              <p className="text-white text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logging Tools */}
      <div>
        <h2 className="text-white text-xl font-semibold mb-4">Logging Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loggingTools.map((tool) => {
            const Icon = tool.icon;
            
            return (
              <div key={tool.id} className="gradient-card rounded-xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{tool.name}</h3>
                    <p className="text-white/70 text-sm">{tool.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{tool.url}</span>
                  <button
                    onClick={() => handleExternalLink(tool.url)}
                    className="btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Openen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-white text-xl font-semibold mb-4">Recente Activiteit</h2>
        <div className="gradient-card rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">E-commerce Store Redesign</p>
                  <p className="text-white/60 text-sm">TechCorp - Frontend Development</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">2.5h</p>
                <p className="text-white/60 text-sm">Vandaag</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">Mobile App Integration</p>
                  <p className="text-white/60 text-sm">StartupXYZ - API Development</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">3h</p>
                <p className="text-white/60 text-sm">Gisteren</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <div>
                  <p className="text-white font-medium">Payment Gateway Setup</p>
                  <p className="text-white/60 text-sm">RetailCo - Integration Testing</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white">1.5h</p>
                <p className="text-white/60 text-sm">Maandag</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <button className="btn-secondary w-full py-3 rounded-lg text-white font-medium">
              Alle activiteiten bekijken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggingPage;
