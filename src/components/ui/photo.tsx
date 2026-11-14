import Image, { type ImageProps } from "next/image";
import type { ImageAsset } from "@/types/content";

type PhotoProps = Omit<ImageProps, "src" | "alt" | "placeholder" | "blurDataURL"> & {
  image: ImageAsset;
  /** Override the asset's alt text (e.g. "" when the photo is decorative here). */
  alt?: string;
};

/**
 * next/image for library assets: applies the generated blur placeholder and,
 * unless `fill` is used, the asset's intrinsic width/height (no layout shift).
 * Only the LCP image on a page should pass `priority`/`fetchPriority="high"`.
 */
export function Photo({ image, alt, fill, width, height, ...props }: PhotoProps) {
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      {...(fill ? { fill } : { width: width ?? image.width, height: height ?? image.height })}
      {...(image.blurDataURL ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL } : {})}
      {...props}
    />
  );
}
