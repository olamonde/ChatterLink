import React from 'react';
import { Shield, MessageCircle, Lock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#050505] text-slate-400 border-t border-white/10 text-xs relative overflow-hidden">
      {/* Decorative subtle gradient flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand & Proposition */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <MessageCircle className="w-3.5 h-3.5 fill-white/20 stroke-[2.2]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight font-display">
                ChatterLink
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plateforme professionnelle de mise en relation pour devenir chatter auprès de
              créatrices de contenu. Offres qualifiées, débutants acceptés et accompagnement sérieux.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Anonymat et discrétion des créatrices préservés à 100%</span>
            </div>
          </div>

          {/* Col 2: Navigation Candidats */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Espace Candidats
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/jobs')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Toutes les opportunités
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/register')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Créer un compte candidat
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Connexion à mon espace
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Créatrices de contenu */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Créatrices de contenu
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Vous êtes créatrice et recherchez des chatters fiables ? Notre équipe réceptionne
              vos besoins en privé et effectue le sourcing des meilleurs profils.
            </p>
            <div className="pt-1">
              <a
                href="mailto:administration@chatterlink.pro"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <span>Contact privé : administration@chatterlink.pro</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} ChatterLink. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span>Télétravail sécurisé</span>
            <span aria-hidden="true">·</span>
            <span>Accompagnement candidats & créatrices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
