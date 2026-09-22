"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Project } from "@prisma/client";
import type { TaskStatus } from "@/lib/types";
import { updateTaskStatus } from "@/app/actions/tasks";
import { TaskCard, type TaskWithProject } from "@/components/tasks/TaskCard";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { Plus } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { TASK_STATUS_LABEL, TASK_STATUS_ORDER, cn } from "@/lib/utils";

function KanbanColumn({
  status,
  tasks,
  onCardClick,
}: {
  status: TaskStatus;
  tasks: TaskWithProject[];
  onCardClick: (task: TaskWithProject) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[300px] flex-1 flex-col rounded-xl2 border border-ink-100 bg-ink-50/50 p-3 transition-colors",
        isOver && "border-ink-300 bg-ink-100/60"
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-ink-700">{TASK_STATUS_LABEL[status]}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink-400 shadow-soft">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
        ))}
        {tasks.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-ink-300">Sin tareas</p>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks: initialTasks,
  projects,
  fixedProjectId,
}: {
  tasks: TaskWithProject[];
  projects: Pick<Project, "id" | "name">[];
  fixedProjectId?: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [projectFilter, setProjectFilter] = useState("");
  const [activeTask, setActiveTask] = useState<TaskWithProject | null>(null);
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null);
  const [creatingStatus, setCreatingStatus] = useState<TaskStatus | null>(null);

  useEffect(() => setTasks(initialTasks), [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const visibleTasks = projectFilter
    ? tasks.filter((t) => t.projectId === projectFilter)
    : tasks;

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    updateTaskStatus(taskId, newStatus).catch(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {!fixedProjectId && (
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
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
        <Button size="sm" className="ml-auto" onClick={() => setCreatingStatus("TODO")}>
          <Plus className="h-4 w-4" /> Nuevo pendiente
        </Button>
      </div>

      {visibleTasks.length === 0 ? (
        <EmptyState title="No hay pendientes" description="Creá uno nuevo para empezar." />
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-3">
            {TASK_STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={visibleTasks.filter((t) => t.status === status)}
                onCardClick={setEditingTask}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      )}

      <TaskFormModal
        open={creatingStatus !== null}
        onClose={() => setCreatingStatus(null)}
        projects={projects}
        defaultProjectId={fixedProjectId}
        defaultStatus={creatingStatus ?? undefined}
      />
      {editingTask && (
        <TaskFormModal
          open={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          projects={projects}
          task={editingTask}
        />
      )}
    </div>
  );
}
