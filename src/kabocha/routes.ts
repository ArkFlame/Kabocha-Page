export type PageId = "home" | "download" | "developers" | "sponsor" | "contributors" | "stats" | "tracker" | "notFound";

export interface Route {
  id: PageId;
  path: string;
  html: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  breadcrumb?: string;
  noindex?: boolean;
}

export const SITE_URL = `${import.meta.env.SITE?.replace(/\/$/, "") ?? "https://arkflame.com"}${import.meta.env.BASE_URL.replace(/\/$/, "")}`;

export const routes: Route[] = [
  {
    id: "home",
    path: "/",
    html: "index.html",
    title: "Kabocha - Blazingly Fast Minecraft Server",
    description: "Kabocha: The fastest, most efficient Minecraft server software. Written in Rust.",
    ogTitle: "Kabocha - Blazingly Fast Minecraft Server",
    ogDescription: "1000x faster startup. 18x less memory. Built with Rust for maximum performance.",
  },
  {
    id: "download",
    breadcrumb: "Download",
    path: "/download/",
    html: "download/index.html",
    title: "Download Kabocha - Blazingly Fast Minecraft Server",
    description: "Download the latest release of Kabocha, the fastest Minecraft server.",
    ogTitle: "Download Kabocha",
    ogDescription: "Self-contained executable. No Java required. Just download, run, and play.",
  },
  {
    id: "developers",
    breadcrumb: "Developers",
    path: "/developers/",
    html: "developers/index.html",
    title: "For Developers - Kabocha",
    description:
      "Why developers love building on Kabocha. Typed commands, mutable events, Java + Bedrock support, and more.",
    ogTitle: "For Developers - Kabocha",
    ogDescription: "No NMS. No reflection. No version-specific hacks. Just clean, type-safe APIs.",
  },
  {
    id: "sponsor",
    breadcrumb: "Sponsor",
    path: "/sponsor/",
    html: "sponsor/index.html",
    title: "Sponsorship - Kabocha",
    description:
      "Support Kabocha development and help keep the project independent.",
    ogTitle: "Sponsorship - Kabocha",
    ogDescription: "Support Kabocha development and help keep the project independent.",
  },
  {
    id: "contributors",
    breadcrumb: "Contributors",
    path: "/contributors/",
    html: "contributors/index.html",
    title: "Contributors - Kabocha",
    description: "Meet the amazing people who contribute to Kabocha, the fastest Minecraft server.",
    ogTitle: "Contributors - Kabocha",
    ogDescription: "Meet the amazing people who contribute to Kabocha, the fastest Minecraft server.",
  },
  {
    id: "stats",
    breadcrumb: "Stats",
    path: "/stats/",
    html: "stats/index.html",
    title: "Telemetry & Stats - Kabocha",
    description:
      "Community telemetry and server statistics for Kabocha.",
    ogTitle: "Telemetry & Stats - Kabocha",
    ogDescription:
      "Community telemetry and server statistics for Kabocha.",
  },
  {
    id: "tracker",
    breadcrumb: "Vanilla parity",
    path: "/tracker/",
    html: "tracker/index.html",
    title: "Vanilla Parity - Kabocha",
    description:
      "Every vanilla block, entity, item, command, redstone, combat and world feature implemented in Kabocha, with live completion status.",
    ogTitle: "Vanilla Parity - Kabocha",
    ogDescription:
      "Every vanilla block, entity, item, command, redstone, combat and world feature implemented in Kabocha, with live completion status.",
  },
  {
    id: "notFound",
    path: "/404.html",
    html: "404.html",
    title: "Page not found - Kabocha",
    description: "This page does not exist on arkflame.com/Kabocha-Page.",
    ogTitle: "Page not found - Kabocha",
    ogDescription: "This page does not exist on arkflame.com/Kabocha-Page.",
    noindex: true,
  },
];
