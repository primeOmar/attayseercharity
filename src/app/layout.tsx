import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { RevealObserver } from "@/components/layout/reveal-observer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0a08",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Enables reveal styles only when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <ScrollProgress />
        <SmoothScroll />
        <RevealObserver />
      </body>
    </html>
  );
}
