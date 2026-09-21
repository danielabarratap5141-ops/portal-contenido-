"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProjectType } from "@/lib/types";

function parseProjectForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("El nombre es obligatorio");

  const type = (formData.get("type") as ProjectType) || "OWN";
  const color = String(formData.get("color") || "#6366f1");
  const notes = String(formData.get("notes") || "").trim() || null;
  const active = formData.get("active") !== "off";

  return { name, type, color, notes, active };
}

export async function createProject(formData: FormData) {
  const data = parseProjectForm(formData);
  const project = await prisma.project.create({ data });

  revalidatePath("/proyectos");
  revalidatePath("/");
  redirect(`/proyectos/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const data = parseProjectForm(formData);
  await prisma.project.update({ where: { id }, data });

  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${id}`);
  revalidatePath("/");
  revalidatePath("/calendario");
  revalidatePath("/contenido");
  revalidatePath("/pendientes");
  revalidatePath("/ideas");
}

export async function toggleProjectActive(id: string, active: boolean) {
  await prisma.project.update({ where: { id }, data: { active } });
  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/proyectos");
  revalidatePath("/");
  redirect("/proyectos");
}
