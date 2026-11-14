import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Email / phone / office cards. */
export function ContactCards({ subject, className }: { subject?: string; className?: string }) {
  const mailto = `mailto:${site.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  const items = [
    { icon: Mail, label: "Email", value: site.contact.email, href: mailto },
    { icon: Phone, label: "Telephone", value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
    {
      icon: MapPin,
      label: "Office",
      value: site.contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.address)}`,
    },
  ];

  return (
    <ul className={cn("grid gap-5 md:grid-cols-3", className)}>
      {items.map(({ icon: Icon, label, value, href }, i) => (
        <li key={label} data-reveal data-reveal-delay={i * 90}>
          <a
            href={href}
            {...(label === "Office" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex h-full flex-col rounded-photo border border-ink-950/10 bg-white p-7 shadow-[0_24px_50px_-30px_rgb(11_10_8/0.3)] transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_34px_60px_-30px_rgb(11_10_8/0.4)]"
          >
            <span className="grid size-12 place-items-center rounded-full bg-green-metal text-ivory-50">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="eyebrow mt-6 text-ink-500">{label}</span>
            <span className="mt-2 text-lg leading-snug min-w-0 [overflow-wrap:anywhere] text-ink-950 group-hover:text-green-700">{value}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
