"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVAL = 5000;
/** After a manual swipe / arrow press, give the visitor this long before resuming. */
const HOLD_AFTER_INTERACTION = 8000;

/** Called from event handlers only: record a manual interaction. */
function holdFor(ref: { current: number }) {
  ref.current = performance.now() + HOLD_AFTER_INTERACTION;
}

/**
 * Native scroll-snap rail that tours itself so no campaign goes unseen.
 * - Auto-advances only while on screen; loops back to the start.
 * - Pauses on hover / keyboard focus, holds after any manual interaction,
 *   and has a visible pause control (WCAG 2.2.2). Off by default for
 *   reduced-motion users.
 * - Progress segments show where you are and jump to a position.
 */
export function CampaignRail({ children, label }: { children: ReactNode; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const heldUntil = useRef(0);
  const [pos, setPos] = useState({ index: 0, pages: 1 });
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [playPref, setPlayPref] = useState<boolean | null>(null);
  const reduceMotion = useReducedMotion();
  const playing = playPref ?? !reduceMotion;
  const running = playing && inView && !hovering;

  const stepSize = useCallback(() => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el) return 1;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 24;
    return card ? card.offsetWidth + gap : el.clientWidth * 0.8;
  }, []);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const step = stepSize();
    const max = el.scrollWidth - el.clientWidth;
    const pages = Math.max(1, Math.ceil((max - 4) / step) + 1);
    const index = el.scrollLeft >= max - 4 ? pages - 1 : Math.round(el.scrollLeft / step);
    setPos((p) => (p.index === index && p.pages === pages ? p : { index, pages }));
  }, [stepSize]);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      el.scrollTo({ left: i * stepSize(), behavior: reduceMotion ? "auto" : "smooth" });
    },
    [stepSize, reduceMotion],
  );

  const hold = () => holdFor(heldUntil);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (root.current) io.observe(root.current);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io.disconnect();
    };
  }, [update]);

  // Advance one position per interval; the key on the progress bar restarts its fill.
  useEffect(() => {
    if (!running || pos.pages < 2) return;
    const t = window.setTimeout(() => {
      if (performance.now() < heldUntil.current) {
        setPos((p) => ({ ...p })); // re-arm the timer
        return;
      }
      goTo(pos.index >= pos.pages - 1 ? 0 : pos.index + 1);
    }, INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, pos, goTo]);

  const atStart = pos.index === 0;
  const atEnd = pos.index >= pos.pages - 1;

  return (
    <div
      ref={root}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div className="container-site mb-6 flex items-center justify-between gap-4 sm:gap-6">
        {/* Progress — one segment per scroll position */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <span className="eyebrow shrink-0 text-ink-500 tabular-nums" aria-hidden="true">
            {String(pos.index + 1).padStart(2, "0")} / {String(pos.pages).padStart(2, "0")}
          </span>
          <ol className="flex max-w-xs flex-1 gap-2" aria-label="Campaign positions">
            {Array.from({ length: pos.pages }, (_, i) => (
              <li key={i} className="flex-1">
                <button
                  type="button"
                  onClick={() => {
                    hold();
                    goTo(i);
                  }}
                  aria-label={`Show campaigns from position ${i + 1}`}
                  aria-current={i === pos.index ? "true" : undefined}
                  className="group block w-full py-3"
                >
                  <span className="relative block h-0.5 overflow-hidden rounded-pill bg-ink-950/15">
                    <span
                      key={`${i}-${pos.index}-${running}`}
                      className={cn(
                        "absolute inset-0 origin-left bg-green-700",
                        i < pos.index && "scale-x-100",
                        i > pos.index && "scale-x-0 group-hover:scale-x-25",
                        i === pos.index && (running ? "animate-[grow_linear_forwards]" : "scale-x-100"),
                      )}
                      style={i === pos.index && running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex shrink-0 gap-2">
          <RailButton label={playing ? "Pause campaign tour" : "Play campaign tour"} onClick={() => setPlayPref(!playing)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </RailButton>
          <RailButton
            label="Previous campaigns"
            className="hidden sm:grid"
            disabled={atStart}
            onClick={() => {
              hold();
              goTo(pos.index - 1);
            }}
          >
            <ArrowLeft className="size-4" />
          </RailButton>
          <RailButton
            label="Next campaigns"
            className="hidden sm:grid"
            disabled={atEnd}
            onClick={() => {
              hold();
              goTo(pos.index + 1);
            }}
          >
            <ArrowRight className="size-4" />
          </RailButton>
        </div>
      </div>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={hold}
        onWheel={(e) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && hold()}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto sm:gap-6 overscroll-x-contain pt-2 pb-14",
          "scroll-px-[var(--spacing-gutter)] px-[var(--spacing-gutter)]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "xl:px-[max(var(--spacing-gutter),calc((100vw-var(--container-site))/2+var(--spacing-gutter)))]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function RailButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid size-11 place-items-center rounded-full sm:size-12 border border-ink-950/20 text-ink-950 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-ivory-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-950/20 disabled:hover:bg-transparent disabled:hover:text-ink-950",
        className,
      )}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
