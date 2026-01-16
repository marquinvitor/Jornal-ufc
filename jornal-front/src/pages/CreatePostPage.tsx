/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../components/Input";
import { createPost } from "../features/posts/services/postService";
import { auth } from "../lib/firebaseConfig";

export const CreatePostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    categoria: "ru", 
    tags: "",
    imagem_url: "",
  });

  useEffect(() => {
    const checkAuth = () => {
      if (!auth.currentUser) {
        toast.error("Acesso negado. Faça login primeiro.");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9,\s]*$/;
    if (!tagsRegex.test(formData.tags)) {
      toast.error("As tags devem conter apenas letras, números e vírgulas.");
      setLoading(false);
      return;
    }

    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        toast.error("Você precisa estar logado para publicar!");
        return;
      }

      const payload = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        categoria: formData.categoria, 
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        imagem_url: formData.imagem_url,
        user_id: userId,
      };

      await createPost(payload);
      toast.success("Notícia publicada!");
      navigate("/feed");
    } catch (err: any) {
      toast.error("Erro ao publicar noticia.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <Link
        to="/feed"
        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 hover:text-ufc-blue transition-colors"
      >
        Voltar
      </Link>

      <div className="mb-10 border-l-8 border-ufc-blue pl-6">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Publicar Notícia
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-sm border border-gray-100"
      >
        <Input
          label="Título da Notícia *"
          name="titulo"
          onChange={handleChange}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Categoria Fixa *
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-100 rounded bg-white font-bold text-xs uppercase tracking-widest focus:border-ufc-blue outline-none transition-colors"
          >
            <option value="ru">RU</option>
            <option value="ônibus">Ônibus</option>
            <option value="oportunidades">Oportunidades</option>
            <option value="eventos">Eventos</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Conteúdo *
          </label>
          <textarea
            name="conteudo"
            required
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-100 rounded focus:border-ufc-blue outline-none transition-colors min-h-[200px]"
          />
        </div>

        <Input
          label="Tags (separadas por vírgula) *"
          name="tags"
          placeholder="IA, Tecnologia, Campus"
          onChange={handleChange}
          required
        />

        <Input
          label="URL da Imagem (Opcional)"
          name="imagem_url"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-ufc-blue text-white font-black py-4 rounded shadow-md hover:bg-[#026a93] transition-all uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Enviar Notícia"}
        </button>
      </form>
    </main>
  );
};
