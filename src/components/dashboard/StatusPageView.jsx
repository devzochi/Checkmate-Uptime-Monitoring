import { useState } from "react";
import { ExternalLink, ShieldCheck, Copy, Check } from "lucide-react";

const StatusPageView = () => {
  const [copied, setCopied] = useState(false);
  const statusUrl = "https://status.checkmate.io/org/acme-labs";

  const handleCopy = () => {
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Public Transparency
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">Status Page Customizer</h2>
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-xl bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-glow-blue hover:bg-primary transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Preview Live Status Page</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Settings Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-white">Domain & Branding</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300">
                Public URL
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={statusUrl}
                  className="flex-1 rounded-xl border border-charcoal-800 bg-charcoal-950 px-3.5 py-2 text-xs text-gray-300 font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300">
                Page Title & Headline
              </label>
              <input
                type="text"
                defaultValue="Acme Labs Systems Status"
                className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between border-t border-charcoal-800 pt-3 text-xs">
              <span className="text-gray-300 font-medium">Custom CNAME Domain (e.g. status.yourdomain.com)</span>
              <span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-bold text-[10px]">
                Pro Feature · Active
              </span>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-950 p-4 shadow-card">
          <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Live Preview</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">status.acme.io</span>
          </div>

          <div className="mt-4 rounded-xl border border-charcoal-800/80 bg-charcoal-900/90 p-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              All Systems Operational
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              99.98% overall uptime across all services
            </p>
          </div>

          <div className="mt-3 space-y-2 text-[11px]">
            {["Public REST API", "Checkout Gateway", "Customer Dashboard"].map((name) => (
              <div key={name} className="flex justify-between items-center bg-charcoal-900/50 p-2 rounded-lg border border-charcoal-800/50">
                <span className="text-gray-300 font-medium">{name}</span>
                <span className="text-emerald-400 font-bold">Operational</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPageView;
