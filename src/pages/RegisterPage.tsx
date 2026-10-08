import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe saisis ne sont pas identiques.');
      return;
    }

    setLoading(true);
    const res = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard/profile');
    } else {
      setError(res.error || 'Erreur lors de l’inscription.');
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
            <span>Rejoignez le vivier ChatterLink</span>
          </div>

          <h2 className="text-2xl font-bold font-display leading-snug text-white">
            Commencez à postuler dès aujourd'hui auprès de créatrices vérifiées.
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Complétez votre profil en quelques minutes et mettez en avant votre motivation, votre
            orthographe et vos créneaux horaires préférés.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% télétravail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Réponse sous 48h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Créer mon compte candidat
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Inscrivez-vous gratuitement pour découvrir les missions et postuler
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Prénom</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Camille"
                  className="w-full px-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Nom</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dufresne"
                  className="w-full px-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
            </div>

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
                  placeholder="8 caractères minimum"
                  className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full pl-10 pr-3.5 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm transition-all bg-[#181818] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? 'Création de votre compte...' : 'Créer mon compte candidat'}
              </button>
            </div>
          </form>

          <div className="text-center pt-3 border-t border-white/10 text-xs text-slate-400">
            Vous disposez déjà d'un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
