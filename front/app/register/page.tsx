"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmP, setConfirmP] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmP) {
      toast.error("As senhas nao coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({ name, password });
      toast.success("Cadastro realizado com sucesso. Agora faca seu login.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel cadastrar.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen">
      <Card className="w-[25%]">
        <CardHeader>
          <CardTitle className="text-2xl">Sua primeira vez?</CardTitle>
          <CardDescription className="text-foreground/60">
            Crie sua conta para desfrutar do nosso sistema!
          </CardDescription>
          <CardAction>
            <Button variant="login" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardAction>
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
            <Field>
              <FieldLabel>Confirme sua senha</FieldLabel>
              <Input
                type="password"
                placeholder="Sua senha"
                value={confirmP}
                onChange={(e) => setConfirmP(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
