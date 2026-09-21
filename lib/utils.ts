import type {
  ContentFormat,
  ContentStatus,
  ProjectType,
  SocialNetwork,
  TaskPriority,
  TaskStatus,
} from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ---------- Labels (español, para UI) ----------

export const PROJECT_TYPE_LABEL = {
  CLIENT: "Cliente",
  OWN: "Propio",
} satisfies Record<ProjectType, string> as Record<string, string>;

export const SOCIAL_NETWORK_LABEL = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  FACEBOOK: "Facebook",
  X: "X",
  YOUTUBE: "YouTube",
  LINKEDIN: "LinkedIn",
  OTHER: "Otra",
} satisfies Record<SocialNetwork, string> as Record<string, string>;

export const CONTENT_FORMAT_LABEL = {
  REEL: "Reel",
  CAROUSEL: "Carrusel",
  POST: "Post",
  STORY: "Historia",
} satisfies Record<ContentFormat, string> as Record<string, string>;

export const CONTENT_STATUS_LABEL = {
  IDEA: "Idea",
  DESIGN: "En diseño",
  COPY_READY: "Copy listo",
  REVIEW: "En revisión",
  SCHEDULED: "Agendado",
  PUBLISHED: "Publicado",
} satisfies Record<ContentStatus, string> as Record<string, string>;

export const CONTENT_STATUS_COLOR = {
  IDEA: "bg-ink-100 text-ink-600",
  DESIGN: "bg-violet-100 text-violet-700",
  COPY_READY: "bg-amber-100 text-amber-700",
  REVIEW: "bg-orange-100 text-orange-700",
  SCHEDULED: "bg-sky-100 text-sky-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
} satisfies Record<ContentStatus, string> as Record<string, string>;

export const TASK_PRIORITY_LABEL = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
} satisfies Record<TaskPriority, string> as Record<string, string>;

export const TASK_PRIORITY_COLOR = {
  LOW: "bg-ink-100 text-ink-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-rose-100 text-rose-700",
} satisfies Record<TaskPriority, string> as Record<string, string>;

export const TASK_STATUS_LABEL = {
  TODO: "Por hacer",
  IN_PROGRESS: "En proceso",
  DONE: "Hecho",
} satisfies Record<TaskStatus, string> as Record<string, string>;

export const TASK_STATUS_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export function enumOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));
}

// ---------- Fechas ----------

const DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATE_FORMATTER_SHORT = new Intl.DateTimeFormat("es", {
  day: "2-digit",
  month: "short",
});

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return DATE_FORMATTER.format(new Date(date));
}

export function formatDateShort(date: Date | string | null | undefined) {
  if (!date) return "—";
  return DATE_FORMATTER_SHORT.format(new Date(date));
}

/** yyyy-MM-dd, apto para <input type="date"> */
export function toDateInputValue(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDaysUTC(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ---------- Tags ----------

export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function stringifyTags(tags: string[]): string {
  return tags.map((t) => t.trim()).filter(Boolean).join(",");
}
