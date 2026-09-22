"use client";

import type { Project, Task } from "@prisma/client";
import { useDraggable } from "@dnd-kit/core";
import { Badge, ColorDot } from "@/components/ui/Badge";
import { TASK_PRIORITY_COLOR, TASK_PRIORITY_LABEL, formatDate, startOfDay } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type TaskWithProject = Task & {
  project: Pick<Project, "id" | "name" | "color"> | null;
};

export function TaskCard({
  task,
  onClick,
}: {
  task: TaskWithProject;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const isOverdue =
    task.dueDate && task.status !== "DONE" && new Date(task.dueDate) < startOfDay(new Date());

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "cursor-grab touch-none rounded-lg border border-ink-100 bg-white p-3 text-left shadow-soft transition-shadow hover:shadow-card active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <p className="text-sm font-medium text-ink-900">{task.title}</p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {task.project && (
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <ColorDot color={task.project.color} />
            {task.project.name}
          </span>
        )}
        <Badge className={TASK_PRIORITY_COLOR[task.priority]}>
          {TASK_PRIORITY_LABEL[task.priority]}
        </Badge>
        {task.dueDate && (
          <Badge className={isOverdue ? "bg-rose-100 text-rose-700" : "bg-ink-100 text-ink-500"}>
            {formatDate(task.dueDate)}
          </Badge>
        )}
      </div>
    </div>
  );
}
