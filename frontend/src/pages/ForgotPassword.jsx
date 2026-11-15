import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/auth/request-password-otp", { email });
      setMsg("OTP sent to your email. Check your inbox.");
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/auth/change-password-with-otp", {
        email,
        otp,
        newPassword,
      });
      alert("Password changed successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      {msg && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-sm">
          {msg}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={changePassword} className="space-y-4">
          <p className="text-sm text-gray-600">
            OTP sent to <b>{email}</b>
          </p>
          <div>
            <label className="block text-sm mb-1">OTP (from email)</label>
            <input
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              maxLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setMsg("");
            }}
            className="btn-secondary w-full"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-4 text-sm text-center">
        Remembered your password?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Log in
        </span>
      </p>
    </div>
  );
}
