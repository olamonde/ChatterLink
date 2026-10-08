import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-[#050505] text-slate-100">
      {/* Left Column: Visual Showcase on Desktop */}
      <div className="hidden lg:block lg:col-span-5 relative bg-[#0a0a0a] overflow-hidden border-r border-white/10">
        <img
          src="/src/assets/images/auth_creative_community_1791468568184.jpg"
          alt="Créatrice digitale professionnelle"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75 saturate-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 self-start">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Réseau de chatters professionnels</span>
          </div>

          <h2 className="text-2xl font-bold font-display leading-snug text-white">
            Accédez aux meilleures opportunités de chatter en direct.
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Télétravail garanti, missions vérifiées et contact personnalisé avec l'administrateur de
            la plateforme.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Accès gratuit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Débutants acceptés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-7"
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Connexion à ChatterLink
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Renseignez vos identifiants pour accéder à votre espace
            </p>
          </div>

          {/* Quick Demo Fast Access Box */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Accès démo immédiat (1 clic)
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemo('candidate')}
                disabled={loading}
                className="py-2.5 px-3 border border-white/10 bg-[#181818] hover:bg-[#222222] rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Candidat démo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                disabled={loading}
                className="py-2.5 px-3 border border-white/10 bg-[#181818] hover:bg-[#222222] rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin démo</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter à mon compte'}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-white/10 text-xs text-slate-400">
            Vous n'avez pas encore de compte ?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Créer mon compte candidat
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
