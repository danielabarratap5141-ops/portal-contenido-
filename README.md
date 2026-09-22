# Portal de contenido

Aplicación privada de uso personal para organizar contenido, pendientes e ideas
de tus proyectos (clientes de agencia y proyectos propios). Corre 100% local,
sin login, sin servicios externos ni API keys.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + SQLite.

## Instalación (primera vez)

Necesitás [Node.js](https://nodejs.org) 18 o superior instalado.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos local (SQLite) y aplicar el esquema
npx prisma migrate dev

# (Esto ya carga automáticamente unos datos de ejemplo la primera vez.
#  Si querés cargarlos de nuevo manualmente: npm run seed)
```

## Arrancar la app

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador. Dejá esa
terminal abierta mientras la usás; para cortar, `Ctrl + C`.

## Respaldo de la base de datos

Toda tu información vive en un solo archivo: `prisma/dev.db`.

**Opción rápida (recomendada):**

```bash
npm run backup
```

Esto copia `prisma/dev.db` a `backups/dev-<fecha>.db`. Podés correrlo cuando
quieras (por ejemplo, antes de una actualización grande) y guardar esa carpeta
`backups/` en un disco externo, Google Drive, Dropbox, etc.

**Opción manual:** simplemente copiá el archivo `prisma/dev.db` a donde
quieras guardarlo. Para restaurar un respaldo, cerrá la app (`Ctrl + C`) y
reemplazá `prisma/dev.db` por el archivo de respaldo.

## Producción local (opcional)

Si preferís correrla "compilada" en vez de en modo desarrollo:

```bash
npm run build
npm run start
```

## Estructura del proyecto

```
app/                 páginas (App Router) y server actions (app/actions)
components/          componentes reutilizables (ui, projects, content, tasks, ideas, calendar, layout)
lib/                 cliente de Prisma, helpers y tipos compartidos
prisma/schema.prisma esquema de la base de datos
prisma/seed.ts        datos de ejemplo iniciales
scripts/backup-db.mjs script de respaldo
```

## Modelo de datos

- **Proyectos**: clientes de agencia o proyectos propios, con color identificador.
- **Contenido**: piezas vinculadas a un proyecto (título, fecha, red social, formato, estado, copy, notas de diseño, link publicado).
- **Pendientes**: tareas con prioridad y estado, opcionalmente vinculadas a un proyecto.
- **Ideas**: banco de ideas sueltas por proyecto, convertibles en contenido programado con un clic.
