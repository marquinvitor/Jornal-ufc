import os
from typing import List, Optional
from enum import Enum
from datetime import datetime

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore

# --- CONFIGURAÇÕES INICIAIS ---

load_dotenv()

# Inicialização Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("CREDS"))
    firebase_admin.initialize_app(cred)

db = firestore.client()
app = FastAPI(title="API Jornal UFC")

# Configuração de CORS: Essencial para que o Front-end (Vite) consiga acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DADOS (Enums e Pydantic) ---

class CategoriaEnum(str, Enum):
    RU = "ru"
    ONIBUS = "ônibus"
    OPORTUNIDADES = "oportunidades"
    EVENTOS = "eventos"

class UserProfileInput(BaseModel):
    uid: str        # ID gerado pelo Firebase Auth no Front
    nome: str
    email: str
    matricula: str
    tipo: str       # "aluno" ou "professor"

class PostInput(BaseModel):
    titulo: str
    conteudo: str
    user_id: str    # ID do usuário logado (UID) do firebase auth!!!!!!
    categoria: CategoriaEnum
    tags: List[str]
    imagem_url: Optional[str] = None

class ReactionInput(BaseModel):
    user_id: str
    reaction_type: str  # "amei", "risada", "neutro", "tristeza", "raiva"

# --- ENDPOINTS DE USUÁRIOS ---

@app.post("/users/", tags=["Users"])
def salvar_perfil_usuario(user: UserProfileInput):
    # Salva os dados complementares no Firestore usando o UID como chave
    novo_perfil = {
        "nome": user.nome,
        "email": user.email,
        "matricula": user.matricula,
        "tipo": user.tipo,
        "data_cadastro": datetime.utcnow()
    }
    db.collection("users").document(user.uid).set(novo_perfil)
    return {"mensagem": "Perfil salvo no banco com sucesso!"}

@app.get("/users/{user_id}", tags=["Users"])
def obter_usuario(user_id: str):
    # Busca dados de um usuário específico
    doc = db.collection("users").document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    dados = doc.to_dict()
    dados["uid"] = doc.id
    return dados

# --- ENDPOINTS DE POSTS ---

# CRIAR POST (Com Autor Automático)
@app.post("/posts/", tags=["Posts"])
def criar_post(post: PostInput):
    # 1. Busca quem é o usuário no banco
    user_ref = db.collection("users").document(post.user_id)
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="Usuário não encontrado. Complete o cadastro primeiro.")

    # 2. Pega os dados do autor
    dados_usuario = user_doc.to_dict()
    
    # 3. Monta o post com dados seguros
    novo_post = {
        "titulo": post.titulo,
        "conteudo": post.conteudo,
        "categoria": post.categoria,
        "tags": [tag.lower() for tag in post.tags],
        "imagem_url": post.imagem_url,
        "autor": dados_usuario["nome"],        # Nome vem do banco
        "autor_matricula": dados_usuario.get("matricula"),
        "autor_id": post.user_id,
        "autor_tipo": dados_usuario["tipo"],
        "data_criacao": datetime.utcnow()
    }

    _, post_ref = db.collection("posts").add(novo_post)
    return {"id": post_ref.id, "mensagem": "Post criado com sucesso!"}

# LISTAR POSTS (Com filtro opcional de tag)
@app.get("/posts/", tags=["Posts"])
def listar_posts(
    tag: Optional[str] = Query(None), 
    categoria: Optional[CategoriaEnum] = Query(None), 
    user_id: Optional[str] = Query(None)
):
    posts_ref = db.collection("posts")

    # Começa a query base
    query = posts_ref

    # 1. Se o Front mandou um user_id, filtramos para mostrar só os posts dele
    if user_id:
        query = query.where("autor_id", "==", user_id)

    if categoria:
        query = query.where("categoria", "==", categoria)

    # 2. Se mandou tag, filtramos por tag também
    if tag:
        query = query.where("tags", "array_contains", tag.lower())

    # Ordenação automática apenas se não houver filtros (evita erro de índice no Firestore)
    if not any([user_id, categoria, tag]):
        query = query.order_by("data_criacao", direction=firestore.Query.DESCENDING)

    docs = query.stream()
    lista_posts = []

    for doc in docs:
        post_data = doc.to_dict()
        post_data["id"] = doc.id
        
        if "data_criacao" in post_data and post_data["data_criacao"]:
            post_data["data_criacao"] = post_data["data_criacao"].isoformat()

        lista_posts.append(post_data)

    return lista_posts

@app.get("/posts/{post_id}", tags=["Posts"])
def obter_post_detalhado(post_id: str):
    doc_ref = db.collection("posts").document(post_id).get()
    
    if not doc_ref.exists:
        raise HTTPException(status_code=404, detail="Notícia não encontrada")
    
    post_data = doc_ref.to_dict()
    post_data["id"] = doc_ref.id
    
    if "data_criacao" in post_data and post_data["data_criacao"]:
        post_data["data_criacao"] = post_data["data_criacao"].isoformat()
        
    return post_data

@app.put("/posts/{post_id}", tags=["Posts"])
def editar_post(post_id: str, post: PostInput):
    post_ref = db.collection("posts").document(post_id)
    
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    post_ref.update({
        "titulo": post.titulo,
        "conteudo": post.conteudo,
        "categoria": post.categoria,
        "tags": [tag.lower() for tag in post.tags],
        "imagem_url": post.imagem_url
    })

    return {"mensagem": "Post atualizado com sucesso"}

@app.delete("/posts/{post_id}", tags=["Posts"])
def deletar_post(post_id: str):
    post_ref = db.collection("posts").document(post_id)
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")
    post_ref.delete()
    return {"mensagem": "Post deletado"}

# --- ENDPOINTS DE INTERAÇÃO ---

@app.post("/posts/{post_id}/react", tags=["Interactions"])
def reagir_post(post_id: str, reaction: ReactionInput):
    user_doc = db.collection("users").document(reaction.user_id).get()
    if not user_doc.exists:
        raise HTTPException(status_code=401, detail="Usuário não autorizado.")

    post_ref = db.collection("posts").document(post_id)
    post_doc = post_ref.get()

    if not post_doc.exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    post_data = post_doc.to_dict()
    
    counts = post_data.get("reactions_count", {"amei": 0, "risada": 0, "neutro": 0, "tristeza": 0, "raiva": 0})
    user_reactions = post_data.get("user_reactions", {})

    uid = reaction.user_id
    new_type = reaction.reaction_type
    old_type = user_reactions.get(uid)

    if old_type == new_type:
        counts[new_type] = max(0, counts[new_type] - 1)
        user_reactions.pop(uid, None)
    else:
        if old_type:
            counts[old_type] = max(0, counts[old_type] - 1)
        
        counts[new_type] = counts.get(new_type, 0) + 1
        user_reactions[uid] = new_type

    post_ref.update({
        "reactions_count": counts,
        "user_reactions": user_reactions
    })

    return {"reactions_count": counts, "user_reaction": user_reactions.get(uid)}