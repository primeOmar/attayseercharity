import type { ImageAsset } from "@/types/content";
import { PageCta, PageHeader } from "./page-shell";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  image?: ImageAsset;
  /** Which development phase delivers the full page. */
  phase: string;
  children?: React.ReactNode;
}

/**
 * Interim page shell so navigation never dead-ends while later phases are
 * built. Pages using this are marked noindex via their metadata.
 */
export function PagePlaceholder({ eyebrow, title, description, path, image, phase, children }: Props) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} path={path} image={image} tall>
        <p className="mt-8 inline-flex rounded-pill border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm text-gold-300">
          Full page arrives in {phase}.
        </p>
      </PageHeader>
      {children}
      <PageCta />
    </>
  );
}
