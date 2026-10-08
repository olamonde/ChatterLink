import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import type { Application, ApplicationStatus, Job } from '../../types/index.js';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  User,
  Briefcase,
  X,
  Calendar,
  AlertCircle,
  ChevronDown,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ApplicationStatusBadge, Badge } from '../../components/ui/Badge.js';
import { EmptyState } from '../../components/ui/EmptyState.js';

interface AdminApplicationsPageProps {
  navigate: (path: string) => void;
  initialJobId?: string;
}

export const AdminApplicationsPage: React.FC<AdminApplicationsPageProps> = ({
  navigate,
  initialJobId,
}) => {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Inspection Drawer
  const [inspectApp, setInspectApp] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchApplications = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedJobId !== 'all') params.append('jobId', selectedJobId);
    if (selectedStatus !== 'all') params.append('status', selectedStatus);
    if (search) params.append('search', search);

    fetch(`/api/admin/applications?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplications(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) {
      fetch('/api/admin/jobs', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => {
          if (data.jobs) setJobs(data.jobs);
        });

      fetchApplications();
    }
  }, [token, selectedJobId, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (inspectApp && inspectApp.id === appId) {
          setInspectApp({ ...inspectApp, status: newStatus });
        }
        setStatusMessage('Statut mis à jour avec succès en base de données.');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#050505] text-slate-100">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="indigo" size="sm">
            Administration
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mt-1">
            Candidatures reçues
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Examinez chaque dossier, vérifiez la compatibilité et mettez à jour les statuts.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span className="font-bold text-white">{applications.length}</span> candidature(s)
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par candidat (nom, prénom, email) ou offre..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-200 cursor-pointer shadow-md"
          >
            Filtrer
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-white/10">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Filtrer par offre</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full py-2 px-3 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Toutes les offres</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Filtrer par statut</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="RECEIVED">Reçue (Nouvelle)</option>
              <option value="REVIEWING">En cours d'examen</option>
              <option value="SHORTLISTED">Présélectionnée</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="REJECTED">Refusée</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedJobId('all');
                setSelectedStatus('all');
                setSearch('');
              }}
              className="py-2 text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Applications List: Responsive table & cards */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement...</div>
        ) : applications.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161616] text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Candidat</th>
                    <th className="py-3.5 px-6">Offre de chatter</th>
                    <th className="py-3.5 px-6">Date de dépôt</th>
                    <th className="py-3.5 px-6">Expérience / Profil</th>
                    <th className="py-3.5 px-6">Statut</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
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
                      <tr key={app.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">
                            {app.candidate?.firstName} {app.candidate?.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                        </td>

                        <td className="py-4 px-6 max-w-xs">
                          <div className="font-semibold text-slate-200 truncate">
                            {app.job?.title || 'Offre'}
                          </div>
                        </td>

                        <td className="py-4 px-6 tabular-nums text-slate-400">{dateStr}</td>

                        <td className="py-4 px-6 text-slate-300">
                          <div className="font-medium text-white">
                            {app.candidateSnapshot.chatterExperience}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {app.candidateSnapshot.languages.map((l) => l.language).join(', ')}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleUpdateStatus(app.id, e.target.value as ApplicationStatus)
                            }
                            className="py-1.5 px-2.5 border border-white/10 rounded-lg text-xs bg-[#181818] text-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="RECEIVED">Reçue</option>
                            <option value="REVIEWING">En cours d'examen</option>
                            <option value="SHORTLISTED">Présélectionnée</option>
                            <option value="ACCEPTED">Acceptée</option>
                            <option value="REJECTED">Refusée</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setInspectApp(app)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#181818] hover:bg-white hover:text-slate-900 border border-white/10 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Examiner</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/5 p-4 space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="pt-3 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {app.candidate?.firstName} {app.candidate?.lastName}
                    </span>
                    <ApplicationStatusBadge status={app.status} size="sm" />
                  </div>
                  <div className="text-xs font-medium text-slate-300">{app.job?.title}</div>
                  <div className="text-xs text-slate-400">
                    Exp : {app.candidateSnapshot.chatterExperience}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setInspectApp(app)}
                      className="flex-1 py-1.5 text-xs font-semibold text-slate-200 bg-[#181818] border border-white/10 rounded-lg text-center"
                    >
                      Détails du dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Aucune candidature"
            description="Aucun dossier ne correspond à votre filtre de recherche."
            actionLabel="Réinitialiser"
            onAction={() => {
              setSelectedJobId('all');
              setSelectedStatus('all');
              setSearch('');
            }}
          />
        )}
      </div>

      {/* Candidate Application Inspection Modal with Motion */}
      <AnimatePresence>
        {inspectApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111111] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-white/10 text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Candidature de {inspectApp.candidate?.firstName}{' '}
                    {inspectApp.candidate?.lastName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Offre : <strong className="text-indigo-400">{inspectApp.job?.title}</strong>
                  </div>
                </div>
                <button
                  onClick={() => setInspectApp(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {statusMessage && (
                <div className="p-3 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Status Controller */}
              <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-white">Statut de la candidature</div>
                  <div className="text-slate-400 text-[11px]">
                    Visible en direct par le candidat sur son espace
                  </div>
                </div>

                <select
                  disabled={updatingStatus}
                  value={inspectApp.status}
                  onChange={(e) =>
                    handleUpdateStatus(inspectApp.id, e.target.value as ApplicationStatus)
                  }
                  className="py-2 px-3 border border-white/10 rounded-xl font-bold bg-[#202020] text-white text-xs focus:outline-none focus:border-indigo-500 cursor-pointer shadow-md"
                >
                  <option value="RECEIVED">Reçue</option>
                  <option value="REVIEWING">En cours d'examen</option>
                  <option value="SHORTLISTED">Présélectionnée</option>
                  <option value="ACCEPTED">Acceptée</option>
                  <option value="REJECTED">Refusée</option>
                </select>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Motivation rédigée pour cette offre
                </h4>
                <div className="p-4 bg-[#161616] rounded-2xl border border-white/5 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {inspectApp.motivation}
                </div>
              </div>

              {/* Candidate Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#161616] rounded-xl border border-white/5">
                  <span className="font-semibold text-slate-400 block mb-1">
                    Disponibilité déclarée :
                  </span>
                  <span className="text-white font-medium">
                    {inspectApp.availabilityNote || inspectApp.candidateSnapshot.availability}
                  </span>
                </div>
                <div className="p-3.5 bg-[#161616] rounded-xl border border-white/5">
                  <span className="font-semibold text-slate-400 block mb-1">
                    Expérience pertinente :
                  </span>
                  <span className="text-white font-medium">
                    {inspectApp.relevantExperience || 'Non renseignée'}
                  </span>
                </div>
              </div>

              {/* Full Candidate Snapshot */}
              <div className="border-t border-white/10 pt-4 space-y-4 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-400">
                  Profil candidat complet
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#161616] p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expérience chatter</span>
                    <span className="font-bold text-white">
                      {inspectApp.candidateSnapshot.chatterExperience}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Localisation</span>
                    <span className="font-bold text-white">
                      {inspectApp.candidateSnapshot.city}, {inspectApp.candidateSnapshot.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email</span>
                    <span className="font-bold text-indigo-400">
                      {inspectApp.candidate?.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Langues</span>
                    <span className="font-bold text-white">
                      {inspectApp.candidateSnapshot.languages
                        .map((l) => `${l.language} (${l.level})`)
                        .join(', ')}
                    </span>
                  </div>
                </div>

                {inspectApp.candidate?.profile?.bio && (
                  <div>
                    <span className="font-semibold text-slate-400 block mb-1">
                      Présentation personnelle (Bio) :
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {inspectApp.candidate.profile.bio}
                    </p>
                  </div>
                )}

                {inspectApp.candidate?.profile?.skills &&
                  inspectApp.candidate.profile.skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Compétences :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectApp.candidate.profile.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-[#202020] text-slate-300 border border-white/10 rounded-lg text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setInspectApp(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl cursor-pointer shadow-md"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
