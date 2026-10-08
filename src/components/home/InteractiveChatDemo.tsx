import React, { useState } from 'react';
import {
  MessageCircle,
  Sparkles,
  CheckCheck,
  Send,
  Zap,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScenarioOption {
  id: string;
  label: string;
  strategy: string;
  chatterText: string;
  subscriberReply: string;
  saleAmount: number;
  commission: number;
  feedback: string;
}

const SCENARIOS: ScenarioOption[] = [
  {
    id: 'opt1',
    label: 'Option 1 : Chaleureuse & valorisante (Recommandée)',
    strategy: 'Valorise l’abonné et propose le contenu exclusif en douceur',
    chatterText:
      'Coucou Thomas ! Ça me fait tellement plaisir de te lire 🥰 Justement, je sors tout juste du shooting et j’ai sélectionné 12 photos inédites en avant-première rien que pour mes abonnés fidèles. Je te les envoie ici ?',
    subscriberReply:
      'Avec grand plaisir ! Tu es toujours sublime, j’ai trop hâte de voir ça. Je prends le pack tout de suite ! 🔥',
    saleAmount: 45,
    commission: 9,
    feedback:
      'Excellente approche ! L’abonné se sent privilégié et passe à l’achat naturellement.',
  },
  {
    id: 'opt2',
    label: 'Option 2 : Directe & spontanée',
    strategy: 'Propose la vidéo bonus en direct avec une pointe de mystère',
    chatterText:
      'Hello Thomas ! Tu as vu ma dernière story ? J’ai tourné une vidéo de 4 min ultra intime en rentrant ce soir. Tu veux la débloquer en avant-première ?',
    subscriberReply:
      'Carrément ! C’est exactement le genre de contenu que j’adore, envoie-moi le lien ! 😉',
    saleAmount: 35,
    commission: 7,
    feedback:
      'Approche efficace et dynamique. Le sentiment d’exclusivité fonctionne à merveille.',
  },
  {
    id: 'opt3',
    label: 'Option 3 : Conversationnelle & complice',
    strategy: 'Prend d’abord le temps d’échanger avant de proposer le pack',
    chatterText:
      'Merci Thomas ! Comment s’est passée ta journée ? Si tu as besoin d’un peu de réconfort pour décompresser, j’ai quelques clichés inédits très doux qui vont te plaire...',
    subscriberReply:
      'Une journée épuisante au boulot... ton message me fait un bien fou ! Oui avec plaisir pour les photos.',
    saleAmount: 50,
    commission: 10,
    feedback: 'Très belle écoute active. La fidélisation est maximale sur le long terme.',
  },
];

export const InteractiveChatDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioOption | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<'idle' | 'chatterSent' | 'subscriberReplied'>('idle');

  const handleSelect = (scenario: ScenarioOption) => {
    setSelectedScenario(scenario);
    setStep('chatterSent');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setStep('subscriberReplied');
    }, 1200);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setStep('idle');
    setIsTyping(false);
  };

  return (
    <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Interactive Scenario Selector */}
      <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#121212]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
            <Zap className="w-3.5 h-3.5" />
            <span>Simulateur interactif</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Testez une situation réelle de chatter
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Un abonné régulier vous envoie un message sur la plateforme. Choisissez votre réponse
            pour voir l'impact en direct sur la conversion et vos commissions.
          </p>
        </div>

        {/* Choice Buttons */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Choisissez votre réponse :
          </span>
          {SCENARIOS.map((sc) => {
            const isSelected = selectedScenario?.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelect(sc)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/50 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-white/10 hover:border-white/20 bg-[#181818] hover:bg-[#1e1e1e]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{sc.label}</span>
                  <span className="text-emerald-400 font-mono">+{sc.commission} €</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{sc.strategy}</p>
              </button>
            );
          })}
        </div>

        {selectedScenario && (
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tester une autre réponse</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Live Chat Preview Container in Pure Dark */}
      <div className="lg:col-span-6 bg-[#090909] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[460px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg"
                alt="Créatrice"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090909]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                Session pour Éléonore R.
              </span>
              <span className="text-[11px] text-slate-400">Discussion avec Thomas (Abonné)</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Commission</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">20% sur vente</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-4 py-4 flex-1 overflow-y-auto text-xs">
          {/* Initial Subscriber message */}
          <div className="flex flex-col items-start max-w-[90%]">
            <span className="text-[10px] text-slate-500 mb-1 ml-1">Thomas · 19:12</span>
            <div className="bg-[#181818] text-slate-200 rounded-2xl rounded-tl-xs p-3.5 border border-white/10 leading-relaxed shadow-sm">
              "Coucou Éléonore ! J'ai vu que tu étais à Paris ce week-end. Tu as fait de nouvelles
              photos ?"
            </div>
          </div>

          {/* If Candidate selected a scenario */}
          <AnimatePresence>
            {selectedScenario && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-end max-w-[90%] ml-auto"
              >
                <span className="text-[10px] text-indigo-400 mb-1 mr-1">Toi (Chatter) · 19:13</span>
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-3.5 leading-relaxed shadow-md border border-indigo-500/30">
                  {selectedScenario.chatterText}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-indigo-200 mt-1">
                    <span>19:13</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subscriber Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.4s]" />
              <span className="text-[10px] text-slate-400 ml-1">Thomas est en train d'écrire...</span>
            </div>
          )}

          {/* Subscriber Reply */}
          {step === 'subscriberReplied' && selectedScenario && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex flex-col items-start max-w-[90%]">
                <span className="text-[10px] text-slate-500 mb-1 ml-1">Thomas · 19:14</span>
                <div className="bg-[#181818] text-slate-200 rounded-2xl rounded-tl-xs p-3.5 border border-white/10 leading-relaxed shadow-sm">
                  {selectedScenario.subscriberReply}
                </div>
              </div>

              {/* Commission Pop */}
              <div className="bg-[#092214] border border-emerald-500/40 rounded-2xl p-4 text-emerald-300 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Vente débloquée : {selectedScenario.saleAmount} €
                    </span>
                    <span className="text-[11px] text-emerald-400">
                      {selectedScenario.feedback}
                    </span>
                  </div>
                </div>
                <div className="text-right pl-3">
                  <span className="text-base font-extrabold text-emerald-400 font-mono block">
                    +{selectedScenario.commission} €
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Commission
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {!selectedScenario && (
            <div className="text-center py-8 text-slate-500 text-xs italic">
              👈 Cliquez sur une option à gauche pour simuler votre réponse.
            </div>
          )}
        </div>

        {/* Bottom Safety Tip */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Guides de discussion et fiches personas fournis pour chaque créatrice.</span>
        </div>
      </div>
    </div>
  );
};
