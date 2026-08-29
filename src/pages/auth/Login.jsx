import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { loginUser } from "../../services/auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("accessToken");
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]); // Runs after render

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Basic frontend validation
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log("Login successful:", data);

      // Store JWT tokens for this browser session
      sessionStorage.setItem("accessToken", data.access);
      sessionStorage.setItem("refreshToken", data.refresh);

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      const backendError = error.response?.data;

      if (backendError?.detail) {
        setError(backendError.detail);
      } else if (backendError?.email) {
        setError(backendError.email[0]);
      } else if (backendError?.password) {
        setError(backendError.password[0]);
      } else {
        setError("Unable to sign in. Please check your credentials.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-charcoal-950 p-0 text-white lg:grid lg:min-h-screen lg:place-items-center">
        <div className="grid min-h-screen w-full lg:min-h-screen lg:w-full lg:grid-cols-2">

          {/* Form Area */}

          <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16 lg:py-8">

            <div className="absolute left-6 right-6 top-5 flex items-center justify-between sm:left-10 sm:right-10">
              <Link to="/" className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-bold">
                  ✓
                </span>

                Checkmate<span className="text-primary-dark">.</span>
              </Link>
            </div>

            <div className="w-full max-w-sm mt-9">

              <p className="text-sm font-bold uppercase tracking-[.16em] text-primary">
                Welcome back
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Sign in to Checkmate
              </h1>

              <p className="mt-2 text-gray-400">
                Continue to your uptime monitoring workspace.
              </p>

              <div className="mt-6 flex justify-center gap-3">

                <button
                  type="button"
                  aria-label="Continue with Google"
                  className="grid h-11 w-11 place-items-center rounded-full border border-charcoal-700 bg-charcoal-950 hover:border-accent-blue"
                >
                  <BadgeCheck />
                </button>

                <button
                  type="button"
                  aria-label="Continue with GitHub"
                  className="grid h-11 w-11 place-items-center rounded-full border border-charcoal-700 bg-charcoal-950 hover:border-accent-blue"
                >
                  <ShieldCheck />
                </button>

              </div>

              <div className="my-5 flex items-center gap-3">

                <span className="h-px flex-1 bg-charcoal-800" />

                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  
                </span>

                <span className="h-px flex-1 bg-charcoal-800" />

              </div>

              {/* LOGIN FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* EMAIL */}

                <label className="block text-sm font-medium text-gray-300">
                  Email address

                  <div className="relative mt-1.5">

                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-charcoal-800 bg-charcoal-950 py-2.5 pl-10 pr-4 text-white outline-none focus:border-accent-blue"
                    />

                  </div>
                </label>

                {/* PASSWORD */}

                <label className="block text-sm font-medium text-gray-300">
                  Password

                  <div className="relative mt-1.5">

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-charcoal-800 bg-charcoal-950 px-4 py-2.5 text-white outline-none focus:border-accent-blue"
                    />

                  </div>
                </label>

                {/* REMEMBER / FORGOT */}

                <div className="flex items-center justify-between">

                  <label className="flex items-center gap-2 text-sm text-gray-400">

                    <input
                      type="checkbox"
                      className="accent-accent-blue"
                    />

                    Remember me

                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* ERROR */}

                {error && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-dark py-3 font-bold text-white shadow-glow-blue disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}

                </button>

              </form>

              <p className="mt-5 text-center text-sm text-gray-500">
                New to Checkmate?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-white hover:text-primary"
                >
                  Create an account
                </Link>

              </p>

            </div>
          </section>

          {/* Supporting brand Area */}

          <aside className="hidden border-l border-primary lg:flex lg:flex-col lg:p-14">

            <div className="absolute h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />

            <div className="relative z-10 max-w-sm">

              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary-dark">
                Checkmate workspace
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-tight">
                Your work is easier when the signal is clear.
              </h2>

              <p className="mt-5 mb-7 max-w-sm leading-7 text-gray-400">
                Bring services, deployments and the decisions around them into
                one focused operating rhythm.
              </p>

            </div>

            <div className="relative rounded-2xl border border-charcoal-700 bg-charcoal-950/70 p-5">

              <div className="flex items-center justify-between">

                <span className="font-semibold">
                  Workspace pulse
                </span>

                <span className="text-xs font-bold text-green-500">
                  ● Steady
                </span>

              </div>

              <div className="mt-6 flex h-14 items-end gap-1.5">

                {[40, 55, 48, 66, 60, 72, 68, 85, 80, 94].map(
                  (height, index) => (
                    <span
                      key={index}
                      style={{ height: height + "%" }}
                      className={
                        "flex-1 rounded-sm " +
                        (index > 7
                          ? "bg-primary-dark"
                          : "bg-charcoal-700")
                      }
                    />
                  ),
                )}

              </div>

            </div>

          </aside>

        </div>
      </main>
    </>
  );
};

export default Login;