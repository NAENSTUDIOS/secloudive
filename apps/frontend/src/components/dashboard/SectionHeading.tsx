import type { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-5 flex items-end justify-between gap-4">
    <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 className="text-xl font-semibold text-white">{title}</h2></div>
    {action}
  </div>;
}
