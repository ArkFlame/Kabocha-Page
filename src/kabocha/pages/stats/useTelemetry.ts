import { useCallback, useState } from "react";
import type { GeoEntry, Overview, PluginEntry, Systems, TrendPoint, TrendRange } from "./types";

// No Kabocha telemetry endpoint has been published. Empty arrays mean no data,
// not zero observed activity; null overview leaves aggregate values unknown.
const trends: TrendPoint[] = [];
const geo: GeoEntry[] = [];
const plugins: PluginEntry[] = [];
const systems: Systems = { os: [], arch: [], cpu_models: [], minecraft_versions: [], software_versions: [], ram_distribution: [], total_ram_distribution: [] };
export function useTelemetry(_range: TrendRange) {
  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);
  return { overview: null as Overview | null, trends, systems, geo, plugins, lastUpdated: null as Date | null, loading: false, rangeLoading: false, failed: false, refreshCount, refresh };
}
