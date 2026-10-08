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
} from 'lucide-react';

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

    // Fetch stats
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error(err));

    // Fetch recent applications
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
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Espace d'Administration Propriétaire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tableau de bord de recrutement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les offres transmises par les créatrices et pilotez le vivier de candidats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une offre</span>
          </button>
        </div>
      </div>

      {/* Real Statistics Grid (Tabular nums) */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-xs">
            <div className="text-xs text-slate-500">Candidats inscrits</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {stats.totalCandidates}
            </div>
            <button
              onClick={() => navigate('/admin/candidates')}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Consulter les profils →
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-xs">
            <div className="text-xs text-slate-500">Offres en ligne</div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              {stats.publishedJobs}
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.draftJobs} brouillon(s) · {stats.closedJobs} fermée(s)
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-xs">
            <div className="text-xs text-slate-500">Candidatures reçues</div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {stats.totalApplications}
            </div>
            <button
              onClick={() => navigate('/admin/applications')}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir toutes les candidatures →
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-xs">
            <div className="text-xs text-slate-500">En attente d'examen</div>
            <div className="text-2xl font-bold text-amber-600 tabular-nums">
              {stats.pendingApplications}
            </div>
            <div className="text-[11px] text-slate-400">À traiter en priorité</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1 shadow-xs">
            <div className="text-xs text-slate-500">Sélectionnées / Prises</div>
            <div className="text-2xl font-bold text-indigo-600 tabular-nums">
              {stats.shortlistedApplications + stats.acceptedApplications}
            </div>
            <div className="text-[11px] text-slate-400">
              {stats.acceptedApplications} validée(s) définitivement
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/admin/jobs')}
          className="bg-white border border-slate-200 p-5 rounded-lg hover:border-slate-400 cursor-pointer transition-colors space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Gestion des offres</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Créer, éditer, publier ou clôturer les annonces de recrutement de chatters.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/applications')}
          className="bg-white border border-slate-200 p-5 rounded-lg hover:border-slate-400 cursor-pointer transition-colors space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Candidatures reçues</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Examiner les dossiers des candidats, messages de motivation et changer leur statut.
          </p>
        </div>

        <div
          onClick={() => navigate('/admin/candidates')}
          className="bg-white border border-slate-200 p-5 rounded-lg hover:border-slate-400 cursor-pointer transition-colors space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Vivier de candidats</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consulter les profils, compétences, langues et disponibilités des chatters inscrits.
          </p>
        </div>
      </div>

      {/* Latest Received Applications Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Dernières candidatures à examiner
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Traitez les candidatures récentes et mettez à jour leur statut en direct
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/applications')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Voir les {stats?.totalApplications || 0} candidatures →
          </button>
        </div>

        {recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Candidat</th>
                  <th className="py-3 px-6">Offre ciblée</th>
                  <th className="py-3 px-6">Expérience / Langues</th>
                  <th className="py-3 px-6">Statut actuel</th>
                  <th className="py-3 px-6 text-right">Modifier statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentApplications.map((app) => {
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">
                          {app.candidate?.firstName} {app.candidate?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate text-slate-800 font-medium">
                        {app.job?.title || 'Offre'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div>{app.candidateSnapshot.chatterExperience}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.candidateSnapshot.languages.map((l) => l.language).join(', ')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium ${
                            app.status === 'RECEIVED'
                              ? 'bg-slate-100 text-slate-700'
                              : app.status === 'REVIEWING'
                              ? 'bg-amber-100 text-amber-800'
                              : app.status === 'SHORTLISTED'
                              ? 'bg-indigo-100 text-indigo-800 font-semibold'
                              : app.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800 font-semibold'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {app.status === 'RECEIVED' && 'Reçue'}
                          {app.status === 'REVIEWING' && 'En examen'}
                          {app.status === 'SHORTLISTED' && 'Présélectionnée'}
                          {app.status === 'ACCEPTED' && 'Acceptée'}
                          {app.status === 'REJECTED' && 'Refusée'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="py-1 px-2 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
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
          <div className="p-10 text-center text-slate-500 text-xs">
            Aucune candidature reçue pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};
