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
  Zap,
  TrendingUp,
  MessageSquare,
  Lock,
  MessageCircle,
  CheckCheck,
  Send,
  Star,
  Users,
  Award,
  ChevronRight,
  Headphones,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../components/ui/Badge.js';
import { JobCardSkeleton } from '../components/ui/Skeleton.js';
import { HeroShowcase } from '../components/home/HeroShowcase.js';
import { InteractiveChatDemo } from '../components/home/InteractiveChatDemo.js';
import { EarningsCalculator } from '../components/home/EarningsCalculator.js';
import { FaqSection } from '../components/home/FaqSection.js';

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
    <div className="space-y-24 sm:space-y-36 pb-24 overflow-hidden bg-[#050505] text-slate-100">
      {/* =========================================================================
          1. HERO SECTION : Grand titre blanc, dark premium et grande composition visuelle
          ========================================================================= */}
      <section className="relative pt-10 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle dark ambient glow behind hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-12rem)] aspect-[1155/678] w-[42rem] -translate-x-1/2 rotate-[25deg] bg-gradient-to-tr from-indigo-950/30 via-violet-900/20 to-slate-900/30 opacity-40 sm:left-[calc(50%-28rem)] sm:w-[80rem]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and Strong Value Prop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-7 text-left"
            >
              {/* Badge Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Plateforme certifiée · Débutants & confirmés acceptés</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight text-white leading-[1.12] text-balance font-display">
                Devenez chatter pour des{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-300">
                  créatrices de contenu
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl text-balance">
                Accédez à des missions de messagerie rémunérées, 100% en télétravail avec des
                horaires flexibles. Rémunération fixe + pourcentages sur les ventes, vérifiées en
                direct par notre équipe.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-7 py-3.5 text-sm font-bold text-slate-950 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Voir les opportunités</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-[#141414] hover:bg-[#1c1c1c] border border-white/10 rounded-xl transition-all hover:border-white/20 shadow-xs inline-flex items-center justify-center cursor-pointer"
                >
                  Créer mon compte candidat
                </button>
              </div>

              {/* Social proof & credentials */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <img
                      src="/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg"
                      alt="Avatar"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#050505] object-cover"
                    />
                    <img
                      src="/src/assets/images/chatter_remote_working_1791469957033.jpg"
                      alt="Avatar"
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#050505] object-cover"
                    />
                    <div className="inline-flex h-7 w-7 rounded-full bg-indigo-600 text-white font-bold text-[10px] items-center justify-center ring-2 ring-[#050505]">
                      +300
                    </div>
                  </div>
                  <span className="font-semibold text-slate-200">Chatters formés & actifs</span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  <span className="text-white">4.9/5</span>
                  <span className="text-slate-400 font-normal">satisfaction candidats</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual Showcase Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
              className="lg:col-span-6"
            >
              <HeroShowcase navigate={navigate} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BANDEAU DE CHIFFRES CLÉS & CONFIANCE (DARK SECTION #0a0a0a)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b0b0b] rounded-3xl border border-white/10 p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="text-center pt-3 md:pt-0">
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-display block">
              100%
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Télétravail sans frontière
            </span>
          </div>

          <div className="text-center pt-3 md:pt-0 md:pl-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-indigo-400 font-display block">
              48h
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Délai moyen de réponse
            </span>
          </div>

          <div className="text-center pt-3 md:pt-0 md:pl-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-white font-display block">
              1 800€ - 3 500€
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Revenus mensuels moyens
            </span>
          </div>

          <div className="text-center pt-3 md:pt-0 md:pl-4">
            <span className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-display block">
              0 €
            </span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">
              Inscription & formation gratuites
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. BENTO GRID : L'ÉCOSYSTÈME DU CHATTER MODERNE (CARTES #111111 / #151515)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="indigo" size="md">
            Pourquoi devenir chatter ?
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Une opportunité unique conçue pour votre liberté
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Rejoignez une activité florissante où vos talents de communication se transforment en
            revenus récurrents.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: 100% Remote & Freedom (Large 7 cols) */}
          <div className="md:col-span-7 bg-[#111111] rounded-3xl p-7 sm:p-9 border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center border border-indigo-800/40">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Liberté géographique totale & 100% Télétravail
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Travaillez depuis votre domicile, un espace de coworking ou en voyage à l'autre bout
                du monde. Un ordinateur et une connexion Internet stable suffisent pour gérer vos
                sessions de messagerie.
              </p>
            </div>

            {/* Visual mini-snippet preview inside card */}
            <div className="mt-6 bg-[#181818] rounded-2xl p-4 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  Connexion depuis n'importe où
                </span>
              </div>
              <span className="font-mono text-indigo-400 font-bold">Paris · Lisbonne · Bali</span>
            </div>
          </div>

          {/* Bento Card 2: Commissions motivantes (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#161616] to-[#0f1422] text-white rounded-3xl p-7 sm:p-9 border border-white/10 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center border border-white/10">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Revenus déplafonnés avec les commissions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Chaque vente de photo, vidéo ou pourboire débloqué dans la conversation vous rapporte
                un pourcentage direct (15% à 20% du montant net).
              </p>
            </div>

            <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Commission moyenne :</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">+15% à +20%</span>
            </div>
          </div>

          {/* Bento Card 3: Débutants bienvenus (5 cols) */}
          <div className="md:col-span-5 bg-[#111111] rounded-3xl p-7 sm:p-9 border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Accessible aux débutants avec formation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pas besoin d'avoir déjà été chatter. Nous fournissons pour chaque créatrice les
                scripts types, le ton de communication et les consignes pour démarrer en confiance.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-800/50">
              <Check className="w-4 h-4" />
              <span>Scripts & fiches personas inclus</span>
            </div>
          </div>

          {/* Bento Card 4: Anonymat garanti & sécurité (7 cols) */}
          <div className="md:col-span-7 bg-[#111111] rounded-3xl p-7 sm:p-9 border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#1c1c1c] text-slate-300 flex items-center justify-center border border-white/10">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Anonymat total & protection de votre vie privée
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Vous écrivez sous le compte officiel de la créatrice. Votre véritable identité n'est
                jamais divulguée aux abonnés. Tout est encadré par des contrats sécurisés.
              </p>
            </div>

            <div className="mt-6 bg-[#181818] rounded-2xl p-4 border border-white/5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Confidentialité et conformité contractuelle assurées</span>
              </div>
              <span className="font-bold text-indigo-400">100% discret</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SIMULATEUR INTERACTIF DE CONVERSATION (DARK COMPONENT)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="indigo" size="md">
            Démonstration live
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Comment se passe une session de chat ?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Mettez-vous dans la peau d'un chatter et testez les différentes réponses possibles face
            à un abonné.
          </p>
        </div>

        <InteractiveChatDemo />
      </section>

      {/* =========================================================================
          5. SIMULATEUR DE REVENUS INTERACTIF
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EarningsCalculator navigate={navigate} />
      </section>

      {/* =========================================================================
          6. DERNIÈRES OFFRES EN LIGNE (CARTES NOIRES #111111)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="indigo" size="md">
              Opportunités actives
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2 font-display">
              Dernières offres de chatter en ligne
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Consultez les missions validées et déposez votre candidature en 2 minutes.
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto group cursor-pointer"
          >
            <span>Toutes les opportunités</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-2xl transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Badges row */}
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
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 font-display">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2.5">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Rémunération
                    </span>
                    <span className="text-sm font-bold text-white">{job.compensation}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-slate-200 bg-[#181818] hover:bg-white hover:text-slate-900 rounded-xl transition-all text-center inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Consulter l'offre</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-12 text-center text-slate-400 text-sm">
            Aucune offre publiée pour le moment.
          </div>
        )}
      </section>

      {/* =========================================================================
          7. TÉMOIGNAGES DE CHATTERS (CARTES #111111)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="indigo" size="md">
            Retours d'expérience
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Ce que nos chatters en disent
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Découvrez le quotidien de personnes qui ont trouvé leur mission via ChatterLink.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-[#111111] rounded-3xl p-7 border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md font-bold">
                  1 950 € / mois
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "Étant étudiant, je cherchais un job sans horaires imposés en journée. Je prends le
                créneau 20h-00h depuis ma chambre. En 3 semaines, les commissions ont dépassé mon
                fixe."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                src="/src/assets/images/chatter_remote_working_1791469957033.jpg"
                alt="Lucas"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white block">Lucas M., 23 ans</span>
                <span className="text-[11px] text-slate-400">Chatter débutant · Lyon</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[#111111] rounded-3xl p-7 border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md font-bold">
                  2 400 € / mois
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "La transition après mon ancien emploi s'est faite très vite. L'administrateur
                ChatterLink m'a transmis des scripts hyper bien construits. C'est un vrai métier de
                relation client où l'empathie fait la différence."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                src="/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg"
                alt="Sarah"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white block">Sarah D., 27 ans</span>
                <span className="text-[11px] text-slate-400">Chatteuse confirmée · Bordeaux</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-[#111111] rounded-3xl p-7 border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md font-bold">
                  3 150 € / mois
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "Je vis à Lisbonne et je travaille 25h par semaine pour deux créatrices différentes.
                La flexibilité est totale et les virements sont toujours à l'heure chaque semaine."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                src="/src/assets/images/auth_creative_community_1791468568184.jpg"
                alt="Julien"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white block">Julien R., 29 ans</span>
                <span className="text-[11px] text-slate-400">Digital Nomad · Lisbonne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ SECTION (DARK THEME)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection />
      </section>

      {/* =========================================================================
          9. BANNIÈRE DE CONFIANCE & CALL TO ACTION FINAL
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0c0c0c] text-white border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Left content */}
          <div className="lg:col-span-7 p-8 sm:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
              <Lock className="w-3.5 h-3.5" />
              <span>Processus confidentiel & sécurisé</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-white font-display">
              Prêt(e) à démarrer votre activité de chatter ?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Créez votre compte candidat en 2 minutes, renseignez vos disponibilités et postulez
              aux opportunités ouvertes dès aujourd'hui.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Offres réelles vérifiées par l'administrateur.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anonymat et intégrité préservés à 100%.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rémunération transparente sans frais cachés.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Accompagnement et fiches guides incluses.</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-md cursor-pointer text-center"
              >
                Créer mon profil candidat
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-3.5 text-xs font-semibold text-white bg-[#181818] hover:bg-[#202020] border border-white/10 rounded-xl transition-all cursor-pointer text-center"
              >
                Consulter les offres ouvertes
              </button>
            </div>
          </div>

          {/* Right visual photo with subtle fade */}
          <div className="lg:col-span-5 h-full min-h-[340px] lg:min-h-[480px] relative">
            <img
              src="/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg"
              alt="Créatrice de contenu souriante"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center filter saturate-105 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c0c0c] via-transparent to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
};
