import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import type { CandidateProfile, ExperienceLevel, LanguageSkill } from '../types/index.js';
import {
  User,
  Briefcase,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge.js';
import { Skeleton } from '../components/ui/Skeleton.js';

interface CandidateProfilePageProps {
  navigate: (path: string) => void;
}

export const CandidateProfilePage: React.FC<CandidateProfilePageProps> = ({ navigate }) => {
  const { user, token, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('France');
  const [city, setCity] = useState('');
  const [ageRange, setAgeRange] = useState('18-24');
  const [chatterExperience, setChatterExperience] = useState<ExperienceLevel>('Débutant');
  const [experienceLevel, setExperienceLevel] = useState('Débutant');
  const [languages, setLanguages] = useState<LanguageSkill[]>([
    { language: 'Français', level: 'Courant' },
  ]);
  const [availability, setAvailability] = useState('Temps partiel (15-25h)');
  const [timezone, setTimezone] = useState('UTC+1 (Paris)');
  const [timeSlots, setTimeSlots] = useState('Flexible / Soirée');
  const [workType, setWorkType] = useState('Télétravail 100%');
  const [bio, setBio] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [workExperience, setWorkExperience] = useState('');

  useEffect(() => {
    if (!token) return;

    fetch('/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Impossible de charger le profil');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.firstName || '');
          setLastName(data.user.lastName || '');
        }
        if (data.profile) {
          const p = data.profile;
          setCountry(p.country || 'France');
          setCity(p.city || '');
          setAgeRange(p.ageRange || '18-24');
          setChatterExperience(p.chatterExperience || 'Débutant');
          setExperienceLevel(p.experienceLevel || 'Débutant');
          if (p.languages && p.languages.length > 0) {
            setLanguages(p.languages);
          }
          setAvailability(p.availability || 'Temps partiel (15-25h)');
          setTimezone(p.timezone || 'UTC+1 (Paris)');
          setTimeSlots(p.timeSlots || 'Flexible / Soirée');
          setWorkType(p.workType || 'Télétravail 100%');
          setBio(p.bio || '');
          setSkillsString(p.skills ? p.skills.join(', ') : '');
          setWorkExperience(p.workExperience || '');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAddLanguage = () => {
    setLanguages([...languages, { language: 'Anglais', level: 'Intermédiaire' }]);
  };

  const handleRemoveLanguage = (idx: number) => {
    setLanguages(languages.filter((_, i) => i !== idx));
  };

  const handleUpdateLanguage = (
    idx: number,
    field: 'language' | 'level',
    val: any
  ) => {
    const next = [...languages];
    next[idx] = { ...next[idx], [field]: val };
    setLanguages(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          country,
          city,
          ageRange,
          chatterExperience,
          experienceLevel,
          languages,
          availability,
          timezone,
          timeSlots,
          workType,
          bio,
          skills,
          workExperience,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la mise à jour.');
      } else {
        setSaveSuccess(true);
        updateUser({ firstName, lastName });
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      setError('Erreur de connexion.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6 bg-[#050505]">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#050505] text-slate-100">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="indigo" size="sm">
            Mon Dossier
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mt-1">
            Profil de chatter
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ces informations sont automatiquement présentées lors de vos candidatures aux offres.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-semibold text-slate-400 hover:text-white self-start sm:self-auto cursor-pointer"
        >
          ← Retour au tableau de bord
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded-2xl text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">Votre profil a été enregistré avec succès !</span>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="underline font-bold text-white hover:text-emerald-300 cursor-pointer"
          >
            Voir les offres ouvertes →
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/80 text-rose-300 border border-rose-800/60 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informations Personnelles */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Informations personnelles</h2>
              <p className="text-[11px] text-slate-400">Votre identité et coordonnées de contact</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Prénom</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Nom</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Pays de résidence</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Paris, Lyon, Montréal, Nomade..."
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Expérience de Chatter & Langues */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Expérience de chatter & Langues</h2>
              <p className="text-[11px] text-slate-400">Niveau de maîtrise en messagerie</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Niveau d'expérience en chatter
              </label>
              <select
                value={chatterExperience}
                onChange={(e) => setChatterExperience(e.target.value as ExperienceLevel)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs font-medium cursor-pointer"
              >
                <option value="Débutant">Débutant (0 expérience - Motivé)</option>
                <option value="Moins de 6 mois">Moins de 6 mois d'expérience</option>
                <option value="6 mois à 1 an">6 mois à 1 an d'expérience</option>
                <option value="1 à 2 ans">1 à 2 ans d'expérience</option>
                <option value="Plus de 2 ans">Plus de 2 ans (Confirmé / Pro)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Tranche d'âge</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs font-medium cursor-pointer"
              >
                <option value="18-24">18 - 24 ans</option>
                <option value="25-34">25 - 34 ans</option>
                <option value="35-44">35 - 44 ans</option>
                <option value="45+">45 ans et plus</option>
              </select>
            </div>
          </div>

          {/* Languages list */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Langues maîtrisées à l'écrit</label>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une langue</span>
              </button>
            </div>

            {languages.map((l, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-[#181818] p-3 rounded-xl border border-white/10">
                <input
                  type="text"
                  value={l.language}
                  onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                  placeholder="Ex: Français, Anglais, Espagnol..."
                  className="flex-1 p-2 border border-white/10 rounded-lg bg-[#202020] text-white text-xs"
                />
                <select
                  value={l.level}
                  onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                  className="p-2 border border-white/10 rounded-lg bg-[#202020] text-white text-xs cursor-pointer"
                >
                  <option value="Notions">Notions</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Courant">Courant</option>
                  <option value="Bilingue / Natif">Bilingue / Natif</option>
                </select>
                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Disponibilités & Organisation */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Disponibilités & Rythme</h2>
              <p className="text-[11px] text-slate-400">Vos créneaux et fuseau horaire</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Volume d'heures souhaité
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs font-medium cursor-pointer"
              >
                <option value="Temps partiel (10-15h)">Temps partiel (10-15h / semaine)</option>
                <option value="Temps partiel (15-25h)">Temps partiel (15-25h / semaine)</option>
                <option value="Temps plein (30-40h)">Temps plein (30-40h / semaine)</option>
                <option value="Week-end uniquement">Week-end uniquement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Créneaux préférentiels
              </label>
              <select
                value={timeSlots}
                onChange={(e) => setTimeSlots(e.target.value)}
                className="w-full p-2.5 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 text-xs font-medium cursor-pointer"
              >
                <option value="Soirée (18h-23h)">Soirée (18h-23h)</option>
                <option value="Nuit (23h-04h)">Nuit (23h-04h)</option>
                <option value="Journée (09h-17h)">Journée (09h-17h)</option>
                <option value="Flexible / Variable">Flexible / Variable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Présentation & Compétences */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/50">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Présentation & Compétences</h2>
              <p className="text-[11px] text-slate-400">Présentez vos atouts personnels</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Présentation personnelle (Bio)
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Présentez votre style de communication, votre rigueur et pourquoi vous souhaitez chatter pour des créatrices..."
                className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs leading-relaxed bg-[#181818] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Compétences clés <span className="text-slate-400 font-normal">(séparées par des virgules)</span>
              </label>
              <input
                type="text"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                placeholder="Ex: Orthographe irréprochable, Vente persuasive, Empathie, Gestion des objections, Discrétion..."
                className="w-full p-2.5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs bg-[#181818] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Expérience professionnelle passée
              </label>
              <textarea
                rows={3}
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                placeholder="Parcours précédent (relation client, vente, réseaux sociaux, chatter pour créateurs...)"
                className="w-full p-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs leading-relaxed bg-[#181818] text-white placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer mon profil'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
