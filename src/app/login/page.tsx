"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input, Button } from "@/components";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email ou senha inválidos");
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/admin");
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-700/50 bg-navy-800 p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Lock size={24} className="text-blue-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-8 text-slate-50">
            Acesso Restrito
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              required
              containerClassName="space-y-2"
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              containerClassName="space-y-2"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
