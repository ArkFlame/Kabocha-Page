import { SITE_URL, type Route } from "./routes.ts";

const OG_IMAGE = { url: `${SITE_URL}/assets/logos/og-kabocha.png`, width: 1229, height: 528 };
const LOGO_URL = `${SITE_URL}/assets/logos/icon.png`;
const GITHUB_URL = "https://github.com/ArkFlame/Kabocha";

function attr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function jsonLd(data: object): string {
  return `<script type="application/ld+json">` + JSON.stringify(data).replaceAll("<", "\\u003c") + "</script>";
}

function structuredData(route: Route): string[] {
  if (route.noindex) return [];

  if (route.id === "home") {
    return [
      jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "Kabocha",
            url: `${SITE_URL}/`,
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Kabocha",
            url: `${SITE_URL}/`,
            logo: LOGO_URL,
            sameAs: [GITHUB_URL],
          },
          {
            "@type": "SoftwareApplication",
            name: "Kabocha",
            description: route.description,
            url: `${SITE_URL}/`,
            downloadUrl: `${SITE_URL}/download/`,
            image: OG_IMAGE.url,
            applicationCategory: "GameApplication",
            applicationSubCategory: "Minecraft server",
            operatingSystem: "Windows, macOS, Linux, Android",
            programmingLanguage: "Rust",
            license: "https://www.gnu.org/licenses/gpl-3.0.html",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            author: { "@id": `${SITE_URL}/#organization` },
          },
        ],
      }),
    ];
  }

  if (!route.breadcrumb) return [];

  return [
    jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kabocha", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: route.breadcrumb, item: `${SITE_URL}${route.path}` },
      ],
    }),
  ];
}

export function renderHead(route: Route, _isBuild: boolean, base: string): string {
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
  const url = `${SITE_URL}${route.path}`;
  const tags = [
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<title>${attr(route.title)}</title>`,
    `<meta name="description" content="${attr(route.description)}" />`,
    route.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta name="theme-color" content="#00c853" />`,
    `<meta property="og:site_name" content="Kabocha" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${attr(route.ogTitle)}" />`,
    `<meta property="og:description" content="${attr(route.ogDescription)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="Kabocha, the Minecraft server written in Rust" />`,
    ...(route.noindex ? [] : [`<meta property="og:url" content="${url}" />`]),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(route.ogTitle)}" />`,
    `<meta name="twitter:description" content="${attr(route.ogDescription)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
    `<link rel="icon" type="image/png" href="${root}/favicon.png" />`,
    `<link rel="apple-touch-icon" href="${root}/assets/logos/apple-touch-icon.png" />`,
    `<link rel="preload" as="font" type="font/woff2" href="${root}/fonts/bricolage-grotesque-latin.woff2" crossorigin />`,
    ...structuredData(route),
  ];

  return tags.join("\n");
}
