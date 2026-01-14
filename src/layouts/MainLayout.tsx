/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, Outlet, useNavigate } from "react-router-dom";
import ufcLogo from "../assets/ufc-logo.png";
import { auth } from "../lib/firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import toast from "react-hot-toast";

export const MainLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Você saiu do portal.");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao sair.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b-4 border-ufc-blue py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/feed"
            className="flex items-center gap-4 hover:opacity-90 transition-opacity"
          >
            <img
              src={ufcLogo}
              alt="Logo UFC"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                JORNAL DA <span className="text-ufc-blue">UFC</span>
              </h1>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Campus Quixadá
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/meus-posts"
                  className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-ufc-blue"
                >
                  Minhas Notícias
                </Link>
                <Link
                  to="/publicar"
                  className="text-[10px] font-black text-ufc-blue border border-ufc-blue px-3 py-1 rounded uppercase tracking-widest hover:bg-ufc-blue hover:text-white transition-all"
                >
                  Publicar Notícia
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-ufc-blue text-white px-4 py-2 rounded font-black text-[10px] uppercase"
              >
                Entrar para Publicar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-gray-400 border-t border-gray-200 bg-white uppercase font-bold text-[10px] tracking-widest">
        © 2026 Jornal da UFC - Todos os direitos reservados
      </footer>
    </div>
  );
};
