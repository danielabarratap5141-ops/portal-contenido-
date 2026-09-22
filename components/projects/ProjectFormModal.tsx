"use client";

import { useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/Button";
import { Trash } from "@/components/ui/Icon";
import { deleteProject } from "@/app/actions/projects";

export function ProjectFormModal({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project?: Project;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDelete() {
    if (!project) return;
    startTransition(async () => {
      await deleteProject(project.id);
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={project ? "Editar proyecto" : "Nuevo proyecto"}>
      <ProjectForm project={project} onSuccess={onClose} />
      {project && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">
                ¿Eliminar el proyecto y todo su contenido, pendientes e ideas?
              </span>
              <Button variant="danger" size="sm" disabled={isPending} onClick={handleDelete}>
                Sí, eliminar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700"
            >
              <Trash className="h-3.5 w-3.5" /> Eliminar proyecto
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
