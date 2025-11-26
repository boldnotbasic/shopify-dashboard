import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Clock, X, Edit, Trash2, Copy, Check, ExternalLink, FileText, Palette, Baby, Store, Globe, BookOpen, Briefcase, Rocket, User, Building, Star, Heart, Shield, Zap } from 'lucide-react';
import { db } from '../utils/supabaseClient';

const ProjectsPage = ({ setSelectedProject, setActiveTab }) => {
  // SEO Score Circle Component
  const SeoScoreCircle = ({ score }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    const getScoreColor = (score) => {
      if (score >= 80) return '#10B981'; // green
      if (score >= 60) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    };

    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
          {/* Background circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{score}</span>
        </div>
      </div>
    );
  };
  const defaultProjects = [
    {
      id: 1,
      name: 'Royal Talens B2B Platform',
      client: 'Royal Talens',
      status: 'In Progress',
      progress: 85,
      deadline: '2024-02-15',
      team: ['Gijs', 'Sarah', 'Mike'],
      logo: '',
      icon: 'Palette',
      iconColor: 'from-orange-500 to-red-600',
      tmsCode: 'RT-001',
      description: 'Professionele kunstbenodigdheden B2B platform met color matching en bulk calculator',
      seoScore: 85,
      budget: '€6,500',
      shopDomain: ''
    },
    {
      id: 2,
      name: 'Dreambaby Platform',
      client: 'Dreambaby',
      status: 'In Progress',
      progress: 70,
      deadline: '2024-03-01',
      team: ['Gijs', 'Anna'],
      logo: '',
      icon: 'Baby',
      iconColor: 'from-pink-500 to-purple-600',
      tmsCode: 'DB-001',
      description: 'Baby verzorging en ontwikkeling platform met growth tracker en sleep monitoring',
      budget: '€6,250',
      seoScore: 70,
      shopDomain: ''
    },
    {
      id: 3,
      name: 'Meteor Merch Store',
      client: 'Meteor',
      status: 'Completed',
      progress: 100,
      deadline: '2023-12-20',
      team: ['Gijs', 'Tom'],
      logo: '',
      icon: 'Store',
      iconColor: 'from-blue-500 to-purple-600',
      tmsCode: 'MM-001',
      description: 'E-commerce store voor Meteor merchandise en branded items',
      budget: '€4,200',
      seoScore: 100,
      shopDomain: ''
    }
  ];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [copiedTmsCode, setCopiedTmsCode] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    status: 'Planning',
    progress: 0,
    deadline: '',
    team: '',
    logo: '',
    icon: '',
    iconColor: '',
    tmsCode: '',
    description: '',
    budget: '',
    shopDomain: ''
  });

  // Helpers to map UI <-> DB
  const toDbProject = (p) => {
    const teamArr = Array.isArray(p.team)
      ? p.team
      : (typeof p.team === 'string' ? p.team.split(',').map(t => t.trim()).filter(Boolean) : []);
    const tags = [
      ...teamArr.map(n => `team:${n}`),
      ...(p.tmsCode ? [`tms:${p.tmsCode}`] : [])
    ];
    const date = (p.deadline || '').toString().slice(0,10) || null;
    return {
      name: p.name || null,
      client: p.client || null,
      status: p.status || 'Planning',
      budget: p.budget || null,
      deadline: date,
      seo_score: p.seoScore !== undefined && p.seoScore !== null ? parseInt(p.seoScore) || 0 : 0,
      description: p.description || null,
      url: p.shopDomain || p.url || null,
      icon: p.icon || null,
      color: p.iconColor || p.color || null,
      team_size: teamArr.length,
      progress: p.progress !== undefined && p.progress !== null ? parseInt(p.progress) || 0 : 0,
      tags
    };
  };

  const fromDbProject = (row) => {
    const tags = row.tags || [];
    const team = tags.filter(t => String(t).startsWith('team:')).map(t => t.slice(5));
    const tmsTag = tags.find(t => String(t).startsWith('tms:'));
    const tmsCode = tmsTag ? String(tmsTag).slice(4) : '';
    return {
      id: row.id,
      name: row.name,
      client: row.client,
      status: row.status,
      progress: row.progress,
      deadline: row.deadline || '',
      team,
      logo: '',
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
  };

  // Load from DB on mount (seed defaults if empty)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await db.projects.getAll();
        if (!rows || rows.length === 0) {
          const payloads = defaultProjects.map(toDbProject);
          const created = await Promise.all(payloads.map(p => db.projects.create(p)));
          setProjects(created.map(fromDbProject));
        } else {
          setProjects(rows.map(fromDbProject));
        }
      } catch (e) {
        console.error('Load projects failed:', e);
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addProject = async () => {
    if (newProject.name && newProject.client && newProject.deadline) {
      try {
        const payload = toDbProject(newProject);
        const created = await db.projects.create(payload);
        setProjects([...projects, fromDbProject(created)]);
        resetForm();
      } catch (e) {
        console.error('Add project failed:', e);
        alert('Fout bij toevoegen project');
      }
    }
  };

  const updateProject = async () => {
    if (newProject.name && newProject.client && newProject.deadline) {
      try {
        const updates = toDbProject(newProject);
        const row = await db.projects.update(editingProject.id, updates);
        const updated = fromDbProject(row);
        const updatedProjects = projects.map(p => p.id === editingProject.id ? updated : p);
        setProjects(updatedProjects);
        resetForm();
      } catch (e) {
        console.error('Update project failed:', e);
        alert('Fout bij bijwerken project');
      }
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setNewProject({
      ...project,
      team: Array.isArray(project.team) ? project.team.join(', ') : project.team
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewProject({
      name: '',
      client: '',
      status: 'Planning',
      progress: 0,
      deadline: '',
      team: '',
      logo: '',
      icon: '',
      iconColor: '',
      tmsCode: '',
      description: '',
      budget: '',
      shopDomain: ''
    });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const deleteProject = async () => {
    if (projectToDelete) {
      try {
        await db.projects.delete(projectToDelete.id);
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        setShowDeleteConfirm(false);
        setProjectToDelete(null);
      } catch (e) {
        console.error('Delete project failed:', e);
        alert('Fout bij verwijderen project');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const copyTmsCode = async (tmsCode, projectId) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(tmsCode);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = tmsCode;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedTmsCode(projectId);
      setTimeout(() => setCopiedTmsCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy TMS code: ', err);
      // Show error message to user
      alert('Kopiëren mislukt. Probeer het opnieuw.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      case 'On Hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projecten</h1>
          <p className="text-white/70">Overzicht van alle actieve projecten</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.open('https://partners.shopify.com/1841109/stores', '_blank')}
            className="glass-effect px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>Partner Portal</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nieuw Project</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Project Form */}
      {showAddForm && (
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">
              {editingProject ? 'Project Bewerken' : 'Nieuw Project Toevoegen'}
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
              <label className="block text-white/70 text-sm mb-2">Project Naam</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="Project naam"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Client</label>
              <input
                type="text"
                value={newProject.client}
                onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="Client naam"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Shopify omgeving</label>
              <input
                type="text"
                value={newProject.shopDomain}
                onChange={(e) => setNewProject({...newProject, shopDomain: e.target.value})}
                onBlur={(e) => {
                  const v = (e.target.value || '').trim();
                  if (!v) return;
                  const normalized = v.endsWith('.myshopify.com') ? v : `${v.replace(/\.$/, '')}.myshopify.com`;
                  setNewProject({...newProject, shopDomain: normalized.toLowerCase()});
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="bijv. royal-talens-b2b.myshopify.com"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">TMS Code</label>
              <input
                type="text"
                value={newProject.tmsCode}
                onChange={(e) => setNewProject({...newProject, tmsCode: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="TMS-001"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Budget</label>
              <input
                type="text"
                value={newProject.budget}
                onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="€15,000"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                className="w-full input-plain rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="Planning" className="bg-gray-800">Planning</option>
                <option value="In Progress" className="bg-gray-800">In Progress</option>
                <option value="Completed" className="bg-gray-800">Completed</option>
                <option value="On Hold" className="bg-gray-800">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProject.progress}
                onChange={(e) => setNewProject({...newProject, progress: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Deadline</label>
              <input
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Logo URL</label>
              <input
                type="url"
                value={newProject.logo}
                onChange={(e) => setNewProject({...newProject, logo: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="https://example.com/logo.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Team (gescheiden door komma's)</label>
              <input
                type="text"
                value={newProject.team}
                onChange={(e) => setNewProject({...newProject, team: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="John, Sarah, Mike"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Beschrijving</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 h-24"
                placeholder="Project beschrijving..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Icoon</label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  {key:'Palette', Comp:Palette},
                  {key:'Baby', Comp:Baby},
                  {key:'Store', Comp:Store},
                  {key:'Briefcase', Comp:Briefcase},
                  {key:'Rocket', Comp:Rocket},
                  {key:'User', Comp:User},
                  {key:'Building', Comp:Building},
                  {key:'Star', Comp:Star},
                  {key:'Heart', Comp:Heart},
                  {key:'Globe', Comp:Globe},
                  {key:'Shield', Comp:Shield},
                  {key:'Zap', Comp:Zap},
                ].map(({key, Comp}) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setNewProject({...newProject, icon: key})}
                    className={`flex items-center justify-center h-10 rounded-lg border ${newProject.icon === key ? 'border-blue-400 bg-white/10' : 'border-white/20 hover:border-white/40'}`}
                    title={key}
                  >
                    <Comp className="w-5 h-5 text-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={editingProject ? updateProject : addProject}
              className="btn-primary px-6 py-2 rounded-lg text-white font-medium"
            >
              {editingProject ? 'Project Bijwerken' : 'Project Toevoegen'}
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
          <div className="gradient-card rounded-xl p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Project Verwijderen</h2>
              <button 
                onClick={cancelDelete}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Ben je zeker dat je het project <span className="text-white font-semibold">"{projectToDelete?.name}"</span> wil verwijderen?
              </p>
              <p className="text-red-300 text-sm">
                Deze actie kan niet ongedaan gemaakt worden.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={deleteProject}
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

      {/* Offertes Section */}
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-300" />
          <span>Gemaakte Offertes</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Royal Talens B2B Offerte */}
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
               onClick={() => setActiveTab && setActiveTab('sales-royal-talens')}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Royal Talens B2B</h3>
                <p className="text-white/60 text-xs">Kunstbenodigdheden platform</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-white/50">Tarief:</span>
                <span className="text-white ml-1">€125/uur</span>
              </div>
              <div>
                <span className="text-white/50">Uren:</span>
                <span className="text-white ml-1">52h</span>
              </div>
              <div>
                <span className="text-white/50">Totaal:</span>
                <span className="text-green-400 ml-1 font-semibold">€6.500</span>
              </div>
              <div>
                <span className="text-white/50">Status:</span>
                <span className="text-blue-300 ml-1">Actief</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Klik om offerte te openen</span>
              <ExternalLink className="w-4 h-4 text-white/40" />
            </div>
          </div>

          {/* Dreambaby Offerte */}
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
               onClick={() => setActiveTab && setActiveTab('sales-dremababy')}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">DB</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Dreambaby</h3>
                <p className="text-white/60 text-xs">Baby verzorging platform</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-white/50">Tarief:</span>
                <span className="text-white ml-1">€125/uur</span>
              </div>
              <div>
                <span className="text-white/50">Uren:</span>
                <span className="text-white ml-1">50h</span>
              </div>
              <div>
                <span className="text-white/50">Totaal:</span>
                <span className="text-green-400 ml-1 font-semibold">€6.250</span>
              </div>
              <div>
                <span className="text-white/50">Status:</span>
                <span className="text-blue-300 ml-1">Actief</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">Klik om offerte te openen</span>
              <ExternalLink className="w-4 h-4 text-white/40" />
            </div>
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="gradient-card rounded-xl p-6 hover:scale-105 transition-transform relative cursor-pointer">
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(project);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(project);
                }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div onClick={() => setSelectedProject(project.id)}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gradient-to-br ${project.iconColor || 'bg-gradient-blue-purple'} flex items-center justify-center`}>
                  {project.logo ? (
                    <img 
                      src={project.logo} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : project.icon ? (
                    (() => {
                      const key = String(project.icon).toLowerCase();
                      const iconMap = {
                        'palette': Palette,
                        'baby': Baby,
                        'store': Store,
                        'briefcase': Briefcase,
                        'rocket': Rocket,
                        'user': User,
                        'building': Building,
                        'star': Star,
                        'heart': Heart,
                        'globe': Globe,
                        'shield': Shield,
                        'zap': Zap,
                      };
                      const IconComponent = iconMap[key];
                      return IconComponent ? (
                        <IconComponent className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {project.name.substring(0, 2).toUpperCase()}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {project.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                  <div className="flex items-center justify-between">
                    {project.shopDomain ? (
                      (() => {
                        const cleanDomain = String(project.shopDomain).replace(/^https?:\/\//, '');
                        const href = `https://${cleanDomain}/admin`;
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/70 text-sm hover:text-white underline decoration-dotted"
                            title={href}
                          >
                            Store admin
                          </a>
                        );
                      })()
                    ) : (
                      <span />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {project.tmsCode && (
                <div className="mb-2 flex items-center space-x-2">
                  <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                    {project.tmsCode}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTmsCode(project.tmsCode, project.id);
                    }}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    title="Kopieer TMS code"
                  >
                    {copiedTmsCode === project.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  {copiedTmsCode === project.id && (
                    <span className="text-green-400 text-xs">Gekopieerd!</span>
                  )}
                </div>
              )}
              
              <p className="text-white/70 text-sm mb-4">{project.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-blue-purple h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center text-white/70 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Deadline: {project.deadline}</span>
                  </div>
                  <div className="flex items-center text-white/70 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Team: {Array.isArray(project.team) ? project.team.join(', ') : project.team}</span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center text-white/70 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Budget: {project.budget}</span>
                    </div>
                  )}
                </div>
                
                {/* SEO Score - right side next to info */}
                {project.seoScore && (
                  <div className="flex flex-col items-center ml-6">
                    <SeoScoreCircle score={project.seoScore} />
                    <span className="text-white/60 text-xs mt-1">SEO</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open Shopify Space - you can customize this URL
                      window.open('https://partners.shopify.com/', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                    title="Open Shopify Space"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Shopify Space</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://confluence.atlassian.com/', '_blank');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm py-2 px-3 rounded-lg transition-colors"
                    title="Open Confluence Space"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Confluence</span>
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
