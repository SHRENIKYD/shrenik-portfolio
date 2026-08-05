import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
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
      </body>
    </html>
  );
}
