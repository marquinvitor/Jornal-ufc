import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# inicializacao Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("CREDS")) 
    firebase_admin.initialize_app(cred)

db = firestore.client()
app = FastAPI(title="API Jornal UFC")

# --- 2. MODELOS DE DADOS (Pydantic) ---

class UserProfileInput(BaseModel):
    uid: str         # ID gerado pelo Firebase Auth no Front
    nome: str
    email: str
    matricula: str
    tipo: str        # "aluno" ou "professor"

class PostInput(BaseModel):
    titulo: str
    conteudo: str
    user_id: str     # ID do usuário logado (UID) do firebase auth!!!!!!
    tags: List[str]
    imagem_url: Optional[str] = None

# --- 3. ENDPOINTS DE USUÁRIOS ---

@app.post("/users/")
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

@app.get("/users/{user_id}")
def obter_usuario(user_id: str):
    # Busca dados de um usuário específico
    doc = db.collection("users").document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    dados = doc.to_dict()
    dados["uid"] = doc.id
    return dados

# --- 4. ENDPOINTS DE POSTS ---

# CRIAR POST (Com Autor Automático)
@app.post("/posts/")
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
        "tags": post.tags,
        "imagem_url": post.imagem_url,
        "autor": dados_usuario["nome"],        # Nome vem do banco
        "autor_matricula": dados_usuario.get("matricula"),
        "autor_id": post.user_id,
        "autor_tipo": dados_usuario["tipo"],
        "data_criacao": datetime.utcnow()
    }

    update_time, post_ref = db.collection("posts").add(novo_post)
    return {"id": post_ref.id, "mensagem": "Post criado com sucesso!"}

# LISTAR POSTS (Com filtro opcional de tag)
@app.get("/posts/")
def listar_posts(tag: Optional[str] = Query(None), user_id: Optional[str] = Query(None)):
    posts_ref = db.collection("posts")
    
    # Começa a query base
    query = posts_ref

    # 1. Se o Front mandou um user_id, filtramos para mostrar só os posts dele
    if user_id:
        query = query.where("autor_id", "==", user_id)

    # 2. Se mandou tag, filtramos por tag também
    if tag:
        query = query.where("tags", "array_contains", tag)

    # Executa a busca
    # Nota: Se usar user_id e order_by juntos, o Firebase pode pedir para criar um índice no console.
    # Por enquanto, vou tirar o order_by quando tiver filtro para evitar erro de índice.
    if not user_id and not tag:
        query = query.order_by("data_criacao", direction=firestore.Query.DESCENDING)

    docs = query.stream()
    
    lista_posts = []
    for doc in docs:
        post_data = doc.to_dict()
        post_data["id"] = doc.id  # <--- O SEGREDO ESTÁ AQUI. O ID VAI JUNTO COM OS DADOS.
        lista_posts.append(post_data)

    return lista_posts

# EDITAR POST
@app.put("/posts/{post_id}")
def editar_post(post_id: str, post: PostInput):
    post_ref = db.collection("posts").document(post_id)
    
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")

    post_ref.update({
        "titulo": post.titulo,
        "conteudo": post.conteudo,
        "tags": post.tags,
        "imagem_url": post.imagem_url
    })

    return {"mensagem": "Post atualizado com sucesso"}

# DELETAR POST
@app.delete("/posts/{post_id}")
def deletar_post(post_id: str):
    post_ref = db.collection("posts").document(post_id)
    
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")
        
    post_ref.delete()
    return {"mensagem": "Post deletado"}