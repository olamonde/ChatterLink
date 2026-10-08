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
  Send,
  CheckCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ApplicationStatusBadge, Badge } from '../components/ui/Badge.js';
import { StatCard } from '../components/ui/StatCard.js';
import { EmptyState } from '../components/ui/EmptyState.js';

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6 bg-[#050505]">
        <div className="h-8 bg-[#1f1f1f] rounded w-1/4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#181818] rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 bg-[#050505] text-slate-100">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <Badge variant="indigo" size="sm">
            Espace Candidat
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Bonjour, {user?.firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Suivez l'état de vos candidatures et découvrez les missions sélectionnées pour vous.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-[#161616] border border-white/10 rounded-xl hover:bg-[#202020] transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Mon profil</span>
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Explorer les offres</span>
          </button>
        </div>
      </div>

      {/* Profile completion notice */}
      {!profileCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-800/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">
                Optimisez vos chances de sélection
              </span>
              <p className="text-amber-200/80 text-xs mt-0.5 leading-relaxed">
                Complétez votre bio et vos compétences clés pour valoriser immédiatement votre
                profil auprès de l'administrateur.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 self-start sm:self-auto transition-all shadow-md cursor-pointer"
          >
            Compléter mon profil
          </button>
        </motion.div>
      )}

      {/* 4 Animated Modern Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Candidatures envoyées"
          value={stats.total}
          sublabel="Toutes offres confondues"
          icon={Send}
          variant="slate"
        />
        <StatCard
          label="En cours d'examen"
          value={stats.pending}
          sublabel="En étude par l'admin"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          label="Présélectionnées"
          value={stats.shortlisted}
          sublabel="Dossiers retenus"
          icon={Sparkles}
          variant="indigo"
        />
        <StatCard
          label="Missions acceptées"
          value={stats.accepted}
          sublabel="Candidatures validées"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Section: Mes Candidatures (Dark Premium Table) */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-xl space-y-0">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display">Mes candidatures</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historique et suivi en temps réel de vos démarches
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">
            {applications.length} candidature(s)
          </span>
        </div>

        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-slate-400 border-b border-white/5 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Offre ciblée</th>
                  <th className="py-3.5 px-6">Date de soumission</th>
                  <th className="py-3.5 px-6">Rémunération</th>
                  <th className="py-3.5 px-6">Statut actuel</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {applications.map((app) => {
                  const dateStr = new Date(app.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-bold text-white line-clamp-1">
                          {app.job?.title || 'Offre'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {app.job?.workType} · {app.job?.workingHours}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums text-slate-400">{dateStr}</td>

                      <td className="py-4 px-6 font-semibold text-white">
                        {app.job?.compensation || 'Non spécifiée'}
                      </td>

                      <td className="py-4 px-6">
                        <ApplicationStatusBadge status={app.status} size="md" />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/jobs/${app.jobId}`)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Voir détails</span>
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
          <div className="p-12">
            <EmptyState
              icon={FileText}
              title="Aucune candidature en cours"
              description="Vous n'avez pas encore postulé à une offre. Consultez les missions publiées et envoyez votre première candidature."
              actionLabel="Découvrir les offres"
              onAction={() => navigate('/jobs')}
            />
          </div>
        )}
      </div>

      {/* Section: Offres Recommandées */}
      {recommendedJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white font-display">
                Missions recommandées pour votre profil
              </h2>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Voir tout →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-xl transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    {job.beginnerFriendly && (
                      <Badge variant="success" size="sm" dot>
                        Débutant
                      </Badge>
                    )}
                    <Badge variant="neutral" size="sm">
                      {job.workType}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="text-xs font-bold text-white pt-1">{job.compensation}</div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5">
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-[#181818] hover:bg-white hover:text-slate-900 rounded-xl text-center border border-white/10 transition-all cursor-pointer"
                  >
                    Consulter l'offre
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
