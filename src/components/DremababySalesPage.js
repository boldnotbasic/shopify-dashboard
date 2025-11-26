import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download, Trash2, X, Ticket, Lock, Unlock, CheckCircle, Clock, XCircle, FolderPlus, Send } from 'lucide-react';

const DremababySalesPage = () => {
  const topicColors = {
    'Setup': 'bg-blue-500/20 text-blue-300',
    'Products': 'bg-green-500/20 text-green-300',
    'Features': 'bg-purple-500/20 text-purple-300',
    'Accounts': 'bg-yellow-500/20 text-yellow-300',
    'Safety': 'bg-red-500/20 text-red-300',
    'Health & Development': 'bg-pink-500/20 text-pink-300',
    'E-commerce': 'bg-indigo-500/20 text-indigo-300',
    'Medical Integration': 'bg-orange-500/20 text-orange-300',
    'Health Monitoring': 'bg-cyan-500/20 text-cyan-300',
    'Nutrition': 'bg-emerald-500/20 text-emerald-300',
    'Social Features': 'bg-violet-500/20 text-violet-300',
    'APP': 'bg-teal-500/20 text-teal-300',
  };
  const defaultTasks = [
    { id: 1, task: 'E-commerce Platform Setup', hours: 10, description: 'Shopify store setup for baby products', topic: 'Setup', isDefault: true },
    { id: 2, task: 'Product Catalog & Categories', hours: 14, description: 'Organize baby products with age-appropriate categories', topic: 'Products', isDefault: true },
    { id: 3, task: 'Age-Based Product Filtering', hours: 8, description: 'Filter products by baby age ranges', topic: 'Features', isDefault: true },
    { id: 4, task: 'Parent Account System', hours: 12, description: 'User accounts with baby profiles and milestones', topic: 'Accounts', isDefault: true },
    { id: 5, task: 'Safety Compliance Features', hours: 6, description: 'Product safety certifications and age warnings', topic: 'Safety', isDefault: true },
  ];

  const defaultExtras = [
    { id: 1, task: 'Baby Growth Tracker', topic: 'Health & Development', hours: 22, description: 'Track baby growth milestones and suggest products', checked: true },
    { id: 2, task: 'Subscription Box Service', topic: 'E-commerce', hours: 18, description: 'Monthly baby product subscription based on age', checked: false },
    { id: 3, task: 'Pediatrician Recommendations', topic: 'Medical Integration', hours: 16, description: 'Integration with pediatrician product recommendations', checked: true },
    { id: 4, task: 'Baby Sleep Tracker', topic: 'Health Monitoring', hours: 20, description: 'Sleep pattern tracking with product suggestions', checked: true },
    { id: 5, task: 'Feeding Schedule Manager', topic: 'Nutrition', hours: 14, description: 'Feeding schedule with formula/food recommendations', checked: false },
    { id: 6, task: 'Photo Memory Book', topic: 'Social Features', hours: 25, description: 'Baby photo timeline with product memories', checked: true },
    { id: 7, task: 'Emergency Contact System', topic: 'Safety', hours: 12, description: 'Quick access to emergency contacts and info', checked: false },
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('dremababy-sales-tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [extras, setExtras] = useState(() => {
    const saved = localStorage.getItem('dremababy-sales-extras');
    return saved ? JSON.parse(saved) : defaultExtras;
  });

  const [defaultRate, setDefaultRate] = useState(() => {
    const saved = localStorage.getItem('dremababy-default-rate');
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
      const me = projects.find(p => p.client === 'Dreambaby' && p.name === 'Dreambaby Platform');
      return me?.offerTickets || [];
    } catch (e) { return []; }
  });

  // Send to client function
  const sendToClient = () => {
    setSuccessMessage('Dreambaby offerte is verstuurd naar de klant!');
    setShowSuccessModal(true);
  };
  const [approvalStatus, setApprovalStatus] = useState(() => {
    const savedStatus = localStorage.getItem('dremababy-sales-approval-status');
    return savedStatus ? savedStatus : 'approved'; // Default to approved
  });

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('dremababy-sales-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save extras to localStorage whenever extras change
  useEffect(() => {
    localStorage.setItem('dremababy-sales-extras', JSON.stringify(extras));
  }, [extras]);

  // Save default rate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dremababy-default-rate', defaultRate.toString());
  }, [defaultRate]);

  // Listen for tickets updates
  useEffect(() => {
    const handler = () => {
      try {
        const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
        const me = projects.find(p => p.client === 'Dreambaby' && p.name === 'Dreambaby Platform');
        setProjectTickets(me?.offerTickets || []);
      } catch (e) {}
    };
    window.addEventListener('localStorageUpdate', handler);
    handler();
    return () => window.removeEventListener('localStorageUpdate', handler);
  }, []);

  const isSynced = (label) => {
    return (projectTickets || []).some(t => (t.label || '') === (label || ''));
  };

  const goToProjectDetail = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
      const me = projects.find(p => p.client === 'Dreambaby' && p.name === 'Dreambaby Platform');
      if (me?.id) {
        window.dispatchEvent(new CustomEvent('selectProject', { detail: { projectId: me.id } }));
      }
    } catch (e) {}
  };

  // Save approval status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dremababy-sales-approval-status', approvalStatus);
    // Also save old approved format for backward compatibility
    localStorage.setItem('dremababy-sales-approved', JSON.stringify(approvalStatus === 'approved'));
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
        `Jira ticket aangemaakt voor Dreambaby:\n` +
        `Taak: ${jiraItem.task}\n` +
        `Type: ${jiraItem.type}\n` +
        `Uren: ${jiraItem.hours}h`
      );
      // Persist to project's offerTickets so it shows in ProjectDetailPage
      try {
        const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
        const updated = projects.map(p => {
          if (p.client === 'Dreambaby' && p.name === 'Dreambaby Platform') {
            // Generate key like MSYDB-281 using a per-project counter
            const seqKey = `ticket-seq-${p.id || 'dreambaby'}`;
            const current = parseInt(localStorage.getItem(seqKey) || '280');
            const next = isNaN(current) ? 1 : current + 1;
            localStorage.setItem(seqKey, String(next));
            const key = `MSYDB-${next}`;

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
    return existingProjects.some(project => project.client === 'Dreambaby' && project.name === 'Dreambaby Platform');
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
      name: 'Dreambaby Platform',
      client: 'Dreambaby',
      status: 'Planning',
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      team: ['Gijs'],
      logo: '',
      icon: 'Baby',
      iconColor: 'from-pink-500 to-purple-600',
      tmsCode: `DB-${String(Date.now()).slice(-3)}`,
      description: 'Baby verzorging en ontwikkeling platform met growth tracker en sleep monitoring',
      budget: `€${calculatedTotal.toLocaleString()}`,
      seoScore: 70
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
    a.download = `dreambaby-calculator-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-3xl font-bold text-white mb-2">Dreambaby - Sales Calculator</h1>
          <p className="text-white/70">Baby care and development platform with smart features</p>
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
                  <span className="text-white/60">Project: <span className="text-white">Dreambaby</span></span>
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

export default DremababySalesPage;
