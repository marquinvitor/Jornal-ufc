# Back-end Jornal UFC - Guia de Execução

API do Jornal UFC feita com *Python (FastAPI)* e *Firebase*.

## 🛠️ 1. Pré-requisitos

* *Python 3.10+* instalado.
* *Pip* instalado.

---

## 2. Configuração da Chave

Você já deve possuir o arquivo .json com as credenciais do Firebase (chave de conta de serviço).

1. Pegue esse arquivo e coloque-o na *raiz* da pasta deste projeto.
2. Renomeie o arquivo para *firebase_key.json* (ou ajuste o nome no arquivo .env no próximo passo).

---

## 3. Instalação

### Passo 1: Instalar as Dependências

Abra o terminal na pasta do projeto e rode:

bash
pip install fastapi uvicorn firebase-admin python-dotenv



### Passo 2: Configurar o arquivo .env

Crie um arquivo chamado .env (sem nome, apenas a extensão) na raiz do projeto e adicione o caminho da sua chave:

env
CREDS="firebase_key.json"



(Certifique-se de que o nome do arquivo aqui é igual ao arquivo que você colocou na pasta).

---

## 🚀 4. Rodando o Servidor

Para iniciar a API, execute o comando:

bash
uvicorn main:app --reload



Se tudo der certo, você verá a mensagem:

> INFO: Uvicorn running on http://127.0.0.1:8000

---

## 5. Como Testar (Documentação Interativa)

O FastAPI gera uma documentação automática onde você pode testar as rotas sem precisar de Front-end.

1. Com o servidor rodando, abra seu navegador.
2. Acesse: **[http://127.0.0.1:8000/docs](https://www.google.com/search?q=http://127.0.0.1:8000/docs)**
3. Use a interface para testar os endpoints (POST, GET, PATCH, DELETE).
