"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { mainNav, secondaryNav, site } from "@/content/site";
import { routes, type RouteEntry } from "@/content/routes";
import { images } from "@/content/images";
import type { ImageAsset } from "@/types/content";
import { Photo } from "@/components/ui/photo";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { setScrollLocked } from "./smooth-scroll";

const ease = [0.16, 1, 0.3, 1] as const;

/** Thumbnail shown beside the cursor when hovering a nav link (the page’s own header image). */
const routeImages = new Map((Object.values(routes) as RouteEntry[]).map((r) => [r.path, r.image]));
const previewFor = (href: string): ImageAsset => routeImages.get(href) ?? images.heroSmile;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Cursor-following nav preview (fine pointers with motion allowed only).
  const [preview, setPreview] = useState<ImageAsset | null>(null);
  const canPreview = useRef(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 260, damping: 28, mass: 0.6 });
  useEffect(() => {
    canPreview.current = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    // Hide on scroll down, reveal on scroll up — never while the menu is open.
    setHidden(!open && y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  const close = useCallback(() => setOpen(false), []);
  /** Light bar once the page has scrolled off the hero photo (and the menu is closed). */
  const light = scrolled && !open;

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-pill bg-gold-500 px-5 py-3 text-sm font-medium text-ink-950 focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        data-surface={light ? "light" : "dark"}
        initial={false}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
          light
            ? "border-b border-ink-950/10 bg-ivory-50/85 shadow-[0_10px_30px_-20px_rgb(11_10_8/0.25)] backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        {/* Shrinks once the page scrolls; the bar also turns frosted (backdrop blur) above. */}
        <div
          className={cn(
            "container-site flex items-center justify-between gap-3 transition-[height] duration-500 ease-out-expo sm:gap-6",
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[4.5rem] lg:h-20",
          )}
        >
          {/* The wordmark can't wrap, so it must never be squeezed: below 2xl it
              only shares the row with the Donate + Menu buttons, which always fit. */}
          <Link href="/" aria-label={`${site.name} — home`} className="relative z-10 min-w-0 shrink 2xl:shrink-0">
            <Logo
              priority
              tone={light ? "dark" : "light"}
              className={cn("origin-left transition-transform duration-500 ease-out-expo", scrolled && "scale-90")}
            />
          </Link>

          {/* Inline nav needs ~1,400px with the logo and buttons; narrower screens use the Menu. */}
          <nav aria-label="Primary" className="hidden 2xl:block">
            <ul
              className="flex items-center gap-7"
              onPointerMove={(e) => {
                px.set(e.clientX);
                py.set(e.clientY);
              }}
              onPointerLeave={() => setPreview(null)}
            >
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onPointerEnter={(e) => {
                        if (!canPreview.current) return;
                        // Start the spring at the cursor so the card doesn't fly in from the corner.
                        if (!preview) {
                          px.jump(e.clientX);
                          py.jump(e.clientY);
                          sx.jump(e.clientX);
                          sy.jump(e.clientY);
                        }
                        setPreview(previewFor(item.href));
                      }}
                      className={cn(
                        "group relative py-2 text-[0.8rem] font-medium tracking-[0.14em] uppercase transition-colors",
                        light
                          ? active
                            ? "text-green-700"
                            : "text-ink-700 hover:text-green-700"
                          : active
                            ? "text-gold-300"
                            : "text-ivory-50/85 hover:text-ivory-50",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-out-expo",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ButtonLink href="/donate" size="sm" magnetic className="gap-2 px-4 sm:gap-3 sm:px-5 [&>svg]:hidden sm:[&>svg]:block">
              Donate<span className="hidden sm:inline"> now</span>
            </ButtonLink>
            <MenuButton open={open} light={light} onToggle={() => setOpen((o) => !o)} />
          </div>
        </div>
      </motion.header>

      {/* Nav hover preview — decorative, outside the (transformed) header so fixed positioning is viewport-relative. */}
      <motion.div
        aria-hidden="true"
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[60] hidden 2xl:block"
      >
        <AnimatePresence>
          {preview && (
            <motion.div
              key={preview.src}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease }}
              className="absolute top-7 left-5 aspect-[4/3] w-56 overflow-hidden rounded-photo-sm bg-ink-900 shadow-lift"
            >
              <Photo image={preview} alt="" fill sizes="224px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{open && <MenuOverlay onClose={close} pathname={pathname} />}</AnimatePresence>
    </>
  );
}

function MenuButton({ open, light, onToggle }: { open: boolean; light: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="site-menu"
      className={cn(
        "group flex h-10 items-center gap-3 rounded-pill sm:pr-1 sm:pl-3 text-[0.8rem] font-medium tracking-[0.14em] uppercase transition-colors",
        light ? "text-ink-950" : "text-ivory-50",
      )}
    >
      <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
      <span className="sr-only sm:hidden">{open ? "Close menu" : "Open menu"}</span>
      <span
        aria-hidden="true"
        className={cn(
          "relative grid size-10 place-items-center rounded-full border transition-colors",
          light ? "border-ink-950/25 group-hover:border-green-700" : "border-ivory-100/40 group-hover:border-gold-400",
        )}
      >
        <span
          className={cn(
            "absolute h-px w-4 bg-current transition-transform duration-500 ease-out-expo",
            open ? "rotate-45" : "-translate-y-[3px]",
          )}
        />
        <span
          className={cn(
            "absolute h-px w-4 bg-current transition-transform duration-500 ease-out-expo",
            open ? "-rotate-45" : "translate-y-[3px]",
          )}
        />
      </span>
    </button>
  );
}

function MenuOverlay({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    node?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !node) return;
      // Simple focus trap.
      const focusables = node.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const links = [...mainNav, { label: "Donate", href: "/donate", description: "Ways to support our work" }];

  return (
    <motion.div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      data-surface="dark"
      className="fixed inset-0 z-40 overflow-y-auto bg-green-950 bg-green-deep pt-24 pb-10"
    >
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <nav aria-label="Menu" className="lg:col-span-8">
          <ol className="divide-y divide-ivory-100/10 border-y border-ivory-100/10">
            {links.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="group flex items-baseline gap-5 py-3 sm:py-4"
                  >
                    <span className="eyebrow w-8 text-ink-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-[2.6rem] leading-none text-ivory-50 transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-gold-400 sm:text-6xl">
                      {item.label}
                    </span>
                    <span className="ml-auto hidden text-sm text-ink-300 md:block">{item.description}</span>
                  </Link>
                </motion.div>
              </li>
            ))}
          </ol>
        </nav>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.55 }}
          className="flex flex-col gap-10 lg:col-span-4 lg:pt-4"
        >
          <ul className="space-y-3">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose} className="text-lg text-ivory-100 hover:text-gold-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-1 text-sm text-ink-300">
            <p className="eyebrow mb-3 text-ink-400">Contact</p>
            <p>
              <a href={`mailto:${site.contact.email}`} className="[overflow-wrap:anywhere] hover:text-gold-400">
                {site.contact.email}
              </a>
            </p>
            <p>{site.contact.address}</p>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
