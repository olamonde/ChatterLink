import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { JobsPage } from './pages/JobsPage.js';
import { JobDetailPage } from './pages/JobDetailPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage.js';
import { CandidateProfilePage } from './pages/CandidateProfilePage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminJobsPage } from './pages/admin/AdminJobsPage.js';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage.js';
import { AdminCandidatesPage } from './pages/admin/AdminCandidatesPage.js';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, role, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  // Handle URL changes & back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/#')) {
      // Anchor scroll
      const id = path.substring(2);
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Route matching helper
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    // 2. Jobs listing
    if (currentPath === '/jobs') {
      return <JobsPage navigate={navigate} />;
    }

    // 3. Job detail (/jobs/:id)
    if (currentPath.startsWith('/jobs/')) {
      const jobId = currentPath.replace('/jobs/', '');
      return <JobDetailPage jobId={jobId} navigate={navigate} />;
    }

    // 4. Login
    if (currentPath === '/login') {
      if (user) {
        if (role === 'ADMIN') return <AdminDashboardPage navigate={navigate} />;
        return <CandidateDashboardPage navigate={navigate} />;
      }
      return <LoginPage navigate={navigate} />;
    }

    // 5. Register
    if (currentPath === '/register') {
      if (user) {
        if (role === 'ADMIN') return <AdminDashboardPage navigate={navigate} />;
        return <CandidateDashboardPage navigate={navigate} />;
      }
      return <RegisterPage navigate={navigate} />;
    }

    // 6. Candidate Dashboard (/dashboard)
    if (currentPath === '/dashboard') {
      if (isLoading) return <LoadingSpinner />;
      if (!user) {
        return <LoginPage navigate={navigate} />;
      }
      if (role === 'ADMIN') {
        return <AdminDashboardPage navigate={navigate} />;
      }
      return <CandidateDashboardPage navigate={navigate} />;
    }

    // 7. Candidate Profile (/dashboard/profile)
    if (currentPath === '/dashboard/profile') {
      if (isLoading) return <LoadingSpinner />;
      if (!user) {
        return <LoginPage navigate={navigate} />;
      }
      if (role === 'ADMIN') {
        return <AdminDashboardPage navigate={navigate} />;
      }
      return <CandidateProfilePage navigate={navigate} />;
    }

    // 8. Admin Routes (Strict Admin protection)
    if (currentPath.startsWith('/admin')) {
      if (isLoading) return <LoadingSpinner />;
      if (!user) {
        return <LoginPage navigate={navigate} />;
      }
      if (role !== 'ADMIN') {
        return (
          <div className="max-w-md mx-auto my-20 p-8 bg-[#111111] border border-rose-900/40 rounded-2xl text-center space-y-4 shadow-xl">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-white font-display">Accès Administrateur Refusé</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Votre compte actuel ({user.email}) dispose du rôle <strong className="text-slate-200">CANDIDAT</strong>.
              L'administration est exclusivement réservée au propriétaire de la plateforme.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Mon espace candidat
              </button>
            </div>
          </div>
        );
      }

      if (currentPath === '/admin' || currentPath === '/admin/') {
        return <AdminDashboardPage navigate={navigate} />;
      }
      if (currentPath === '/admin/jobs') {
        return <AdminJobsPage navigate={navigate} />;
      }
      if (currentPath.startsWith('/admin/applications')) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('jobId') || undefined;
        return <AdminApplicationsPage navigate={navigate} initialJobId={jobId} />;
      }
      if (currentPath === '/admin/candidates') {
        return <AdminCandidatesPage navigate={navigate} />;
      }
    }

    // 404 Not Found fallback
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-[#111111] border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white font-display">Page non trouvée (404)</h2>
        <p className="text-xs text-slate-400">L'adresse demandée n'existe pas sur ChatterLink.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-100 font-sans relative selection:bg-indigo-600 selection:text-white">
      {/* Dark premium atmospheric depth layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Deep subtle ambient glows */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[550px] bg-gradient-to-b from-indigo-950/20 via-violet-950/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] -left-[10%] w-[45vw] max-w-[600px] h-[600px] bg-indigo-950/15 blur-[160px] rounded-full" />
        <div className="absolute top-[70%] -right-[10%] w-[45vw] max-w-[600px] h-[600px] bg-slate-900/30 blur-[150px] rounded-full" />
        {/* Subtle dark texture grid */}
        <div className="absolute inset-0 bg-grid-subtle opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <main className="flex-1">{renderRoute()}</main>
        <Footer navigate={navigate} />
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="text-xs font-medium text-slate-400 animate-pulse">
      Chargement de ChatterLink...
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
