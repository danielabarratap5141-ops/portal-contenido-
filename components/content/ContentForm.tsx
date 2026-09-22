"use client";

import type { ContentItem, Project } from "@prisma/client";
import { createContentItem, updateContentItem } from "@/app/actions/content";
import {
  FieldLabel,
  FormGrid,
  FormRow,
  Input,
  Select,
  Textarea,
} from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ProjectSelectField } from "@/components/projects/ProjectSelectField";
import {
  CONTENT_FORMAT_LABEL,
  CONTENT_STATUS_LABEL,
  SOCIAL_NETWORK_LABEL,
  enumOptions,
  toDateInputValue,
} from "@/lib/utils";

export function ContentForm({
  projects,
  item,
  defaultProjectId,
  defaultDate,
  onSuccess,
}: {
  projects: Pick<Project, "id" | "name">[];
  item?: ContentItem;
  defaultProjectId?: string;
  defaultDate?: string;
  onSuccess?: () => void;
}) {
  const isEdit = Boolean(item);

  async function action(formData: FormData) {
    if (item) {
      await updateContentItem(item.id, formData);
    } else {
      await createContentItem(formData);
    }
    onSuccess?.();
  }

  return (
    <form action={action}>
      <FormRow>
        <FieldLabel htmlFor="title" required>
          Título
        </FieldLabel>
        <Input
          id="title"
          name="title"
          defaultValue={item?.title}
          placeholder="Ej. Reel: nueva colección de otoño"
          required
          autoFocus
        />
      </FormRow>

      <FormGrid>
        <div>
          <ProjectSelectField
            projects={projects}
            defaultValue={item?.projectId ?? defaultProjectId}
            required
          />
        </div>
        <div>
          <FieldLabel htmlFor="publishDate" required>
            Fecha de publicación
          </FieldLabel>
          <Input
            id="publishDate"
            name="publishDate"
            type="date"
            defaultValue={toDateInputValue(item?.publishDate) || defaultDate}
            required
          />
        </div>
      </FormGrid>

      <FormGrid>
        <div>
          <FieldLabel htmlFor="network">Red social</FieldLabel>
          <Select id="network" name="network" defaultValue={item?.network ?? "INSTAGRAM"}>
            {enumOptions(SOCIAL_NETWORK_LABEL).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="format">Formato</FieldLabel>
          <Select id="format" name="format" defaultValue={item?.format ?? "POST"}>
            {enumOptions(CONTENT_FORMAT_LABEL).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </FormGrid>

      <FormRow>
        <FieldLabel htmlFor="status">Estado</FieldLabel>
        <Select id="status" name="status" defaultValue={item?.status ?? "IDEA"}>
          {enumOptions(CONTENT_STATUS_LABEL).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="copyText">Copy / texto final</FieldLabel>
        <Textarea
          id="copyText"
          name="copyText"
          defaultValue={item?.copyText ?? ""}
          placeholder="Texto final para la publicación..."
          rows={5}
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="designNotes">Notas de diseño / referencias</FieldLabel>
        <Textarea
          id="designNotes"
          name="designNotes"
          defaultValue={item?.designNotes ?? ""}
          placeholder="Referencias visuales, paleta, links de moodboard..."
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="publishedUrl">Link a la publicación</FieldLabel>
        <Input
          id="publishedUrl"
          name="publishedUrl"
          type="url"
          defaultValue={item?.publishedUrl ?? ""}
          placeholder="https://instagram.com/p/..."
        />
      </FormRow>

      <div className="mt-5 flex justify-end gap-2">
        <SubmitButton>{isEdit ? "Guardar cambios" : "Crear contenido"}</SubmitButton>
      </div>
    </form>
  );
}
