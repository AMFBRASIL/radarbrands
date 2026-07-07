import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import {
  BrandMonitor,
  BrandAI,
  DomainWatch,
  SocialProtection,
  AdsGuardian,
  MarketplaceMonitor,
  TrademarkCenter,
} from "@/components/landing/modules";
import { Pricing, CtaBand, SiteFooter } from "@/components/landing/pricing-footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div id="plataforma" className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <BrandMonitor />
        <BrandAI />
        <DomainWatch />
        <SocialProtection />
        <AdsGuardian />
        <MarketplaceMonitor />
        <TrademarkCenter />
        <Pricing />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
