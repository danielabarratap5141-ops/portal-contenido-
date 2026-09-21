import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";

export const dynamic = "force-dynamic";

export default async function PendientesPage() {
  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Pendientes"
        description="Arrastrá las tarjetas entre columnas para actualizar su estado."
      />
      <KanbanBoard tasks={tasks} projects={projects} />
    </div>
  );
}
