"use client";

import { useState } from "react";
import type { Idea, Project } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icon";
import { IdeaFormModal } from "@/components/ideas/IdeaFormModal";
import { ConvertIdeaModal } from "@/components/ideas/ConvertIdeaModal";
import { CONTENT_FORMAT_LABEL, parseTags } from "@/lib/utils";

export function IdeaCard({
  idea,
  projects,
}: {
  idea: Idea;
  projects: Pick<Project, "id" | "name">[];
}) {
  const [editing, setEditing] = useState(false);
  const [converting, setConverting] = useState(false);
  const tags = parseTags(idea.tags);

  return (
    <div className="rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="w-full text-left text-sm text-ink-800"
      >
        {idea.description}
      </button>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {idea.suggestedFormat && (
          <Badge className="bg-ink-100 text-ink-600">
            {CONTENT_FORMAT_LABEL[idea.suggestedFormat]}
          </Badge>
        )}
        {tags.map((tag) => (
          <Badge key={tag} className="bg-violet-50 text-violet-600">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Button size="sm" variant="secondary" onClick={() => setConverting(true)}>
          Convertir en contenido <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <IdeaFormModal
        open={editing}
        onClose={() => setEditing(false)}
        projects={projects}
        idea={idea}
      />
      <ConvertIdeaModal
        open={converting}
        onClose={() => setConverting(false)}
        idea={converting ? idea : null}
      />
    </div>
  );
}
