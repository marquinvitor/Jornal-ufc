/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "../features/posts/services/postService";
import { PostReactions } from "../features/posts/components/PostsReactions";
import toast from "react-hot-toast";
import { PostActions } from "../features/posts/components/PostActions";
import { auth } from "../lib/firebaseConfig";

export const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);

        const currentUser = auth.currentUser;
        if (currentUser && data.autor_id === currentUser.uid) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (err) {
        toast.error("Erro ao carregar notícia.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, auth.currentUser]);

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse uppercase font-black text-gray-400">
        Carregando notícia...
      </div>
    );

  if (!post) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">
          Notícia não encontrada
        </h2>
        <Link
          to="/feed"
          className="text-ufc-blue font-bold uppercase text-xs mt-4 block underline"
        >
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-ufc-blue transition-colors"
      >
        Voltar
      </Link>

      <div className="mb-6">
        <span className="text-ufc-blue text-xs font-black uppercase tracking-[0.2em]">
          {post.categoria}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-none mb-6 tracking-tighter">
        {post.titulo}
      </h1>

      <div className="flex items-center gap-4 py-6 border-y border-gray-50 mb-10">
        <div className="w-10 h-10 bg-ufc-blue text-white rounded-full flex items-center justify-center font-black uppercase text-xs">
          {post.autor.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
            Por {post.autor}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            {new Date(post.data_criacao).toLocaleDateString("pt-BR")} — Quixadá,
            Ceará
          </span>
        </div>
      </div>

      <figure className="mb-10">
        <img
          src={post.imagem_url} 
          alt={post.titulo}
          className="w-full rounded-sm shadow-sm object-cover max-h-[500px]"
        />
        <figcaption className="mt-3 text-[11px] text-gray-400 font-medium italic">
          Legenda: {post.titulo}. (Foto: Reprodução/Portal Jornal da UFC)
        </figcaption>
      </figure>

      <section className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8 whitespace-pre-wrap">
        {post.conteudo}{" "}
      </section>

      <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-100 mb-8">
        {post.tags.map((tag: string) => (
          <Link
            key={tag}
            to={`/feed?filter=${tag}`}
            className="text-[10px] font-bold text-ufc-blue bg-blue-50 px-4 py-1.5 rounded-full hover:bg-ufc-blue hover:text-white transition-all shadow-sm"
          >
            #{tag.toUpperCase()}
          </Link>
        ))}
      </div>

      <PostReactions
        postId={post.id}
        postTitle={post.titulo}
        initialCounts={post.reactions_count}
        initialUserReactions={post.user_reactions}
      />
      <PostActions postId={post.id} isOwner={isOwner} />
    </main>
  );
};