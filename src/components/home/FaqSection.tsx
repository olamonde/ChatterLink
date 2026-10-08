import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Faut-il de l’expérience préalable pour devenir chatter ?',
    answer:
      'Non ! De nombreuses offres sur ChatterLink acceptent les débutants complets. Les créatrices fournissent des fiches personas complètes et des guides de conversation avec des exemples types de réponses. Les seules qualités requises sont une excellente maîtrise du français écrit (orthographe et syntaxe irréprochables), de la bienveillance et une bonne régularité.',
  },
  {
    question: 'Quel matériel informatique est indispensable ?',
    answer:
      'Un ordinateur portable ou fixe avec une connexion Internet stable et rapide est vivement recommandé pour taper rapidement et gérer confortablement les échanges. Pour certains créneaux d’appoint, un smartphone récent suffit largement.',
  },
  {
    question: 'Dois-je montrer mon visage ou révéler mon identité aux abonnés ?',
    answer:
      'Absolument jamais. Vous chatter exclusivement derrière le compte officiel de la créatrice. Les abonnés discutent avec elle, et votre identité civile reste 100% confidentielle et protégée.',
  },
  {
    question: 'Comment suis-je payé(e) et à quelle fréquence ?',
    answer:
      'Les conditions financières (fixe + pourcentage de commission, généralement 15% à 20% sur les ventes générées dans le chat) sont précisées sur chaque offre. Les règlements s’effectuent par virement bancaire de manière hebdomadaire ou mensuelle selon les modalités fixées.',
  },
  {
    question: 'Pourquoi les créatrices ne créent-elles pas de compte sur ChatterLink ?',
    answer:
      'Pour préserver leur intimité et leur sécurité, les créatrices nous contactent directement en privé (par exemple via messagerie cryptée). Seul l’administrateur ChatterLink vérifie leurs offres, s’assure de leur sérieux et publie les annonces. Cela vous garantit des missions fiables et vérifiées.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Foire Aux Questions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-display">
          Toutes les réponses à vos questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Tout ce que vous devez savoir pour démarrer sereinement comme chatter.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'border-indigo-500/40 bg-[#161616] shadow-xl'
                  : 'border-white/10 bg-[#111111] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-white leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-[#222222] text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
