"use client";

import { useState, useTransition } from "react";
import type { Project, Task } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { Trash } from "@/components/ui/Icon";
import { deleteTask } from "@/app/actions/tasks";

export function TaskFormModal({
  open,
  onClose,
  projects,
  task,
  defaultProjectId,
  defaultStatus,
}: {
  open: boolean;
  onClose: () => void;
  projects: Pick<Project, "id" | "name">[];
  task?: Task;
  defaultProjectId?: string;
  defaultStatus?: Task["status"];
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDelete() {
    if (!task) return;
    startTransition(async () => {
      await deleteTask(task.id);
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? "Editar pendiente" : "Nuevo pendiente"}>
      <TaskForm
        projects={projects}
        task={task}
        defaultProjectId={defaultProjectId}
        defaultStatus={defaultStatus}
        onSuccess={onClose}
      />
      {task && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">¿Eliminar este pendiente?</span>
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
              <Trash className="h-3.5 w-3.5" /> Eliminar pendiente
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
