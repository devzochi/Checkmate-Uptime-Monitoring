/* eslint-disable react-hooks/static-components, react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bot,
  ChevronRight,
  Clock3,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  createService,
  deleteService,
  getIncidents,
  getResponseTime,
  getServices,
  getUptime,
  updateService,
} from "../../services/monitor";
import {
  getAutoheals,
  getDeployments,
  getOrganization,
  getOrganizationMembers,
  triggerDeployment,
} from "../../services/platform";
import AlertsView from "../../components/dashboard/AlertsView";

const toList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["results", "services", "items", "data", "records"]) {
    if (Array.isArray(value[key])) return value[key];
  }
  // Some deployments return one resource rather than a collection envelope.
  if (value.id !== undefined && (value.name !== undefined || value.url !== undefined)) {
    return [value];
  }
  return [];
};
const displayError = (error) => {
  const body = error.response?.data;
  const status = error.response?.status;
  const contentType = error.response?.headers?.["content-type"] || "";
  if (status === 401) return "Your session is missing or expired. Please sign in again.";
  if (status === 403) return "Your account is not allowed to access this workspace.";
  if (status === 404) return "The requested CheckMate resource was not found.";
  if (status >= 500 || contentType.includes("text/html")) {
    return `The CheckMate backend returned an internal server error (${status || "unknown"}). The service list cannot load until the backend exception is fixed.`;
  }
  if (!error.response && error.request) return "The CheckMate API could not be reached. Check your network connection and try again.";
  if (body?.detail) return body.detail;
  if (body && typeof body === "object") {
    const messages = Object.entries(body)
      .flatMap(([field, values]) => (Array.isArray(values) ? values : [values]).map((value) => `${field}: ${value}`))
      .filter(Boolean);
    if (messages.length) return messages.join(" ");
  }
  return error.message === "Network Error"
    ? "Could not reach CheckMate. Please try again."
    : "Something went wrong. Please try again.";
};
const toMonitor = (service) => ({
  ...service,
  protocol: service.url?.startsWith("https://") ? "HTTPS" : "HTTP",
  status: service.health || (service.is_active ? "Operational" : "Unavailable"),
});
const formatPercent = (value) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "—";
const formatLatency = (value) =>
  typeof value === "number" ? `${Math.round(value)} ms` : "—";
const getOrganizationId = (value) => {
  const record = Array.isArray(value)
    ? value[0]
    : value?.results?.[0] || value?.organization || value;
  return record?.id ?? record?.organization_id ?? null;
};

const navItems = [
  ["overview", "Overview", LayoutDashboard],
  ["monitors", "Monitors", Activity],
  ["alerts", "Alerts", Bell],
  ["organisation", "Organisation", Users],
  ["healing", "Auto healing", Bot],
  ["deployment", "Deployment", Rocket],
  ["settings", "Settings", Settings],
];

const Panel = ({ children, className = "" }) => (
  <section
    className={`rounded-2xl border border-charcoal-800 bg-charcoal-900/70 p-4 shadow-card sm:p-5 ${className}`}
  >
    {children}
  </section>
);
const Status = ({ value }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold ${value === "Operational" || value === "healthy" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${value === "Operational" || value === "healthy" ? "bg-emerald-400" : "bg-amber-400"}`}
    />
    {value}
  </span>
);

function Dashboard() {
  const navigate = useNavigate();
  const photoInput = useRef(null);
  const [active, setActive] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [monitors, setMonitors] = useState([]);
  const [monitorsLoading, setMonitorsLoading] = useState(true);
  const [monitorsError, setMonitorsError] = useState("");
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [monitorData, setMonitorData] = useState({ uptime: null, responseTime: null, incidents: [] });
  const [monitorDataLoading, setMonitorDataLoading] = useState(false);
  const [detailRefresh, setDetailRefresh] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", url: "" });
  const [formError, setFormError] = useState("");
  const [savingMonitor, setSavingMonitor] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [photo, setPhoto] = useState(
    sessionStorage.getItem("profilePhoto") || "",
  );
  const [profile, setProfile] = useState(() =>
    JSON.parse(
      sessionStorage.getItem("profileDraft") ||
        '{"firstName":"Sarah","lastName":"Anderson","email":"sarah@acme.io"}',
    ),
  );
  const [prefs, setPrefs] = useState({
    certificate: true,
    alerts: true,
    digest: true,
    report: false,
  });
  const [deployment, setDeployment] = useState("idle");
  const [deployments, setDeployments] = useState([]);
  const [deploymentsError, setDeploymentsError] = useState("");
  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [organizationError, setOrganizationError] = useState("");
  const [autoheals, setAutoheals] = useState([]);
  const [autohealsError, setAutohealsError] = useState("");

  const loadServices = async () => {
    setMonitorsLoading(true);
    setMonitorsError("");
    try {
      setMonitors(toList(await getServices()).map(toMonitor));
    } catch (error) {
      setMonitorsError(displayError(error));
    } finally {
      setMonitorsLoading(false);
    }
  };

  const loadDeployments = async () => {
    try {
      setDeployments(toList(await getDeployments()));
    } catch (error) {
      setDeploymentsError(displayError(error));
    }
  };

  const loadOrganization = async () => {
    try {
      const [organizationResponse, membersResponse] = await Promise.all([
        getOrganization(),
        getOrganizationMembers(),
      ]);
      setOrganization(organizationResponse);
      setMembers(toList(membersResponse));
    } catch (error) {
      setOrganizationError(displayError(error));
    }
  };

  const loadAutoheals = async () => {
    try {
      setAutohealsError("");
      setAutoheals(toList(await getAutoheals()));
    } catch (error) {
      setAutoheals([]);
      setAutohealsError(displayError(error));
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("accessToken")) {
      setMonitorsLoading(false);
      setMonitorsError("Your session is not authenticated. Please sign in again to load workspace data.");
      return;
    }
    loadServices();
    loadDeployments();
    loadOrganization();
    loadAutoheals();
  }, []);

  useEffect(() => {
    if (!selectedMonitor?.id) return;
    let current = true;
    setMonitorDataLoading(true);
    Promise.all([getUptime(selectedMonitor.id), getResponseTime(selectedMonitor.id), getIncidents(selectedMonitor.id)])
      .then(([uptime, responseTime, incidents]) => {
        if (current) setMonitorData({ uptime, responseTime, incidents: toList(incidents) });
      })
      .catch(() => {
        if (current) setMonitorData({ uptime: null, responseTime: null, incidents: [] });
      })
      .finally(() => current && setMonitorDataLoading(false));
    return () => { current = false; };
  }, [selectedMonitor?.id, detailRefresh]);

  const choose = (view) => {
    setActive(view);
    setSelectedMonitor(null);
    setMobileNav(false);
  };
  const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };
  const openMonitor = (monitor) => {
    setSelectedMonitor(monitor);
    setActive("details");
  };
  const addMonitor = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const url = form.url.trim();
    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { parsedUrl = null; }
    if (!name || !parsedUrl || !["http:", "https:"].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
      setFormError("Enter a service name and a valid http:// or https:// URL.");
      return;
    }
    setSavingMonitor(true);
    setFormError("");
    Promise.resolve(getOrganizationId(organization) ? organization : getOrganization())
      .then((organizationResponse) => {
        const organizationId = getOrganizationId(organizationResponse);
        if (!organizationId) {
          throw new Error("No organization is associated with this account. Create or join an organization before adding a monitor.");
        }
        return createService({ name, url, organization: organizationId });
      })
      .then(async () => {
        setForm({ name: "", url: "" });
        setShowAdd(false);
        choose("monitors");
        await loadServices();
      })
      .catch((error) => setFormError(error.message?.startsWith("No organization") ? error.message : displayError(error)))
      .finally(() => setSavingMonitor(false));
  };
  const changePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      setPhoto(image);
      sessionStorage.setItem("profilePhoto", image);
    };
    reader.readAsDataURL(file);
  };
  const deploy = async () => {
    if (!monitors[0]?.id) return;
    setDeployment("deploying");
    try {
      await triggerDeployment({ serviceId: monitors[0].id, branch: "main" });
      setDeployment("started");
      await loadDeployments();
    } catch (error) {
      setDeployment(displayError(error));
    }
  };
  const editMonitor = async (monitor) => {
    const name = window.prompt("Monitor name", monitor.name);
    if (name === null) return;
    const url = window.prompt("Monitor URL", monitor.url);
    if (url === null) return;
    try {
      await updateService(monitor.id, { name: name.trim(), url: url.trim() });
      await loadServices();
      setSelectedMonitor(toMonitor({ ...monitor, name: name.trim(), url: url.trim() }));
    } catch (error) {
      window.alert(displayError(error));
    }
  };
  const removeMonitor = async (monitor) => {
    if (!window.confirm(`Delete ${monitor.name}? This cannot be undone.`)) return;
    try {
      await deleteService(monitor.id);
      setSelectedMonitor(null);
      choose("monitors");
      await loadServices();
    } catch (error) {
      window.alert(displayError(error));
    }
  };
  const toggle = (key) =>
    setPrefs((current) => ({ ...current, [key]: !current[key] }));

  const Header = ({ eyebrow, heading, description, action }) => (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {heading}
        </h1>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      </div>
      {action}
    </header>
  );
  const Toggle = ({ value, label, description, onClick }) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-charcoal-800 bg-charcoal-950/50 p-3">
      <span>
        <span className="block text-xs font-bold">{label}</span>
        <span className="mt-1 block text-[11px] text-gray-500">
          {description}
        </span>
      </span>
      <button
        aria-label={`Toggle ${label}`}
        onClick={onClick}
        className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${value ? "bg-primary" : "bg-charcoal-700"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );

  const Overview = () => (
    <div>
      <Header
        eyebrow="OPERATIONS / TODAY"
        heading="Your systems, at a glance."
        description="A focused view of your HTTP and HTTPS endpoint health."
        action={
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-charcoal-800 bg-charcoal-900 px-3 py-2 text-xs text-gray-400">
            <Clock3 className="h-3.5 w-3.5" />
            Updated just now
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          ["Global uptime", "—", ShieldCheck, "text-emerald-400"],
          ["Average response", "—", Clock3, "text-accent-blue"],
          ["Active monitors", `${monitors.length}`, Activity, "text-primary"],
          ["Open incidents", "—", AlertTriangle, "text-amber-400"],
        ].map(([label, value, Icon, color]) => (
          <Panel key={label}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-gray-400">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="mt-4 text-2xl font-bold">{value}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <Panel>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-bold">Response time</p>
              <p className="mt-1 text-[11px] text-gray-500">
              Select a monitor to view its measured response-time history.
              </p>
            </div>
            <span className="text-xs font-bold text-primary">Live data</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1">
            <p className="text-xs text-gray-500">Response-time data is shown on each service detail page.</p>
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold">Latest attention</p>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs font-bold text-amber-300">
              Monitoring data
            </p>
            <p className="mt-1 text-[11px] leading-5 text-gray-400">
              Select a service to inspect its latest measurements and incidents.
            </p>
          </div>
          <button
            onClick={() => monitors[0] && openMonitor(monitors[0])}
            className="mt-4 text-xs font-bold text-primary hover:text-white"
          >
            View service details <ChevronRight className="inline h-3.5 w-3.5" />
          </button>
        </Panel>
      </div>
      <Panel className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Endpoint health</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Latest monitor results
            </p>
          </div>
          <button
            onClick={() => choose("monitors")}
            className="text-xs font-bold text-primary"
          >
            View all monitors
          </button>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {monitors.slice(0, 3).map((monitor) => (
            <button
              key={monitor.id}
              onClick={() => openMonitor(monitor)}
              className="flex items-center gap-3 rounded-xl border border-charcoal-800 bg-charcoal-950/40 p-3 text-left hover:border-primary/40"
            >
              <span
                className={`h-2 w-2 rounded-full ${monitor.status === "Operational" || monitor.status === "healthy" ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold">
                  {monitor.name}
                </span>
                <span className="mt-1 block text-[10px] text-gray-500">
                  {formatLatency(monitor.last_response_time ?? monitor.response_time_ms)}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );

  const Monitors = () => (
    <div>
      <Header
        eyebrow="ENDPOINT COVERAGE"
        heading="Monitors"
        description="Select a service to view its complete HTTP or HTTPS monitoring history."
        action={
          <button
            onClick={() => {
              setFormError("");
              setShowAdd(true);
            }}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-dark px-4 py-2.5 text-xs font-bold shadow-glow-blue hover:bg-primary"
          >
            <Plus className="h-4 w-4" />
            New monitor
          </button>
        }
      />
      <Panel className="p-0">
        <div className="flex items-center justify-between border-b border-charcoal-800 p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search monitors..."
              className="w-full rounded-lg border border-charcoal-800 bg-charcoal-950 py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
          <span className="hidden text-xs text-gray-500 sm:block">
            {monitors.length} monitors
          </span>
        </div>
        {monitorsLoading && <p className="p-5 text-xs text-gray-500">Loading monitors…</p>}
        {monitorsError && <div className="p-5 text-xs text-red-400">{monitorsError} <button onClick={loadServices} className="ml-2 font-bold text-primary">Retry</button></div>}
        {!monitorsLoading && !monitorsError && monitors.length === 0 && <p className="p-5 text-xs text-gray-500">No monitors yet. Add a service endpoint to begin monitoring.</p>}
        <div className="divide-y divide-charcoal-800">
          {monitors.map((monitor) => (
            <button
              key={monitor.id}
              onClick={() => openMonitor(monitor)}
              className="group flex w-full items-center gap-3 p-4 text-left hover:bg-charcoal-800/30 sm:px-5"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${monitor.status === "Operational" || monitor.status === "healthy" ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-charcoal-950 text-primary">
                <Globe2 className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-xs font-bold group-hover:text-primary">
                    {monitor.name}
                  </span>
                  <span className="rounded bg-charcoal-800 px-1.5 py-0.5 text-[9px] font-bold text-gray-400">
                    {monitor.protocol}
                  </span>
                </span>
                <span className="mt-1 block truncate font-mono text-[10px] text-gray-500">
                  {monitor.url}
                </span>
              </span>
              <span className="hidden text-right sm:block">
                <span className="block text-xs font-bold">
                  {formatLatency(monitor.last_response_time ?? monitor.response_time_ms)}
                </span>
                <span className="mt-1 block text-[10px] text-gray-500">{monitor.is_active ? "Active" : "Inactive"}</span>
              </span>
              <Status value={monitor.status} />
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-600 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );

  const Details = () => {
    const monitor = selectedMonitor || monitors[0];
    if (!monitor) {
      return <p className="text-sm text-gray-500">Choose a monitor to view its details.</p>;
    }
    const isHttps = monitor.protocol === "HTTPS";
    const responseValues = monitorData.responseTime?.response_time_ms || [];
    const responseTimes = monitorData.responseTime?.checked_at || [];
    const maximum = Math.max(...responseValues, 1);
    return (
      <div>
        <button
          onClick={() => choose("monitors")}
          className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to monitors
        </button>
        <Header
          eyebrow="SERVICE MONITOR"
          heading={monitor.name}
          description={monitor.url}
          action={
            <div className="flex gap-2">
              <button onClick={() => setDetailRefresh((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-900 px-4 py-2.5 text-xs font-bold hover:border-primary"><RefreshCw className="h-4 w-4" />{monitorDataLoading ? "Refreshing…" : "Refresh data"}</button>
              <button onClick={() => editMonitor(monitor)} className="rounded-xl border border-charcoal-700 px-3 text-xs font-bold hover:border-primary">Edit</button>
              <button onClick={() => removeMonitor(monitor)} className="rounded-xl border border-red-500/30 px-3 text-xs font-bold text-red-300">Delete</button>
            </div>
          }
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Panel>
            <p className="text-[11px] text-gray-500">Current status</p>
            <p
              className={`mt-3 text-lg font-bold ${monitor.status === "Degraded" ? "text-amber-400" : "text-emerald-400"}`}
            >
              {monitor.status}
            </p>
          </Panel>
          <Panel>
            <p className="text-[11px] text-gray-500">Response time</p>
            <p className="mt-3 text-lg font-bold">{formatLatency(responseValues[0])}</p>
          </Panel>
          <Panel>
            <p className="text-[11px] text-gray-500">30-day uptime</p>
            <p className="mt-3 text-lg font-bold">{formatPercent(monitorData.uptime?.total_uptime)}</p>
          </Panel>
          <Panel>
            <p className="text-[11px] text-gray-500">
              {isHttps ? "Certificate expiry" : "Protocol"}
            </p>
            <p className="mt-3 text-lg font-bold">
              {isHttps ? monitor.certificate : "HTTP"}
            </p>
          </Panel>
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.85fr]">
          <Panel>
            <p className="text-sm font-bold">Response time history</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Successful check response time · last 24 hours
            </p>
            <div className="mt-6 flex h-36 items-end gap-1">
              {responseValues.length ? responseValues.map((point, index) => (
                <span
                  key={index}
                  title={`${formatLatency(point)} at ${new Date(responseTimes[index]).toLocaleString()}`}
                  style={{ height: `${Math.max(6, (point / maximum) * 100)}%` }}
                  className="flex-1 rounded-sm bg-primary"
                />
              )) : <p className="text-xs text-gray-500">No response-time history is available.</p>}
            </div>
          </Panel>
          <Panel>
            <p className="text-sm font-bold">Monitor configuration</p>
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <strong>GET</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frequency</span>
                <strong>Every 30 seconds</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timeout</span>
                <strong>5 seconds</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected status</span>
                <strong className="text-emerald-400">200–299</strong>
              </div>
            </div>
          </Panel>
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <Panel>
            <p className="text-sm font-bold">Latest checks</p>
            <div className="mt-4 divide-y divide-charcoal-800 rounded-xl border border-charcoal-800 bg-charcoal-950/40">
              {responseValues.slice(0, 4).map((response, index) => (
                <div
                  key={`${response}-${responseTimes[index]}`}
                  className="grid grid-cols-3 px-3 py-3 text-xs"
                >
                  <span className="text-gray-500">{new Date(responseTimes[index]).toLocaleString()}</span>
                  <span className="font-medium">
                    Successful check
                  </span>
                  <span className="text-right font-mono">{formatLatency(response)}</span>
                </div>
              ))}
              {!responseValues.length && <p className="p-3 text-xs text-gray-500">No checks are available.</p>}
            </div>
          </Panel>
          <Panel>
            <p className="text-sm font-bold">Availability</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Recent check history
            </p>
            <div className="mt-6 grid grid-cols-12 gap-1">
              {(monitorData.uptime?.total_checks || []).slice(0, 36).map((check, index) => (
                <span
                  key={index}
                  title={String(check)}
                  className={`h-6 rounded-sm ${check ? "bg-emerald-500" : "bg-amber-400"}`}
                />
              ))}
              {!monitorData.uptime?.total_checks?.length && <p className="col-span-12 text-xs text-gray-500">No uptime checks are available.</p>}
            </div>
          </Panel>
        </div>
        <Panel className="mt-5">
          <p className="text-sm font-bold">Incident timeline</p>
          <div className="mt-4 space-y-3">
            {monitorData.incidents.map((incident, index) => <div key={`${incident.timestamp}-${index}`} className="border-l border-charcoal-700 pl-3 text-xs"><p className="font-bold">{incident.type || "Incident"}</p><p className="mt-1 text-gray-400">{incident.message}</p><p className="mt-1 text-[10px] text-gray-500">{incident.timestamp && new Date(incident.timestamp).toLocaleString()}</p></div>)}
            {!monitorData.incidents.length && <p className="text-xs text-gray-500">No incidents have been recorded.</p>}
          </div>
        </Panel>
      </div>
    );
  };

  const Organisation = () => (
    <div>
      <Header
        eyebrow="TEAM & ACCESS"
        heading="Organisation"
        description="People who can access this monitoring workspace."
        action={
          <button className="rounded-xl border border-charcoal-700 px-4 py-2.5 text-xs font-bold hover:border-primary">
            Invite member
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <Users className="h-6 w-6 text-primary" />
          <p className="mt-4 text-lg font-bold">{organization?.name || organization?.organization_name || "Organisation"}</p>
          <p className="mt-1 text-sm text-gray-400">
            Production monitoring workspace
          </p>
          <div className="mt-6 space-y-3 border-t border-charcoal-800 pt-4 text-xs">
            <p className="flex justify-between">
              <span className="text-gray-500">Plan</span>
              <strong className="text-primary">Starter</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Monitor capacity</span>
              <strong>{monitors.length} active services</strong>
            </p>
          </div>
        </Panel>
        <Panel>
          <p className="text-sm font-bold">Team members</p>
          {organizationError && <p className="mt-3 text-xs text-red-400">{organizationError} <button onClick={loadOrganization} className="font-bold text-primary">Retry</button></p>}
          <div className="mt-4 space-y-2">
            {members.map((member, index) => {
              const name = member.name || member.email || member.username || `Member ${member.id || index + 1}`;
              const initials = name.slice(0, 2).toUpperCase();
              return (
              <div
                key={member.id || name}
                className="flex items-center gap-3 rounded-xl border border-charcoal-800 bg-charcoal-950/40 p-3"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-dark text-xs font-bold">
                  {initials}
                </span>
                <span className="flex-1 text-xs font-bold">{name}</span>
                <span className="text-[10px] text-gray-500">{member.role || "Member"}</span>
              </div>
              );
            })}
            {!organizationError && !members.length && <p className="text-xs text-gray-500">No organisation members are available.</p>}
          </div>
        </Panel>
      </div>
    </div>
  );

  const Healing = () => (
    <div>
      <Header
        eyebrow="AUTOMATED RESPONSE"
        heading="Auto healing"
        description="Configured automated response rules from your workspace."
        action={
          <button className="rounded-xl bg-primary-dark px-4 py-2.5 text-xs font-bold shadow-glow-blue hover:bg-primary">
            Create rule
          </button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {autoheals.map((rule, index) => (
          <Panel key={rule.id || index}>
            <Zap className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm font-bold">{rule.name || rule.title || `Rule ${rule.id || index + 1}`}</p>
            <p className="mt-2 text-xs leading-5 text-gray-400">{rule.description || rule.trigger || "No description provided."}</p>
            <span className="mt-5 inline-block text-[10px] font-bold text-emerald-400">
              ● Enabled
            </span>
          </Panel>
        ))}
        {autohealsError && <p className="text-xs text-red-400">{autohealsError} <button onClick={loadAutoheals} className="font-bold text-primary">Retry</button></p>}
        {!autohealsError && !autoheals.length && <p className="text-xs text-gray-500">No AutoHeal rules are available.</p>}
      </div>
    </div>
  );

  const Deployment = () => (
    <div>
      <Header
        eyebrow="RELEASE AWARENESS"
        heading="Deployment"
        description="Track releases alongside HTTP and HTTPS service health. The trigger uses the first listed service on the main branch."
        action={
          <button
            onClick={deploy}
            disabled={deployment === "deploying" || !monitors.length}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-dark px-4 py-2.5 text-xs font-bold shadow-glow-blue hover:bg-primary disabled:opacity-60"
          >
            <Rocket className="h-4 w-4" />
            {deployment === "deploying"
              ? "Deploying..."
              : deployment === "started"
                ? "Deployment started"
                : deployment === "idle" ? "Trigger deploy" : "Retry deployment"}
          </button>
        }
      />
      {deploymentsError && <p className="mb-4 text-xs text-red-400">{deploymentsError} <button onClick={loadDeployments} className="font-bold text-primary">Retry</button></p>}
      <Panel>
        <p className="text-sm font-bold">Deployment timeline</p>
        <div className="mt-6 space-y-6 border-l border-charcoal-700 pl-5">
          {deployments.map((item, index) => (
            <div key={item.id || index} className="relative">
              <span className="absolute -left-[25px] top-1 h-3 w-3 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleString() : "Deployment"}</p>
              <p className="mt-1 text-sm font-bold">{item.name || item.version || item.branch || `Deployment ${item.id || index + 1}`}</p>
              <p className="mt-1 text-xs text-gray-400">{item.status || item.message || "No status supplied."}</p>
            </div>
          ))}
          {!deployments.length && !deploymentsError && <p className="text-xs text-gray-500">No deployments are available.</p>}
        </div>
      </Panel>
    </div>
  );

  const SettingsView = () => (
    <div>
      <Header
        eyebrow="ACCOUNT & WORKSPACE"
        heading="Settings"
        description="Manage your profile, notifications, security, and monitoring defaults."
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Panel>
            <p className="text-sm font-bold">Profile settings</p>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
              <input
                ref={photoInput}
                onChange={changePhoto}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => photoInput.current?.click()}
                className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary-dark text-lg font-bold"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  `${profile.firstName?.[0] || "U"}${profile.lastName?.[0] || ""}`
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[9px]">
                  Change photo
                </span>
              </button>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-gray-300">
                  First name
                  <input
                    value={profile.firstName}
                    onChange={(event) =>
                      setProfile({ ...profile, firstName: event.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs font-semibold text-gray-300">
                  Last name
                  <input
                    value={profile.lastName}
                    onChange={(event) =>
                      setProfile({ ...profile, lastName: event.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </label>
                <label className="text-xs font-semibold text-gray-300 sm:col-span-2">
                  Email
                  <input
                    value={profile.email}
                    onChange={(event) =>
                      setProfile({ ...profile, email: event.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={() =>
                sessionStorage.setItem("profileDraft", JSON.stringify(profile))
              }
              className="mt-5 rounded-xl bg-primary-dark px-4 py-2.5 text-xs font-bold hover:bg-primary"
            >
              Save profile
            </button>
          </Panel>
          <Panel>
            <p className="text-sm font-bold">Notification preferences</p>
            <div className="mt-4 space-y-2">
              <Toggle
                value={prefs.alerts}
                onClick={() => toggle("alerts")}
                label="Email alerts"
                description="Outages and slow-response notifications"
              />
              <Toggle
                value={prefs.digest}
                onClick={() => toggle("digest")}
                label="Daily digest"
                description="A summary of monitor health each morning"
              />
              <Toggle
                value={prefs.report}
                onClick={() => toggle("report")}
                label="Weekly availability report"
                description="A weekly uptime summary"
              />
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel>
            <p className="text-sm font-bold">Monitoring defaults</p>
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-semibold text-gray-300">
                Default frequency
                <select
                  defaultValue="30 seconds"
                  className="mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 p-2.5 text-xs"
                >
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                </select>
              </label>
              <Toggle
                value={prefs.certificate}
                onClick={() => toggle("certificate")}
                label="Track HTTPS certificates"
                description="Show expiry and certificate status"
              />
            </div>
          </Panel>
          <Panel>
            <p className="text-sm font-bold">Security & sessions</p>
            <button className="mt-4 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-3 py-2.5 text-left text-xs font-bold hover:border-primary">
              Change password
            </button>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-charcoal-800 bg-charcoal-950/50 p-3">
                <p className="flex justify-between text-xs font-bold">
                  <span>Current browser</span>
                  <span className="text-emerald-400">Active now</span>
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Windows · Chrome · Nigeria
                </p>
              </div>
              <div className="rounded-xl border border-charcoal-800 bg-charcoal-950/50 p-3">
                <p className="flex justify-between text-xs font-bold">
                  <span>Mobile session</span>
                  <button className="text-red-400">Sign out</button>
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  iPhone · Last active yesterday
                </p>
              </div>
            </div>
          </Panel>
          <Panel className="border-red-500/20">
            <p className="text-sm font-bold text-red-300">Danger zone</p>
            <p className="mt-1 text-[11px] text-gray-500">
              Permanently remove your account and workspace data.
            </p>
            <button
              onClick={() => {
                if (
                  window.confirm("Delete your account? This cannot be undone.")
                )
                  logout();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete account
            </button>
          </Panel>
        </div>
      </div>
    </div>
  );

  const routeName =
    active === "details"
      ? selectedMonitor?.name || "Monitor details"
      : navItems.find(([id]) => id === active)?.[1];
  const pageContent = {
    overview: <Overview />,
    monitors: <Monitors />,
    alerts: <AlertsView />,
    details: <Details />,
    organisation: <Organisation />,
    healing: <Healing />,
    deployment: <Deployment />,
    settings: <SettingsView />,
  }[active];
  const page = (
    <>
      <nav
        aria-label="Breadcrumb"
        className="fixed top-0 z-40 hidden h-16 items-center gap-2 text-[11px] font-medium text-gray-500 lg:flex"
        style={{ left: collapsed ? "5rem" : "18rem" }}
      >
        <span className="ml-8">Acme Labs</span>
        <ChevronRight className="h-3.5 w-3.5" />
        {active === "details" && (
          <>
            <button
              onClick={() => choose("monitors")}
              className="hover:text-white"
            >
              Monitors
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="max-w-56 truncate text-gray-300">{routeName}</span>
      </nav>
      {notificationMenu && (
        <div className="fixed right-16 top-16 z-[60] w-72 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-3 shadow-card">
          <div className="flex items-center justify-between border-b border-charcoal-800 px-1 pb-2">
            <p className="text-xs font-bold">Notifications</p>
            <button
              onClick={() => {
                setNotificationsRead(true);
                setNotificationMenu(false);
              }}
              className="text-[11px] font-bold text-primary hover:text-white"
            >
              Mark all as read
            </button>
          </div>
          {notificationsRead ? (
            <p className="p-4 text-center text-xs text-gray-500">
              You are all caught up.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="rounded-xl bg-charcoal-950 p-3 text-xs">
                <p className="font-bold text-amber-300">
                  Checkout API latency elevated
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Response time is above your alert threshold.
                </p>
              </div>
              <div className="rounded-xl bg-charcoal-950 p-3 text-xs">
                <p className="font-bold">Daily monitor summary ready</p>
                <p className="mt-1 text-[11px] text-gray-500">
                  All other endpoints are operational.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {pageContent}
    </>
  );
  const sidebarClass = collapsed ? "lg:w-20" : "lg:w-72";
  const contentClass = collapsed
    ? "lg:ml-20 lg:w-[calc(100%-5rem)]"
    : "lg:ml-72 lg:w-[calc(100%-18rem)]";

  return (
    <main className="min-h-screen bg-charcoal-950 text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-charcoal-800 bg-charcoal-950 p-4 transition-all ${sidebarClass} ${mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
              ✓
            </span>
            {!collapsed && (
              <span>
                Checkmate<span className="text-primary">.</span>
              </span>
            )}
          </div>
          <button onClick={() => setMobileNav(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div
          className={`mt-7 rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-3 ${collapsed ? "hidden" : "lg:block"}`}
        >
          <p className="text-xs font-bold">Acme Labs</p>
          <p className="mt-2 text-[11px] text-gray-500">Production workspace</p>
        </div>
        <nav className="mt-7 space-y-1">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-gray-500">
              WORKSPACE
            </p>
          )}
          {navItems.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => choose(id)}
              title={label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${active === id ? "bg-primary text-white shadow-glow-blue" : "text-gray-400 hover:bg-charcoal-900 hover:text-white"}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-charcoal-800 bg-charcoal-900 py-2.5 text-xs font-bold text-gray-300 hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Collapse sidebar
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[10px] text-gray-600">
            {collapsed ? "v1" : "Checkmate v1.0"}
          </p>
        </div>
      </aside>
      {mobileNav && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}
      <div className={`min-h-screen min-w-0 transition-all ${contentClass}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-charcoal-800 bg-charcoal-950/90 px-5 backdrop-blur sm:px-8">
          <button onClick={() => setMobileNav(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationMenu(!notificationMenu);
                  setProfileMenu(false);
                }}
                aria-label="Notifications"
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-charcoal-800 bg-charcoal-900 text-gray-300"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
              {notificationMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-3 shadow-card">
                  <p className="px-1 text-xs font-bold">Notifications</p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl bg-charcoal-950 p-3 text-xs">
                      <p className="font-bold text-amber-300">
                        Checkout API latency elevated
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Response time is above your alert threshold.
                      </p>
                    </div>
                    <div className="rounded-xl bg-charcoal-950 p-3 text-xs">
                      <p className="font-bold">Daily monitor summary ready</p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        All other endpoints are operational.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setProfileMenu(!profileMenu);
                  setNotificationMenu(false);
                }}
                className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-primary-dark text-xs font-bold"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  `${profile.firstName?.[0] || "U"}${profile.lastName?.[0] || ""}`
                )}
              </button>
              {profileMenu && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-card">
                  <div className="border-b border-charcoal-800 px-3 py-2">
                    <p className="text-xs font-bold">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-gray-500">
                      {profile.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      choose("settings");
                      setProfileMenu(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-charcoal-800"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                    Profile settings
                  </button>
                  <button
                    onClick={() => {
                      choose("settings");
                      setProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-charcoal-800"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Security & sessions
                  </button>
                  <button
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-charcoal-800 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          {monitorsError && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              <span>{monitorsError}</span>
              <button onClick={logout} className="shrink-0 font-bold text-white hover:text-primary">Sign in</button>
            </div>
          )}
          {page}
        </div>
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <button
            aria-label="Close dialog"
            onClick={() => setShowAdd(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <form
            onSubmit={addMonitor}
            className="relative w-full max-w-md rounded-3xl border border-charcoal-700 bg-charcoal-950 p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-primary">
                  NEW MONITOR
                </p>
                <h2 className="mt-1 text-xl font-bold">Add website monitor</h2>
              </div>
              <button type="button" onClick={() => setShowAdd(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Add an HTTP or HTTPS website to start monitoring it.
            </p>
            <label className="mt-5 block text-xs font-semibold text-gray-300">
              Monitor name
              <input
                autoFocus
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Production API"
                className="mt-1.5 w-full rounded-xl border border-charcoal-800 bg-charcoal-900 p-3 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-gray-300">
              Website URL
              <input
                value={form.url}
                onChange={(event) =>
                  setForm({ ...form, url: event.target.value })
                }
                placeholder="https://example.com"
                className="mt-1.5 w-full rounded-xl border border-charcoal-800 bg-charcoal-900 p-3 text-sm outline-none focus:border-primary"
              />
            </label>
            {formError && (
              <p className="mt-3 text-xs text-red-400">{formError}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-charcoal-700 px-4 py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingMonitor}
                className="rounded-xl bg-primary-dark px-4 py-2.5 text-xs font-bold shadow-glow-blue hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingMonitor ? "Adding…" : "Add monitor"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
