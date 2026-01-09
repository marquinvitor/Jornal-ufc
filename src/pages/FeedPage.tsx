import { useSearchParams } from "react-router-dom";
import { MOCK_POSTS } from "../features/posts/constants/mockPosts";
import { PostCard } from "../features/posts/components/PostCard";

const Section = ({
  title,
  posts,
  onTagClick,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  onTagClick: (tag: string | null) => void;
}) => (
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
);

export const FeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtro = searchParams.get("filter");

  const handleSetFilter = (novoFiltro: string | null) => {
    if (novoFiltro) {
      setSearchParams({ filter: novoFiltro });
    } else {
      setSearchParams({});
    }
  };
  
  const postsFiltrados = filtro
    ? MOCK_POSTS.filter(
        (p) => p.categoria === filtro || p.tags.includes(filtro)
      )
    : null;

  const ultimasNoticias = MOCK_POSTS.slice(0, 3);
  const campusPosts = MOCK_POSTS.filter((p) => p.categoria === "Campus");
  const eventosPosts = MOCK_POSTS.filter((p) => p.categoria === "Eventos");
  const educacaoPosts = MOCK_POSTS.filter((p) => p.categoria === "Educação");

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {filtro ? (
        <>
          <div className="mb-10 flex items-center justify-between bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                Mostrando resultados para: <span className="text-ufc-blue">#{filtro}</span>
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
            {postsFiltrados?.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTagClick={handleSetFilter}
              />
            ))}
          </div>
          
          {postsFiltrados?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-black uppercase tracking-widest">Nenhuma notícia encontrada para este filtro.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <Section
            title="Últimas Notícias"
            posts={ultimasNoticias}
            onTagClick={handleSetFilter}
          />
          <Section
            title="Campus"
            posts={campusPosts}
            onTagClick={handleSetFilter}
          />
          <Section
            title="Eventos"
            posts={eventosPosts}
            onTagClick={handleSetFilter}
          />
          <Section
            title="Educação"
            posts={educacaoPosts}
            onTagClick={handleSetFilter}
          />
        </>
      )}
    </div>
  );
};