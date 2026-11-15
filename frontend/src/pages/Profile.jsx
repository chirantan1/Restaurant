import { useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

const inputCls =
  "w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0";
const labelCls =
  "block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2";

const FIELDS = [
  {
    key: "username",
    label: "Username",
    type: "text",
    autoComplete: "username",
    placeholder: "Your display name",
  },
  {
    key: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    key: "phoneNumber",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    key: "address",
    label: "Delivery address",
    type: "textarea",
    autoComplete: "street-address",
    placeholder: "Street, city, postal code",
  },
];

export default function Profile() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    address: user.address?.join(", ") || "",
    phoneNumber: user.phoneNumber || "",
  });
  const [msg, setMsg] = useState("");
  const [msgIsError, setMsgIsError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [pwStep, setPwStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwMsgIsError, setPwMsgIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgIsError(false);
    try {
      await api.put("/user/updateUser", { ...form, address: [form.address] });
      await refreshUser();
      setMsg("Profile updated.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
      setMsgIsError(true);
    }
  };

  const requestOtp = async () => {
    setPwMsg("");
    setPwMsgIsError(false);
    setLoading(true);
    try {
      await api.post("/auth/request-password-otp");
      setPwStep(1);
      setPwMsg("OTP sent to your email. Check your inbox.");
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to send OTP");
      setPwMsgIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwMsgIsError(false);
    setLoading(true);
    try {
      await api.post("/auth/change-password-with-otp", { otp, newPassword });
      setPwMsg("Password changed successfully.");
      setShowPassword(false);
      setPwStep(0);
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to change password");
      setPwMsgIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPassword(false);
    setPwStep(0);
    setOtp("");
    setNewPassword("");
    setPwMsg("");
    setPwMsgIsError(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Header */}
        <header className="border-b border-[#e8e2db] pb-10 mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Account
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Profile &amp;{" "}
              <span className="italic font-normal text-[#8b7e72]">
                security.
              </span>
            </h1>
            <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-xs">
              Keep your details accurate for smooth deliveries.
            </p>
          </div>
        </header>

        {/* ===== PROFILE FORM ===== */}
        <section className="border border-[#e8e2db] bg-white p-6 lg:p-8 mb-10">
          <div className="flex items-baseline justify-between border-b border-[#e8e2db] pb-4 mb-6">
            <h2 className="font-serif text-xl tracking-tight">
              Personal details
            </h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#b8a99c]">
              Editable
            </span>
          </div>

          {msg && (
            <div
              role={msgIsError ? "alert" : "status"}
              className={`mb-5 border-l-[3px] px-4 py-3 text-sm flex items-start gap-3 ${
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

          <form onSubmit={save} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {FIELDS.filter((f) => f.type !== "textarea").map((f) => (
                <div key={f.key}>
                  <label htmlFor={f.key} className={labelCls}>
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    className={inputCls}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            {FIELDS.filter((f) => f.type === "textarea").map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className={labelCls}>
                  {f.label}
                </label>
                <textarea
                  id={f.key}
                  autoComplete={f.autoComplete}
                  className={`${inputCls} resize-none`}
                  placeholder={f.placeholder}
                  rows={2}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-3.5 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
              >
                Save changes
              </button>
            </div>
          </form>
        </section>

        {/* ===== PASSWORD SECTION ===== */}
        <section className="border border-[#e8e2db] bg-white p-6 lg:p-8">
          <div className="flex items-baseline justify-between border-b border-[#e8e2db] pb-4 mb-6">
            <h2 className="font-serif text-xl tracking-tight">Password</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#b8a99c]">
              Verified by email
            </span>
          </div>

          {pwMsg && (
            <div
              role={pwMsgIsError ? "alert" : "status"}
              className={`mb-5 border-l-[3px] px-4 py-3 text-sm flex items-start gap-3 ${
                pwMsgIsError
                  ? "border-[#b03e2e] bg-[#f5ebe8] text-[#7a2a1f]"
                  : "border-[#4a7c4a] bg-[#ecf3ec] text-[#2d522d]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                  pwMsgIsError ? "bg-[#b03e2e]" : "bg-[#4a7c4a]"
                }`}
              />
              <span className="leading-relaxed">{pwMsg}</span>
            </div>
          )}

          {!showPassword ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-[#1e1b1a] font-medium mb-1">
                  Change your password
                </p>
                <p className="text-sm text-[#8b7e72] font-light">
                  We'll verify with a one-time code sent to{" "}
                  <span className="text-[#1e1b1a] font-medium">
                    {user.email}
                  </span>
                  .
                </p>
              </div>
              <button
                onClick={() => setShowPassword(true)}
                className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#d9d2cb] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.02] transition-all duration-200 shrink-0"
              >
                Change password
              </button>
            </div>
          ) : pwStep === 0 ? (
            <div className="space-y-5">
              <p className="text-sm text-[#4a423c] font-light leading-relaxed">
                We'll send a 6-digit code to{" "}
                <span className="text-[#1e1b1a] font-medium">{user.email}</span>
                . Enter it on the next step to set a new password.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={requestOtp}
                  disabled={loading}
                  className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-6 py-3.5 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-1"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending code
                    </span>
                  ) : (
                    "Send code to email"
                  )}
                </button>
                <button
                  onClick={cancelPasswordChange}
                  disabled={loading}
                  className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3.5 border border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a] disabled:opacity-40 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={changePassword} className="space-y-5">
              <div>
                <label htmlFor="otp" className={labelCls}>
                  Verification code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  maxLength={6}
                  className={`${inputCls} tracking-[0.4em] font-mono`}
                />
                <p className="text-[0.7rem] text-[#8b7e72] mt-2">
                  Sent to{" "}
                  <span className="text-[#1e1b1a] font-medium">
                    {user.email}
                  </span>
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className={labelCls}>
                  New password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className={`${inputCls} pr-14`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((s) => !s)}
                    className="absolute right-0 bottom-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#8b7e72] hover:text-[#1e1b1a] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-6 py-3.5 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-1"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Updating
                    </span>
                  ) : (
                    "Update password"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelPasswordChange}
                  disabled={loading}
                  className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3.5 border border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a] disabled:opacity-40 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Footer note */}
        <p className="mt-8 text-center text-[0.7rem] text-[#8b7e72] tracking-wide">
          Need help?{" "}
          <a
            href="/contact"
            className="underline underline-offset-2 hover:text-[#1e1b1a]"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
