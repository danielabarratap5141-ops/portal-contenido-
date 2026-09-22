import { FieldLabel, Select } from "@/components/ui/Field";

type SelectableProject = { id: string; name: string };

export function ProjectSelectField({
  projects,
  defaultValue,
  required,
  allowEmpty,
  emptyLabel = "Sin proyecto",
  id = "projectId",
  name = "projectId",
}: {
  projects: SelectableProject[];
  defaultValue?: string;
  required?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
  id?: string;
  name?: string;
}) {
  return (
    <>
      <FieldLabel htmlFor={id} required={required}>
        Proyecto
      </FieldLabel>
      <Select id={id} name={name} defaultValue={defaultValue ?? ""} required={required}>
        {allowEmpty && <option value="">{emptyLabel}</option>}
        {!allowEmpty && !defaultValue && <option value="" disabled>
          Elegí un proyecto
        </option>}
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
    </>
  );
}
