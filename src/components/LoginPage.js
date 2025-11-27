import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username.trim().toLowerCase() === 'gijs.vandromme' && password === 'DashDashShop876!') {
      localStorage.setItem('shopify-dashboard-logged-in', 'true');
      setIsLoggedIn(true);
    } else {
      setError('Ongeldige gebruikersnaam of wachtwoord');
    }
    
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/Logo_meteor_def.svg"
              alt="METEOR logo"
              className="h-48 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="gradient-card rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-white text-xl font-semibold mb-2">Welkom terug</h2>
            <p className="text-white/70 text-sm">Log in om toegang te krijgen tot het dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Gebruikersnaam</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Voer je gebruikersnaam in"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Wachtwoord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Voer je wachtwoord in"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-lg text-white font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Inloggen...</span>
                </>
              ) : (
                <span>Inloggen</span>
              )}
            </button>
          </form>
          
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-xs">© 2025 METEOR DIGITAL NV</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
