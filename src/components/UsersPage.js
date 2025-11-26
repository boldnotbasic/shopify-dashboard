import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Shield, Eye, PenTool, Crown, Mail, Calendar, Search } from 'lucide-react';

const UsersPage = () => {
  const defaultUsers = [
    {
      id: 1,
      name: 'Gijs Meteor',
      email: 'gijs@meteor.com',
      role: 'admin',
      avatar: 'https://via.placeholder.com/80x80/4facfe/ffffff?text=GM',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      joinDate: '2023-06-01T00:00:00Z',
      projects: ['Royal Talens', 'Dremababy', 'Meteor Merch'],
      department: 'Development'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@meteor.com',
      role: 'editor',
      avatar: 'https://via.placeholder.com/80x80/fa709a/ffffff?text=SJ',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00Z',
      joinDate: '2023-08-15T00:00:00Z',
      projects: ['Royal Talens', 'Theme Development'],
      department: 'Design'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@meteor.com',
      role: 'viewer',
      avatar: 'https://via.placeholder.com/80x80/43e97b/ffffff?text=MC',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      joinDate: '2023-11-20T00:00:00Z',
      projects: ['Dremababy'],
      department: 'Marketing'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@meteor.com',
      role: 'editor',
      avatar: 'https://via.placeholder.com/80x80/667eea/ffffff?text=EW',
      status: 'inactive',
      lastLogin: '2023-12-20T14:20:00Z',
      joinDate: '2023-05-10T00:00:00Z',
      projects: ['Theme Development'],
      department: 'Development'
    }
  ];

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('shopify-dashboard-users');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    avatar: '',
    status: 'active',
    department: '',
    projects: []
  });

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('shopify-dashboard-users', JSON.stringify(users));
  }, [users]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return PenTool;
      case 'viewer': return Eye;
      default: return Shield;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'editor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h geleden`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d geleden`;
    } else {
      return formatDate(dateString);
    }
  };

  const addUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        ...newUser,
        id: Date.now(),
        lastLogin: new Date().toISOString(),
        joinDate: new Date().toISOString(),
        projects: newUser.projects || []
      };
      setUsers([...users, user]);
      resetForm();
    }
  };

  const updateUser = () => {
    if (newUser.name && newUser.email) {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...newUser, id: editingUser.id, joinDate: editingUser.joinDate, lastLogin: editingUser.lastLogin }
          : u
      );
      setUsers(updatedUsers);
      resetForm();
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      status: user.status,
      department: user.department || '',
      projects: user.projects || []
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      avatar: '',
      status: 'active',
      department: '',
      projects: []
    });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const deleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    viewer: users.filter(u => u.role === 'viewer').length,
    active: users.filter(u => u.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gebruikersbeheer</h1>
          <p className="text-white/70">Beheer gebruikers, rollen en toegangsrechten</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nieuwe Gebruiker</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="gradient-card px-6 py-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-red-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Admins</p>
              <p className="text-white font-bold text-2xl">{roleStats.admin}</p>
            </div>
          </div>
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <PenTool className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Editors</p>
              <p className="text-white font-bold text-2xl">{roleStats.editor}</p>
            </div>
          </div>
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Viewers</p>
              <p className="text-white font-bold text-2xl">{roleStats.viewer}</p>
            </div>
          </div>
        </div>
        <div className="gradient-card px-6 py-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Users className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Actief</p>
              <p className="text-white font-bold text-2xl">{roleStats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Zoek gebruikers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 w-full"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
        >
          <option value="all" className="bg-gray-800">Alle rollen</option>
          <option value="admin" className="bg-gray-800">Admin</option>
          <option value="editor" className="bg-gray-800">Editor</option>
          <option value="viewer" className="bg-gray-800">Viewer</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <div key={user.id} className="gradient-card rounded-xl p-6 hover:scale-105 transition-transform relative">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <button 
                  onClick={() => startEdit(user)}
                  className="bg-black/50 p-2 rounded-full text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => confirmDelete(user)}
                  className="bg-black/50 p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-black/70 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-blue-purple flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                  <p className="text-white/70 text-sm">{user.email}</p>
                  <p className="text-white/60 text-xs">{user.department}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Rol:</span>
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                    <RoleIcon className="w-3 h-3" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Status:</span>
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(user.status)}`}>
                    <span className="capitalize">{user.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Laatste login:</span>
                  <span className="text-white text-sm">{formatLastLogin(user.lastLogin)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Lid sinds:</span>
                  <span className="text-white text-sm">{formatDate(user.joinDate)}</span>
                </div>

                {user.projects && user.projects.length > 0 && (
                  <div>
                    <span className="text-white/60 text-sm">Projecten:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.projects.slice(0, 2).map((project, index) => (
                        <span key={index} className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                          {project}
                        </span>
                      ))}
                      {user.projects.length > 2 && (
                        <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                          +{user.projects.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit User Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="gradient-card rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">
                {editingUser ? 'Gebruiker Bewerken' : 'Nieuwe Gebruiker Toevoegen'}
              </h2>
              <button 
                onClick={resetForm}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Naam *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="Volledige naam"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="email@meteor.com"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Rol</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="viewer" className="bg-gray-800">Viewer</option>
                  <option value="editor" className="bg-gray-800">Editor</option>
                  <option value="admin" className="bg-gray-800">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="active" className="bg-gray-800">Actief</option>
                  <option value="inactive" className="bg-gray-800">Inactief</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Afdeling</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="Development, Design, Marketing..."
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={newUser.avatar}
                  onChange={(e) => setNewUser({...newUser, avatar: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={editingUser ? updateUser : addUser}
                className="btn-primary px-6 py-2 rounded-lg text-white font-medium"
              >
                {editingUser ? 'Gebruiker Bijwerken' : 'Gebruiker Toevoegen'}
              </button>
              <button 
                onClick={resetForm}
                className="glass-effect px-6 py-2 rounded-lg text-white font-medium"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="gradient-card rounded-xl p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Gebruiker Verwijderen</h2>
              <button 
                onClick={cancelDelete}
                className="text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                Ben je zeker dat je gebruiker <span className="text-white font-semibold">"{userToDelete?.name}"</span> wil verwijderen?
              </p>
              <p className="text-red-300 text-sm">
                Deze actie kan niet ongedaan gemaakt worden.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={deleteUser}
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
    </div>
  );
};

export default UsersPage;
