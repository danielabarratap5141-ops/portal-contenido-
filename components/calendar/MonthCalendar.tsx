"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import type { Project } from "@prisma/client";
import { ColorDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Plus } from "@/components/ui/Icon";
import { ContentFormModal } from "@/components/content/ContentFormModal";
import type { ContentItemWithProject } from "@/components/content/ContentCard";
import { cn, isSameDay, toDateInputValue } from "@/lib/utils";

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function MonthCalendar({
  items,
  projects,
  fixedProjectId,
}: {
  items: ContentItemWithProject[];
  projects: Pick<Project, "id" | "name">[];
  fixedProjectId?: string;
}) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItemWithProject | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, ContentItemWithProject[]>();
    for (const item of items) {
      const key = toDateInputValue(item.publishDate);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize text-ink-900">
          {format(cursor, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="secondary" size="sm" onClick={() => setCursor(subMonths(cursor, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCursor(new Date())}>
            Hoy
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-card">
        <div className="grid grid-cols-7 border-b border-ink-100 bg-ink-50/60">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wide text-ink-400"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = toDateInputValue(day);
            const dayItems = itemsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, cursor);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(key)}
                className={cn(
                  "group flex min-h-[110px] flex-col items-stretch gap-1 border-b border-r border-ink-50 p-1.5 text-left align-top last:border-r-0",
                  !inMonth && "bg-ink-50/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday(day) ? "bg-ink-900 text-white" : "text-ink-500",
                      !inMonth && "text-ink-300"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <Plus className="h-3.5 w-3.5 text-ink-200 opacity-0 group-hover:opacity-100" />
                </div>
                <div className="flex flex-col gap-1">
                  {dayItems.slice(0, 3).map((item) => (
                    <span
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
                      className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[11px] font-medium text-ink-700 hover:bg-ink-100"
                      style={{ backgroundColor: `${item.project.color}17` }}
                    >
                      <ColorDot color={item.project.color} className="h-1.5 w-1.5" />
                      <span className="truncate">{item.title}</span>
                    </span>
                  ))}
                  {dayItems.length > 3 && (
                    <span className="px-1 text-[11px] text-ink-300">
                      +{dayItems.length - 3} más
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <ContentFormModal
        open={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        projects={projects}
        defaultProjectId={fixedProjectId}
        defaultDate={selectedDate ?? undefined}
      />
      {editingItem && (
        <ContentFormModal
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          projects={projects}
          item={editingItem}
        />
      )}
    </div>
  );
}
