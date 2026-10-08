import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import type { Job, JobStatus, ExperienceLevel } from '../../types/index.js';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  Archive,
  Eye,
  AlertCircle,
  X,
  FileCheck,
  Globe,
  Briefcase,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobStatusBadge, Badge } from '../../components/ui/Badge.js';
import { EmptyState } from '../../components/ui/EmptyState.js';

interface AdminJobsPageProps {
  navigate: (path: string) => void;
}

export const AdminJobsPage: React.FC<AdminJobsPageProps> = ({ navigate }) => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT' | 'CLOSED'>('all');
  const [search, setSearch] = useState('');

  // Modal State for Create & Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMissions, setFormMissions] = useState('');
  const [formRequiredProfile, setFormRequiredProfile] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formLanguages, setFormLanguages] = useState('Français');
  const [formExperience, setFormExperience] = useState<ExperienceLevel>('Débutant');
  const [formBeginnerFriendly, setFormBeginnerFriendly] = useState(true);
  const [formAvailability, setFormAvailability] = useState('Temps partiel (15h - 20h / semaine)');
  const [formWorkingHours, setFormWorkingHours] = useState('Soirée (18h - 23h)');
  const [formCompensation, setFormCompensation] = useState('Fixe + 15% commissions (est. 1 800€ - 2 500€)');
  const [formCompensationPublic, setFormCompensationPublic] = useState(true);
  const [formWorkType, setFormWorkType] = useState('Télétravail 100%');
  const [formOpeningsCount, setFormOpeningsCount] = useState(1);
  const [formAdditionalInfo, setFormAdditionalInfo] = useState('');
  const [formStatus, setFormStatus] = useState<JobStatus>('DRAFT');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    fetch('/api/admin/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormDescription('');
    setFormMissions('');
    setFormRequiredProfile('');
    setFormSkills('Excellente orthographe, Aisance relationnelle, Discrétion');
    setFormLanguages('Français');
    setFormExperience('Débutant');
    setFormBeginnerFriendly(true);
    setFormAvailability('Temps partiel (15h - 20h / semaine)');
    setFormWorkingHours('Soirée (18h - 23h)');
    setFormCompensation('Fixe + 15% commissions (est. 1 800€ - 2 500€)');
    setFormCompensationPublic(true);
    setFormWorkType('Télétravail 100%');
    setFormOpeningsCount(1);
    setFormAdditionalInfo('Offre vérifiée reçue directement de la créatrice.');
    setFormStatus('DRAFT');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormDescription(job.description);
    setFormMissions(job.missions);
    setFormRequiredProfile(job.requiredProfile || '');
    setFormSkills(job.requiredSkills.join(', '));
    setFormLanguages(job.languages.join(', '));
    setFormExperience(job.requiredExperience);
    setFormBeginnerFriendly(job.beginnerFriendly);
    setFormAvailability(job.availability);
    setFormWorkingHours(job.workingHours);
    setFormCompensation(job.compensation);
    setFormCompensationPublic(job.compensationPublic);
    setFormWorkType(job.workType);
    setFormOpeningsCount(job.openingsCount);
    setFormAdditionalInfo(job.additionalInfo || '');
    setFormStatus(job.status);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formMissions) {
      setFormError('Le titre, la description et les missions sont obligatoires.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      title: formTitle,
      description: formDescription,
      missions: formMissions,
      requiredProfile: formRequiredProfile,
      requiredSkills: formSkills.split(',').map((s) => s.trim()).filter(Boolean),
      languages: formLanguages.split(',').map((s) => s.trim()).filter(Boolean),
      requiredExperience: formExperience,
      beginnerFriendly: formBeginnerFriendly,
      availability: formAvailability,
      workingHours: formWorkingHours,
      compensation: formCompensation,
      compensationPublic: formCompensationPublic,
      workType: formWorkType,
      openingsCount: formOpeningsCount,
      additionalInfo: formAdditionalInfo,
      status: formStatus,
    };

    try {
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : '/api/admin/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Erreur lors de l’enregistrement de l’offre.');
      } else {
        setModalOpen(false);
        fetchJobs();
      }
    } catch (err) {
      setFormError('Connexion au serveur impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: JobStatus) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Confirmez-vous la suppression définitive de l'offre "${title}" ? Les candidatures associées seront également effacées.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.languages.some((l) => l.toLowerCase().includes(q))
      );
    }
    return true;
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
            Gestion des offres de chatter
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Créez, modifiez, publiez ou archivez les annonces reçues des créatrices.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all inline-flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une offre</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#181818] border border-white/5 rounded-xl w-full sm:w-auto text-xs overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'PUBLISHED'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Publiées ({jobs.filter((j) => j.status === 'PUBLISHED').length})
          </button>
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'DRAFT'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Brouillons ({jobs.filter((j) => j.status === 'DRAFT').length})
          </button>
          <button
            onClick={() => setStatusFilter('CLOSED')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'CLOSED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fermées ({jobs.filter((j) => j.status === 'CLOSED').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une offre..."
            className="w-full pl-10 pr-3.5 py-2 text-xs border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Jobs Listing: Responsive Table on desktop, Cards on mobile */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement des offres...</div>
        ) : filteredJobs.length > 0 ? (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#161616] text-slate-400 border-b border-white/10 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Titre de l'offre</th>
                    <th className="py-3.5 px-6">Statut</th>
                    <th className="py-3.5 px-6">Expérience / Langue</th>
                    <th className="py-3.5 px-6">Candidatures</th>
                    <th className="py-3.5 px-6">Rémunération</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-bold text-white line-clamp-1">{job.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {job.isDemo ? 'Démo' : 'Personnalisée'} · {job.workType}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <JobStatusBadge status={job.status} size="md" />
                      </td>

                      <td className="py-4 px-6 text-slate-300">
                        <div className="font-medium text-white">{job.requiredExperience}</div>
                        <div className="text-[11px] text-slate-400">
                          {job.languages.join(', ')} {job.beginnerFriendly && '· Débutant OK'}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums">
                        <button
                          onClick={() => navigate(`/admin/applications?jobId=${job.id}`)}
                          className="font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                        >
                          {job.applicantCount || 0} candidat(s)
                        </button>
                        {job.pendingCount ? (
                          <div className="text-[10px] text-amber-400 font-semibold">
                            {job.pendingCount} en attente
                          </div>
                        ) : null}
                      </td>

                      <td className="py-4 px-6 font-semibold text-white">
                        {job.compensation}
                      </td>

                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        {job.status === 'DRAFT' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'PUBLISHED')}
                            title="Publier en direct"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded-lg cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'CLOSED')}
                            title="Clôturer l'offre"
                            className="p-1.5 text-slate-400 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'CLOSED' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'PUBLISHED')}
                            title="Réouvrir et publier"
                            className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded-lg cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(job)}
                          title="Modifier l'offre"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Supprimer définitivement"
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/60 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/5 p-4 space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="pt-3 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <JobStatusBadge status={job.status} size="sm" />
                    <button
                      onClick={() => navigate(`/admin/applications?jobId=${job.id}`)}
                      className="text-xs font-bold text-indigo-400"
                    >
                      {job.applicantCount || 0} candidat(s)
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-sm">{job.title}</h3>
                  <div className="text-xs text-slate-300 font-medium">{job.compensation}</div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => openEditModal(job)}
                      className="flex-1 py-1.5 text-xs font-semibold text-slate-200 bg-[#181818] border border-white/10 rounded-lg text-center"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-1.5 text-rose-400 bg-rose-950/60 border border-rose-800/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="Aucune offre trouvée"
            description="Aucune offre ne correspond à votre filtre de statut ou mot-clé."
            actionLabel="Réinitialiser"
            onAction={() => {
              setStatusFilter('all');
              setSearch('');
            }}
          />
        )}
      </div>

      {/* Create / Edit Modal with Motion */}
      <AnimatePresence>
        {modalOpen && (
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
                    {editingJob ? "Modifier l'offre de chatter" : "Créer une offre de chatter"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saisie administrative · Offre reçue en privé d'une créatrice
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-950/80 text-rose-300 border border-rose-800/60 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Titre de l'offre <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Chatter Bilingue Soirée · Créatrice Mode & Lifestyle"
                    className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-sm bg-[#181818] text-white placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Statut initial</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as JobStatus)}
                      className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                    >
                      <option value="DRAFT">Brouillon (Non visible)</option>
                      <option value="PUBLISHED">Publiée en ligne</option>
                      <option value="CLOSED">Fermée</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Expérience requise
                    </label>
                    <select
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value as ExperienceLevel)}
                      className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Moins de 6 mois">Moins de 6 mois</option>
                      <option value="6 mois à 1 an">6 mois à 1 an</option>
                      <option value="1 à 2 ans">1 à 2 ans</option>
                      <option value="Plus de 2 ans">Plus de 2 ans</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#181818] rounded-xl border border-white/10 w-full">
                      <input
                        type="checkbox"
                        checked={formBeginnerFriendly}
                        onChange={(e) => setFormBeginnerFriendly(e.target.checked)}
                        className="rounded border-white/20 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                      />
                      <span className="font-semibold text-white text-xs">Débutant accepté</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Description générale <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Présentation du compte et objectifs..."
                    className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs bg-[#181818] text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Missions précises confiées <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formMissions}
                    onChange={(e) => setFormMissions(e.target.value)}
                    placeholder="· Réponses aux messages directs&#10;· Vente des contenus exclusifs..."
                    className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs font-mono bg-[#181818] text-white placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Langues requises (virgules)
                    </label>
                    <input
                      type="text"
                      value={formLanguages}
                      onChange={(e) => setFormLanguages(e.target.value)}
                      placeholder="Français, Anglais"
                      className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 bg-[#181818] text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Compétences clés
                    </label>
                    <input
                      type="text"
                      value={formSkills}
                      onChange={(e) => setFormSkills(e.target.value)}
                      placeholder="Orthographe, Persuasion, Réactivité..."
                      className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 bg-[#181818] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Rémunération
                    </label>
                    <input
                      type="text"
                      value={formCompensation}
                      onChange={(e) => setFormCompensation(e.target.value)}
                      placeholder="Fixe + % ou horaire"
                      className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 bg-[#181818] text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Horaires de travail
                    </label>
                    <input
                      type="text"
                      value={formWorkingHours}
                      onChange={(e) => setFormWorkingHours(e.target.value)}
                      placeholder="Ex: 18h - 23h"
                      className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 bg-[#181818] text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Postes à pourvoir
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formOpeningsCount}
                      onChange={(e) => setFormOpeningsCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 bg-[#181818] text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 text-slate-400 hover:text-white font-medium cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {submitting
                      ? 'Enregistrement...'
                      : editingJob
                      ? 'Mettre à jour'
                      : 'Créer l’offre'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
