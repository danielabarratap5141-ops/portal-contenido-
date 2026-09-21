"use client";

import { useState } from "react";
import type { Project } from "@prisma/client";
import { Badge, ColorDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pencil } from "@/components/ui/Icon";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { PROJECT_TYPE_LABEL } from "@/lib/utils";

export function ProjectDetailHeader({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <ColorDot color={project.color} className="h-3.5 w-3.5" />
          <h1 className="text-xl font-semibold text-ink-900">{project.name}</h1>
          <Badge
            style={{ backgroundColor: `${project.color}1a`, color: project.color }}
          >
            {PROJECT_TYPE_LABEL[project.type]}
          </Badge>
          {!project.active && <Badge className="bg-ink-100 text-ink-500">Inactivo</Badge>}
        </div>
        {project.notes && <p className="mt-1.5 max-w-2xl text-sm text-ink-400">{project.notes}</p>}
      </div>
      <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
        <Pencil className="h-3.5 w-3.5" /> Editar proyecto
      </Button>

      <ProjectFormModal open={editing} onClose={() => setEditing(false)} project={project} />
    </div>
  );
}
