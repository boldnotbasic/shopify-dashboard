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
import { Pencil, Trash2 } from 'lucide-react';
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
    color: 'from-pink-500 to-purple-600',
    mailTemplate: ''
  });
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailUpsell, setMailUpsell] = useState(null);
  const [mailText, setMailText] = useState('');
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [projectToAddId, setProjectToAddId] = useState('');
  const [upsellToAdd, setUpsellToAdd] = useState(null);

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
  const bulletsToText = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');

  // Mail template helpers (localStorage)
  const getMailTemplatesMap = () => {
    try { return JSON.parse(localStorage.getItem('shopify-dashboard-upsell-mail-templates') || '{}'); } catch { return {}; }
  };
  const getMailTemplate = (id) => {
    const map = getMailTemplatesMap();
    return id != null ? (map[String(id)] || '') : '';
  };
  const setMailTemplate = (id, template) => {
    if (id == null) return;
    const map = getMailTemplatesMap();
    map[String(id)] = template || '';
    try { localStorage.setItem('shopify-dashboard-upsell-mail-templates', JSON.stringify(map)); } catch {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await db.upsells.getAll();
        setUpsells(Array.isArray(rows) ? rows : []);
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

  const Section = ({ label, colorClass, items, onOpen }) => (
    <section className="mt-2">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>{label}</span>
        <span className="text-white/50 text-sm">{items.length} diensten</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((s) => (
          <div key={s.id} className="gradient-card rounded-xl p-5 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group" onClick={() => { setIsEditing(false); onOpen && onOpen(s); }}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color || (String(s.category).toLowerCase()==='development' ? 'from-pink-500 to-purple-600' : 'from-blue-500 to-cyan-500')} opacity-10 group-hover:opacity-20 transition-opacity z-0`}></div>

            {/* Action Icons */}
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-1">
              <button
                title="Bewerken"
                onClick={(e)=>{ e.stopPropagation(); setSelected(s); setIsEditing(true); setEditData({ ...s, bulletsText: bulletsToText(s.bullets), mailTemplate: getMailTemplate(s.id) }); }}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <Pencil className="w-3 h-3" />
              </button>
              <button
                title="Verwijderen"
                onClick={async (e)=>{ 
                  e.stopPropagation(); 
                  if (!window.confirm('Deze upsell verwijderen?')) return; 
                  try { 
                    await db.upsells.delete(s.id); 
                    setUpsells((prev)=>prev.filter(u=>u.id!==s.id)); 
                    if (selected?.id === s.id) setSelected(null);
                  } catch (_) { alert('Verwijderen mislukt'); }
                }}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${getColorClasses(s)}`}>{s.emoji}</div>
                  <div>
                    <h3 className="text-white font-semibold">{s.title}</h3>
                    <p className="text-white/70 text-sm">{s.description}</p>
                  </div>
                </div>
                {/* details removed */}
              </div>
              <ul className="text-white/70 text-sm space-y-1 mb-4 list-disc list-inside">
                {(s.bullets || []).slice(0, 4).map((b, i) => (<li key={i}>{b}</li>))}
              </ul>
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="bg-white/10 px-2 py-1 rounded">{s.duration}</span>
                <span className="text-emerald-300">{s.impact}</span>
                <span className="bg-white/10 px-2 py-1 rounded">{s.price}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={(e)=>{ e.stopPropagation(); setMailUpsell(s); const t = getMailTemplate(s.id); setMailText(t || ''); setShowMailModal(true); }}
                  className="glass-effect px-3 py-1.5 rounded-lg text-white text-sm"
                >
                  Mail template
                </button>
                <button
                  onClick={(e)=>{ 
                    e.stopPropagation(); 
                    let arr = [];
                    try { arr = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]'); } catch {}
                    setProjectsList(Array.isArray(arr) ? arr : []);
                    setProjectToAddId((Array.isArray(arr) && arr[0]) ? String(arr[0].id) : '');
                    setUpsellToAdd(s);
                    setShowAddToProjectModal(true);
                  }}
                  className="btn-primary px-3 py-1.5 rounded-lg text-white text-sm"
                >
                  Voeg toe aan project
                </button>
              </div>
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
          <Section label="Development" colorClass="bg-pink-500/20 text-pink-300" items={devItems} onOpen={(s)=>setSelected(s)} />
          <Section label="Na Go Live" colorClass="bg-blue-500/20 text-blue-300" items={postItems} onOpen={(s)=>setSelected(s)} />
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
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-1">Mail template</label>
                <textarea value={newItem.mailTemplate} onChange={(e)=>setNewItem({...newItem, mailTemplate:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2 h-24" placeholder="Optioneel: mailtemplate voor deze upsell" />
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
                    if (newItem.mailTemplate) setMailTemplate(row.id, newItem.mailTemplate);
                    setUpsells([row, ...upsells]);
                    setShowAdd(false);
                    setNewItem({ title:'', description:'', bulletsText:'', category:'development', duration:'', impact:'', price:'', emoji:'✨', color:'from-pink-500 to-purple-600', mailTemplate:'' });
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

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="gradient-card rounded-xl overflow-hidden w-full max-w-3xl">
            {/* Header */}
            <div className={`px-6 py-5 ${getColorClasses(selected)} flex items-start justify-between`}>
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl`}>{selected.emoji}</div>
                <div>
                  <div className="text-xs font-semibold text-white/80">
                    {String(selected.category).toLowerCase()==='development' ? 'Development' : 'Post-Launch'}
                  </div>
                  <h3 className="text-white text-xl font-bold leading-tight">{selected.title}</h3>
                  <p className="text-white/80 text-sm">{selected.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button onClick={()=>{ setIsEditing(true); setEditData({ ...selected, bulletsText: bulletsToText(selected.bullets), mailTemplate: getMailTemplate(selected.id) }); }} className="glass-effect px-3 py-1.5 rounded text-white text-sm">Bewerken</button>
                )}
                <button onClick={()=>setSelected(null)} className="text-white/90 hover:text-white text-lg">✕</button>
              </div>
            </div>

            {/* Body */}
            {!isEditing ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Geschatte tijd</div>
                    <div className="text-white font-semibold">{selected.duration || '—'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Investering</div>
                    <div className="text-white font-semibold">{selected.price || '—'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/50 text-xs mb-1">Potentieel</div>
                    <div className="text-white font-semibold">{selected.impact || '—'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Wat krijg je?</h4>
                  {(selected.bullets || []).length === 0 ? (
                    <div className="text-white/60 text-sm">Geen bullets opgegeven.</div>
                  ) : (
                    <ul className="text-white/80 text-sm space-y-1">
                      {selected.bullets.map((b,i)=> (
                        <li key={i} className="flex items-start"><span className="text-emerald-300 mr-2">✔</span>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">{selected.description || '—'}</div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={()=>setSelected(null)} className="glass-effect px-4 py-2 rounded-lg text-white">Sluiten</button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Titel</label>
                    <input value={editData.title} onChange={(e)=>setEditData({...editData, title:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Categorie</label>
                    <select value={editData.category} onChange={(e)=>setEditData({...editData, category:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2">
                      <option value="development" className="bg-gray-800">Development</option>
                      <option value="post-launch" className="bg-gray-800">Na Go Live</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm mb-1">Beschrijving</label>
                    <input value={editData.description} onChange={(e)=>setEditData({...editData, description:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm mb-1">Bullets (1 per lijn of komma-gescheiden)</label>
                    <textarea value={editData.bulletsText} onChange={(e)=>setEditData({...editData, bulletsText:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2 h-24" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm mb-1">Mail template</label>
                    <textarea value={editData.mailTemplate || ''} onChange={(e)=>setEditData({...editData, mailTemplate:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2 h-24" placeholder="Optioneel: mailtemplate voor deze upsell" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Duur</label>
                    <input value={editData.duration || ''} onChange={(e)=>setEditData({...editData, duration:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Impact</label>
                    <input value={editData.impact || ''} onChange={(e)=>setEditData({...editData, impact:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Prijs</label>
                    <input value={editData.price || ''} onChange={(e)=>setEditData({...editData, price:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Emoji</label>
                    <input value={editData.emoji || ''} onChange={(e)=>setEditData({...editData, emoji:e.target.value})} className="w-full input-plain rounded-lg px-3 py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm mb-2">Kleur (gradient)</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {gradients.map(g => (
                        <button key={g} type="button" onClick={()=>setEditData({...editData, color:g})} className={`h-8 rounded ${editData.color===g ? 'ring-2 ring-white' : ''} bg-gradient-to-br ${g}`}></button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button onClick={()=>{ setIsEditing(false); setEditData(null); }} className="glass-effect px-4 py-2 rounded-lg text-white">Annuleren</button>
                  <button
                    onClick={async ()=>{
                      try {
                        const payload = toDbUpsell(editData);
                        const row = await db.upsells.update(selected.id, payload);
                        setMailTemplate(selected.id, editData.mailTemplate || '');
                        setUpsells(upsells.map(u => u.id === selected.id ? row : u));
                        setSelected(row);
                        setIsEditing(false);
                        setEditData(null);
                      } catch (e) {
                        alert('Opslaan mislukt');
                      }
                    }}
                    className="btn-primary px-4 py-2 rounded-lg text-white font-medium"
                  >Opslaan</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mail Template Modal */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="gradient-card rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">Mail template</h2>
              <button onClick={()=>setShowMailModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <textarea value={mailText} onChange={(e)=>setMailText(e.target.value)} className="w-full input-plain rounded-lg px-3 py-2 h-48" placeholder="Mailtemplate..." />
              <div className="flex items-center gap-2 justify-end">
                <button onClick={async()=>{ try { await navigator.clipboard.writeText(mailText || ''); } catch(_) {} }} className="glass-effect px-4 py-2 rounded-lg text-white">Kopieer</button>
                <button onClick={()=>{ if (mailUpsell?.id != null) setMailTemplate(mailUpsell.id, mailText || ''); setShowMailModal(false); }} className="btn-primary px-4 py-2 rounded-lg text-white">Opslaan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add To Project Modal */}
      {showAddToProjectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="gradient-card rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">Voeg upsell toe aan project</h2>
              <button onClick={()=>setShowAddToProjectModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {projectsList.length === 0 ? (
                <div className="text-white/70 text-sm">Geen projecten gevonden.</div>
              ) : (
                <select value={projectToAddId} onChange={(e)=>setProjectToAddId(e.target.value)} className="w-full input-plain rounded-lg px-3 py-2">
                  {projectsList.map(p => (
                    <option key={p.id} value={String(p.id)} className="bg-gray-800">{p.name}</option>
                  ))}
                </select>
              )}
              <div className="flex items-center justify-end gap-2">
                <button onClick={()=>setShowAddToProjectModal(false)} className="glass-effect px-4 py-2 rounded-lg text-white">Annuleren</button>
                <button onClick={() => {
                  if (!projectToAddId || !upsellToAdd) { setShowAddToProjectModal(false); return; }
                  try {
                    const projects = JSON.parse(localStorage.getItem('shopify-dashboard-projects') || '[]');
                    const updated = projects.map(pr => {
                      if (String(pr.id) !== String(projectToAddId)) return pr;
                      const topics = Array.isArray(pr.upsellTopics) ? pr.upsellTopics.slice() : [];
                      const newTopic = {
                        title: upsellToAdd.title,
                        description: upsellToAdd.description || '',
                        bullets: Array.isArray(upsellToAdd.bullets) ? upsellToAdd.bullets : [],
                        price: upsellToAdd.price || '',
                        emoji: upsellToAdd.emoji || '✨',
                        createdAt: new Date().toISOString()
                      };
                      return { ...pr, upsellTopics: [...topics, newTopic] };
                    });
                    localStorage.setItem('shopify-dashboard-projects', JSON.stringify(updated));
                    window.dispatchEvent(new Event('localStorageUpdate'));
                  } catch(_) {}
                  setShowAddToProjectModal(false);
                }} className="btn-primary px-4 py-2 rounded-lg text-white">Voeg toe</button>
              </div>
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
