import React, { useEffect, useState } from 'react';
import type { Job, CandidateProfile } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Globe,
  Briefcase,
  AlertCircle,
  Shield,
  Send,
  X,
  FileCheck,
  Sparkles,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../components/ui/Badge.js';
import { Skeleton } from '../components/ui/Skeleton.js';

interface JobDetailPageProps {
  jobId: string;
  navigate: (path: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, navigate }) => {
  const { user, token } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userApplication, setUserApplication] = useState<{
    id: string;
    status: string;
    createdAt: string;
  } | null>(null);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [motivation, setMotivation] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchJob = () => {
    setIsLoading(true);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/jobs/${jobId}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('Offre non trouvée');
        return res.json();
      })
      .then((data) => {
        setJob(data.job);
        if (data.userApplication) {
          setUserApplication(data.userApplication);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchJob();
  }, [jobId, token]);

  const handleOpenApplyModal = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'CANDIDATE') {
      alert('Seuls les comptes candidats peuvent postuler.');
      return;
    }

    setSubmitError(null);
    try {
      const res = await fetch('/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCandidateProfile(data.profile);
        if (data.profile) {
          setAvailabilityNote(data.profile.availability || '');
          setRelevantExperience(data.profile.workExperience || '');
        }
      }
    } catch (e) {
      console.error(e);
    }
    setApplyModalOpen(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation.trim() || motivation.trim().length < 20) {
      setSubmitError('Votre message de motivation doit comporter au moins 20 caractères.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          motivation,
          relevantExperience,
          availabilityNote,
          additionalNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Erreur lors de l’envoi de votre candidature.');
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setUserApplication({
        id: data.application.id,
        status: data.application.status,
        createdAt: data.application.createdAt,
      });
    } catch (err) {
      setSubmitError('Connexion au serveur impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6 bg-[#050505]">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-[#050505]">
        <div className="w-14 h-14 bg-rose-950/80 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-850/50">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Offre non disponible</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Cette opportunité n'existe pas ou a été archivée par l'administrateur.
        </p>
        <button
          onClick={() => navigate('/jobs')}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux offres</span>
        </button>
      </div>
    );
  }

  const dateStr = new Date(job.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isClosed = job.status === 'CLOSED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#050505] text-slate-100">
      {/* Back button */}
      <button
        onClick={() => navigate('/jobs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Toutes les opportunités</span>
      </button>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Comprehensive Job Brief */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center flex-wrap gap-2 text-xs">
              {job.beginnerFriendly && (
                <Badge variant="success" size="sm" dot>
                  Débutant accepté
                </Badge>
              )}
              <Badge variant="neutral" size="sm">
                {job.workType}
              </Badge>
              <Badge variant="indigo" size="sm">
                {job.languages.join(', ')}
              </Badge>
              <span className="text-[11px] text-slate-400">
                Publiée le {dateStr}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {job.title}
            </h1>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#181818] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Expérience</span>
                <span className="font-semibold text-white mt-0.5 block">
                  {job.requiredExperience}
                </span>
              </div>
              <div className="bg-[#181818] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Créneaux</span>
                <span className="font-semibold text-white mt-0.5 block truncate">
                  {job.workingHours}
                </span>
              </div>
              <div className="bg-[#181818] p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">Disponibilité</span>
                <span className="font-semibold text-white mt-0.5 block truncate">
                  {job.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Description & Context */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Contexte de la collaboration
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Missions confiées au chatter
              </h2>
              <div className="bg-[#181818] p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-line">
                {job.missions}
              </div>
            </div>

            {job.requiredProfile && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Profil recherché
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {job.requiredProfile}
                </p>
              </div>
            )}

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Compétences clés
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {job.requiredSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#1a1a1a] text-slate-200 text-xs font-medium rounded-lg border border-white/10"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.additionalInfo && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Informations complémentaires
                </h2>
                <p className="text-xs text-indigo-300 leading-relaxed bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-800/40">
                  {job.additionalInfo}
                </p>
              </div>
            )}
          </div>

          {/* Security & Confidentiality reminder */}
          <div className="bg-[#141414] text-white rounded-3xl border border-white/10 p-6 text-xs space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Lock className="w-4 h-4" />
              <span>Protocole de confidentialité garanti</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              L'anonymat et les identifiants privés de la créatrice sont préservés. Seul
              l'administrateur ChatterLink effectue la sélection et la mise en relation sécurisée.
            </p>
          </div>
        </div>

        {/* Right column: Sticky Application Action Sidebar */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 space-y-5 shadow-xl">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Rémunération proposée
              </span>
              <span className="text-lg sm:text-xl font-bold text-white mt-1 block font-display">
                {job.compensation}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Postes ouverts</span>
                <span className="font-semibold text-white">{job.openingsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Type de contrat</span>
                <span className="font-semibold text-white">{job.workType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Langues</span>
                <span className="font-semibold text-white">{job.languages.join(', ')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              {isClosed ? (
                <div className="w-full py-3 px-4 text-xs font-semibold text-slate-500 bg-[#181818] rounded-xl text-center cursor-not-allowed">
                  Offre fermée aux candidatures
                </div>
              ) : userApplication ? (
                <div className="space-y-2">
                  <div className="w-full py-3 px-4 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Vous avez déjà postulé</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                  >
                    Voir le statut dans mon tableau de bord
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="w-full py-3.5 px-4 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all text-center inline-flex items-center justify-center gap-2 group cursor-pointer shadow-lg hover:shadow-indigo-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Postuler à cette offre</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal with Motion (Dark Premium) */}
      <AnimatePresence>
        {applyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111111] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-white/10 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Postuler à cette opportunité</h3>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{job.title}</div>
                </div>
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-950/80 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-emerald-800/50">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-display">
                    Candidature transmise avec succès !
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Votre profil a bien été enregistré pour cette offre. L'administrateur étudiera
                    vos éléments et mettra à jour votre statut dans votre espace candidat.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setApplyModalOpen(false);
                        navigate('/dashboard');
                      }}
                      className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Suivre dans mon tableau de bord
                    </button>
                    <button
                      onClick={() => setApplyModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-medium text-slate-300 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                  {/* Automatic profile summary */}
                  <div className="bg-indigo-950/50 border border-indigo-800/50 rounded-2xl p-4 space-y-1 text-indigo-200">
                    <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Éléments joints depuis votre profil :</span>
                    </div>
                    <div className="text-slate-300 flex flex-wrap gap-x-4 gap-y-1 text-[11px] pt-1">
                      <span>
                        Candidat :{' '}
                        <strong className="text-white">
                          {user?.firstName} {user?.lastName}
                        </strong>
                      </span>
                      <span>
                        Expérience :{' '}
                        <strong className="text-white">{candidateProfile?.chatterExperience || 'Débutant'}</strong>
                      </span>
                      <span>
                        Langues :{' '}
                        <strong className="text-white">
                          {candidateProfile?.languages.map((l) => l.language).join(', ') ||
                            'Français'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Motivation */}
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Message de motivation <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Pourquoi souhaitez-vous collaborer sur ce compte ? Présentez votre sérieux et votre aisance relationnelle écrite..."
                      className="w-full p-3 border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs leading-relaxed"
                      required
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Minimum 20 caractères ({motivation.length} saisis).
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Disponibilité spécifique pour cette offre
                    </label>
                    <input
                      type="text"
                      value={availabilityNote}
                      onChange={(e) => setAvailabilityNote(e.target.value)}
                      placeholder="Ex: Immédiate, créneau soirée (18h-23h), 20h/semaine..."
                      className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  {/* Relevant experience */}
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Expérience pertinente
                    </label>
                    <input
                      type="text"
                      value={relevantExperience}
                      onChange={(e) => setRelevantExperience(e.target.value)}
                      placeholder="Ex: 6 mois de chatter mode, vente écrite, orthographe excellente..."
                      className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(false)}
                      className="px-4 py-2.5 text-slate-400 hover:text-white font-medium cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {submitting ? 'Transmission...' : 'Confirmer et envoyer'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
