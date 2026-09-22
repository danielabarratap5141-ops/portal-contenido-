"use client";

import type { Project, Task } from "@prisma/client";
import { createTask, updateTask } from "@/app/actions/tasks";
import { FieldLabel, FormGrid, FormRow, Input, Select, Textarea } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ProjectSelectField } from "@/components/projects/ProjectSelectField";
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL, enumOptions, toDateInputValue } from "@/lib/utils";

export function TaskForm({
  projects,
  task,
  defaultProjectId,
  defaultStatus,
  onSuccess,
}: {
  projects: Pick<Project, "id" | "name">[];
  task?: Task;
  defaultProjectId?: string;
  defaultStatus?: Task["status"];
  onSuccess?: () => void;
}) {
  const isEdit = Boolean(task);

  async function action(formData: FormData) {
    if (task) {
      await updateTask(task.id, formData);
    } else {
      await createTask(formData);
    }
    onSuccess?.();
  }

  return (
    <form action={action}>
      <FormRow>
        <FieldLabel htmlFor="title" required>
          Título de la tarea
        </FieldLabel>
        <Input
          id="title"
          name="title"
          defaultValue={task?.title}
          placeholder="Ej. Enviar propuesta de contenidos"
          required
          autoFocus
        />
      </FormRow>

      <FormGrid>
        <div>
          <ProjectSelectField
            projects={projects}
            defaultValue={task?.projectId ?? defaultProjectId}
            allowEmpty
          />
        </div>
        <div>
          <FieldLabel htmlFor="dueDate">Fecha límite</FieldLabel>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={toDateInputValue(task?.dueDate)}
          />
        </div>
      </FormGrid>

      <FormGrid>
        <div>
          <FieldLabel htmlFor="priority">Prioridad</FieldLabel>
          <Select id="priority" name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
            {enumOptions(TASK_PRIORITY_LABEL).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="status">Estado</FieldLabel>
          <Select
            id="status"
            name="status"
            defaultValue={task?.status ?? defaultStatus ?? "TODO"}
          >
            {enumOptions(TASK_STATUS_LABEL).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </FormGrid>

      <FormRow>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <Textarea id="notes" name="notes" defaultValue={task?.notes ?? ""} />
      </FormRow>

      <div className="mt-5 flex justify-end gap-2">
        <SubmitButton>{isEdit ? "Guardar cambios" : "Crear pendiente"}</SubmitButton>
      </div>
    </form>
  );
}
