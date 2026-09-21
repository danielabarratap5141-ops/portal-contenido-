import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { IdeaBankSection } from "@/components/ideas/IdeaBankSection";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const [ideas, projects] = await Promise.all([
    prisma.idea.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Banco de ideas"
        description="Ideas sueltas sin fecha todavía, agrupadas por proyecto."
      />
      <IdeaBankSection ideas={ideas} projects={projects} />
    </div>
  );
}
