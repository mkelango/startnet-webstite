import Hero from "@/components/home/Hero";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProofSection from "@/components/home/ProofSection";
import EcosystemStory from "@/components/home/EcosystemStory";
import WhoThisIsFor from "@/components/home/WhoThisIsFor";
import NextEventBanner from "@/components/home/NextEventBanner";
import ClosingStatement from "@/components/home/ClosingStatement";

export default function Home() {
  return (
    <>
      <Hero />
      <PortfolioSection />
      <ProofSection />
      <EcosystemStory />
      <WhoThisIsFor />
      <NextEventBanner />
      <ClosingStatement />
    </>
  );
}
