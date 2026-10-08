import React from 'react';
import {
  Send,
  Smile,
  Paperclip,
  CheckCheck,
  MoreVertical,
  Phone,
  Sparkles,
  Lock,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'candidate' | 'creator';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMockupProps {
  creatorName?: string;
  creatorRole?: string;
  creatorAvatar?: string;
  onlineStatus?: string;
  messages?: ChatMessage[];
  className?: string;
}

export const ChatMockup: React.FC<ChatMockupProps> = ({
  creatorName = 'Éléonore R. · Créatrice Lifestyle',
  creatorRole = 'Compte vérifié · 120k abonnés',
  creatorAvatar = '/src/assets/images/creator_lifestyle_portrait_1791469946212.jpg',
  onlineStatus = 'En ligne il y a 5 min',
  messages = [
    {
      id: 'm1',
      sender: 'candidate',
      text: 'Bonjour ! J’ai postulé à votre offre ChatterLink pour le créneau 18h-23h. Mon profil et mes disponibilités sont validés.',
      time: '18:04',
      status: 'read',
    },
    {
      id: 'm2',
      sender: 'creator',
      text: 'Hello ! J’ai justement parcouru ta candidature transmise par l’administrateur. Ton orthographe et ton aisance écrite correspondent exactement à l’univers de ma communauté.',
      time: '18:07',
    },
    {
      id: 'm3',
      sender: 'creator',
      text: 'On te transmet le guide de conversation et la session de formation pour démarrer dès ce week-end ! 🎉',
      time: '18:08',
    },
    {
      id: 'm4',
      sender: 'candidate',
      text: 'Parfait, un grand merci ! Je suis disponible dès vendredi pour commencer la formation.',
      time: '18:10',
      status: 'read',
    },
  ],
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col font-sans ${className}`}
    >
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={creatorAvatar}
              alt={creatorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover object-top ring-2 ring-indigo-400/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {creatorName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-400 leading-tight flex items-center gap-1.5">
              <span>{creatorRole}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{onlineStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <div className="hidden sm:flex items-center gap-1 text-[11px] bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700 text-indigo-300">
            <Lock className="w-3 h-3" />
            <span>Échange sécurisé</span>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-slate-50/70 to-slate-100/50 flex-1 min-h-[260px] overflow-y-auto">
        {/* Subtle timestamp banner */}
        <div className="flex justify-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/90 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-200/70 shadow-2xs">
            Aujourd'hui · Mission validée
          </span>
        </div>

        {messages.map((m) => {
          const isCandidate = m.sender === 'candidate';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  isCandidate
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isCandidate ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  <span>{m.time}</span>
                  {isCandidate && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Realistic typing indicator */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:0.4s]" />
          <span className="text-[10px] text-slate-400 ml-1">En train d'écrire...</span>
        </div>
      </div>

      {/* Input bar mockup */}
      <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 text-xs">
        <button
          type="button"
          tabIndex={-1}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <Smile className="w-4 h-4" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hidden sm:block"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <div className="flex-1 bg-slate-100/80 rounded-xl px-3.5 py-2 text-slate-400 text-xs">
          Rédiger une réponse bienveillante...
        </div>
        <div className="p-2 bg-slate-900 text-white rounded-xl shadow-xs">
          <Send className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
