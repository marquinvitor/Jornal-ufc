/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PostCard } from "../features/posts/components/PostCard";
import { getPosts } from "../features/posts/services/postService";
import toast from "react-hot-toast";

const Section = ({
  title,
  posts,
  onTagClick,
}: {
  title: string;
  posts: any[];
  onTagClick: (tag: string | null) => void;
}) =>
  posts.length > 0 ? (
    <section className="mb-16">
      <div className="mb-8 border-l-8 border-ufc-blue pl-6">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onTagClick={onTagClick} />
        ))}
      </div>
    </section>
  ) : null;

export const FeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const filtro = searchParams.get("filter");
  const categoriasFixas = ["ru", "ônibus", "oportunidades", "eventos"];

useEffect(() => {
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts(filtro || undefined);
      setPosts(data);
    } catch (err) {
      // Adicionando um ID fixo, o toast só aparecerá uma vez
      toast.error("Erro ao carregar notícias.", { id: "feed-fetch-error" });
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [filtro]);

  const handleSetFilter = (novoFiltro: string | null) => {
    if (novoFiltro) {
      setSearchParams({ filter: novoFiltro });
    } else {
      setSearchParams({});
    }
  };

  const ultimasNoticias = posts.slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ufc-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {filtro ? (
        <>
          <div className="mb-10 flex items-center justify-between bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                Mostrando resultados para:{" "}
                <span className="text-ufc-blue">#{filtro.toUpperCase()}</span>
              </p>
            </div>
            <button
              onClick={() => handleSetFilter(null)}
              className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-white px-4 py-2 rounded border border-red-100 hover:bg-red-50 transition-colors"
            >
              Limpar Filtro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTagClick={handleSetFilter}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-black uppercase tracking-widest">
                Nenhuma notícia encontrada.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Seção fixa de topo */}
          <Section
            title="Últimas Notícias"
            posts={ultimasNoticias}
            onTagClick={handleSetFilter}
          />

          {/* Seções dinâmicas: Só aparecem se houver notícias na categoria */}
          {categoriasFixas.map((cat) => (
            <Section
              key={cat}
              title={cat}
              posts={posts.filter((p) => p.categoria === cat)}
              onTagClick={handleSetFilter}
            />
          ))}
        </>
      )}
    </div>
  );
};