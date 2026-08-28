import { useState } from "react";

const ResponseTimeChart = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 24 data points representing hourly avg latency in ms
  const data24h = [
    { time: "00:00", latency: 38, requests: 1240 },
    { time: "01:00", latency: 35, requests: 980 },
    { time: "02:00", latency: 34, requests: 720 },
    { time: "03:00", latency: 32, requests: 640 },
    { time: "04:00", latency: 36, requests: 810 },
    { time: "05:00", latency: 42, requests: 1100 },
    { time: "06:00", latency: 48, requests: 1950 },
    { time: "07:00", latency: 55, requests: 3400 },
    { time: "08:00", latency: 68, requests: 5200 },
    { time: "09:00", latency: 74, requests: 7800 },
    { time: "10:00", latency: 62, requests: 8400 },
    { time: "11:00", latency: 58, requests: 9200 },
    { time: "12:00", latency: 64, requests: 8900 },
    { time: "13:00", latency: 59, requests: 8600 },
    { time: "14:00", latency: 71, requests: 9400 },
    { time: "15:00", latency: 82, requests: 10200 },
    { time: "16:00", latency: 65, requests: 9800 },
    { time: "17:00", latency: 52, requests: 8100 },
    { time: "18:00", latency: 45, requests: 6900 },
    { time: "19:00", latency: 42, requests: 5800 },
    { time: "20:00", latency: 39, requests: 4600 },
    { time: "21:00", latency: 37, requests: 3800 },
    { time: "22:00", latency: 36, requests: 2900 },
    { time: "23:00", latency: 35, requests: 1800 },
  ];

  const maxLatency = Math.max(...data24h.map((d) => d.latency), 100);
  const minLatency = Math.min(...data24h.map((d) => d.latency));
  const avgLatency = Math.round(
    data24h.reduce((acc, d) => acc + d.latency, 0) / data24h.length
  );

  return (
    <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4 sm:p-5 shadow-card backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Performance telemetry
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Optimal (p95: 72ms)
            </span>
          </div>
          <h3 className="mt-1 text-sm sm:text-base font-bold text-white">
            Aggregated Endpoint Latency
          </h3>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-charcoal-800 bg-charcoal-950 p-1 self-start sm:self-auto">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                timeRange === range
                  ? "bg-primary-dark text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Latency Stats bar */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-charcoal-800/80 py-2.5 text-xs text-gray-400">
        <div>
          <span>Avg Latency: </span>
          <span className="font-bold text-white">{avgLatency} ms</span>
        </div>
        <div>
          <span>Fastest: </span>
          <span className="font-bold text-emerald-400">{minLatency} ms</span>
        </div>
        <div>
          <span>Peak: </span>
          <span className="font-bold text-amber-400">{maxLatency} ms</span>
        </div>
        <div className="ml-auto hidden md:block">
          <span className="text-emerald-400 font-medium">99.98% Total Uptime SLA</span>
        </div>
      </div>

      {/* Interactive Chart Bars */}
      <div className="mt-6 overflow-x-auto pb-1 scrollbar-none">
        <div className="relative flex h-32 sm:h-36 min-w-[320px] items-end gap-1 sm:gap-2">
          {data24h.map((point) => {
            const heightPercent = (point.latency / maxLatency) * 100;
            const isPeak = point.latency === maxLatency;
            const isHovered = hoveredPoint?.time === point.time;

            return (
              <div
                key={point.time}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="group relative flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
              >
                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all duration-200 ${
                    isPeak
                      ? "bg-primary-dark shadow-[0_0_10px_rgba(234,88,12,0.6)]"
                      : isHovered
                      ? "bg-accent-blue"
                      : "bg-charcoal-700 hover:bg-primary"
                  }`}
                />

                {/* Micro tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 whitespace-nowrap rounded-xl border border-charcoal-700 bg-charcoal-950 px-2.5 py-1.5 text-center shadow-card pointer-events-none">
                    <p className="text-[10px] font-semibold text-gray-400">{point.time}</p>
                    <p className="text-xs font-bold text-white">
                      {point.latency} ms <span className="text-[10px] text-gray-400">({point.requests} reqs)</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis labels */}
        <div className="mt-2 flex justify-between text-[10px] text-gray-500 font-mono min-w-[320px]">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:59</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeChart;
