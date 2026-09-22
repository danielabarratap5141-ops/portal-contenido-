"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "@/components/ui/Icon";

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const widthClass = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[width];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 p-4 pt-[8vh] backdrop-blur-[2px]">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-full ${widthClass} rounded-xl2 border border-ink-100 bg-white shadow-card`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
