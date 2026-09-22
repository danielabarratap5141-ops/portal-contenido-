"use client";

import type { Idea } from "@prisma/client";
import { convertIdeaToContent } from "@/app/actions/ideas";
import { Modal } from "@/components/ui/Modal";
import { FieldLabel, FormGrid, FormRow, Input, Select } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CONTENT_FORMAT_LABEL, SOCIAL_NETWORK_LABEL, enumOptions } from "@/lib/utils";

export function ConvertIdeaModal({
  open,
  onClose,
  idea,
}: {
  open: boolean;
  onClose: () => void;
  idea: Idea | null;
}) {
  if (!idea) return null;

  async function action(formData: FormData) {
    await convertIdeaToContent(idea!.id, formData);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Convertir en contenido programado">
      <p className="mb-4 rounded-lg bg-ink-50 p-3 text-sm text-ink-500">{idea.description}</p>
      <form action={action}>
        <FormRow>
          <FieldLabel htmlFor="title">Título del contenido</FieldLabel>
          <Input
            id="title"
            name="title"
            defaultValue={idea.description.slice(0, 80)}
            placeholder="Título para el contenido"
          />
        </FormRow>

        <FormGrid>
          <div>
            <FieldLabel htmlFor="publishDate" required>
              Fecha de publicación
            </FieldLabel>
            <Input id="publishDate" name="publishDate" type="date" required />
          </div>
          <div>
            <FieldLabel htmlFor="network">Red social</FieldLabel>
            <Select id="network" name="network" defaultValue="INSTAGRAM">
              {enumOptions(SOCIAL_NETWORK_LABEL).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </FormGrid>

        <FormRow>
          <FieldLabel htmlFor="format">Formato</FieldLabel>
          <Select id="format" name="format" defaultValue={idea.suggestedFormat ?? "POST"}>
            {enumOptions(CONTENT_FORMAT_LABEL).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormRow>

        <p className="mb-4 text-xs text-ink-300">
          La idea se moverá del banco de ideas a contenido programado. El texto de la idea queda
          como copy inicial.
        </p>

        <div className="flex justify-end gap-2">
          <SubmitButton>Convertir en contenido</SubmitButton>
        </div>
      </form>
    </Modal>
  );
}
