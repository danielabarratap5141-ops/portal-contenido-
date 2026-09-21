import type { ContentItem, Project } from "@prisma/client";
import { Badge, ColorDot } from "@/components/ui/Badge";
import {
  CONTENT_FORMAT_LABEL,
  CONTENT_STATUS_COLOR,
  CONTENT_STATUS_LABEL,
  SOCIAL_NETWORK_LABEL,
  formatDate,
} from "@/lib/utils";

export type ContentItemWithProject = ContentItem & {
  project: Pick<Project, "id" | "name" | "color">;
};

export function ContentCard({
  item,
  onClick,
  showDate = true,
}: {
  item: ContentItemWithProject;
  onClick?: () => void;
  showDate?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-ink-100 bg-white p-3 text-left shadow-soft transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <ColorDot color={item.project.color} />
        <span className="truncate">{item.project.name}</span>
        {showDate && <span className="ml-auto shrink-0">{formatDate(item.publishDate)}</span>}
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm font-medium text-ink-900">{item.title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge className="bg-ink-100 text-ink-600">
          {SOCIAL_NETWORK_LABEL[item.network]}
        </Badge>
        <Badge className="bg-ink-100 text-ink-600">{CONTENT_FORMAT_LABEL[item.format]}</Badge>
        <Badge className={CONTENT_STATUS_COLOR[item.status]}>
          {CONTENT_STATUS_LABEL[item.status]}
        </Badge>
      </div>
    </button>
  );
}
