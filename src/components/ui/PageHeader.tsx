import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function PageHeader({ title, eyebrow, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 pb-3 pt-2">
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-normal text-pine">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-black tracking-normal text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}
