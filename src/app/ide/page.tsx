"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import IdeShell from "@/components/IdeShell";

// The original IDE-themed portfolio, preserved at /ide after the
// cinematic version took over the homepage.
export default function IdeHome() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      {booted && <IdeShell />}
    </>
  );
}
