import { useState, useEffect } from "react";
import {
  Globe,
  RefreshCw,
  Terminal,
  Bell,
} from "lucide-react";

const WorkspacePulsePanel = ({
  isLive,
  onSimulateCheck,
}) => {
  const [pulseBars, setPulseBars] = useState([
    42, 58, 45, 68, 60, 75, 64, 88, 82, 95, 78, 90, 85, 96,
  ]);

  const [edgeNodes, setEdgeNodes] = useState([
    { region: "US-East (N. Virginia)", code: "IAD", ping: 24, status: "Optimal" },
    { region: "EU-Central (Frankfurt)", code: "FRA", ping: 38, status: "Optimal" },
    { region: "AP-East (Tokyo)", code: "NRT", ping: 98, status: "Optimal" },
    { region: "SA-East (São Paulo)", code: "GRU", ping: 138, status: "Normal" },
  ]);

  const [liveLogs, setLiveLogs] = useState([
    {
      id: "log-1",
      time: "Just now",
      service: "Authentication Gateway",
      event: "HTTP 200 OK",
      latency: "34ms",
      type: "success",
    },
    {
      id: "log-2",
      time: "12s ago",
      service: "Primary Postgres Cluster",
      event: "TCP Handshake 0.04ms",
      latency: "18ms",
      type: "success",
    },
    {
      id: "log-3",
      time: "35s ago",
      service: "Stripe Webhook Listener",
      event: "SSL Handshake TLS 1.3",
      latency: "42ms",
      type: "info",
    },
    {
      id: "log-4",
      time: "1m ago",
      service: "Search Indexer (ES)",
      event: "Health check 200 OK",
      latency: "56ms",
      type: "success",
    },
  ]);

  // Live dynamic tick for pulse bars and random ping jitter
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Shift pulse bars with subtle natural jitter
      setPulseBars((prev) => {
        const next = [...prev.slice(1)];
        const randomVal = Math.floor(45 + Math.random() * 52);
        next.push(randomVal);
        return next;
      });

      // Subtle edge node ping updates
      setEdgeNodes((prev) =>
        prev.map((node) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...node,
            ping: Math.max(12, node.ping + delta),
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLive]);

  const triggerQuickProbe = () => {
    if (onSimulateCheck) {
      onSimulateCheck();
    }
    const newLog = {
      id: "log-" + Date.now(),
      time: "Just now",
      service: "Global Edge Probe",
      event: "HTTP 200 OK (Multi-region)",
      latency: Math.floor(25 + Math.random() * 20) + "ms",
      type: "success",
    };
    setLiveLogs((prev) => [newLog, ...prev.slice(0, 5)]);
  };

  return (
    <aside className="w-80 xl:w-88 flex-shrink-0 flex-col gap-5 border-l border-charcoal-800 bg-charcoal-950/90 p-4 text-white overflow-y-auto hidden lg:flex h-[calc(100vh-4rem)]">
      {/* Background glow accent matching Login/SignUp */}
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />

      {/* Header */}
      <div className="relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark">
          WORKSPACE TELEMETRY
        </p>
        <h2 className="mt-1 text-base font-bold text-white flex items-center justify-between">
          <span>Realtime Pulse</span>
          <button
            onClick={triggerQuickProbe}
            className="flex items-center gap-1 rounded-lg border border-charcoal-800 bg-charcoal-900 px-2 py-1 text-[11px] font-medium text-gray-300 hover:border-primary/50 hover:text-primary transition-all active:scale-95"
            title="Trigger instant multi-region ping"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Probe</span>
          </button>
        </h2>
      </div>

      {/* 1. Live Pulse Wave Card - Same as Login & SignUp Pages */}
      <div className="relative rounded-2xl border border-charcoal-700/90 bg-charcoal-900/90 p-4.5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-200">
              Workspace pulse
            </span>
            <p className="text-[10px] text-gray-400">Aggregated system heartbeat</p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400">
              Steady
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Bar Wave */}
        <div className="mt-5 flex h-14 items-end gap-1.5">
          {pulseBars.map((height, index) => (
            <div
              key={index}
              style={{ height: `${height}%` }}
              className={`flex-1 rounded-sm transition-all duration-500 ${
                index >= pulseBars.length - 4
                  ? "bg-primary-dark shadow-[0_0_8px_rgba(234,88,12,0.4)]"
                  : index >= pulseBars.length - 8
                  ? "bg-primary/80"
                  : "bg-charcoal-700"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-gray-400 border-t border-charcoal-800/80 pt-2">
          <span>Global Latency Avg</span>
          <span className="font-bold text-white">38.4 ms</span>
        </div>
      </div>

      {/* 2. Global Edge Probes */}
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-accent-blue" />
            <span className="text-xs font-bold text-gray-200">Global Probes</span>
          </div>
          <span className="text-[10px] text-gray-400">4 of 4 Live</span>
        </div>

        <div className="mt-3 space-y-2">
          {edgeNodes.map((node) => (
            <div
              key={node.code}
              className="flex items-center justify-between rounded-xl bg-charcoal-950/80 px-3 py-2 border border-charcoal-800/50"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-primary">
                  {node.code}
                </span>
                <span className="text-[11px] text-gray-300 truncate max-w-[120px]">
                  {node.region.split(" ")[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-emerald-400">
                  {node.ping}ms
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Telemetry Event Stream */}
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4 flex-1 flex flex-col min-h-[220px]">
        <div className="flex items-center justify-between pb-2 border-b border-charcoal-800/80">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-gray-200">Live Telemetry</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
            Streaming
          </span>
        </div>

        <div className="mt-2.5 space-y-2 overflow-y-auto flex-1 pr-0.5">
          {liveLogs.map((log) => (
            <div
              key={log.id}
              className="group rounded-xl border border-charcoal-800/70 bg-charcoal-950/90 p-2.5 transition-all hover:border-charcoal-700"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-gray-400 truncate max-w-[130px]">
                  {log.service}
                </span>
                <span className="text-gray-500">{log.time}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-[11px] text-emerald-400 font-medium">
                  {log.event}
                </span>
                <span className="rounded bg-charcoal-800 px-1.5 py-0.5 font-mono text-[10px] text-gray-300">
                  {log.latency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Alert Channels Health */}
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-gray-200 mb-2">
          <div className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-primary" />
            <span>Alert Channels</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400">3 Connected</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="rounded-lg bg-charcoal-950 p-1.5 border border-charcoal-800/80">
            <span className="block font-semibold text-gray-300">Slack</span>
            <span className="text-emerald-400 font-bold">● Active</span>
          </div>
          <div className="rounded-lg bg-charcoal-950 p-1.5 border border-charcoal-800/80">
            <span className="block font-semibold text-gray-300">Email</span>
            <span className="text-emerald-400 font-bold">● Active</span>
          </div>
          <div className="rounded-lg bg-charcoal-950 p-1.5 border border-charcoal-800/80">
            <span className="block font-semibold text-gray-300">Webhook</span>
            <span className="text-emerald-400 font-bold">● Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WorkspacePulsePanel;
