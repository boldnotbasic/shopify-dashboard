class GitHubSync {
  constructor() {
    this.baseUrl = 'https://api.github.com/gists';
    this.gistId = localStorage.getItem('github-gist-id') || null;
    this.token = localStorage.getItem('github-token') || null;
  }

  // Setup GitHub token and create initial gist
  async setup(token) {
    this.token = token;
    localStorage.setItem('github-token', token);

    try {
      // Create initial gist if none exists
      if (!this.gistId) {
        const gist = await this.createGist();
        this.gistId = gist.id;
        localStorage.setItem('github-gist-id', gist.id);
        return { success: true, gistId: gist.id, url: gist.html_url };
      }
      return { success: true, gistId: this.gistId };
    } catch (error) {
      console.error('GitHub setup failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Create initial gist with default data
  async createGist() {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Shopify Dashboard - Themes & Apps Sync',
        public: false, // Private gist
        files: {
          'themes.json': {
            content: JSON.stringify([], null, 2)
          },
          'apps.json': {
            content: JSON.stringify([], null, 2)
          },
          'metadata.json': {
            content: JSON.stringify({
              lastSync: new Date().toISOString(),
              version: '1.0.0',
              description: 'Shopify Dashboard sync data'
            }, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create gist: ${response.statusText}`);
    }

    return await response.json();
  }

  // Sync data to GitHub Gist
  async syncToCloud(themes, apps) {
    if (!this.token || !this.gistId) {
      throw new Error('GitHub sync not configured. Run setup first.');
    }

    try {
      const metadata = {
        lastSync: new Date().toISOString(),
        version: '1.0.0',
        themesCount: themes.length,
        appsCount: apps.length
      };

      const response = await fetch(`${this.baseUrl}/${this.gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            'themes.json': {
              content: JSON.stringify(themes, null, 2)
            },
            'apps.json': {
              content: JSON.stringify(apps, null, 2)
            },
            'metadata.json': {
              content: JSON.stringify(metadata, null, 2)
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { 
        success: true, 
        lastSync: metadata.lastSync,
        url: result.html_url 
      };
    } catch (error) {
      console.error('Sync to cloud failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Load data from GitHub Gist
  async loadFromCloud() {
    if (!this.gistId) {
      return { success: false, error: 'No gist configured' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.gistId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.statusText}`);
      }

      const gist = await response.json();
      
      const themes = gist.files['themes.json'] 
        ? JSON.parse(gist.files['themes.json'].content) 
        : [];
      
      const apps = gist.files['apps.json'] 
        ? JSON.parse(gist.files['apps.json'].content) 
        : [];
        
      const metadata = gist.files['metadata.json'] 
        ? JSON.parse(gist.files['metadata.json'].content) 
        : {};

      return { 
        success: true, 
        themes, 
        apps, 
        metadata,
        url: gist.html_url 
      };
    } catch (error) {
      console.error('Load from cloud failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if sync is configured
  isConfigured() {
    return !!(this.token && this.gistId);
  }

  // Get sync status
  getStatus() {
    return {
      configured: this.isConfigured(),
      gistId: this.gistId,
      hasToken: !!this.token
    };
  }

  // Reset configuration
  reset() {
    this.token = null;
    this.gistId = null;
    localStorage.removeItem('github-token');
    localStorage.removeItem('github-gist-id');
  }

  // Get shareable URL
  getShareableUrl() {
    if (!this.gistId) return null;
    return `https://gist.github.com/${this.gistId}`;
  }
}

// Create singleton instance
const githubSync = new GitHubSync();

export default githubSync;
