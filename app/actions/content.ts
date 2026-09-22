"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ContentFormat, ContentStatus, SocialNetwork } from "@/lib/types";

function revalidateContent(projectId: string) {
  revalidatePath("/contenido");
  revalidatePath("/calendario");
  revalidatePath("/");
  revalidatePath(`/proyectos/${projectId}`);
}

function parseContentForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const projectId = String(formData.get("projectId") || "");
  const publishDateRaw = String(formData.get("publishDate") || "");
  const network = (formData.get("network") as SocialNetwork) || "INSTAGRAM";
  const format = (formData.get("format") as ContentFormat) || "POST";
  const status = (formData.get("status") as ContentStatus) || "IDEA";
  const copyText = String(formData.get("copyText") || "").trim() || null;
  const designNotes = String(formData.get("designNotes") || "").trim() || null;
  const publishedUrl = String(formData.get("publishedUrl") || "").trim() || null;

  if (!title) throw new Error("El título es obligatorio");
  if (!projectId) throw new Error("Elegí un proyecto");
  if (!publishDateRaw) throw new Error("La fecha de publicación es obligatoria");

  return {
    title,
    projectId,
    publishDate: new Date(`${publishDateRaw}T12:00:00`),
    network,
    format,
    status,
    copyText,
    designNotes,
    publishedUrl,
  };
}

export async function createContentItem(formData: FormData) {
  const data = parseContentForm(formData);
  await prisma.contentItem.create({ data });
  revalidateContent(data.projectId);
}

export async function updateContentItem(id: string, formData: FormData) {
  const data = parseContentForm(formData);
  const item = await prisma.contentItem.update({ where: { id }, data });
  revalidateContent(item.projectId);
}

export async function updateContentStatus(id: string, status: ContentStatus) {
  const item = await prisma.contentItem.update({ where: { id }, data: { status } });
  revalidateContent(item.projectId);
}

export async function deleteContentItem(id: string) {
  const item = await prisma.contentItem.delete({ where: { id } });
  revalidateContent(item.projectId);
}
