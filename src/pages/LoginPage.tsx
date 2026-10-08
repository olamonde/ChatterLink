import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Determine where to redirect: check auth state or fetch directly
      try {
        const check = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('chatterlink_token')}`,
          },
        });
        const data = await check.json();
        if (data.user?.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch {
        navigate('/dashboard');
      }
    } else {
      setError(res.error || 'Erreur lors de la connexion.');
    }
  };

  const handleDemo = async (type: 'admin' | 'candidate') => {
    setLoading(true);
    await loginAsDemo(type);
    setLoading(false);
    if (type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-xl shadow-xs">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Connexion à ChatterLink
          </h1>
          <p className="text-xs text-slate-500">
            Accédez à vos candidatures ou à votre tableau de bord
          </p>
        </div>

        {/* Demo Fast Access Buttons for immediate testing */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
            Accès d'évaluation rapide (1-clic)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemo('candidate')}
              disabled={loading}
              className="py-2 px-3 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidat démo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="py-2 px-3 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin démo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Pas encore de compte candidat ?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};
