import Link from "next/link";
import type { Project } from "@prisma/client";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge, ColorDot } from "@/components/ui/Badge";
import { PROJECT_TYPE_LABEL } from "@/lib/utils";

export function ProjectCard({
  project,
  contentCount,
  taskCount,
}: {
  project: Project;
  contentCount?: number;
  taskCount?: number;
}) {
  return (
    <Link href={`/proyectos/${project.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardBody>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <ColorDot color={project.color} className="h-3 w-3" />
              <h3 className="font-semibold text-ink-900">{project.name}</h3>
            </div>
            {!project.active && (
              <Badge className="bg-ink-100 text-ink-500">Inactivo</Badge>
            )}
          </div>

          <Badge
            className="mt-2"
            style={{
              backgroundColor: `${project.color}1a`,
              color: project.color,
            }}
          >
            {PROJECT_TYPE_LABEL[project.type]}
          </Badge>

          {project.notes && (
            <p className="mt-3 line-clamp-2 text-sm text-ink-400">{project.notes}</p>
          )}

          {(contentCount !== undefined || taskCount !== undefined) && (
            <div className="mt-4 flex gap-4 text-xs text-ink-400">
              {contentCount !== undefined && <span>{contentCount} contenidos</span>}
              {taskCount !== undefined && <span>{taskCount} pendientes</span>}
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
