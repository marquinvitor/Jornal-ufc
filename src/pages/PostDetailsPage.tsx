import { useParams, Link } from "react-router-dom";
import { MOCK_POSTS } from "../features/posts/constants/mockPosts";
import { PostActions } from "../features/posts/components/PostsActions"; 

export const PostDetailsPage = () => {
  const { id } = useParams();
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">
          Notícia não encontrada
        </h2>
        <Link to="/feed" className="text-ufc-blue font-bold uppercase text-xs mt-4 block underline">
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-6">
        <span className="text-ufc-blue text-xs font-black uppercase tracking-[0.2em]">
          {post.categoria}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-none mb-6 tracking-tighter">
        {post.titulo}
      </h1>
      <p className="text-xl text-gray-500 font-medium leading-relaxed mb-8 border-l-4 border-gray-100 pl-6">
        {post.resumo}
      </p>

      <div className="flex items-center gap-4 py-6 border-y border-gray-50 mb-10">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 uppercase text-xs">
          {post.autor.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
            Por {post.autor}, Jornal da UFC
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            {post.data} — Quixadá, Ceará
          </span>
        </div>
      </div>

      <figure className="mb-10">
        <img 
          src={post.imagemUrl} 
          alt={post.titulo} 
          className="w-full rounded-sm shadow-sm"
        />
        <figcaption className="mt-3 text-[11px] text-gray-400 font-medium italic">
          Legenda: {post.titulo}. (Foto: Reprodução/UFC)
        </figcaption>
      </figure>

      <section className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif mb-8">
        <p className="mb-6">{post.resumo}.</p>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. 
          Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit 
          lobortis nisl ut aliquip ex ea commodo consequat.
        </p>
        <p className="mb-6">
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie 
          consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan 
          et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue.
        </p>
      </section>

      <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-100 mb-8">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/feed?filter=${tag}`}
            className="text-[10px] font-bold text-ufc-blue bg-blue-50 px-4 py-1.5 rounded-full hover:bg-ufc-blue hover:text-white transition-all shadow-sm"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <PostActions />
    </main>
  );
};