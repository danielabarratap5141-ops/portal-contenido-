import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const [items, projects] = await Promise.all([
    prisma.contentItem.findMany({
      include: { project: true },
      orderBy: { publishDate: "asc" },
    }),
    prisma.project.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Calendario"
        description="Todo tu contenido en un solo lugar, coloreado por proyecto. Hacé clic en un día para crear contenido nuevo."
      />
      <MonthCalendar items={items} projects={projects} />
    </div>
  );
}
