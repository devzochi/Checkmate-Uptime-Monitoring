import { Download } from "lucide-react";
import ResponseTimeChart from "./ResponseTimeChart";

const AnalyticsView = () => {
  const regions = [
    { name: "US-East (N. Virginia)", ping: "24 ms", uptime: "99.99%", requests: "4.8M", status: "Optimal" },
    { name: "EU-Central (Frankfurt)", ping: "38 ms", uptime: "99.98%", requests: "3.2M", status: "Optimal" },
    { name: "AP-East (Tokyo)", ping: "98 ms", uptime: "99.95%", requests: "1.9M", status: "Optimal" },
    { name: "SA-East (São Paulo)", ping: "138 ms", uptime: "99.92%", requests: "840K", status: "Normal" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            SLA & Telemetry Metrics
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">
            Performance Analytics & Percentiles
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:border-charcoal-700 hover:text-white transition-colors">
            <Download className="h-3.5 w-3.5" />
            <span>Export SLA Report</span>
          </button>
        </div>
      </div>

      {/* SLA Percentiles Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400">p50 Latency (Median)</span>
          <p className="mt-1 text-2xl font-bold text-white font-mono">32 ms</p>
          <span className="text-[10px] text-emerald-400 font-semibold">● Ultra fast delivery</span>
        </div>

        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400">p90 Latency</span>
          <p className="mt-1 text-2xl font-bold text-sky-400 font-mono">58 ms</p>
          <span className="text-[10px] text-gray-400">Within target SLA</span>
        </div>

        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400">p99 Latency (Tail)</span>
          <p className="mt-1 text-2xl font-bold text-amber-400 font-mono">112 ms</p>
          <span className="text-[10px] text-gray-400">Peak load baseline</span>
        </div>

        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4">
          <span className="text-[10px] uppercase font-bold text-gray-400">Availability SLA</span>
          <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">99.98%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">● 100% Commitment met</span>
        </div>
      </div>

      {/* Main Historical Chart */}
      <ResponseTimeChart />

      {/* Regional Probing Table */}
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card">
        <h3 className="text-sm font-bold text-white mb-3">Global Edge Node Latency Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-800 text-gray-400 font-semibold">
                <th className="pb-2">Region</th>
                <th className="pb-2">Avg Ping</th>
                <th className="pb-2">Uptime</th>
                <th className="pb-2">Monthly Probes</th>
                <th className="pb-2">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800/60">
              {regions.map((reg) => (
                <tr key={reg.name} className="hover:bg-charcoal-800/30 transition-colors">
                  <td className="py-2.5 font-medium text-gray-200">{reg.name}</td>
                  <td className="py-2.5 font-mono font-bold text-emerald-400">{reg.ping}</td>
                  <td className="py-2.5 font-mono text-gray-300">{reg.uptime}</td>
                  <td className="py-2.5 font-mono text-gray-400">{reg.requests}</td>
                  <td className="py-2.5">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
