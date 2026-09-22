import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(paths: React.ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {paths}
      </svg>
    );
  };
}

export const X = base(<path d="M18 6 6 18M6 6l12 12" />);

export const Plus = base(<path d="M12 5v14M5 12h14" />);

export const Home = base(
  <>
    <path d="m3 9 9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <path d="M9 21V12h6v9" />
  </>
);

export const Calendar = base(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>
);

export const Table = base(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 10h18M9 4v16" />
  </>
);

export const Kanban = base(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16M15 4v9" />
  </>
);

export const Lightbulb = base(
  <>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.2V16h6v-.3c0-.8.4-1.6 1-2.2A6 6 0 0 0 12 3Z" />
  </>
);

export const Folder = base(
  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
);

export const ChevronLeft = base(<path d="m15 18-6-6 6-6" />);
export const ChevronRight = base(<path d="m9 18 6-6-6-6" />);

export const Search = base(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const Trash = base(
  <>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
  </>
);

export const Pencil = base(
  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
);

export const ArrowRight = base(<path d="M5 12h14M13 6l6 6-6 6" />);

export const ExternalLink = base(
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </>
);

export const Check = base(<path d="M20 6 9 17l-5-5" />);

export const ListTodo = base(
  <>
    <path d="M11 5h10M11 12h10M11 19h10" />
    <path d="m3 5 1.5 1.5L7 4" />
    <rect x="3" y="10.5" width="4" height="4" rx="0.5" />
  </>
);

export const Sparkles = base(
  <path d="M12 3v4M12 17v4M5 12H3M21 12h-2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
);
