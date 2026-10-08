import React from 'react';
import { Shield, MessageSquare, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-base font-bold text-white tracking-tight">ChatterLink</span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Plateforme professionnelle dédiée au recrutement de chatters pour créatrices de
              contenu. Chaque opportunité est réceptionnée et vérifiée en direct par la plateforme
              afin de garantir des conditions transparentes, fiables et respectueuses.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 pt-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Confidentialité stricte · Données candidates protégées</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Candidats</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/jobs')}
                  className="hover:text-white transition-colors"
                >
                  Toutes les opportunités
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  Comment devenir chatter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/register')}
                  className="hover:text-white transition-colors"
                >
                  Créer un compte candidat
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  Se connecter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Creators note */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Créatrices de contenu
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Les créatrices ne s'inscrivent pas sur le site. Les besoins en chatters nous sont
              transmis en privé via messagerie directe. Seul l'administrateur ChatterLink publie et
              gère les offres.
            </p>
            <div className="text-[11px] text-indigo-400 font-medium">
              Contact recrutement privé : administration@chatterlink.pro
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} ChatterLink. Tous droits réservés. Plateforme sécurisée.
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Données de démonstration réalistes indiquées pour évaluation</span>
            <span aria-hidden="true">·</span>
            <span>Accès sécurisé Candidat / Administrateur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
