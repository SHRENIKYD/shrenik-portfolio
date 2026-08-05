"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";

export default function AvatarReveal({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-lg border border-[#1c2621] bg-[#0d1310]">
      {status !== "missing" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("missing")}
          className="h-full w-full object-cover"
          style={{
            filter: status === "ready" ? "blur(0px) grayscale(0)" : "blur(14px) grayscale(1)",
            transition: "filter 900ms ease-out",
          }}
        />
      )}

      {status === "missing" && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 border border-dashed border-[#2a3630] p-2 text-center">
          <ImageOff size={18} className="text-[#3a4a41]" />
          <span className="font-mono text-[9px] leading-tight text-[#556058]">
            avatar.jpg
            <br />
            not found
          </span>
        </div>
      )}

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#39ff8e]">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            rendering…
          </motion.span>
        </div>
      )}

      {/* scanline sweep on reveal */}
      {status === "ready" && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-[#39ff8e]/20 to-transparent"
        />
      )}
    </div>
  );
}
