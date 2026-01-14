import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layouts/MainLayout";

import { FeedPage } from "./pages/FeedPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { MyPostsPage } from "./pages/MyPostsPage";
import { EditPostPage } from "./pages/EditPostPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />

        <Route element={<MainLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/publicar" element={<CreatePostPage />} />
          <Route path="/meus-posts" element={<MyPostsPage />} />
          <Route path="/editar/:id" element={<EditPostPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="*"
          element={
            <div className="p-10 text-center font-black">
              404 - PÁGINA NÃO ENCONTRADA
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
