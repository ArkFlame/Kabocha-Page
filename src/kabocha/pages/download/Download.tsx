import { useEffect, useState } from "react";
import { BUILD_GUIDE_URL, RELEASES_URL } from "../../links";

type Asset = { name: string; browser_download_url: string };
type Release = { tag_name: string; prerelease: boolean; html_url: string; assets: Asset[] };
const command = "git clone https://github.com/ArkFlame/Kabocha.git && cd Kabocha && cargo build --release";

export default function Download() {
  const [channel, setChannel] = useState<"stable" | "nightly">("stable");
  const [releases, setReleases] = useState<Release[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let timeoutReached = false;
    const timeout = setTimeout(() => { timeoutReached = true; controller.abort(); }, 10000);
    setError(false); setReleases(null);
    fetch("https://api.github.com/repos/ArkFlame/Kabocha/releases", { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("Release request failed"); const data: unknown = await response.json(); if (!Array.isArray(data)) throw new Error("Invalid release response"); return data.filter((item): item is Release => typeof item === "object" && item !== null && typeof item.tag_name === "string" && typeof item.prerelease === "boolean" && typeof item.html_url === "string" && /^https:\/\/github\.com\/ArkFlame\/Kabocha\/releases\//.test(item.html_url) && Array.isArray(item.assets) && item.assets.every((asset: unknown) => typeof asset === "object" && asset !== null && "name" in asset && typeof asset.name === "string" && "browser_download_url" in asset && typeof asset.browser_download_url === "string")); })
      .then(setReleases).catch(() => { if (!controller.signal.aborted || timeoutReached) setError(true); });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  // Kabocha publishes every build as a pre-release, so Stable falls back to the newest release.
  const release = releases?.find(item => item.prerelease === (channel === "nightly")) ?? (channel === "stable" ? releases?.[0] : undefined);
  async function copy() { try { await navigator.clipboard.writeText(command); setCopied("Copied!"); } catch { setCopied("Copy failed; select the command instead."); } }
  return <div className="mx-auto max-w-325 px-5 py-14 md:px-8 md:py-20">
    <p className="font-mono text-xs tracking-wider text-pumpkin uppercase">Get started</p><h1 className="mt-4 text-[clamp(2.6rem,6vw,5rem)] leading-none font-extrabold">Download <span className="text-pumpkin">Kabocha</span>.</h1><p className="mt-5 max-w-2xl text-lg text-muted">Choose a release or build Kabocha from source.</p>
    <section className="mt-12 border-3 border-pumpkin bg-surface p-6 md:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-3xl font-extrabold">Choose your release</h2><fieldset className="flex border-2 border-white/20"><legend className="sr-only">Release channel</legend>{(["stable", "nightly"] as const).map(value => <label key={value} className={`cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-pumpkin px-4 py-2 font-mono text-sm ${channel === value ? "bg-fg text-black" : "text-muted"}`}><input className="sr-only" type="radio" name="channel" checked={channel === value} onChange={() => setChannel(value)} />{value === "stable" ? "Stable" : "Nightly"}</label>)}</fieldset></div>
      <p className="mt-6 text-xl font-bold" aria-live="polite">{error ? "Could not load releases" : releases === null ? "Loading releases…" : release ? release.tag_name : `No ${channel} releases available`}</p><p className="mt-2 text-muted">{release ? "Published on GitHub" : "Build from source or check GitHub for updates."}</p><div className="mt-6 flex flex-wrap gap-3"><a className="border-2 border-pumpkin bg-pumpkin px-5 py-3 font-bold text-black" href={release?.html_url || RELEASES_URL}> {release ? "View release" : "View releases"} →</a>{error && <button className="border-2 border-white/20 px-5 py-3" onClick={() => setAttempt(n => n + 1)}>Retry</button>}</div></section>
    <section className="mt-12"><h2 className="text-3xl font-extrabold">Linux quick start</h2><p className="mt-3 text-muted">Build from the Kabocha repository with Git and a stable Rust toolchain.</p><div className="mt-4 flex flex-wrap items-center gap-3 border-2 border-white/15 bg-surface p-4"><code className="min-w-0 flex-1 overflow-x-auto font-mono text-sm">{command}</code><button className="border-2 border-white/20 px-4 py-2 font-bold" onClick={copy}>Copy</button></div><p className="mt-2 text-sm text-muted" role="status">{copied}</p></section>
    <section className="mt-12"><h2 className="text-3xl font-extrabold">Download files</h2><p className="mt-3 text-muted">Assets for the selected {channel} release.</p><div className="mt-5 border-2 border-white/15">{release?.assets?.length ? release.assets.filter(asset => /^https:\/\/github\.com\/ArkFlame\/Kabocha\/releases\/download\//.test(asset.browser_download_url)).map(asset => <a key={asset.browser_download_url} href={asset.browser_download_url} className="block border-b border-white/15 p-4 font-mono text-pumpkin">{asset.name} ↓</a>) : <p className="p-5 text-muted">No release files available.</p>}</div></section>
    <section className="mt-12 grid gap-6 md:grid-cols-2"><div className="border-2 border-white/15 bg-surface p-6"><h2 className="text-2xl font-extrabold">Build from source</h2><p className="mt-3 text-muted">Install Rust and Git, then run the command above. Find the resulting binary in <code>target/release/</code>.</p><a className="mt-4 inline-block font-bold text-pumpkin" href={BUILD_GUIDE_URL}>Build guide →</a></div><div className="border-2 border-white/15 bg-surface p-6"><h2 className="text-2xl font-extrabold">After building</h2><ol className="mt-3 list-inside list-decimal space-y-2 text-muted"><li>Copy the binary to your server directory.</li><li>Run the server and review its configuration.</li><li>Consult the documentation before inviting players.</li></ol></div></section>
    <section className="mt-12 border-t-2 border-white/15 pt-6"><h2 className="text-2xl font-extrabold">Release notes &amp; older versions</h2><p className="mt-3 text-muted">Find published versions, assets and release notes on GitHub.</p><a className="mt-4 inline-block font-bold text-pumpkin" href={RELEASES_URL}>Browse releases →</a></section>
  </div>;
}
