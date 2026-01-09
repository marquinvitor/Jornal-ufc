import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../../../components/Input";
import { loginUser, type LoginUserData } from "../services/authService";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginUserData>({
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast
      .promise(
        loginUser(formData),
        {
          loading: "Autenticando no Jornal da UFC...",
          success: "Bem-vindo de volta! 🎉",
          error: (err) =>
            `Falha no acesso: ${err.message || "Verifique suas credenciais."}`,
        },
        {
          success: {
            duration: 4000,
            icon: "🔑",
          },
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Input
        label="E-mail Institucional *"
        name="email"
        type="email"
        placeholder="exemplo@ufc.br"
        onChange={handleChange}
        required
      />

      <Input
        label="Senha *"
        name="senha"
        type="password"
        placeholder="Sua senha de acesso"
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-4 bg-ufc-blue text-white font-black py-3 rounded shadow transition-all uppercase tracking-widest text-xs ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#026a93]"
        }`}
      >
        {loading ? "Verificando..." : "Entrar no Portal"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
          Ainda não possui acesso?{" "}
          <Link
            to="/register"
            className="text-ufc-blue cursor-pointer hover:underline"
          >
            Crie sua conta aqui
          </Link>
        </p>
      </div>
    </form>
  );
};
