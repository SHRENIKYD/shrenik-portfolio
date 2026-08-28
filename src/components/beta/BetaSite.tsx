import BetaBackground from "@/components/beta/BetaBackground";
import BetaLoader from "@/components/beta/BetaLoader";
import ScrollProgress from "@/components/beta/ScrollProgress";
import BetaNav from "@/components/beta/BetaNav";
import BetaWhatFor from "@/components/beta/BetaWhatFor";
import BetaHero from "@/components/beta/BetaHero";
import BetaJourney from "@/components/beta/BetaJourney";
import BetaCraft from "@/components/beta/BetaCraft";
import BetaAbout from "@/components/beta/BetaAbout";
import BetaContactOverlay from "@/components/beta/BetaContactOverlay";

// The whole cinematic site as one composition — served at "/" (the main
// portfolio) and kept at "/beta" as an alias while it keeps evolving.
export default function BetaSite() {
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
        <BetaJourney />
        <BetaWhatFor />
        <BetaCraft />
        <BetaAbout />
      </main>
      <BetaContactOverlay />
    </div>
  );
}
