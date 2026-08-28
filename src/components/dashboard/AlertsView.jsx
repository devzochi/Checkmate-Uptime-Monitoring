import { useState } from "react";
import {
  Bell,
  Plus,
} from "lucide-react";

const AlertsView = () => {
  const [channels] = useState([
    {
      id: "ch-1",
      name: "Engineering Slack (#alerts-prod)",
      type: "Slack",
      target: "https://hooks.slack.com/services/T00/B00/XXXX",
      status: "Active",
      events: "Outages, Latency > 300ms, SSL Expiry",
    },
    {
      id: "ch-2",
      name: "On-Call PagerDuty Dispatch",
      type: "PagerDuty",
      target: "Integration Key: pd_live_89f0234a",
      status: "Active",
      events: "Critical Outages Only (P1)",
    },
    {
      id: "ch-3",
      name: "DevOps Core Team Email",
      type: "Email",
      target: "ops-team@checkmate.io",
      status: "Active",
      events: "Daily digest, Weekly SLA report, Outages",
    },
    {
      id: "ch-4",
      name: "Custom Webhook Endpoint",
      type: "Webhook",
      target: "https://api.internal.network/webhooks/checkmate",
      status: "Ready",
      events: "All Raw JSON Events",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Notification Pipelines
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">Alert Channels & Escalations</h2>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-glow-blue hover:bg-primary transition-all active:scale-95">
          <Plus className="h-4 w-4" />
          <span>Add Channel</span>
        </button>
      </div>

      <div className="space-y-3">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4 shadow-card hover:border-charcoal-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-charcoal-950 border border-charcoal-800 text-primary mt-0.5">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                  <span className="rounded bg-charcoal-800 px-2 py-0.5 font-mono text-[10px] font-bold text-gray-300">
                    {ch.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400 font-mono truncate max-w-sm">
                  {ch.target}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Triggers: <span className="text-gray-300">{ch.events}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                ● {ch.status}
              </span>
              <button className="rounded-lg border border-charcoal-800 bg-charcoal-950 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors">
                Test Ping
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsView;
