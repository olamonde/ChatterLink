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
          <div className="max-w-md mx-auto my-20 p-8 bg-white border border-rose-200 rounded-xl text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Accès Administrateur Refusé</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Votre compte actuel ({user.email}) dispose du rôle <strong>CANDIDAT</strong>.
              L'administration est exclusivement réservée au propriétaire de la plateforme.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
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
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Page non trouvée (404)</h2>
        <p className="text-xs text-slate-600">L'adresse demandée n'existe pas sur ChatterLink.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer navigate={navigate} />
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
