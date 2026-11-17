import type { ComponentType } from "react";
import { App } from "./app";
import Home from "./pages/home/Home";
import Download from "./pages/download/Download";
import Developers from "./pages/developers/Developers";
import Sponsor from "./pages/sponsor/Sponsor";
import Contributors from "./pages/contributors/Contributors";
import Stats from "./pages/stats/Stats";
import Tracker from "./pages/tracker/Tracker";
import NotFound from "./pages/not-found/NotFound";

function entry(Page: ComponentType) {
  return function PageEntry() {
    return <App page={Page} />;
  };
}

export const HomeEntry = entry(Home);
export const DownloadEntry = entry(Download);
export const DevelopersEntry = entry(Developers);
export const SponsorEntry = entry(Sponsor);
export const ContributorsEntry = entry(Contributors);
export const StatsEntry = entry(Stats);
export const TrackerEntry = entry(Tracker);
export const NotFoundEntry = entry(NotFound);
