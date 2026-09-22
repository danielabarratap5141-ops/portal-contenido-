import { cn } from "@/lib/utils";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const FIELD_CLASSES =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-900/5";

export function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-ink-500">
      {children}
      {required && <span className="text-rose-500"> *</span>}
    </label>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_CLASSES, className)} {...props} />;
}

export function Textarea({
  className,
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(FIELD_CLASSES, "resize-y", className)} rows={rows} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(FIELD_CLASSES, "cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}

export function FormRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4 grid grid-cols-2 gap-3", className)}>{children}</div>;
}
