import type { Metadata } from "next";
import ScrollProgress from "@/components/beta/ScrollProgress";
import BetaNav from "@/components/beta/BetaNav";
import BetaHero from "@/components/beta/BetaHero";
import BetaWork from "@/components/beta/BetaWork";
import BetaCraft from "@/components/beta/BetaCraft";
import BetaAbout from "@/components/beta/BetaAbout";
import BetaContact from "@/components/beta/BetaContact";

export const metadata: Metadata = {
  title: "Shrenik YD — Beta",
  description: "An experimental, editorial-style concept for the portfolio.",
};

// A separate, experimental concept sitting alongside the live IDE-themed
// portfolio ("/") — not linked from it, not replacing it. Reachable only
// by going to /beta directly, so it can be reviewed and iterated on before
// any decision to promote it.
export default function BetaPage() {
  return (
    <div className="relative">
      <ScrollProgress />
      <BetaNav />
      <main>
        <BetaHero />
        <BetaWork />
        <BetaCraft />
        <BetaAbout />
        <BetaContact />
      </main>
    </div>
  );
}
