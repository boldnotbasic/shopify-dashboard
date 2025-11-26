import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  FolderOpen, 
  Palette, 
  Smartphone, 
  Settings, 
  HelpCircle,
  Store,
  Edit,
  X,
  Clock,
  Github,
  BookOpen,
  Bug,
  ShoppingBag,
  Sparkles,
  Home,
  GripVertical
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [logoSettings, setLogoSettings] = useState(() => {
    const saved = localStorage.getItem('shopify-dashboard-logo');
    return saved ? JSON.parse(saved) : {
      shopifyLogo: '',
      meteorLogo: '',
      companyName: 'METEOR'
    };
  });
  
  const [showLogoEdit, setShowLogoEdit] = useState(false);
  const [tempLogo, setTempLogo] = useState(logoSettings);

  useEffect(() => {
    localStorage.setItem('shopify-dashboard-logo', JSON.stringify(logoSettings));
  }, [logoSettings]);

  useEffect(() => {
    setTempLogo(logoSettings);
  }, [logoSettings]);

  const handleFileUpload = (file, logoType) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempLogo(prev => ({
          ...prev,
          [logoType]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLogo = () => {
    setLogoSettings(tempLogo);
    setShowLogoEdit(false);
  };

  const cancelEdit = () => {
    setTempLogo(logoSettings);
    setShowLogoEdit(false);
  };
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('shopify-dashboard-menu-order');
    return saved ? JSON.parse(saved) : [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'sales', label: 'Sales', icon: TrendingUp },
      { id: 'projecten', label: 'Projecten', icon: FolderOpen },
      { id: 'themes', label: 'Themes', icon: Palette },
      { id: 'apps', label: 'Apps', icon: Smartphone },
      { id: 'logging', label: 'Logging', icon: Clock },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  });

  // Save menu order to localStorage
  useEffect(() => {
    localStorage.setItem('shopify-dashboard-menu-order', JSON.stringify(menuItems));
  }, [menuItems]);

  const otherItems = [
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'store', label: 'Meteor Merch store', icon: Store },
    { id: 'github', label: 'GitHub', icon: Github, external: true, url: 'https://github.com' },
    { id: 'confluence', label: 'Confluence', icon: BookOpen, external: true, url: 'https://xploregroup.atlassian.net/wiki/home' },
    { id: 'jira', label: 'Jira', icon: Bug, external: true, url: 'https://xploregroup.atlassian.net/jira' },
    { id: 'shopify-partner', label: 'Shopify Partner Portal', icon: ShoppingBag, external: true, url: 'https://partners.shopify.com/1841109/stores' },
    { id: 'share-a-thon', label: 'Share-a-Thon', icon: Sparkles, external: true, url: 'https://xploregroup.atlassian.net/wiki/spaces/SHOPIFY/pages/8531837583/Shopify+Share-a-Thon' },
  ];

  return (
    <div className="w-72 min-h-screen glass-effect p-6">
      {/* Logo Section */}
      <div className="mb-8 text-center relative">
        <button 
          onClick={() => setShowLogoEdit(true)}
          className="absolute top-0 right-0 text-white/60 hover:text-white transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-green-500 rounded mr-2 flex items-center justify-center overflow-hidden">
            {logoSettings.shopifyLogo ? (
              <img 
                src={logoSettings.shopifyLogo} 
                alt="Shopify"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white font-bold text-sm">S</span>
            )}
          </div>
          <span className="text-white font-semibold">Shopify</span>
          <span className="text-white/60 mx-2">×</span>
          <span className="text-white font-semibold">{logoSettings.companyName}</span>
        </div>
        <h1 className="text-white text-xl font-semibold">Shopify Dashboard</h1>
      </div>

      {/* Logo Edit Modal */}
      {showLogoEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Logo Instellingen</h2>
              <button 
                onClick={cancelEdit}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Shopify Logo</label>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log('File selected:', e.target.files[0]);
                        handleFileUpload(e.target.files[0], 'shopifyLogo');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="shopify-logo-upload"
                    />
                    <label 
                      htmlFor="shopify-logo-upload"
                      className="flex items-center justify-center w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-white font-medium">Bestand kiezen</span>
                    </label>
                  </div>
                  {tempLogo.shopifyLogo && (
                    <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                      <img 
                        src={tempLogo.shopifyLogo} 
                        alt="Shopify preview"
                        className="w-8 h-8 object-contain rounded"
                      />
                      <span className="text-white/70 text-sm flex-1">Logo geüpload</span>
                      <button
                        onClick={() => setTempLogo(prev => ({...prev, shopifyLogo: ''}))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Verwijderen
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={tempLogo.companyName}
                  onChange={(e) => setTempLogo({...tempLogo, companyName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="METEOR"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-2">Bedrijfslogo</label>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log('Company file selected:', e.target.files[0]);
                        handleFileUpload(e.target.files[0], 'meteorLogo');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="meteor-logo-upload"
                    />
                    <label 
                      htmlFor="meteor-logo-upload"
                      className="flex items-center justify-center w-full h-12 bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-white font-medium">Bestand kiezen</span>
                    </label>
                  </div>
                  {tempLogo.meteorLogo && (
                    <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                      <img 
                        src={tempLogo.meteorLogo} 
                        alt="Bedrijf preview"
                        className="w-8 h-8 object-contain rounded"
                      />
                      <span className="text-white/70 text-sm flex-1">Logo geüpload</span>
                      <button
                        onClick={() => setTempLogo(prev => ({...prev, meteorLogo: ''}))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Verwijderen
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preview */}
              <div className="border border-white/20 rounded-lg p-4">
                <p className="text-white/70 text-sm mb-2">Preview:</p>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded mr-2 flex items-center justify-center overflow-hidden">
                    {tempLogo.shopifyLogo ? (
                      <img 
                        src={tempLogo.shopifyLogo} 
                        alt="Shopify"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">S</span>
                    )}
                  </div>
                  <span className="text-white font-semibold">Shopify</span>
                  <span className="text-white/60 mx-2">×</span>
                  <span className="text-white font-semibold">{tempLogo.companyName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={saveLogo}
                className="btn-primary px-6 py-2 rounded-lg text-white font-medium flex-1"
              >
                Opslaan
              </button>
              <button 
                onClick={cancelEdit}
                className="glass-effect px-6 py-2 rounded-lg text-white font-medium flex-1"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          const handleDragStart = (e) => {
            e.dataTransfer.setData('text/plain', index.toString());
          };

          const handleDragOver = (e) => {
            e.preventDefault();
          };

          const handleDrop = (e) => {
            e.preventDefault();
            const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const dropIndex = index;
            
            if (dragIndex !== dropIndex) {
              const newItems = [...menuItems];
              const draggedItem = newItems[dragIndex];
              newItems.splice(dragIndex, 1);
              newItems.splice(dropIndex, 0, draggedItem);
              setMenuItems(newItems);
            }
          };
          
          return (
            <div
              key={item.id}
              draggable
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="group"
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left nav-item
                  ${isActive 
                    ? 'nav-item-active text-white' 
                    : 'text-white/80 hover:text-white'
                  }
                `}
              >
                <GripVertical className="w-4 h-4 mr-2 text-white/40 group-hover:text-white/60 cursor-grab" />
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Other Section */}
      <div>
        <h3 className="text-white/60 text-sm font-medium mb-4 px-4">Andere</h3>
        <div className="space-y-2">
          {otherItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            const handleClick = () => {
              if (item.external) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
              } else {
                setActiveTab(item.id);
              }
            };
            
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left nav-item
                  ${isActive 
                    ? 'nav-item-active text-white' 
                    : 'text-white/80 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {item.external && (
                  <svg className="w-3 h-3 ml-auto opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
