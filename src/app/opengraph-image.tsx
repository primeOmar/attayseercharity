import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Literal paths keep build tracing scoped to just these two files.
const photo = await readFile(join(process.cwd(), "public/images/hero-school-walk.jpg"), "base64");
const emblem = await readFile(join(process.cwd(), "public/brand/emblem.png"), "base64");
const photoSrc = `data:image/jpeg;base64,${photo}`;
const emblemSrc = `data:image/png;base64,${emblem}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#0b0a08" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoSrc} alt="" width={1200} height={676} style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.55 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 72,
            background: "linear-gradient(90deg, rgba(11,10,8,0.94) 0%, rgba(11,10,8,0.35) 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblemSrc} alt="" width={158} height={150} style={{ marginBottom: 28 }} />
          <div style={{ fontSize: 64, color: "#fbf8f2", lineHeight: 1.05, textAlign: "center", maxWidth: 900, fontFamily: "serif" }}>{site.tagline}</div>
          <div style={{ fontSize: 28, color: "#fcd460", marginTop: 22, letterSpacing: 5, textTransform: "uppercase" }}>
            {site.name}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            background: "linear-gradient(90deg, #b80205 0%, #df2025 22%, #f1b10f 40%, #fcd460 50%, #f1b10f 60%, #299725 78%, #0c5814 100%)",
          }}
        />
      </div>
    ),
    size,
  );
}
