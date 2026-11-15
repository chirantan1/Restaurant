import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    userType: "client",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.address.trim() ||
      !form.phoneNumber.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        address: [form.address.trim()],
        phoneNumber: form.phoneNumber.trim(),
        userType: form.userType,
      };

      const result = await register(userData);

      if (!result.success) {
        setError(result.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      }, 1000);
    } catch (err) {
      console.error("Registration form error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0";
  const labelClass =
    "block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2";

  const roleOptions = [
    { value: "client", label: "Customer", hint: "Order food" },
    { value: "vendor", label: "Restaurant", hint: "List your kitchen" },
    { value: "delivery", label: "Delivery", hint: "Deliver orders" },
  ];

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#faf9f7] text-[#1e1b1a] flex items-start justify-center px-6 py-16 lg:py-20">
      <div className="w-full max-w-[520px]">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Get started
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            Create your{" "}
            <span className="italic font-normal text-[#8b7e72]">Feast.</span>{" "}
            account
          </h1>
          <p className="text-sm text-[#4a423c] font-light leading-relaxed">
            A few details and you're ready to order, list, or deliver.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 mb-6 text-sm text-[#7a2a1f] flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b03e2e] mt-2 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="border-l-[3px] border-[#4a7c4a] bg-[#ecf3ec] px-4 py-3 mb-6 text-sm text-[#2d522d] flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c4a] mt-2 shrink-0" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1 — Account */}
          <fieldset className="space-y-5" disabled={loading}>
            <legend className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#b8a99c] mb-4">
              Account
            </legend>

            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your display name"
                className={inputClass}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className={`${inputClass} pr-14`}
                  autoComplete="new-password"
                  required
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
          </fieldset>

          {/* Section 2 — Contact */}
          <fieldset
            className="space-y-5 pt-6 border-t border-[#e8e2db]"
            disabled={loading}
          >
            <legend className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#b8a99c] mb-4">
              Contact &amp; delivery
            </legend>

            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                Phone number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
                autoComplete="tel"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>
                Delivery address
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, city, postal code"
                rows={2}
                className={`${inputClass} resize-none`}
                autoComplete="street-address"
                required
              />
            </div>
          </fieldset>

          {/* Section 3 — Role */}
          <fieldset
            className="pt-6 border-t border-[#e8e2db]"
            disabled={loading}
          >
            <legend className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#b8a99c] mb-4">
              I'm registering as
            </legend>

            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((role) => {
                const active = form.userType === role.value;
                return (
                  <label
                    key={role.value}
                    className={`cursor-pointer border p-4 text-center transition-all duration-200 ${
                      active
                        ? "border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7]"
                        : "border-[#d9d2cb] bg-transparent text-[#1e1b1a] hover:border-[#1e1b1a]"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={role.value}
                      checked={active}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1">
                      {role.label}
                    </span>
                    <span
                      className={`block text-[0.65rem] font-light ${
                        active ? "text-[#faf9f7]/70" : "text-[#8b7e72]"
                      }`}
                    >
                      {role.hint}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        {/* Sign in link */}
        <div className="flex items-center gap-4 my-8">
          <span className="flex-1 h-px bg-[#e8e2db]" />
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[#b8a99c]">
            Already a member
          </span>
          <span className="flex-1 h-px bg-[#e8e2db]" />
        </div>

        <Link
          to="/login"
          className="w-full inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.02] transition-all duration-200"
        >
          Sign in instead
        </Link>

        <p className="mt-8 text-center text-[0.7rem] text-[#8b7e72] tracking-wide">
          By creating an account, you agree to our{" "}
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
