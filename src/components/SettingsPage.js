import React, { useState } from 'react';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    language: 'nl',
    timezone: 'Europe/Amsterdam'
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">Beheer je account en applicatie instellingen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <User className="w-5 h-5 text-white mr-3" />
            <h2 className="text-white text-xl font-semibold">Profiel</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Naam</label>
              <input
                type="text"
                defaultValue="Gijs Meteor"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <input
                type="email"
                defaultValue="gijs@meteor.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Rol</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400">
                <option value="admin" className="bg-gray-800">Administrator</option>
                <option value="user" className="bg-gray-800">Gebruiker</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Bell className="w-5 h-5 text-white mr-3" />
            <h2 className="text-white text-xl font-semibold">Notificaties</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Push notificaties</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Email updates</span>
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) => updateSetting('emailUpdates', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Palette className="w-5 h-5 text-white mr-3" />
            <h2 className="text-white text-xl font-semibold">Uiterlijk</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Taal</label>
              <select 
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="nl" className="bg-gray-800">Nederlands</option>
                <option value="en" className="bg-gray-800">English</option>
                <option value="fr" className="bg-gray-800">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Tijdzone</label>
              <select 
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Europe/Amsterdam" className="bg-gray-800">Amsterdam</option>
                <option value="Europe/London" className="bg-gray-800">London</option>
                <option value="America/New_York" className="bg-gray-800">New York</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-white mr-3" />
            <h2 className="text-white text-xl font-semibold">Beveiliging</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
              Wachtwoord wijzigen
            </button>
            <button className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors">
              Twee-factor authenticatie
            </button>
            <button className="w-full bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 text-red-300 hover:bg-red-500/30 transition-colors">
              Account deactiveren
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Instellingen opslaan</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
