import { API_BASE_URL } from "@/api/config";

type RequestConfig = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> {
  const { body, headers, token, ...rest } = config;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "Nao foi possivel concluir a requisicao.";

    throw new ApiError(message, response.status);
  }

  return payload as T;
}
