import { Badge, ColorDot } from "@/components/ui/Badge";
import { TASK_PRIORITY_COLOR, TASK_PRIORITY_LABEL, formatDate, startOfDay } from "@/lib/utils";
import type { TaskWithProject } from "@/components/tasks/TaskCard";

export function TaskListItem({ task }: { task: TaskWithProject }) {
  const isOverdue =
    task.dueDate && task.status !== "DONE" && new Date(task.dueDate) < startOfDay(new Date());

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 bg-white px-3 py-2.5 shadow-soft">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink-900">{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-400">
          {task.project && (
            <span className="flex items-center gap-1">
              <ColorDot color={task.project.color} />
              {task.project.name}
            </span>
          )}
          <Badge className={TASK_PRIORITY_COLOR[task.priority]}>
            {TASK_PRIORITY_LABEL[task.priority]}
          </Badge>
        </div>
      </div>
      {task.dueDate && (
        <span className={`shrink-0 text-xs font-medium ${isOverdue ? "text-rose-600" : "text-ink-400"}`}>
          {formatDate(task.dueDate)}
        </span>
      )}
    </div>
  );
}
