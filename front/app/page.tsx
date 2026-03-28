"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const themes = ["Dark", "Light", "System"] as const;

export default function Home() {
  const { setTheme } = useTheme();

  function handleChange(value: string) {
    setTheme(value.toLowerCase());
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-5">
      <Label className="text-5xl">
        A ferramenta mais poderosa para controlar suas finanças
      </Label>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Registro</Link>
        </Button>
        <Combobox items={themes} onInputValueChange={handleChange}>
          <ComboboxInput placeholder="Escolha seu tema" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}
