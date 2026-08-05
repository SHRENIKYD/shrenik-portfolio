"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { architectureLayers } from "@/data/resume";
import Gutter from "@/components/Gutter";
import { Play, Plus } from "lucide-react";

const HOLD_MS = 2000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ArchitectureTab() {
  const [openLayer, setOpenLayer] = useState<string | null>(architectureLayers[0].id);
  const [pulseKey, setPulseKey] = useState(0);
  const [running, setRunning] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  const runRequest = async () => {
    if (running) return;
    setRunning(true);
    setPulseKey((k) => k + 1);

    for (const layer of architectureLayers) {
      if (cancelledRef.current) return;
      setOpenLayer(layer.id);
      await wait(HOLD_MS);
      if (cancelledRef.current) return;
    }

    setOpenLayer(architectureLayers[0].id);
    setRunning(false);
  };

  return (
    <div className="flex">
      <Gutter />
      <div className="flex-1 min-w-0 px-4 sm:px-8 py-8 max-w-3xl">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div className="font-mono text-sm text-[#6b7a72]">
            <span className="text-[#556058]">01</span> // how a request actually
            flows through what I&apos;ve built
          </div>
          <button
            onClick={runRequest}
            disabled={running}
            className="flex items-center gap-2 rounded-md border border-[#39ff8e]/40 bg-[#39ff8e]/10 px-3 py-1.5 font-mono text-xs text-[#39ff8e] hover:bg-[#39ff8e]/20 transition-colors disabled:opacity-50"
          >
            <Play size={13} />
            {running ? "request in flight…" : "trigger request"}
          </button>
        </div>

        <p className="text-sm text-[#8b978f] mb-8 max-w-xl leading-relaxed">
          Click any layer to expand it. Hit &ldquo;trigger request&rdquo; to watch a
          request travel top-to-bottom through the stack — each layer will open
          itself, hold for a couple seconds, then hand off to the next.
        </p>

        <div className="relative">
          {/* connecting spine */}
          <div className="absolute left-6 sm:left-7 top-6 bottom-6 w-px bg-[#1c2621]" />

          <div className="space-y-3">
            {architectureLayers.map((layer, i) => {
              const isOpen = openLayer === layer.id;
              return (
                <div key={layer.id} className="relative pl-14 sm:pl-16">
                  {/* node dot */}
                  <span className="absolute left-4 sm:left-5 top-4 h-4 w-4 rounded-full border-2 border-[#3a4a41] bg-[#0a0e0c] z-10" />

                  {/* traveling pulse */}
                  <AnimatePresence>
                    {running && (
                      <motion.span
                        key={`${pulseKey}-${layer.id}`}
                        className="absolute left-4 sm:left-5 top-4 h-4 w-4 rounded-full bg-[#39ff8e] z-20"
                        style={{ boxShadow: "0 0 14px 3px rgba(57,255,142,0.7)" }}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.4] }}
                        transition={{
                          delay: (i * HOLD_MS) / 1000,
                          duration: HOLD_MS / 1000,
                          times: [0, 0.15, 0.75, 1],
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setOpenLayer(isOpen ? null : layer.id)}
                    className="w-full text-left rounded-lg border border-[#1c2621] bg-[#0d1310] px-4 py-3.5 hover:border-[#ff6ac1]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-[#556058] mr-2">
                          0{i + 1}
                        </span>
                        <span className="font-bold text-[#e8efe9]">
                          {layer.label}
                        </span>
                      </div>
                      <Plus
                        size={15}
                        className={`text-[#6b7a72] transition-transform ${
                          isOpen ? "rotate-45 text-[#ff6ac1]" : ""
                        }`}
                      />
                    </div>
                    <div className="mt-1 font-mono text-xs text-[#ff6ac1]">
                      {layer.sublabel}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-lg border border-[#1c2621] bg-[#101713] px-4 py-3.5">
                          <p className="text-sm leading-relaxed text-[#a9b6ae]">
                            {layer.detail}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {layer.tech.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-[#1c2621] bg-[#0d1310] px-2.5 py-0.5 text-[11px] font-mono text-[#8b978f]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-dashed border-[#1c2621] px-4 py-4 text-xs font-mono text-[#556058] leading-relaxed">
          note: this is a narrative simplification of how the pieces connect —
          drawn from the projects &amp; responsibilities on my resume, not a leaked
          production diagram.
        </div>
      </div>
    </div>
  );
}
