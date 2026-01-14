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
