// SQLite no soporta enums nativos en Prisma, así que estos campos se guardan
// como String y se tipan acá como uniones literales para el resto de la app.

export type ProjectType = "CLIENT" | "OWN";

export type SocialNetwork =
  | "INSTAGRAM"
  | "TIKTOK"
  | "FACEBOOK"
  | "X"
  | "YOUTUBE"
  | "LINKEDIN"
  | "OTHER";

export type ContentFormat = "REEL" | "CAROUSEL" | "POST" | "STORY";

export type ContentStatus =
  | "IDEA"
  | "DESIGN"
  | "COPY_READY"
  | "REVIEW"
  | "SCHEDULED"
  | "PUBLISHED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
