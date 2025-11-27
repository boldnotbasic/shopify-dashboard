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
import { db } from './utils/supabaseClient';
import './index.css';

const UpsellsPage = () => {
  const [upsells, setUpsells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    bulletsText: '',
    category: 'development',
    duration: '',
    impact: '',
    price: '',
    emoji: '✨',
    color: 'from-pink-500 to-purple-600'
  });

  const gradients = [
    'from-pink-500 to-purple-600',
    'from-orange-500 to-red-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-400',
    'from-indigo-500 to-violet-600'
  ];

  const toDbUpsell = (u) => ({
    title: u.title || null,
    description: u.description || null,
    bullets: Array.isArray(u.bullets) ? u.bullets : (u.bulletsText ? u.bulletsText.split(/\n|,/).map(t => t.trim()).filter(Boolean) : []),
    category: (u.category || 'development'),
    duration: u.duration || null,
    impact: u.impact || null,
    price: u.price || null,
    emoji: u.emoji || '✨',
    color: u.color || 'from-pink-500 to-purple-600'
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await db.upsells.getAll();
        if (!rows || rows.length === 0) {
          const defaults = [
            { title: 'Blogs & Content', description: 'SEO geoptimaliseerde blogs voor betere vindbaarheid', bullets: ['5 SEO Blogs copywriten', 'Keyword search', 'Related products sectie', 'Tags'], category: 'development', duration: '2-4 weken', impact: '+20% organisch verkeer', price: '€500 - €1.500', emoji: '📝', color: 'from-pink-500 to-purple-600' },
            { title: '(AI) Pictures/Text', description: 'Professionele product content met AI ondersteuning', bullets: ['Generatieve AI pictures', 'Generating Text/Content', 'Upscale resolutions', 'Optimize pictures'], category: 'development', duration: '1-2 weken', impact: '+15% conversie', price: '€750 - €2.000', emoji: '🤖', color: 'from-indigo-500 to-violet-600' },
            { title: 'Socials', description: 'Social media aanwezigheid en campagnes', bullets: ['Canva templates Socials', 'Social media campagnes', 'Assistentie opzet socials'], category: 'post-launch', duration: '1-2 weken', impact: '+30% social verkeer', price: '€600 - €1.800', emoji: '📣', color: 'from-blue-500 to-cyan-500' },
            { title: 'Graphic Design', description: 'Professioneel grafisch ontwerp voor je merk', bullets: ['Naamkaartjes', 'Flyers', 'Logo/huisstijlgids'], category: 'post-launch', duration: '1-3 weken', impact: 'Brand awareness +50%', price: '€500 - €2.000', emoji: '🎨', color: 'from-amber-500 to-yellow-400' },
            { title: 'Custom Apps', description: 'Maatwerk Shopify applicaties', bullets: ['Custom functionaliteit', 'API integraties', 'App development'], category: 'post-launch', duration: '4-12 weken', impact: 'Op maat', price: '€3.000 - €15.000', emoji: '🧩', color: 'from-emerald-500 to-teal-500' },
            { title: 'Audit & Improvements', description: 'Grondige analyse en optimalisatie van je shop', bullets: ['Onderzoek naar geschikte Apps', 'Verbeteren/conversie', '“Frustraties” identificeren', 'Data optimalisatie'], category: 'post-launch', duration: '2-4 weken', impact: '+25% conversie', price: '€900 - €2.500', emoji: '🧪', color: 'from-orange-500 to-red-600' },
            { title: 'Subscriptions', description: 'Recurring revenue met subscriptions', bullets: ['Maandelijkse bestellingen', 'Subscription management', 'Customer portal'], category: 'post-launch', duration: '2-3 weken', impact: '+15% recurring revenue', price: '€800 - €2.400', emoji: '🔁', color: 'from-pink-500 to-purple-600' },
            { title: 'Shipping & Billing', description: 'Optimalisatie van verzend- en betaalprocessen', bullets: ['Sendcloud', 'Sufio facture', 'Custom shipping rules'], category: 'post-launch', duration: '2-3 weken', impact: '+20% operations efficiency', price: '€1.000 - €3.000', emoji: '🚚', color: 'from-blue-500 to-cyan-500' }
          ];
          const created = await Promise.all(defaults.map(d => db.upsells.create(toDbUpsell(d))));
          setUpsells(created);
        } else {
          setUpsells(rows);
        }
      } catch (_) {
        setUpsells([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const devItems = upsells.filter(u => String(u.category || '').toLowerCase() === 'development');
  const postItems = upsells.filter(u => String(u.category || '').toLowerCase() !== 'development');

  const getColorClasses = (s) => `bg-gradient-to-br ${s.color || (String(s.category).toLowerCase() === 'development' ? 'from-pink-500 to-purple-600' : 'from-blue-500 to-cyan-500')}`;

  const Section = ({ label, colorClass, items }) => (
    <section className="mt-2">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>{label}</span>
        <span className="text-white/50 text-sm">{items.length} diensten</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((s) => (
          <div key={s.id} className="gradient-card rounded-xl p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${getColorClasses(s)}`}>{s.emoji}</div>
                <div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-white/70 text-sm">{s.description}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70">Details</span>
            </div>
            <ul className="text-white/70 text-sm space-y-1 mb-4 list-disc list-inside">
              {(s.bullets || []).slice(0, 4).map((b, i) => (<li key={i}>{b}</li>))}
            </ul>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="bg-white/10 px-2 py-1 rounded">{s.duration}</span>
              <span className="text-emerald-300">{s.impact}</span>
              <span className="bg-white/10 px-2 py-1 rounded">{s.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Upsells</h1>
          <p className="text-white/70">Aanvullende diensten per fase</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 rounded-lg text-white font-medium">Nieuwe Upsell</button>
      </div>
      {loading ? (
        <div className="text-white/70">Laden...</div>
      ) : (
        <>
          <Section label="Development" colorClass="bg-pink-500/20 text-pink-300" items={devItems} />
          <Section label="Na Go Live" colorClass="bg-blue-500/20 text-blue-300" items={postItems} />
        </>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="gradient-card rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">Nieuwe Upsell</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Titel</label>
                <input value={newItem.title} onChange={(e)=>setNewItem({...newItem, title:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Categorie</label>
                <select value={newItem.category} onChange={(e)=>setNewItem({...newItem, category:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2">
                  <option value="development" className="bg-gray-800">Development</option>
                  <option value="post-launch" className="bg-gray-800">Na Go Live</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-1">Beschrijving</label>
                <input value={newItem.description} onChange={(e)=>setNewItem({...newItem, description:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-1">Bullets (1 per lijn of komma-gescheiden)</label>
                <textarea value={newItem.bulletsText} onChange={(e)=>setNewItem({...newItem, bulletsText:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2 h-24" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Duur</label>
                <input value={newItem.duration} onChange={(e)=>setNewItem({...newItem, duration:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Impact</label>
                <input value={newItem.impact} onChange={(e)=>setNewItem({...newItem, impact:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Prijs</label>
                <input value={newItem.price} onChange={(e)=>setNewItem({...newItem, price:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Emoji</label>
                <input value={newItem.emoji} onChange={(e)=>setNewItem({...newItem, emoji:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Kleur (gradient)</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {gradients.map(g => (
                    <button key={g} type="button" onClick={()=>setNewItem({...newItem, color:g})} className={`h-8 rounded ${newItem.color===g ? 'ring-2 ring-white' : ''} bg-gradient-to-br ${g}`}></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={()=>setShowAdd(false)} className="glass-effect px-4 py-2 rounded-lg text-white">Annuleren</button>
              <button
                onClick={async ()=>{
                  if (!newItem.title) return;
                  try {
                    const row = await db.upsells.create(toDbUpsell(newItem));
                    setUpsells([row, ...upsells]);
                    setShowAdd(false);
                    setNewItem({ title:'', description:'', bulletsText:'', category:'development', duration:'', impact:'', price:'', emoji:'✨', color:'from-pink-500 to-purple-600' });
                  } catch (e) {
                    alert('Toevoegen mislukt');
                  }
                }}
                className="btn-primary px-4 py-2 rounded-lg text-white font-medium"
              >Opslaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
        return <UpsellsPage />;
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
