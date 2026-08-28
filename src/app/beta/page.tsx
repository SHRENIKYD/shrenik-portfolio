import type { Metadata } from "next";
import BetaSite from "@/components/beta/BetaSite";

export const metadata: Metadata = {
  title: "Shrenik YD — Beta",
  description: "Where new ideas for the portfolio land first.",
};

// The proving ground: same site as "/", plus whatever is being tried out.
// Right now that is the eased, weighted scrolling.
export default function BetaPage() {
  return <BetaSite smoothScroll />;
}
