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
} from 'lucide-react';

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
    const updated = [...languages];
    updated[idx] = { ...updated[idx], [field]: val };
    setLanguages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

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
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Profil de chatter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ces informations sont automatiquement présentées lors de vos candidatures aux offres
            publiées.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 self-start sm:self-auto"
        >
          Retour au tableau de bord
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Votre profil a été mis à jour avec succès !</span>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="underline font-semibold hover:text-emerald-950"
          >
            Découvrir les offres
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informations Personnelles */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Informations personnelles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prénom</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pays de résidence</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ex: France, Belgique, Suisse, Canada..."
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Lyon, Paris, Montréal..."
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tranche d'âge</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="18-24">18 - 24 ans</option>
                <option value="25-34">25 - 34 ans</option>
                <option value="35-44">35 - 44 ans</option>
                <option value="45+">45 ans et plus</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Adresse email de contact</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Expérience en Chatter */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Expérience en chatter & Langues</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* The exact 5 levels specified in brief */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Expérience en chatter <span className="text-slate-400 font-normal">(Votre situation exacte)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {(
                  [
                    'Débutant',
                    'Moins de 6 mois',
                    '6 mois à 1 an',
                    '1 à 2 ans',
                    'Plus de 2 ans',
                  ] as ExperienceLevel[]
                ).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setChatterExperience(lvl)}
                    className={`p-3 text-center rounded border transition-colors ${
                      chatterExperience === lvl
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Table */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-700">Langues parlées & niveau</label>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une langue</span>
                </button>
              </div>

              <div className="space-y-2">
                {languages.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.language}
                      onChange={(e) => handleUpdateLanguage(idx, 'language', e.target.value)}
                      placeholder="Langue (ex: Français, Anglais)"
                      className="flex-1 p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={item.level}
                      onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                      className="w-48 p-2 border border-slate-200 rounded bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Débutant">Notions / Débutant</option>
                      <option value="Intermédiaire">Intermédiaire (écrit fluide)</option>
                      <option value="Courant">Courant</option>
                      <option value="Bilingue / Natif">Bilingue / Langue maternelle</option>
                    </select>
                    {languages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Disponibilités & Organisation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Disponibilités & Rythme de travail</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Volume d'heures disponible
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Temps partiel (10-15h / semaine)">Temps partiel (10-15h / semaine)</option>
                <option value="Temps partiel (15-25h / semaine)">Temps partiel (15-25h / semaine)</option>
                <option value="Temps plein (35h+ / semaine)">Temps plein (35h+ / semaine)</option>
                <option value="Week-ends uniquement">Week-ends uniquement</option>
                <option value="Horaires de nuit uniquement">Horaires de nuit uniquement</option>
                <option value="Très flexible selon les besoins">Très flexible selon les besoins</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fuseau horaire</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Ex: UTC+1 (Paris), UTC-4 (Montréal)..."
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Créneaux horaires préférés
              </label>
              <input
                type="text"
                value={timeSlots}
                onChange={(e) => setTimeSlots(e.target.value)}
                placeholder="Ex: Soirée (18h-00h), Matinée, Après-midi, Nuit..."
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Type de travail</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Télétravail 100%">Télétravail 100%</option>
                <option value="Horaires décalés">Horaires décalés</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Présentation & Compétences */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Présentation & Compétences</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Présentation personnelle (bio)
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Présentez votre style de communication, votre rigueur et pourquoi vous souhaitez chatter pour des créatrices..."
                className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Compétences clés <span className="text-slate-400 font-normal">(séparées par des virgules)</span>
              </label>
              <input
                type="text"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                placeholder="Ex: Orthographe irréprochable, Vente persuasive, Empathie, Gestion des objections, Discrétion..."
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Expérience professionnelle passée (détail)
              </label>
              <textarea
                rows={3}
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                placeholder="Parcours précédent (relation client, vente, réseaux sociaux, chatter pour créateurs...)"
                className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer mon profil'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
