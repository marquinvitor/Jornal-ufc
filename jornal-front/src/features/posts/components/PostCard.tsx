import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    categoria: string;
    tags: string[];
    imagem_url: string;
    data_criacao: string; 
  };
  onTagClick?: (tag: string) => void;
}

export const PostCard = ({ post, onTagClick }: PostCardProps) => {
  const navigate = useNavigate();

  const formatarData = (dataIso: string) => {
    try {
      return new Date(dataIso).toLocaleDateString("pt-BR");
    } catch {
      return "Data indisponível";
    }
  };

  return (
    <div 
      onClick={() => navigate(`/post/${post.id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <span className="absolute top-3 left-3 z-10 bg-ufc-blue text-white text-[9px] font-black px-3 py-1 rounded shadow-md uppercase tracking-widest">
          {post.categoria}
        </span>

        {post.imagem_url ? (
          <img
            src={post.imagem_url}
            alt={post.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Sem+Imagem";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">Sem Imagem</div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-3 line-clamp-2">
          {post.titulo}
        </h3>

        <p className="text-sm text-gray-600 mb-6 line-clamp-4 flex-grow">
          {post.conteudo}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="text-[10px] font-black text-ufc-blue bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-widest cursor-pointer hover:bg-ufc-blue hover:text-white transition-all"
            >
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-50 mt-auto flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repórter</p>
            <p className="text-xs font-black text-gray-700 uppercase">{post.autor}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Postado em</p>
            <p className="text-[10px] font-black text-gray-500">{formatarData(post.data_criacao)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};