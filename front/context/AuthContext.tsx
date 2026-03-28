"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type AuthSession,
  type AuthUser,
  getProfile,
  loginRequest,
  registerRequest,
} from "@/api/auth";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { name: string; password: string }) => Promise<void>;
  signUp: (credentials: { name: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = "auth_session";
const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);
const AUTH_PAGES = new Set(["/login", "/register"]);
const PRIVATE_HOME_PATH = "/home";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((session: AuthSession) => {
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!storedSession) {
          return;
        }

        const parsedSession = JSON.parse(storedSession) as AuthSession;

        setToken(parsedSession.token);
        setUser(parsedSession.user);

        try {
          const profile = await getProfile(parsedSession.token);
          persistSession({ token: parsedSession.token, user: profile });
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();
  }, [persistSession]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isPublicPath = PUBLIC_PATHS.has(pathname);

    if (!user || !token) {
      if (!isPublicPath) {
        router.replace("/");
      }
      return;
    }

    if (AUTH_PAGES.has(pathname)) {
      router.replace(PRIVATE_HOME_PATH);
    }
  }, [isLoading, pathname, router, token, user]);

  const signIn = useCallback(
    async (credentials: { name: string; password: string }) => {
      const session = await loginRequest(credentials);
      persistSession(session);
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (credentials: { name: string; password: string }) => {
      await registerRequest(credentials);
    },
    [],
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.replace("/");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, signIn, signOut, signUp, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }

  return context;
}
