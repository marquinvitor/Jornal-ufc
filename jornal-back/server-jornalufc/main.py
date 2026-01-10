import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("CREDS"))
    firebase_admin.initialize_app(cred)

db = firestore.client()
app = FastAPI(title="API Jornal UFC")

# Isso define o formato que o Front deve enviar
class PostInput(BaseModel):
    titulo: str
    conteudo: str
    autor: str         
    tags: List[str]       
    imagem_url: Optional[str] = None #Opcional

# --- Endpoints ---

# CRIAÇÃO DE POSTAGEM
@app.post("/posts/")
def criar_post(post: PostInput):
  
    novo_post = {
        "titulo": post.titulo,
        "conteudo": post.conteudo,
        "tags": post.tags,
        "imagem_url": post.imagem_url,
        "autor": post.autor,
        "data_criacao": datetime.utcnow()
    }

    update_time, post_ref = db.collection("posts").add(novo_post)
    return {"id": post_ref.id, "mensagem": "Post criado com sucesso!"}

# LISTAGEM (COM FILTRO DE TAG)
@app.get("/posts/")
def listar_posts(tag: Optional[str] = Query(None)):
    posts_ref = db.collection("posts")

    # Se o front enviar ?tag=esporte, filtramos
    if tag:
        query = posts_ref.where("tags", "array_contains", tag)
    else:
        query = posts_ref.order_by("data_criacao", direction=firestore.Query.DESCENDING)

    docs = query.stream()
    
    lista_posts = []
    for doc in docs:
        post_data = doc.to_dict()
        post_data["id"] = doc.id 
        lista_posts.append(post_data)

    return lista_posts

# EDIÇÃO
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

# DELETAR
@app.delete("/posts/{post_id}")
def deletar_post(post_id: str):
    post_ref = db.collection("posts").document(post_id)
    
    if not post_ref.get().exists:
        raise HTTPException(status_code=404, detail="Post não encontrado")
        
    post_ref.delete()
    return {"mensagem": "Post deletado"}