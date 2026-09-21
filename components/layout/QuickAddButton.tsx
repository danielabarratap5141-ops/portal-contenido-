"use client";

import { useState } from "react";
import type { Project } from "@prisma/client";
import { Plus, Kanban, Lightbulb, Table } from "@/components/ui/Icon";
import { ContentFormModal } from "@/components/content/ContentFormModal";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { IdeaFormModal } from "@/components/ideas/IdeaFormModal";
import { cn } from "@/lib/utils";

type Mode = "content" | "task" | "idea" | null;

export function QuickAddButton({ projects }: { projects: Pick<Project, "id" | "name">[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);

  function openMode(m: Mode) {
    setMode(m);
    setMenuOpen(false);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {menuOpen && (
          <div className="mb-1 flex flex-col gap-1 rounded-xl2 border border-ink-100 bg-white p-1.5 shadow-card">
            <QuickMenuItem
              icon={Table}
              label="Nuevo contenido"
              onClick={() => openMode("content")}
            />
            <QuickMenuItem icon={Kanban} label="Nuevo pendiente" onClick={() => openMode("task")} />
            <QuickMenuItem icon={Lightbulb} label="Nueva idea" onClick={() => openMode("idea")} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white shadow-card transition-transform hover:bg-ink-800",
            menuOpen && "rotate-45"
          )}
          aria-label="Agregar"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <ContentFormModal
        open={mode === "content"}
        onClose={() => setMode(null)}
        projects={projects}
      />
      <TaskFormModal open={mode === "task"} onClose={() => setMode(null)} projects={projects} />
      <IdeaFormModal open={mode === "idea"} onClose={() => setMode(null)} projects={projects} />
    </>
  );
}

function QuickMenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-100"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
