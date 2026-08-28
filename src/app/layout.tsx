import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import InstallApp from "@/components/InstallApp";
import { withBasePath } from "@/lib/basePath";
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
  title: "Shrenik YD — Senior Software Engineer",
  description:
    "Shrenik YD — Full-stack .NET / Angular / Knockout.js engineer. Interactive terminal-styled portfolio built from a resume.",
  applicationName: "Shrenik.YD",
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
