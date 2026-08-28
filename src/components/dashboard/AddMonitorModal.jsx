import { useState } from "react";
import {
  X,
  Plus,
  Loader2,
} from "lucide-react";

const AddMonitorModal = ({ isOpen, onClose, onAddMonitor }) => {
  const [form, setForm] = useState({
    name: "",
    url: "",
    method: "GET",
    interval: "30s",
    tag: "API",
    alertThreshold: "2",
    timeout: "5000",
    regions: ["US-East", "EU-Central"],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.url.trim()) {
      setError("Please provide both a monitor name and a valid URL endpoint.");
      return;
    }

    if (!form.url.startsWith("http://") && !form.url.startsWith("https://")) {
      setError("URL must begin with http:// or https://");
      return;
    }

    setLoading(true);

    try {
      const newMonitor = {
        id: "mon-" + Date.now(),
        name: form.name.trim(),
        url: form.url.trim(),
        method: form.method,
        interval: form.interval,
        tag: form.tag,
        status: "operational",
        latency: Math.floor(20 + Math.random() * 35),
        uptime: "100%",
        sslDays: 89,
        createdAt: new Date().toISOString(),
        history: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      };

      if (onAddMonitor) {
        await onAddMonitor(newMonitor);
      }

      onClose();
    } catch {
      setError("Failed to create monitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRegion = (region) => {
    setForm((prev) => {
      const exists = prev.regions.includes(region);
      return {
        ...prev,
        regions: exists
          ? prev.regions.filter((r) => r !== region)
          : [...prev.regions, region],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-charcoal-700 bg-charcoal-950 p-6 text-white shadow-card z-10">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-36 w-60 rounded-full bg-primary/20 blur-[80px]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              NEW SERVICE PROBE
            </span>
            <h3 className="mt-0.5 text-xl font-bold">Add Endpoint Monitor</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900 text-gray-400 hover:border-charcoal-700 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Monitor Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Service / Monitor Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Production Billing API"
              className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-accent-blue focus:shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            />
          </div>

          {/* URL & Method */}
          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Target URL & HTTP Protocol
            </label>
            <div className="mt-1 flex gap-2">
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-24 rounded-xl border border-charcoal-800 bg-charcoal-900 px-2.5 py-2.5 text-xs font-bold text-primary outline-none focus:border-accent-blue"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
              </select>

              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://api.example.com/health"
                className="flex-1 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-accent-blue focus:shadow-[0_0_12px_rgba(56,189,248,0.2)]"
              />
            </div>
          </div>

          {/* Interval and Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300">
                Check Frequency
              </label>
              <select
                value={form.interval}
                onChange={(e) => setForm({ ...form, interval: e.target.value })}
                className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-900 px-3 py-2.5 text-xs text-white outline-none focus:border-accent-blue"
              >
                <option value="15s">Every 15 seconds (High SLA)</option>
                <option value="30s">Every 30 seconds (Default)</option>
                <option value="60s">Every 1 minute</option>
                <option value="5m">Every 5 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300">
                Category Tag
              </label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-900 px-3 py-2.5 text-xs text-white outline-none focus:border-accent-blue"
              >
                <option value="API">API</option>
                <option value="Database">Database</option>
                <option value="Auth">Auth</option>
                <option value="Web">Web</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
          </div>

          {/* Edge Probe Regions */}
          <div>
            <label className="block text-xs font-semibold text-gray-300">
              Probing Edge Stations
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {[
                { name: "US-East (N. Virginia)", id: "US-East" },
                { name: "EU-Central (Frankfurt)", id: "EU-Central" },
                { name: "AP-East (Tokyo)", id: "AP-East" },
                { name: "SA-East (São Paulo)", id: "SA-East" },
              ].map((r) => {
                const isSelected = form.regions.includes(r.id);
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => toggleRegion(r.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "border-primary/60 bg-primary/10 text-white font-semibold"
                        : "border-charcoal-800 bg-charcoal-900/60 text-gray-400 hover:border-charcoal-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? "bg-primary" : "bg-charcoal-700"
                      }`}
                    />
                    <span className="truncate">{r.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-charcoal-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-charcoal-800 bg-charcoal-900 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:border-charcoal-700 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-primary-dark px-5 py-2.5 text-xs font-bold text-white shadow-glow-blue hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating probe...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Deploy Monitor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMonitorModal;
