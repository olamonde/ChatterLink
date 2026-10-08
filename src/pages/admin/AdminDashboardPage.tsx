import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import type { AdminStats, Application } from '../../types/index.js';
import {
  Users,
  Briefcase,
  FileCheck,
  Clock,
  PlusCircle,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
  Search,
  Sparkles,
  Inbox,
  Activity,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ApplicationStatusBadge, Badge } from '../../components/ui/Badge.js';
import { StatCard } from '../../components/ui/StatCard.js';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { token, role } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error(err));

    fetch('/api/admin/applications', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) {
          setRecentApplications(data.applications.slice(0, 5));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRecentApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
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
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-800/60">
            <Shield className="w-3.5 h-3.5" />
            <span>Console Propriétaire ChatterLink</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Tableau de bord de recrutement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pilotez les missions transmises par les créatrices et gérez le vivier de candidats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all inline-flex items-center gap-2 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une offre</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Grid with modern StatCards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Candidats inscrits"
            value={stats.totalCandidates}
            sublabel="Vivier qualifié"
            icon={Users}
            variant="slate"
            onClick={() => navigate('/admin/candidates')}
          />
          <StatCard
            label="Offres publiées"
            value={stats.publishedJobs}
            sublabel={`${stats.draftJobs} brouillons · ${stats.closedJobs} fermées`}
            icon={Briefcase}
            variant="emerald"
            onClick={() => navigate('/admin/jobs')}
          />
          <StatCard
            label="Candidatures totales"
            value={stats.totalApplications}
            sublabel="Toutes offres"
            icon={FileCheck}
            variant="slate"
            onClick={() => navigate('/admin/applications')}
          />
          <StatCard
            label="À examiner"
            value={stats.pendingApplications}
            sublabel="Priorité de traitement"
            icon={Clock}
            variant="amber"
            onClick={() => navigate('/admin/applications')}
          />
          <StatCard
            label="Retenues / Validées"
            value={stats.shortlistedApplications + stats.acceptedApplications}
            sublabel={`${stats.acceptedApplications} validées`}
            icon={CheckCircle2}
            variant="indigo"
          />
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/admin/jobs')}
          className="bg-[#111111] border border-white/10 p-6 rounded-3xl hover:border-white/20 hover:shadow-2xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
              Gestion des offres
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Créer, éditer, publier ou clôturer les annonces de recrutement de chatters.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/applications')}
          className="bg-[#111111] border border-white/10 p-6 rounded-3xl hover:border-white/20 hover:shadow-2xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
              Candidatures reçues
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/50">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Examiner les dossiers des candidats, motivations et changer leur statut.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/candidates')}
          className="bg-[#111111] border border-white/10 p-6 rounded-3xl hover:border-white/20 hover:shadow-2xl cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
              Vivier de candidats
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consulter les profils, compétences, langues et disponibilités des chatters.
          </p>
        </div>
      </div>

      {/* Latest Received Applications Section */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Dernières candidatures à examiner
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Traitez les candidatures récentes et mettez à jour leur statut en direct
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/applications')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            Voir les {stats?.totalApplications || 0} candidatures →
          </button>
        </div>

        {recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-slate-400 border-b border-white/5 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Candidat</th>
                  <th className="py-3.5 px-6">Offre ciblée</th>
                  <th className="py-3.5 px-6">Expérience / Langues</th>
                  <th className="py-3.5 px-6">Statut actuel</th>
                  <th className="py-3.5 px-6 text-right">Modifier statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {recentApplications.map((app) => {
                  return (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">
                          {app.candidate?.firstName} {app.candidate?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                      </td>

                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-semibold text-white truncate">
                          {app.job?.title || 'Offre'}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300">
                        <div>{app.candidateSnapshot.chatterExperience}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.candidateSnapshot.languages.map((l) => l.language).join(', ')}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <ApplicationStatusBadge status={app.status} size="md" />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="py-1.5 px-2.5 border border-white/10 rounded-xl text-xs bg-[#181818] text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="RECEIVED">Reçue</option>
                          <option value="REVIEWING">En cours d'examen</option>
                          <option value="SHORTLISTED">Présélectionnée</option>
                          <option value="ACCEPTED">Acceptée</option>
                          <option value="REJECTED">Refusée</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucune candidature reçue pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};
