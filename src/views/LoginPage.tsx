import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AUTH_ENABLED } from "../config";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already authenticated — redirect
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!AUTH_ENABLED) {
      // Dev mode — skip auth
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);
    try {
      await signIn(username, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent tracking-tight">REPS</h1>
          <p className="text-sm text-text-secondary mt-1">Fitness Analytics Dashboard</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-xl border border-divider p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-3 py-2 text-sm border border-divider rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent-interactive focus:border-transparent transition"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 text-sm border border-divider rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent-interactive focus:border-transparent transition"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium text-white bg-accent-interactive hover:bg-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {!AUTH_ENABLED && (
            <p className="text-xs text-text-secondary text-center">
              Auth not configured — any credentials will work
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
