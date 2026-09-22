"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Folder,
  Home,
  Kanban,
  Lightbulb,
  Table,
} from "@/components/ui/Icon";
import { ColorDot } from "@/components/ui/Badge";

type SidebarProject = {
  id: string;
  name: string;
  color: string;
  active: boolean;
};

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/contenido", label: "Contenido", icon: Table },
  { href: "/pendientes", label: "Pendientes", icon: Kanban },
  { href: "/ideas", label: "Banco de ideas", icon: Lightbulb },
];

export function Sidebar({ projects }: { projects: SidebarProject[] }) {
  const pathname = usePathname();
  const activeProjects = projects.filter((p) => p.active);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="px-5 py-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-ink-900">
          Portal de contenido
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-5">
          <div className="flex items-center justify-between px-3 pb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
              Proyectos
            </span>
            <Link
              href="/proyectos/nuevo"
              className="text-ink-300 hover:text-ink-600"
              title="Nuevo proyecto"
            >
              +
            </Link>
          </div>
          <Link
            href="/proyectos"
            className={cn(
              "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-ink-500 hover:bg-ink-100",
              pathname === "/proyectos" && "bg-ink-100 text-ink-900"
            )}
          >
            <Folder className="h-4 w-4 shrink-0" />
            Ver todos
          </Link>
          {activeProjects.map((project) => {
            const href = `/proyectos/${project.id}`;
            const isActive = pathname === href;
            return (
              <Link
                key={project.id}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-100",
                  isActive && "bg-ink-100 font-medium text-ink-900"
                )}
              >
                <ColorDot color={project.color} />
                <span className="truncate">{project.name}</span>
              </Link>
            );
          })}
          {activeProjects.length === 0 && (
            <p className="px-3 py-1.5 text-xs text-ink-300">Sin proyectos activos</p>
          )}
        </div>
      </nav>
    </aside>
  );
}
