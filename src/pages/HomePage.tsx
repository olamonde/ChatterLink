import React, { useEffect, useState } from 'react';
import type { Job } from '../types/index.js';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
  MapPin,
  Globe,
  Briefcase,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) {
          setRecentJobs(data.jobs.slice(0, 3));
        }
      })
      .catch((err) => console.error('Failed to load jobs on homepage', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Quiet kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            <span>Opportunités vérifiées · Débutants et profils expérimentés</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
            Trouvez votre prochaine opportunité de <span className="text-indigo-600">chatter</span> pour des créatrices de contenu
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
            Une plateforme claire et professionnelle pour postuler à des missions de chatter
            soigneusement qualifiées. Que vous débutiez ou ayez déjà de l'expérience, accédez à des
            offres concrètes avec des conditions claires et transparentes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              <span>Voir les opportunités</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Créer mon compte
            </button>
          </div>

          {/* Simple proof note */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Offres vérifiées et publiées par la direction</span>
            </div>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Débutants acceptés sur les offres dédiées</span>
            </div>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>100% télétravail</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Comment ça marche */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Comment ça marche ?
          </h2>
          <p className="text-sm text-slate-600">
            Un processus de candidature direct, sans intermédiaire superflu, conçu pour vous faire
            gagner du temps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
            <div className="text-xs font-mono font-semibold text-indigo-600">01</div>
            <h3 className="text-base font-semibold text-slate-900">Créez votre compte</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inscription rapide en moins d'une minute avec votre nom et votre adresse email.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
            <div className="text-xs font-mono font-semibold text-indigo-600">02</div>
            <h3 className="text-base font-semibold text-slate-900">Complétez votre profil</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Indiquez votre niveau d'expérience, vos langues parlées, vos disponibilités et votre style.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
            <div className="text-xs font-mono font-semibold text-indigo-600">03</div>
            <h3 className="text-base font-semibold text-slate-900">Découvrez les opportunités</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consultez les offres actuellement ouvertes : créneaux, langues, rémunération et profil recherché.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
            <div className="text-xs font-mono font-semibold text-indigo-600">04</div>
            <h3 className="text-base font-semibold text-slate-900">Postulez aux offres</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Envoyez votre candidature avec vos disponibilités et suivez l'avancement de votre dossier en direct.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Offres récentes */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Dernières opportunités publiées
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consultez les offres vérifiées actuellement ouvertes aux candidatures.
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Voir toutes les offres</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-50 rounded" />
              </div>
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  {/* Clean unboxed metadata (zero-pill rule) */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                    <span>{job.workType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.languages.join(', ')}</span>
                    {job.beginnerFriendly && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 font-medium">Débutant accepté</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs text-slate-700">
                    <span className="text-slate-500">Rémunération : </span>
                    <span className="font-semibold text-slate-900">{job.compensation}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center"
                  >
                    Consulter l'offre
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-sm">
            Aucune offre publiée pour le moment.
          </div>
        )}
      </section>

      {/* 4. Section expliquant la publication et la vérification */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="text-xs font-mono font-medium text-indigo-400 uppercase tracking-wider">
              Qualité & Confidentialité
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Des opportunités réelles, vérifiées et encadrées
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Les créatrices de contenu ne créent pas de compte public sur notre plateforme : elles
              nous contactent directement en privé pour nous faire part de leurs besoins.
              L'administrateur de ChatterLink vérifie chaque mission, définit des exigences précises
              et publie l'offre sur la plateforme.
            </p>
            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Aucune fausse offre ni annonce fantôme.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Les identités des créatrices restent protégées.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Les profils débutants sont encadrés lorsqu'une offre les accepte.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-6 space-y-4 text-center">
            <div className="text-xs text-slate-300">
              Prêt(e) à démarrer vos candidatures ?
            </div>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors"
            >
              Créer mon profil candidat
            </button>
            <div className="text-[11px] text-slate-400">
              Accès immédiat et gratuit aux opportunités
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
