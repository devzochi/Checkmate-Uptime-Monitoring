import { Bell } from "lucide-react";

export default function AlertsView() {
  return <div className="space-y-6">
    <div><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Notification Pipelines</span><h2 className="mt-1 text-xl font-bold text-white">Alerts</h2><p className="mt-2 text-sm text-gray-400">Alert operations are available through the confirmed backend alert endpoint.</p></div>
    <section className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card">
      <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl border border-charcoal-800 bg-charcoal-950 text-primary"><Bell className="h-5 w-5" /></div><div><p className="text-sm font-bold">Alert endpoint available</p><p className="mt-2 text-xs leading-5 text-gray-400">The live OpenAPI schema confirms GET and POST /api/alerts/alert/. It does not define a request or response body, so no alert form or fabricated fields are shown here.</p></div></div>
    </section>
  </div>;
}
