import { headers } from "next/headers";

/**
 * Visitor's country (ISO 3166-1 alpha-2) from Vercel's edge geolocation header.
 * Used only to pick a default donation currency; `null` locally / off Vercel.
 */
export async function GET() {
  const h = await headers();
  const country = h.get("x-vercel-ip-country");
  return Response.json(
    { country: country && /^[A-Z]{2}$/.test(country) ? country : null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
