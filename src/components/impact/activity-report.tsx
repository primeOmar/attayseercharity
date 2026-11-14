import { Photo } from "@/components/ui/photo";
import type { Activity } from "@/content/pages";
import { cn } from "@/lib/utils";

/** One reported activity: photo, facts table and narrative. */
export function ActivityReport({ activity, flip = false }: { activity: Activity; flip?: boolean }) {
  const facts = [
    { label: "Focus", value: activity.focus },
    { label: "Date", value: activity.date },
    { label: "Location", value: activity.location },
    { label: "Provided", value: activity.provided },
    { label: "Reached", value: activity.reached },
    ...(activity.partner ? [{ label: "Partner", value: activity.partner }] : []),
  ];

  return (
    <article id={activity.slug} aria-labelledby={`${activity.slug}-title`} className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={cn("lg:col-span-5", flip && "lg:order-2")}>
        <div data-reveal="image" className="relative isolate aspect-[4/5] overflow-hidden rounded-photo lg:sticky lg:top-28">
          <Photo image={activity.image} alt={activity.image.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div data-reveal className="lg:col-span-7">
        <p className="eyebrow text-green-700">{activity.date}</p>
        <h3 id={`${activity.slug}-title`} className="mt-3 font-display text-display-sm">
          {activity.title}
        </h3>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">{activity.body}</p>
        <dl className="mt-8 divide-y divide-ink-950/10 border-y border-ink-950/10">
          {facts.map((f) => (
            <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-sm font-medium tracking-wide text-ink-500 uppercase">{f.label}</dt>
              <dd className="leading-relaxed">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
