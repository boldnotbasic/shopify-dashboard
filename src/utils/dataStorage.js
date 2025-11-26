// Enhanced data storage utility with backup functionality
class DataStorage {
  constructor() {
    this.BACKUP_PREFIX = 'backup_';
    this.MAX_BACKUPS = 5; // Keep last 5 backups
  }

  // Enhanced localStorage with automatic backup
  setItem(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      
      // Save to localStorage
      localStorage.setItem(key, jsonData);
      
      // Create automatic backup with timestamp
      this.createBackup(key, data);
      
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  }

  // Enhanced getItem with fallback to backup
  getItem(key, defaultValue = null) {
    try {
      // Try to get from localStorage first
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      
      // If not found, try to restore from latest backup
      const backupData = this.getLatestBackup(key);
      if (backupData) {
        console.log(`Restored ${key} from backup`);
        // Restore to localStorage
        this.setItem(key, backupData);
        return backupData;
      }
      
      return defaultValue;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      
      // Try backup as last resort
      const backupData = this.getLatestBackup(key);
      if (backupData) {
        console.log(`Restored ${key} from backup after error`);
        return backupData;
      }
      
      return defaultValue;
    }
  }

  // Create backup with timestamp
  createBackup(key, data) {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `${this.BACKUP_PREFIX}${key}_${timestamp}`;
      
      const backupData = {
        originalKey: key,
        timestamp: timestamp,
        data: data
      };
      
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Clean old backups
      this.cleanOldBackups(key);
    } catch (error) {
      console.error(`Error creating backup for ${key}:`, error);
    }
  }

  // Get latest backup for a key
  getLatestBackup(key) {
    try {
      const backups = this.getAllBackups(key);
      if (backups.length > 0) {
        // Sort by timestamp and get latest
        backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return backups[0].data;
      }
      return null;
    } catch (error) {
      console.error(`Error getting latest backup for ${key}:`, error);
      return null;
    }
  }

  // Get all backups for a key
  getAllBackups(key) {
    const backups = [];
    const prefix = `${this.BACKUP_PREFIX}${key}_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(prefix)) {
        try {
          const backupData = JSON.parse(localStorage.getItem(storageKey));
          backups.push(backupData);
        } catch (error) {
          console.error(`Error parsing backup ${storageKey}:`, error);
        }
      }
    }
    
    return backups;
  }

  // Clean old backups, keep only MAX_BACKUPS
  cleanOldBackups(key) {
    try {
      const backups = this.getAllBackups(key);
      if (backups.length > this.MAX_BACKUPS) {
        // Sort by timestamp
        backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Remove old backups
        const toRemove = backups.slice(this.MAX_BACKUPS);
        toRemove.forEach(backup => {
          const backupKey = `${this.BACKUP_PREFIX}${key}_${backup.timestamp}`;
          localStorage.removeItem(backupKey);
        });
      }
    } catch (error) {
      console.error(`Error cleaning old backups for ${key}:`, error);
    }
  }

  // Export data to JSON file
  exportToFile(key, filename) {
    try {
      const data = this.getItem(key);
      if (!data) {
        throw new Error('No data found to export');
      }

      const exportData = {
        key: key,
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: data
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `${key}_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error(`Error exporting ${key}:`, error);
      return false;
    }
  }

  // Import data from JSON file
  importFromFile(key, file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          // Validate import data structure
          if (!importData.data || !importData.key) {
            throw new Error('Invalid backup file format');
          }
          
          // Save imported data
          const success = this.setItem(key, importData.data);
          if (success) {
            resolve({
              success: true,
              data: importData.data,
              importDate: importData.exportDate,
              recordCount: Array.isArray(importData.data) ? importData.data.length : Object.keys(importData.data).length
            });
          } else {
            throw new Error('Failed to save imported data');
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }

  // Get storage statistics
  getStorageStats(key) {
    try {
      const data = this.getItem(key);
      const backups = this.getAllBackups(key);
      
      return {
        hasData: !!data,
        recordCount: data ? (Array.isArray(data) ? data.length : Object.keys(data).length) : 0,
        backupCount: backups.length,
        lastBackup: backups.length > 0 ? backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp : null,
        storageSize: this.getStorageSize(key)
      };
    } catch (error) {
      console.error(`Error getting storage stats for ${key}:`, error);
      return {
        hasData: false,
        recordCount: 0,
        backupCount: 0,
        lastBackup: null,
        storageSize: 0
      };
    }
  }

  // Get approximate storage size for a key
  getStorageSize(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      return 0;
    }
  }

  // Clear all data and backups for a key
  clearAll(key) {
    try {
      // Remove main data
      localStorage.removeItem(key);
      
      // Remove all backups
      const backups = this.getAllBackups(key);
      backups.forEach(backup => {
        const backupKey = `${this.BACKUP_PREFIX}${key}_${backup.timestamp}`;
        localStorage.removeItem(backupKey);
      });
      
      return true;
    } catch (error) {
      console.error(`Error clearing all data for ${key}:`, error);
      return false;
    }
  }
}

// Create singleton instance
const dataStorage = new DataStorage();

export default dataStorage;
