import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const inputCls =
  "w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0";
const labelCls =
  "block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2";

const STEPS = [
  { n: 1, label: "Email" },
  { n: 2, label: "Verify" },
];

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {STEPS.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        return (
          <div key={s.n} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 flex items-center justify-center text-[0.65rem] font-semibold border transition-colors duration-200 ${
                  active
                    ? "bg-[#1e1b1a] border-[#1e1b1a] text-[#faf9f7]"
                    : done
                      ? "bg-[#ecf3ec] border-[#4a7c4a] text-[#2d522d]"
                      : "border-[#d9d2cb] text-[#b8a99c]"
                }`}
              >
                {done ? "\u2713" : s.n}
              </span>
              <span
                className={`text-[0.65rem] font-semibold tracking-[0.14em] uppercase ${
                  active || done ? "text-[#1e1b1a]" : "text-[#b8a99c]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  done ? "bg-[#4a7c4a]" : "bg-[#e8e2db]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgIsError, setMsgIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgIsError(false);
    setLoading(true);
    try {
      await api.post("/auth/request-password-otp", { email });
      setMsg("OTP sent to your email. Check your inbox.");
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to send OTP");
      setMsgIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgIsError(false);
    setLoading(true);
    try {
      await api.post("/auth/change-password-with-otp", {
        email,
        otp,
        newPassword,
      });
      navigate("/login", {
        state: { message: "Password changed successfully. Please log in." },
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to change password");
      setMsgIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const resetToEmail = () => {
    setStep(1);
    setMsg("");
    setMsgIsError(false);
    setOtp("");
    setNewPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-81px)] bg-[#faf9f7] text-[#1e1b1a] flex items-start justify-center px-6 py-16 lg:py-24">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Password recovery
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
            Reset your{" "}
            <span className="italic font-normal text-[#8b7e72]">password.</span>
          </h1>
          <p className="text-sm text-[#4a423c] font-light leading-relaxed">
            We'll email you a one-time code to verify it's really you.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* Alert */}
        {msg && (
          <div
            role={msgIsError ? "alert" : "status"}
            className={`mb-6 border-l-[3px] px-4 py-3 text-sm flex items-start gap-3 ${
              msgIsError
                ? "border-[#b03e2e] bg-[#f5ebe8] text-[#7a2a1f]"
                : "border-[#4a7c4a] bg-[#ecf3ec] text-[#2d522d]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                msgIsError ? "bg-[#b03e2e]" : "bg-[#4a7c4a]"
              }`}
            />
            <span className="leading-relaxed">{msg}</span>
          </div>
        )}

        {/* ===== STEP 1 — EMAIL ===== */}
        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending code
                </span>
              ) : (
                "Send code"
              )}
            </button>
          </form>
        ) : (
          /* ===== STEP 2 — OTP + NEW PASSWORD ===== */
          <form onSubmit={changePassword} className="space-y-6" noValidate>
            <div className="border-l-[3px] border-[#e8e2db] bg-[#f5f1ec] px-4 py-3 text-sm text-[#4a423c] font-light leading-relaxed">
              Code sent to{" "}
              <span className="text-[#1e1b1a] font-medium">{email}</span>
            </div>

            <div>
              <label htmlFor="otp" className={labelCls}>
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className={`${inputCls} tracking-[0.4em] font-mono`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className={labelCls}>
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${inputCls} pr-14`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
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
              className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Updating password
                </span>
              ) : (
                "Update password"
              )}
            </button>

            <button
              type="button"
              onClick={resetToEmail}
              disabled={loading}
              className="w-full inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a] disabled:opacity-40 transition-all duration-200"
            >
              Use a different email
            </button>
          </form>
        )}

        {/* Divider + login link */}
        <div className="flex items-center gap-4 my-8">
          <span className="flex-1 h-px bg-[#e8e2db]" />
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[#b8a99c]">
            Remembered it
          </span>
          <span className="flex-1 h-px bg-[#e8e2db]" />
        </div>

        <Link
          to="/login"
          className="w-full inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.02] transition-all duration-200"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
