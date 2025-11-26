import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, FileDown } from 'lucide-react';
import storage from '../utils/dataStorage';

const CATEGORY_DEFAULTS = ['Logo', 'Backgrounds', 'Social', 'Documents'];

const BrandingResourcesPage = ({ mode = 'meteor' }) => {
  const storageKey = mode === 'templates' ? 'branding-resources-templates' : 'branding-resources-meteor';
  const titlePrefix = mode === 'templates' ? 'Templates' : 'Meteor Branding';

  const [resources, setResources] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formType, setFormType] = useState('link'); // 'link' | 'file'
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Logo');
  const [formUrl, setFormUrl] = useState('');
  const [formFile, setFormFile] = useState(null);

  useEffect(() => {
    const stored = storage.getItem(storageKey, []);
    setResources(Array.isArray(stored) ? stored : []);
  }, [storageKey]);

  useEffect(() => {
    storage.setItem(storageKey, resources);
  }, [storageKey, resources]);

  const resetForm = () => {
    setFormType('link');
    setFormTitle('');
    setFormCategory('Logo');
    setFormUrl('');
    setFormFile(null);
  };

  const handleAddResource = (e) => {
    e.preventDefault();

    if (!formTitle.trim()) return;
    if (formType === 'link' && !formUrl.trim()) return;
    if (formType === 'file' && !formFile) return;

    const category = formCategory.trim() || 'Overig';

    if (formType === 'link') {
      const newResource = {
        id: Date.now().toString(),
        title: formTitle.trim(),
        type: 'link',
        url: formUrl.trim(),
        category,
      };
      setResources((prev) => [...prev, newResource]);
      setIsAdding(false);
      resetForm();
      return;
    }

    // File upload: read as data URL so we can reopen/download later
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      const newResource = {
        id: Date.now().toString(),
        title: formTitle.trim() || formFile.name,
        type: 'file',
        url: dataUrl,
        fileName: formFile.name,
        category,
      };
      setResources((prev) => [...prev, newResource]);
      setIsAdding(false);
      resetForm();
    };
    reader.readAsDataURL(formFile);
  };

  const handleOpenResource = (resource) => {
    if (!resource.url) return;

    // Files: trigger direct download
    if (resource.type === 'file') {
      const link = document.createElement('a');
      link.href = resource.url;
      link.download = resource.fileName || resource.title || 'download';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Links: open in new tab
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const groupedByCategory = resources.reduce((acc, res) => {
    const key = res.category || 'Overig';
    if (!acc[key]) acc[key] = [];
    acc[key].push(res);
    return acc;
  }, {});

  const categoryOrder = [
    ...CATEGORY_DEFAULTS,
    ...Object.keys(groupedByCategory).filter((c) => !CATEGORY_DEFAULTS.includes(c)),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{titlePrefix} resources</h1>
          <p className="text-white/60">
            Beheer logo's, achtergronden en andere brand assets. Voeg links of bestanden toe en download ze rechtstreeks.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded-lg border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          Voeg resource toe
        </button>
      </div>

      {/* Categories & tiles */}
      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const items = groupedByCategory[category] || [];
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{category}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleOpenResource(res)}
                    className="group aspect-square rounded-xl border border-white/15 bg-slate-900/40 hover:bg-slate-900/70 hover:border-blue-400/60 transition-colors flex flex-col items-center justify-center px-3 text-center"
                  >
                    <div className="mb-2 w-full flex items-center justify-center gap-1 text-xs uppercase tracking-wide text-white/40">
                      {res.type === 'file' ? (
                        <>
                          <FileDown className="w-3 h-3" />
                          <span>FILE</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3 h-3" />
                          <span>LINK</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm font-medium text-white group-hover:text-blue-300 line-clamp-2">
                      {res.title}
                    </div>
                    {res.type === 'file' && (
                      <div className="mt-1 text-[10px] text-white/40 truncate w-full">
                        {res.fileName}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {resources.length === 0 && (
          <div className="glass-effect rounded-xl p-6 border border-dashed border-white/20 text-center text-white/60">
            Nog geen resources toegevoegd. Gebruik "Voeg resource toe" om te starten.
          </div>
        )}
      </div>

      {/* Add resource modal */}
      {isAdding && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="glass-effect w-full max-w-lg rounded-2xl border border-white/15 p-6 relative">
            <button
              onClick={() => {
                setIsAdding(false);
                resetForm();
              }}
              className="absolute right-4 top-4 text-white/50 hover:text-white"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">Nieuwe resource toevoegen</h2>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Titel</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/70 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Bijv. Primary logo wit"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Categorie</label>
                <input
                  type="text"
                  list="branding-categories"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/70 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="Bijv. Logo, Backgrounds, Social"
                />
                <datalist id="branding-categories">
                  {CATEGORY_DEFAULTS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <span className="block text-sm text-white/70 mb-1">Type</span>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 text-white/80">
                    <input
                      type="radio"
                      name="resource-type"
                      value="link"
                      checked={formType === 'link'}
                      onChange={() => setFormType('link')}
                    />
                    Link
                  </label>
                  <label className="flex items-center gap-2 text-white/80">
                    <input
                      type="radio"
                      name="resource-type"
                      value="file"
                      checked={formType === 'file'}
                      onChange={() => setFormType('file')}
                    />
                    Bestand
                  </label>
                </div>
              </div>

              {formType === 'link' ? (
                <div>
                  <label className="block text-sm text-white/70 mb-1">URL</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/70 border border-white/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-white/70 mb-1">Bestand</label>
                  <input
                    type="file"
                    onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-white/80"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    resetForm();
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                  disabled={!formTitle.trim() || (formType === 'link' && !formUrl.trim()) || (formType === 'file' && !formFile)}
                >
                  Opslaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingResourcesPage;
