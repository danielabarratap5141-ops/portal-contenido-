import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { IdeaBankSection } from "@/components/ideas/IdeaBankSection";
import { ContentTable } from "@/components/content/ContentTable";
import { ProjectDetailHeader } from "@/components/projects/ProjectDetailHeader";

export const dynamic = "force-dynamic";

export default async function ProyectoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  const [contentItems, tasks, ideas, allProjects] = await Promise.all([
    prisma.contentItem.findMany({
      where: { projectId: project.id },
      include: { project: true },
      orderBy: { publishDate: "asc" },
    }),
    prisma.task.findMany({
      where: { projectId: project.id },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.idea.findMany({
      where: { projectId: project.id },
      include: { project: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <ProjectDetailHeader project={project} />

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-ink-700">Calendario</h2>
        <MonthCalendar items={contentItems} projects={allProjects} fixedProjectId={project.id} />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-ink-700">Pendientes</h2>
        <KanbanBoard tasks={tasks} projects={allProjects} fixedProjectId={project.id} />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-ink-700">Banco de ideas</h2>
        <IdeaBankSection
          ideas={ideas}
          projects={allProjects}
          fixedProjectId={project.id}
          groupByProject={false}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink-700">Contenido</h2>
        <ContentTable
          items={contentItems}
          projects={allProjects}
          hideProjectFilter
          fixedProjectId={project.id}
        />
      </section>
    </div>
  );
}
