"use client";

import { useState, useTransition } from "react";
import type { Idea, Project } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { IdeaForm } from "@/components/ideas/IdeaForm";
import { Button } from "@/components/ui/Button";
import { Trash } from "@/components/ui/Icon";
import { deleteIdea } from "@/app/actions/ideas";

export function IdeaFormModal({
  open,
  onClose,
  projects,
  idea,
  defaultProjectId,
}: {
  open: boolean;
  onClose: () => void;
  projects: Pick<Project, "id" | "name">[];
  idea?: Idea;
  defaultProjectId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDelete() {
    if (!idea) return;
    startTransition(async () => {
      await deleteIdea(idea.id);
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={idea ? "Editar idea" : "Nueva idea"}>
      <IdeaForm
        projects={projects}
        idea={idea}
        defaultProjectId={defaultProjectId}
        onSuccess={onClose}
      />
      {idea && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">¿Eliminar esta idea?</span>
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
              <Trash className="h-3.5 w-3.5" /> Eliminar idea
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
