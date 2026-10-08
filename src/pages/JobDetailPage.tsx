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
} from 'lucide-react';

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

  // If candidate opens modal, prefill info from their profile
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
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-10 bg-slate-200 rounded w-3/4" />
        <div className="h-40 bg-slate-100 rounded" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-rose-600 font-semibold text-lg">Offre non disponible</div>
        <p className="text-slate-600 text-sm">
          Cette offre n'existe pas ou n'est plus accessible au public.
        </p>
        <button
          onClick={() => navigate('/jobs')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux opportunités</span>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/jobs')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Toutes les opportunités</span>
      </button>

      {/* Main Job Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Header Block */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span>{job.workType}</span>
            <span aria-hidden="true">·</span>
            <span>Langues : {job.languages.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>Niveau requis : {job.requiredExperience}</span>
            {job.beginnerFriendly && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 font-medium">Débutant accepté</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Publiée le {dateStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {job.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-400">Rémunération</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{job.compensation}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-400">Horaires et créneaux</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{job.workingHours}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[11px] text-slate-400">Disponibilité demandée</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{job.availability}</div>
            </div>
          </div>
        </div>

        {/* Action Callout Bar */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              Postuler à cette opportunité
            </div>
            <div className="text-[11px] text-slate-500">
              {isClosed
                ? 'Les candidatures pour cette offre sont désormais clôturées.'
                : userApplication
                ? 'Vous avez déjà soumis votre candidature pour ce poste.'
                : 'Votre profil candidat sera transmis directement à l’administrateur.'}
            </div>
          </div>

          <div>
            {isClosed ? (
              <span className="px-4 py-2 text-xs font-medium text-slate-500 bg-slate-200 rounded-md cursor-not-allowed">
                Offre fermée
              </span>
            ) : userApplication ? (
              <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300 rounded-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Candidature envoyée ({userApplication.status})</span>
              </div>
            ) : user ? (
              <button
                onClick={handleOpenApplyModal}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>Postuler maintenant</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Se connecter pour postuler
              </button>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-6 text-sm text-slate-700">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Contexte de la mission
            </h2>
            <p className="leading-relaxed whitespace-pre-line text-slate-600">{job.description}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Missions confiées au chatter
            </h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-line text-slate-700 text-xs leading-relaxed font-mono">
              {job.missions}
            </div>
          </div>

          {job.requiredProfile && (
            <div>
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Profil recherché
              </h2>
              <p className="leading-relaxed text-slate-600">{job.requiredProfile}</p>
            </div>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Compétences requises
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {job.requiredSkills.map((sk, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.additionalInfo && (
            <div>
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Informations complémentaires
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">{job.additionalInfo}</p>
            </div>
          )}
        </div>

        {/* Confidentiality Reminder */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Les informations privées et comptes personnels des créatrices sont strictement
            protégés et gérés en privé par l'administrateur ChatterLink. Aucun contact direct ne
            doit être sollicité en dehors du protocole de la plateforme.
          </p>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Postuler à cette opportunité</h3>
                <div className="text-xs text-slate-500 mt-0.5">{job.title}</div>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Candidature transmise avec succès !
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre dossier a bien été enregistré. L'administrateur étudiera votre profil et
                  mettra à jour le statut dans votre tableau de bord.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setApplyModalOpen(false);
                      navigate('/dashboard');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
                  >
                    Voir mes candidatures
                  </button>
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-md"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                {/* Profile snapshot notice */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="font-semibold text-slate-800">
                    Informations jointes automatiquement depuis votre profil :
                  </div>
                  <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                    <span>
                      Candidat : <strong>{user?.firstName} {user?.lastName}</strong>
                    </span>
                    <span>
                      Expérience :{' '}
                      <strong>{candidateProfile?.chatterExperience || 'Débutant'}</strong>
                    </span>
                    <span>
                      Langues :{' '}
                      <strong>
                        {candidateProfile?.languages.map((l) => l.language).join(', ') || 'Français'}
                      </strong>
                    </span>
                    <span>
                      Localisation :{' '}
                      <strong>
                        {candidateProfile?.city || 'Non renseignée'}, {candidateProfile?.country || 'France'}
                      </strong>
                    </span>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Motivation field */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Message de motivation <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Présentez brièvement vos atouts, votre enthousiasme pour l'univers de la créatrice et votre méthode de travail..."
                    className="w-full p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Minimum 20 caractères ({motivation.length} saisis).
                  </div>
                </div>

                {/* Relevant Experience */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Expérience pertinente ou compétences clés
                  </label>
                  <input
                    type="text"
                    value={relevantExperience}
                    onChange={(e) => setRelevantExperience(e.target.value)}
                    placeholder="Ex: 3 mois de chatter mode, aisance relationnelle écrite, orthographe irréprochable..."
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Vos disponibilités pour cette offre
                  </label>
                  <input
                    type="text"
                    value={availabilityNote}
                    onChange={(e) => setAvailabilityNote(e.target.value)}
                    placeholder="Ex: Disponible 20h/semaine dès lundi, créneau soirée (18h-23h)..."
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Additional Note */}
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Informations complémentaires (optionnel)
                  </label>
                  <input
                    type="text"
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                    placeholder="Équipement disponible, connexion fibre, questions..."
                    className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {submitting ? 'Envoi en cours...' : 'Confirmer et envoyer la candidature'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
