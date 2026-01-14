/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { PostCard } from "../features/posts/components/PostCard";
import { getPosts } from "../features/posts/services/postService";
import { auth } from "../lib/firebaseConfig";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const MyPostsPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPosts(undefined, undefined, user.uid);
        setPosts(data);
      } catch (err) {
        toast.error("Erro ao carregar suas notícias.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ufc-blue"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 text-center">
        <p>Você precisa estar logado para ver suas notícias.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-ufc-blue transition-colors"
      >
        Voltar
      </Link>
      <div className="mb-10 border-l-8 border-ufc-blue pl-6 flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Minhas Notícias
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium mb-4">
            Você ainda não publicou nenhuma notícia.
          </p>
          <Link
            to="/publicar"
            className="text-ufc-blue font-bold uppercase text-xs underline"
          >
            Clique aqui para começar a escrever!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
