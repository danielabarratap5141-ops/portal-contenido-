"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { TaskPriority, TaskStatus } from "@/lib/types";

function revalidateTasks(projectId?: string | null) {
  revalidatePath("/pendientes");
  revalidatePath("/");
  if (projectId) revalidatePath(`/proyectos/${projectId}`);
}

function parseTaskForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("El título es obligatorio");

  const projectIdRaw = String(formData.get("projectId") || "");
  const projectId = projectIdRaw ? projectIdRaw : null;
  const dueDateRaw = String(formData.get("dueDate") || "");
  const priority = (formData.get("priority") as TaskPriority) || "MEDIUM";
  const status = (formData.get("status") as TaskStatus) || "TODO";
  const notes = String(formData.get("notes") || "").trim() || null;

  return {
    title,
    projectId,
    dueDate: dueDateRaw ? new Date(`${dueDateRaw}T12:00:00`) : null,
    priority,
    status,
    notes,
  };
}

export async function createTask(formData: FormData) {
  const data = parseTaskForm(formData);
  await prisma.task.create({ data });
  revalidateTasks(data.projectId);
}

export async function updateTask(id: string, formData: FormData) {
  const data = parseTaskForm(formData);
  const task = await prisma.task.update({ where: { id }, data });
  revalidateTasks(task.projectId);
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const task = await prisma.task.update({ where: { id }, data: { status } });
  revalidateTasks(task.projectId);
}

export async function deleteTask(id: string) {
  const task = await prisma.task.delete({ where: { id } });
  revalidateTasks(task.projectId);
}
