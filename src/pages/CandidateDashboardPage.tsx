import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import type { Application, Job } from '../types/index.js';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  User,
  AlertCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface CandidateDashboardPageProps {
  navigate: (path: string) => void;
}

export const CandidateDashboardPage: React.FC<CandidateDashboardPageProps> = ({ navigate }) => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
  });
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Fetch dashboard overview
    fetch('/api/candidate/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.recommendedJobs) setRecommendedJobs(data.recommendedJobs);
        setProfileCompleted(!!data.profileCompleted);
      })
      .catch((err) => console.error(err));

    // Fetch full application history
    fetch('/api/candidate/applications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplications(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Envoyée</span>
          </span>
        );
      case 'REVIEWING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>En cours d'examen</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>Présélectionnée</span>
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acceptée</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Refusée</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Suivez l'avancement de vos candidatures et découvrez les offres adaptées à votre profil.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Modifier mon profil</span>
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Trouver une offre</span>
          </button>
        </div>
      </div>

      {/* Profile completion notice */}
      {!profileCompleted && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Complétez votre profil de chatter :</span> Renseignez
              vos compétences et votre bio pour valoriser vos candidatures auprès des créatrices.
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-xs shrink-0 self-start sm:self-auto transition-colors"
          >
            Compléter maintenant
          </button>
        </div>
      )}

      {/* 4 Quantitative Metric Cards (Zero-pill discipline, tabular nums) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1">
          <div className="text-xs text-slate-500">Total candidatures</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">{stats.total}</div>
          <div className="text-[11px] text-slate-400">Toutes offres confondues</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1">
          <div className="text-xs text-slate-500">En cours d'examen</div>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">{stats.pending}</div>
          <div className="text-[11px] text-slate-400">Étudiées par l'administrateur</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1">
          <div className="text-xs text-slate-500">Présélectionnées</div>
          <div className="text-2xl font-bold text-indigo-600 tabular-nums">{stats.shortlisted}</div>
          <div className="text-[11px] text-slate-400">Dossiers retenus</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1">
          <div className="text-xs text-slate-500">Acceptées</div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{stats.accepted}</div>
          <div className="text-[11px] text-slate-400">Missions confirmées</div>
        </div>
      </div>

      {/* Section: Mes Candidatures */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Mes candidatures</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi en temps réel de vos démarches auprès de la plateforme
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {applications.length} candidature(s)
          </span>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Offre de chatter</th>
                  <th className="py-3 px-6">Date d'envoi</th>
                  <th className="py-3 px-6">Rémunération</th>
                  <th className="py-3 px-6">Statut actuel</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => {
                  const dateStr = new Date(app.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900 max-w-xs truncate">
                        {app.job?.title || 'Offre'}
                      </td>
                      <td className="py-4 px-6 tabular-nums text-slate-500">{dateStr}</td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {app.job?.compensation || 'Non spécifiée'}
                      </td>
                      <td className="py-4 px-6">{renderStatusBadge(app.status)}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/jobs/${app.jobId}`)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                        >
                          <span>Voir l'offre</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">
                Vous n'avez pas encore postulé
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Explorez les opportunités actuellement ouvertes et envoyez votre première
                candidature en quelques clics.
              </p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Découvrir les opportunités</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Section: Opportunités Recommandées */}
      {recommendedJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Opportunités recommandées pour vous</span>
            </h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Voir tout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{job.workType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.requiredExperience}</span>
                    {job.beginnerFriendly && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 font-medium">Débutant</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-800 pt-1">
                    {job.compensation}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full py-1.5 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded text-center border border-slate-200"
                  >
                    Voir l'offre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
