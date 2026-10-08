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
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../../components/ui/Badge.js';
import { EmptyState } from '../../components/ui/EmptyState.js';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#050505] text-slate-100">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="indigo" size="sm">
            Administration
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mt-1">
            Vivier de candidats chatter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Consultez les profils complets des candidats inscrits et gérez leurs accès.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span className="font-bold text-white">{candidates.length}</span> candidat(s) inscrit(s)
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, email, ville..."
            className="w-full pl-10 pr-3.5 py-2 text-xs border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Candidates List: Responsive Table on desktop, Cards on mobile */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement...</div>
        ) : filteredCandidates.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161616] text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Candidat</th>
                    <th className="py-3.5 px-6">Expérience déclarée</th>
                    <th className="py-3.5 px-6">Localisation & Langues</th>
                    <th className="py-3.5 px-6">Candidatures</th>
                    <th className="py-3.5 px-6">Statut Compte</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">
                          {c.firstName} {c.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-white">
                          {c.profile?.chatterExperience || 'Débutant'}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {c.profile?.availability || 'Disponibilité non renseignée'}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-300">
                        <div>
                          {c.profile?.city ? `${c.profile.city}, ` : ''}
                          {c.profile?.country || 'France'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.profile?.languages.map((l) => l.language).join(', ') || 'Français'}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums">
                        <div className="font-bold text-white">
                          {c.applicationCount} envoyée(s)
                        </div>
                        {c.acceptedCount > 0 && (
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            {c.acceptedCount} acceptée(s)
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {c.isActive ? (
                          <Badge variant="success" size="sm" dot>
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="sm" dot>
                            Suspendu
                          </Badge>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleViewCandidate(c.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#181818] hover:bg-white hover:text-slate-900 border border-white/10 rounded-lg cursor-pointer transition-all"
                        >
                          Détails
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.isActive)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                            c.isActive
                              ? 'text-rose-400 hover:bg-rose-950/60'
                              : 'text-emerald-400 hover:bg-emerald-950/60'
                          }`}
                        >
                          {c.isActive ? 'Suspendre' : 'Réactiver'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/5 p-4 space-y-4">
              {filteredCandidates.map((c) => (
                <div key={c.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {c.firstName} {c.lastName}
                    </span>
                    {c.isActive ? (
                      <Badge variant="success" size="sm" dot>
                        Actif
                      </Badge>
                    ) : (
                      <Badge variant="danger" size="sm" dot>
                        Suspendu
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{c.email}</div>
                  <div className="text-xs text-slate-300">
                    Exp : <strong>{c.profile?.chatterExperience || 'Débutant'}</strong> ·{' '}
                    {c.applicationCount} candidature(s)
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleViewCandidate(c.id)}
                      className="flex-1 py-1.5 text-xs font-semibold text-slate-200 bg-[#181818] border border-white/10 rounded-lg text-center"
                    >
                      Voir profil complet
                    </button>
                    <button
                      onClick={() => handleToggleStatus(c.id, c.isActive)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                        c.isActive ? 'text-rose-400 bg-rose-950/60' : 'text-emerald-400 bg-emerald-950/60'
                      }`}
                    >
                      {c.isActive ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Aucun candidat trouvé"
            description="Aucun candidat ne correspond à vos termes de recherche."
            actionLabel="Réinitialiser"
            onAction={() => setSearch('')}
          />
        )}
      </div>

      {/* Candidate Profile Details Modal with Motion */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111111] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-white/10 text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedCandidate.email}</div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#161616] p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Niveau chatter</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.chatterExperience || 'Débutant'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Localisation</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.city || 'N/A'},{' '}
                      {selectedCandidate.profile?.country || 'France'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Âge</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.ageRange || '18-24'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Disponibilité</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.availability || 'Non précisée'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Créneaux</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.timeSlots || 'Flexibles'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Type de travail</span>
                    <span className="font-bold text-white">
                      {selectedCandidate.profile?.workType || 'Télétravail 100%'}
                    </span>
                  </div>
                </div>

                {/* Languages */}
                {selectedCandidate.profile?.languages && (
                  <div>
                    <span className="font-semibold text-slate-400 block mb-1.5">
                      Langues déclarées :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.profile.languages.map((l: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#202020] text-slate-200 rounded-lg font-medium text-xs border border-white/10"
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
                    <span className="font-semibold text-slate-400 block mb-1">Présentation :</span>
                    <p className="text-slate-300 leading-relaxed bg-[#161616] p-3.5 rounded-xl border border-white/5">
                      {selectedCandidate.profile.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedCandidate.profile?.skills &&
                  selectedCandidate.profile.skills.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1.5">Compétences :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.profile.skills.map((s: string, idx: number) => (
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

                {/* Applications history */}
                <div className="pt-2">
                  <span className="font-bold text-white uppercase tracking-wider block mb-2">
                    Historique de candidatures ({selectedCandidate.applications?.length || 0})
                  </span>
                  {selectedCandidate.applications && selectedCandidate.applications.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedCandidate.applications.map((app: any) => (
                        <div
                          key={app.id}
                          className="p-3 border border-white/10 rounded-xl flex items-center justify-between bg-[#161616]"
                        >
                          <div>
                            <div className="font-bold text-white">{app.jobTitle}</div>
                            <div className="text-[10px] text-slate-400">
                              Postulé le {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <Badge variant="indigo" size="sm">
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs italic">
                      Aucune candidature enregistrée pour ce candidat.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() =>
                    handleToggleStatus(selectedCandidate.id, selectedCandidate.isActive)
                  }
                  className={`text-xs font-bold cursor-pointer ${
                    selectedCandidate.isActive ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {selectedCandidate.isActive ? 'Suspendre ce compte' : 'Réactiver ce compte'}
                </button>

                <button
                  onClick={() => setSelectedCandidate(null)}
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
