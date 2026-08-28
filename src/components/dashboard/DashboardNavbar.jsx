import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  User,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const DashboardNavbar = ({
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  isLive,
  setIsLive,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("Production (Global)");
  const [showEnvMenu, setShowEnvMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Public API Latency Normalized",
      desc: "Response time stabilized back to 42ms in EU-West.",
      time: "4m ago",
      type: "success",
    },
    {
      id: 2,
      title: "SSL Certificate Auto-Renewed",
      desc: "Certificate for *.checkmate.io renewed for 90 days.",
      time: "28m ago",
      type: "info",
    },
    {
      id: 3,
      title: "Payment Webhook Degraded",
      desc: "Minor packet drops detected from Singapore edge node.",
      time: "2h ago",
      type: "warning",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-charcoal-800 bg-charcoal-950/90 px-3 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-8">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900 text-gray-300 hover:border-charcoal-700 hover:text-white transition-colors lg:hidden active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMobileSidebarOpen ? (
            <X className="h-5 w-5 text-primary" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white font-bold shadow-glow-blue transition-transform hover:scale-105">
            ✓
          </span>
          <span className="text-base sm:text-lg">
            Checkmate<span className="text-primary-dark">.</span>
          </span>
        </Link>

        {/* Environment Picker */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowEnvMenu(!showEnvMenu)}
            className="flex items-center gap-2 rounded-lg border border-charcoal-800 bg-charcoal-900/90 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-charcoal-700 hover:text-white"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span>{selectedEnv}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showEnvMenu && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl border border-charcoal-700 bg-charcoal-900 p-1.5 shadow-card z-50">
              {["Production (Global)", "Staging (US-East)", "Preview (EU-West)"].map((env) => (
                <button
                  key={env}
                  onClick={() => {
                    setSelectedEnv(env);
                    setShowEnvMenu(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    selectedEnv === env
                      ? "bg-primary-dark/20 text-primary"
                      : "text-gray-300 hover:bg-charcoal-800 hover:text-white"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      selectedEnv === env ? "bg-primary" : "bg-gray-500"
                    }`}
                  />
                  {env}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Search Bar (Desktop) */}
      <div className="mx-4 flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monitors, endpoints, HTTP status or tags..."
            className="w-full rounded-xl border border-charcoal-800 bg-charcoal-900/90 py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-accent-blue focus:bg-charcoal-900 focus:shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900/80 text-gray-300 transition-colors hover:border-charcoal-700 md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Live Pulse Toggle */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 sm:px-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
            isLive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-charcoal-800 bg-charcoal-900/60 text-gray-400"
          }`}
          title={isLive ? "Live updates active (pings every 3s)" : "Live polling paused"}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isLive ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
            }`}
          />
          <span className="hidden sm:inline">{isLive ? "LIVE SYNC" : "PAUSED"}</span>
        </button>

        {/* Add Monitor Primary CTA */}
        <button
          onClick={onOpenAddModal}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary-dark px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white shadow-glow-blue transition-all hover:bg-primary hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="hidden xs:inline sm:inline">New Monitor</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900/80 text-gray-300 transition-colors hover:border-charcoal-700 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-3 shadow-card z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  System Alerts
                </span>
                <span className="text-[11px] text-gray-400">3 unread</span>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl border border-charcoal-800/80 bg-charcoal-950/60 p-2.5 transition-colors hover:border-charcoal-700"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <span className="text-[10px] text-gray-500">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 border-t border-charcoal-800 pt-2 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-charcoal-800 bg-charcoal-900/80 p-1.5 pl-2 transition-colors hover:border-charcoal-700"
          >
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-tr from-primary-dark to-primary text-xs font-bold text-white">
              S
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-card z-50">
              <div className="border-b border-charcoal-800 px-3 py-2">
                <p className="text-xs font-bold text-white">Sarah Johnson</p>
                <p className="text-[11px] text-gray-400">sarah@checkmate.io</p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Pro Plan · Active
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-charcoal-800 hover:text-white"
                >
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-charcoal-800 hover:text-white"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                  Security & API Keys
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-charcoal-800 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                  Public Status Page
                </button>
              </div>

              <div className="border-t border-charcoal-800 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute left-0 top-16 w-full border-b border-charcoal-800 bg-charcoal-950 p-3 md:hidden z-40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monitors, endpoints, status..."
              className="w-full rounded-xl border border-charcoal-800 bg-charcoal-900 py-2.5 pl-9 pr-9 text-xs text-white placeholder-gray-500 outline-none focus:border-accent-blue"
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setShowMobileSearch(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
