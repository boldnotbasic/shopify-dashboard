import React, { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';

const Header = ({ setIsLoggedIn, setActiveTab }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Shopify Dashboard');
  const [showDropdown, setShowDropdown] = useState(false);

  const platforms = [
    {
      name: 'Shopify Dashboard'
    },
    {
      name: 'Shopware Dashboard'
    },
    {
      name: 'Meteor Global Dashboard'
    }
  ];

  const handlePlatformSelect = (platformName) => {
    setSelectedPlatform(platformName);
    setShowDropdown(false);
    // Store selected platform in localStorage
    localStorage.setItem('selected-platform', platformName);
    // Update document title
    updateDocumentTitle(platformName);
  };

  const updateDocumentTitle = (platform) => {
    document.title = `${platform} - Meteor`;
  };

  // Load selected platform from localStorage on mount
  useEffect(() => {
    const savedPlatform = localStorage.getItem('selected-platform');
    if (savedPlatform) {
      setSelectedPlatform(savedPlatform);
      updateDocumentTitle(savedPlatform);
    } else {
      // Set default title for Shopify
      updateDocumentTitle('Shopify Dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('shopify-dashboard-logged-in');
    setIsLoggedIn(false);
  };

  return (
    <header className="glass-effect p-4 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Zoeken..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Platform Dropdown */}
          <div className="relative z-[100000]">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 bg-white/15 border border-white/30 rounded-xl px-5 py-3 text-white hover:bg-white/25 transition-all duration-200 shadow-lg"
            >
              <span className="text-sm font-medium">{selectedPlatform}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <>
                {/* Overlay to close dropdown */}
                <div 
                  className="fixed inset-0 z-[99998]"
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* Dropdown content */}
                <div className="absolute right-0 mt-2 w-72 bg-white/15 backdrop-filter backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl z-[99999]">
                  <div className="p-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.name}
                        onClick={() => handlePlatformSelect(platform.name)}
                        className={`w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg text-sm transition-all duration-200 mb-1 ${
                          selectedPlatform === platform.name ? 'bg-white/20 border border-white/30' : 'border border-transparent'
                        }`}
                      >
                        <div className="font-semibold">{platform.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="relative p-2 text-white/80 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 text-white/80 hover:text-white transition-colors"
            title="Uitloggen"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
            onClick={() => setActiveTab && setActiveTab('settings')}
            title="Open instellingen"
          >
            <div className="text-right">
              <p className="text-white font-medium">Hi Gijs!</p>
              <p className="text-white/60 text-sm">Admin</p>
            </div>
            <div className="w-10 h-10 bg-gradient-blue-purple rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">G</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
