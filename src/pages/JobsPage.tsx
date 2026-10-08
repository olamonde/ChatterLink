import React, { useEffect, useState } from 'react';
import type { Job } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Globe,
  Briefcase,
  ArrowRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Opportunités de chatter
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consultez toutes les missions actuellement publiées et qualifiées par notre équipe.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-800">{jobs.length}</span> offre(s) disponible(s)
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-xs">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par mot-clé (lifestyle, fitness, anglais, débutant...)"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            Rechercher
          </button>
        </form>

        {/* Filter controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 text-xs">
          {/* Langue */}
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Langue</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toutes les langues</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
              <option value="Espagnol">Espagnol</option>
            </select>
          </div>

          {/* Expérience requise */}
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Expérience requise</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
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
            <label className="block text-slate-500 mb-1 font-medium">Trier par</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-1.5 px-2.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
            </select>
          </div>

          {/* Débutant uniquement */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer py-2">
              <input
                type="checkbox"
                checked={beginnerOnly}
                onChange={(e) => setBeginnerOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700 font-medium select-none">Débutant accepté</span>
            </label>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 py-2 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Grid / List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-pulse"
            >
              <div className="h-5 bg-slate-100 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
              <div className="h-12 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => {
            const dateStr = new Date(job.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  {/* Zero-pill metadata line */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                    <span>{job.workType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.languages.join(', ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>Expérience : {job.requiredExperience}</span>
                    {job.beginnerFriendly && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 font-medium">Débutant accepté</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Publiée le {dateStr}</span>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-4 pt-1 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400">Horaires : </span>
                      <span className="font-medium text-slate-700">{job.workingHours}</span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <div>
                      <span className="text-slate-400">Postes ouverts : </span>
                      <span className="font-medium text-slate-700">{job.openingsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Right col: Compensation & Action */}
                <div className="md:w-64 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-between space-y-4 shrink-0">
                  <div>
                    <div className="text-[11px] text-slate-400">Rémunération</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {job.compensation}
                    </div>
                  </div>

                  {job.candidateApplied ? (
                    <div className="space-y-1">
                      <div className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md text-center flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Candidature envoyée</span>
                      </div>
                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="w-full text-center text-[11px] text-slate-500 hover:text-slate-800"
                      >
                        Consulter les détails
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full py-2 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors text-center inline-flex items-center justify-center gap-1.5"
                    >
                      <span>Voir et postuler</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <p className="text-slate-600 text-sm">
            Aucune offre ne correspond à vos critères de recherche.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
