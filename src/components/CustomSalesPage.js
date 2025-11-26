import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download, Trash2, X, Ticket, Lock, Unlock, CheckCircle, Clock, XCircle, FolderPlus, Plus, User, Building, Store, Briefcase, Zap, Heart, Star, Rocket, Globe, Shield, Send } from 'lucide-react';

const CustomSalesPage = ({ clientName, tabId }) => {
  const defaultProjectData = [
    { 
      id: 1, 
      task: 'Thema aanpassing', 
      topic: 'default', 
      hours: 8, 
      rate: 75, 
      total: 600,
      description: 'Standaard thema aanpassingen',
      isDefault: true,
      included: true
    },
    { 
      id: 2, 
      task: 'Product pagina optimalisatie', 
      topic: 'default', 
      hours: 12, 
      rate: 75, 
      total: 900,
      description: 'Verbetering van product pagina\'s',
      isDefault: true,
      included: true
    },
    { 
      id: 3, 
      task: 'Checkout proces verbetering', 
      topic: 'default', 
      hours: 16, 
      rate: 75, 
      total: 1200,
      description: 'Optimalisatie van checkout flow',
      isDefault: true,
      included: true
    }
  ];

  const topicColors = {
    'app': 'bg-blue-500/20 text-blue-300',
    'custom code': 'bg-purple-500/20 text-purple-300',
    'default': 'bg-green-500/20 text-green-300',
    'APP': 'bg-teal-500/20 text-teal-300'
  };

  const [projectData, setProjectData] = useState(() => {
    const savedProjectData = localStorage.getItem(`${tabId}-sales`);
    return savedProjectData ? JSON.parse(savedProjectData) : defaultProjectData;
  });

  const [defaultRate, setDefaultRate] = useState(() => {
    const savedRate = localStorage.getItem(`${tabId}-default-rate`);
    return savedRate ? parseInt(savedRate) : 125;
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const [jiraItem, setJiraItem] = useState(null);
  
  // New quote modal state
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('User');
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Delete offerte confirmation state
  const [showDeleteOfferteConfirm, setShowDeleteOfferteConfirm] = useState(false);

  // Available icons for client selection
  const availableIcons = {
    'User': { component: User, color: 'from-blue-500 to-purple-600' },
    'Building': { component: Building, color: 'from-gray-500 to-slate-600' },
    'Store': { component: Store, color: 'from-green-500 to-emerald-600' },
    'Briefcase': { component: Briefcase, color: 'from-orange-500 to-red-600' },
    'Zap': { component: Zap, color: 'from-yellow-500 to-orange-600' },
    'Heart': { component: Heart, color: 'from-pink-500 to-rose-600' },
    'Star': { component: Star, color: 'from-purple-500 to-indigo-600' },
    'Rocket': { component: Rocket, color: 'from-cyan-500 to-blue-600' },
    'Globe': { component: Globe, color: 'from-teal-500 to-cyan-600' },
    'Shield': { component: Shield, color: 'from-indigo-500 to-purple-600' }
  };
  const [approvalStatus, setApprovalStatus] = useState(() => {
    const savedStatus = localStorage.getItem(`${tabId}-approval-status`);
    return savedStatus ? savedStatus : 'default';
  });

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${tabId}-sales`, JSON.stringify(projectData));
  }, [projectData, tabId]);

  // Save default rate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${tabId}-default-rate`, defaultRate.toString());
  }, [defaultRate, tabId]);

  // Save approval status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${tabId}-approval-status`, approvalStatus);
    // Also save old approved format for backward compatibility
    localStorage.setItem(`${tabId}-approved`, JSON.stringify(approvalStatus === 'approved'));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('localStorageUpdate'));
  }, [approvalStatus, tabId]);

  // Recalculate totals when default rate changes
  useEffect(() => {
    setProjectData(prev => prev.map(item => ({
      ...item,
      rate: defaultRate,
      total: item.hours * defaultRate
    })));
  }, [defaultRate]);

  const updateTask = (id, field, value) => {
    setProjectData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addExtraRow = () => {
    const newId = Math.max(...projectData.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      task: '',
      topic: 'app',
      hours: 0,
      rate: defaultRate,
      total: 0,
      description: '',
      isDefault: false,
      included: true,
      isNew: true
    };
    setProjectData(prev => [...prev, newItem]);
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const deleteItem = () => {
    if (itemToDelete) {
      setProjectData(prev => prev.filter(item => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const openJiraModal = (item) => {
    setJiraItem(item);
    setShowJiraModal(true);
  };

  const createJiraTicket = () => {
    // Simulate Jira ticket creation
    console.log('Creating Jira ticket for:', jiraItem);
    setShowJiraModal(false);
    setJiraItem(null);
  };

  const cancelJira = () => {
    setShowJiraModal(false);
    setJiraItem(null);
  };

  // New quote functions
  const handleNewQuote = () => {
    setShowNewQuoteModal(true);
  };

  const createNewQuote = () => {
    if (!newClientName.trim()) return;
    
    // Create unique tab ID based on client name
    const newTabId = `sales-${newClientName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Duplicate current sales calculator data for new client, but only include checked extra items
    const currentSalesData = localStorage.getItem(`${tabId}-sales`);
    if (currentSalesData) {
      const parsedData = JSON.parse(currentSalesData);
      // Filter to only include default items and checked extra items
      const filteredData = parsedData.filter(item => 
        item.isDefault || (item.included && item.included === true)
      );
      localStorage.setItem(`${newTabId}-sales`, JSON.stringify(filteredData));
    }
    
    // Set default rate for new client
    const currentDefaultRate = localStorage.getItem(`${tabId}-default-rate`) || '125';
    localStorage.setItem(`${newTabId}-default-rate`, currentDefaultRate);
    
    // Set initial approval status to default
    localStorage.setItem(`${newTabId}-approval-status`, 'default');
    localStorage.setItem(`${newTabId}-approved`, 'false');
    
    // Store client info
    const clientInfo = {
      name: newClientName,
      tabId: newTabId,
      icon: selectedIcon,
      color: availableIcons[selectedIcon].color,
      created: new Date().toISOString()
    };
    
    // Add to list of custom clients
    const existingClients = JSON.parse(localStorage.getItem('custom-sales-clients') || '[]');
    existingClients.push(clientInfo);
    localStorage.setItem('custom-sales-clients', JSON.stringify(existingClients));
    
    // Show success message
    setSuccessMessage(`Nieuwe offerte aangemaakt voor ${newClientName}!`);
    setShowSuccessModal(true);
    
    // Close modal and reset
    setShowNewQuoteModal(false);
    setNewClientName('');
    setSelectedIcon('User');
  };

  const cancelNewQuote = () => {
    setShowNewQuoteModal(false);
    setNewClientName('');
    setSelectedIcon('User');
  };

  // Check if project already exists
  const projectExists = () => {
    const existingProjects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
    return existingProjects.some(project => project.client === clientName && project.name === `${clientName} Project`);
  };

  // Convert to project function
  const convertToProject = () => {
    if (projectExists()) {
      return; // Don't create if already exists
    }
    
    // Get client info from localStorage
    const customClients = JSON.parse(localStorage.getItem('custom-sales-clients') || '[]');
    const clientInfo = customClients.find(c => c.tabId === tabId);
    
    const projectData = {
      id: Date.now(),
      name: `${clientName} Project`,
      client: clientName,
      status: 'Planning',
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      team: ['Gijs'],
      logo: '',
      icon: clientInfo?.icon || 'User',
      iconColor: clientInfo?.color || 'from-blue-500 to-purple-600',
      tmsCode: `${clientName.substring(0, 2).toUpperCase()}-${String(Date.now()).slice(-3)}`,
      description: `Project voor ${clientName} gebaseerd op sales calculator`,
      budget: `€${totalIncluded.toLocaleString()}`,
      seoScore: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
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

  // Delete offerte functions
  const confirmDeleteOfferte = () => {
    setShowDeleteOfferteConfirm(true);
  };

  const deleteOfferte = () => {
    // Remove from custom clients
    const existingClients = JSON.parse(localStorage.getItem('custom-sales-clients') || '[]');
    const updatedClients = existingClients.filter(client => client.tabId !== tabId);
    localStorage.setItem('custom-sales-clients', JSON.stringify(updatedClients));
    
    // Remove localStorage data for this client
    localStorage.removeItem(`${tabId}-sales`);
    localStorage.removeItem(`${tabId}-default-rate`);
    localStorage.removeItem(`${tabId}-approval-status`);
    localStorage.removeItem(`${tabId}-approved`);
    
    // Show success message
    setSuccessMessage(`Offerte voor ${clientName} is verwijderd!`);
    setShowSuccessModal(true);
    setShowDeleteOfferteConfirm(false);
    
    // Navigate back to sales overview after a short delay
    setTimeout(() => {
      window.location.href = '#sales'; // Or use proper navigation if available
    }, 2000);
  };

  const cancelDeleteOfferte = () => {
    setShowDeleteOfferteConfirm(false);
  };

  // Send to client function
  const sendToClient = () => {
    // Show success message
    setSuccessMessage(`Offerte voor ${clientName} is verstuurd naar de klant!`);
    setShowSuccessModal(true);
  };

  const totalHours = projectData.filter(item => item.included).reduce((sum, item) => sum + item.hours, 0);
  const totalIncluded = projectData.filter(item => item.included).reduce((sum, item) => sum + item.total, 0);

  const exportToCSV = () => {
    const headers = ['Type', 'Taak', 'Topic', 'Uren', 'Tarief', 'Totaal', 'Beschrijving'];
    const csvContent = [
      headers.join(','),
      ...projectData.filter(item => item.included).map(item => [
        item.isDefault ? 'Default' : 'Extra',
        item.task,
        item.topic,
        item.hours,
        `€${defaultRate}`,
        `€${item.total}`,
        item.description
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${clientName.toLowerCase().replace(/\s+/g, '-')}-calculator-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{clientName} - Offerte</h1>
          <p className="text-white/70">Bereken project kosten en genereer offertes voor {clientName}</p>
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
          <span className="text-white/70 text-base">Totaal: </span>
          <span className="text-white font-bold text-3xl">€{totalIncluded.toLocaleString()}</span>
        </div>
      </div>

      {/* Send to Client Button moved to action row below */}

      {/* Default Table */}
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
              {projectData.filter(item => item.isDefault).map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) => updateTask(item.id, 'task', e.target.value)}
                      className={`bg-transparent text-white border-none outline-none w-full ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={item.topic === 'default' || approvalStatus === 'approved'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.topic}
                      onChange={(e) => updateTask(item.id, 'topic', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none ${topicColors[item.topic]} ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="app" className="bg-gray-800 text-white">app</option>
                      <option value="custom code" className="bg-gray-800 text-white">custom code</option>
                      <option value="default" className="bg-gray-800 text-white">default</option>
                    </select>
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
                  <td className="py-3 px-4 text-white font-medium">
                    €{item.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateTask(item.id, 'description', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full text-sm ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openJiraModal(item)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Maak Jira ticket"
                    >
                      <Ticket className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra's Table */}
      <div className="gradient-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-white text-xl font-semibold">Extra's</h2>
            {approvalStatus === 'approved' && <Lock className="w-5 h-5 text-yellow-400" title="Vergrendeld - Approved" />}
          </div>
          <button 
            onClick={addExtraRow}
            disabled={approvalStatus === 'approved'}
            className={`btn-primary px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center space-x-2 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>+ Nieuwe Rij</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/80 font-medium">Incl.</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Taak</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Topic</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Uren</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Totaal</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Beschrijving</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Jira</th>
                <th className="text-left py-3 px-4 text-white/80 font-medium">Acties</th>
              </tr>
            </thead>
            <tbody>
              {projectData.filter(item => !item.isDefault).map((item) => (
                <tr key={item.id} className={`border-b border-white/5 hover:bg-white/5 ${item.isNew ? 'opacity-60' : ''}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={item.included}
                      onChange={(e) => updateTask(item.id, 'included', e.target.checked)}
                      disabled={approvalStatus === 'approved'}
                      className={`w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) => updateTask(item.id, 'task', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full ${item.isNew ? 'placeholder-white/40' : ''} ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={item.isNew ? 'Voer taaknaam in...' : ''}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.topic}
                      onChange={(e) => updateTask(item.id, 'topic', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none ${topicColors[item.topic]} ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="app" className="bg-gray-800 text-white">app</option>
                      <option value="custom code" className="bg-gray-800 text-white">custom code</option>
                      <option value="default" className="bg-gray-800 text-white">default</option>
                    </select>
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
                  <td className="py-3 px-4 text-white font-medium">
                    €{item.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateTask(item.id, 'description', e.target.value)}
                      disabled={approvalStatus === 'approved'}
                      className={`bg-transparent text-white border-none outline-none w-full text-sm ${item.isNew ? 'placeholder-white/40' : ''} ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={item.isNew ? 'Voer beschrijving in...' : ''}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openJiraModal(item)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Maak Jira ticket"
                    >
                      <Ticket className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => confirmDelete(item)}
                      disabled={approvalStatus === 'approved'}
                      className={`text-red-400 hover:text-red-300 p-1 ${approvalStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[400px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">Item Verwijderen</h2>
              <button 
                onClick={cancelDelete}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Ben je zeker dat je de taak <span className="text-white font-semibold">"{itemToDelete?.task}"</span> wil verwijderen?
              </p>
              <p className="text-red-300 text-sm">
                Deze actie kan niet ongedaan gemaakt worden.
              </p>
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

      {/* Jira Ticket Modal */}
      {showJiraModal && jiraItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Jira Ticket Maken</h2>
              <button 
                onClick={cancelJira}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Wens je een Jira ticket te maken voor: <span className="text-white font-semibold">"{jiraItem.task}"</span>?
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Beschrijving:</span>
                  <span className="text-white">{jiraItem.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Uren:</span>
                  <span className="text-white">{jiraItem.hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Totaal:</span>
                  <span className="text-white">€{jiraItem.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Topic:</span>
                  <span className="text-white">{jiraItem.topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Klant:</span>
                  <span className="text-white">{clientName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={createJiraTicket}
                className="btn-primary px-6 py-2 rounded-lg text-white font-medium flex-1 flex items-center justify-center space-x-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Ja, Maak Ticket</span>
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
          onClick={handleNewQuote}
          className="glass-effect px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nieuwe Offerte</span>
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
        <button 
          onClick={confirmDeleteOfferte}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          title="Verwijder offerte"
        >
          <Trash2 className="w-5 h-5" />
          <span>Verwijderen</span>
        </button>
      </div>

      {/* New Quote Modal */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Nieuwe Offerte Maken</h2>
              <button 
                onClick={cancelNewQuote}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="clientName" className="block text-white/80 text-sm font-medium mb-2">
                Klantnaam
              </label>
              <input
                type="text"
                id="clientName"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Voer de naam van de klant in..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && createNewQuote()}
              />
              <p className="text-white/50 text-xs mt-2">
                Er wordt een nieuwe offerte calculator aangemaakt gebaseerd op de huidige template.
              </p>
            </div>

            {/* Icon Selection */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Kies een icoon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(availableIcons).map(([iconName, iconData]) => {
                  const IconComponent = iconData.component;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`
                        p-3 rounded-lg transition-all flex items-center justify-center
                        ${selectedIcon === iconName 
                          ? 'bg-blue-500/30 ring-2 ring-blue-400' 
                          : 'bg-white/10 hover:bg-white/20'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${iconData.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-white/50 text-xs mt-2">
                Dit icoon wordt gebruikt in de sidebar en op tegels.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={createNewQuote}
                disabled={!newClientName.trim()}
                className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                  newClientName.trim() 
                    ? 'btn-primary text-white' 
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Offerte Maken</span>
              </button>
              <button 
                onClick={cancelNewQuote}
                className="flex-1 glass-effect px-6 py-3 rounded-lg text-white font-medium transition-colors"
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
              <p className="text-white/70 mb-6">{successMessage}</p>
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

      {/* Delete Offerte Confirmation Modal */}
      {showDeleteOfferteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Offerte Verwijderen</h2>
              <button 
                onClick={cancelDeleteOfferte}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-white/70 mb-4 text-center">
                Ben je zeker dat je de offerte voor <span className="text-white font-semibold">"{clientName}"</span> wil verwijderen?
              </p>
              <p className="text-red-300 text-sm text-center">
                Deze actie kan niet ongedaan gemaakt worden. Alle data en instellingen worden permanent verwijderd.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={deleteOfferte}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white font-medium flex-1 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ja, Verwijderen</span>
              </button>
              <button 
                onClick={cancelDeleteOfferte}
                className="glass-effect px-6 py-3 rounded-lg text-white font-medium flex-1 transition-colors"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSalesPage;
