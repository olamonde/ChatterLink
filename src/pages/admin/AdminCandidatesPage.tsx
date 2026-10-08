import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import type { CandidateProfile, User } from '../../types/index.js';
import {
  Users,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  ShieldCheck,
  Globe,
  Briefcase,
  X,
  FileCheck,
} from 'lucide-react';

interface CandidateListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  profile: CandidateProfile | null;
  applicationCount: number;
  acceptedCount: number;
}

interface AdminCandidatesPageProps {
  navigate: (path: string) => void;
}

export const AdminCandidatesPage: React.FC<AdminCandidatesPageProps> = ({ navigate }) => {
  const { token } = useAuth();
  const [candidates, setCandidates] = useState<CandidateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Candidate detail modal state
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCandidates = () => {
    setLoading(true);
    fetch('/api/admin/candidates', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.candidates) setCandidates(data.candidates);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchCandidates();
  }, [token]);

  const handleToggleStatus = async (candidateId: string, currentActive: boolean) => {
    const actionText = currentActive ? 'suspendre' : 'réactiver';
    if (!confirm(`Souhaitez-vous vraiment ${actionText} ce compte candidat ?`)) return;

    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (res.ok) {
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, isActive: !currentActive } : c))
        );
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate({ ...selectedCandidate, isActive: !currentActive });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewCandidate = async (candidateId: string) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedCandidate(data.candidate);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.profile?.city && c.profile.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Vivier de candidats chatter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consultez les profils complets des candidats inscrits et suivez leurs candidatures.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          <span className="font-semibold text-slate-800">{candidates.length}</span> candidat(s) inscrit(s)
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, email, ville..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement...</div>
        ) : filteredCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Candidat</th>
                  <th className="py-3 px-6">Expérience déclarée</th>
                  <th className="py-3 px-6">Localisation & Langues</th>
                  <th className="py-3 px-6">Candidatures</th>
                  <th className="py-3 px-6">Statut Compte</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCandidates.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">
                          {c.firstName} {c.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-800">
                          {c.profile?.chatterExperience || 'Débutant'}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {c.profile?.availability || 'Disponibilité flexible'}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <div>
                          {c.profile?.city ? `${c.profile.city}, ` : ''}
                          {c.profile?.country || 'France'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.profile?.languages.map((l) => l.language).join(', ') || 'Français'}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums">
                        <div className="font-semibold text-slate-900">
                          {c.applicationCount} envoyée(s)
                        </div>
                        {c.acceptedCount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            {c.acceptedCount} acceptée(s)
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {c.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Actif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>Suspendu</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleViewCandidate(c.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                        >
                          Détails
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.isActive)}
                          className={`px-2.5 py-1 text-xs font-medium rounded ${
                            c.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {c.isActive ? 'Suspendre' : 'Réactiver'}
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
            Aucun candidat ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">{selectedCandidate.email}</div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Personal Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[11px]">Niveau en chatter</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.chatterExperience || 'Débutant'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Localisation</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.city || 'N/A'},{' '}
                    {selectedCandidate.profile?.country || 'France'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tranche d'âge</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.ageRange || '18-24'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Disponibilité</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.availability || 'Non précisée'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Fuseau & Créneaux</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.timezone} · {selectedCandidate.profile?.timeSlots}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Type de travail</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCandidate.profile?.workType || 'Télétravail 100%'}
                  </span>
                </div>
              </div>

              {/* Languages */}
              {selectedCandidate.profile?.languages && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Langues maîtrisées :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.profile.languages.map((l: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-medium"
                      >
                        {l.language} — {l.level}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedCandidate.profile?.bio && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Présentation :</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded">
                    {selectedCandidate.profile.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedCandidate.profile?.skills && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Compétences :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.profile.skills.map((s: string, idx: number) => (
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

              {/* Past Experience */}
              {selectedCandidate.profile?.workExperience && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Expérience professionnelle passée :
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded">
                    {selectedCandidate.profile.workExperience}
                  </p>
                </div>
              )}

              {/* Application History */}
              <div className="pt-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Historique des candidatures ({selectedCandidate.applications?.length || 0})
                </span>
                {selectedCandidate.applications && selectedCandidate.applications.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCandidate.applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-3 border border-slate-200 rounded flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                          <div className="text-[10px] text-slate-400">
                            Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs italic">
                    Aucune candidature enregistrée pour ce candidat.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(selectedCandidate.id, selectedCandidate.isActive)}
                className={`text-xs font-semibold ${
                  selectedCandidate.isActive ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {selectedCandidate.isActive ? 'Suspendre ce compte' : 'Réactiver ce compte'}
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
