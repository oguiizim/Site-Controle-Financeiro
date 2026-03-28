import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const interMono = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Control",
  description: "Aplicação feita para alcançar sua liberdade financeira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={`${interMono.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          themes={["light", "dark"]}
        >
          <AuthProvider>
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
