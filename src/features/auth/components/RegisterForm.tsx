import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; 
import { Input } from "../../../components/Input";
import { registerUser } from "../services/authService";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    emailInstitucional: "",
    matricula: "",
    senha: "",
    perfil: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.perfil === "") {
      toast.error("Por favor, selecione um perfil (Aluno ou Professor).");
      return;
    }

    setLoading(true);

    toast
      .promise(
        registerUser(formData),
        {
          loading: "Criando sua conta no Jornal da UFC...",
          success: "Usuário cadastrado com sucesso! 🎉",
          error: (err) =>
            `Erro ao cadastrar: ${err.message || "Tente novamente."}`,
        },
        {
          success: {
            duration: 5000,
            icon: "✅",
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
        label="Nome Completo *"
        name="nomeCompleto"
        placeholder="Digite seu nome completo"
        onChange={handleChange}
        required
      />

      <Input
        label="E-mail Institucional *"
        name="emailInstitucional"
        type="email"
        placeholder="exemplo@ufc.br"
        onChange={handleChange}
        required
      />

      <div className="flex gap-4">
        <Input
          label="Matrícula"
          name="matricula"
          placeholder="000000"
          onChange={handleChange}
        />

        <Input
          label="Perfil *"
          name="perfil"
          isSelect
          value={formData.perfil}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden>
            Selecione
          </option>
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
        </Input>
      </div>

      <Input
        label="Senha *"
        name="senha"
        type="password"
        placeholder="Crie uma senha segura"
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
        {loading ? "Processando..." : "Finalizar Cadastro"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
          Já possui uma conta?{" "}
          <Link 
            to="/login" 
            className="text-ufc-blue cursor-pointer hover:underline"
          >
            Faça login aqui
          </Link>
        </p>
      </div>
    </form>
  );
};