import { apiRequest } from "@/api/client";

export type AuthUser = {
  id: number;
  name: string;
  role: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type LoginPayload = {
  name: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type RegisterResponse = {
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export const authEndpoints = {
  login: "/login",
  register: "/register",
  me: "/me",
};

export async function loginRequest(payload: LoginPayload) {
  const response = await apiRequest<LoginResponse>(authEndpoints.login, {
    method: "POST",
    body: payload,
  });

  return {
    token: response.token,
    user: response.user,
  } satisfies AuthSession;
}

export async function registerRequest(payload: RegisterPayload) {
  const response = await apiRequest<RegisterResponse>(authEndpoints.register, {
    method: "POST",
    body: payload,
  });

  return response.user;
}

export async function getProfile(token: string) {
  const response = await apiRequest<MeResponse>(authEndpoints.me, {
    method: "GET",
    token,
  });

  return response.user;
}
