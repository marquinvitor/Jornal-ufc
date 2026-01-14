/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = "http://localhost:8000";

export const createPost = async (postData: {
  titulo: string;
  conteudo: string;
  user_id: string;
  tags: string[];
  imagem_url?: string;
}) => {
  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao publicar notícia");
  }

  return response.json();
};

export const getPosts = async (
  tag?: string,
  categoria?: string,
  userId?: string
) => {
  const params = new URLSearchParams();
  if (tag) params.append("tag", tag);
  if (categoria) params.append("categoria", categoria);
  // Adiciona o filtro de usuário se ele for passado
  if (userId) params.append("user_id", userId);

  const response = await fetch(`${API_URL}/posts/?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao carregar notícias do servidor");
  }

  return response.json();
};

export const getPostById = async (id: string) => {
  const response = await fetch(`${API_URL}/posts/${id}`);
  if (!response.ok) throw new Error("Erro ao carregar a notícia");
  return response.json();
};

export const deletePost = async (postId: string) => {

  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar excluir a notícia.");
  }

  return response.json();
};

export const updatePost = async (id: string, payload: any) => {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar a notícia");
  }

  return response.json();
};

export const toggleReaction = async (
  postId: string,
  userId: string,
  reactionType: string
) => {
  const response = await fetch(`${API_URL}/posts/${postId}/react`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, reaction_type: reactionType }),
  });
  if (!response.ok) throw new Error("Erro ao reagir");
  return response.json();
};
