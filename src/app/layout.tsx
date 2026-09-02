import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import InstallApp from "@/components/InstallApp";
import { withBasePath } from "@/lib/basePath";
import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from "@/lib/site";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // Everything relative below is resolved against this into an absolute URL,
  // which is what social scrapers require.
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Shrenik.YD",

  // The link preview: the contact screen's neon sign, mid-ignition.
  // Source in assets/og-card.html, rendered to public/og.png.
  openGraph: {
    type: "website",
    siteName: "Shrenik YD",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: withBasePath("/"),
    locale: "en_IN",
    images: [
      {
        url: withBasePath("/og.png"),
        width: 1200,
        height: 630,
        alt: "BENGALURU in neon, half-lit — Shrenik YD, full-stack .NET engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [withBasePath("/og.png")],
  },
  // iOS ignores the web app manifest: standalone launch, the status bar
  // treatment and the home screen icon all come from these instead.
  appleWebApp: {
    capable: true,
    title: "Shrenik.YD",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: withBasePath("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: withBasePath("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: withBasePath("/icons/apple-touch-icon.png"), sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#05080a",
  // the installed app runs edge to edge, under the notch and home indicator
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable} ${plexSans.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0e0c] text-[#c9d1d9] antialiased selection:bg-[#39ff8833] selection:text-[#7CFFB2]">
        <InteractiveBackground />
        {children}
        <InstallApp />
      </body>
    </html>
  );
}
