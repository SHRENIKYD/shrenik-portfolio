"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { withBasePath } from "@/lib/basePath";

// Registers the service worker and offers the install prompt.
//
// The pill only appears when the browser has actually fired
// beforeinstallprompt — i.e. the site meets the install criteria and is not
// already installed. Chrome and Edge (desktop and Android) do this; iOS
// Safari never does, and offers no API to trigger it, so the pill correctly
// stays hidden there and installing is Share → Add to Home Screen. Dismissal
// is remembered, because a nagging install banner is worse than no banner.

const DISMISS_KEY = "install-pill-dismissed";

// The event is still non-standard, so it is typed here rather than imported.
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallApp() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // after load, so it never competes with the first paint
      const register = () => {
        navigator.serviceWorker
          .register(withBasePath("/sw.js"), { scope: withBasePath("/") })
          .catch(() => {
            /* unsupported or blocked — the site works fine without it */
          });
      };
      if (document.readyState === "complete") register();
      else window.addEventListener("load", register, { once: true });
    }

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* storage blocked — treat as not dismissed */
    }

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep it, fire it on our own button instead
      if (dismissed) return;
      setDeferred(e as InstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    setShow(false);
    await deferred.prompt();
    await deferred.userChoice; // resolved either way; the pill is already gone
    setDeferred(null);
  };

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage blocked — it will just offer again next visit */
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2.5 backdrop-blur-md sm:left-6 sm:translate-x-0"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
            borderColor: "rgba(140,190,210,0.28)",
            background: "rgba(5,10,14,0.72)",
            boxShadow: "0 0 24px rgba(90,150,180,0.18)",
          }}
        >
          <button
            type="button"
            onClick={install}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#c9d1d9] transition-colors hover:text-[#39ff8e]"
          >
            <Download size={14} />
            Install app
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="text-[#556058] transition-colors hover:text-[#e8efe9]"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
