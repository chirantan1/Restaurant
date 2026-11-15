import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.userType === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#faf9f7] text-[#1e1b1a] flex items-start justify-center px-6 py-16 lg:py-24">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Welcome back
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            Sign in to{" "}
            <span className="italic font-normal text-[#8b7e72]">Feast.</span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light leading-relaxed">
            Access your orders, saved restaurants, and delivery preferences.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 mb-6 text-sm text-[#7a2a1f] flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b03e2e] mt-2 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a]"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-[#8b7e72] hover:text-[#1e1b1a] transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 pr-14 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-0 bottom-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#8b7e72] hover:text-[#1e1b1a] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Signing in
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <span className="flex-1 h-px bg-[#e8e2db]" />
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[#b8a99c]">
            New here
          </span>
          <span className="flex-1 h-px bg-[#e8e2db]" />
        </div>

        {/* Register CTA */}
        <Link
          to="/register"
          className="w-full inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.02] transition-all duration-200"
        >
          Create an account
        </Link>

        {/* Legal */}
        <p className="mt-8 text-center text-[0.7rem] text-[#8b7e72] tracking-wide">
          By signing in, you agree to our{" "}
          <Link
            to="/terms"
            className="underline underline-offset-2 hover:text-[#1e1b1a]"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 hover:text-[#1e1b1a]"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
