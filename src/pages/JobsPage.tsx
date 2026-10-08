import React, { useEffect, useState } from 'react';
import type { Job } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Search,
  SlidersHorizontal,
  CheckCircle,
  Clock,
  Globe,
  Briefcase,
  ArrowRight,
  X,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../components/ui/Badge.js';
import { JobCardSkeleton } from '../components/ui/Skeleton.js';
import { EmptyState } from '../components/ui/EmptyState.js';

interface JobsPageProps {
  navigate: (path: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ navigate }) => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [experience, setExperience] = useState('all');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [workType, setWorkType] = useState('all');
  const [sort, setSort] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchJobs = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language !== 'all') params.append('language', language);
    if (experience !== 'all') params.append('experience', experience);
    if (beginnerOnly) params.append('beginnerFriendly', 'true');
    if (workType !== 'all') params.append('workType', workType);
    if (sort) params.append('sort', sort);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`/api/jobs?${params.toString()}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error('Error fetching jobs', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [language, experience, beginnerOnly, workType, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const resetFilters = () => {
    setSearch('');
    setLanguage('all');
    setExperience('all');
    setBeginnerOnly(false);
    setWorkType('all');
    setSort('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    language !== 'all' ||
    experience !== 'all' ||
    beginnerOnly ||
    workType !== 'all' ||
    sort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#050505] text-slate-100">
      {/* Visual Header */}
      <div className="space-y-3 max-w-3xl">
        <Badge variant="indigo" size="md">
          Recrutement en direct
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
          Toutes les opportunités de chatter
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Découvrez les missions actuellement publiées par l'équipe ChatterLink pour des créatrices
          de contenu. Toutes les offres acceptant les débutants sont signalées.
        </p>
      </div>

      {/* Modern Search & Filter Panel (Dark Premium) */}
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        {/* Search Bar + Mobile filter toggle */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par mot-clé (lifestyle, anglais, débutant, soirée...)"
              className="w-full pl-10 pr-4 py-3 text-sm border border-white/10 rounded-2xl bg-[#181818] text-white placeholder-slate-500 focus:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-2xl transition-all shadow-md cursor-pointer shrink-0"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden p-3 border border-white/10 rounded-2xl bg-[#181818] text-slate-300 hover:bg-[#202020] flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Filtres"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </form>

        {/* Filter Chips & Selectors */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 text-xs border-t border-white/10 ${
            mobileFiltersOpen ? 'block' : 'hidden sm:grid'
          }`}
        >
          {/* Langue */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Langue requise</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full py-2.5 px-3 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Toutes les langues</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
              <option value="Espagnol">Espagnol</option>
            </select>
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Niveau d'expérience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full py-2.5 px-3 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Tous niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Moins de 6 mois">Moins de 6 mois</option>
              <option value="6 mois à 1 an">6 mois à 1 an</option>
              <option value="1 à 2 ans">1 à 2 ans</option>
              <option value="Plus de 2 ans">Plus de 2 ans</option>
            </select>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Trier par</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2.5 px-3 border border-white/10 rounded-xl bg-[#181818] text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="newest">Plus récentes d'abord</option>
              <option value="oldest">Plus anciennes</option>
            </select>
          </div>

          {/* Débutant uniquement toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer py-2.5 px-3 bg-[#181818] hover:bg-[#202020] rounded-xl border border-white/10 w-full transition-colors">
              <input
                type="checkbox"
                checked={beginnerOnly}
                onChange={(e) => setBeginnerOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-white font-semibold select-none text-xs">
                Débutant accepté
              </span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end justify-start sm:justify-end">
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 py-2.5 font-medium cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Effacer les filtres</span>
              </button>
            ) : (
              <div className="text-[11px] text-slate-400 py-2.5">
                {jobs.length} offre(s) active(s)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      {isLoading ? (
        <div className="space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job, idx) => {
            const dateStr = new Date(job.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 hover:border-indigo-500/40 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                <div className="space-y-3 flex-1">
                  {/* Badges line */}
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

                  <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors font-display">
                    {job.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-2xl">
                    {job.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-4 pt-1 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500">Expérience : </span>
                      <span className="font-semibold text-slate-200">{job.requiredExperience}</span>
                    </div>
                    <span aria-hidden="true" className="text-white/10">
                      |
                    </span>
                    <div>
                      <span className="text-slate-500">Horaires : </span>
                      <span className="font-medium text-slate-200">{job.workingHours}</span>
                    </div>
                    <span aria-hidden="true" className="text-white/10">
                      |
                    </span>
                    <div>
                      <span className="text-slate-500">Postes : </span>
                      <span className="font-medium text-slate-200">{job.openingsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Compensation and CTA */}
                <div className="md:w-64 md:border-l md:border-white/10 md:pl-6 flex flex-col justify-between space-y-4 shrink-0">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      Rémunération
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white mt-0.5 block font-display">
                      {job.compensation}
                    </span>
                  </div>

                  {job.candidateApplied ? (
                    <div className="space-y-1.5">
                      <div className="w-full py-2.5 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 rounded-xl text-center flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Candidature envoyée</span>
                      </div>
                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full text-center text-[11px] text-slate-400 hover:text-white font-medium cursor-pointer"
                      >
                        Consulter les détails
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full py-3 px-4 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all text-center inline-flex items-center justify-center gap-1.5 group cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span>Voir et postuler</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="Aucune offre trouvée"
          description="Aucune offre ne correspond à vos critères de recherche actuels. Essayez de réinitialiser vos filtres."
          actionLabel="Réinitialiser les filtres"
          onAction={resetFilters}
        />
      )}
    </div>
  );
};
