import type Lenis from "lenis";

/**
 * Section-to-section paging for wheel / trackpad input.
 *
 * Two kinds of targets:
 *  1. Section boundaries — the top of every [data-snap] wrapper (plus the
 *     footer, [data-snap-end]). Inside a section you scroll freely; once a
 *     boundary is visible, the next wheel gesture glides across it:
 *       ↓ bring the next section's top to the viewport top
 *       ↑ reveal the end of the previous section
 *  2. Guided stops — `data-snap-stops="1.3"` or `"0.9,1.8,2.7"` on an element
 *     inside a pinned/sticky scene, in viewport heights from that element's
 *     top. Each wheel gesture plays the scene to its next stop, so multi-step
 *     content (collage burst, donation steps) is never skipped past.
 * Keyboard, touch and scrollbar input are never intercepted.
 */

const DURATION = 1.15;
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
/** Swallow trackpad momentum that arrives after a jump. */
const QUIET_MS = 180;
const MAX_QUIET_MS = 900;
const EPS = 2;
/** Guided stops further than this (in viewport heights) are left to free scrolling. */
const MAX_STOP_DISTANCE = 1.6;

const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

function boundaries(): number[] {
  const els = document.querySelectorAll<HTMLElement>("[data-snap], [data-snap-end]");
  return Array.from(els, (el) => Math.round(docTop(el))).sort((a, b) => a - b);
}

function stops(h: number): number[] {
  const out: number[] = [];
  document.querySelectorAll<HTMLElement>("[data-snap-stops]").forEach((el) => {
    if (!el.getClientRects().length) return; // hidden at this breakpoint
    const top = docTop(el);
    for (const v of (el.dataset.snapStops ?? "").split(",")) {
      const n = Number(v);
      if (Number.isFinite(n)) out.push(Math.round(top + n * h));
    }
  });
  return out.sort((a, b) => a - b);
}

/** Where a wheel gesture in `dir` should glide to from `t`, or null for free scrolling. */
export function snapTarget(dir: 1 | -1, t: number, h: number, limit: number): number | null {
  const marks = boundaries();
  const candidates: number[] = [];

  if (dir > 0) {
    const b = marks.find((m) => m > t + EPS && m <= t + h + EPS);
    if (b !== undefined) candidates.push(Math.min(b, limit));
    const s = stops(h).find((m) => m > t + EPS && m - t <= h * MAX_STOP_DISTANCE);
    if (s !== undefined) candidates.push(Math.min(s, limit));
    return candidates.length ? Math.min(...candidates) : null;
  }

  const visible = marks.filter((m) => m >= t - EPS && m < t + h - EPS);
  const b = visible[visible.length - 1];
  if (b !== undefined && b > 0) {
    const prevStart = [...marks].reverse().find((m) => m < b) ?? 0;
    candidates.push(Math.max(prevStart, b - h, 0));
  }
  const s = [...stops(h)].reverse().find((m) => m < t - EPS && t - m <= h * MAX_STOP_DISTANCE);
  if (s !== undefined) candidates.push(s);
  return candidates.length ? Math.max(...candidates) : null;
}

export function attachSectionSnap(lenis: Lenis) {
  /** Timestamp guard (not a boolean) so an interrupted jump can never leave the wheel locked. */
  let animatingUntil = 0;
  let quietUntil = 0;
  let quietCap = 0;

  const swallow = (event: Event) => {
    if (event.cancelable) event.preventDefault();
    return false;
  };

  lenis.options.virtualScroll = ({ deltaX, deltaY, event }) => {
    if (event.type !== "wheel" || (event as WheelEvent).ctrlKey) return true;
    if (!document.querySelector("[data-snap]")) return true;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return true; // horizontal rails

    const now = performance.now();
    if (now < animatingUntil) return swallow(event);
    if (now < quietUntil) {
      quietUntil = Math.min(now + QUIET_MS, quietCap);
      return swallow(event);
    }
    if (Math.abs(deltaY) < 1) return true;

    const t = lenis.targetScroll;
    const target = snapTarget(deltaY > 0 ? 1 : -1, t, window.innerHeight, lenis.limit);
    if (target === null || Math.abs(target - t) < EPS) return true;

    animatingUntil = now + DURATION * 1000 + 250;
    lenis.scrollTo(target, {
      duration: DURATION,
      easing: easeInOutQuart,
      lock: true,
      force: true,
      onComplete: () => {
        animatingUntil = 0;
        const end = performance.now();
        quietUntil = end + QUIET_MS;
        quietCap = end + MAX_QUIET_MS;
      },
    });
    return swallow(event);
  };

  return () => {
    lenis.options.virtualScroll = undefined;
  };
}
