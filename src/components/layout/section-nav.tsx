"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/components/layout/smooth-scroll";

type Item = { label: string; el: HTMLElement };

/**
 * Fixed side rail of section markers (2xl screens, where the gutter is clear of content). Shows where you are on the
 * page and glides to a section on click. Built from the [data-snap] wrappers
 * at runtime, so it always matches the page.
 */
export function SectionNav() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
    // Subscribing to the DOM: the list only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(els.map((el) => ({ label: el.dataset.snap ?? "", el })));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label="Page sections"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 mix-blend-difference 2xl:block"
    >
      <ol className="flex flex-col items-end gap-1">
        {items.map((item, i) => {
          const current = i === active;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => scrollToElement(item.el)}
                aria-current={current ? "true" : undefined}
                className="group flex items-center gap-3 py-1.5 text-white"
              >
                <span
                  className={cn(
                    "text-[0.65rem] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out-expo",
                    // Labels appear on hover/focus only, so they never sit over content.
                    "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-90 group-focus-visible:translate-x-0 group-focus-visible:opacity-90",
                  )}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px bg-current transition-all duration-500 ease-out-expo",
                    current ? "w-10 opacity-100" : "w-4 opacity-50 group-hover:w-6 group-hover:opacity-90",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
