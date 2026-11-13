import { CalendarClock, CheckCircle2 } from "lucide-react";
import type { Cause } from "@/types/content";
import { cn } from "@/lib/utils";

/** Reported / upcoming work under a programme. */
export function ProgrammeHighlights({ cause, tone = "light" }: { cause: Cause; tone?: "light" | "dark" }) {
  if (!cause.highlights?.length) return null;
  return (
    <ul className="space-y-3">
      {cause.highlights.map((h) => {
        const Icon = h.kind === "reported" ? CheckCircle2 : CalendarClock;
        return (
          <li key={h.text} className="flex gap-3">
            <Icon
              aria-hidden="true"
              className={cn("mt-0.5 size-5 shrink-0", h.kind === "reported" ? "text-green-600" : "text-gold-600")}
            />
            <span className={cn("leading-relaxed", tone === "dark" ? "text-ivory-100/85" : "text-ink-700")}>
              <span className="sr-only">{h.kind === "reported" ? "Reported: " : "Upcoming: "}</span>
              {h.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
