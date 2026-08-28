import { useEffect, useState } from "react";
import { Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";
import { getServices, getUptime } from "../../services/monitor";


const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    getServices().catch(() => {
      // The service logs the backend error with its response body above.
    });
    getUptime().catch(() => {
      // The service logs the backend error with its response body above.
    });

    getCurrentUser()
      .then((user) => setFirstName(user.first_name || ""))
      .catch((error) => console.error("[Current user API] Backend error:", error.message));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <main className="min-h-screen bg-charcoal-950 px-6 py-8 text-white sm:px-10">
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">✓</span>
              Checkmate<span className="text-primary-dark">.</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>

          <header className="mb-8 flex flex-col gap-4 border-b border-charcoal-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent-blue">OPERATIONS / TODAY</p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            Good morning{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Here is the health of the services your team owns.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-charcoal-800 bg-charcoal-900 px-3 py-2 text-xs font-medium text-gray-400">
          <Clock className="h-3.5 w-3.5" /> Updated just now
        </div>
          </header>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
