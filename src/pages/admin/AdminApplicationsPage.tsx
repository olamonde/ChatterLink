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
} from 'lucide-react';

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
      // Load jobs list for dropdown filter
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Candidatures reçues
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Examinez chaque candidature, le profil détaillé du candidat et mettez à jour son statut.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          <span className="font-semibold text-slate-800">{applications.length}</span> candidature(s) trouvée(s)
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par candidat (nom, prénom, email) ou offre..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
          >
            Filtrer
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
          {/* Par offre */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Filtrer par offre</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toutes les offres</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.status})
                </option>
              ))}
            </select>
          </div>

          {/* Par statut */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Filtrer par statut</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
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
              className="py-1.5 text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement...</div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Candidat</th>
                  <th className="py-3 px-6">Offre de chatter</th>
                  <th className="py-3 px-6">Date de dépôt</th>
                  <th className="py-3 px-6">Expérience / Profil</th>
                  <th className="py-3 px-6">Statut</th>
                  <th className="py-3 px-6 text-right">Actions</th>
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
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">
                          {app.candidate?.firstName} {app.candidate?.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{app.candidate?.email}</div>
                      </td>

                      <td className="py-4 px-6 max-w-xs truncate">
                        <div className="font-medium text-slate-800">{app.job?.title || 'Offre'}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.job?.compensation || ''}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums text-slate-500">{dateStr}</td>

                      <td className="py-4 px-6 text-slate-600">
                        <div>{app.candidateSnapshot.chatterExperience}</div>
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
                          className="py-1 px-2 border border-slate-300 rounded text-xs bg-white text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
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
                          className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded inline-flex items-center gap-1"
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
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            Aucune candidature trouvée.
          </div>
        )}
      </div>

      {/* Candidate Application Inspection Modal */}
      {inspectApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dossier de candidature : {inspectApp.candidate?.firstName}{' '}
                  {inspectApp.candidate?.lastName}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Offre ciblée : <strong className="text-slate-700">{inspectApp.job?.title}</strong>
                </div>
              </div>
              <button
                onClick={() => setInspectApp(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Application Status Controller */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-slate-800">Statut de la candidature</div>
                <div className="text-slate-500 text-[11px]">
                  Le candidat voit ce statut en direct sur son tableau de bord
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  disabled={updatingStatus}
                  value={inspectApp.status}
                  onChange={(e) =>
                    handleUpdateStatus(inspectApp.id, e.target.value as ApplicationStatus)
                  }
                  className="py-1.5 px-3 border border-slate-300 rounded font-semibold bg-white text-slate-900 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="RECEIVED">Reçue</option>
                  <option value="REVIEWING">En cours d'examen</option>
                  <option value="SHORTLISTED">Présélectionnée</option>
                  <option value="ACCEPTED">Acceptée</option>
                  <option value="REJECTED">Refusée</option>
                </select>
              </div>
            </div>

            {/* Motivation Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Message de motivation rédigé pour l'offre
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {inspectApp.motivation}
              </div>
            </div>

            {/* Candidate specific notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1">
                  Disponibilités indiquées :
                </span>
                <span className="text-slate-600">
                  {inspectApp.availabilityNote || inspectApp.candidateSnapshot.availability}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1">
                  Expérience pertinente déclarée :
                </span>
                <span className="text-slate-600">
                  {inspectApp.relevantExperience || 'Non renseignée'}
                </span>
              </div>
            </div>

            {/* Full Profile Snapshot */}
            <div className="border-t border-slate-100 pt-4 space-y-4 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-900">
                Profil complet du candidat
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[11px]">Expérience chatter</span>
                  <span className="font-semibold text-slate-900">
                    {inspectApp.candidateSnapshot.chatterExperience}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Localisation</span>
                  <span className="font-semibold text-slate-900">
                    {inspectApp.candidateSnapshot.city}, {inspectApp.candidateSnapshot.country}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email direct</span>
                  <span className="font-semibold text-slate-900">
                    {inspectApp.candidate?.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Langues</span>
                  <span className="font-semibold text-slate-900">
                    {inspectApp.candidateSnapshot.languages
                      .map((l) => `${l.language} (${l.level})`)
                      .join(', ')}
                  </span>
                </div>
              </div>

              {inspectApp.candidate?.profile?.bio && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Présentation personnelle (Bio) :
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {inspectApp.candidate.profile.bio}
                  </p>
                </div>
              )}

              {inspectApp.candidate?.profile?.skills &&
                inspectApp.candidate.profile.skills.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Compétences :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectApp.candidate.profile.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectApp(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
              >
                Fermer l'examen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
