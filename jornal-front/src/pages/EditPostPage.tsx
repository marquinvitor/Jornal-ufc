/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { getPostById, updatePost } from "../features/posts/services/postService";
import { auth } from "../lib/firebaseConfig";

export const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    categoria: "",
    tags: "",
    imagem_url: "",
  });

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      try {
        const post = await getPostById(id);
        
        if (post.autor_id !== auth.currentUser?.uid) {
          toast.error("Você não tem permissão para editar esta notícia.");
          navigate("/feed");
          return;
        }

        setFormData({
          titulo: post.titulo,
          conteudo: post.conteudo,
          categoria: post.categoria,
          tags: post.tags.join(", "),
          imagem_url: post.imagem_url || "",
        });
      } catch (err) {
        toast.error("Erro ao carregar dados da notícia.");
      }
    };
    loadPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);

    try {
      const payload = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        categoria: formData.categoria,
        user_id: auth.currentUser?.uid, 
        tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
        imagem_url: formData.imagem_url,
      };

      await updatePost(id, payload);
      toast.success("Notícia atualizada com sucesso!");
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error("Erro ao atualizar notícia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <Link to={`/post/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-ufc-blue transition-colors">
        ← Cancelar Edição
      </Link>

      <div className="mb-10 border-l-8 border-ufc-blue pl-6">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Editar Notícia</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <Input label="Título da Notícia *" name="titulo" value={formData.titulo} onChange={handleChange} required />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria Fixa *</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full p-3 border-2 border-gray-100 rounded bg-white font-bold text-xs uppercase tracking-widest focus:border-ufc-blue outline-none transition-colors">
            <option value="ru">RU</option>
            <option value="ônibus">Ônibus</option>
            <option value="oportunidades">Oportunidades</option>
            <option value="eventos">Eventos</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conteúdo *</label>
          <textarea name="conteudo" value={formData.conteudo} required onChange={handleChange} className="w-full p-3 border-2 border-gray-100 rounded focus:border-ufc-blue outline-none transition-colors min-h-[200px]" />
        </div>

        <Input label="Tags (separadas por vírgula) *" name="tags" value={formData.tags} onChange={handleChange} required />
        <Input label="URL da Imagem (Opcional)" name="imagem_url" value={formData.imagem_url} onChange={handleChange} />

        <button type="submit" disabled={loading} className="w-full mt-6 bg-ufc-blue text-white font-black py-4 rounded shadow-md hover:bg-[#026a93] transition-all uppercase tracking-widest text-xs disabled:opacity-50">
          {loading ? "Salvando Alterações..." : "Salvar Notícia"}
        </button>
      </form>
    </main>
  );
};