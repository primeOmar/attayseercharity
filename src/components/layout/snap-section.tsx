import type { ReactNode } from "react";

/**
 * Marks a page section as a scroll "stop" for section paging, the section
 * transitions and the side section navigation. The veil is what softly fades the
 * section as the next one slides in — it stays invisible without JS.
 */
export function SnapSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-snap={label} className="relative isolate">
      {children}
      <div data-snap-veil aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 bg-ivory-50 opacity-0" />
    </div>
  );
}
