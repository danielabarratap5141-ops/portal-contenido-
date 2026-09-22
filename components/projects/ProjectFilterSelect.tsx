"use client";

import { Select } from "@/components/ui/Field";

type SelectableProject = { id: string; name: string };

export function ProjectFilterSelect({
  projects,
  value,
  onChange,
  allLabel = "Todos los proyectos",
}: {
  projects: SelectableProject[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
}) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </Select>
  );
}
