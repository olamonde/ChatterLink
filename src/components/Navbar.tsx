import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Menu,
  X,
  User as UserIcon,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, role, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDemoMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-[#050505]/75 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand mark */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xs group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all">
                <MessageCircle className="w-4 h-4 fill-white/20 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors font-display">
                ChatterLink
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <button
                onClick={() => handleNav('/jobs')}
                className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                  currentPath === '/jobs' ? 'text-white font-semibold' : ''
                }`}
              >
                Opportunités
                {currentPath === '/jobs' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => handleNav('/#how-it-works')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Comment ça marche
              </button>

              {/* Candidate links */}
              {user && role === 'CANDIDATE' && (
                <>
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/dashboard' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Tableau de bord
                    {currentPath === '/dashboard' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => handleNav('/dashboard/profile')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/dashboard/profile' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Mon profil
                    {currentPath === '/dashboard/profile' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                    )}
                  </button>
                </>
              )}

              {/* Admin links */}
              {user && role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => handleNav('/admin')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/admin' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Vue d'ensemble
                  </button>
                  <button
                    onClick={() => handleNav('/admin/jobs')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/admin/jobs' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Offres
                  </button>
                  <button
                    onClick={() => handleNav('/admin/applications')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/admin/applications' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Candidatures
                  </button>
                  <button
                    onClick={() => handleNav('/admin/candidates')}
                    className={`relative py-1 hover:text-white transition-colors cursor-pointer ${
                      currentPath === '/admin/candidates' ? 'text-white font-semibold' : ''
                    }`}
                  >
                    Candidats
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Action cluster on desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-white/10 bg-[#121212] hover:bg-[#181818] transition-all cursor-pointer shadow-2xs"
                title="Tester rapidement l'un des deux rôles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tester en 1 clic</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {demoMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[#111111] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 text-xs"
                    onMouseLeave={() => setDemoMenuOpen(false)}
                  >
                    <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Comptes de démonstration
                    </div>
                    <button
                      onClick={async () => {
                        await loginAsDemo('candidate');
                        setDemoMenuOpen(false);
                        handleNav('/dashboard');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#1a1a1a] flex items-center justify-between text-slate-300 hover:text-white group transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-white group-hover:text-indigo-400">
                          Candidat (Camille)
                        </div>
                        <div className="text-[11px] text-slate-400">Voir espace candidat</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
                    </button>
                    <button
                      onClick={async () => {
                        await loginAsDemo('admin');
                        setDemoMenuOpen(false);
                        handleNav('/admin');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#1a1a1a] flex items-center justify-between text-slate-300 hover:text-white group transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-white group-hover:text-indigo-400">
                          Administrateur
                        </div>
                        <div className="text-[11px] text-slate-400">Gérer offres & candidatures</div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {role === 'ADMIN' ? 'Administrateur' : 'Candidat'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  title="Déconnexion"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Créer un compte
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-[#0b0b0b]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 overflow-hidden shadow-2xl"
          >
            <div className="space-y-1">
              <button
                onClick={() => handleNav('/jobs')}
                className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                Opportunités de chatter
              </button>
              <button
                onClick={() => handleNav('/#how-it-works')}
                className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                Comment ça marche
              </button>

              {user && role === 'CANDIDATE' && (
                <>
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-indigo-400 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Mon tableau de bord
                  </button>
                  <button
                    onClick={() => handleNav('/dashboard/profile')}
                    className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Mon profil de chatter
                  </button>
                </>
              )}

              {user && role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left py-2.5 px-3 text-sm font-semibold text-indigo-400 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Espace Administration
                  </button>
                  <button
                    onClick={() => handleNav('/admin/jobs')}
                    className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Gestion des offres
                  </button>
                  <button
                    onClick={() => handleNav('/admin/applications')}
                    className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Candidatures reçues
                  </button>
                  <button
                    onClick={() => handleNav('/admin/candidates')}
                    className="w-full text-left py-2.5 px-3 text-sm font-medium text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    Liste des candidats
                  </button>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await loginAsDemo('candidate');
                    handleNav('/dashboard');
                  }}
                  className="flex-1 py-2 text-center text-xs border border-white/10 rounded-xl bg-[#141414] text-slate-200 font-medium cursor-pointer"
                >
                  Démo Candidat
                </button>
                <button
                  onClick={async () => {
                    await loginAsDemo('admin');
                    handleNav('/admin');
                  }}
                  className="flex-1 py-2 text-center text-xs border border-white/10 rounded-xl bg-[#141414] text-slate-200 font-semibold cursor-pointer"
                >
                  Démo Admin
                </button>
              </div>

              {user ? (
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {role === 'ADMIN' ? 'Administrateur' : 'Candidat'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      handleNav('/');
                    }}
                    className="text-xs text-rose-400 font-medium py-1 px-2.5 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleNav('/login')}
                    className="w-full py-2.5 text-center text-xs font-medium text-slate-200 border border-white/10 bg-[#141414] rounded-xl cursor-pointer"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => handleNav('/register')}
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-900 bg-white rounded-xl cursor-pointer"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
