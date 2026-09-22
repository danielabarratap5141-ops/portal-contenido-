"use client";

import { useState } from "react";
import type { Project } from "@prisma/client";
import { createProject, updateProject } from "@/app/actions/projects";
import { FieldLabel, FormRow, Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PROJECT_TYPE_LABEL, enumOptions } from "@/lib/utils";

const PRESET_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#f97316",
  "#f43f5e",
  "#10b981",
  "#a855f7",
  "#eab308",
  "#14b8a6",
];

export function ProjectForm({
  project,
  onSuccess,
}: {
  project?: Project;
  onSuccess?: () => void;
}) {
  const [color, setColor] = useState(project?.color ?? PRESET_COLORS[0]);
  const isEdit = Boolean(project);

  async function action(formData: FormData) {
    formData.set("color", color);
    if (project) {
      await updateProject(project.id, formData);
      onSuccess?.();
    } else {
      await createProject(formData);
    }
  }

  return (
    <form action={action}>
      <FormRow>
        <FieldLabel htmlFor="name" required>
          Nombre
        </FieldLabel>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          placeholder="Ej. Hotel Las Palmas"
          required
          autoFocus
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="type" required>
          Tipo
        </FieldLabel>
        <Select id="type" name="type" defaultValue={project?.type ?? "OWN"}>
          {enumOptions(PROJECT_TYPE_LABEL).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow>
        <FieldLabel>Color identificador</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="h-7 w-7 rounded-full ring-offset-2"
              style={{
                backgroundColor: c,
                boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
              }}
              aria-label={c}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-ink-200 bg-transparent"
            aria-label="Color personalizado"
          />
        </div>
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="notes">Notas generales</FieldLabel>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={project?.notes ?? ""}
          placeholder="Contexto, accesos, brief, tono de marca..."
        />
      </FormRow>

      {isEdit && (
        <FormRow className="flex items-center gap-2">
          <input
            id="active"
            name="active"
            type="checkbox"
            defaultChecked={project?.active ?? true}
            className="h-4 w-4 rounded border-ink-300"
          />
          <FieldLabel htmlFor="active">
            <span className="!mb-0 inline">Proyecto activo</span>
          </FieldLabel>
        </FormRow>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <SubmitButton>{isEdit ? "Guardar cambios" : "Crear proyecto"}</SubmitButton>
      </div>
    </form>
  );
}
