import slug from "slug";

export function generateSlug(text: string): string {
  return slug(text, { lower: true });
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDatetime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }

  return {
    success: false,
    error: "Erro desconhecido",
    status: 500,
  };
}
