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
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Gestion des offres de chatter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Créez, modifiez, publiez ou archivez les annonces transmises par les créatrices.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une nouvelle offre</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md w-full sm:w-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              statusFilter === 'PUBLISHED'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Publiées ({jobs.filter((j) => j.status === 'PUBLISHED').length})
          </button>
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              statusFilter === 'DRAFT'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Brouillons ({jobs.filter((j) => j.status === 'DRAFT').length})
          </button>
          <button
            onClick={() => setStatusFilter('CLOSED')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              statusFilter === 'CLOSED'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fermées ({jobs.filter((j) => j.status === 'CLOSED').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une offre..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Chargement des offres...</div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-6">Titre de l'offre</th>
                  <th className="py-3 px-6">Statut</th>
                  <th className="py-3 px-6">Expérience / Langue</th>
                  <th className="py-3 px-6">Candidatures</th>
                  <th className="py-3 px-6">Rémunération</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredJobs.map((job) => {
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 max-w-sm">
                        <div className="font-semibold text-slate-900 line-clamp-1">{job.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {job.isDemo ? 'Donnée de démonstration' : 'Offre personnalisée'} · {job.workType}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold ${
                            job.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : job.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.status === 'PUBLISHED' && 'Publiée'}
                          {job.status === 'DRAFT' && 'Brouillon'}
                          {job.status === 'CLOSED' && 'Fermée'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <div>{job.requiredExperience}</div>
                        <div className="text-[11px] text-slate-400">
                          {job.languages.join(', ')} {job.beginnerFriendly && '· Débutant OK'}
                        </div>
                      </td>

                      <td className="py-4 px-6 tabular-nums">
                        <button
                          onClick={() => navigate(`/admin/applications?jobId=${job.id}`)}
                          className="font-semibold text-indigo-600 hover:underline"
                        >
                          {job.applicantCount || 0} candidat(s)
                        </button>
                        {job.pendingCount ? (
                          <div className="text-[10px] text-amber-600 font-medium">
                            {job.pendingCount} en attente
                          </div>
                        ) : null}
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-800">{job.compensation}</td>

                      <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                        {/* Quick status button */}
                        {job.status === 'DRAFT' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'PUBLISHED')}
                            title="Publier en direct"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'PUBLISHED' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'CLOSED')}
                            title="Clôturer l'offre"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'CLOSED' && (
                          <button
                            onClick={() => handleQuickStatusChange(job.id, 'PUBLISHED')}
                            title="Réouvrir et publier"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(job)}
                          title="Modifier l'offre"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Supprimer définitivement"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
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
            Aucune offre ne correspond aux critères sélectionnés.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingJob ? "Modifier l'offre de chatter" : "Créer une nouvelle offre de chatter"}
                </h3>
                <p className="text-xs text-slate-500">
                  Transmise en privé par la créatrice · Visible uniquement par les candidats une fois publiée
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titre de l'offre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Chatter Bilingue Soirée · Créatrice Mode & Lifestyle"
                  className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statut initial</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as JobStatus)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DRAFT">Brouillon (Non visible)</option>
                    <option value="PUBLISHED">Publiée en ligne</option>
                    <option value="CLOSED">Fermée</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expérience requise
                  </label>
                  <select
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value as ExperienceLevel)}
                    className="w-full p-2 border border-slate-200 rounded-md bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Moins de 6 mois">Moins de 6 mois</option>
                    <option value="6 mois à 1 an">6 mois à 1 an</option>
                    <option value="1 à 2 ans">1 à 2 ans</option>
                    <option value="Plus de 2 ans">Plus de 2 ans</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formBeginnerFriendly}
                      onChange={(e) => setFormBeginnerFriendly(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Débutant accepté</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description générale <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Présentation du compte créatrice et objectifs de la collaboration..."
                  className="w-full p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Missions précises confiées <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formMissions}
                  onChange={(e) => setFormMissions(e.target.value)}
                  placeholder="· Réponses aux messages directs&#10;· Vente des contenus exclusifs&#10;· Suivi des abonnés réguliers..."
                  className="w-full p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Langues exigées (séparées par virgules)
                  </label>
                  <input
                    type="text"
                    value={formLanguages}
                    onChange={(e) => setFormLanguages(e.target.value)}
                    placeholder="Français, Anglais"
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Compétences demandées
                  </label>
                  <input
                    type="text"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    placeholder="Orthographe, Persuasion, Réactivité..."
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rémunération
                  </label>
                  <input
                    type="text"
                    value={formCompensation}
                    onChange={(e) => setFormCompensation(e.target.value)}
                    placeholder="Fixe + % ou taux horaire"
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Horaires de travail
                  </label>
                  <input
                    type="text"
                    value={formWorkingHours}
                    onChange={(e) => setFormWorkingHours(e.target.value)}
                    placeholder="Ex: 18h - 23h"
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Postes à pourvoir
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formOpeningsCount}
                    onChange={(e) => setFormOpeningsCount(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Disponibilité demandée
                  </label>
                  <input
                    type="text"
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value)}
                    placeholder="Ex: 20h / semaine"
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Type de travail
                  </label>
                  <input
                    type="text"
                    value={formWorkType}
                    onChange={(e) => setFormWorkType(e.target.value)}
                    placeholder="Ex: Télétravail 100%"
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Informations supplémentaires / Note interne
                </label>
                <textarea
                  rows={2}
                  value={formAdditionalInfo}
                  onChange={(e) => setFormAdditionalInfo(e.target.value)}
                  placeholder="Détails de formation, consignes spécifiques..."
                  className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md disabled:opacity-50"
                >
                  {submitting
                    ? 'Enregistrement...'
                    : editingJob
                    ? 'Mettre à jour l’offre'
                    : 'Créer l’offre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
