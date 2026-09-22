"use client";

import { useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Modal } from "@/components/ui/Modal";
import { ContentForm } from "@/components/content/ContentForm";
import { Button } from "@/components/ui/Button";
import { Trash } from "@/components/ui/Icon";
import { deleteContentItem } from "@/app/actions/content";
import type { ContentItemWithProject } from "@/components/content/ContentCard";

export function ContentFormModal({
  open,
  onClose,
  projects,
  item,
  defaultProjectId,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  projects: Pick<Project, "id" | "name">[];
  item?: ContentItemWithProject;
  defaultProjectId?: string;
  defaultDate?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDelete() {
    if (!item) return;
    startTransition(async () => {
      await deleteContentItem(item.id);
      onClose();
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? "Editar contenido" : "Nuevo contenido"}
      width="lg"
    >
      <ContentForm
        projects={projects}
        item={item}
        defaultProjectId={defaultProjectId}
        defaultDate={defaultDate}
        onSuccess={onClose}
      />
      {item && (
        <div className="mt-4 border-t border-ink-100 pt-4">
          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-500">¿Eliminar este contenido?</span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isPending}
                onClick={handleDelete}
              >
                Sí, eliminar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700"
            >
              <Trash className="h-3.5 w-3.5" /> Eliminar contenido
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
