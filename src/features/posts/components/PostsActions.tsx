import { useState } from "react";
import { 
  Heart, 
  Laugh, 
  Meh, 
  Frown, 
  Angry,
  Facebook, 
  Twitter, 
  Link as LinkIcon 
} from "lucide-react"; 

type ReactionType = "amei" | "risada" | "neutro" | "tristeza" | "raiva";

export const PostActions = () => {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const [counts, setCounts] = useState({
    amei: 124,
    risada: 42,
    neutro: 18,
    tristeza: 7,
    raiva: 4
  });

  const handleReaction = (reactionType: ReactionType) => {
    if (userReaction === reactionType) {
      setUserReaction(null);
      setCounts(prev => ({ ...prev, [reactionType]: prev[reactionType] - 1 }));
    } else {
      if (userReaction) {
        setCounts(prev => ({ ...prev, [userReaction]: prev[userReaction] - 1 }));
      }
      setUserReaction(reactionType);
      setCounts(prev => ({ ...prev, [reactionType]: prev[reactionType] + 1 }));
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 1000);
    });
  };

  const reactions = [
    { id: "amei", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { id: "risada", icon: Laugh, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: "neutro", icon: Meh, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "tristeza", icon: Frown, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "raiva", icon: Angry, color: "text-red-700", bg: "bg-red-100" },
  ];

  return (
    <div className="flex flex-col gap-6 py-6 border-y border-gray-100 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        
        <div className="flex items-center gap-2 md:gap-3">
          {reactions.map((reac) => {
            const isActive = userReaction === reac.id;
            const Icon = reac.icon;
            const iconFill = (reac.id === "amei") && isActive ? "currentColor" : "none";

            return (
              <button
                key={reac.id}
                onClick={() => handleReaction(reac.id as ReactionType)}
                className={`flex items-center gap-2 p-2 rounded-full transition-all group ${
                  isActive ? `${reac.bg} ${reac.color}` : "hover:bg-gray-50 text-gray-400"
                }`}
              >
                <Icon 
                  size={20} 
                  fill={iconFill} 
                  className={isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}
                />
                <span className="text-[11px] font-black uppercase tracking-tighter opacity-80">
                  {counts[reac.id as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">
            Compartilhar
          </span>
          <button className="p-2 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform shadow-sm">
            <Facebook size={14} fill="currentColor" />
          </button>
          <button className="p-2 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition-transform shadow-sm">
            <Twitter size={14} fill="currentColor" />
          </button>
          
          <div className="relative">
            {showCopyPopup && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-xl whitespace-nowrap animate-bounce-short">
                Link Copiado!
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            
            <button 
              onClick={copyLink}
              className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors shadow-sm"
            >
              <LinkIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};