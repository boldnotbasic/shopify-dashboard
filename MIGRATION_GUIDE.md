# 📝 Component Migration Guide

Gids om overige components te migreren naar Supabase.

## ✅ Reeds Gemigreerd

- **AppsPage.js** - ✅ Volledig werkend met Supabase
- **package.json** - ✅ Supabase dependency toegevoegd
- **supabaseClient.js** - ✅ Utility helper aangemaakt

## 🔄 Te Migreren Components

### 1. **ThemesPage.js**
### 2. **ProjectsPage.js**  
### 3. **BrandingResourcesPage.js**
### 4. **SalesPage.js** (als die bestaat)
### 5. **Andere pages met localStorage**

## 🎯 Migration Pattern

Elk component volgt hetzelfde patroon. Hier is de template:

### Step 1: Update Imports

**VAN:**
```javascript
import dataStorage from '../utils/dataStorage';
import githubSync from '../utils/githubSync';
import GitHubSyncSetup from './GitHubSyncSetup';
```

**NAAR:**
```javascript
import { db } from '../utils/supabaseClient';
```

### Step 2: Update State

**VAN:**
```javascript
const [items, setItems] = useState(() => {
  return dataStorage.getItem('key', defaultItems);
});
const [syncStatus, setSyncStatus] = useState(null);
const [showSyncSetup, setShowSyncSetup] = useState(false);
const [lastSyncTime, setLastSyncTime] = useState(null);
```

**NAAR:**
```javascript
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [syncStatus, setSyncStatus] = useState(null);
```

### Step 3: Add Load Function

```javascript
useEffect(() => {
  loadItems();
}, []);

const loadItems = async () => {
  try {
    setLoading(true);
    const data = await db.themes.getAll(); // of .apps, .projects, etc.
    
    if (data.length === 0) {
      await seedDefaults();
    } else {
      setItems(data);
    }
  } catch (error) {
    console.error('Error loading:', error);
    setSyncStatus({ type: 'error', message: 'Fout bij laden' });
    setTimeout(() => setSyncStatus(null), 3000);
  } finally {
    setLoading(false);
  }
};

const seedDefaults = async () => {
  try {
    const promises = defaultItems.map(item => db.themes.create(item));
    const created = await Promise.all(promises);
    setItems(created);
  } catch (error) {
    console.error('Error seeding:', error);
    setItems(defaultItems); // Fallback
  }
};
```

### Step 4: Update CRUD Operations

**CREATE:**
```javascript
const addItem = async () => {
  try {
    const created = await db.themes.create(newItem);
    setItems([...items, created]);
    setSyncStatus({ type: 'success', message: 'Toegevoegd' });
    setTimeout(() => setSyncStatus(null), 3000);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**UPDATE:**
```javascript
const updateItem = async () => {
  try {
    await db.themes.update(editingItem.id, updates);
    setItems(items.map(i => i.id === editingItem.id ? { ...updates, id: editingItem.id } : i));
    setSyncStatus({ type: 'success', message: 'Bijgewerkt' });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**DELETE:**
```javascript
const deleteItem = async () => {
  try {
    await db.themes.delete(itemToDelete.id);
    setItems(items.filter(i => i.id !== itemToDelete.id));
    setSyncStatus({ type: 'success', message: 'Verwijderd' });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Step 5: Update UI - Verwijder GitHub Sync Elementen

**VERWIJDER:**
```javascript
{/* GitHub Sync Setup */}
{githubSync.isConfigured() ? (
  // ... GitHub sync UI
) : (
  // ... Setup button
)}
```

**VERVANG MET:**
```javascript
{/* Supabase Status */}
<div className="flex items-center gap-2 text-sm">
  <Database className="w-4 h-4 text-green-400" />
  <span className="text-white/70">
    {loading ? 'Laden...' : `${items.length} items in database`}
  </span>
  <button onClick={loadItems} className="text-blue-400 hover:text-blue-300">
    <RefreshCw className="w-4 h-4" />
  </button>
</div>
```

### Step 6: Add Loading State

```javascript
{loading ? (
  <div className="gradient-card rounded-xl p-12 text-center">
    <RefreshCw className="w-12 h-12 text-white/60 animate-spin" />
    <p className="text-white/70">Laden...</p>
  </div>
) : (
  // ... rest of content
)}
```

## 🔧 Specifieke Components

### ThemesPage.js

Database helper: `db.themes`

Wijzigingen:
1. Import `{ db }` instead of `dataStorage` and `githubSync`
2. Replace `dataStorage.getItem('shopify-dashboard-themes')` with `db.themes.getAll()`
3. Replace all CRUD operations met `db.themes.create/update/delete()`
4. Verwijder GitHub Sync UI componenten

### ProjectsPage.js

Database helper: `db.projects`

Wijzigingen:
- Zelfde patroon als themes
- Let op: Projects heeft mogelijk extra velden zoals `seo_score`, `deadline`, etc.

### BrandingResourcesPage.js

Database helper: `db.brandingResources`
Storage helper: `storage` (voor file uploads)

Extra voor file uploads:
```javascript
import { db, storage } from '../utils/supabaseClient';

// File upload
const handleFileUpload = async (file) => {
  try {
    // Upload naar Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    await storage.upload('branding-assets', fileName, file);
    
    // Get public URL
    const publicUrl = storage.getPublicUrl('branding-assets', fileName);
    
    // Save metadata in database
    const resource = {
      title: file.name,
      type: 'file',
      url: publicUrl,
      file_name: file.name,
      category: selectedCategory,
      file_size: file.size,
      mime_type: file.type
    };
    
    const created = await db.brandingResources.create(resource);
    setResources([...resources, created]);
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

## ⚠️ Belangrijk

1. **Verwijder NIET** de oude bestanden totdat alles werkt
2. **Test** elke component na migratie
3. **Check** de browser console voor errors
4. **Verify** data in Supabase Table Editor

## 🎯 Quick Checklist per Component

- [ ] Imports updated
- [ ] State updated
- [ ] `loadItems()` functie toegevoegd
- [ ] `seedDefaults()` functie toegevoegd
- [ ] CREATE operation async
- [ ] UPDATE operation async
- [ ] DELETE operation async
- [ ] GitHub Sync UI verwijderd
- [ ] Supabase status toegevoegd
- [ ] Loading state toegevoegd
- [ ] Getest in browser
- [ ] Data zichtbaar in Supabase

## 💡 Tips

- Gebruik AppsPage.js als referentie - die is volledig gemigreerd
- Test één component tegelijk
- Check de browser console voor foutmeldingen
- Gebruik Supabase Table Editor om data te verificeren

## 🚀 Na Migratie

1. Test alle CRUD operaties
2. Refresh de pagina - data blijft staan
3. Open in andere browser/incognito - data is er nog
4. Deel met collega - zij zien jouw data

## 📞 Hulp Nodig?

Check:
- Browser console (F12)
- Supabase logs in dashboard
- Network tab voor API calls
- `supabaseClient.js` voor helper functions
