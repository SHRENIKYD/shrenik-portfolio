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
import SmoothScroll from "@/components/beta/SmoothScroll";

// The whole cinematic site as one composition — served at "/" (the main
// portfolio) and at "/beta", which is where experiments land first.
//
// smoothScroll is one such experiment, currently live on /beta only: it
// replaces the page-scrolling feel with eased, weighted movement.
export default function BetaSite({ smoothScroll = false }: { smoothScroll?: boolean }) {
  const content = (
    <main className="relative z-10">
      <BetaHero />
      <BetaJourney />
      <BetaWhatFor />
      <BetaCraft />
      <BetaAbout />
    </main>
  );

  return (
    <div className="relative">
      {/* WebGL underwater scene — mounted after the global grid canvas in
          the DOM, so it paints over it; page content sits above both */}
      <BetaBackground />
      <BetaLoader />
      <ScrollProgress />
      <BetaNav />
      {/* fixed layers stay outside SmoothScroll — a transformed ancestor
          would capture them and they would scroll away */}
      {smoothScroll ? <SmoothScroll>{content}</SmoothScroll> : content}
      <BetaContactOverlay />
    </div>
  );
}
