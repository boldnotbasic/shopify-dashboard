import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, LayoutGrid, Download, Star, ExternalLink, Plus, X, Edit, Trash2, Upload, Save, Info, Cloud, CloudOff } from 'lucide-react';
import dataStorage from '../utils/dataStorage';
import githubSync from '../utils/githubSync';
import GitHubSyncSetup from './GitHubSyncSetup';

const AppsPage = () => {
  const defaultApps = [
    // Wishlist Apps
    {
      id: 1,
      name: 'Wishlist Plus',
      description: 'Advanced wishlist functionality',
      category: 'Wishlist',
      contact: 'support@swymcorp.com',
      usedOn: ['Checkpoint'],
      appLink: 'https://apps.shopify.com/wishlist-plus',
      image: ''
    },
    {
      id: 2,
      name: 'SWishlist',
      description: 'Simple wishlist solution',
      category: 'Wishlist',
      contact: 'help@solucommerce.com',
      usedOn: ['Yest'],
      appLink: 'https://apps.shopify.com/swishlist',
      image: ''
    },
    // Store Locator Apps
    {
      id: 3,
      name: 'Closeby',
      description: 'Store locator solution',
      category: 'Store locator',
      contact: 'team@closeby.co',
      usedOn: ['Curtres'],
      appLink: 'https://apps.shopify.com/closeby',
      image: ''
    },
    {
      id: 4,
      name: 'Stockist',
      description: 'Store locator and stockist finder',
      category: 'Store locator',
      contact: 'help@stockist.co',
      usedOn: ['Yest'],
      appLink: 'https://apps.shopify.com/stockist',
      image: ''
    },
    // Shipping Apps
    {
      id: 5,
      name: 'Sendcloud',
      description: 'Shipping and fulfillment solution',
      category: 'Shipping',
      contact: 'support@sendcloud.com',
      usedOn: ['Curtres', 'Bronn'],
      appLink: 'https://apps.shopify.com/sendcloud',
      image: ''
    },
    // Filter/Search Apps
    {
      id: 6,
      name: 'Shopify Search & Discovery',
      description: 'Native Shopify search and filtering',
      category: 'Filter/recommend/search',
      contact: 'Shopify',
      usedOn: ['RT B2B', 'Bronn', 'Novy'],
      appLink: 'https://apps.shopify.com/search-discovery',
      image: ''
    },
    {
      id: 7,
      name: 'Smart Product Filter & Search',
      description: 'Advanced product filtering',
      category: 'Filter/recommend/search',
      contact: 'contact@globosoftware.net',
      usedOn: [],
      appLink: 'https://apps.shopify.com/smart-product-filter',
      image: ''
    },
    // Product Options Apps
    {
      id: 8,
      name: 'Globo Product Options, Variant',
      description: 'Extra product options and variants',
      category: 'Extra product options',
      contact: 'contact@globosoftware.net',
      usedOn: ['Curium'],
      appLink: 'https://apps.shopify.com/globo-product-options',
      image: ''
    },
    // Menu Apps
    {
      id: 9,
      name: 'Globo Mega Menu, Navigation',
      description: 'Advanced mega menu solution',
      category: 'Megamenu',
      contact: 'hi@globosoftware.net',
      usedOn: [],
      appLink: 'https://apps.shopify.com/globo-mega-menu',
      image: ''
    },
    {
      id: 10,
      name: 'Qikify Mega Menu & Navigation',
      description: 'Mega menu and navigation',
      category: 'Megamenu',
      contact: 'hi@globosoftware.net',
      usedOn: ['Valentino', 'Adephar'],
      appLink: 'https://apps.shopify.com/qikify-mega-menu',
      image: ''
    },
    // Customer Account Apps
    {
      id: 11,
      name: 'Customerhub',
      description: 'Customer account management',
      category: 'Customer account',
      contact: 'support@customerhubapp.com',
      usedOn: [],
      appLink: 'https://apps.shopify.com/customerhub',
      image: ''
    },
    // Email Marketing Apps
    {
      id: 12,
      name: 'Klaviyo',
      description: 'Email marketing and automation',
      category: 'Emailmarketing',
      contact: 'support@klaviyo.com',
      usedOn: [],
      appLink: 'https://apps.shopify.com/klaviyo-email-marketing',
      image: ''
    },
    {
      id: 13,
      name: 'Shopify Email',
      description: 'Native Shopify email marketing',
      category: 'Emailmarketing',
      contact: 'Shopify',
      usedOn: ['Curium'],
      appLink: 'https://apps.shopify.com/shopify-email',
      image: ''
    },
    // More Apps from screenshots
    {
      id: 14,
      name: 'Instand brand page',
      description: 'Brand page creation tool',
      category: 'Merkenpagina',
      contact: 'support@lowfruitsolutions.com',
      usedOn: ['Curtres'],
      appLink: 'https://apps.shopify.com/instand-brand-page',
      image: ''
    },
    {
      id: 15,
      name: 'XO Gallery',
      description: 'Shop the look gallery',
      category: 'Shop the look',
      contact: 'hi@xotiny.com',
      usedOn: ['Covarte'],
      appLink: 'https://apps.shopify.com/xo-gallery',
      image: ''
    },
    {
      id: 16,
      name: 'Fast Bundle | Product Bundles',
      description: 'Product bundling solution',
      category: 'Bundles',
      contact: 'support@fastbundle.co',
      usedOn: [],
      appLink: 'https://apps.shopify.com/fast-bundle',
      image: ''
    },
    {
      id: 17,
      name: 'Rebolt Bundle Upsell Discount',
      description: 'Bundle upsell and discount',
      category: 'Bundles',
      contact: 'support@webcontrive.com',
      usedOn: [],
      appLink: 'https://apps.shopify.com/rebolt-bundle',
      image: ''
    },
    {
      id: 18,
      name: 'Delivery date manager',
      description: 'Delivery date management',
      category: 'Datepicker',
      contact: 'support@appjetty.com',
      usedOn: ['Curium'],
      appLink: 'https://apps.shopify.com/delivery-date-manager',
      image: ''
    },
    {
      id: 19,
      name: 'Translate & adapt',
      description: 'Translation and localization',
      category: 'Translations',
      contact: 'Shopify',
      usedOn: ['Novy', 'Adephar', 'Yest'],
      appLink: 'https://apps.shopify.com/translate-and-adapt',
      image: ''
    },
    {
      id: 20,
      name: 'T-lab',
      description: 'All-language translate',
      category: 'Translations',
      contact: 'support@sherpas.design',
      usedOn: ['Bronn'],
      appLink: 'https://apps.shopify.com/t-lab',
      image: ''
    },
    {
      id: 21,
      name: 'Judge.me',
      description: 'Product reviews app',
      category: 'Reviews',
      contact: 'support@judge.me',
      usedOn: ['Bronn'],
      appLink: 'https://apps.shopify.com/judgeme',
      image: ''
    },
    {
      id: 22,
      name: 'Shopify subscriptions',
      description: 'Native subscription management',
      category: 'Subscriptions',
      contact: 'Shopify',
      usedOn: ['Bronn'],
      appLink: 'https://apps.shopify.com/shopify-subscriptions',
      image: ''
    },
    {
      id: 23,
      name: 'Loop Subscriptions App',
      description: 'Advanced subscription management',
      category: 'Subscriptions',
      contact: 'contact@loopwork.co',
      usedOn: ['Bronn'],
      appLink: 'https://apps.shopify.com/loop-subscriptions',
      image: ''
    },
    {
      id: 24,
      name: 'Shopify Flow',
      description: 'Automation workflows',
      category: 'Automations',
      contact: 'Shopify',
      usedOn: ['Curium', 'Bronn'],
      appLink: 'https://apps.shopify.com/shopify-flow',
      image: ''
    },
    {
      id: 25,
      name: 'Shopify Forms',
      description: 'Form builder',
      category: 'Forms',
      contact: 'Shopify',
      usedOn: ['Bronn'],
      appLink: 'https://apps.shopify.com/shopify-forms',
      image: ''
    }
  ];

  const [apps, setApps] = useState(() => {
    return dataStorage.getItem('shopify-dashboard-apps', defaultApps);
  });

  const [syncStatus, setSyncStatus] = useState(null);
  const [showSyncSetup, setShowSyncSetup] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [showStorageInfo, setShowStorageInfo] = useState(false);
  const [storageStats, setStorageStats] = useState(null);
  const fileInputRef = useRef(null);
  // Filters
  const [appSearch, setAppSearch] = useState('');
  const [appCategory, setAppCategory] = useState('');
  const [appStore, setAppStore] = useState('');
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    category: '',
    rating: 5.0,
    price: '',
    image: '',
    appLink: '',
    status: 'Available'
  });

  // Save apps to enhanced storage whenever apps change
  useEffect(() => {
    console.log('Saving apps to storage', apps);
    dataStorage.setItem('shopify-dashboard-apps', apps);
    
    // Auto-sync to GitHub if configured
    if (githubSync.isConfigured()) {
      syncToGitHub();
    }
  }, [apps]);

  // Load from GitHub on component mount
  useEffect(() => {
    if (githubSync.isConfigured()) {
      loadFromGitHub();
    }
  }, []);

  const syncToGitHub = async () => {
    if (!githubSync.isConfigured()) return;
    
    try {
      const themes = dataStorage.getItem('shopify-dashboard-themes', []);
      const result = await githubSync.syncToCloud(themes, apps);
      
      if (result.success) {
        setSyncStatus({ type: 'success', message: 'Gesynchroniseerd met GitHub' });
        setLastSyncTime(new Date().toLocaleString());
        setTimeout(() => setSyncStatus(null), 3000);
      } else {
        setSyncStatus({ type: 'error', message: `Sync failed: ${result.error}` });
      }
    } catch (error) {
      setSyncStatus({ type: 'error', message: error.message });
    }
  };

  const loadFromGitHub = async () => {
    if (!githubSync.isConfigured()) return;
    
    try {
      const result = await githubSync.loadFromCloud();
      
      if (result.success && result.apps.length > 0) {
        setApps(result.apps);
        dataStorage.setItem('shopify-dashboard-apps', result.apps);
        setSyncStatus({ type: 'success', message: 'Geladen van GitHub' });
        setTimeout(() => setSyncStatus(null), 3000);
      }
    } catch (error) {
      setSyncStatus({ type: 'error', message: error.message });
    }
  };

  const addApp = () => {
    if (newApp.name && newApp.description) {
      const app = {
        ...newApp,
        id: Date.now(), // Use timestamp for unique ID
        installs: 0,
        rating: parseFloat(newApp.rating)
      };
      setApps([...apps, app]);
      resetForm();
    }
  };

  const updateApp = () => {
    console.log('updateApp called', { newApp, editingApp });
    if (newApp.name && newApp.description) {
      const updatedApps = apps.map(a => 
        a.id === editingApp.id 
          ? { ...newApp, id: editingApp.id, rating: parseFloat(newApp.rating) }
          : a
      );
      console.log('Updating apps', updatedApps);
      setApps(updatedApps);
      resetForm();
    } else {
      console.log('Validation failed', { name: newApp.name, description: newApp.description });
    }
  };

  const startEdit = (app) => {
    setEditingApp(app);
    setNewApp(app);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewApp({
      name: '',
      description: '',
      category: '',
      rating: 5.0,
      price: '',
      image: '',
      appLink: '',
      status: 'Available'
    });
    setShowAddForm(false);
    setEditingApp(null);
  };

  const confirmDelete = (app) => {
    setAppToDelete(app);
    setShowDeleteConfirm(true);
  };

  const deleteApp = () => {
    if (appToDelete) {
      setApps(apps.filter(a => a.id !== appToDelete.id));
      setShowDeleteConfirm(false);
      setAppToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAppToDelete(null);
  };

  // Restore official list (seed)
  const applyOfficialSeed = () => {
    if (window.confirm('Wil je de officiële lijst van apps herstellen? Dit vervangt je huidige lijst.')) {
      setApps(defaultApps);
      dataStorage.setItem('shopify-dashboard-apps', defaultApps);
      alert('Officiële lijst is ingesteld en opgeslagen.');
    }
  };

  // Data management functions
  const handleExport = () => {
    const success = dataStorage.exportToFile('shopify-dashboard-apps', 'shopify-apps-backup.json');
    if (success) {
      alert('Apps data geëxporteerd! Het bestand is gedownload.');
    } else {
      alert('Er is een fout opgetreden bij het exporteren.');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    dataStorage.importFromFile('shopify-dashboard-apps', file)
      .then((result) => {
        setApps(result.data);
        alert(`Import succesvol! ${result.recordCount} apps geïmporteerd.`);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((error) => {
        alert(`Import mislukt: ${error.message}`);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  const showStorageStats = () => {
    const stats = dataStorage.getStorageStats('shopify-dashboard-apps');
    setStorageStats(stats);
    setShowStorageInfo(true);
  };

  const getStatusColor = (status) => {
    return status === 'Installed' ? 'bg-green-500' : 'bg-blue-500';
  };

  // Filtered list
  const filteredAppsFlat = apps.filter(a => {
    if (appCategory && a.category !== appCategory) return false;
    if (appStore && (!a.usedOn || !a.usedOn.includes(appStore))) return false;
    const q = appSearch.trim().toLowerCase();
    if (q) {
      const hay = `${a.name} ${a.description} ${a.category} ${a.contact}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Unique options
  const appCategories = Array.from(new Set(apps.map(a => a.category).filter(Boolean)));
  const appStores = Array.from(new Set(apps.flatMap(a => Array.isArray(a.usedOn) ? a.usedOn : []).filter(Boolean)));

  // Group apps by category (after filtering)
  const groupedApps = filteredAppsFlat.reduce((groups, app) => {
    const category = app.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(app);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Apps</h1>
          <p className="text-white/60">Beheer en organiseer Shopify apps</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* GitHub Sync Status */}
          {githubSync.isConfigured() ? (
            <div className="flex items-center gap-2 text-sm">
              <Cloud className="w-4 h-4 text-green-400" />
              <span className="text-white/70">
                {lastSyncTime ? `Laatste sync: ${lastSyncTime}` : 'GitHub sync actief'}
              </span>
              <button
                onClick={() => setShowSyncSetup(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Beheren
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSyncSetup(true)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              <CloudOff className="w-4 h-4" />
              GitHub Sync Setup
            </button>
          )}
          <input
            type="text"
            value={appSearch}
            onChange={(e)=>setAppSearch(e.target.value)}
            placeholder="Zoeken..."
            className="hidden md:block bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <select
            value={appCategory}
            onChange={(e)=>setAppCategory(e.target.value)}
            className="hidden md:block bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="bg-gray-800">Alle categorieën</option>
            {appCategories.map(c => (
              <option key={c} value={c} className="bg-gray-800">{c}</option>
            ))}
          </select>
          <select
            value={appStore}
            onChange={(e)=>setAppStore(e.target.value)}
            className="hidden md:block bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="bg-gray-800">Alle stores</option>
            {appStores.map(s => (
              <option key={s} value={s} className="bg-gray-800">{s}</option>
            ))}
          </select>
          <button 
            onClick={() => window.open('https://apps.shopify.com', '_blank')}
            className="glass-effect px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
          >
            <span className="hidden">open</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3h7v7m0-7L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>App Store</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nieuwe App</span>
          </button>
        </div>
      </div>

      <div className="gradient-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-white/80 text-sm font-medium">For testing</div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={applyOfficialSeed}
              className="glass-effect px-4 py-3 rounded-lg text-white font-medium hover:bg-white/20 transition-all"
              title="Herstel officiële lijst"
            >
              Herstel lijst
            </button>
            <button 
              onClick={showStorageStats}
              className="glass-effect px-4 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
              title="Storage informatie"
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={handleExport}
              className="glass-effect px-4 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
              title="Exporteer apps data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="glass-effect px-4 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
              title="Importeer apps data"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add App Form */}
      {showAddForm && (
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">
              {editingApp ? 'App Bewerken' : 'Nieuwe App Toevoegen'}
            </h2>
            <button 
              onClick={resetForm}
              className="text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">Naam</label>
              <input
                type="text"
                value={newApp.name}
                onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="App naam"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Categorie</label>
              <input
                type="text"
                value={newApp.category}
                onChange={(e) => setNewApp({...newApp, category: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="Marketing, Analytics, etc."
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Prijs</label>
              <input
                type="text"
                value={newApp.price}
                onChange={(e) => setNewApp({...newApp, price: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="€29/maand of Gratis"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={newApp.rating}
                onChange={(e) => setNewApp({...newApp, rating: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Status</label>
              <select
                value={newApp.status}
                onChange={(e) => setNewApp({...newApp, status: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="Available" className="bg-gray-800">Available</option>
                <option value="Installed" className="bg-gray-800">Installed</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Afbeelding URL</label>
              <input
                type="url"
                value={newApp.image}
                onChange={(e) => setNewApp({...newApp, image: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="https://example.com/icon.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Beschrijving</label>
              <textarea
                value={newApp.description}
                onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 h-24"
                placeholder="Beschrijving van de app..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">App Link</label>
              <input
                type="url"
                value={newApp.appLink}
                onChange={(e) => setNewApp({...newApp, appLink: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="https://example.com/app"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={editingApp ? updateApp : addApp}
              className="btn-primary px-6 py-2 rounded-lg text-white font-medium"
            >
              {editingApp ? 'App Bijwerken' : 'App Toevoegen'}
            </button>
            <button 
              onClick={resetForm}
              className="glass-effect px-6 py-2 rounded-lg text-white font-medium"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">App Verwijderen</h2>
              <button 
                onClick={cancelDelete}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Ben je zeker dat je de app <span className="text-white font-semibold">"{appToDelete?.name}"</span> wil verwijderen?
              </p>
              <p className="text-red-300 text-sm">
                Deze actie kan niet ongedaan gemaakt worden.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={deleteApp}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-white font-medium flex-1 transition-colors"
              >
                Ja, Verwijderen
              </button>
              <button 
                onClick={cancelDelete}
                className="glass-effect px-6 py-2 rounded-lg text-white font-medium flex-1"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apps by Category */}
      {Object.keys(groupedApps).length === 0 ? (
        <div className="gradient-card rounded-xl p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <LayoutGrid className="w-12 h-12 text-white/60" />
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-2">Geen Apps Gevonden</h3>
              <p className="text-white/70 mb-6 max-w-md">
                Er zijn nog geen Shopify apps toegevoegd aan je dashboard. Voeg je eerste app toe om te beginnen met het beheren van je app integraties.
              </p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Eerste App Toevoegen</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        Object.entries(groupedApps).map(([category, categoryApps]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-2">
            {category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryApps.map((app) => {
              console.log('Rendering app:', app.name, 'Image:', app.image);
              return (
              <div key={app.id} className="gradient-card rounded-xl p-4 hover:scale-105 transition-transform relative">
                <div className="absolute top-3 right-3 flex space-x-1">
                  <button 
                    onClick={() => startEdit(app)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => confirmDelete(app)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-blue-500 flex items-center justify-center">
                    {app.image && app.image.trim() !== '' ? (
                      <img 
                        src={app.image} 
                        alt={app.name}
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('Image loaded successfully:', app.image)}
                        onError={(e) => {
                          console.log('Image failed to load:', app.image);
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="m9 9 6 6m0-6-6 6"/></svg>';
                        }}
                      />
                    ) : (
                      <LayoutGrid className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate">{app.name}</h3>
                    <p className="text-white/60 text-xs">{app.description}</p>
                  </div>
                </div>
                
                {/* Contact */}
                <div className="mb-2">
                  <p className="text-white/50 text-xs mb-1">Contact:</p>
                  <span className="text-blue-400 text-xs">{app.contact}</span>
                </div>
                
                {/* Used on */}
                {app.usedOn && app.usedOn.length > 0 && (
                  <div className="mb-3">
                    <p className="text-white/50 text-xs mb-1">Gebruikt op:</p>
                    <div className="flex flex-wrap gap-1">
                      {app.usedOn.map((site, index) => (
                        <span key={index} className="text-white/60 text-xs bg-blue-500/20 px-2 py-1 rounded">
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* App Link */}
                <button 
                  onClick={() => window.open(app.appLink, '_blank')}
                  className="btn-secondary w-full py-2 rounded-lg text-white text-xs font-medium flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>App Link</span>
                </button>
              </div>
              );
            })}
          </div>
        </div>
        ))
      )}

      {/* Storage Info Modal */}
      {showStorageInfo && storageStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Storage Informatie</h2>
              <button 
                onClick={() => setShowStorageInfo(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Apps opgeslagen:</span>
                <span className="text-white font-semibold">{storageStats.recordCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Backup bestanden:</span>
                <span className="text-white font-semibold">{storageStats.backupCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Laatste backup:</span>
                <span className="text-white font-semibold">
                  {storageStats.lastBackup 
                    ? new Date(storageStats.lastBackup).toLocaleString('nl-NL')
                    : 'Geen backup'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Storage grootte:</span>
                <span className="text-white font-semibold">
                  {(storageStats.storageSize / 1024).toFixed(1)} KB
                </span>
              </div>
              
              <div className="border-t border-white/20 pt-4 mt-6">
                <p className="text-white/60 text-sm mb-4">
                  Je apps data wordt automatisch gebackupt elke keer als je wijzigingen maakt. 
                  Gebruik de export/import knoppen om handmatige backups te maken.
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setShowStorageInfo(false);
                      handleExport();
                    }}
                    className="btn-primary px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exporteer Nu</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowStorageInfo(false);
                      fileInputRef.current?.click();
                    }}
                    className="glass-effect px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 flex-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Importeer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sync Status Toast */}
      {syncStatus && (
        <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
          syncStatus.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {syncStatus.message}
        </div>
      )}
      
      {/* GitHub Sync Setup Modal */}
      {showSyncSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <GitHubSyncSetup 
              onSetupComplete={() => {
                setShowSyncSetup(false);
                loadFromGitHub();
              }}
            />
            <button
              onClick={() => setShowSyncSetup(false)}
              className="mt-4 w-full text-white/60 hover:text-white text-center"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppsPage;
