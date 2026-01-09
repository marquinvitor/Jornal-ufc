import { Link, Outlet, useLocation } from "react-router-dom";
import ufcLogo from "../assets/ufc-logo.png";

export const MainLayout = () => {
  const location = useLocation();
  
  const isNotOnFeed = location.pathname !== "/feed";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b-4 border-ufc-blue py-4 px-6 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link to="/feed" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            <img src={ufcLogo} alt="Logo UFC" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                JORNAL DA <span className="text-ufc-blue">UFC</span>
              </h1>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Campus Quixadá</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {isNotOnFeed ? (
              <Link 
                to="/feed" 
                className="text-[10px] font-black text-ufc-blue uppercase tracking-widest bg-blue-50 px-4 py-2 rounded border border-blue-100 hover:bg-ufc-blue hover:text-white transition-all"
              >
                ← Voltar para o Feed
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded transition-colors"
              >
                Sair do Portal
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