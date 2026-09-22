"use client";

import { useMemo, useState } from "react";
import type { Idea, Project } from "@prisma/client";
import { ColorDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { IdeaFormModal } from "@/components/ideas/IdeaFormModal";

export type IdeaWithProject = Idea & {
  project: Pick<Project, "id" | "name" | "color">;
};

export function IdeaBankSection({
  ideas,
  projects,
  fixedProjectId,
  groupByProject = true,
}: {
  ideas: IdeaWithProject[];
  projects: Pick<Project, "id" | "name">[];
  fixedProjectId?: string;
  groupByProject?: boolean;
}) {
  const [creating, setCreating] = useState(false);

  const groups = useMemo(() => {
    if (!groupByProject) return [{ project: null, ideas }];
    const map = new Map<string, { project: IdeaWithProject["project"]; ideas: IdeaWithProject[] }>();
    for (const idea of ideas) {
      const key = idea.project.id;
      if (!map.has(key)) map.set(key, { project: idea.project, ideas: [] });
      map.get(key)!.ideas.push(idea);
    }
    return Array.from(map.values());
  }, [ideas, groupByProject]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Nueva idea
        </Button>
      </div>

      {ideas.length === 0 ? (
        <EmptyState
          title="Todavía no hay ideas guardadas"
          description="Anotá ideas sueltas para no perderlas, aunque no tengan fecha todavía."
        />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.project?.id ?? "all"}>
              {group.project && (
                <div className="mb-2 flex items-center gap-2">
                  <ColorDot color={group.project.color} />
                  <h3 className="text-sm font-semibold text-ink-700">{group.project.name}</h3>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} projects={projects} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <IdeaFormModal
        open={creating}
        onClose={() => setCreating(false)}
        projects={projects}
        defaultProjectId={fixedProjectId}
      />
    </div>
  );
}
