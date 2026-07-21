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
import { Investment } from "@/components/landing/investment";
import { LossSimulator } from "@/components/landing/loss-simulator";
import { ExclusiveFeatures } from "@/components/landing/exclusive-features";
import {
  WhyNow,
  SilentAttack,
  LegalBase,
  MediationRevenue,
  ToolVsSpecialist,
  BrandFAQ,
} from "@/components/landing/brand-bidding";
import { Contact, WhatsAppFab } from "@/components/landing/contact";
import { CtaBand, SiteFooter } from "@/components/landing/pricing-footer";
import { SeoKeywordBand } from "@/components/landing/seo-keyword-band";
import {
  buildPageHead,
  DEFAULT_DESCRIPTION,
  faqJsonLd,
  HOME_FAQ,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title:
        "Radar Brands — Monitoramento e Proteção de Marca com IA | Monitor Brands",
      description: DEFAULT_DESCRIPTION,
      path: "/",
      keywords: ["radar brands", "monitor brands", "branddi", "make brands", "search brands"],
      jsonLd: [
        organizationJsonLd(),
        websiteJsonLd(),
        softwareApplicationJsonLd(),
        faqJsonLd(HOME_FAQ),
      ],
    }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div id="plataforma" className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <SeoKeywordBand />
        <WhyNow />
        <LossSimulator />
        <SilentAttack />
        <BrandMonitor />
        <BrandAI />
        <DomainWatch />
        <SocialProtection />
        <AdsGuardian />
        <MarketplaceMonitor />
        <TrademarkCenter />
        <ExclusiveFeatures />
        <LegalBase />
        <MediationRevenue />
        <ToolVsSpecialist />
        <Investment />
        <BrandFAQ />
        <Contact />
        <CtaBand />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
