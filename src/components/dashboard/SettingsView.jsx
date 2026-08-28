import { useState } from "react";
import { User, Key, CheckCircle2, Save } from "lucide-react";

const SettingsView = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Workspace Configuration
          </span>
          <h2 className="mt-1 text-xl font-bold text-white">Settings & Security</h2>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-primary-dark px-4 py-2 text-xs font-bold text-white shadow-glow-blue hover:bg-primary transition-all active:scale-95"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? "Saved Changes!" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Organization Info */}
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Workspace Details</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Organization Name</label>
            <input
              type="text"
              defaultValue="Acme Labs Inc."
              className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Default Alert Email</label>
            <input
              type="email"
              defaultValue="admin@acmelabs.com"
              className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 px-3.5 py-2 text-xs text-white"
            />
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-5 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-accent-blue" />
            <span>REST API Keys</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300">Live API Key</label>
            <input
              type="password"
              readOnly
              value="chk_live_93847291840294810293481"
              className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 px-3.5 py-2 text-xs font-mono text-gray-400"
            />
          </div>

          <div className="pt-2">
            <button className="rounded-xl border border-charcoal-800 bg-charcoal-950 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors">
              Regenerate API Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
