# Back-end Jornal UFC - Guia de Execução

API do Jornal UFC feita com *Python (FastAPI)* e *Firebase*.

## 1. Pré-requisitos

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

pip install fastapi uvicorn firebase-admin python-dotenv



### Passo 2: Configurar o arquivo .env

Crie um arquivo chamado .env (sem nome, apenas a extensão) na raiz do projeto e adicione o caminho da sua chave:

CREDS="firebase_key.json"



(Certifique-se de que o nome do arquivo aqui é igual ao arquivo que você colocou na pasta).

---

## 4. Rodando o Servidor

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


# Front-end Jornal UFC - Guia de Execução

Interface do portal de notícias desenvolvida com **React (Vite)** e **integração com Firebase**.

---

## 1. Pré-requisitos

- **Node.js (versão 18 ou superior)** instalado
- Gerenciador de pacotes **npm** instalado

---

## 2. Instalação

### Passo 1: Instalar as dependências

Abra o terminal na pasta do projeto frontend e execute o comando abaixo para baixar as bibliotecas necessárias:

```bash
npm install
```

---

## 3. Configuração das Variáveis de Ambiente

Para que o sistema se conecte ao Firebase e à API, você deve configurar as variáveis de ambiente.

Crie um arquivo chamado `.env` na raiz da pasta frontend.

Adicione as suas chaves do Firebase seguindo o modelo abaixo:

```env
VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"
VITE_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO_AQUI"
VITE_FIREBASE_PROJECT_ID="SEU_ID_DO_PROJETO"
VITE_FIREBASE_STORAGE_BUCKET="SEU_BUCKET_AQUI"
VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"
VITE_API_URL="http://localhost:8000"
```

---

## 4. Rodando o Projeto

Para iniciar o servidor de desenvolvimento local, execute:

```bash
npm run dev
```

Após o comando, o terminal indicará o endereço local para acesso, geralmente:

```
http://localhost:5173
```

---

## 5. Scripts Disponíveis

- `npm run dev`  
  Inicia o servidor de desenvolvimento com hot-reload.

- `npm run build`  
  Gera a versão otimizada do projeto para produção na pasta `/dist`.

- `npm run preview`  
  Visualiza localmente o código gerado pelo comando de build.
