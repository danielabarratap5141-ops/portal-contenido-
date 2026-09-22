import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContentTable } from "@/components/content/ContentTable";

export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  const [items, projects] = await Promise.all([
    prisma.contentItem.findMany({
      include: { project: true },
      orderBy: { publishDate: "desc" },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Contenido"
        description="Todas tus piezas de contenido, filtrables por proyecto, red social y estado."
      />
      <ContentTable items={items} projects={projects} />
    </div>
  );
}
