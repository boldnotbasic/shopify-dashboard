import React, { useEffect, useMemo, useState } from 'react';
import { Plus, X, Edit, Trash2, ChevronDown, Copy, Check, Search, Tag } from 'lucide-react';
import { db } from '../utils/supabaseClient';

const FaqClientsPage = () => {
  const defaultFaqs = [
    {
      question: 'Hoe krijg ik toegang tot B2B prijzen?',
      answer: 'Maak een B2B-account aan en vraag goedkeuring aan. Daarna zie je netto prijzen na inloggen.',
      category: 'B2B',
      messageTemplate: 'Hallo [NAAM],\n\nJe kan B2B prijzen zien door een B2B-account aan te maken en je in te loggen. Laat weten als ik je hiermee kan helpen.\n\nGroet,\n[AFZENDER]'
    },
    {
      question: 'Hoe kan ik mijn thema updaten zonder downtime?',
      answer: 'Publiceer een duplicaat van het thema, voer aanpassingen uit en wissel in een rustige periode.',
      category: 'Themes',
      messageTemplate: 'Hallo [NAAM],\n\nWe werken in een kopie van het thema en zetten dit live buiten piekuren om downtime te vermijden.\n\nGroet,\n[AFZENDER]'
    },
    {
      question: 'Welke app raden jullie aan voor productfilters?',
      answer: 'Gebruik bij voorkeur Shopify Search & Discovery. Voor geavanceerde opties kan Smart Product Filter & Search.',
      category: 'Apps',
      messageTemplate: 'Hallo [NAAM],\n\nVoor filters raden we standaard Search & Discovery aan. Indien je extra features wil, kan Smart Product Filter & Search.\n\nGroet,\n[AFZENDER]'
    }
  ];

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: '', messageTemplate: '' });
  const [openIds, setOpenIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const toDbFaq = (f) => ({
    question: f.question || null,
    answer: f.answer || null,
    category: f.category || null,
    message_template: f.messageTemplate ?? f.message_template ?? null
  });

  const fromDbFaq = (row) => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    messageTemplate: row.message_template,
    created_at: row.created_at,
    updated_at: row.updated_at
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await db.faqs.getAll();
        if (!rows || rows.length === 0) {
          const created = await Promise.all(defaultFaqs.map((f) => db.faqs.create(toDbFaq(f))));
          setFaqs(created.map(fromDbFaq));
        } else {
          setFaqs(rows.map(fromDbFaq));
        }
      } catch (e) {
        console.error('Load FAQs failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    try {
      const created = await db.faqs.create(toDbFaq(newFaq));
      setFaqs([...faqs, fromDbFaq(created)]);
      resetForm();
    } catch (e) {
      console.error('Add FAQ failed:', e);
      alert('Fout bij toevoegen FAQ');
    }
  };

  const updateFaq = async () => {
    if (!editingFaq) return;
    try {
      const updatedRow = await db.faqs.update(editingFaq.id, toDbFaq(newFaq));
      const updated = fromDbFaq(updatedRow);
      setFaqs(faqs.map((f) => (f.id === editingFaq.id ? updated : f)));
      resetForm();
    } catch (e) {
      console.error('Update FAQ failed:', e);
      alert('Fout bij bijwerken FAQ');
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('Zeker dat je deze FAQ wil verwijderen?')) return;
    try {
      await db.faqs.delete(id);
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (e) {
      console.error('Delete FAQ failed:', e);
      alert('Fout bij verwijderen FAQ');
    }
  };

  const startEdit = (faq) => {
    setEditingFaq(faq);
    setNewFaq({ ...faq });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNewFaq({ question: '', answer: '', category: '', messageTemplate: '' });
    setShowAddForm(false);
    setEditingFaq(null);
  };

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const copyTemplate = async (text, id) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text || '');
      } else {
        const ta = document.createElement('textarea');
        ta.value = text || '';
        ta.style.position = 'fixed';
        ta.style.left = '-999999px';
        ta.style.top = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const categories = useMemo(() => Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))), [faqs]);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      if (filterCategory && f.category !== filterCategory) return false;
      if (q) {
        const hay = `${f.question} ${f.answer} ${f.category} ${f.messageTemplate || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [faqs, search, filterCategory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">FAQ clients</h1>
          <p className="text-white/60">Beheer veelgestelde vragen per categorie en kopieer direct een klantbericht</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoeken..."
              className="pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="bg-gray-800">Alle categorieën</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-gray-800">{c}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nieuwe FAQ</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="gradient-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">{editingFaq ? 'FAQ bewerken' : 'Nieuwe FAQ'}</h2>
            <button onClick={resetForm} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Vraag</label>
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="Bijv. Hoe krijg ik B2B prijzen te zien?"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Categorie</label>
              <input
                type="text"
                value={newFaq.category}
                onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                placeholder="Bijv. B2B, Apps, Themes"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Antwoord</label>
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 h-24"
                placeholder="Beschrijf hier het antwoord..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm mb-2">Message template (voor kopiëren naar klant)</label>
              <textarea
                value={newFaq.messageTemplate}
                onChange={(e) => setNewFaq({ ...newFaq, messageTemplate: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 h-24 font-mono text-sm"
                placeholder="Hallo [NAAM], ..."
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={editingFaq ? updateFaq : addFaq} className="btn-primary px-6 py-2 rounded-lg text-white font-medium">
              {editingFaq ? 'FAQ bijwerken' : 'FAQ toevoegen'}
            </button>
            <button onClick={resetForm} className="glass-effect px-6 py-2 rounded-lg text-white font-medium">Annuleren</button>
          </div>
        </div>
      )}

      {/* Accordion List */}
      {loading ? (
        <div className="gradient-card rounded-xl p-12 text-center">
          <p className="text-white/70">Laden...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="gradient-card rounded-xl p-12 text-center">
          <p className="text-white/70">Geen FAQs gevonden.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="gradient-card rounded-xl">
              <button
                onClick={() => toggleOpen(faq.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center space-x-3">
                  <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${openIds.has(faq.id) ? 'rotate-180' : ''}`} />
                  <span className="text-white font-medium">{faq.question}</span>
                  {faq.category && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 flex items-center">
                      <Tag className="w-3 h-3 mr-1" />{faq.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(faq); }} className="text-white/60 hover:text-white p-1"><Edit className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteFaq(faq.id); }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              </button>
              {openIds.has(faq.id) && (
                <div className="px-5 pb-5 space-y-4">
                  {faq.answer && (
                    <div>
                      <p className="text-white/70 whitespace-pre-wrap text-sm">{faq.answer}</p>
                    </div>
                  )}
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm font-semibold">Message template</span>
                      <button
                        onClick={() => copyTemplate(faq.messageTemplate, faq.id)}
                        className={`p-2 rounded-lg transition-all ${copiedId === faq.id ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
                        title="Kopieer naar klembord"
                      >
                        {copiedId === faq.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">{faq.messageTemplate || '—'}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqClientsPage;
