"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

export function useFetch<T>(
  url: string,
  options?: UseFetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options?.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (options?.method === "GET" || !options?.method) {
      fetch_();
    }
  }, [url, fetch_]);

  return { data, error, isLoading, fetch: fetch_ };
}

export function useMutation<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (body?: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro na requisição");
        }

        const result = await response.json();
        setData(result.data || result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method]
  );

  return { data, error, isLoading, mutate };
}
