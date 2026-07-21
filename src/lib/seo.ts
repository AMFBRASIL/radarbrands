/**
 * SEO / LLM discovery — Radar | brands
 * Fonte única de URLs, keywords, meta e JSON-LD.
 */

export const SITE = {
  name: "Radar | brands",
  shortName: "Radar Brands",
  legalName: "Radar Brands",
  url: "https://radarbrands.com.br",
  locale: "pt_BR",
  language: "pt-BR",
  twitter: "@RadarBrand",
  email: "contato@radarbrands.com.br",
  phone: undefined as string | undefined,
  ogImage:
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fa23ff62-a649-42cd-a441-a101910592c3/id-preview-79c41458--e7acb3c5-1f55-445d-a749-76423fe9cee6.lovable.app-1783649357692.png",
  themeColor: "#050b14",
} as const;

/** Palavras-alvo (pesquisa de marca / monitoramento / concorrentes) */
export const PRIMARY_KEYWORDS = [
  "radar brands",
  "radarbrands",
  "monitoramento de marca",
  "monitor brands",
  "brand monitoring",
  "proteção de marca",
  "brand protection",
  "make brands",
  "search brands",
  "branddi",
  "brand bidding",
  "monitorar marca google",
  "monitoramento de domínio",
  "proteção de marca digital",
  "inteligência de marca",
  "brand intelligence",
  "takedown de marca",
  "monitoramento marketplace marca",
] as const;

export const DEFAULT_DESCRIPTION =
  "Radar Brands: monitoramento e proteção de marca 24/7 com IA. Alternativa a Branddi, Make Brands e Search Brands — domínios, Google Ads, redes sociais e marketplaces.";

export type SeoPageInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized === "/" ? "" : normalized}`;
}

export function buildKeywords(extra: string[] = []): string {
  return [...new Set([...PRIMARY_KEYWORDS, ...extra])].join(", ");
}

type HeadMeta =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string };

type HeadLink = {
  rel: string;
  href: string;
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  sizes?: string;
};

type HeadScript = {
  type: string;
  children: string;
};

export function buildPageHead(input: SeoPageInput): {
  meta: HeadMeta[];
  links: HeadLink[];
  scripts: HeadScript[];
} {
  const path = input.path ?? "/";
  const url = absoluteUrl(path);
  const image = input.image ?? SITE.ogImage;
  const keywords = buildKeywords(input.keywords);
  const robots = input.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const meta: HeadMeta[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "keywords", content: keywords },
    { name: "author", content: SITE.name },
    { name: "creator", content: SITE.name },
    { name: "publisher", content: SITE.name },
    { name: "robots", content: robots },
    { name: "googlebot", content: robots },
    { name: "bingbot", content: robots },
    { name: "language", content: SITE.language },
    { name: "theme-color", content: SITE.themeColor },
    { name: "application-name", content: SITE.shortName },
    { name: "apple-mobile-web-app-title", content: SITE.shortName },
    { name: "format-detection", content: "telephone=no" },
    // Open Graph
    { property: "og:locale", content: SITE.locale },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:site_name", content: SITE.name },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: `${SITE.name} — monitoramento de marca` },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE.twitter },
    { name: "twitter:creator", content: SITE.twitter },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    // AI / LLM discovery hints
    { name: "ai-content-declaration", content: "human-and-ai-assisted" },
    {
      name: "citation_title",
      content: input.title,
    },
  ];

  const links: HeadLink[] = [
    { rel: "canonical", href: url },
    { rel: "manifest", href: "/manifest.webmanifest" },
  ];

  const graph = Array.isArray(input.jsonLd)
    ? input.jsonLd
    : input.jsonLd
      ? [input.jsonLd]
      : [];

  const scripts: HeadScript[] = graph.map((node) => ({
    type: "application/ld+json",
    children: JSON.stringify(node),
  }));

  return { meta, links, scripts };
}

export const MARKETING_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/como-funciona", priority: "0.9", changefreq: "monthly" },
  { path: "/diferencial", priority: "0.9", changefreq: "monthly" },
  { path: "/juridico", priority: "0.8", changefreq: "monthly" },
  { path: "/sobre-nos", priority: "0.7", changefreq: "monthly" },
  { path: "/diagnostico", priority: "0.9", changefreq: "weekly" },
  { path: "/proposta", priority: "0.8", changefreq: "monthly" },
  { path: "/monitoramento-de-marca", priority: "1.0", changefreq: "weekly" },
  { path: "/alternativas", priority: "0.95", changefreq: "weekly" },
  { path: "/status", priority: "0.3", changefreq: "daily" },
  { path: "/playground", priority: "0.4", changefreq: "monthly" },
] as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: [
      "Radar Brands",
      "Radarbrands",
      "Radar | brands",
      "Radar Brand Intelligence",
    ],
    url: SITE.url,
    logo: absoluteUrl("/favicon.ico"),
    image: SITE.ogImage,
    email: SITE.email,
    description: DEFAULT_DESCRIPTION,
    foundingDate: "2024",
    sameAs: [`https://twitter.com/RadarBrand`],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        availableLanguage: ["Portuguese", "pt-BR"],
        areaServed: "BR",
      },
    ],
    knowsAbout: [
      ...PRIMARY_KEYWORDS,
      "brand bidding",
      "takedown",
      "LGPD",
      "propriedade intelectual",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: SITE.language,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/diagnostico?marca={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#software`,
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Brand Protection / Brand Monitoring",
    operatingSystem: "Web",
    url: SITE.url,
    image: SITE.ogImage,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "99",
      highPrice: "999",
      offerCount: 3,
    },
    featureList: [
      "Monitoramento de marca 24/7",
      "Brand bidding e Google Ads",
      "Domínios e typosquatting",
      "Redes sociais e marketplaces",
      "Mediação e takedown",
      "Assistente de IA para marca",
    ],
    provider: { "@id": `${SITE.url}/#organization` },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Monitoramento e proteção de marca",
    serviceType: "Brand monitoring and brand protection",
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/monitoramento-de-marca"),
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
  };
}

/** FAQ compartilhado (UI + JSON-LD) */
export const HOME_FAQ: Array<{ question: string; answer: string }> = [
  {
    question: "O que é o Radar Brands?",
    answer:
      "Radar Brands (Radar | brands) é uma plataforma de brand intelligence e monitoramento de marca 24/7 com IA. Monitora domínios, Google Ads, redes sociais e marketplaces, e combina alertas com mediação humana e suporte jurídico.",
  },
  {
    question: "Radar Brands é alternativa ao Branddi, Make Brands ou Search Brands?",
    answer:
      "Sim. O Radar Brands foi pensado para quem busca soluções como Branddi, Make Brands, Search Brands ou Monitor Brands — com monitoramento contínuo, classificação por IA, mediação de brand bidding e operação de proteção de marca em um só lugar.",
  },
  {
    question: "Como funciona o monitoramento de marca (monitor brands)?",
    answer:
      "Você cadastra a marca; nossa IA varre a internet em busca de uso indevido, brand bidding, perfis falsos, domínios suspeitos e anúncios. Alertas chegam em tempo real e o time pode mediar ou escalar takedown.",
  },
  {
    question: "Comprar o nome de uma marca concorrente no Google é legal?",
    answer:
      "Não. A prática de brand bidding não autorizado é enquadrada como concorrência desleal pelo art. 195 da Lei de Propriedade Industrial (LPI). A jurisprudência brasileira tem reconhecido o direito à cessação e à indenização quando comprovado o uso indevido do nome.",
  },
  {
    question: "Em quanto tempo o meu CPC começa a cair?",
    answer:
      "As primeiras mediações costumam fechar em 7 a 14 dias. A queda de CPC aparece nos leilões seguintes — a maioria dos clientes vê impacto mensurável em 30 dias.",
  },
  {
    question: "Vocês monitoram só o Google?",
    answer:
      "A operação nasce no Google (busca e Shopping), onde está a maior parte do prejuízo, e se estende para redes sociais, marketplaces, domínios e menções — tudo dentro do mesmo dashboard.",
  },
  {
    question: "Como é a mediação na prática?",
    answer:
      "Nosso time entra em contato direto com o anunciante com evidência empacotada e base legal. Em grande parte dos casos o brand bidding cessa antes de qualquer notificação formal.",
  },
  {
    question: "Radar | brands substitui uma ferramenta de monitoramento?",
    answer:
      "Sim. Você deixa de pagar uma ferramenta que só alerta e passa a ter uma operação completa: monitoramento + mediação + escalada jurídica no mesmo lugar.",
  },
];
