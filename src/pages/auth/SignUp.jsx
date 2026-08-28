import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Activity,
  User,
  LockKeyhole,
} from "lucide-react";

import { signupUser } from "../../services/auth";

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "mt-1 w-full rounded-xl border border-charcoal-800 bg-charcoal-950 py-2.5 text-white outline-none focus:border-primary-dark pl-10 pr-11";

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Check required fields
    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check password confirmation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Terms
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * The backend API currently documents only
       * email and password for registration.
       *
       * Therefore we only send those two fields.
       */
      const data = await signupUser({
        firstName: form.firstName,
        lastName: form.lastName,
        organization: form.organization,
        email: form.email,
        password: form.password,
      });

      console.log("Signup successful:", data);

      // Registration succeeded.
      // Send the user to the login page.
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);

      const backendError = error.response?.data;

      if (backendError?.email) {
        setError(
          Array.isArray(backendError.email)
            ? backendError.email[0]
            : backendError.email
        );
      } else if (backendError?.password) {
        setError(
          Array.isArray(backendError.password)
            ? backendError.password[0]
            : backendError.password
        );
      } else if (backendError?.detail) {
        setError(backendError.detail);
      } else {
        setError("Unable to create your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-charcoal-950 p-0 text-white lg:grid lg:min-h-screen lg:place-items-center">
        <div className="grid min-h-screen w-full lg:w-full lg:min-h-screen lg:grid-cols-2">

          {/* Form Area */}

          <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-6">

            <div className="absolute left-6 right-6 top-5 flex items-center justify-between sm:left-10 sm:right-10">
              <Link
                to="/"
                className="flex items-center gap-2.5 font-bold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-bold">
                  ✓
                </span>

                Checkmate
                <span className="text-primary-dark">.</span>
              </Link>
            </div>

            <div className="mt-9 w-full max-w-sm py-2">

              <p className="text-sm font-bold uppercase tracking-[.16em] text-primary-dark">
                Start your workspace
              </p>

              <h1 className="mt-1.5 text-2xl font-bold sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-1.5 text-sm text-gray-400">
                Start your free 14-day trial. No credit card required.
              </p>

              {/* OAuth buttons */}

              <div className="mt-3 flex justify-center gap-3">

                <button
                  type="button"
                  aria-label="Sign up with Google"
                  className="grid h-10 w-10 place-items-center rounded-full border border-charcoal-700 bg-charcoal-950 hover:border-accent-blue"
                >
                  <BadgeCheck />
                </button>

                <button
                  type="button"
                  aria-label="Sign up with GitHub"
                  className="grid h-10 w-10 place-items-center rounded-full border border-charcoal-700 bg-charcoal-950 hover:border-accent-blue"
                >
                  <ShieldCheck />
                </button>

              </div>

              <div className="my-3 flex items-center gap-3">

                <span className="h-px flex-1 bg-charcoal-800" />

                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  or use email
                </span>

                <span className="h-px flex-1 bg-charcoal-800" />

              </div>

              {/* Signup Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-2.5"
              >

                {/* First + Last Name */}

                <div className="grid gap-2.5 sm:grid-cols-2">

                  <label className="block text-sm font-medium text-gray-300">
                    First name

                    <div className="relative mt-1">

                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={(event) =>
                          updateField("firstName", event.target.value)
                        }
                        placeholder="Sarah"
                        autoComplete="given-name"
                        className={inputClass}
                      />

                    </div>
                  </label>

                  <label className="block text-sm font-medium text-gray-300">
                    Last name

                    <div className="relative mt-1">

                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={(event) =>
                          updateField("lastName", event.target.value)
                        }
                        placeholder="Johnson"
                        autoComplete="family-name"
                        className={inputClass}
                      />

                    </div>
                  </label>

                </div>

                {/* Organization */}

                <label className="block text-sm font-medium text-gray-300">
                  Organization

                  <div className="relative mt-1">

                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                      type="text"
                      name="organization"
                      value={form.organization}
                      onChange={(event) =>
                        updateField("organization", event.target.value)
                      }
                      placeholder="Acme Labs"
                      autoComplete="organization"
                      className={inputClass}
                    />

                  </div>
                </label>

                {/* Email */}

                <label className="block text-sm font-medium text-gray-300">
                  Work email

                  <div className="relative mt-1">

                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="name@company.com"
                      autoComplete="email"
                      className={inputClass}
                    />

                  </div>
                </label>

                {/* Password */}

                <label className="block text-sm font-medium text-gray-300">
                  Password

                  <div className="relative mt-1">

                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputClass}
                    />

                  </div>
                </label>

                {/* Confirm Password */}

                <label className="block text-sm font-medium text-gray-300">
                  Retype password

                  <div className="relative mt-1">

                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputClass}
                    />

                  </div>
                </label>

                {/* Password requirements */}

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">

                  <span
                    className={
                      form.password.length >= 8
                        ? "text-green-500"
                        : ""
                    }
                  >
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                    8+ chars
                  </span>

                  <span
                    className={
                      /[A-Z]/.test(form.password)
                        ? "text-green-500"
                        : ""
                    }
                  >
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                    Uppercase
                  </span>

                  <span
                    className={
                      /[0-9]/.test(form.password)
                        ? "text-green-500"
                        : ""
                    }
                  >
                    <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                    Number
                  </span>

                </div>

                {/* Terms */}

                <label className="flex items-start gap-2 text-sm leading-5 text-gray-400">

                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) =>
                      setAgreed(event.target.checked)
                    }
                    className="mt-0.5 accent-primary-dark"
                  />

                  <span>
                    I agree to the{" "}

                    <a
                      href="#"
                      className="font-medium text-white hover:text-primary-dark"
                    >
                      Terms of Service
                    </a>{" "}

                    and{" "}

                    <a
                      href="#"
                      className="font-medium text-white hover:text-primary-dark"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>

                </label>

                {/* Backend / validation error */}

                {error && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-dark py-2.5 font-bold text-white shadow-glow-blue disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}

                </button>

              </form>

              <p className="mt-3 text-center text-sm text-gray-500">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-white hover:text-primary"
                >
                  Sign in
                </Link>

              </p>

            </div>
          </section>

          {/* Aside section */}

          <aside className="hidden overflow-hidden border-l border-primary-dark bg-charcoal-950 p-14 lg:flex lg:flex-col">

            <div className="absolute h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />

            <div className="relative">

              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary-dark">
                Checkmate workspace
              </p>

              <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight">
                A stronger operating rhythm starts here.
              </h2>

              <p className="mt-8 max-w-sm leading-7 text-gray-400">
                Give your team a shared, useful picture of the services your
                customers rely on.
              </p>

            </div>

            <div className="relative mt-8 rounded-2xl border border-charcoal-700 bg-charcoal-900/80 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold">
                    Workspace pulse
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Your services at a glance
                  </p>

                </div>

                <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-600/10 text-accent-green">
                  <ShieldCheck className="h-5 w-5" />
                </span>

              </div>

              <div className="mt-6 space-y-3">

                {[
                  ["Public API", "Operational"],
                  ["Payment flow", "Operational"],
                  ["Background jobs", "Watching"],
                ].map(([name, status]) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 rounded-xl bg-charcoal-950 px-3 py-3"
                  >
                    <Activity className="h-4 w-4 text-green-500" />

                    <span className="flex-1 text-sm text-gray-300">
                      {name}
                    </span>

                    <span className="text-xs text-gray-500">
                      {status}
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </aside>

        </div>
      </main>
    </>
  );
};

export default SignUp;