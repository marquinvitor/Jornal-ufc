import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      {/* Configuração Global de Notificações (Toasts) */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "font-sans font-medium text-sm",
          style: {
            border: "1px solid #e2e8f0",
            padding: "16px",
            color: "#1a202c",
          },
        }}
      />

      {/* Gerenciamento de Rotas */}
      <Routes>
        {/* Rota inicial: redireciona para o login por padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Telas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* No futuro, você adicionará a rota do Feed aqui:
          <Route path="/feed" element={<FeedPage />} /> 
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
