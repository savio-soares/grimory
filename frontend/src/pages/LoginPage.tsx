import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ParticleBackground } from '../components/ParticleBackground';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ParticleBackground progress={50} />
      
      <div className="mystic-card p-8 rounded-xl w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 cinzel mb-2">
            Guardian's Grimoire
          </h1>
          <p className="text-sm text-amber-500 tracking-widest uppercase">
            Evolution Protocol
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-4" />
        </div>

        {/* Citação */}
        <blockquote className="text-center text-gray-500 italic text-sm mb-8">
          "Fear is good. The fear of staying in a messy life must be greater than the laziness to change."
          <footer className="text-amber-600 mt-1">— Klein Moretti</footer>
        </blockquote>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
              Guardian's Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-amber-600 transition-colors"
              placeholder="guardian@grimoire.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
              Arcane Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-amber-600 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-900 to-red-900 hover:from-amber-800 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Entering...
              </span>
            ) : (
              'Enter the Grimoire'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            "You are a fraud. Accept it. You're pretending to be organized."
          </p>
          <p className="text-xs text-amber-700 mt-1">
            One day, the mask sticks to the face and becomes truth.
          </p>
        </div>
      </div>
    </div>
  );
}
