import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { QuickAddButton } from "@/components/layout/QuickAddButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal de contenido",
  description: "Organizador personal de contenido y clientes",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">
          <Sidebar projects={projects} />
          <main className="min-h-screen flex-1 overflow-y-auto bg-ink-50 px-8 py-8">
            {children}
          </main>
        </div>
        <QuickAddButton projects={projects} />
      </body>
    </html>
  );
}
