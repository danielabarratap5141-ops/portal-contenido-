import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TaskListItem } from "@/components/tasks/TaskListItem";
import { ContentCard } from "@/components/content/ContentCard";
import { addDaysUTC } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const weekAhead = addDaysUTC(now, 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [projects, tasksDueSoon, contentThisMonth] = await Promise.all([
    prisma.project.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: { _count: { select: { contentItems: true, tasks: true } } },
    }),
    prisma.task.findMany({
      where: { status: { not: "DONE" }, dueDate: { lte: weekAhead } },
      orderBy: { dueDate: "asc" },
      include: { project: true },
      take: 8,
    }),
    prisma.contentItem.findMany({
      where: { publishDate: { gte: monthStart, lte: monthEnd } },
      orderBy: { publishDate: "asc" },
      include: { project: true },
    }),
  ]);

  const upcomingContent = contentThisMonth.filter((c) => new Date(c.publishDate) >= now).slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen de tu semana y accesos rápidos a cada proyecto."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Pendientes por vencer esta semana
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink-900">{tasksDueSoon.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
              Piezas de contenido este mes
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink-900">{contentThisMonth.length}</p>
          </CardBody>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-700">Pendientes urgentes</h2>
            <Link href="/pendientes" className="text-xs font-medium text-ink-400 hover:text-ink-700">
              Ver todos
            </Link>
          </div>
          {tasksDueSoon.length === 0 ? (
            <EmptyState title="Sin pendientes urgentes" description="Estás al día." />
          ) : (
            <div className="space-y-2">
              {tasksDueSoon.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-700">Próximo a publicarse</h2>
            <Link href="/calendario" className="text-xs font-medium text-ink-400 hover:text-ink-700">
              Ver calendario
            </Link>
          </div>
          {upcomingContent.length === 0 ? (
            <EmptyState title="Sin contenido próximo" description="No hay nada agendado todavía." />
          ) : (
            <div className="space-y-2">
              {upcomingContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-700">Proyectos</h2>
          <Link href="/proyectos" className="text-xs font-medium text-ink-400 hover:text-ink-700">
            Ver todos
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            title="Todavía no tenés proyectos"
            description="Creá tu primer proyecto (cliente o propio) para empezar a cargar contenido."
            action={
              <Link
                href="/proyectos/nuevo"
                className="text-sm font-medium text-ink-900 underline underline-offset-2"
              >
                Crear proyecto
              </Link>
            }
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
      </section>
    </div>
  );
}
