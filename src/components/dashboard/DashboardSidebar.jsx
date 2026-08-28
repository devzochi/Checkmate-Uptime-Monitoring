import {
  Activity,
  AlertTriangle,
  BarChart3,
  Globe,
  BellRing,
  Radio,
  FileCode2,
  Settings,
  HelpCircle,
  Zap,
  X,
} from "lucide-react";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  monitorStats,
  isOpen = false,
  onClose,
}) => {
  const mainNav = [
    {
      id: "monitors",
      label: "Monitors",
      icon: Activity,
      badge: monitorStats?.total || 24,
      badgeColor: "bg-charcoal-800 text-gray-300",
    },
    {
      id: "incidents",
      label: "Incidents & Logs",
      icon: AlertTriangle,
      badge: monitorStats?.incidents > 0 ? monitorStats.incidents : null,
      badgeColor: "bg-red-500/20 text-red-400 font-bold",
    },
    {
      id: "analytics",
      label: "Metrics & Latency",
      icon: BarChart3,
    },
    {
      id: "probes",
      label: "Global Probes",
      icon: Globe,
      badge: "4 Nodes",
      badgeColor: "bg-primary/10 text-primary text-[10px]",
    },
    {
      id: "alerts",
      label: "Alert Channels",
      icon: BellRing,
    },
    {
      id: "status-page",
      label: "Status Pages",
      icon: Radio,
    },
  ];

  const secondaryNav = [
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
    {
      id: "api-docs",
      label: "API & Webhooks",
      icon: FileCode2,
    },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col justify-between border-r border-charcoal-800 bg-charcoal-950 p-4 text-white transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-[calc(100vh-4rem)] lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Section */}
        <div className="space-y-5 overflow-y-auto">
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-charcoal-800">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white font-bold text-xs">
                ✓
              </span>
              <span className="font-bold text-white text-sm">Navigation</span>
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg border border-charcoal-800 bg-charcoal-900 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Workspace summary pill */}
          <div className="rounded-xl border border-charcoal-800/80 bg-charcoal-900/60 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-gray-200">
                  Core Systems
                </span>
              </div>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                100% Operational
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
              <span>Uptime (30d)</span>
              <span className="font-semibold text-white">99.98%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-charcoal-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary"
                style={{ width: "99.9%" }}
              />
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark">
              WORKSPACE
            </p>

            <nav className="mt-2 space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-glow-blue"
                        : "text-gray-400 hover:bg-charcoal-900 hover:text-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] ${
                          isActive
                            ? "bg-black/20 text-white font-bold"
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
              PREFERENCES
            </p>

            <nav className="mt-2 space-y-1">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-glow-blue"
                        : "text-gray-400 hover:bg-charcoal-900 hover:text-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Pro Quota & Support Card */}
        <div className="space-y-3 pt-3">
          <div className="relative overflow-hidden rounded-2xl border border-charcoal-700/80 bg-gradient-to-b from-charcoal-900 to-charcoal-950 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span>Pro Plan</span>
              </div>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                18 / 25 Used
              </span>
            </div>

            <div className="mt-2 text-[11px] text-gray-400">
              30s check frequency · 5 global regions
            </div>

            <div className="mt-3">
              <button
                onClick={() => handleTabClick("settings")}
                className="w-full rounded-lg border border-primary-dark/50 bg-primary-dark/10 py-1.5 text-center text-xs font-semibold text-primary transition-all hover:bg-primary-dark/20 hover:text-white"
              >
                Manage Quota
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-gray-500">
            <span>v2.4.1 (Latest)</span>
            <a
              href="https://checkmatemonitor.duckdns.org/api/docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <HelpCircle className="h-3 w-3" />
              Support
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
