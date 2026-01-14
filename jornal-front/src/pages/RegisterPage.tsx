import { RegisterForm } from "../features/auth/components/RegisterForm";
import ufcLogo from "../assets/ufc-logo.png";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 bg-[#f8f9fa]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden border-t-8 border-ufc-blue">
        <header className="px-8 pt-8 pb-2 text-center">
          <img src={ufcLogo} alt="UFC Logo" className="mx-auto h-24 w-auto mb-4 object-contain" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            JORNAL DA <span className="text-ufc-blue">UFC</span>
          </h1>
          <p className="mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Portal de Notícias Acadêmicas
          </p>
        </header>

        <main className="px-8 pb-8 mt-4">
          <RegisterForm />
        </main>
      </div>
    </div>
  );
};