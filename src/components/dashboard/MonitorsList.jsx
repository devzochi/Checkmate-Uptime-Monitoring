import { useState } from "react";
import MonitorCard from "./MonitorCard";
import {
  Activity,
  Plus,
} from "lucide-react";

const MonitorsList = ({
  monitors = [],
  searchQuery = "",
  onOpenAddModal,
  onSelectMonitor,
  onPingMonitor,
  onTogglePause,
  onDeleteMonitor,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Derive counts
  const countAll = monitors.length;
  const countOperational = monitors.filter((m) => m.status === "operational").length;
  const countDegraded = monitors.filter((m) => m.status === "degraded").length;
  const countDown = monitors.filter((m) => m.status === "down").length;
  const countPaused = monitors.filter((m) => m.status === "paused").length;

  const tags = ["all", "API", "Database", "Auth", "Web", "Payment"];

  // Filter monitors
  const filteredMonitors = monitors.filter((monitor) => {
    // Status filter
    if (activeFilter !== "all" && monitor.status !== activeFilter) {
      return false;
    }

    // Tag filter
    if (selectedTag !== "all" && monitor.tag !== selectedTag) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = monitor.name.toLowerCase().includes(q);
      const matchUrl = monitor.url.toLowerCase().includes(q);
      const matchTag = monitor.tag?.toLowerCase().includes(q);
      const matchStatus = monitor.status.toLowerCase().includes(q);
      if (!matchName && !matchUrl && !matchTag && !matchStatus) {
        return false;
      }
    }

    return true;
  });

  // Sort monitors
  const sortedMonitors = [...filteredMonitors].sort((a, b) => {
    if (sortBy === "latency") {
      return (a.latency || 0) - (b.latency || 0);
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "status") {
      const rank = { down: 0, degraded: 1, operational: 2, paused: 3 };
      return rank[a.status] - rank[b.status];
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Pills with responsive horizontal scrolling */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              activeFilter === "all"
                ? "bg-primary text-white shadow-glow-blue"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>All</span>
            <span className={`rounded-md px-1.5 py-0.2 text-[10px] ${activeFilter === "all" ? "bg-black/20" : "bg-charcoal-800"}`}>
              {countAll}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("operational")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              activeFilter === "operational"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-gray-400 hover:text-emerald-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Operational</span>
            <span className={`rounded-md px-1.5 py-0.2 text-[10px] ${activeFilter === "operational" ? "bg-black/20" : "bg-charcoal-800"}`}>
              {countOperational}
            </span>
          </button>

          {countDegraded > 0 && (
            <button
              onClick={() => setActiveFilter("degraded")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "degraded"
                  ? "bg-amber-500 text-black font-bold shadow-sm"
                  : "text-amber-400 hover:text-amber-300"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Degraded</span>
              <span className="rounded-md bg-amber-500/20 px-1.5 py-0.2 text-[10px]">
                {countDegraded}
              </span>
            </button>
          )}

          {countDown > 0 && (
            <button
              onClick={() => setActiveFilter("down")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "down"
                  ? "bg-red-500 text-white font-bold shadow-sm"
                  : "text-red-400 hover:text-red-300"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
              <span>Outages</span>
              <span className="rounded-md bg-red-500/20 px-1.5 py-0.2 text-[10px]">
                {countDown}
              </span>
            </button>
          )}

          {countPaused > 0 && (
            <button
              onClick={() => setActiveFilter("paused")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === "paused"
                  ? "bg-charcoal-700 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Paused</span>
              <span className="rounded-md bg-charcoal-800 px-1.5 py-0.2 text-[10px]">
                {countPaused}
              </span>
            </button>
          )}
        </div>

        {/* Right Sort & Tag Controls */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          {/* Tag Selector */}
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-0.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors capitalize shrink-0 ${
                  selectedTag === tag
                    ? "bg-charcoal-800 text-primary border border-primary/30"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort Menu */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-charcoal-800 bg-charcoal-900 px-2.5 py-1.5 text-xs font-medium text-gray-300 outline-none hover:border-charcoal-700 shrink-0"
          >
            <option value="default">Default Order</option>
            <option value="latency">Fastest Latency</option>
            <option value="name">Alphabetical</option>
            <option value="status">Status Priority</option>
          </select>
        </div>
      </div>

      {/* Monitor Cards List */}
      <div className="space-y-3">
        {sortedMonitors.length > 0 ? (
          sortedMonitors.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onSelect={onSelectMonitor}
              onPing={onPingMonitor}
              onTogglePause={onTogglePause}
              onDelete={onDeleteMonitor}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-800 bg-charcoal-900/40 p-8 sm:p-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-charcoal-800/80 text-gray-400">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">No monitors found</h3>
            <p className="mt-1 text-xs text-gray-400 max-w-sm">
              {searchQuery
                ? `No monitors match your search "${searchQuery}". Try clearing filters.`
                : "Get started by adding your first service endpoint to monitor uptime."}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-5 flex items-center gap-2 rounded-xl bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-glow-blue hover:bg-primary transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Create First Monitor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorsList;
