import React, { useState } from 'react';
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
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, role, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('/')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                ChatterLink
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNav('/jobs')}
              className={`hover:text-slate-900 transition-colors ${
                currentPath === '/jobs' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Opportunités
            </button>
            <button
              onClick={() => handleNav('/#how-it-works')}
              className="hover:text-slate-900 transition-colors"
            >
              Comment ça marche
            </button>

            {/* Candidate specific links */}
            {user && role === 'CANDIDATE' && (
              <>
                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/dashboard' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Tableau de bord
                </button>
                <button
                  onClick={() => handleNav('/dashboard/profile')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/dashboard/profile' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Mon profil
                </button>
              </>
            )}

            {/* Admin specific links */}
            {user && role === 'ADMIN' && (
              <>
                <button
                  onClick={() => handleNav('/admin')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/admin' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => handleNav('/admin/jobs')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/admin/jobs' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Gestion des offres
                </button>
                <button
                  onClick={() => handleNav('/admin/applications')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/admin/applications' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Candidatures
                </button>
                <button
                  onClick={() => handleNav('/admin/candidates')}
                  className={`hover:text-slate-900 transition-colors ${
                    currentPath === '/admin/candidates' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  Candidats
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher helper */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                title="Tester rapidement l'un des deux rôles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Comptes Test</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-slate-400 font-medium border-b border-slate-100">
                    Connexion rapide démo
                  </div>
                  <button
                    onClick={async () => {
                      await loginAsDemo('candidate');
                      setDemoMenuOpen(false);
                      handleNav('/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Rôle : Candidat (Camille)</span>
                    <span className="text-slate-400 text-[10px]">Candidatures</span>
                  </button>
                  <button
                    onClick={async () => {
                      await loginAsDemo('admin');
                      setDemoMenuOpen(false);
                      handleNav('/admin');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Rôle : Administrateur</span>
                    <span className="text-indigo-600 text-[10px] font-semibold">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-800">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {role === 'ADMIN' ? 'Administrateur' : 'Candidat'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  title="Déconnexion"
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
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
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/jobs')}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
            >
              Opportunités de chatter
            </button>
            <button
              onClick={() => handleNav('/#how-it-works')}
              className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
            >
              Comment ça marche
            </button>

            {user && role === 'CANDIDATE' && (
              <>
                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-indigo-600 rounded-md hover:bg-slate-50"
                >
                  Mon tableau de bord
                </button>
                <button
                  onClick={() => handleNav('/dashboard/profile')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
                >
                  Mon profil de chatter
                </button>
              </>
            )}

            {user && role === 'ADMIN' && (
              <>
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-indigo-600 rounded-md hover:bg-slate-50"
                >
                  Espace Administration
                </button>
                <button
                  onClick={() => handleNav('/admin/jobs')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
                >
                  Gestion des offres
                </button>
                <button
                  onClick={() => handleNav('/admin/applications')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
                >
                  Candidatures reçues
                </button>
                <button
                  onClick={() => handleNav('/admin/candidates')}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-slate-800 rounded-md hover:bg-slate-50"
                >
                  Liste des candidats
                </button>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {/* Quick Demo switcher for mobile */}
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await loginAsDemo('candidate');
                  handleNav('/dashboard');
                }}
                className="flex-1 py-1.5 text-center text-xs border border-slate-200 rounded bg-slate-50 text-slate-700"
              >
                Démo Candidat
              </button>
              <button
                onClick={async () => {
                  await loginAsDemo('admin');
                  handleNav('/admin');
                }}
                className="flex-1 py-1.5 text-center text-xs border border-slate-200 rounded bg-slate-50 text-slate-700 font-semibold"
              >
                Démo Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {role === 'ADMIN' ? 'Administrateur' : 'Candidat'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    handleNav('/');
                  }}
                  className="text-xs text-rose-600 font-medium py-1 px-2 hover:bg-rose-50 rounded"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2 text-center text-xs font-medium text-slate-700 border border-slate-300 rounded-lg"
                >
                  Connexion
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2 text-center text-xs font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Inscription
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
