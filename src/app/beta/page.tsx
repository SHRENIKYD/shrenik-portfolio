import type { Metadata } from "next";
import BetaSite from "@/components/beta/BetaSite";

export const metadata: Metadata = {
  title: "Shrenik YD — Beta",
  description: "Alias of the main portfolio — same experience as /.",
};

// Kept as an alias of the homepage so existing links keep working.
export default function BetaPage() {
  return <BetaSite />;
}
