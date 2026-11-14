/**
 * Generates tiny blurred placeholders for every photo in public/images and
 * writes them to src/content/blur.json ({ "/images/x.jpg": "data:image/webp;base64,…" }).
 * The placeholder keeps each image's aspect ratio (from its real width/height)
 * so next/image can paint a colour-accurate preview with zero layout shift.
 *
 * Run after adding or replacing photos:  npm run blur
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "images");
const out = path.join(root, "src", "content", "blur.json");

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();
const result = {};

for (const file of files) {
  const input = sharp(path.join(dir, file));
  const { width = 1, height = 1 } = await input.metadata();
  const w = 16;
  const h = Math.max(1, Math.round((height / width) * w));
  const buf = await input.resize(w, h, { fit: "fill" }).blur(1).webp({ quality: 40 }).toBuffer();
  result[`/images/${file}`] = `data:image/webp;base64,${buf.toString("base64")}`;
}

await writeFile(out, JSON.stringify(result, null, 2) + "\n");
console.log(`blur: ${files.length} placeholders → ${path.relative(root, out)}`);
