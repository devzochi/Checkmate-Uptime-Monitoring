import { Globe, CheckCircle2 } from "lucide-react";

const ProbesView = () => {
  const probeNodes = [
    {
      name: "North America East",
      city: "Northern Virginia, US",
      code: "us-east-1",
      ip: "54.210.84.12",
      status: "Online",
      ping: "22 ms",
      uptime: "100%",
      checks24h: "28,800",
    },
    {
      name: "Europe Central",
      city: "Frankfurt, Germany",
      code: "eu-central-1",
      ip: "3.120.44.89",
      status: "Online",
      ping: "38 ms",
      uptime: "99.98%",
      checks24h: "28,800",
    },
    {
      name: "Asia Pacific East",
      city: "Tokyo, Japan",
      code: "ap-northeast-1",
      ip: "13.230.12.94",
      status: "Online",
      ping: "98 ms",
      uptime: "99.99%",
      checks24h: "28,800",
    },
    {
      name: "South America East",
      city: "São Paulo, Brazil",
      code: "sa-east-1",
      ip: "18.228.45.10",
      status: "Online",
      ping: "138 ms",
      uptime: "99.95%",
      checks24h: "28,800",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Edge Infrastructure
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">Global Probing Stations</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          4 of 4 Nodes Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {probeNodes.map((node) => (
          <div
            key={node.code}
            className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card hover:border-charcoal-700 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-charcoal-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-charcoal-950 border border-charcoal-800 text-primary">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{node.name}</h3>
                  <p className="text-[11px] text-gray-400">{node.city}</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                {node.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-charcoal-950 p-2 border border-charcoal-800/60">
                <span className="text-[10px] text-gray-500 block">Avg Ping</span>
                <span className="font-mono font-bold text-emerald-400">{node.ping}</span>
              </div>
              <div className="rounded-xl bg-charcoal-950 p-2 border border-charcoal-800/60">
                <span className="text-[10px] text-gray-500 block">Node Uptime</span>
                <span className="font-mono font-bold text-white">{node.uptime}</span>
              </div>
              <div className="rounded-xl bg-charcoal-950 p-2 border border-charcoal-800/60">
                <span className="text-[10px] text-gray-500 block">Checks (24h)</span>
                <span className="font-mono font-bold text-primary">{node.checks24h}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>Station IP: {node.ip}</span>
              <span>Code: {node.code}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProbesView;
