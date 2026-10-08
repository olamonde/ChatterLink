import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface EarningsCalculatorProps {
  navigate: (path: string) => void;
}

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ navigate }) => {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'pro'>('intermediate');

  // Calculation parameters
  const baseRatePerHour = level === 'beginner' ? 10 : level === 'intermediate' ? 12 : 15;
  const estimatedCommissionPerHour = level === 'beginner' ? 8 : level === 'intermediate' ? 14 : 22;

  const monthlyHours = hoursPerWeek * 4.2;
  const baseMonthly = Math.round(monthlyHours * baseRatePerHour);
  const commissionMonthly = Math.round(monthlyHours * estimatedCommissionPerHour);
  const totalMonthly = baseMonthly + commissionMonthly;

  return (
    <div className="bg-[#111111] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulateur de revenus</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Combien pouvez-vous gagner par mois ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ajustez votre volume d'heures et votre niveau d'expérience pour évaluer votre revenu
              mensuel potentiel (fixe garanti + commissions directes sur chaque vente).
            </p>
          </div>

          {/* Slider: Hours */}
          <div className="space-y-3 bg-[#181818] p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Temps consacré par semaine</span>
              <span className="text-sm font-extrabold text-indigo-300 bg-[#222222] px-3 py-1 rounded-lg border border-white/10">
                {hoursPerWeek} heures / sem.
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              step={5}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-[#2a2a2a] rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>10h (Complément)</span>
              <span>20h (Mi-temps)</span>
              <span>35h (Plein temps)</span>
            </div>
          </div>

          {/* Level Toggle */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Votre expérience :
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setLevel('beginner')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  level === 'beginner'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#181818] text-slate-300 border-white/10 hover:border-white/20 hover:bg-[#202020]'
                }`}
              >
                Débutant (0 exp.)
              </button>
              <button
                type="button"
                onClick={() => setLevel('intermediate')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  level === 'intermediate'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#181818] text-slate-300 border-white/10 hover:border-white/20 hover:bg-[#202020]'
                }`}
              >
                Intermédiaire
              </button>
              <button
                type="button"
                onClick={() => setLevel('pro')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                  level === 'pro'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-[#181818] text-slate-300 border-white/10 hover:border-white/20 hover:bg-[#202020]'
                }`}
              >
                Confirmé / Pro
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Total Dark Premium Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#161616] to-[#0d1222] text-white p-7 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold block">
              Estimation mensuelle nette
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white mt-2 font-display">
              {totalMonthly.toLocaleString()} €
              <span className="text-base text-slate-400 font-normal font-sans ml-1">/ mois</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Pour {hoursPerWeek}h/semaine · Rémunération versée chaque semaine ou mois.
            </p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Fixe garanti moyen :</span>
              <span className="font-bold text-white font-mono">{baseMonthly.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Commissions estimées (15-20%) :</span>
              <span className="font-bold text-emerald-400 font-mono">
                +{commissionMonthly.toLocaleString()} €
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/jobs')}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Voir les offres adaptées</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contrats de prestation validés par l'administrateur</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
