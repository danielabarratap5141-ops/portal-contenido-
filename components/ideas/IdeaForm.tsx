"use client";

import type { Idea, Project } from "@prisma/client";
import { createIdea, updateIdea } from "@/app/actions/ideas";
import { FieldLabel, FormRow, Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ProjectSelectField } from "@/components/projects/ProjectSelectField";
import { CONTENT_FORMAT_LABEL, enumOptions } from "@/lib/utils";

export function IdeaForm({
  projects,
  idea,
  defaultProjectId,
  onSuccess,
}: {
  projects: Pick<Project, "id" | "name">[];
  idea?: Idea;
  defaultProjectId?: string;
  onSuccess?: () => void;
}) {
  const isEdit = Boolean(idea);

  async function action(formData: FormData) {
    if (idea) {
      await updateIdea(idea.id, formData);
    } else {
      await createIdea(formData);
    }
    onSuccess?.();
  }

  return (
    <form action={action}>
      <FormRow>
        <FieldLabel htmlFor="description" required>
          Descripción de la idea
        </FieldLabel>
        <Textarea
          id="description"
          name="description"
          defaultValue={idea?.description}
          placeholder="Ej. Serie de reels mostrando el proceso de cada plato"
          required
          autoFocus
          rows={3}
        />
      </FormRow>

      <FormRow>
        <ProjectSelectField
          projects={projects}
          defaultValue={idea?.projectId ?? defaultProjectId}
          required
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="suggestedFormat">Formato sugerido</FieldLabel>
        <Select id="suggestedFormat" name="suggestedFormat" defaultValue={idea?.suggestedFormat ?? ""}>
          <option value="">Sin definir</option>
          {enumOptions(CONTENT_FORMAT_LABEL).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="tags">Etiquetas</FieldLabel>
        <Input
          id="tags"
          name="tags"
          defaultValue={idea?.tags ?? ""}
          placeholder="temporada, evergreen, promoción"
        />
        <p className="mt-1 text-xs text-ink-300">Separadas por coma.</p>
      </FormRow>

      <div className="mt-5 flex justify-end gap-2">
        <SubmitButton>{isEdit ? "Guardar cambios" : "Guardar idea"}</SubmitButton>
      </div>
    </form>
  );
}
