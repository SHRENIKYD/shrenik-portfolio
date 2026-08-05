"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import IdeShell from "@/components/IdeShell";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      {booted && <IdeShell />}
    </>
  );
}
