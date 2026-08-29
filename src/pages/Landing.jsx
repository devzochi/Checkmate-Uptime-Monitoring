import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BellRing,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "HTTP & HTTPS checks",
    description:
      "Monitor the web endpoints your customers depend on, from landing pages to critical APIs.",
  },
  {
    icon: Activity,
    title: "Clear uptime status",
    description:
      "See which endpoints are healthy, degraded, or unavailable in one focused workspace.",
  },
  {
    icon: Clock3,
    title: "Response-time visibility",
    description:
      "Spot slow endpoints early with response-time data beside every monitored URL.",
  },
  {
    icon: BellRing,
    title: "Actionable alerts",
    description:
      "Keep your team informed when an endpoint needs attention—without constantly refreshing a page.",
  },
];

const faqs = [
  [
    "What can I monitor with Checkmate?",
    "Checkmate currently monitors HTTP and HTTPS endpoints. Add a URL, then use your dashboard to follow its availability and response time.",
  ],
  [
    "Is Checkmate useful for APIs?",
    "Yes. If your API is reachable through an HTTP or HTTPS URL, you can use Checkmate to keep an eye on its availability.",
  ],
  [
    "Do I need to install anything?",
    "No. Checkmate is web-based: create an account, add the endpoint you want to watch, and view its status from your dashboard.",
  ],
];

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const reveal = (delay = 0) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.5, delay, ease: "easeOut" },
        };

  return (
    <main className="min-h-screen overflow-hidden bg-charcoal-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_62%)]" />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg text-white shadow-glow-blue">
            ✓
          </span>
          <span className="text-lg">Checkmate<span className="text-primary">.</span></span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-400 md:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white">
            Sign in
          </Link>
          <Link to="/signup" className="rounded-xl bg-primary-dark px-4 py-2.5 text-sm font-bold text-white shadow-glow-blue transition-all hover:bg-primary hover:-translate-y-0.5">
            Start monitoring
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-charcoal-700 bg-charcoal-900 text-gray-200 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="relative z-20 mx-5 rounded-2xl border border-charcoal-700 bg-charcoal-900 p-3 shadow-card md:hidden">
          {["Features", "How it works", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-charcoal-800 hover:text-white"
            >
              {item}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-charcoal-800 pt-3">
            <Link to="/login" className="rounded-lg border border-charcoal-700 px-3 py-2 text-center text-sm font-semibold text-gray-300">Sign in</Link>
            <Link to="/signup" className="rounded-lg bg-primary-dark px-3 py-2 text-center text-sm font-bold">Get started</Link>
          </div>
        </div>
      )}

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-28">
        <motion.div className="mx-auto max-w-3xl text-center" {...reveal()}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> HTTP & HTTPS uptime monitoring
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Know your endpoint is up <span className="text-primary">before</span> your customers do.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Checkmate gives your team a calm, clear view of the HTTP and HTTPS services that keep your business moving.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark px-5 py-3.5 text-sm font-bold shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-primary">
              Start monitoring free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-charcoal-700 bg-charcoal-900/70 px-5 py-3.5 text-sm font-bold text-gray-200 transition-colors hover:border-charcoal-600 hover:text-white">
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500">Built for the HTTP and HTTPS endpoints your customers rely on.</p>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-14 max-w-5xl rounded-2xl border border-charcoal-700 bg-charcoal-900/85 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-5"
          {...reveal(0.12)}
          whileHover={prefersReducedMotion ? undefined : { y: -3 }}
        >
          <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-accent-blue/10 to-primary/20 blur-xl" />
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-950 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Activity className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-bold">Core Systems</p>
                  <p className="text-xs text-gray-500">Endpoint health overview</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> All systems operational</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Monitored endpoints", "03", "text-white"],
                ["Healthy right now", "03", "text-emerald-400"],
                ["Attention needed", "00", "text-gray-300"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-xl border border-charcoal-800 bg-charcoal-900/70 p-4">
                  <p className="text-xs font-medium text-gray-500">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {[
                ["https://api.acme.com/health", "HTTPS", "Operational", "42 ms"],
                ["https://app.acme.com", "HTTPS", "Operational", "76 ms"],
                ["http://legacy.acme.com", "HTTP", "Operational", "118 ms"],
              ].map(([url, type, status, time]) => (
                <div key={url} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-charcoal-800 bg-charcoal-900/40 px-3 py-3 text-xs sm:px-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                  <span className="min-w-0 flex-1 truncate font-medium text-gray-200">{url}</span>
                  <span className="rounded-md bg-charcoal-800 px-2 py-1 text-[10px] font-bold text-gray-400">{type}</span>
                  <span className="font-semibold text-emerald-400">{status}</span>
                  <span className="w-10 text-right text-gray-500">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="border-y border-charcoal-800 bg-charcoal-900/35 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div className="max-w-2xl" {...reveal()}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Everything you need to stay informed</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Simple monitoring. Useful signal.</h2>
            <p className="mt-4 leading-7 text-gray-400">No sprawling control center—just the essentials for keeping your web endpoints visible and your team ready.</p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.article key={title} className="rounded-2xl border border-charcoal-800 bg-charcoal-950/60 p-5 transition-transform hover:-translate-y-1" {...reveal(index * 0.07)}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div {...reveal()}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">A focused workflow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From URL to confidence in minutes.</h2>
            <p className="mt-4 max-w-lg leading-7 text-gray-400">Checkmate is designed to make monitoring feel approachable from the first endpoint you add.</p>
            <Link to="/signup" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-white">Create your workspace <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
          <ol className="space-y-4">
            {[
              ["01", "Create your workspace", "Start with an account for you and your team."],
              ["02", "Add an HTTP or HTTPS URL", "Choose the endpoint whose availability matters to your customers."],
              ["03", "Watch status and response time", "Use your dashboard to see service health at a glance."],
            ].map(([number, title, description], index) => (
              <motion.li key={number} className="flex gap-4 rounded-2xl border border-charcoal-800 bg-charcoal-900/50 p-5 sm:items-center" {...reveal(index * 0.08)}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">{number}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-400">{description}</p></div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-charcoal-800 bg-charcoal-900/35 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-3">
            <motion.div className="rounded-2xl border border-primary/25 bg-primary/10 p-6 lg:col-span-1" {...reveal()}>
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h2 className="mt-5 text-2xl font-bold">Built around what you actually monitor today.</h2>
              <p className="mt-3 text-sm leading-6 text-gray-300">Focused support for HTTP and HTTPS checks means a clearer product and a cleaner dashboard from day one.</p>
            </motion.div>
            <motion.div className="rounded-2xl border border-charcoal-800 bg-charcoal-950/60 p-6 lg:col-span-2" {...reveal(0.1)}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">What Checkmate tracks</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Endpoint availability", "See whether your HTTP and HTTPS URLs can be reached."],
                  ["Response time", "Understand how quickly your endpoints respond."],
                  ["Current status", "Identify services that are operational or need attention."],
                  ["Service visibility", "Keep the health of important URLs in one workspace."],
                ].map(([title, description]) => <div key={title} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-400">{description}</p></div></div>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <motion.div className="text-center" {...reveal()}><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Questions, answered</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Getting started with Checkmate</h2></motion.div>
        <div className="mt-10 space-y-3">
          {faqs.map(([question, answer], index) => (
            <motion.article key={question} className="rounded-xl border border-charcoal-800 bg-charcoal-900/50" {...reveal(index * 0.06)}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold">
                {question}<ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              {openFaq === index && <p className="border-t border-charcoal-800 px-5 py-4 text-sm leading-6 text-gray-400">{answer}</p>}
            </motion.article>
          ))}
        </div>
      </section>

      <motion.section className="mx-5 mb-12 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary-dark/35 via-charcoal-900 to-charcoal-950 sm:mx-8 lg:mx-auto lg:max-w-7xl" {...reveal()}>
        <div className="px-6 py-14 text-center sm:px-12 sm:py-16"><Zap className="mx-auto h-7 w-7 text-primary" /><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Give your endpoints a better watch.</h2><p className="mx-auto mt-4 max-w-xl text-gray-300">Start a Checkmate workspace and keep your HTTP and HTTPS services in view.</p><Link to="/signup" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold shadow-glow-blue transition-colors hover:bg-primary-dark">Start monitoring <ArrowRight className="h-4 w-4" /></Link></div>
      </motion.section>

      <footer className="border-t border-charcoal-800 px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-gray-500 sm:flex-row"><span className="font-semibold text-gray-300">Checkmate<span className="text-primary">.</span></span><span>HTTP & HTTPS uptime monitoring, made clear.</span><div className="flex gap-4"><Link to="/login" className="hover:text-white">Sign in</Link><Link to="/signup" className="hover:text-white">Create account</Link></div></div></footer>
    </main>
  );
};

export default Landing;
