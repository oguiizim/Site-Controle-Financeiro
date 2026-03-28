"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Usuario autenticado</CardTitle>
          <CardDescription>
            Esse card confirma que o login foi concluido com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-3">
            <p><strong>ID:</strong> {user?.id ?? "Nao informado"}</p>
            <p><strong>Nome:</strong> {user?.name ?? "Nao informado"}</p>
            <p><strong>Perfil:</strong> {user?.role ?? "Nao informado"}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
