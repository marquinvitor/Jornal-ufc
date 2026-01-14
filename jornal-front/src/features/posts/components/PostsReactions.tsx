/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Heart,
  Laugh,
  Meh,
  Frown,
  Angry,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { auth } from "../../../lib/firebaseConfig";
import { toggleReaction } from "../services/postService";

interface PostReactionsProps {
  postId: string;
  postTitle: string;
  initialCounts?: any;
  initialUserReactions?: any;
}

export const PostReactions = ({
  postId,
  postTitle,
  initialCounts,
  initialUserReactions,
}: PostReactionsProps) => {
  const user = auth.currentUser;
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const [counts, setCounts] = useState(
    initialCounts || {
      amei: 0,
      risada: 0,
      neutro: 0,
      tristeza: 0,
      raiva: 0,
    }
  );
  const [userReaction, setUserReaction] = useState<string | null>(
    user ? initialUserReactions?.[user.uid] : null
  );
  const shareUrl = window.location.href;
  const shareText = `Confira esta notícia no Jornal da UFC: ${postTitle}`;

  const handleReaction = async (reactionType: string) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Ops! Você precisa estar logado para reagir às notícias.", {
        icon: "🔒",
      });
      return;
    }

    try {
      const data = await toggleReaction(postId, currentUser.uid, reactionType);

      setCounts(data.reactions_count);
      setUserReaction(data.user_reaction);
    } catch (error) {
      console.error("Erro ao reagir:", error);
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(url, "_blank");
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
            return (
              <button
                key={reac.id}
                onClick={() => handleReaction(reac.id)}
                className={`flex items-center gap-2 p-2 rounded-full transition-all group ${
                  isActive
                    ? `${reac.bg} ${reac.color}`
                    : "hover:bg-gray-50 text-gray-400"
                }`}
              >
                <Icon
                  size={20}
                  fill={
                    reac.id === "amei" && isActive ? "currentColor" : "none"
                  }
                />
                <span className="text-[11px] font-black uppercase tracking-tighter opacity-80">
                  {counts[reac.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">
            Compartilhar
          </span>

          <button
            onClick={shareOnFacebook}
            className="p-2 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform shadow-sm"
          >
            <Facebook size={14} fill="currentColor" />
          </button>

          <button
            onClick={shareOnTwitter}
            className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-sm"
          >
            <Twitter size={14} fill="currentColor" />
          </button>

          <button 
  onClick={shareOnWhatsApp}
  className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform shadow-sm flex items-center justify-center"
  title="Compartilhar no WhatsApp"
>

  <svg 
    viewBox="0 0 24 24" 
    width="14" 
    height="14" 
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
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
