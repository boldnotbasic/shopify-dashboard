import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Folder, 
  Palette, 
  Smartphone, 
  Settings, 
  HelpCircle,
  Store,
  Clock,
  Home,
  MoreHorizontal,
  MessageSquare,
  Calculator,
  Users,
  Baby,
  CheckCircle,
  User,
  Building,
  Briefcase,
  Zap,
  Heart,
  Star,
  Rocket,
  Globe,
  Shield,
  XCircle,
  BarChart3,
  FolderOpen,
  Brush,
  Grid3X3,
  LayoutGrid,
  Mail,
  UserCheck,
  Activity,
  Cog,
  DollarSign,
  Layers,
  PaintBucket,
  Blocks,
  Send,
  UsersRound,
  FileText,
  Wrench,
  ChevronRight,
  ArrowUp,
  FileImage
} from 'lucide-react';

// Direct icon mapping - no state, always fresh
const getMainIcon = (id) => {
  const iconMap = {
    home: Home,
    sales: DollarSign,
    upsells: Zap,
    learning: Activity,
    branding: Brush,
    projecten: Folder,        // 📁 Folder icoon
    themes: Palette,          // 🎨 Palette icoon (niet emmertje)
    apps: LayoutGrid,         // ⚏ Grid icoon (2x2 vierkanten)
    'faq-clients': HelpCircle,
    users: UsersRound,
    logging: Clock,           // 🕐 Klokje icoon
    settings: Wrench,
  };
  return iconMap[id] || Home;
};

const otherIconMap = {
  quiz: HelpCircle,
  store: Store,
  github: Folder,
  confluence: Folder,
  jira: Settings,
  'shopify-partner': Store,
  'share-a-thon': TrendingUp,
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Icon mapping for custom clients
  const iconComponents = {
    'User': User,
    'Building': Building,
    'Store': Store,
    'Briefcase': Briefcase,
    'Zap': Zap,
    'Heart': Heart,
    'Star': Star,
    'Rocket': Rocket,
    'Globe': Globe,
    'Shield': Shield
  };

  // Dev mode state
  const [isDevMode, setIsDevMode] = useState(() => {
    return localStorage.getItem('dev-mode') === 'true';
  });
  
  const [disabledItems, setDisabledItems] = useState(() => {
    const saved = localStorage.getItem('dev-mode-selected-items');
    return saved ? JSON.parse(saved) : [];
  });

  // Read approval status from localStorage
  const [salesStatus, setSalesStatus] = useState(() => {
    const saved = localStorage.getItem('shopify-dashboard-sales-approval-status');
    return saved || 'default';
  });
  
  const [royalTalensStatus, setRoyalTalensStatus] = useState(() => {
    const saved = localStorage.getItem('royal-talens-sales-approval-status');
    return saved || 'default';
  });
  
  const [dreambabyStatus, setDreambabyStatus] = useState(() => {
    const saved = localStorage.getItem('dremababy-sales-approval-status');
    return saved || 'approved';
  });

  // Load custom sales clients
  const [customClients, setCustomClients] = useState(() => {
    const saved = localStorage.getItem('custom-sales-clients');
    return saved ? JSON.parse(saved) : [];
  });

  // Load projects from localStorage
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('shopify-dashboard-projects');
    return saved ? JSON.parse(saved) : [];
  });

  // Update approval status when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const salesSaved = localStorage.getItem('shopify-dashboard-sales-approval-status');
      setSalesStatus(salesSaved || 'default');
      
      const royalTalensSaved = localStorage.getItem('royal-talens-sales-approval-status');
      setRoyalTalensStatus(royalTalensSaved || 'default');
      
      const dreambabyStatusSaved = localStorage.getItem('dremababy-sales-approval-status');
      setDreambabyStatus(dreambabyStatusSaved || 'approved');
      
      // Update custom clients
      const customClientsSaved = localStorage.getItem('custom-sales-clients');
      setCustomClients(customClientsSaved ? JSON.parse(customClientsSaved) : []);
      
      // Update projects
      const projectsSaved = localStorage.getItem('shopify-dashboard-projects');
      setProjects(projectsSaved ? JSON.parse(projectsSaved) : []);
      
      // Don't update menuItems from localStorage to preserve icons
    };

    // Check on mount
    handleStorageChange();
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-window updates
    window.addEventListener('localStorageUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, []);

  // Listen for dev mode changes
  useEffect(() => {
    const handleDevModeChange = (event) => {
      setIsDevMode(event.detail.isDevMode);
      
      // Update disabled items
      const saved = localStorage.getItem('dev-mode-selected-items');
      setDisabledItems(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener('devModeChanged', handleDevModeChange);
    
    return () => {
      window.removeEventListener('devModeChanged', handleDevModeChange);
    };
  }, []);
  // Menu items WITHOUT icons - icons are fetched dynamically
  const [menuItems, setMenuItems] = useState([
    { id: 'home', label: 'Home' },
    { id: 'sales', label: 'Sales' },
    { id: 'upsells', label: 'Upsells' },
    { id: 'learning', label: 'Learning' },
    { id: 'branding', label: 'Branding' },
    { id: 'projecten', label: 'Projecten' },
    { id: 'themes', label: 'Themes' },
    { id: 'apps', label: 'Apps' },
    { id: 'faq-clients', label: 'FAQ clients' },
    { id: 'users', label: 'Users' },
    { id: 'logging', label: 'Logging' },
    { id: 'settings', label: 'Settings' },
  ]);

  // Clear localStorage on mount
  useEffect(() => {
    localStorage.removeItem('shopify-dashboard-menu-order');
    localStorage.removeItem('shopify-dashboard-other-menu-order');
  }, []);

  const [otherItems, setOtherItems] = useState(() => {
    const saved = localStorage.getItem('shopify-dashboard-other-menu-order');
    const defaults = [
      { id: 'quiz', label: 'Quiz', icon: 'quiz' },
      { id: 'store', label: 'Meteor Merch store', icon: 'store' },
      { id: 'github', label: 'GitHub', icon: 'github', external: true, url: 'https://github.com' },
      { id: 'confluence', label: 'Confluence', icon: 'confluence', external: true, url: 'https://xploregroup.atlassian.net/wiki/home' },
      { id: 'jira', label: 'Jira', icon: 'jira', external: true, url: 'https://xploregroup.atlassian.net/jira' },
      { id: 'shopify-partner', label: 'Shopify Partner Portal', icon: 'shopify-partner', external: true, url: 'https://partners.shopify.com/1841109/stores' },
      { id: 'share-a-thon', label: 'Share-a-Thon', icon: 'share-a-thon', external: true, url: 'https://xploregroup.atlassian.net/wiki/spaces/SHOPIFY/pages/8531837583/Shopify+Share-a-Thon' },
    ];
    const parsed = saved ? JSON.parse(saved) : defaults;
    return parsed.map((item) => {
      const savedIcon = item.icon;
      const revived = typeof savedIcon === 'string'
        ? (otherIconMap[savedIcon] || otherIconMap[item.id])
        : (typeof savedIcon === 'function' ? savedIcon : otherIconMap[item.id]);
      return { ...item, icon: revived };
    });
  });

  // Don't save menu order to localStorage to prevent corruption
  // Menu order is now static and icons are fetched dynamically

  // Save other items order to localStorage
  useEffect(() => {
    const toSave = otherItems.map((item) => ({ ...item, icon: item.id }));
    localStorage.setItem('shopify-dashboard-other-menu-order', JSON.stringify(toSave));
  }, [otherItems]);

  return (
    <div className="w-72 min-h-screen glass-effect p-6">
      {/* Logo Section */}
      <div className="mb-8">
        <button
          onClick={() => setActiveTab('home')}
          className="w-full hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src="/Logo_meteor_def.svg"
            alt="METEOR logo"
            className="w-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </button>
      </div>

      {/* Separator */}
      <div className="border-t border-white/10 mb-6"></div>

      {/* Navigation Section */}
      <nav className="space-y-2">
        <h3 className="text-white/60 text-sm font-medium mb-4 px-4">Hoofdmenu</h3>
        {menuItems.map((item, index) => {
          // Get icon directly from function, not from state
          const Icon = getMainIcon(item.id);
          const isActive = activeTab === item.id || 
            (item.id === 'sales' && (
              activeTab === 'sales-calculator' || 
              activeTab === 'sales-royal-talens' || 
              activeTab === 'sales-dremababy' ||
              activeTab.startsWith('sales-')
            ));
          
          // Check if item is disabled in dev mode
          const isDisabled = isDevMode && disabledItems.includes(item.id);

          // In dev mode, completely hide disabled items from the sidebar
          if (isDisabled) {
            return null;
          }
          
          const handleDragStart = (e) => {
            e.dataTransfer.setData('text/plain', index);
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
          
          const handleClick = () => {
            if (isDisabled) return; // Don't allow clicks when disabled
            
            // Toggle functionality: if already active, collapse
            if (activeTab === item.id) {
              setActiveTab('home');
            } else {
              setActiveTab(item.id);
            }
          };
          
          return (
            <div
              key={item.id}
              draggable={!isDisabled}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="group"
            >
              <button
                onClick={handleClick}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left nav-item
                  ${isActive 
                    ? 'nav-item-active text-white' 
                    : 'text-white/80 hover:text-white'
                  }
                `}
              >
                <MoreHorizontal className={`w-4 h-4 mr-2 ${isDisabled ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'} ${isDisabled ? 'cursor-not-allowed' : 'cursor-grab'}`} />
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
              
              {/* Sales Subtabs */}
              {item.id === 'sales' && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('sales-calculator');
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                      ${activeTab === 'sales-calculator'
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Sales Template
                    {salesStatus === 'approved' && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                    )}
                    {salesStatus === 'pending' && (
                      <Clock className="w-4 h-4 ml-auto text-yellow-400" />
                    )}
                    {salesStatus === 'denied' && (
                      <XCircle className="w-4 h-4 ml-auto text-red-400" />
                    )}
                  </button>
                  {/* Sub-sub: Upsell invoice for Royal Talens (below project) */}
                  {(() => {
                    try {
                      const hasUpsell = (projects || []).some(p => (p.client === 'Royal Talens') && (p.salesSubItems || []).some(si => si.title === 'Upsell invoice'));
                      if (!hasUpsell) return null;
                    } catch (_) { return null; }
                    return (
                      <div className="ml-6 mt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveTab('sales-royal-talens'); }}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-xs ${activeTab === 'sales-royal-talens' ? 'bg-blue-500/10 text-blue-300' : 'text-white/60 hover:text-white/80 hover:bg-white/5'}`}
                        >
                          <ArrowUp className="w-3 h-3 mr-2" /> Upsell invoice
                        </button>
                      </div>
                    );
                  })()}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('sales-royal-talens');
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                      ${activeTab === 'sales-royal-talens'
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Royal Talens
                    {royalTalensStatus === 'approved' && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                    )}
                    {royalTalensStatus === 'pending' && (
                      <Clock className="w-4 h-4 ml-auto text-yellow-400" />
                    )}
                    {royalTalensStatus === 'denied' && (
                      <XCircle className="w-4 h-4 ml-auto text-red-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('sales-dremababy');
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                      ${activeTab === 'sales-dremababy'
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <Baby className="w-4 h-4 mr-2" />
                    Dreambaby
                    {dreambabyStatus === 'approved' && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                    )}
                    {dreambabyStatus === 'pending' && (
                      <Clock className="w-4 h-4 ml-auto text-yellow-400" />
                    )}
                    {dreambabyStatus === 'denied' && (
                      <XCircle className="w-4 h-4 ml-auto text-red-400" />
                    )}
                  </button>
                  {/* Sub-sub: Upsell invoice for Dreambaby */}
                  {(() => {
                    try {
                      const hasUpsell = (projects || []).some(p => (p.client === 'Dreambaby') && (p.salesSubItems || []).some(si => si.title === 'Upsell invoice'));
                      if (!hasUpsell) return null;
                    } catch (_) { return null; }
                    return (
                      <div className="ml-6 mt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveTab('sales-dremababy'); }}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-left text-xs ${activeTab === 'sales-dremababy' ? 'bg-blue-500/10 text-blue-300' : 'text-white/60 hover:text-white/80 hover:bg-white/5'}`}
                        >
                          <ArrowUp className="w-3 h-3 mr-2" /> Upsell invoice
                        </button>
                      </div>
                    );
                  })()}
                  
                  {/* Custom Sales Clients */}
                  {customClients.map((client) => {
                    const clientStatus = localStorage.getItem(`${client.tabId}-approval-status`) || 'default';
                    const ClientIcon = iconComponents[client.icon] || User;
                    return (
                      <button
                        key={client.tabId}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(client.tabId);
                        }}
                        className={`
                          w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                          ${activeTab === client.tabId
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                          }
                        `}
                      >
                        <ClientIcon className="w-4 h-4 mr-2" />
                        {client.name}
                        {clientStatus === 'approved' && (
                          <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                        )}
                        {clientStatus === 'pending' && (
                          <Clock className="w-4 h-4 ml-auto text-yellow-400" />
                        )}
                        {clientStatus === 'denied' && (
                          <XCircle className="w-4 h-4 ml-auto text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Branding Subtabs */}
              {item.id === 'branding' && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('branding-meteor');
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                      ${activeTab === 'branding-meteor'
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="w-5 h-5 mr-2 flex items-center justify-center rounded bg-slate-900/80">
                      <img 
                        src="/branding.png" 
                        alt="Meteor logo"
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                      <Brush className="w-4 h-4 hidden" />
                    </div>
                    Meteor Branding
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('branding-templates');
                    }}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                      ${activeTab === 'branding-templates'
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="w-5 h-5 mr-2 flex items-center justify-center rounded bg-slate-900/80">
                      <img 
                        src="/branding.png" 
                        alt="Templates logo"
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                      <FileText className="w-4 h-4 hidden" />
                    </div>
                    Templates
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.canva.com', '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full flex items-center px-3 py-2 rounded-lg text-left text-sm text-white/60 hover:text-white/80 hover:bg-white/5"
                  >
                    <div className="w-5 h-5 mr-2 flex items-center justify-center rounded bg-white">
                      <img 
                        src="/Canva.png" 
                        alt="Canva logo"
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                      <FileImage className="w-4 h-4 hidden" />
                    </div>
                    Canva
                    <svg className="w-3 h-3 ml-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.figma.com', '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full flex items-center px-3 py-2 rounded-lg text-left text-sm text-white/60 hover:text-white/80 hover:bg-white/5"
                  >
                    <div className="w-5 h-5 mr-2 flex items-center justify-center rounded bg-white">
                      <img 
                        src="/Figma.png" 
                        alt="Figma logo"
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'block';
                        }}
                      />
                      <Layers className="w-4 h-4 hidden" />
                    </div>
                    Figma
                    <svg className="w-3 h-3 ml-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Project Subtabs */}
              {item.id === 'projecten' && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  {projects.map((project) => {
                    // Get project icon based on project name or icon property
                    const getProjectIcon = () => {
                      // If project has custom icon property, use it
                      if (project.icon) {
                        const key = String(project.icon).toLowerCase();
                        const iconMap = {
                          'palette': Palette,
                          'baby': Baby,
                          'store': Store,
                          'briefcase': Briefcase,
                          'rocket': Rocket,
                          'folder': Folder,
                          'user': User,
                          'building': Building,
                          'star': Star,
                          'heart': Heart,
                          'globe': Globe,
                          'shield': Shield,
                          'zap': Zap,
                        };
                        return iconMap[key] || Folder;
                      }
                      
                      // Default icons based on project name and client
                      const name = (project.name || '').toLowerCase();
                      const client = (project.client || '').toLowerCase();
                      const combined = name + ' ' + client;
                      
                      console.log('Project:', project.name, 'Combined:', combined);
                      
                      // More specific matching
                      if (combined.includes('royal talens') || combined.includes('talens') || name.includes('royal talens b2b')) {
                        console.log('  -> Palette icon');
                        return Palette;
                      }
                      if (combined.includes('dreambaby') || combined.includes('dream baby') || name.includes('dreambaby')) {
                        console.log('  -> Baby icon');
                        return Baby;
                      }
                      if (combined.includes('meteor merch') || combined.includes('merch store') || name.includes('meteor')) {
                        console.log('  -> Store icon');
                        return Store;
                      }
                      console.log('  -> Folder icon (default)');
                      return Folder;
                    };
                    
                    const ProjectIcon = getProjectIcon();
                    
                    return (
                      <button
                        key={project.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('projecten');
                          // Trigger project selection via custom event
                          window.dispatchEvent(new CustomEvent('selectProject', { 
                            detail: { projectId: project.id } 
                          }));
                        }}
                        className={`
                          w-full flex items-center px-3 py-2 rounded-lg text-left text-sm
                          text-white/60 hover:text-white/80 hover:bg-white/5
                        `}
                      >
                        <ProjectIcon className="w-4 h-4 mr-2" />
                        <span className="flex-1 font-medium">{project.name}</span>
                        {project.status === 'active' && (
                          <CheckCircle className="w-4 h-4 ml-auto text-green-400" />
                        )}
                        {project.status === 'pending' && (
                          <Clock className="w-4 h-4 ml-auto text-yellow-400" />
                        )}
                        {project.status === 'completed' && (
                          <XCircle className="w-4 h-4 ml-auto text-blue-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="border-t border-white/10 my-6"></div>

      {/* Other Section */}
      <div>
        <h3 className="text-white/60 text-sm font-medium mb-4 px-4">Andere</h3>
        <div className="space-y-2">
          {otherItems.map((item, index) => {
            const Icon = typeof item.icon === 'function' ? item.icon : HelpCircle;
            const isActive = activeTab === item.id;
            
            // Check if item is disabled in dev mode
            const isDisabled = isDevMode && disabledItems.includes(item.id);

            // In dev mode, completely hide disabled items from the sidebar
            if (isDisabled) {
              return null;
            }
            
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
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
