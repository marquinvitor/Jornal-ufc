import { Link } from "react-router-dom";

interface PostCardProps {
  post: {
    id: string;
    titulo: string;
    resumo: string;
    autor: string;
    data: string;
    categoria: string;
    tags: string[];
    imagemUrl: string;
  };
  onTagClick: (tag: string) => void;
}

export const PostCard = ({ post, onTagClick }: PostCardProps) => {
  return (
    <Link 
      to={`/post/${post.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img 
          src={post.imagemUrl} 
          alt={post.titulo} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ufc-blue text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
            {post.categoria}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-black text-gray-900 leading-tight mb-3 uppercase tracking-tighter group-hover:text-ufc-blue transition-colors">
          {post.titulo}
        </h2>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
          {post.resumo}
        </p>
        
<div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag: string) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault(); // Impede de abrir a notícia ao clicar na tag
                onTagClick(tag);
              }}
              className="text-[9px] font-bold text-ufc-blue bg-blue-50 px-2 py-0.5 rounded hover:bg-ufc-blue hover:text-white transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Repórter</span>
            <span className="text-[10px] font-black text-gray-700 uppercase">{post.autor}</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {post.data}
          </span>
        </div>
      </div>
    </Link>
  );
};