"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/admin");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao fazer login",
      };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { login, isLoading };
}
