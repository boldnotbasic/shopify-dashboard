import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download, Trash2, X, Ticket, Lock, Unlock, CheckCircle, Clock, XCircle, FolderPlus, Send } from 'lucide-react';

const RoyalTalensSalesPage = () => {
  const topicColors = {
    'Setup': 'bg-blue-500/20 text-blue-300',
    'Integration': 'bg-green-500/20 text-green-300',
    'Development': 'bg-purple-500/20 text-purple-300',
    'Payment': 'bg-yellow-500/20 text-yellow-300',
    'Localization': 'bg-pink-500/20 text-pink-300',
    'Custom Development': 'bg-red-500/20 text-red-300',
    'B2B Features': 'bg-indigo-500/20 text-indigo-300',
    'Marketing': 'bg-orange-500/20 text-orange-300',
    'Backend': 'bg-gray-500/20 text-gray-300',
    'AI/ML': 'bg-cyan-500/20 text-cyan-300',
    'Mobile': 'bg-emerald-500/20 text-emerald-300',
    'APP': 'bg-teal-500/20 text-teal-300',
  };
  const defaultTasks = [
    { id: 1, task: 'Theme Setup & Configuration', hours: 8, description: 'Initial Shopify theme setup and basic configuration', topic: 'Setup', isDefault: true },
    { id: 2, task: 'Product Catalog Integration', hours: 12, description: 'Import and organize Royal Talens product catalog', topic: 'Integration', isDefault: true },
    { id: 3, task: 'Custom B2B Features', hours: 16, description: 'Implement B2B specific features for Royal Talens', topic: 'Development', isDefault: true },
    { id: 4, task: 'Payment Gateway Setup', hours: 6, description: 'Configure payment methods for B2B customers', topic: 'Payment', isDefault: true },
    { id: 5, task: 'Multi-language Support', hours: 10, description: 'Setup Dutch and English language support', topic: 'Localization', isDefault: true },
  ];

  const defaultExtras = [
    { id: 1, task: 'Advanced Color Matching Tool', topic: 'Custom Development', hours: 20, description: 'Interactive color matching for art supplies', checked: true },
    { id: 2, task: 'Bulk Order Calculator', topic: 'B2B Features', hours: 15, description: 'Volume pricing calculator for wholesale orders', checked: true },
    { id: 3, task: 'Artist Portfolio Integration', topic: 'Marketing', hours: 12, description: 'Showcase customer artwork using Royal Talens products', checked: false },
    { id: 4, task: 'Inventory Management Dashboard', topic: 'Backend', hours: 18, description: 'Real-time inventory tracking for distributors', checked: true },
    { id: 5, task: 'Product Recommendation Engine', topic: 'AI/ML', hours: 25, description: 'AI-powered product suggestions based on art projects', checked: false },
    { id: 6, task: 'Mobile App Integration', topic: 'Mobile', hours: 30, description: 'Connect with Royal Talens mobile color picker app', checked: true },
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('royal-talens-sales-tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [extras, setExtras] = useState(() => {
    const saved = localStorage.getItem('royal-talens-sales-extras');
    return saved ? JSON.parse(saved) : defaultExtras;
  });

  const [defaultRate, setDefaultRate] = useState(() => {
    const saved = localStorage.getItem('royal-talens-default-rate');
    return saved ? parseInt(saved) : 125;
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraItem, setJiraItem] = useState(null);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Project offer tickets (for synced state)
  const [projectTickets, setProjectTickets] = useState(() => {
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const me = projects.find(p => p.client === 'Royal Talens' && p.name === 'Royal Talens B2B Platform');
      return me?.offerTickets || [];
    } catch (e) { return []; }
  });

  // Send to client function
  const sendToClient = () => {
    setSuccessMessage('Royal Talens offerte is verstuurd naar de klant!');
    setShowSuccessModal(true);
  };
  const [approvalStatus, setApprovalStatus] = useState(() => {
    const savedStatus = localStorage.getItem('royal-talens-sales-approval-status');
    return savedStatus ? savedStatus : 'default';
  });

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('royal-talens-sales-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save extras to localStorage whenever extras change
  useEffect(() => {
    localStorage.setItem('royal-talens-sales-extras', JSON.stringify(extras));
  }, [extras]);

  // Save default rate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('royal-talens-default-rate', defaultRate.toString());
  }, [defaultRate]);

  // Listen for tickets updates
  useEffect(() => {
    const handler = () => {
      try {
        const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
        const me = projects.find(p => p.client === 'Royal Talens' && p.name === 'Royal Talens B2B Platform');
        setProjectTickets(me?.offerTickets || []);
      } catch (e) {}
    };
    window.addEventListener('localStorageUpdate', handler);
    // initial refresh
    handler();
    return () => window.removeEventListener('localStorageUpdate', handler);
  }, []);

  const isSynced = (label) => {
    return (projectTickets || []).some(t => (t.label || '') === (label || ''));
  };

  const goToProjectDetail = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const me = projects.find(p => p.client === 'Royal Talens' && p.name === 'Royal Talens B2B Platform');
      if (me?.id) {
        window.dispatchEvent(new CustomEvent('selectProject', { detail: { projectId: me.id } }));
      }
    } catch (e) {}
  };

  // Save approval status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('royal-talens-sales-approval-status', approvalStatus);
    // Also save old approved format for backward compatibility
    localStorage.setItem('royal-talens-sales-approved', JSON.stringify(approvalStatus === 'approved'));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('localStorageUpdate'));
  }, [approvalStatus]);

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const updateExtra = (id, field, value) => {
    setExtras(extras.map(extra => 
      extra.id === id ? { ...extra, [field]: value } : extra
    ));
  };

  const addNewRow = () => {
    const newId = Math.max(...extras.map(e => e.id)) + 1;
    const newExtra = {
      id: newId,
      task: '',
      topic: '',
      hours: 0,
      description: '',
      checked: false
    };
    setExtras([...extras, newExtra]);
  };

  const confirmDelete = (item, type) => {
    setItemToDelete({ ...item, type });
    setShowDeleteConfirm(true);
  };

  const deleteItem = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'extra') {
        setExtras(extras.filter(e => e.id !== itemToDelete.id));
      }
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const openJiraModal = (item, type) => {
    setJiraItem({ ...item, type });
    setShowJiraModal(true);
  };

  const createJiraTicket = () => {
    if (jiraItem) {
      setSuccessMessage(
        `Jira ticket aangemaakt voor Royal Talens:\n` +
        `Taak: ${jiraItem.task}\n` +
        `Type: ${jiraItem.type}\n` +
        `Uren: ${jiraItem.hours}h`
      );
      // Persist to project's offerTickets so it shows in ProjectDetailPage
      try {
        const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
        const updated = projects.map(p => {
          if (p.client === 'Royal Talens' && p.name === 'Royal Talens B2B Platform') {
            // Generate key like MSYRT-281 using a per-project counter
            const seqKey = `ticket-seq-${p.id || 'royal-talens'}`;
            const current = parseInt(localStorage.getItem(seqKey) || '280');
            const next = isNaN(current) ? 1 : current + 1;
            localStorage.setItem(seqKey, String(next));
            const key = `MSYRT-${next}`;

            const ticket = {
              label: jiraItem.task || '',
              key,
              url: '',
              type: (jiraItem.type === 'extra') ? 'Extra' : 'Basic'
            };
            return { ...p, offerTickets: [ ...(p.offerTickets || []), ticket ] };
          }
          return p;
        });
        localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
        window.dispatchEvent(new Event('localStorageUpdate'));
      } catch (e) {}
      setShowSuccessModal(true);
      setShowJiraModal(false);
      setJiraItem(null);
    }
  };

  const cancelJira = () => {
    setShowJiraModal(false);
    setJiraItem(null);
  };

  // Check if project already exists
  const projectExists = () => {
    const existingProjects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
    return existingProjects.some(project => project.client === 'Royal Talens' && project.name === 'Royal Talens B2B Platform');
  };

  // Convert to project function
  const convertToProject = () => {
    if (projectExists()) {
      return; // Don't create if already exists
    }
    
    // Calculate total from tasks
    const calculatedTotal = tasks.reduce((sum, task) => sum + (task.hours * defaultRate), 0);
    
    const projectData = {
      id: Date.now(),
      name: 'Royal Talens B2B Platform',
      client: 'Royal Talens',
      status: 'Planning',
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      team: ['Gijs'],
      logo: '',
      icon: 'Palette',
      iconColor: 'from-orange-500 to-red-600',
      tmsCode: `RT-${String(Date.now()).slice(-3)}`,
      description: 'Professionele kunstbenodigdheden B2B platform met color matching en bulk calculator',
      budget: `€${calculatedTotal.toLocaleString()}`,
      seoScore: 75
    };

    // Get existing projects
    const existingProjects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
    
    // Add new project
    existingProjects.push(projectData);
    localStorage.setItem('shopify-dashboard-projects', JSON.stringify(existingProjects));
    
    // Show success message
    setSuccessMessage(`Project "${projectData.name}" is aangemaakt in de projecten lijst!`);
    setShowSuccessModal(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Type', 'Taak', 'Onderwerp', 'Uren', 'Tarief', 'Totaal', 'Beschrijving'],
      ...tasks.map(task => [
        'Standaard',
        task.task,
        task.topic || 'Standaard',
        task.hours,
        `€${defaultRate}`,
        `€${task.hours * defaultRate}`,
        task.description
      ]),
      ...extras.filter(extra => extra.checked).map(extra => [
        'Extra',
        extra.task,
        extra.topic,
        extra.hours,
        `€${defaultRate}`,
        `€${extra.hours * defaultRate}`,
        extra.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `royal-talens-calculator-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0) + 
                    extras.filter(extra => extra.checked).reduce((sum, extra) => sum + extra.hours, 0);

  const totalAmount = totalHours * defaultRate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Royal Talens B2B - Sales Calculator</h1>
          <p className="text-white/70">Professional art supplies B2B platform development</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`gradient-card px-6 py-4 rounded-xl ${
          approvalStatus === 'approved' ? 'ring-2 ring-green-400' : 
          approvalStatus === 'pending' ? 'ring-2 ring-yellow-400' : 
          approvalStatus === 'denied' ? 'ring-2 ring-red-400' : ''
        }`}>
          <div className="flex items-center space-x-3">
            {approvalStatus === 'approved' && <CheckCircle className="w-5 h-5 text-green-400" />}
            {approvalStatus === 'pending' && <Clock className="w-5 h-5 text-yellow-400" />}
            {approvalStatus === 'denied' && <XCircle className="w-5 h-5 text-red-400" />}
            <div className="flex-1">
              <select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              >
                <option value="default" className="bg-gray-800 text-white">Default</option>
                <option value="pending" className="bg-gray-800 text-white">Pending</option>
                <option value="approved" className="bg-gray-800 text-white">Approved</option>
                <option value="denied" className="bg-gray-800 text-white">Denied</option>
              </select>
            </div>
          </div>
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <span className="text-white/70 text-base">Totaal uren: </span>
          <span className="text-white font-bold text-2xl">{totalHours}h</span>
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <span className="text-white/70 text-base">Standaard tarief: €</span>
          <input
            type="number"
            value={defaultRate}
            onChange={(e) => setDefaultRate(parseInt(e.target.value) || 125)}
            disabled={approvalStatus === 'approved'}
            className={`bg-transparent text-white font-bold text-2xl border-none outline-none w-20 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <span className="text-white/70 text-base">Totaal bedrag: </span>
          <span className="text-white font-bold text-2xl">€{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Send to Client Button moved to action row below */}

      {/* Default Tasks Table */}
      <div className="gradient-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-white text-xl font-semibold">Default Taken</h2>
            {approvalStatus === 'approved' && <Lock className="w-5 h-5 text-yellow-400" title="Vergrendeld - Approved" />}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/80 font-medium">Taak</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Topic</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Uren</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Totaal</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Beschrijving</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Jira</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) => updateTask(item.id, 'task', e.target.value)}
                      className={`bg-transparent text-white border-none outline-none w-full ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={item.isDefault || approvalStatus === 'approved'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${topicColors[item.topic] || topicColors['Setup'] || 'bg-white/10 text-white'} ${approvalStatus === 'approved' ? 'opacity-50' : ''}`}>
                      <select
                        value={item.topic}
                        onChange={(e) => updateTask(item.id, 'topic', e.target.value)}
                        disabled={approvalStatus === 'approved'}
                        className={`bg-transparent border-none outline-none text-current w-full ${approvalStatus === 'approved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {Object.keys(topicColors).map(key => (
                          <option key={key} value={key} className="bg-gray-800 text-white">{key}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.hours}
                      onChange={(e) => updateTask(item.id, 'hours', parseInt(e.target.value) || 0)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-white/10 text-white border border-white/20 rounded px-2 py-1 w-16 text-center ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="py-3 px-4 text-white font-medium">€{(item.hours * defaultRate).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateTask(item.id, 'description', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Beschrijving..."
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => { isSynced(item.task) ? goToProjectDetail() : openJiraModal(item, 'default'); }}
                      className="transition-colors"
                      title={isSynced(item.task) ? 'Ticket gesynct' : 'Jira ticket aanmaken'}
                    >
                      {isSynced(item.task) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Ticket className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extras Table */}
      <div className="gradient-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-white text-xl font-semibold">Extra's</h2>
            {approvalStatus === 'approved' && <Lock className="w-5 h-5 text-yellow-400" title="Vergrendeld - Approved" />}
          </div>
          <button 
            onClick={addNewRow}
            disabled={approvalStatus === 'approved'}
            className={`btn-primary px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>Nieuwe Rij</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/70 py-3 px-4">Selectie</th>
                <th className="text-left text-white/70 py-3 px-4">Taak</th>
                <th className="text-left text-white/70 py-3 px-4">Topic</th>
                <th className="text-left text-white/70 py-3 px-4">Uren</th>
                <th className="text-left text-white/70 py-3 px-4">Bedrag</th>
                <th className="text-left text-white/70 py-3 px-4">Beschrijving</th>
                <th className="text-left text-white/70 py-3 px-4">Jira</th>
                <th className="text-left text-white/70 py-3 px-4">Actie</th>
              </tr>
            </thead>
            <tbody>
              {extras.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => updateExtra(item.id, 'checked', e.target.checked)}
                      disabled={approvalStatus === 'approved'}
                      className={`h-4 w-4 rounded bg-white/20 border-white/30 text-blue-500 focus:ring-blue-400 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) => updateExtra(item.id, 'task', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Taak naam..."
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${topicColors[item.topic] || 'bg-white/10 text-white'} ${approvalStatus === 'approved' ? 'opacity-50' : ''}`}>
                      <select
                        value={item.topic}
                        onChange={(e) => updateExtra(item.id, 'topic', e.target.value)}
                        disabled={approvalStatus === 'approved'}
                        className={`bg-transparent border-none outline-none text-current w-full ${approvalStatus === 'approved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {Object.keys(topicColors).map(key => (
                          <option key={key} value={key} className="bg-gray-800 text-white">{key}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.hours}
                      onChange={(e) => updateExtra(item.id, 'hours', parseInt(e.target.value) || 0)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-white/10 text-white border border-white/20 rounded px-2 py-1 w-16 text-center ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="py-3 px-4 text-white">€{(item.hours * defaultRate).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateExtra(item.id, 'description', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="Beschrijving..."
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => { isSynced(item.task) ? goToProjectDetail() : openJiraModal(item, 'extra'); }}
                      className="transition-colors"
                      title={isSynced(item.task) ? 'Ticket gesynct' : 'Jira ticket aanmaken'}
                    >
                      {isSynced(item.task) ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Ticket className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => confirmDelete(item, 'extra')}
                      disabled={approvalStatus === 'approved'}
                      className={`text-red-400 hover:text-red-300 transition-colors ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <button 
          onClick={convertToProject}
          disabled={projectExists()}
          className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
            projectExists() 
              ? 'bg-white/10 text-white/40 cursor-not-allowed' 
              : 'glass-effect text-white hover:bg-white/20'
          }`}
          title={projectExists() ? 'Project bestaat al' : 'Zet om naar project'}
        >
          <FolderPlus className="w-5 h-5" />
          <span>{projectExists() ? 'Project bestaat al' : 'Zet om naar Project'}</span>
        </button>
        <button 
          onClick={sendToClient}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          title="Verstuur offerte naar klant"
        >
          <Send className="w-5 h-5" />
          <span>Verstuur naar klant</span>
        </button>
        <button 
          onClick={exportToCSV}
          className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Item Verwijderen</h2>
              <button 
                onClick={cancelDelete}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Ben je zeker dat je dit item wil verwijderen?
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-medium">{itemToDelete?.task}</p>
                <p className="text-white/60 text-sm">{itemToDelete?.description}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={deleteItem}
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

      {/* Jira Modal */}
      {showJiraModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Jira Ticket Aanmaken</h2>
              <button 
                onClick={cancelJira}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Wil je een Jira ticket aanmaken voor dit item?
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-medium">{jiraItem?.task}</p>
                <p className="text-white/60 text-sm mb-2">{jiraItem?.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-white/60">Type: <span className="text-white">{jiraItem?.type}</span></span>
                  <span className="text-white/60">Uren: <span className="text-white">{jiraItem?.hours}h</span></span>
                  <span className="text-white/60">Project: <span className="text-white">Royal Talens</span></span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={createJiraTicket}
                className="btn-primary px-6 py-2 rounded-lg text-white font-medium flex-1"
              >
                Ticket Aanmaken
              </button>
              <button 
                onClick={cancelJira}
                className="glass-effect px-6 py-2 rounded-lg text-white font-medium flex-1"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[400px] max-w-[90vw]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">Gelukt!</h2>
              <p className="text-white/70 mb-6 whitespace-pre-line">{successMessage}</p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="btn-primary px-6 py-3 rounded-lg text-white font-medium w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoyalTalensSalesPage;
