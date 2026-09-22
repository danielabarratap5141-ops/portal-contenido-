"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ContentFormat } from "@/lib/types";

function revalidateIdeas(projectId: string) {
  revalidatePath("/ideas");
  revalidatePath("/");
  revalidatePath(`/proyectos/${projectId}`);
}

function parseIdeaForm(formData: FormData) {
  const description = String(formData.get("description") || "").trim();
  const projectId = String(formData.get("projectId") || "");
  const suggestedFormatRaw = String(formData.get("suggestedFormat") || "");
  const tags = String(formData.get("tags") || "").trim() || null;

  if (!description) throw new Error("La descripción es obligatoria");
  if (!projectId) throw new Error("Elegí un proyecto");

  return {
    description,
    projectId,
    suggestedFormat: (suggestedFormatRaw || null) as ContentFormat | null,
    tags,
  };
}

export async function createIdea(formData: FormData) {
  const data = parseIdeaForm(formData);
  await prisma.idea.create({ data });
  revalidateIdeas(data.projectId);
}

export async function updateIdea(id: string, formData: FormData) {
  const data = parseIdeaForm(formData);
  const idea = await prisma.idea.update({ where: { id }, data });
  revalidateIdeas(idea.projectId);
}

export async function deleteIdea(id: string) {
  const idea = await prisma.idea.delete({ where: { id } });
  revalidateIdeas(idea.projectId);
}

/**
 * Crea un ContentItem a partir de una idea (prellenado) y elimina la idea
 * del banco, ya que pasó a ser contenido programado.
 */
export async function convertIdeaToContent(ideaId: string, formData: FormData) {
  const idea = await prisma.idea.findUniqueOrThrow({ where: { id: ideaId } });

  const title = String(formData.get("title") || "").trim() || idea.description.slice(0, 80);
  const publishDateRaw = String(formData.get("publishDate") || "");
  if (!publishDateRaw) throw new Error("La fecha de publicación es obligatoria");

  const network = String(formData.get("network") || "INSTAGRAM") as any;
  const format = (String(formData.get("format") || idea.suggestedFormat || "POST")) as any;

  await prisma.$transaction([
    prisma.contentItem.create({
      data: {
        projectId: idea.projectId,
        title,
        publishDate: new Date(`${publishDateRaw}T12:00:00`),
        network,
        format,
        status: "IDEA",
        copyText: idea.description,
      },
    }),
    prisma.idea.delete({ where: { id: ideaId } }),
  ]);

  revalidateIdeas(idea.projectId);
  revalidatePath("/contenido");
  revalidatePath("/calendario");
}
