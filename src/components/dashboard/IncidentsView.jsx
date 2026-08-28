import { useState } from "react";
import {
  CheckCircle2,
  Clock,
} from "lucide-react";

const IncidentsView = () => {
  const [incidents] = useState([
    {
      id: "inc-1",
      title: "Elevated Latency on European Probing Region",
      status: "resolved",
      severity: "minor",
      service: "EU-Central Frankfurt Probe",
      startedAt: "Today at 09:14 AM",
      resolvedAt: "Today at 09:32 AM",
      duration: "18 mins",
      summary:
        "Transit provider fiber cut near Frankfurt caused intermittent +80ms latency spike. Traffic rerouted via Amsterdam edge automatically.",
    },
    {
      id: "inc-2",
      title: "Stripe Webhook Listener Re-indexing",
      status: "resolved",
      severity: "maintenance",
      service: "Payment Gateway Service",
      startedAt: "Yesterday at 02:00 AM",
      resolvedAt: "Yesterday at 02:22 AM",
      duration: "22 mins",
      summary:
        "Scheduled zero-downtime database migration and connection pool reload. All queued events processed successfully.",
    },
    {
      id: "inc-3",
      title: "Search Indexer Memory Pressure",
      status: "resolved",
      severity: "major",
      service: "Elasticsearch Cluster",
      startedAt: "3 days ago",
      resolvedAt: "3 days ago",
      duration: "45 mins",
      summary:
        "Garbage collection pause triggered temporary timeout alerts on bulk sync endpoint. Scaled worker pods from 4 to 8 instances.",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Incident Operations
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">
            Incidents & Outage Postmortems
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All Systems Normal
          </span>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card transition-colors hover:border-charcoal-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-charcoal-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    inc.severity === "major"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : inc.severity === "minor"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  }`}
                >
                  {inc.severity}
                </span>
                <h3 className="text-sm font-bold text-white">{inc.title}</h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Duration: {inc.duration}</span>
                <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 font-semibold text-[10px]">
                  Resolved
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-gray-300">
              {inc.summary}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
              <div>
                <span className="text-gray-500">Target Service: </span>
                <span className="font-semibold text-white">{inc.service}</span>
              </div>
              <div>
                <span className="text-gray-500">Started: </span>
                <span>{inc.startedAt}</span>
              </div>
              <div>
                <span className="text-gray-500">Resolved: </span>
                <span>{inc.resolvedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentsView;
