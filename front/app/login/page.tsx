"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn({ name, password });
      toast.success("Login realizado com sucesso.");
      router.push("/home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel entrar.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="w-[25%]">
        <CardHeader>
          <CardTitle className="text-2xl">Seja bem-vindo de volta!</CardTitle>
          <CardDescription className="text-foreground/60">
            Realize seu login para ter acesso a todas as nossas incriveis
            ferramentas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field>
              <FieldLabel>Usuario</FieldLabel>
              <Input
                type="text"
                placeholder="Seu nome de usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Senha</FieldLabel>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              variant="login"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Entrando..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          Nao tem sua conta? Faca o registro
          <CardAction>
            <Button variant="secondary" asChild>
              <Link href="/register">Registrar-se</Link>
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </section>
  );
}
