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

const UpsellsPage = () => {
  const devServices = [
    {
      id: 'blogs',
      title: 'Blogs & Content',
      desc: 'SEO geoptimaliseerde blogs voor betere vindbaarheid',
      bullets: ['5 SEO Blogs copywriten', 'Keyword search', 'Related products sectie', 'Tags'],
      duration: '2-4 weken',
      impact: '+20% organisch verkeer',
      price: '€500 - €1.500',
      emoji: '📝'
    },
    {
      id: 'ai-content',
      title: '(AI) Pictures/Text',
      desc: 'Professionele product content met AI ondersteuning',
      bullets: ['Generatieve AI pictures', 'Generating Text/Content', 'Upscale resolutions', 'Optimize pictures'],
      duration: '1-2 weken',
      impact: '+15% conversie',
      price: '€750 - €2.000',
      emoji: '🤖'
    }
  ];

  const postLaunchServices = [
    { id:'socials', title:'Socials', desc:'Social media aanwezigheid en campagnes', bullets:['Canva templates Socials','Social media campagnes','Assistentie opzet socials'], duration:'1-2 weken', impact:'+30% social verkeer', price:'€600 - €1.800', emoji:'📣' },
    { id:'graphic-design', title:'Graphic Design', desc:'Professioneel grafisch ontwerp voor je merk', bullets:['Naamkaartjes','Flyers','Logo/huisstijlgids'], duration:'1-3 weken', impact:'Brand awareness +50%', price:'€500 - €2.000', emoji:'🎨' },
    { id:'custom-apps', title:'Custom Apps', desc:'Maatwerk Shopify applicaties', bullets:['Custom functionaliteit','API integraties','App development'], duration:'4-12 weken', impact:'Op maat', price:'€3.000 - €15.000', emoji:'🧩' },
    { id:'audit', title:'Audit & Improvements', desc:'Grondige analyse en optimalisatie van je shop', bullets:['Onderzoek naar geschikte Apps','Verbeteren/conversie','“Frustraties” identificeren','Data optimalisatie'], duration:'2-4 weken', impact:'+25% conversie', price:'€900 - €2.500', emoji:'🧪' },
    { id:'subscriptions', title:'Subscriptions', desc:'Recurring revenue met subscriptions', bullets:['Maandelijkse bestellingen','Subscription management','Customer portal'], duration:'2-3 weken', impact:'+15% recurring revenue', price:'€800 - €2.400', emoji:'🔁' },
    { id:'shipping-billing', title:'Shipping & Billing', desc:'Optimalisatie van verzend- en betaalprocessen', bullets:['Sendcloud','Sufio facture','Custom shipping rules'], duration:'2-3 weken', impact:'+20% operations efficiency', price:'€1.000 - €3.000', emoji:'🚚' },
    { id:'newsletters', title:'Newsletters', desc:'E-mailmarketing die converteert', bullets:['Klaviyo flows','Segmenten','Newsletter templating','A/B testing','Loyalty Program'], duration:'1-3 weken', impact:'+18% omzet uit mail', price:'€700 - €2.200', emoji:'✉️' },
    { id:'automations', title:'Automations', desc:'Automatiseer processen', bullets:['Shopify flows','n8n','Make'], duration:'1-2 weken', impact:'Minder handwerk', price:'€600 - €1.800', emoji:'⚙️' },
    { id:'custom-webdesign', title:'Custom webdesign', desc:'Maatwerk UI/UX', bullets:['Design in Figma','UI/UX audit','Components design'], duration:'2-6 weken', impact:'+10% conversie', price:'€1.500 - €6.000', emoji:'🖌️' },
    { id:'reviews', title:'Reviews', desc:'Verzamel en toon reviews', bullets:['Judge.me','Product review stars (PDP/PLP)','Store reviews op Homepage'], duration:'1-2 weken', impact:'+8% CTR', price:'€400 - €1.200', emoji:'⭐' },
    { id:'loyalty', title:'Loyalty', desc:'Bouw loyaliteit en herhaalaankopen', bullets:['Smile.io','Discounts opzetten'], duration:'1-2 weken', impact:'+12% herhaalaankopen', price:'€600 - €1.500', emoji:'🤝' },
    { id:'international', title:'Internationale groei', desc:'Schaal naar nieuwe markten', bullets:['Uitbreiden qua markten','Translations','Market based features'], duration:'3-6 weken', impact:'Nieuwe markten', price:'€2.000 - €8.000', emoji:'🌍' },
    { id:'sea-google', title:'SEA/Google Pakket', desc:'Groei via Google', bullets:['Google Merchant Center','Performance rapportage','Google Ads','Google Analytics','A/B testing'], duration:'2-4 weken', impact:'+25% verkeer', price:'€1.000 - €4.000', emoji:'📈' }
  ];

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
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">{s.emoji}</div>
                <div>
                  <h3 className="text-white font-semibold">{s.title}</h3>
                  <p className="text-white/70 text-sm">{s.desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70">Details</span>
            </div>
            <ul className="text-white/70 text-sm space-y-1 mb-4 list-disc list-inside">
              {s.bullets.slice(0, 4).map((b, i) => (<li key={i}>{b}</li>))}
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upsells</h1>
        <p className="text-white/70">Aanvullende diensten per fase</p>
      </div>
      <Section label="Development" colorClass="bg-pink-500/20 text-pink-300" items={devServices} />
      <Section label="Na Go Live" colorClass="bg-blue-500/20 text-blue-300" items={postLaunchServices} />
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
