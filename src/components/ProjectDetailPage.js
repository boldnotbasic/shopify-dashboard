import React, { useState, useEffect } from 'react';
import { db } from '../utils/supabaseClient';
import { 
  ArrowLeft, 
  ArrowUp,
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Activity,
  ExternalLink,
  Palette,
  Baby,
  Store,
  Briefcase,
  Rocket,
  User as UserIcon,
  Building,
  Globe,
  Star,
  Heart,
  Shield,
  Ticket
} from 'lucide-react';

const ProjectDetailPage = ({ projectId, setActiveTab, setSelectedProject }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [seoScanRunning, setSeoScanRunning] = useState(false);
  const [seoScanProgress, setSeoScanProgress] = useState(0);
  const [seoResult, setSeoResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ label: '', key: '', url: '', type: 'Basic' });
  const [appsCatalog, setAppsCatalog] = useState([]);
  const [themesCatalog, setThemesCatalog] = useState([]);
  const [appToAddId, setAppToAddId] = useState('');
  const [themeToAddId, setThemeToAddId] = useState('');

  useEffect(() => {
    const boot = async () => {
      let projects = [];
      try {
        projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      } catch (_) {}
      let foundProject = projects.find(p => p.id === parseInt(projectId));
      if (!foundProject) {
        try {
          const rows = await db.projects.getAll();
          const row = rows.find(r => Number(r.id) === parseInt(projectId));
          if (row) {
            const tags = row.tags || [];
            const team = tags.filter(t => String(t).startsWith('team:')).map(t => t.slice(5));
            const tmsTag = tags.find(t => String(t).startsWith('tms:'));
            const tmsCode = tmsTag ? String(tmsTag).slice(4) : '';
            foundProject = {
              id: row.id,
              name: row.name,
              client: row.client,
              status: row.status,
              progress: row.progress,
              deadline: row.deadline || '',
              team,
              logo: row.logo || '',
              icon: row.icon || '',
              iconColor: row.color || '',
              tmsCode,
              description: row.description || '',
              budget: row.budget || '',
              shopDomain: row.url || '',
              seoScore: row.seo_score || 0,
              created_at: row.created_at,
              updated_at: row.updated_at
            };
            try {
              const merged = [...projects.filter(p => p.id !== foundProject.id), foundProject];
              localStorage.setItem('shopify-dashboard-projects', JSON.stringify(merged));
              window.dispatchEvent(new Event('localStorageUpdate'));
            } catch (_) {}
          }
        } catch (_) {}
      }
      if (foundProject && Array.isArray(foundProject.offerTickets)) {
        const missing = foundProject.offerTickets.some(t => !t.key);
        if (missing) {
          const prefixMap = { 'Royal Talens': 'MSYRT', 'Dreambaby': 'MSYDB' };
          const prefix = prefixMap[foundProject.client] || 'MSY';
          const seqKey = `ticket-seq-${foundProject.id || 'global'}`;
          let current = parseInt(localStorage.getItem(seqKey) || '280');
          const nextTickets = foundProject.offerTickets.map(t => {
            if (t.key) return t;
            current = isNaN(current) ? 1 : current + 1;
            const key = `${prefix}-${current}`;
            return { ...t, key };
          });
          const updatedProjects = (projects || []).map(p => p.id === foundProject.id ? { ...p, offerTickets: nextTickets } : p);
          try {
            localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updatedProjects));
            localStorage.setItem(seqKey, String(current));
            window.dispatchEvent(new Event('localStorageUpdate'));
          } catch (_) {}
          const refreshed = updatedProjects.find(p => p.id === foundProject.id) || foundProject;
          setProject(refreshed);
          setLoading(false);
          return;
        }
      }
      setProject(foundProject || null);
      setLoading(false);
      try {
        const apps = JSON.parse(localStorage.getItem('shopify-dashboard-apps') || '[]');
        const themes = JSON.parse(localStorage.getItem('shopify-dashboard-themes') || '[]');
        setAppsCatalog(Array.isArray(apps) ? apps : []);
        setThemesCatalog(Array.isArray(themes) ? themes : []);
      } catch (_) {}
    };
    boot();
  }, [projectId]);

  useEffect(() => {
    const onLs = () => {
      try {
        const apps = JSON.parse(localStorage.getItem('shopify-dashboard-apps') || '[]');
        const themes = JSON.parse(localStorage.getItem('shopify-dashboard-themes') || '[]');
        setAppsCatalog(Array.isArray(apps) ? apps : []);
        setThemesCatalog(Array.isArray(themes) ? themes : []);
        const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
        const me = projects.find(p => p.id === (project?.id));
        if (me) setProject(me);
      } catch(_) {}
    };
    window.addEventListener('localStorageUpdate', onLs);
    return () => window.removeEventListener('localStorageUpdate', onLs);
  }, [project?.id]);

  const openEdit = () => {
    setEditData({
      ...project,
      team: Array.isArray(project.team) ? project.team.join(', ') : (project.team || '')
    });
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditData(null);
  };

  const saveEdit = () => {
    // Persist to localStorage
    const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
    const updated = projects.map(p => p.id === project.id ? {
      ...p,
      ...editData,
      team: typeof editData.team === 'string' ? editData.team.split(',').map(t=>t.trim()).filter(Boolean) : editData.team
    } : p);
    localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
    window.dispatchEvent(new Event('localStorageUpdate'));
    // Update local state
    const newProj = updated.find(p=>p.id===project.id);
    setProject(newProj);
    closeEdit();
  };

  const handleBack = () => {
    setSelectedProject(null);
    setActiveTab('projecten');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug naar Projecten
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Project niet gevonden</h1>
          <p className="text-white/70">Het project dat je zoekt bestaat niet meer.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Activity;
      case 'Planning': return Clock;
      case 'On Hold': return AlertCircle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(project.status);

  const getJiraBaseUrl = () => {
    try {
      return localStorage.getItem('jira-base-url') || 'https://jira.example.com';
    } catch (_) {
      return 'https://jira.example.com';
    }
  };

  // SEO Score Circle Component (same style as tiles)
  const SeoScoreCircle = ({ score }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
    const getColor = (s) => (s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444');
    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="transparent" />
          <circle cx="30" cy="30" r={radius} stroke={getColor(score)} strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{Math.round(score)}</span>
        </div>
      </div>
    );
  };

  const runSeoScan = async () => {
    if (!project?.shopDomain) {
      alert('Geen Shopify omgeving ingesteld voor dit project.');
      return;
    }
    if (seoScanRunning) return;
    setSeoScanRunning(true);
    setSeoScanProgress(0);
    setSeoResult(null);

    // Progress animation
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(95, pct + Math.random() * 12);
      setSeoScanProgress(pct);
    }, 300);

    const endpoint = (() => { try { return localStorage.getItem('seo-scan-endpoint') || ''; } catch { return ''; } })();
    const clean = String(project.shopDomain).replace(/^https?:\/\//, '');
    const targetUrl = `https://${clean}/`;

    let finalScore = project.seoScore || 70;
    let topics = [];
    let reachable = false;

    if (endpoint) {
      try {
        const controller = new AbortController();
        const to = setTimeout(() => controller.abort(), 12000);
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
          signal: controller.signal
        });
        clearTimeout(to);
        if (!resp.ok) throw new Error(`Endpoint ${resp.status}`);
        const data = await resp.json();
        // data: { h1Count, hasMetaDescription, totalImages, imagesWithoutAlt }
        const h1Ok = Number(data.h1Count) === 1;
        const metaOk = !!data.hasMetaDescription;
        const altOk = Number(data.imagesWithoutAlt) === 0;

        topics = [
          { key: 'H1', score: h1Ok ? 100 : 0 },
          { key: 'Meta Description', score: metaOk ? 100 : 0 },
          { key: 'Image Alts', score: altOk ? 100 : Math.max(0, 100 - (Number(data.imagesWithoutAlt) || 0) * 10) },
        ];
        const adjustments = (h1Ok ? 10 : -15) + (metaOk ? 10 : -10) + (altOk ? 10 : -10);
        finalScore = Math.max(0, Math.min(100, Math.round((project.seoScore || 70) + adjustments)));
        reachable = true;
      } catch (e) {
        // Fall back to basic reachability if endpoint fails
        try {
          await Promise.race([
            fetch(`${targetUrl}?t=${Date.now()}`, { mode: 'no-cors' }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
          ]);
          reachable = true;
        } catch (_) {
          reachable = false;
        }
        const base = project.seoScore || 70;
        finalScore = Math.max(20, Math.min(100, Math.round(base + (reachable ? 5 : -10))))
        topics = [
          { key: 'Reachability', score: reachable ? 100 : 0 },
          { key: 'H1', score: 50 },
          { key: 'Meta Description', score: 50 },
          { key: 'Image Alts', score: 50 },
        ];
      }
    } else {
      // No endpoint configured, keep old lightweight ping behavior
      try {
        await Promise.race([
          fetch(`${targetUrl}?t=${Date.now()}`, { mode: 'no-cors' }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
        ]);
        reachable = true;
      } catch (_) {
        reachable = false;
      }
      const base = project.seoScore || 70;
      finalScore = Math.max(20, Math.min(100, Math.round(base + (reachable ? 5 : -10))))
      topics = [
        { key: 'Reachability', score: reachable ? 100 : 0 },
        { key: 'H1', score: 50 },
        { key: 'Meta Description', score: 50 },
        { key: 'Image Alts', score: 50 },
      ];
    }

    clearInterval(timer);
    setSeoScanProgress(100);
    const checkedAt = new Date().toISOString();
    setSeoResult({ reachable, finalScore, topics, checkedAt });

    // Persist new SEO score to localStorage so tiles update
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => p.id === project.id ? { ...p, seoScore: finalScore } : p);
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      // Update local state
      const newProj = updated.find(p=>p.id===project.id);
      setProject(newProj);
    } catch (_) {}
    setSeoScanRunning(false);
  };

  const milestones = [
    { id: 1, title: 'Project Setup', completed: true, date: '2024-01-01' },
    { id: 2, title: 'Design Phase', completed: true, date: '2024-01-15' },
    { id: 3, title: 'Development', completed: project.progress > 50, date: '2024-02-01' },
    { id: 4, title: 'Testing', completed: project.progress > 80, date: '2024-02-15' },
    { id: 5, title: 'Launch', completed: project.status === 'Completed', date: project.deadline }
  ];

  const handleMakeOffer = () => {
    try {
      const items = project.upsellInvoice || [];
      if (!items.length) {
        setSuccessMessage('Geen upsell items geselecteerd voor offerte.');
        setShowSuccessModal(true);
        return;
      }
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => {
        if (p.id !== project.id) return p;
        const salesSubItems = Array.isArray(p.salesSubItems) ? p.salesSubItems.slice() : [];
        salesSubItems.push({
          id: Date.now(),
          type: 'upsell',
          title: 'Upsell invoice',
          items,
          createdAt: new Date().toISOString()
        });
        return { ...p, salesSubItems };
      });
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
      setSuccessMessage(`Upsell invoice aangemaakt voor ${me.name}. (${items.length} items)`);
      setShowSuccessModal(true);
    } catch (e) {}
  };

  const addAppToProject = (id) => {
    if (!project || !id) return;
    try {
      const app = (appsCatalog || []).find(a => String(a.id) === String(id));
      if (!app) return;
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => {
        if (p.id !== project.id) return p;
        const current = Array.isArray(p.apps) ? p.apps : [];
        if (current.some(a => String(a.id) === String(app.id))) return p;
        return { ...p, apps: [...current, { id: app.id, name: app.name, appLink: app.appLink || '', category: app.category || '' }] };
      });
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(_) {}
  };

  const removeAppFromProject = (id) => {
    if (!project) return;
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => p.id === project.id ? { ...p, apps: (p.apps || []).filter(a => String(a.id) !== String(id)) } : p);
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(_) {}
  };

  const addThemeToProject = (id) => {
    if (!project || !id) return;
    try {
      const theme = (themesCatalog || []).find(t => String(t.id) === String(id));
      if (!theme) return;
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => {
        if (p.id !== project.id) return p;
        const current = Array.isArray(p.themes) ? p.themes : [];
        if (current.some(t => String(t.id) === String(theme.id))) return p;
        return { ...p, themes: [...current, { id: theme.id, name: theme.name, previewLink: theme.previewLink || '', category: theme.category || '' }] };
      });
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(_) {}
  };

  const removeThemeFromProject = (id) => {
    if (!project) return;
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => p.id === project.id ? { ...p, themes: (p.themes || []).filter(t => String(t.id) !== String(id)) } : p);
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(_) {}
  };

  const addUpsellToInvoice = (item) => {
    try {
      if ((project.upsellInvoice || []).some((x) => x.title === item.title)) return;
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => p.id === project.id ? { ...p, upsellInvoice: [ ...(p.upsellInvoice || []), item ] } : p);
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(e) {}
  };

  const removeUpsellFromInvoice = (index) => {
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const updated = projects.map(p => p.id === project.id ? { ...p, upsellInvoice: (p.upsellInvoice || []).filter((_, i) => i !== index) } : p);
      localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('localStorageUpdate'));
      const me = updated.find(p => p.id === project.id);
      setProject(me);
    } catch(e) {}
  };

  const handleSendInvoice = () => {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug naar Projecten
        </button>
        
        <div className="flex space-x-2">
          <button onClick={openEdit} className="text-white/60 hover:text-white transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button className="text-red-400 hover:text-red-300 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Project Header */}
      <div className="gradient-card rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden mr-6 bg-gradient-blue-purple flex items-center justify-center">
              {project.logo ? (
                <img 
                  src={project.logo} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {project.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              {project.shopDomain ? (
                (() => {
                  const cleanDomain = String(project.shopDomain).replace(/^https?:\/\//, '');
                  const href = `https://${cleanDomain}/admin`;
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 text-lg hover:text-white underline decoration-dotted"
                      title={href}
                    >
                      Store admin
                    </a>
                  );
                })()
              ) : (
                <p className="text-white/70 text-lg">{project.client}</p>
              )}
              {project.tmsCode && (
                <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm mt-2">
                  {project.tmsCode}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white ${getStatusColor(project.status)}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {project.status}
            </div>
          </div>
        </div>

        <p className="text-white/80 text-lg mb-6">{project.description}</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Voortgang</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-blue-purple h-3 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Deadline</p>
              <p className="text-white text-lg font-semibold">{project.deadline}</p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Team</p>
              <p className="text-white text-lg font-semibold">
                {Array.isArray(project.team) ? project.team.length : project.team.split(',').length} leden
              </p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Budget</p>
              <p className="text-white text-lg font-semibold">{project.budget || 'Niet ingesteld'}</p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-400 mr-4" />
            <div>
              <p className="text-white/70 text-sm">Status</p>
              <p className="text-white text-lg font-semibold">{project.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Widget */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2" /> SEO Overzicht
            </h3>
            <button
              onClick={runSeoScan}
              disabled={seoScanRunning}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${seoScanRunning ? 'bg-white/20 cursor-not-allowed' : 'btn-primary'}`}
            >
              {seoScanRunning ? 'Bezig met scan…' : 'Doe SEO scan'}
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <SeoScoreCircle score={seoResult?.finalScore ?? project.seoScore ?? 70} />
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-1">Totale score</p>
              {seoScanRunning ? (
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-blue-purple h-2 rounded-full transition-all" style={{ width: `${seoScanProgress}%` }} />
                </div>
              ) : (
                <p className="text-white text-lg font-semibold">{seoResult?.finalScore ?? project.seoScore ?? 70}</p>
              )}
              <p className="text-white/50 text-xs mt-1">
                {seoScanRunning ? 'SEO scan wordt uitgevoerd op je Shopify omgeving…' : seoResult?.checkedAt ? `Laatste scan: ${new Date(seoResult.checkedAt).toLocaleString()}` : 'Nog geen scan uitgevoerd'}
              </p>
            </div>
          </div>

          {/* Topic breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {(seoResult?.topics || [
              { key: 'Performance', score: (project.seoScore ?? 70) - 10 },
              { key: 'Accessibility', score: (project.seoScore ?? 70) - 5 },
              { key: 'Best Practices', score: (project.seoScore ?? 70) },
              { key: 'SEO', score: (project.seoScore ?? 70) - 3 },
            ]).map((t) => (
              <div key={t.key} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">{t.key}</span>
                  <span className="text-white text-sm font-semibold">{Math.max(0, Math.min(100, Math.round(t.score)))}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-blue-purple h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, t.score))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Leden
          </h3>
          <div className="space-y-3">
            {(Array.isArray(project.team) ? project.team : project.team.split(',')).map((member, index) => (
              <div key={index} className="flex items-center p-3 bg-white/5 rounded-lg">
                <div className="w-10 h-10 bg-gradient-blue-purple rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {member.trim().substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{member.trim()}</p>
                  <p className="text-white/60 text-sm">Developer</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Milestones */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Milestones
          </h3>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${milestone.completed ? 'bg-green-400' : 'bg-white/20'}`}>
                  {milestone.completed && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${milestone.completed ? 'text-white' : 'text-white/60'}`}>
                    {milestone.title}
                  </p>
                  <p className="text-white/50 text-sm">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jira tickets in offerte (read-only) */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-white text-xl font-semibold flex items-center">
              <Ticket className="w-5 h-5 mr-2" /> Jira tickets
            </h3>
          </div>

          {(!project.offerTickets || project.offerTickets.length === 0) ? (
            <div className="text-center py-8 text-white/60 text-sm">Nog geen tickets toegevoegd aan de offerte.</div>
          ) : (
            <div className="space-y-2">
              {project.offerTickets.map((t, idx) => (
                <div key={`${t.key || t.label}-${idx}`} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center rounded bg-blue-500/30 text-white text-xs font-bold h-6 px-2">
                      {(t.key && t.key.toUpperCase()) || (t.label || '').slice(0,3).toUpperCase()}
                    </span>
                    <span className="text-white text-sm font-medium">{t.label || '—'}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${((t.type||'Basic')==='Extra') ? 'bg-purple-500/30 text-purple-200' : 'bg-green-500/30 text-green-200'}`}>
                      {(t.type || 'Basic')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {((t && t.url) || (t && t.key)) && (
                      <button
                        onClick={() => {
                          const base = getJiraBaseUrl();
                          const target = t.url || `${base.replace(/\/$/, '')}/browse/${encodeURIComponent((t.key || '').toUpperCase())}`;
                          window.open(target, '_blank');
                        }}
                        className="text-white/70 hover:text-white"
                        title="Open ticket"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        try {
                          const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
                          const updated = projects.map(p => p.id === project.id ? { ...p, offerTickets: (p.offerTickets || []).filter((_, i) => i !== idx) } : p);
                          localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
                          window.dispatchEvent(new Event('localStorageUpdate'));
                          const me = updated.find(p => p.id === project.id);
                          setProject(me);
                        } catch(e) {}
                      }}
                      className="text-white/60 hover:text-white"
                      title="Verwijderen"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upsell topics (left column, follows milestones) */}

        {/* Upsell topics (left column, follows milestones) */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-4">
            <h3 className="text-white text-xl font-semibold flex items-center">
              <ArrowUp className="w-5 h-5 mr-2" /> Upsell topics
            </h3>
          </div>
          <div className="space-y-2">
            {[
              { title: 'SEA/Google Pakket', desc: 'Google merchant center, Performance rapporting, Google Ads, Google Analytics, A/B testing', daysAfterLive: 30 },
              { title: 'SEO Pakket', desc: 'Alt text images, Collection description, Redirects, Sitemaps, Google search insights, Meta-descriptions, Dinamic records', daysAfterLive: 14 },
              { title: 'Blogs', desc: 'SEO Blogs copyrighten, Keyword search, Related products section, Tags', daysAfterLive: 21 },
              { title: 'Newsletters', desc: 'Klaviyo flows, Segmenten, Newsletter templating, A/B testing, Loyalty Program', daysAfterLive: 45 },
              { title: 'Automations', desc: 'Shopify flows, MRN, Rules', daysAfterLive: 60 },
              { title: 'Socials', desc: 'Canva templates Socials, Social media campagnes', daysAfterLive: 7 },
              { title: 'Graphic design', desc: 'Banners/slides, Flyers, Logo/huisstijlgids', daysAfterLive: 0 },
              { title: 'Custom webdesign', desc: 'Custom sections, UX/UX audit, Components design', daysAfterLive: 90 },
              { title: 'Custom Apps', desc: 'DEV', daysAfterLive: 120 },
              { title: 'Audit improvements', desc: 'Onderzoek naar geschiedenis, Wat werkt er niet, Hoe kan de shop nog verbeteren/converteren?, Zijn er "frustraties"?, Data optimalisatie', daysAfterLive: 180 },
              { title: 'Reviews', desc: 'Judge.me, Beoordeel alles op PDP/PLP, Store Reviews stars op Homepage', daysAfterLive: 14 },
              { title: 'Loyalty', desc: 'Smile.io, Rewarding system, Discounts opzetten', daysAfterLive: 60 },
              { title: 'Internationale groei', desc: 'Uitbreiden qua markten, Translations, Markets/Duties features', daysAfterLive: 365 },
              { title: 'Subscriptions', desc: 'Maandelijkse bestellingen', daysAfterLive: 90 },
              { title: 'Shipping/Billing', desc: 'Sendcloud, Sufio', daysAfterLive: 7 },
            ].map((it, i) => {
              const goLiveDate = project.goLiveDate ? new Date(project.goLiveDate) : null;
              const today = new Date();
              const daysUntilRecommend = goLiveDate ? 
                Math.max(0, it.daysAfterLive - Math.floor((today - goLiveDate) / (1000 * 60 * 60 * 24))) : 
                it.daysAfterLive;
              const canRecommend = goLiveDate && daysUntilRecommend === 0;
              
              return (
              <div key={`${it.title}-${i}`} className={`flex items-center justify-between rounded-lg px-3 py-2 ${canRecommend ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                <div className="flex items-center space-x-3">
                  {canRecommend ? (
                    <span className="inline-flex items-center rounded bg-green-500/30 text-green-300 text-xs font-bold h-6 px-2">
                      READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded bg-orange-500/30 text-orange-300 text-xs font-bold h-6 px-2">
                      {daysUntilRecommend}d
                    </span>
                  )}
                  <div>
                    <div className="text-white text-sm font-medium">{it.title}</div>
                    <div className="text-white/60 text-xs">{it.desc}</div>
                    {!goLiveDate && (
                      <div className="text-yellow-400 text-xs mt-1">⚠️ Go-live datum niet ingesteld</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addUpsellToInvoice(it)}
                  disabled={(project.upsellInvoice || []).some(x => x.title === it.title)}
                  className={`text-xs px-3 py-1 rounded text-white ${((project.upsellInvoice || []).some(x => x.title === it.title)) ? 'bg-white/10 opacity-60 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                  title={(project.upsellInvoice || []).some(x => x.title === it.title) ? 'Reeds toegevoegd' : 'Add to invoice'}
                >
                  {((project.upsellInvoice || []).some(x => x.title === it.title)) ? 'Toegevoegd' : 'Add to invoice'}
                </button>
              </div>
            );
            })}
          </div>
        </div>

        {/* Upsell invoice (right column, follows Jira tickets) */}
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center mb-4 justify-between">
            <h3 className="text-white text-xl font-semibold flex items-center">
              <ArrowUp className="w-5 h-5 mr-2" /> Upsell invoice
            </h3>
          </div>
          {(!project.upsellInvoice || project.upsellInvoice.length === 0) ? (
            <div className="text-center py-8 text-white/60 text-sm">Nog geen upsells toegevoegd.</div>
          ) : (
            <div className="space-y-2">
              {(project.upsellInvoice || []).map((it, idx) => (
                <div key={`${it.title}-${idx}`} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center rounded bg-purple-500/30 text-white text-xs font-bold h-6 px-2">UP</span>
                    <div>
                      <div className="text-white text-sm font-medium">{it.title}</div>
                      <div className="text-white/60 text-xs">{it.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeUpsellFromInvoice(idx)}
                    className="text-white/60 hover:text-white"
                    title="Verwijderen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSendInvoice} className="btn-primary px-4 py-2 rounded-lg text-white font-medium">Stuur invoice</button>
            <button onClick={handleMakeOffer} className="btn-secondary px-4 py-2 rounded-lg text-white font-medium">Maak offerte</button>
          </div>
        </div>
      </div>

      {/* Project Apps & Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Apps */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Project Apps</h3>
          <div className="flex items-center gap-2 mb-4">
            <select
              value={appToAddId}
              onChange={(e)=>setAppToAddId(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-gray-800">Selecteer app...</option>
              {(appsCatalog||[]).map(a => (
                <option key={a.id} value={a.id} className="bg-gray-800">{a.name}</option>
              ))}
            </select>
            <button
              onClick={()=>addAppToProject(appToAddId)}
              disabled={!appToAddId}
              className={`btn-primary px-4 py-2 rounded-lg text-white font-medium ${!appToAddId ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Toevoegen
            </button>
          </div>
          {(project?.apps && project.apps.length > 0) ? (
            <div className="space-y-2">
              {project.apps.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="text-white text-sm font-medium">{a.name}</div>
                  <div className="flex items-center gap-2">
                    {a.appLink && (
                      <button onClick={()=>window.open(a.appLink, '_blank')} className="text-white/70 hover:text-white text-xs">open</button>
                    )}
                    <button onClick={()=>removeAppFromProject(a.id)} className="text-white/70 hover:text-white text-xs">remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">Nog geen apps gekoppeld aan dit project.</p>
          )}
        </div>

        {/* Project Themes */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-white text-xl font-semibold mb-4">Project Themes</h3>
          <div className="flex items-center gap-2 mb-4">
            <select
              value={themeToAddId}
              onChange={(e)=>setThemeToAddId(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-gray-800">Selecteer theme...</option>
              {(themesCatalog||[]).map(t => (
                <option key={t.id} value={t.id} className="bg-gray-800">{t.name}</option>
              ))}
            </select>
            <button
              onClick={()=>addThemeToProject(themeToAddId)}
              disabled={!themeToAddId}
              className={`btn-primary px-4 py-2 rounded-lg text-white font-medium ${!themeToAddId ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Toevoegen
            </button>
          </div>
          {(project?.themes && project.themes.length > 0) ? (
            <div className="space-y-2">
              {project.themes.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="flex items-center gap-2">
                    {t.previewLink && (
                      <button onClick={()=>window.open(t.previewLink, '_blank')} className="text-white/70 hover:text-white text-xs">preview</button>
                    )}
                    <button onClick={()=>removeThemeFromProject(t.id)} className="text-white/70 hover:text-white text-xs">remove</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">Nog geen themes gekoppeld aan dit project.</p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="gradient-card rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-lg font-semibold mb-3">Succes</h3>
            <p className="text-white/80 whitespace-pre-line mb-4">{successMessage}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSuccessModal(false)} className="btn-primary px-4 py-2 rounded-lg text-white font-medium">Ok</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="gradient-card rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold">Project Bewerken</h3>
              <button onClick={closeEdit} className="text-white/70 hover:text-white">
                <Trash2 className="hidden" />
                {/* using X from lucide would require new import; reuse simple text */}
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Project Naam</label>
                <input
                  type="text"
                  value={editData?.name || ''}
                  onChange={(e)=>setEditData({...editData, name:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Client</label>
                <input
                  type="text"
                  value={editData?.client || ''}
                  onChange={(e)=>setEditData({...editData, client:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Shopify omgeving</label>
                <input
                  type="text"
                  value={editData?.shopDomain || ''}
                  onChange={(e)=>setEditData({...editData, shopDomain:e.target.value})}
                  onBlur={(e)=>{
                    const v = (e.target.value || '').trim();
                    if (!v) return;
                    const normalized = v.endsWith('.myshopify.com') ? v : `${v.replace(/\.$/, '')}.myshopify.com`;
                    setEditData({...editData, shopDomain: normalized.toLowerCase()});
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="bijv. royal-talens-b2b.myshopify.com"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={editData?.status || 'Planning'}
                  onChange={(e)=>setEditData({...editData, status:e.target.value})}
                  className="w-full input-plain rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
                >
                  <option value="Planning" className="bg-gray-800">Planning</option>
                  <option value="In Progress" className="bg-gray-800">In Progress</option>
                  <option value="Completed" className="bg-gray-800">Completed</option>
                  <option value="On Hold" className="bg-gray-800">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Deadline</label>
                <input
                  type="date"
                  value={editData?.deadline || ''}
                  onChange={(e)=>setEditData({...editData, deadline:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Go-Live Datum</label>
                <input
                  type="date"
                  value={editData?.goLiveDate || ''}
                  onChange={(e)=>setEditData({...editData, goLiveDate:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Logo URL</label>
                <input
                  type="url"
                  value={editData?.logo || ''}
                  onChange={(e)=>setEditData({...editData, logo:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Team (komma-gescheiden)</label>
                <input
                  type="text"
                  value={editData?.team || ''}
                  onChange={(e)=>setEditData({...editData, team:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Beschrijving</label>
                <textarea
                  value={editData?.description || ''}
                  onChange={(e)=>setEditData({...editData, description:e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 h-24"
                />
              </div>
              {/* Icon selector */}
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Icoon</label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    {key:'Palette', Comp:Palette},
                    {key:'Baby', Comp:Baby},
                    {key:'Store', Comp:Store},
                    {key:'Briefcase', Comp:Briefcase},
                    {key:'Rocket', Comp:Rocket},
                    {key:'User', Comp:UserIcon},
                    {key:'Building', Comp:Building},
                    {key:'Star', Comp:Star},
                    {key:'Heart', Comp:Heart},
                    {key:'Globe', Comp:Globe},
                    {key:'Shield', Comp:Shield},
                    {key:'ArrowUp', Comp:ArrowUp},
                  ].map(({key, Comp}) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEditData({...editData, icon: key})}
                      className={`flex items-center justify-center h-10 rounded-lg border ${editData?.icon === key ? 'border-blue-400 bg-white/10' : 'border-white/20 hover:border-white/40'}`}
                      title={key}
                    >
                      <Comp className="w-5 h-5 text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button onClick={saveEdit} className="btn-primary px-6 py-2 rounded-lg text-white font-medium">Opslaan</button>
              <button onClick={closeEdit} className="glass-effect px-6 py-2 rounded-lg text-white font-medium">Annuleren</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
