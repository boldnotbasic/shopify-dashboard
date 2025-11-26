import React, { useState, useEffect } from 'react';
import { Github, Key, Link, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import githubSync from '../utils/githubSync';

const GitHubSyncSetup = ({ onSetupComplete }) => {
  const [token, setToken] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [status, setStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState(githubSync.getStatus());

  useEffect(() => {
    setSyncStatus(githubSync.getStatus());
  }, []);

  const handleSetup = async () => {
    if (!token.trim()) {
      setStatus({ success: false, message: 'Voer een GitHub token in' });
      return;
    }

    setIsConfiguring(true);
    setStatus(null);

    try {
      const result = await githubSync.setup(token.trim());
      
      if (result.success) {
        setStatus({ 
          success: true, 
          message: 'GitHub sync geconfigureerd!',
          gistUrl: result.url 
        });
        setSyncStatus(githubSync.getStatus());
        if (onSetupComplete) onSetupComplete(result);
      } else {
        setStatus({ success: false, message: result.error });
      }
    } catch (error) {
      setStatus({ success: false, message: error.message });
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleReset = () => {
    githubSync.reset();
    setSyncStatus(githubSync.getStatus());
    setToken('');
    setStatus(null);
  };

  const shareableUrl = githubSync.getShareableUrl();

  if (syncStatus.configured) {
    return (
      <div className="glass-effect rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">GitHub Sync Actief</h3>
        </div>
        
        <div className="space-y-3 text-sm text-white/70">
          <div>
            <span className="font-medium text-white">Status:</span> Geconfigureerd en klaar voor sync
          </div>
          <div>
            <span className="font-medium text-white">Gist ID:</span> {syncStatus.gistId}
          </div>
          {shareableUrl && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">Deel met team:</span>
              <a 
                href={shareableUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Link className="w-3 h-3" />
                Bekijk Gist
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={handleReset}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Sync configuratie resetten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Github className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">GitHub Sync Setup</h3>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-white/70">
          <p className="mb-2">
            Configureer GitHub sync om themes en apps automatisch te synchroniseren tussen computers.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-300 font-medium mb-2">Hoe een GitHub token maken:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-200">
              <li>Ga naar GitHub.com → Settings → Developer settings</li>
              <li>Klik "Personal access tokens" → "Tokens (classic)"</li>
              <li>Klik "Generate new token (classic)"</li>
              <li>Geef een naam en selecteer "gist" permission</li>
              <li>Kopieer de token en plak hieronder</li>
            </ol>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {status && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            status.success 
              ? 'bg-green-500/10 border border-green-500/20 text-green-300' 
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
          }`}>
            {status.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        <button
          onClick={handleSetup}
          disabled={isConfiguring || !token.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isConfiguring ? 'Configureren...' : 'GitHub Sync Activeren'}
        </button>
      </div>
    </div>
  );
};

export default GitHubSyncSetup;
