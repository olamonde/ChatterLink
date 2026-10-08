import React, { useState } from 'react';
import {
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Sparkles,
  Send,
  CheckCheck,
  ShieldCheck,
  DollarSign,
  Clock,
  ArrowRight,
  Smile,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroShowcase: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'earnings' | 'schedule'>('chat');

  return (
    <div className="relative mx-auto max-w-xl lg:max-w-none">
      {/* Decorative ambient deep dark gradient aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-950/40 via-violet-950/30 to-amber-950/20 rounded-3xl blur-2xl pointer-events-none" />

      {/* Main Showcase Dark Window Container */}
      <div className="relative rounded-3xl bg-[#0e0e0e] border border-white/10 shadow-2xl overflow-hidden">
        {/* Top Window Bar */}
        <div className="bg-[#090909] text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[11px] font-mono text-slate-400 hidden sm:inline">
              ChatterLink Station · Session Active
            </span>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl text-xs font-medium border border-white/5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discussion</span>
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'earnings'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gains</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Planning</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Chat Session with Grand Human Photo & Layered Discussion */}
        {activeTab === 'chat' && (
          <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#080808] min-h-[460px] flex flex-col justify-between">
            {/* Split Composition: Large Photo of Creator with Floating UI + Live Chat Thread */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
              {/* Creator Editorial Portrait Card (5 cols on sm+) */}
              <div className="sm:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 bg-[#161616] min-h-[200px] sm:min-h-[290px] shadow-lg group">
                <img
                  src="/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg"
                  alt="Créatrice de contenu partenaire"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Subtle dark gradient overlay to ensure UI elements pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent" />

                {/* Top Badge: Verified Creator */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>En direct</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    +15% comm.
                  </span>
                </div>

                {/* Bottom Creator Info Card */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight">Éléonore R.</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-[10px] text-slate-300 flex items-center justify-between">
                    <span>Créatrice Lifestyle</span>
                    <span className="text-indigo-300 font-semibold">120k fans</span>
                  </div>
                </div>
              </div>

              {/* Chat Thread & Direct Commissions (7 cols on sm+) */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
                {/* Chat status bar */}
                <div className="bg-[#161616] rounded-xl px-3 py-2 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40 flex items-center justify-center font-bold text-[10px]">
                      TOI
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white block leading-tight">
                        Poste Chatter Actif
                      </span>
                      <span className="text-[10px] text-slate-400">Créneau : 18h - 23h</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                    Connecté
                  </span>
                </div>

                {/* Simulated Conversation bubbles */}
                <div className="space-y-2.5 text-xs">
                  {/* Subscriber message bubble */}
                  <div className="flex flex-col items-start max-w-[92%]">
                    <span className="text-[10px] text-slate-500 font-medium mb-1 ml-1 flex items-center gap-1">
                      <span>Abonné VIP (Maxime)</span>
                      <span>· 18:24</span>
                    </span>
                    <div className="bg-[#181818] rounded-2xl rounded-tl-xs p-3 border border-white/10 text-slate-200 leading-relaxed shadow-xs text-[11px]">
                      "Coucou Éléonore ! Trop fan de tes stories en Italie 😍 Tu as prévu d'envoyer la capsule vidéo des coulisses privées ?"
                    </div>
                  </div>

                  {/* Chatter response bubble */}
                  <div className="flex flex-col items-end max-w-[92%] ml-auto">
                    <span className="text-[10px] text-indigo-400 font-medium mb-1 mr-1">
                      Toi (Chatter) · 18:25
                    </span>
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-xs p-3 shadow-md leading-relaxed border border-indigo-500/30 text-[11px]">
                      "Hello Maxime ! Oui absolument, j'ai préparé une vidéo inédite de 8 min avec tous les secrets. Je te l'envoie tout de suite !"
                      <div className="flex items-center justify-end gap-1 text-[9px] text-indigo-200 mt-1">
                        <span>18:25</span>
                        <CheckCheck className="w-3 h-3 text-indigo-200" />
                      </div>
                    </div>
                  </div>

                  {/* Live Conversion Trigger */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0b1f14] border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-emerald-300 shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-white block leading-tight">
                          Pack débloqué à 60 €
                        </span>
                        <span className="text-[9px] text-emerald-400">Paiement validé par l'abonné</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono">+9,00 €</span>
                      <span className="block text-[8px] text-slate-400 font-medium">15% commission</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Input Bar Simulation */}
            <div className="bg-[#151515] rounded-2xl p-2 border border-white/10 shadow-xs flex items-center gap-2 mt-1">
              <input
                type="text"
                readOnly
                value="Génial Maxime, capsule envoyée ! Bon visionnage 🙌"
                className="flex-1 text-xs bg-[#101010] text-slate-300 px-3 py-2 rounded-xl border border-white/5 focus:outline-none"
              />
              <button
                type="button"
                className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Live Earnings Dashboard */}
        {activeTab === 'earnings' && (
          <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#080808] min-h-[460px]">
            {/* Header with real human profile badge */}
            <div className="bg-[#161616] rounded-2xl p-3 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/chatter_remote_working_1791469957033.jpg"
                  alt="Lucas Chatter"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Lucas M. (Chatter Actif)</span>
                    <span className="text-[10px] bg-emerald-950/70 text-emerald-300 px-2 py-0.2 rounded-full font-semibold border border-emerald-800/40">
                      Vérifié
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Poste : Créatrice Lifestyle · 20h / semaine</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                Objectif : 118%
              </span>
            </div>

            {/* Big Number Card */}
            <div className="bg-[#151515] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-md grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Revenu cumulé ce mois</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
                  2 480 €
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +340 € ces 7 derniers jours
                </span>
              </div>

              <div className="border-l border-white/10 pl-4 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Fixe garanti</span>
                  <span className="font-bold text-white">1 200 €</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Commissions (15-20%)</span>
                  <span className="font-bold text-indigo-400">1 280 €</span>
                </div>
              </div>
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400 text-[10px] block">Messages traités</span>
                <span className="text-sm font-bold text-white">1 420</span>
              </div>
              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400 text-[10px] block">Taux conversion</span>
                <span className="text-sm font-bold text-indigo-400">26.4%</span>
              </div>
              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 text-center">
                <span className="text-slate-400 text-[10px] block">Paiement reçu</span>
                <span className="text-sm font-bold text-emerald-400">Chaque ven.</span>
              </div>
            </div>

            {/* Call to action in tab */}
            <div className="pt-1">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Découvrir les offres avec ce barème</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Schedule & Flexibility */}
        {activeTab === 'schedule' && (
          <div className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#111111] to-[#0c0c0c] min-h-[400px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white">
                  Planning hebdomadaire flexible
                </span>
                <p className="text-[11px] text-slate-400">
                  Choisis tes créneaux selon tes disponibilités
                </p>
              </div>
              <span className="text-[10px] bg-indigo-950/70 text-indigo-300 font-semibold px-2 py-0.5 rounded-md border border-indigo-800/60">
                Total : 20h / semaine
              </span>
            </div>

            {/* Shift cards */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-800/40">
                    LUN
                  </div>
                  <div>
                    <span className="font-bold text-white block">Créneau Soirée</span>
                    <span className="text-[11px] text-slate-400">18h00 - 23h00 (5 heures)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950/70 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Confirmé
                </span>
              </div>

              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-800/40">
                    MAR
                  </div>
                  <div>
                    <span className="font-bold text-white block">Créneau Soirée</span>
                    <span className="text-[11px] text-slate-400">18h00 - 23h00 (5 heures)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950/70 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Confirmé
                </span>
              </div>

              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-800/40">
                    JEU
                  </div>
                  <div>
                    <span className="font-bold text-white block">Créneau Nocturne</span>
                    <span className="text-[11px] text-slate-400">20h00 - 01h00 (5 heures)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950/70 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Confirmé
                </span>
              </div>

              <div className="bg-[#151515] p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#222222] text-slate-300 font-bold flex items-center justify-center text-xs border border-white/10">
                    VEN
                  </div>
                  <div>
                    <span className="font-bold text-white block">Créneau Soirée</span>
                    <span className="text-[11px] text-slate-400">18h00 - 23h00 (5 heures)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950/70 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Confirmé
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center italic">
              Week-end libre ou créneaux optionnels avec primes spéciales.
            </p>
          </div>
        )}
      </div>

      {/* Floating Card 1: Top-Left Dark Premium Notification */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute -top-6 -left-3 sm:-left-6 bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 text-xs animate-float-slow z-20"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/50">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white">Candidature présélectionnée</div>
          <div className="text-[11px] text-slate-400">Créatrice Lifestyle · Début vendredi</div>
        </div>
      </motion.div>

      {/* Floating Card 2: Bottom-Right Dark Premium Notification */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="absolute -bottom-6 -right-3 sm:-right-6 bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 text-xs animate-float-delayed z-20"
      >
        <div className="w-9 h-9 rounded-xl bg-indigo-950/80 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/50">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-white">+420 € de commissions</div>
          <div className="text-[11px] text-slate-400">Viré automatiquement cette semaine</div>
        </div>
      </motion.div>
    </div>
  );
};
