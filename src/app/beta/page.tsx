import type { Metadata } from "next";
import BetaBackground from "@/components/beta/BetaBackground";
import BetaLoader from "@/components/beta/BetaLoader";
import ScrollProgress from "@/components/beta/ScrollProgress";
import BetaNav from "@/components/beta/BetaNav";
import BetaWhatFor from "@/components/beta/BetaWhatFor";
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
      {/* WebGL underwater scene — mounted after the global grid canvas in
          the DOM, so it paints over it; page content sits above both */}
      <BetaBackground />
      <BetaLoader />
      <ScrollProgress />
      <BetaNav />
      <main className="relative z-10">
        <BetaHero />
        <BetaWork />
        <BetaWhatFor />
        <BetaCraft />
        <BetaAbout />
        <BetaContact />
      </main>
    </div>
  );
}
