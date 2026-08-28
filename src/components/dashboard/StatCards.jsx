import {
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const StatCards = ({ monitors = [] }) => {
  const total = monitors.length;
  const operational = monitors.filter((m) => m.status === "operational").length;
  const degraded = monitors.filter((m) => m.status === "degraded").length;
  const down = monitors.filter((m) => m.status === "down").length;

  const avgLatency = monitors.length
    ? Math.round(
        monitors.reduce((acc, m) => acc + (m.latency || 40), 0) /
          monitors.length
      )
    : 42;

  const cards = [
    {
      id: "uptime",
      label: "Global Uptime",
      value: "99.98%",
      subtext: "+0.02% vs last 30 days",
      trend: "up",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      accentBorder: "hover:border-emerald-500/40",
    },
    {
      id: "latency",
      label: "Average Response Time",
      value: `${avgLatency} ms`,
      subtext: "12ms faster than SLA threshold",
      trend: "up",
      icon: Clock,
      iconColor: "text-accent-blue",
      iconBg: "bg-sky-500/10",
      accentBorder: "hover:border-accent-blue/40",
    },
    {
      id: "operational",
      label: "Active Endpoints",
      value: `${operational} / ${total}`,
      subtext: degraded > 0 ? `${degraded} degraded, 0 down` : "All systems operational",
      trend: degraded > 0 ? "warning" : "up",
      icon: Activity,
      iconColor: degraded > 0 ? "text-amber-400" : "text-primary",
      iconBg: degraded > 0 ? "bg-amber-500/10" : "bg-primary/10",
      accentBorder: "hover:border-primary/40",
    },
    {
      id: "incidents",
      label: "Active Incidents",
      value: `${down}`,
      subtext: "0 outages in past 72 hours",
      trend: "up",
      icon: AlertTriangle,
      iconColor: down > 0 ? "text-red-400" : "text-emerald-400",
      iconBg: down > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
      accentBorder: down > 0 ? "hover:border-red-500/40" : "hover:border-emerald-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4.5 backdrop-blur-sm transition-all duration-200 ${card.accentBorder} hover:bg-charcoal-900 shadow-sm hover:shadow-card`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">
                {card.label}
              </span>
              <div className={`grid h-8 w-8 place-items-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">
                {card.value}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
              {card.trend === "up" && (
                <span className="flex items-center text-emerald-400 font-semibold">
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                </span>
              )}
              {card.trend === "warning" && (
                <span className="flex items-center text-amber-400 font-semibold">
                  <Activity className="mr-0.5 h-3 w-3" />
                </span>
              )}
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
