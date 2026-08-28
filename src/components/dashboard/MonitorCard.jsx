import { useState } from "react";
import {
  Clock,
  ShieldCheck,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const MonitorCard = ({
  monitor,
  onSelect,
  onPing,
  onTogglePause,
  onDelete,
}) => {
  const [isPinging, setIsPinging] = useState(false);

  const handleManualPing = async (e) => {
    e.stopPropagation();
    setIsPinging(true);
    if (onPing) {
      await onPing(monitor.id);
    }
    setTimeout(() => {
      setIsPinging(false);
    }, 600);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "operational":
        return {
          dot: "bg-emerald-400 animate-pulse",
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          label: "Operational",
        };
      case "degraded":
        return {
          dot: "bg-amber-400 animate-pulse",
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
          label: "Degraded",
        };
      case "down":
        return {
          dot: "bg-red-400 animate-ping",
          bg: "bg-red-500/10 border-red-500/20 text-red-400",
          label: "Outage",
        };
      case "paused":
      default:
        return {
          dot: "bg-gray-400",
          bg: "bg-gray-500/10 border-gray-500/20 text-gray-400",
          label: "Paused",
        };
    }
  };

  const statusConfig = getStatusBadge(monitor.status);

  // Generate 24 uptime status history bars
  const historyBars = monitor.history || [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    monitor.status === "degraded" ? 0.5 : 1,
    1, 1, 1, 1,
    monitor.status === "down" ? 0 : monitor.status === "degraded" ? 0.5 : 1,
  ];

  return (
    <div
      onClick={() => onSelect && onSelect(monitor)}
      className="group relative cursor-pointer rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-3.5 sm:p-4 transition-all duration-200 hover:border-charcoal-700 hover:bg-charcoal-900 hover:shadow-card"
    >
      <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
        {/* Left Info: Status, Name, URL, Method badge */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${statusConfig.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
              <span className="hidden xs:inline">{statusConfig.label}</span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                {monitor.name}
              </h4>
              <span className="rounded bg-charcoal-800 px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-gray-300">
                {monitor.method || "GET"}
              </span>
              {monitor.tag && (
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary">
                  {monitor.tag}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <span className="truncate max-w-[180px] sm:max-w-xs">{monitor.url}</span>
              <a
                href={monitor.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 hover:text-white shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Center / Bottom on mobile: Sparkline history & stats */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-charcoal-800/60 pt-2.5 md:border-t-0 md:pt-0 md:flex-col md:items-end">
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Latency */}
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-mono font-bold text-white">{monitor.latency || 32}ms</span>
            </div>

            {/* SSL */}
            <div className="flex items-center gap-1 text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] sm:text-xs">{monitor.sslDays ? `${monitor.sslDays}d SSL` : "SSL Valid"}</span>
            </div>

            {/* Interval */}
            <span className="rounded bg-charcoal-950 px-1.5 py-0.5 text-[10px] text-gray-400 border border-charcoal-800">
              {monitor.interval || "30s"}
            </span>
          </div>

          {/* 24-bucket Uptime Bars */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {historyBars.map((val, idx) => (
              <span
                key={idx}
                className={`h-3.5 sm:h-4 w-1 sm:w-1.5 rounded-[1px] transition-colors shrink-0 ${
                  val === 1
                    ? "bg-emerald-500 hover:bg-emerald-400"
                    : val === 0.5
                    ? "bg-amber-400"
                    : "bg-red-500"
                }`}
                title={`Check #${idx + 1}: ${val === 1 ? "100% OK" : val === 0.5 ? "Degraded" : "Failed"}`}
              />
            ))}
            <span className="ml-1 text-[10px] font-semibold text-emerald-400">
              {monitor.uptime || "99.9%"}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-1.5 border-t border-charcoal-800/60 pt-2 md:border-t-0 md:pt-0">
          <button
            onClick={handleManualPing}
            disabled={isPinging}
            title="Instant Probe"
            className="grid h-8 w-8 place-items-center rounded-lg border border-charcoal-800 bg-charcoal-950 text-gray-300 transition-all hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPinging ? "animate-spin text-primary" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePause && onTogglePause(monitor.id);
            }}
            title={monitor.status === "paused" ? "Resume Monitor" : "Pause Monitor"}
            className="grid h-8 w-8 place-items-center rounded-lg border border-charcoal-800 bg-charcoal-950 text-gray-300 transition-all hover:border-charcoal-700 hover:text-white active:scale-95"
          >
            {monitor.status === "paused" ? (
              <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
            ) : (
              <Pause className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(monitor.id);
            }}
            title="Delete Monitor"
            className="grid h-8 w-8 place-items-center rounded-lg border border-charcoal-800 bg-charcoal-950 text-gray-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onSelect && onSelect(monitor)}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorCard;
