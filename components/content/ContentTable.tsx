"use client";

import { useMemo, useState } from "react";
import type { Project } from "@prisma/client";
import { Badge, ColorDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Search } from "@/components/ui/Icon";
import { ContentFormModal } from "@/components/content/ContentFormModal";
import type { ContentItemWithProject } from "@/components/content/ContentCard";
import {
  CONTENT_FORMAT_LABEL,
  CONTENT_STATUS_COLOR,
  CONTENT_STATUS_LABEL,
  SOCIAL_NETWORK_LABEL,
  enumOptions,
  formatDate,
} from "@/lib/utils";

export function ContentTable({
  items,
  projects,
  hideProjectFilter,
  fixedProjectId,
}: {
  items: ContentItemWithProject[];
  projects: Pick<Project, "id" | "name">[];
  hideProjectFilter?: boolean;
  fixedProjectId?: string;
}) {
  const [search, setSearch] = useState("");
  const [projectId, setProjectId] = useState("");
  const [network, setNetwork] = useState("");
  const [status, setStatus] = useState("");
  const [editingItem, setEditingItem] = useState<ContentItemWithProject | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (projectId && item.projectId !== projectId) return false;
      if (network && item.network !== network) return false;
      if (status && item.status !== status) return false;
      if (term) {
        const haystack = `${item.title} ${item.copyText ?? ""}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [items, search, projectId, network, status]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <Input
            placeholder="Buscar por título o copy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {!hideProjectFilter && (
          <Select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-auto"
          >
            <option value="">Todos los proyectos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        )}
        <Select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-auto">
          <option value="">Toda red social</option>
          {enumOptions(SOCIAL_NETWORK_LABEL).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">Todo estado</option>
          {enumOptions(CONTENT_STATUS_LABEL).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Button size="sm" onClick={() => setCreating(true)} className="ml-auto">
          <Plus className="h-4 w-4" /> Nuevo contenido
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay contenido que coincida"
          description="Probá cambiar los filtros o crear una pieza nueva."
        />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                <th className="px-4 py-2.5">Título</th>
                {!hideProjectFilter && <th className="px-4 py-2.5">Proyecto</th>}
                <th className="px-4 py-2.5">Fecha</th>
                <th className="px-4 py-2.5">Red</th>
                <th className="px-4 py-2.5">Formato</th>
                <th className="px-4 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setEditingItem(item)}
                  className="cursor-pointer border-b border-ink-50 last:border-0 hover:bg-ink-50/60"
                >
                  <td className="max-w-[280px] truncate px-4 py-2.5 font-medium text-ink-900">
                    {item.title}
                  </td>
                  {!hideProjectFilter && (
                    <td className="px-4 py-2.5 text-ink-500">
                      <span className="flex items-center gap-1.5">
                        <ColorDot color={item.project.color} />
                        {item.project.name}
                      </span>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-4 py-2.5 text-ink-500">
                    {formatDate(item.publishDate)}
                  </td>
                  <td className="px-4 py-2.5 text-ink-500">
                    {SOCIAL_NETWORK_LABEL[item.network]}
                  </td>
                  <td className="px-4 py-2.5 text-ink-500">
                    {CONTENT_FORMAT_LABEL[item.format]}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={CONTENT_STATUS_COLOR[item.status]}>
                      {CONTENT_STATUS_LABEL[item.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContentFormModal
        open={creating}
        onClose={() => setCreating(false)}
        projects={projects}
        defaultProjectId={fixedProjectId}
      />
      {editingItem && (
        <ContentFormModal
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          projects={projects}
          item={editingItem}
        />
      )}
    </div>
  );
}
