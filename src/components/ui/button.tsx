import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button system.
 * - primary: gold fill — the single conversion action (Donate).
 * - outline: hairline on dark surfaces.
 * - ghost-dark: hairline on light surfaces.
 * - solid-dark: ink fill on light surfaces.
 * Hover: a fill wipes up from below (Forge-style), arrow nudges diagonally.
 */
export const buttonVariants = cva(
  [
    "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden",
    "rounded-pill font-sans text-sm font-medium tracking-wide whitespace-nowrap",
    "transition-colors duration-500 ease-out-expo",
    "before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-[inherit]",
    "before:transition-transform before:duration-500 before:ease-out-expo hover:before:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-gold-metal text-ink-950 shadow-[0_10px_30px_-12px_rgb(241_177_15/0.55)] before:bg-ivory-50",
        outline: "border border-ivory-100/35 text-ivory-50 before:bg-ivory-50 hover:text-ink-950",
        "ghost-dark": "border border-ink-950/25 text-ink-950 before:bg-ink-950 hover:text-ivory-50",
        "solid-dark": "bg-ink-950 text-ivory-50 before:bg-green-700",
      },
      size: {
        md: "h-12 px-6",
        lg: "h-14 px-8 text-[0.95rem]",
        sm: "h-10 px-5 text-[0.8rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden="true"
      className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> &
  Variants & {
    className?: string;
    children: ReactNode;
    arrow?: boolean;
    /** Drifts toward the cursor on hover (fine pointers, motion allowed). */
    magnetic?: boolean;
  };

export function ButtonLink({ variant, size, className, children, arrow = true, magnetic, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} data-magnetic={magnetic || undefined} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & Variants & { arrow?: boolean; magnetic?: boolean };

export function Button({ variant, size, className, children, arrow = false, magnetic, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} data-magnetic={magnetic || undefined} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
