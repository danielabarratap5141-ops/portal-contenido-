import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    include: { _count: { select: { contentItems: true, tasks: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Clientes de agencia y proyectos propios, todos en un solo lugar."
        action={
          <Link href="/proyectos/nuevo">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Nuevo proyecto
            </Button>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Todavía no tenés proyectos"
          description="Creá tu primer proyecto para empezar a organizar contenido."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              contentCount={project._count.contentItems}
              taskCount={project._count.tasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
