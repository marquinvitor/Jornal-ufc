import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deletePost } from "../services/postService";

interface PostActionsProps {
  postId: string;
  isOwner: boolean;
}

export const PostActions = ({ postId, isOwner }: PostActionsProps) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOwner) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(postId);
      toast.success("Notícia removida com sucesso.");
      navigate("/feed");
    } catch (error) {
      toast.error("Erro ao excluir notícia.");
      console.error(error);
    } finally {
      setDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={() => navigate(`/editar/${postId}`)}
          className="px-4 py-2 bg-blue-50 text-ufc-blue text-xs font-black uppercase tracking-widest rounded hover:bg-blue-100 transition-colors"
        >
          Editar Notícia
        </button>
        <button
          onClick={() => setIsModalOpen(true)} // Abre o modal
          className="px-4 py-2 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded hover:bg-red-100 transition-colors"
        >
          Excluir Notícia
        </button>
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Você tem certeza que deseja remover esta notícia? Esta ação é
              irreversível e ela deixará de aparecer no feed do portal.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-md hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleting ? "Excluindo..." : "Sim, excluir notícia"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] rounded hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
