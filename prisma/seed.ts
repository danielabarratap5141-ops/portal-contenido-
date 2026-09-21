import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(12, 0, 0, 0);
  return d;
}

async function main() {
  const existing = await prisma.project.count();
  if (existing > 0) {
    console.log("Ya hay datos, se omite el seed.");
    return;
  }

  const hotel = await prisma.project.create({
    data: {
      name: "Hotel Las Palmas",
      type: "CLIENT",
      color: "#0ea5e9",
      notes: "Cliente de agencia. Entregas los viernes.",
      active: true,
    },
  });

  const gastro = await prisma.project.create({
    data: {
      name: "Sabores de Autor",
      type: "OWN",
      color: "#f97316",
      notes: "Marca editorial propia de gastronomía en Instagram.",
      active: true,
    },
  });

  await prisma.contentItem.createMany({
    data: [
      {
        projectId: hotel.id,
        title: "Reel: amanecer en la terraza",
        publishDate: daysFromNow(2),
        network: "INSTAGRAM",
        format: "REEL",
        status: "SCHEDULED",
        copyText: "Despierta con la mejor vista de la ciudad ☀️",
      },
      {
        projectId: hotel.id,
        title: "Carrusel: nueva carta de brunch",
        publishDate: daysFromNow(6),
        network: "INSTAGRAM",
        format: "CAROUSEL",
        status: "DESIGN",
      },
      {
        projectId: gastro.id,
        title: "Post: receta de tarta de higos",
        publishDate: daysFromNow(1),
        network: "INSTAGRAM",
        format: "POST",
        status: "COPY_READY",
        copyText: "La receta que todos me piden, por fin en el feed 🍇",
      },
      {
        projectId: gastro.id,
        title: "Historia: detrás de cámaras del shooting",
        publishDate: daysFromNow(-1),
        network: "INSTAGRAM",
        format: "STORY",
        status: "PUBLISHED",
        publishedUrl: "https://instagram.com/",
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: hotel.id,
        title: "Enviar propuesta de contenidos de octubre",
        dueDate: daysFromNow(3),
        priority: "HIGH",
        status: "TODO",
      },
      {
        projectId: gastro.id,
        title: "Editar fotos del shooting de higos",
        dueDate: daysFromNow(0),
        priority: "MEDIUM",
        status: "IN_PROGRESS",
      },
      {
        projectId: null,
        title: "Renovar plan de edición de video",
        dueDate: daysFromNow(10),
        priority: "LOW",
        status: "TODO",
      },
    ],
  });

  await prisma.idea.createMany({
    data: [
      {
        projectId: hotel.id,
        description: "Serie de reels mostrando cada tipo de habitación",
        suggestedFormat: "REEL",
        tags: "evergreen,serie",
      },
      {
        projectId: gastro.id,
        description: "Carrusel con errores comunes al hacer pan casero",
        suggestedFormat: "CAROUSEL",
        tags: "educativo,evergreen",
      },
      {
        projectId: gastro.id,
        description: "Promo de fin de temporada de tomates",
        suggestedFormat: "POST",
        tags: "temporada,promoción",
      },
    ],
  });

  console.log("Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
