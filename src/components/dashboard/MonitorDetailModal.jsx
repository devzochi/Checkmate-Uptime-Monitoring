import { useState } from "react";
import {
  X,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Server,
} from "lucide-react";

const MonitorDetailModal = ({ monitor, onClose, onPing }) => {
  const [isPinging, setIsPinging] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!monitor) return null;

  const handleInstantProbe = async () => {
    setIsPinging(true);
    if (onPing) {
      await onPing(monitor.id);
    }
    setTimeout(() => {
      setIsPinging(false);
    }, 600);
  };

  // Mock network timing breakdown
  const timingBreakdown = [
    { label: "DNS Resolution", ms: 4, color: "bg-sky-400" },
    { label: "TCP Connection", ms: 8, color: "bg-emerald-400" },
    { label: "TLS Handshake", ms: 12, color: "bg-primary" },
    { label: "Server TTFB", ms: monitor.latency ? Math.max(8, monitor.latency - 24) : 18, color: "bg-amber-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Drawer */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-charcoal-700 bg-charcoal-950 p-6 text-white shadow-card z-10 max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 right-12 h-44 w-44 rounded-full bg-primary/20 blur-[90px]" />

        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-charcoal-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-charcoal-900 border border-charcoal-800 text-primary">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{monitor.name}</h3>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {monitor.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                <span>{monitor.url}</span>
                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstantProbe}
              disabled={isPinging}
              className="flex items-center gap-1.5 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? "animate-spin text-primary" : ""}`} />
              <span>Probe Now</span>
            </button>

            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900 text-gray-400 hover:border-charcoal-700 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex items-center gap-2 border-b border-charcoal-800 pb-2">
          {["overview", "network-timings", "ssl-certificate", "logs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-primary-dark text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="mt-4 space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Response Time</span>
                <p className="mt-1 text-lg font-bold text-white font-mono">{monitor.latency || 34} ms</p>
                <span className="text-[10px] text-emerald-400">● 99.8% within SLA</span>
              </div>

              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">30d Uptime</span>
                <p className="mt-1 text-lg font-bold text-emerald-400 font-mono">{monitor.uptime || "99.98%"}</p>
                <span className="text-[10px] text-gray-400">0 minutes outage</span>
              </div>

              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Check Interval</span>
                <p className="mt-1 text-lg font-bold text-white font-mono">{monitor.interval || "30s"}</p>
                <span className="text-[10px] text-gray-400">Multi-region polling</span>
              </div>

              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">SSL Expiry</span>
                <p className="mt-1 text-lg font-bold text-white font-mono">{monitor.sslDays || 84} days</p>
                <span className="text-[10px] text-emerald-400">Valid Certificate</span>
              </div>
            </div>

            {/* Timing Breakdown */}
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                <span>Latency Timing Breakdown</span>
                <span className="text-gray-400">Total: {monitor.latency || 38}ms</span>
              </div>

              <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-charcoal-800">
                {timingBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.ms / (monitor.latency || 40)) * 100}%` }}
                    title={`${item.label}: ${item.ms}ms`}
                  />
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-400">
                {timingBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span>{item.label}: </span>
                    <span className="font-bold text-white font-mono">{item.ms}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ssl-certificate" && (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">TLS 1.3 / X.509 Certificate</span>
                </div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                  Valid
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono text-gray-300">
                <div className="flex justify-between border-b border-charcoal-800/80 py-1.5">
                  <span className="text-gray-500">Common Name (CN):</span>
                  <span>*.checkmatemonitor.duckdns.org</span>
                </div>
                <div className="flex justify-between border-b border-charcoal-800/80 py-1.5">
                  <span className="text-gray-500">Issuer:</span>
                  <span>Let's Encrypt Authority R3</span>
                </div>
                <div className="flex justify-between border-b border-charcoal-800/80 py-1.5">
                  <span className="text-gray-500">Valid Until:</span>
                  <span className="text-emerald-400">Nov 14, 2026 ({monitor.sslDays || 89} days left)</span>
                </div>
                <div className="flex justify-between border-b border-charcoal-800/80 py-1.5">
                  <span className="text-gray-500">Cipher Suite:</span>
                  <span>TLS_AES_256_GCM_SHA384 (256-bit)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "network-timings" && (
          <div className="mt-4 rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Multi-Region Probing Matrix</h4>
            <div className="space-y-2">
              {[
                { node: "🇺🇸 US-East (N. Virginia)", ip: "54.210.84.12", ping: 24, status: "200 OK" },
                { node: "🇩🇪 EU-Central (Frankfurt)", ip: "3.120.44.89", ping: 38, status: "200 OK" },
                { node: "🇸🇬 AP-East (Tokyo)", ip: "13.230.12.94", ping: 98, status: "200 OK" },
                { node: "🇧🇷 SA-East (São Paulo)", ip: "18.228.45.10", ping: 138, status: "200 OK" },
              ].map((loc) => (
                <div key={loc.node} className="flex items-center justify-between rounded-xl bg-charcoal-950 p-2.5 border border-charcoal-800/80 text-xs">
                  <span className="font-semibold text-gray-200">{loc.node}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-400">{loc.ip}</span>
                    <span className="font-mono font-bold text-emerald-400">{loc.ping}ms</span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">{loc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="mt-4 rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4 space-y-2 max-h-60 overflow-y-auto">
            {[
              { time: "14:45:02", status: "200 OK", ms: "32ms", region: "US-East" },
              { time: "14:44:32", status: "200 OK", ms: "34ms", region: "EU-Central" },
              { time: "14:44:02", status: "200 OK", ms: "28ms", region: "US-East" },
              { time: "14:43:32", status: "200 OK", ms: "36ms", region: "AP-East" },
              { time: "14:43:02", status: "200 OK", ms: "31ms", region: "EU-Central" },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono border-b border-charcoal-800/60 py-1.5">
                <span className="text-gray-500">{log.time}</span>
                <span className="text-emerald-400 font-bold">{log.status}</span>
                <span className="text-gray-300">{log.ms}</span>
                <span className="text-primary">{log.region}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Close */}
        <div className="mt-6 flex justify-end border-t border-charcoal-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-charcoal-800 bg-charcoal-900 px-5 py-2 text-xs font-semibold text-gray-300 hover:border-charcoal-700 hover:text-white transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorDetailModal;
